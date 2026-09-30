// ════════════════════════════════════════════════════════
// renderer.js — Renderitzat diferencial + auto-escala
// ════════════════════════════════════════════════════════

let _renderedSnapshot = null;
let _lastCellSize     = 0;

// ── Capa de l'objectiu ──────────────────────────────────
// K.goalView (el crea initGoalView) guarda què es dibuixa per sobre del món:
//   goals : alternatives de l'objectiu (parseGoal)
//   show  : el botó «🎯 Objectiu» és actiu → perles i en Karel de l'objectiu
//           es dibuixen transparents, i les perles que hi sobren porten una ✕
//   alt   : quina alternativa es mostra (si n'hi ha més d'una)
//   diff  : després d'un intent que no arriba a l'objectiu, les diferències
//           (goalDiff): les caselles diferents es marquen en vermell
K.goalView = null;

function _viewGoal() {
  const v = K.goalView;
  if (!v) return null;
  const g = v.diff ? v.diff.goal : (v.show ? v.goals[v.alt] : null);
  const S = K.state;
  return (g && g.rows === S.world.rows && g.cols === S.world.cols) ? g : null;
}

// Codi curt que descriu què cal dibuixar per sobre d'una casella
function _overlay(col, row) {
  const g = _viewGoal();
  if (!g) return '';
  const v = K.goalView, S = K.state;
  const isDiff = !!v.diff && v.diff.cellSet.has(col + ',' + row);
  let code = isDiff ? 'd' : '';
  if (g.grid[row][col] === 'A' && S.world.grid[row][col] !== 'A' && (v.show || isDiff)) code += 'p';
  if (g.grid[row][col] !== 'A' && S.world.grid[row][col] === 'A' && (v.show || isDiff)) code += 'x';
  const k = g.karel;
  const karelHere = S.karel.x === col && S.karel.y === row;
  if (k && k.x === col && k.y === row && !karelHere && (v.show || (v.diff && v.diff.karelPos))) code += 'k' + k.dir;
  return code;
}

function calcCellSize() {
  const area = document.getElementById('world-area');
  if (!area) return 36;
  const S = K.state;
  const pad = 52, statusH = 40;
  const byW = Math.floor((area.clientWidth  - pad - (S.world.cols + 1) * 2) / S.world.cols);
  const byH = Math.floor((area.clientHeight - pad - statusH - (S.world.rows + 1) * 2) / S.world.rows);
  return Math.max(18, Math.min(56, byW, byH));
}

function _cellKey(col, row) {
  const S = K.state;
  const ov = '|' + _overlay(col, row);
  if (S.karel.x === col && S.karel.y === row) return 'K' + S.karel.dir + S.world.grid[row][col] + ov;
  return S.world.grid[row][col] + ov;
}

function _applyCellContent(div, col, row, fs) {
  const S = K.state;
  div.className = 'cell';
  div.style.fontSize = fs;
  if (S.karel.x === col && S.karel.y === row) {
    const hasPearl = S.world.grid[row][col] === 'A';
    div.classList.add('c-k');
    if (hasPearl) div.classList.add('c-ka');
    div.innerHTML = K.KAREL_ASSETS.MEDUSA
      + (hasPearl ? `<span class="pearl-badge">${K.KAREL_ASSETS.PEARL}</span>` : '');
    const svg = div.querySelector('.karel-entity');
    if (svg) svg.setAttribute('data-dir', K.DIRS[S.karel.dir].dataDir);
  } else {
    const c = S.world.grid[row][col];
    if      (c === 'P') { div.classList.add('c-p'); div.innerHTML = K.KAREL_ASSETS.ROCK; }
    else if (c === 'A') { div.classList.add('c-a'); div.innerHTML = K.KAREL_ASSETS.PEARL; }
    else                { div.classList.add('c-e'); div.innerHTML = ''; }
  }

  // Capa de l'objectiu (transparent) i diferències (vora vermella)
  const ov = _overlay(col, row);
  if (!ov) return;
  if (ov.includes('d')) div.classList.add('cell-diff');
  if (ov.includes('p')) {
    div.insertAdjacentHTML('beforeend', `<span class="ghost ghost-pearl">${K.KAREL_ASSETS.PEARL}</span>`);
  }
  if (ov.includes('x')) {
    div.insertAdjacentHTML('beforeend', '<span class="ghost ghost-x" aria-hidden="true">✕</span>');
  }
  const km = ov.match(/k(\d)/);
  if (km) {
    div.insertAdjacentHTML('beforeend', `<span class="ghost ghost-karel">${K.KAREL_ASSETS.MEDUSA}</span>`);
    const svg = div.querySelector('.ghost-karel .karel-entity');
    if (svg) svg.setAttribute('data-dir', K.DIRS[+km[1]].dataDir);
  }
}

function renderWorld() {
  const S    = K.state;
  const size = calcCellSize();
  const fs   = Math.round(size * 0.52) + 'px';
  document.documentElement.style.setProperty('--cell-size', size + 'px');
  const g = document.getElementById('world-grid');
  if (!g) return;
  g.style.gridTemplateColumns = `repeat(${S.world.cols}, ${size}px)`;

  const needsFullRebuild = !_renderedSnapshot
    || _renderedSnapshot.rows !== S.world.rows
    || _renderedSnapshot.cols !== S.world.cols;

  if (needsFullRebuild) {
    g.innerHTML = '';
    for (let row = 0; row < S.world.rows; row++) {
      for (let col = 0; col < S.world.cols; col++) {
        const div = document.createElement('div');
        div.dataset.col = col;
        div.dataset.row = row;
        _applyCellContent(div, col, row, fs);
        g.appendChild(div);
      }
    }
  } else {
    const children = g.children;
    for (let row = 0; row < S.world.rows; row++) {
      for (let col = 0; col < S.world.cols; col++) {
        const newKey = _cellKey(col, row);
        const oldKey = _renderedSnapshot.keys[row * S.world.cols + col];
        if (newKey !== oldKey || size !== _lastCellSize) {
          const div = children[row * S.world.cols + col];
          if (div) _applyCellContent(div, col, row, fs);
        }
      }
    }
  }

  // Desa snapshot
  const keys = [];
  for (let row = 0; row < S.world.rows; row++) {
    for (let col = 0; col < S.world.cols; col++) {
      keys.push(_cellKey(col, row));
    }
  }
  _renderedSnapshot = { rows: S.world.rows, cols: S.world.cols, keys };
  _lastCellSize = size;
}

function renderWorldFull() {
  _renderedSnapshot = null;
  renderWorld();
}

// ── Objectiu: inicialització, botó i diferències ─────────

function initGoalView(goalStr) {
  const goals = goalStr ? K.parseGoal(goalStr) : [];
  K.goalView = goals.length ? { goals, show: false, alt: 0, diff: null } : null;
  return K.goalView;
}

// Botó «🎯 Objectiu»: apagat → alternativa 1 → (alternativa 2 → …) → apagat
function cycleGoalView() {
  const v = K.goalView;
  if (!v) return;
  if (!v.show) { v.show = true; v.alt = 0; }
  else if (v.alt < v.goals.length - 1) v.alt++;
  else v.show = false;
  renderWorldFull();
  updateGoalButton();
}

function updateGoalButton() {
  const b = document.getElementById('btn-goal');
  const v = K.goalView;
  if (!b || !v) return;
  const n = v.goals.length;
  b.classList.toggle('active', v.show);
  b.textContent = K.t('ui.goal') + (v.show && n > 1 ? ` ${v.alt + 1}/${n}` : '');
  b.title = K.t(n > 1 ? 'ui.goal_title_alts' : 'ui.goal_title');
  b.setAttribute('aria-pressed', v.show ? 'true' : 'false');
}

// Després d'un intent que no arriba a l'objectiu: marca les diferències i les explica
function showGoalDiff(goalStr) {
  const v = K.goalView;
  const d = K.goalDiff(goalStr);
  if (!v || !d || d.total === 0) return;
  d.cellSet = new Set(d.cells.map(c => c.x + ',' + c.y));
  if (d.karelPos) d.cellSet.add(d.goal.karel.x + ',' + d.goal.karel.y);   // on hauria d'acabar
  if (d.karelDir) d.cellSet.add(K.state.karel.x + ',' + K.state.karel.y);
  v.diff = d;
  renderWorldFull();

  const missing = d.cells.filter(c => c.want === 'A').length;
  const extra   = d.cells.filter(c => c.got === 'A').length;
  K.log(K.t('log.diff_title'), 'err');
  if (missing) K.log(K.tf(missing === 1 ? 'log.diff_missing_1' : 'log.diff_missing', { n: missing }), 'err');
  if (extra)   K.log(K.tf(extra === 1 ? 'log.diff_extra_1' : 'log.diff_extra', { n: extra }), 'err');
  if (d.karelPos) K.log(K.t('log.diff_karel'), 'err');
  if (d.karelDir) K.log(K.tf('log.diff_dir', { dir: K.t('dir.' + d.goal.karel.dir) }), 'err');
  if (d.bag) K.log(K.tf('log.diff_bag', { want: d.bag.want, got: d.bag.got }), 'err');
}

function clearGoalDiff() {
  if (K.goalView && K.goalView.diff) {
    K.goalView.diff = null;
    renderWorldFull();
  }
}

function updateStatus() {
  const bagEl = document.getElementById('st-bag');
  if (bagEl) bagEl.textContent = K.state.karel.motxilla;
}


// ── Exporta ──

K.renderWorld      = renderWorld;
K.initGoalView     = initGoalView;
K.cycleGoalView    = cycleGoalView;
K.updateGoalButton = updateGoalButton;
K.showGoalDiff     = showGoalDiff;
K.clearGoalDiff    = clearGoalDiff;
K.renderWorldFull  = renderWorldFull;
K.updateStatus     = updateStatus;
