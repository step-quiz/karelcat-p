// ════════════════════════════════════════════════════════
// execution.js — Control d'execució + execAction
// ════════════════════════════════════════════════════════

// ── Compara l'estat actual amb el goal (B.6) ─────────────
// Ignora la direcció final de Karel: l'important és on ha arribat
// i com ha quedat el món (perles, roques).
function compareGoal(goalCSV) {
  const goal    = K.parseCSV(goalCSV);
  const current = K.parseCSV(K.currentStateToCSV());

  // Dimensions han de coincidir
  if (goal.rows !== current.rows || goal.cols !== current.cols) return false;

  // Posició final de Karel (sense direcció)
  if (goal.kStart.x !== current.kStart.x) return false;
  if (goal.kStart.y !== current.kStart.y) return false;

  // Contingut de cada casella
  for (let r = 0; r < goal.rows; r++)
    for (let c = 0; c < goal.cols; c++)
      if (goal.grid[r][c] !== current.grid[r][c]) return false;

  return true;
}

// Emet el resultat cap al pare si estem en mode exercici
function notifyGoalResult(success) {
  if (!K.goalCSV || !K.goalId) return;
  window.parent.postMessage(
    { type: 'karel-result', goalId: K.goalId, success },
    K.parentOrigin
  );
}


// ── Executa una acció individual ──

function execAction(step) {
  const S = K.state;

  // Error de l'intèrpret (iteració infinita, recursió, proc desconegut)
  if (step.type === 'error') {
    K.logError(`❌ ${step.msg}`, step.code, step.line);
    K.markErrorLine(step.line);
    K.setStateUI('error');
    stopProgram();
    return false;
  }

  const { cmd, line } = step;
  K.highlightLine(line);
  S.stepCount++;

  const action = K.lang.CMD_TO_ACTION[cmd] ?? cmd;
  const { x: fx, y: fy } = K.front();

  function errStop(msgKey) {
    K.logError(`❌ ${cmd} (${K.t('log.line')} ${line}): ${K.t('err.' + msgKey)}`, msgKey, line);
    K.markErrorLine(line);
    K.setStateUI('error');
    stopProgram();
    return false;
  }

  switch (action) {
    case 'move':
      if (K.isRock(fx, fy)) return errStop('rock');
      S.karel.x = fx; S.karel.y = fy;
      K.log(`${cmd} → (${S.karel.x}, ${S.karel.y})`, 'inf');
      break;
    case 'turn-right':
      S.karel.dir = (S.karel.dir + 1) % 4;
      K.log(`${cmd} → ${K.DIRS[S.karel.dir].arrow}`, 'cmd');
      break;
    case 'turn-left':
      S.karel.dir = (S.karel.dir + 3) % 4;
      K.log(`${cmd} → ${K.DIRS[S.karel.dir].arrow}`, 'cmd');
      break;
    case 'turn-around':
      S.karel.dir = (S.karel.dir + 2) % 4;
      K.log(`${cmd} → ${K.DIRS[S.karel.dir].arrow}`, 'cmd');
      break;
    case 'grab':
      if (K.getCell(S.karel.x, S.karel.y) !== 'A') return errStop('no_pearl');
      K.setCell(S.karel.x, S.karel.y, '.'); S.karel.motxilla++;
      K.log(`${cmd} ⚪ → ${S.karel.motxilla}`, 'ok');
      break;
    case 'drop':
      if (S.karel.motxilla <= 0) return errStop('bag_empty');
      if (K.getCell(S.karel.x, S.karel.y) === 'A') {
        K.log(`⚠ ${cmd}: ja hi ha una perla aquí — la teva es conserva`, 'inf');
        break;
      }
      K.setCell(S.karel.x, S.karel.y, 'A'); S.karel.motxilla--;
      K.log(`${cmd} ⚪ → ${S.karel.motxilla}`, 'ok');
      break;
  }

  K.renderWorld();
  K.updateStatus();
  return true;
}


// ── Build + Run / Step / Stop ──

function buildInterpreter() {
  const S = K.state;
  const ast = K.parseCode(document.getElementById('code-editor')?.value || '');
  if (!ast) return null;
  S.procs = {}; S.callDepth = 0; S._break = false; S.stepCount = 0;
  for (const node of ast) if (node.type === 'proc') S.procs[node.name] = node.body;
  return K.runStmts(ast.filter(n => n.type !== 'proc'));
}

// Emet al pare que cal esborrar el banner de feedback (B.6)
function notifyClearFeedback() {
  if (!K.goalId) return;
  window.parent.postMessage({ type: 'karel-clear', goalId: K.goalId }, K.parentOrigin);
}

function runProgram() {
  const S = K.state;
  if (S.running) return;
  notifyClearFeedback(); // ← B.6
  // Sempre partim de l'estat inicial: el codi ha de ser la solució completa
  stopProgram();
  S.world.grid = S.worldInit.map(r => [...r]);
  S.karel = { ...S.karelInit };
  K.renderWorldFull();
  K.updateStatus();
  const gen = buildInterpreter();
  if (!gen) return;
  // Cada execució nova és pàgina en blanc
  const logEl = document.getElementById('log');
  if (logEl) logEl.innerHTML = '';
  K.clearLineMarks();
  S.interpreter = gen; S.stepMode = false; S.running = true;
  K.setStateUI('running');
  K.log(K.t('log.running'), 'ok');
  S.tickTimer = setTimeout(tick, 800);
}

function stepProgram() {
  const S = K.state;
  if (!S.running && !S.interpreter) {
    notifyClearFeedback(); // ← B.6
    // Sempre partim de l'estat inicial: el codi ha de ser la solució completa
    S.world.grid = S.worldInit.map(r => [...r]);
    S.karel = { ...S.karelInit };
    K.renderWorldFull();
    K.updateStatus();
    const gen = buildInterpreter();
    if (!gen) return;
    K.clearLineMarks();
    S.interpreter = gen; S.running = true; S.stepMode = true;
    K.setStateUI('step');
    K.log(K.t('log.step_mode'), 'ok');
  }
  doStep();
}

function doStep() {
  const S = K.state;
  if (!S.interpreter) return;
  const res = S.interpreter.next();
  if (res.done) {
    K.log(K.t('log.done'), 'ok');
    K.clearLineMarks();
    S.running = false; S.interpreter = null;
    K.setStateUI('idle');
    notifyGoalResult(compareGoal(K.goalCSV)); // ← B.6
    return;
  }
  execAction(res.value);
}

function tick() {
  const S = K.state;
  if (!S.running || S.stepMode || !S.interpreter) return;
  const res = S.interpreter.next();
  if (res.done) {
    K.log(K.t('log.done'), 'ok');
    K.clearLineMarks();
    S.running = false; S.interpreter = null;
    K.setStateUI('idle');
    notifyGoalResult(compareGoal(K.goalCSV)); // ← B.6
    return;
  }
  const ok = execAction(res.value);
  if (ok !== false) S.tickTimer = setTimeout(tick, S.stepDelay);
}

function stopProgram() {
  const S  = K.state;
  const was = S.running || S.stepMode;
  S.running = false; S.stepMode = false; S.interpreter = null;
  if (S.tickTimer) { clearTimeout(S.tickTimer); S.tickTimer = null; }
  if (was) { K.clearLineMarks(); K.setStateUI('idle'); }
}

function resetKarel() {
  const S = K.state;
  notifyClearFeedback(); // ← B.6
  stopProgram();
  S.world.grid = S.worldInit.map(r => [...r]);
  S.karel = { ...S.karelInit };
  K.clearLineMarks();
  K.renderWorldFull();
  K.updateStatus();
  K.setStateUI('idle');
  K.log(K.t('log.reset'), 'dim');
}


// ── Exporta ──

K.execAction   = execAction;
K.runProgram   = runProgram;
K.stepProgram  = stepProgram;
K.stopProgram  = stopProgram;
K.resetKarel   = resetKarel;

// Globals per a HTML onclick
window.runProgram  = runProgram;
window.stepProgram = stepProgram;
window.stopProgram = stopProgram;
window.resetKarel  = resetKarel;
