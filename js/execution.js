// ════════════════════════════════════════════════════════
// execution.js — Control d'execució, accions i execució sense interfície
//
//   applyCommand(action)  — aplica UNA ordre a K.state (pura, sense DOM)
//   execAction(step)      — versió amb interfície: log, errors, render
//   runProgram / stepProgram / stopProgram / resetKarel — botons
//   runHeadless({...})    — executa un programa sencer en un altre món
//                           sense tocar la pantalla (tests i «Comprova
//                           tots els mons»). Deixa K.state tal com era.
//   checkAllWorlds()      — executa el codi de l'editor a tots els mons
//                           d'un repte i en comunica el resultat al curs
// ════════════════════════════════════════════════════════

function _editorCode() {
  return (typeof document !== 'undefined' && document.getElementById('code-editor')?.value) || '';
}


// ── Comunicació amb la pàgina del curs (iframe → pare) ───
// Tots els missatges porten l'empremta del codi (codeHash): així la pàgina
// del curs sap si un món superat ho va ser amb el codi que hi ha ara.

function _postToParent(msg) {
  if (!K.goalId) return;
  try { window.parent.postMessage(msg, K.parentOrigin); } catch (e) { /* sense pare */ }
}

function notifyGoalResult(success, isError) {
  if (!K.goalCSV) return;
  _postToParent({ type: 'karel-result', goalId: K.goalId, success: !!success,
                  error: !!isError, codeHash: K.codeHash(_editorCode()) });
}

function notifyClearFeedback() {
  _postToParent({ type: 'karel-clear', goalId: K.goalId, codeHash: K.codeHash(_editorCode()) });
}

function notifyReady() {
  _postToParent({ type: 'karel-ready', goalId: K.goalId, codeHash: K.codeHash(_editorCode()) });
}


// ── Aplica una ordre a l'estat (sense interfície) ────────
// Retorna {} si tot va bé, { err: codi } si l'ordre és impossible,
// o { warn: codi } si s'ha pogut fer però mereix un avís.

function applyCommand(action) {
  const S = K.state;
  const { x: fx, y: fy } = K.front();
  switch (action) {
    case 'move':
      if (K.isRock(fx, fy)) return { err: 'rock' };
      S.karel.x = fx; S.karel.y = fy;
      return {};
    case 'turn-right':  S.karel.dir = (S.karel.dir + 1) % 4; return {};
    case 'turn-left':   S.karel.dir = (S.karel.dir + 3) % 4; return {};
    case 'turn-around': S.karel.dir = (S.karel.dir + 2) % 4; return {};
    case 'grab':
      if (K.getCell(S.karel.x, S.karel.y) !== 'A') return { err: 'no_pearl' };
      K.setCell(S.karel.x, S.karel.y, '.');
      S.karel.motxilla++;
      return {};
    case 'drop':
      if (S.karel.motxilla <= 0) return { err: 'bag_empty' };
      if (K.getCell(S.karel.x, S.karel.y) === 'A') return { warn: 'drop_occupied' };
      K.setCell(S.karel.x, S.karel.y, 'A');
      S.karel.motxilla--;
      return {};
  }
  return {};
}


// ── Executa una acció individual (amb interfície) ────────

function _runtimeError(msg, code, line) {
  // Primer aturem (stopProgram neteja les marques), després marquem l'error
  stopProgram();
  K.logError(msg, code, line);
  K.markErrorLine(line);
  K.setStateUI('error');
  notifyGoalResult(false, true);
  return false;
}

function execAction(step) {
  const S = K.state;

  // Error de l'intèrpret (iteració infinita, recursió, proc desconegut)
  if (step.type === 'error') return _runtimeError(`❌ ${step.msg}`, step.code, step.line);

  const { cmd, line } = step;
  K.highlightLine(line);
  S.stepCount++;

  const action = K.lang.CMD_TO_ACTION[cmd] ?? cmd;
  const res = applyCommand(action);
  if (res.err) return _runtimeError(`❌ ${cmd} (${K.t('log.line')} ${line}): ${K.t('err.' + res.err)}`, res.err, line);

  if (res.warn)                                  K.log(K.tf('log.' + res.warn, { cmd }), 'inf');
  else if (action === 'move')                    K.log(`${cmd} → (${S.karel.x}, ${S.karel.y})`, 'inf');
  else if (action === 'grab' || action === 'drop') K.log(`${cmd} ⚪ → ${S.karel.motxilla}`, 'ok');
  else                                           K.log(`${cmd} → ${K.DIRS[S.karel.dir].arrow}`, 'cmd');

  K.renderWorld();
  K.updateStatus();
  return true;
}


// ── Build + Run / Step / Stop ──

function buildInterpreter() {
  const S = K.state;
  const ast = K.parseCode(_editorCode());
  if (!ast) return null;
  S.procs = {}; S.callDepth = 0; S._break = false; S.stepCount = 0;
  for (const node of ast) if (node.type === 'proc') S.procs[node.name] = node.body;
  return K.runStmts(ast.filter(n => n.type !== 'proc'));
}

// Torna el món i en Karel a l'estat inicial i ho repinta
function restoreInitialWorld() {
  const S = K.state;
  if (K.goalView) K.goalView.diff = null;       // les diferències eren de l'intent anterior
  S.world.grid = S.worldInit.map(r => [...r]);
  S.karel = { ...S.karelInit };
  K.clearLineMarks();
  K.renderWorldFull();
  K.updateStatus();
}

function _clearLog() {
  const logEl = document.getElementById('log');
  if (logEl) logEl.innerHTML = '';
}

function runProgram() {
  const S = K.state;
  if (S.running) return;
  notifyClearFeedback();
  // Sempre partim de l'estat inicial: el codi ha de ser la solució completa
  stopProgram();
  restoreInitialWorld();
  const gen = buildInterpreter();
  if (!gen) return;
  // Cada execució nova és pàgina en blanc
  _clearLog();
  K.clearLineMarks();
  S.interpreter = gen; S.stepMode = false; S.running = true;
  K.setStateUI('running');
  K.log(K.t('log.running'), 'ok');
  S.tickTimer = setTimeout(tick, 800);
}

function stepProgram() {
  const S = K.state;
  // Si s'està executant de manera contínua, «Pas» fa una pausa
  if (S.running && !S.stepMode) {
    if (S.tickTimer) { clearTimeout(S.tickTimer); S.tickTimer = null; }
    S.stepMode = true;
    K.setStateUI('step');
    return;
  }
  if (!S.running && !S.interpreter) {
    notifyClearFeedback();
    restoreInitialWorld();
    const gen = buildInterpreter();
    if (!gen) return;
    K.clearLineMarks();
    S.interpreter = gen; S.running = true; S.stepMode = true;
    K.setStateUI('step');
    K.log(K.t('log.step_mode'), 'ok');
  }
  doStep();
}

// Des del mode pas a pas, continua l'execució contínua
function continueProgram() {
  const S = K.state;
  if (!S.running || !S.stepMode || !S.interpreter) return;
  S.stepMode = false;
  K.setStateUI('running');
  S.tickTimer = setTimeout(tick, S.stepDelay);
}

function _finishProgram() {
  const S = K.state;
  K.log(K.t('log.done'), 'ok');
  K.clearLineMarks();
  S.running = false; S.interpreter = null;
  K.setStateUI('idle');
  const passed = K.compareGoal(K.goalCSV);
  if (K.goalCSV && !passed && K.showGoalDiff) K.showGoalDiff(K.goalCSV);
  notifyGoalResult(passed);
}

function doStep() {
  const S = K.state;
  if (!S.interpreter) return;
  const res = S.interpreter.next();
  if (res.done) return _finishProgram();
  execAction(res.value);
}

function tick() {
  const S = K.state;
  if (!S.running || S.stepMode || !S.interpreter) return;
  const res = S.interpreter.next();
  if (res.done) return _finishProgram();
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
  notifyClearFeedback();
  stopProgram();
  restoreInitialWorld();
  K.setStateUI('idle');
  K.log(K.t('log.reset'), 'dim');
}


// ── Execució sense interfície ────────────────────────────
// Executa `code` al món `map` (amb `bag` perles a la motxilla) fins al final,
// de manera síncrona i sense tocar la pantalla. Si es passa `goal`, diu si
// s'ha complert. Retorna:
//   { ok:true,  passed, steps, finalCSV, bag }
//   { ok:false, syntax?, error, message, line, steps, passed:false }
// IMPORTANT: no cridar-la mentre un programa s'executa amb animació
// (comparteixen K.state); primer cal stopProgram().

function runHeadless({ map, code, bag = 0, goal = '', maxSteps = 100000 }) {
  const S = K.state;
  const keys  = ['world', 'worldInit', 'karel', 'karelInit', 'procs', 'callDepth', '_break', 'stepCount'];
  const saved = {};
  for (const k of keys) saved[k] = S[k];
  try {
    const w = K.parseCSV(map);
    S.world     = { grid: w.grid, rows: w.rows, cols: w.cols };
    S.worldInit = w.grid.map(r => [...r]);
    S.karel     = { ...w.kStart, motxilla: bag };
    S.karelInit = { ...S.karel };

    let ast;
    try {
      ast = K.parseProgram(code);
    } catch (e) {
      return { ok: false, syntax: true, error: e.code || 'syntax', message: e.message,
               line: e.errorLine ?? null, steps: 0, passed: false };
    }

    S.procs = {}; S.callDepth = 0; S._break = false; S.stepCount = 0;
    for (const n of ast) if (n.type === 'proc') S.procs[n.name] = n.body;
    const gen = K.runStmts(ast.filter(n => n.type !== 'proc'));

    let steps = 0;
    const fail = (error, message, line) =>
      ({ ok: false, error, message, line, steps, passed: false, finalCSV: K.currentStateToCSV() });

    for (;;) {
      const r = gen.next();
      if (r.done) break;
      const st = r.value;
      if (st.type === 'error') return fail(st.code, st.msg, st.line);
      const res = applyCommand(K.lang.CMD_TO_ACTION[st.cmd] ?? st.cmd);
      if (res.err) return fail(res.err, K.t('err.' + res.err), st.line);
      if (++steps > maxSteps) return fail('too_long', K.t('err.too_long'), st.line);
    }
    return { ok: true, steps, passed: goal ? K.compareGoal(goal) : null,
             finalCSV: K.currentStateToCSV(), bag: S.karel.motxilla };
  } finally {
    Object.assign(S, saved);
  }
}


// ── «Comprova tots els mons» (reptes amb diversos mons) ──
// K.worlds = [{ map, goal, bag, goalId }] ve de la URL (paràmetre worlds).

function checkAllWorlds() {
  const worlds = K.worlds || [];
  if (!worlds.length) return;
  stopProgram();
  restoreInitialWorld();
  _clearLog();
  K.setStateUI('idle');

  const code = _editorCode();
  if (!K.parseCode(code)) return;          // error de sintaxi: es mostra com sempre

  K.log(K.t('log.check_all'), 'ok');
  const hash = K.codeHash(code);
  let allOk = true;
  worlds.forEach((w, i) => {
    const r = runHeadless({ map: w.map, code, bag: w.bag || 0, goal: w.goal });
    const passed = r.ok && r.passed;
    if (!passed) allOk = false;
    if (r.ok) K.log(K.tf(passed ? 'log.world_ok' : 'log.world_fail', { i: i + 1 }), passed ? 'ok' : 'err');
    else      K.log(K.tf('log.world_err', { i: i + 1, n: r.line ?? '?', msg: r.message }), 'err');
    if (w.goalId) {
      try {
        window.parent.postMessage({ type: 'karel-result', goalId: w.goalId, success: passed,
                                    error: !r.ok, codeHash: hash }, K.parentOrigin);
      } catch (e) { /* sense pare */ }
    }
  });
  if (allOk) K.log(K.t('log.all_ok'), 'ok');
}


// ── Exporta ──

K.applyCommand        = applyCommand;
K.execAction          = execAction;
K.runProgram          = runProgram;
K.stepProgram         = stepProgram;
K.continueProgram     = continueProgram;
K.stopProgram         = stopProgram;
K.resetKarel          = resetKarel;
K.restoreInitialWorld = restoreInitialWorld;
K.runHeadless         = runHeadless;
K.checkAllWorlds      = checkAllWorlds;
K.notifyClearFeedback = notifyClearFeedback;
K.notifyReady         = notifyReady;

// Globals per a HTML onclick
if (typeof window !== 'undefined') {
  window.runProgram     = runProgram;
  window.stepProgram    = stepProgram;
  window.stopProgram    = stopProgram;
  window.resetKarel     = resetKarel;
  window.checkAllWorlds = checkAllWorlds;
}
