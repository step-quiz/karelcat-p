// ════════════════════════════════════════════════════════
// world.js — Gestió del món: CSV, helpers, condicions
// ════════════════════════════════════════════════════════

// ── CSV → estructura del món ──
//
// Cel·les: '.' buida · 'P' roca · 'A' perla
//          'K>' 'K^' 'K<' 'Kv' en Karel (Est, Nord, Oest, Sud)
//          'K>A' (etc.) en Karel damunt d'una casella amb perla
// Files separades per '|'. Retorna també `kCount` (quantes K hi ha)
// i `issues` (avisos de format) perquè els tests puguin validar mapes.

const _DIR_MAP = { '>': 0, 'V': 1, '<': 2, '^': 3 };
const _DIR_CHARS = ['>', 'v', '<', '^'];

function parseCSV(csv) {
  const lines = String(csv).trim().split('|').map(l => l.trim()).filter(l => l && !l.startsWith('//'));
  const grid = [];
  const issues = [];
  let kStart = { x: 0, y: 0, dir: 0 };
  let kCount = 0;

  for (let row = 0; row < lines.length; row++) {
    const cells = lines[row].split(',').map(c => c.trim());
    grid.push([]);
    for (let col = 0; col < cells.length; col++) {
      const c = cells[col].toUpperCase();
      if (c.startsWith('K')) {
        let s = c.slice(1), dir = 0;
        if (s && s[0] in _DIR_MAP) { dir = _DIR_MAP[s[0]]; s = s.slice(1); }
        else if (s && s !== 'A') issues.push(`orientació desconeguda '${cells[col]}' a (${col},${row})`);
        if (s && s !== 'A') issues.push(`contingut desconegut sota en Karel '${cells[col]}' a (${col},${row})`);
        grid[row].push(s === 'A' ? 'A' : '.');
        if (kCount === 0) kStart = { x: col, y: row, dir };
        kCount++;
      } else {
        if (c !== 'P' && c !== 'A' && c !== '.') issues.push(`cel·la desconeguda '${cells[col]}' a (${col},${row})`);
        grid[row].push(c === 'P' ? 'P' : c === 'A' ? 'A' : '.');
      }
    }
  }
  const maxCols = Math.max(...grid.map(r => r.length), 1);
  if (grid.some(r => r.length !== maxCols)) issues.push('no totes les files tenen el mateix nombre de caselles');
  for (const r of grid) while (r.length < maxCols) r.push('.');
  if (kCount > 1) issues.push(`hi ha ${kCount} K al mapa (només en pot haver una)`);
  return { grid, rows: grid.length, cols: maxCols, kStart, kCount, issues };
}

// ── Objectiu d'un exercici ──
//
//   objectiu    := alternativa ( '\n' alternativa )*     (n'hi ha prou que se'n compleixi una)
//   alternativa := graella ( ';' opció )*
//   opció       := 'motxilla=N'   (en Karel ha d'acabar amb N perles a la motxilla)
//                | 'direccio'     (també es comprova cap a on mira en Karel)
//
// Si la graella de l'objectiu no té cap K, NO es comprova on acaba en Karel:
// només es compara el contingut de totes les caselles (també la de sota en Karel).
function parseGoal(goalStr) {
  return String(goalStr || '').split('\n').map(s => s.trim()).filter(Boolean).map(alt => {
    const [gridPart, ...opts] = alt.split(';').map(s => s.trim());
    const w = parseCSV(gridPart);
    const goal = {
      grid: w.grid, rows: w.rows, cols: w.cols,
      karel: w.kCount > 0 ? w.kStart : null,
      bag: null, checkDir: false,
      issues: [...w.issues],
    };
    for (const o of opts) {
      const m = o.match(/^motxilla\s*=\s*(\d+)$/i);
      if (m) goal.bag = parseInt(m[1], 10);
      else if (/^direcci[oó]$/i.test(o)) goal.checkDir = true;
      else if (o) goal.issues.push(`opció desconeguda '${o}'`);
    }
    return goal;
  });
}

// Compara l'estat actual d'en Karel amb l'objectiu. Retorna true si alguna
// alternativa es compleix. Per defecte ignora cap a on mira en Karel.
function compareGoal(goalStr) {
  const S = K.state;
  const alternatives = parseGoal(goalStr);
  if (!alternatives.length) return false;
  return alternatives.some(g => {
    if (g.rows !== S.world.rows || g.cols !== S.world.cols) return false;
    for (let r = 0; r < g.rows; r++)
      for (let c = 0; c < g.cols; c++)
        if (g.grid[r][c] !== S.world.grid[r][c]) return false;
    if (g.karel) {
      if (g.karel.x !== S.karel.x || g.karel.y !== S.karel.y) return false;
      if (g.checkDir && g.karel.dir !== S.karel.dir) return false;
    }
    if (g.bag !== null && g.bag !== S.karel.motxilla) return false;
    return true;
  });
}

// ── Carrega un mapa CSV a l'estat ──

function loadMapFromCSV(csv) {
  const S = K.state;
  const { grid, rows, cols, kStart, issues } = parseCSV(csv);
  for (const i of issues) console.warn('⚠ Mapa: ' + i);
  S.world     = { grid, rows, cols };
  S.worldInit = grid.map(r => [...r]);
  S.karel     = { ...kStart, motxilla: 0 };
  S.karelInit = { ...kStart, motxilla: 0 };
  K.stopProgram();
  K.renderWorldFull();
  K.updateStatus();
  K.log(K.t('log.map_loaded'), 'ok');
}

// ── Món → CSV ──

function _gridToCSV(grid, karel) {
  return grid.map((row, r) =>
    row.map((c, col) =>
      (karel.x === col && karel.y === r) ? 'K' + _DIR_CHARS[karel.dir] + (c === 'A' ? 'A' : '') : c
    ).join(',')
  ).join('|');
}

// Món (amb la posició inicial d'en Karel) → CSV. L'usen «Desa mapa» i l'editor de mapes.
function worldToCSV() {
  const S = K.state;
  return _gridToCSV(S.world.grid, S.karelInit);
}


// ── Estat actual → CSV (per mostrar-lo o comparar-lo en proves) ──
function currentStateToCSV() {
  const S = K.state;
  return _gridToCSV(S.world.grid, S.karel);
}
K.currentStateToCSV = currentStateToCSV;


// Diferències entre l'estat actual i l'objectiu. Si l'objectiu té diverses
// alternatives, retorna la més propera (la que té menys diferències):
//   { alt, goal, cells:[{x,y,want,got}], karelPos, karelDir, bag:{want,got}|null, total }
// Retorna null si cap alternativa té les mateixes dimensions que el món.
function goalDiff(goalStr) {
  const S = K.state;
  let best = null;
  parseGoal(goalStr).forEach((g, alt) => {
    if (g.rows !== S.world.rows || g.cols !== S.world.cols) return;
    const cells = [];
    for (let r = 0; r < g.rows; r++)
      for (let c = 0; c < g.cols; c++)
        if (g.grid[r][c] !== S.world.grid[r][c]) cells.push({ x: c, y: r, want: g.grid[r][c], got: S.world.grid[r][c] });
    const karelPos = !!g.karel && (g.karel.x !== S.karel.x || g.karel.y !== S.karel.y);
    const karelDir = !!g.karel && g.checkDir && !karelPos && g.karel.dir !== S.karel.dir;
    const bag = (g.bag !== null && g.bag !== S.karel.motxilla) ? { want: g.bag, got: S.karel.motxilla } : null;
    const total = cells.length + (karelPos ? 1 : 0) + (karelDir ? 1 : 0) + (bag ? 1 : 0);
    if (!best || total < best.total) best = { alt, goal: g, cells, karelPos, karelDir, bag, total };
  });
  return best;
}


// ── Helpers del món ──

function isRock(x, y) {
  const w = K.state.world;
  if (x < 0 || y < 0 || x >= w.cols || y >= w.rows) return true;
  return w.grid[y][x] === 'P';
}

function getCell(x, y) {
  const w = K.state.world;
  if (x < 0 || y < 0 || x >= w.cols || y >= w.rows) return null;
  return w.grid[y][x];
}

function setCell(x, y, v) {
  const w = K.state.world;
  if (y >= 0 && y < w.rows && x >= 0 && x < w.cols) w.grid[y][x] = v;
}

function front() {
  const k = K.state.karel;
  const d = K.DIRS[k.dir];
  return { x: k.x + d.dx, y: k.y + d.dy };
}

function left() {
  const k = K.state.karel;
  const d = K.DIRS[(k.dir + 3) % 4];  // counterclockwise
  return { x: k.x + d.dx, y: k.y + d.dy };
}

function right() {
  const k = K.state.karel;
  const d = K.DIRS[(k.dir + 1) % 4];  // clockwise
  return { x: k.x + d.dx, y: k.y + d.dy };
}


// ── Avaluació de condicions ──

function evalCond(cond) {
  const L = K.lang;
  switch (cond.type) {
    case 'not': return !evalCond(cond.inner);
    case 'and': return evalCond(cond.left) && evalCond(cond.right);
    case 'or':  return evalCond(cond.left) || evalCond(cond.right);
    case 'bool_literal': return cond.value;
    case 'condition': {
      const action = L.COND_TO_ACTION[cond.name] ?? cond.name;
      const { x: fx, y: fy } = front();
      const { x: lx, y: ly } = left();
      const { x: rx, y: ry } = right();
      const k = K.state.karel;
      switch (action) {
        case 'rock-ahead':   return isRock(fx, fy);
        case 'path-clear':   return !isRock(fx, fy);
        case 'left-clear':   return !isRock(lx, ly);
        case 'left-blocked': return isRock(lx, ly);
        case 'right-clear':  return !isRock(rx, ry);
        case 'right-blocked':return isRock(rx, ry);
        case 'pearl-here':   return getCell(k.x, k.y) === 'A';
        case 'bag-empty':    return k.motxilla === 0;
        case 'bag-full':     return k.motxilla > 0;
      }
    }
  }
  return false;
}


// ── Exporta ──

K.parseCSV       = parseCSV;
K.parseGoal      = parseGoal;
K.compareGoal    = compareGoal;
K.goalDiff       = goalDiff;
K.loadMapFromCSV = loadMapFromCSV;
K.worldToCSV     = worldToCSV;
K.isRock         = isRock;
K.getCell        = getCell;
K.setCell        = setCell;
K.front          = front;
K.evalCond       = evalCond;
