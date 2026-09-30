#!/usr/bin/env node
// ════════════════════════════════════════════════════════
// tests/comprova-curs.js — Comprovació automàtica del curs
//
// Ús (des de l'arrel del repositori, no cal instal·lar res):
//
//     node tests/comprova-curs.js
//
// Què comprova:
//  1. El motor (tokenitzador + parser + intèrpret): programes que han de
//     funcionar i programes que han de donar un error concret.
//  2. Tots els simuladors de curs/*.html:
//     - els mapes i els objectius tenen un format correcte (una sola K al
//       mapa, com a màxim una K a l'objectiu, mateixes dimensions, les
//       roques no es mouen, cap salt de línia, JSON vàlid…);
//     - cada exercici editable amb objectiu té una solució de referència
//       dins d'un comentari HTML, entre <solucio> i </solucio>, i aquesta
//       solució supera TOTS els mons de l'exercici;
//     - cada <solucio-incorrecta> falla almenys un món (així sabem que el
//       verificador detecta aquell error típic de l'alumne);
//     - els exemples no editables (data-readonly="true") s'executen sense
//       errors i, si tenen objectiu, el compleixen.
//  3. Coherència de curs/capitols.js (REPTES_DATA: fitxers i nombre de mons).
//
// Com s'associa una solució amb un exercici de la pàgina:
//   <solucio>                   → 1r exercici editable amb objectiu de la pàgina
//   <solucio exercici="2">      → 2n exercici editable amb objectiu de la pàgina
//   <solucio-incorrecta exercici="2" motiu="oblida l'última casella"> … </solucio-incorrecta>
// El codi va entre les marques, començant a la columna 0 (sense sagnar).
//
// Si alguna comprovació falla, el programa acaba amb codi d'error 1
// (i l'acció de GitHub es marca en vermell).
// ════════════════════════════════════════════════════════

'use strict';
const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

const ROOT = path.resolve(__dirname, '..');
const CURS = path.join(ROOT, 'curs');

// ── Colors (només si la sortida és un terminal) ──────────
const tty = process.stdout.isTTY;
const c = {
  ok:   s => tty ? `\x1b[32m${s}\x1b[0m` : s,
  err:  s => tty ? `\x1b[31m${s}\x1b[0m` : s,
  dim:  s => tty ? `\x1b[2m${s}\x1b[0m`  : s,
  bold: s => tty ? `\x1b[1m${s}\x1b[0m`  : s,
};

let nChecks = 0;
const errors = [];
function pass()               { nChecks++; }
function fail(where, msg)     { nChecks++; errors.push({ where, msg }); console.log('  ' + c.err('✗ ') + msg); }


// ════════════════════════════════════════════════════════
// 1. Carrega el motor real (els mateixos fitxers que el navegador)
// ════════════════════════════════════════════════════════

function loadEngine() {
  const ctx = { console, setTimeout: () => 0, clearTimeout() {} };
  ctx.window = ctx;
  ctx.K = {};
  vm.createContext(ctx);
  for (const f of ['constants', 'i18n', 'i18n-facil', 'state', 'tokenizer', 'parser', 'interpreter', 'world', 'execution']) {
    const file = path.join(ROOT, 'js', f + '.js');
    vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: file });
  }
  const K = ctx.K;
  K.applyCodeLang(K.state.codeLang);
  return K;
}
const K = loadEngine();


// ════════════════════════════════════════════════════════
// 2. Proves del motor
// ════════════════════════════════════════════════════════

// Cada cas: [descripció, codi, esperat, mapa (opcional)]
//   esperat = { final: 'csv' }        → s'executa bé i acaba en aquest estat
//   esperat = { error: /regex/ }      → dona un error que coincideix amb la regex
//   esperat.maxSteps                  → i no ha fet més d'aquestes accions
const MAP = 'K>,.,.,.,.,.';
const ENGINE_CASES = [
  ['for en una sola línia',            'for _ in range(3): move()\n',                    { final: '.,.,.,K>,.,.' }],
  ['diverses instruccions amb ;',      'move(); move()\n',                                { final: '.,.,K>,.,.,.' }],
  ['tabulador com a indentació',       'for i in range(2):\n\tmove()\n',                  { final: '.,.,K>,.,.,.' }],
  ['indentació de 2 i de 4 espais',    'for i in range(2):\n  move()\nfor i in range(1):\n    move()\n', { final: '.,.,.,K>,.,.' }],
  ['range negatiu = 0 voltes',         'for i in range(-2):\n    move()\n',               { final: 'K>,.,.,.,.,.' }],
  ['elif i else encadenats',           'if pearl_here():\n    grab()\nelif front_is_clear():\n    move()\nelse:\n    turn_left()\n', { final: '.,K>,.,.,.,.' }],
  ['else del if de fora',              'if front_is_clear():\n    if pearl_here():\n        grab()\nelse:\n    turn_left()\nmove()\n', { final: '.,K>,.,.,.,.' }],
  ['condicions amb parèntesis',        'while (front_is_clear() and not pearl_here()) or False:\n    move()\n', { final: '.,.,.,.,.,K>' }],
  ['not(...) i not ...',               'while not(front_is_blocked()):\n    move()\n',     { final: '.,.,.,.,.,K>' }],
  ['break dins while True',            'while True:\n    move()\n    if front_is_blocked():\n        break\n', { final: '.,.,.,.,.,K>' }],
  ['break dins un for dins una funció', 'def f():\n    for i in range(9):\n        move()\n        break\nf()\n', { final: '.,K>,.,.,.,.' }],
  ['nom amb ela geminada',             'def col·loca():\n    move()\ncol·loca()\n',       { final: '.,K>,.,.,.,.' }],
  ['comentaris i línies buides',       '# hola\n\nmove()  # avança\n\n',                  { final: '.,K>,.,.,.,.' }],
  ['línia sobre-indentada',            'move()\n    move()\nmove()\n',                     { error: /Línia 2: .*espais al davant/ }],
  ['primera línia indentada',          '  move()\n',                                       { error: /Línia 1: .*espais al davant/ }],
  ['bloc sense indentar',              'while front_is_clear():\nmove()\n',               { error: /Línia 1: sota 'while' hi ha d'haver una línia amb espais/ }],
  ['esquelet amb funció buida',        'def f():\n\nf()\n',                                { error: /Línia 1: sota 'def' hi ha d'haver una línia amb espais/ }],
  ['indentació que no quadra',         'for i in range(2):\n    move()\n  move()\n',     { error: /Línia 3: els espais del davant no quadren/ }],
  ['dues instruccions sense ;',        'move() move()\n',                                  { error: /Línia 1: a cada línia només hi va una instrucció/ }],
  ['falten els dos punts',             'while front_is_clear()\n    move()\n',            { error: /Línia 1: falten els dos punts/ }],
  ['falten els parèntesis',            'move\n',                                           { error: /Escriu move\(\)/ }],
  ['arguments dins dels parèntesis',   'move(3)\n',                                        { error: /dins de move\(\) no hi va res/ }],
  ['break fora de bucle',              'move()\nbreak\n',                                  { error: /Línia 2: 'break' només/ }],
  ['break que sortiria d\'una funció', 'def f():\n    break\nwhile True:\n    f()\n',    { error: /Línia 2: 'break' només/ }],
  ['else sense if',                    'else:\n    move()\n',                              { error: /necessita un 'if' just a sobre/ }],
  ['majúscula a Move()',               'Move()\n',                                         { error: /Vols dir move\(\)\? \(Compte: les majúscules/ }],
  ['nom mal escrit',                   'turn_rigth()\n',                                   { error: /Vols dir turn_right\(\)\?/ }],
  ['funció no definida',               'salta()\n',                                        { error: /'salta\(\)' no existeix.*def salta\(\):/ }],
  ['condició usada com a ordre',       'pearl_here()\n',                                   { error: /és una condició/ }],
  ['ordre usada com a condició',       'if move():\n    grab()\n',                        { error: /és una instrucció, no una condició/ }],
  ['condició mal escrita',             'while not prl_here():\n    move()\n',             { error: /Vols dir pearl_here\(\)\?/ }],
  ['redefinir una ordre',              'def move():\n    turn_left()\n',                  { error: /ja és una instrucció d'en Karel/ }],
  ['def dins d\'un bloc',              'if True:\n    def f():\n        move()\n',       { error: /'def' no pot tenir espais al davant/ }],
  ['caràcter no vàlid',                'x = 3\n',                                          { error: /el signe '='/ }],
  ['xoc amb la paret',                 'for i in range(9):\n    move()\n',                { error: /En Karel ha xocat/ }],
  ['bucle infinit detectat de seguida', 'while front_is_clear():\n    turn_left()\n',       { error: /no s'acaba mai/, maxSteps: 8 }, '.,.,.|.,K>,.|.,.,.'],
  ['anada i tornada infinita',         'while True:\n    move()\n    turn_around()\n',   { error: /no s'acaba mai/, maxSteps: 8 }, '.,.,.|.,K>,.|.,.,.'],
  ['bucle llarg però finit',           'while not pearl_here():\n    move()\n    if front_is_blocked():\n        turn_right()\n', { final: '.,.,.|K^A,.,.|.,.,.' }, 'K>,.,.|A,.,.|.,.,.'],
  ['bag_has_pearls()',                 'grab()\nif bag_has_pearls():\n    move()\n',   { final: '.,K>,.' }, 'K>A,.,.'],
  ['bag_is_full() (nom antic) funciona', 'grab()\nif bag_is_full():\n    move()\n',    { final: '.,K>,.' }, 'K>A,.,.'],
];

function engineTests() {
  console.log(c.bold('\nMotor (tokenitzador, parser i intèrpret)'));
  let okCount = 0;
  for (const [desc, code, exp, map] of ENGINE_CASES) {
    const r = K.runHeadless({ map: map || MAP, code });
    if (exp.maxSteps !== undefined && r.steps > exp.maxSteps) {
      fail('motor', `${desc}: ha fet ${r.steps} accions (màxim esperat: ${exp.maxSteps})`);
      continue;
    }
    if (exp.final !== undefined) {
      if (r.ok && r.finalCSV === exp.final) { pass(); okCount++; }
      else fail('motor', `${desc}: esperava acabar a '${exp.final}' però ${r.ok ? `ha acabat a '${r.finalCSV}'` : `ha donat l'error «${r.message}»`}`);
    } else {
      if (!r.ok && exp.error.test(r.message)) { pass(); okCount++; }
      else fail('motor', `${desc}: esperava un error ${exp.error} però ${r.ok ? 's\'ha executat sense errors' : `el missatge ha estat «${r.message}»`}`);
    }
  }

  // Verificador: casella de sota en Karel, alternatives i opcions
  const G = [
    ['perla sota en Karel (sí)',        'K>,A,.', 'move()\n',            '.,K>A,.',            true],
    ['perla sota en Karel (no)',        'K>,A,.', 'move()\ngrab()\n',    '.,K>A,.',            false],
    ['objectiu sense K: posició lliure', 'K>,A,.', 'move()\ngrab()\nmove()\n', '.,.,.',       true],
    ['alternatives (una o altra)',       'K>,.,.', 'move()\nmove()\n',    'K>,.,.\n.,.,K>',     true],
    ['opció motxilla=N (sí)',            'K>,A,.', 'move()\ngrab()\n',    '.,K>,.;motxilla=1',  true],
    ['opció motxilla=N (no)',            'K>,A,.', 'move()\n',            '.,K>A,.;motxilla=1', false],
    ['direcció ignorada per defecte',    'K>,.,.', 'move()\nturn_left()\n', '.,K>,.',          true],
    ['opció direccio',                   'K>,.,.', 'move()\nturn_left()\n', '.,K>,.;direccio', false],
  ];
  for (const [desc, map, code, goal, expected] of G) {
    const r = K.runHeadless({ map, code, goal });
    if (r.ok && r.passed === expected) { pass(); okCount++; }
    else fail('verificador', `${desc}: esperava ${expected ? 'superat' : 'no superat'} i ha donat ${r.ok ? (r.passed ? 'superat' : 'no superat') : 'error: ' + r.message}`);
  }

  // Diferències amb l'objectiu (el que es marca en vermell al món)
  const D = [
    ['perla que falta i Karel mal situat', 'K>,A,.,.', 'move()\n',          'A,.,.,K>', { missing: 1, extra: 1, karelPos: true }],
    ['tria l\'alternativa més propera',   'K>,.,.',   'move()\n',          '.,.,K>\n.,K>,.', { alt: 1, total: 0 }],
    ['motxilla i direcció',               'K>A,.',    'turn_left()\n',     'K>A,.;motxilla=1;direccio', { bag: true, karelDir: true }],
  ];
  for (const [desc, map, code, goal, exp] of D) {
    // Executa el codi i calcula les diferències sense restaurar l'estat
    const S = K.state, saved = { ...S };
    const w = K.parseCSV(map);
    S.world = { grid: w.grid, rows: w.rows, cols: w.cols };
    S.karel = { ...w.kStart, motxilla: 0 };
    for (const n of K.parseProgram(code)) {
      if (n.type === 'command') K.applyCommand(K.lang.CMD_TO_ACTION[n.name]);
    }
    const d = K.goalDiff(goal);
    Object.assign(S, saved);
    if (!d) { fail('verificador', `diferències — ${desc}: goalDiff ha retornat null`); continue; }
    const got = {
      missing: d.cells.filter(x => x.want === 'A').length, extra: d.cells.filter(x => x.got === 'A').length,
      karelPos: d.karelPos, karelDir: d.karelDir, bag: !!d.bag, alt: d.alt, total: d.total,
    };
    const okD = Object.entries(exp).every(([k, v]) => got[k] === v);
    if (okD) { pass(); okCount++; }
    else fail('verificador', `diferències — ${desc}: esperava ${JSON.stringify(exp)} i ha donat ${JSON.stringify(got)}`);
  }
  console.log('  ' + c.ok(`✓ ${okCount}/${ENGINE_CASES.length + G.length + D.length} proves`));
}


// ════════════════════════════════════════════════════════
// 3. Lectura dels simuladors de les pàgines del curs
// ════════════════════════════════════════════════════════

function decodeEntities(s) {
  const named = { quot: '"', apos: "'", amp: '&', lt: '<', gt: '>', nbsp: ' ' };
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === '#') return String.fromCodePoint(e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return named[e.toLowerCase()] ?? m;
  });
}

// Llegeix els atributs d'una etiqueta que comença a `start` ('<div ...>')
function parseTag(html, start) {
  let i = html.indexOf(' ', start);
  const attrs = {};
  while (i < html.length) {
    while (/\s/.test(html[i])) i++;
    if (html[i] === '>') return { attrs, end: i + 1 };
    if (html[i] === '/') { i++; continue; }
    const m = /^[^\s=>\/]+/.exec(html.slice(i));
    if (!m) { i++; continue; }
    const name = m[0].toLowerCase();
    i += m[0].length;
    while (/\s/.test(html[i])) i++;
    let value = '';
    if (html[i] === '=') {
      i++;
      while (/\s/.test(html[i])) i++;
      const q = html[i];
      if (q === '"' || q === "'") {
        const endQ = html.indexOf(q, i + 1);
        value = html.slice(i + 1, endQ);
        i = endQ + 1;
      } else {
        const m2 = /^[^\s>]+/.exec(html.slice(i));
        value = m2 ? m2[0] : '';
        i += value.length;
      }
    }
    attrs[name] = decodeEntities(value);
  }
  return { attrs, end: html.length };
}

const lineAt = (text, pos) => text.slice(0, pos).split('\n').length;

function readPage(file) {
  const html = fs.readFileSync(file, 'utf8');
  // Treu els comentaris (conservant els salts de línia per als números de línia)
  const comments = [];
  const noComments = html.replace(/<!--[\s\S]*?-->/g, (m, off) => {
    comments.push({ text: m, line: lineAt(html, off) });
    return m.replace(/[^\n]/g, ' ');
  });

  const sims = [];
  const re = /<div\b/gi;
  let m;
  while ((m = re.exec(noComments))) {
    const { attrs } = parseTag(noComments, m.index);
    if (!(attrs.class || '').split(/\s+/).includes('simulador')) continue;
    sims.push({ attrs, line: lineAt(noComments, m.index) });
  }

  const solutions = [];
  for (const cm of comments) {
    const reSol = /<(solucio-incorrecta|solucio)(?=[\s>])([^>]*)>([\s\S]*?)<\/\1>/g;
    let s;
    while ((s = reSol.exec(cm.text))) {
      const attrs = {};
      s[2].replace(/([\w-]+)="([^"]*)"/g, (_, k, v) => { attrs[k] = v; });
      solutions.push({
        kind: s[1],
        exercici: attrs.exercici ? parseInt(attrs.exercici, 10) : 1,
        motiu: attrs.motiu || '',
        code: s[3].replace(/^\r?\n/, ''),
        line: cm.line + lineAt(cm.text, s.index) - 1,
      });
    }
  }
  return { html, sims, solutions };
}

// Converteix els atributs d'un simulador al model que fa servir capitols.js
function simModel(sim, where) {
  const a = sim.attrs;
  const jsonAttr = (name) => {
    if (a[name] === undefined) return undefined;
    try { return JSON.parse(a[name]); }
    catch (e) { fail(where, `data-${name.slice(5)} no és JSON vàlid: ${e.message}`); return null; }
  };
  const model = {
    line: sim.line,
    readonly: a['data-readonly'] === 'true',
    code: (a['data-code'] || '').replace(/\\n/g, '\n'),
    worlds: [],
  };
  if (a['data-maps'] !== undefined) {
    const maps   = jsonAttr('data-maps')  || [];
    const goals  = jsonAttr('data-goals') || [];
    const bags   = jsonAttr('data-bags')  || [];
    const labels = jsonAttr('data-labels');
    const bag0   = parseInt(a['data-bag'] || '0', 10);
    if (goals.length && goals.length !== maps.length)
      fail(where, `hi ha ${maps.length} mapes però ${goals.length} objectius`);
    if (Array.isArray(labels) && labels.length !== maps.length)
      fail(where, `hi ha ${maps.length} mapes però ${labels.length} etiquetes (data-labels)`);
    maps.forEach((map, i) => {
      const g = goals[i];
      model.worlds.push({ map, goal: Array.isArray(g) ? g.join('\n') : (g || ''), bag: bags[i] !== undefined ? bags[i] : bag0 });
    });
  } else {
    model.worlds.push({ map: a['data-map'] || '', goal: a['data-goal'] || '', bag: parseInt(a['data-bag'] || '0', 10) });
  }
  model.hasGoal = model.worlds.some(w => w.goal);
  return model;
}

// Comprova el format d'un mapa i dels seus objectius
function lintWorld(w, where) {
  let ok = true;
  const bad = msg => { ok = false; fail(where, msg); };
  if (/\n|\\n/.test(w.map)) bad(`el mapa té salts de línia: les files se separen amb | (${w.map.slice(0, 30)}…)`);
  const m = K.parseCSV(w.map);
  for (const i of m.issues) bad(`mapa: ${i}`);
  if (m.kCount === 0) bad('el mapa no té cap K (en Karel)');
  if (!w.goal) return ok;
  for (const g of K.parseGoal(w.goal)) {
    for (const i of g.issues) bad(`objectiu: ${i}`);
    if (g.rows !== m.rows || g.cols !== m.cols) { bad(`l'objectiu fa ${g.cols}×${g.rows} però el mapa fa ${m.cols}×${m.rows}`); continue; }
    for (let r = 0; r < m.rows; r++)
      for (let col = 0; col < m.cols; col++)
        if ((m.grid[r][col] === 'P') !== (g.grid[r][col] === 'P')) { bad(`a l'objectiu les roques no coincideixen amb el mapa (casella ${col},${r})`); r = m.rows; break; }
  }
  return ok;
}

function describe(r, w) {
  if (!r.ok) return `error a la línia ${r.line ?? '?'}: ${r.message}`;
  return `no compleix l'objectiu\n        obtingut: ${r.finalCSV}\n        objectiu: ${w.goal.replace(/\n/g, '  o bé  ')}`;
}

const ERR_NAME = { sintaxi: 'de sintaxi', execucio: "d'execució" };

function checkPage(file) {
  const rel = path.relative(ROOT, file);
  const { sims, solutions } = readPage(file);
  if (!sims.length && !solutions.length) return null;
  console.log(c.bold('\n' + rel));

  const exercises = [];     // simuladors editables amb objectiu, en ordre
  const models = sims.map((s, i) => {
    const where = `${rel}:${s.line}`;
    const mdl = simModel(s, where);
    mdl.where = where;
    mdl.lintOk = mdl.worlds.every(w => lintWorld(w, where));
    if (mdl.lintOk) pass();
    if (mdl.hasGoal && !mdl.readonly) exercises.push(mdl);
    return mdl;
  });

  // Exemples no editables: s'han d'executar bé (i complir l'objectiu, si en tenen).
  // Els que volen mostrar un error a propòsit porten data-error="sintaxi" o
  // data-error="execucio": aleshores es comprova que l'error es produeixi.
  for (const mdl of models.filter(x => x.readonly)) {
    let allOk = true;
    const expectErr = sims.find(s => s.line === mdl.line).attrs['data-error'];
    mdl.worlds.forEach((w, i) => {
      const r = K.runHeadless({ map: w.map, code: mdl.code, bag: w.bag, goal: w.goal });
      if (expectErr) {
        const kind = r.ok ? null : (r.syntax ? 'sintaxi' : 'execucio');
        if (kind !== expectErr) { allOk = false; fail(mdl.where, `l'exemple hauria de mostrar un error ${ERR_NAME[expectErr] || expectErr} però ${r.ok ? 's\'executa sense errors' : `dona un error ${ERR_NAME[kind]}: ${r.message}`}`); }
      } else if (!r.ok || (w.goal && !r.passed)) {
        allOk = false; fail(mdl.where, `l'exemple no editable (món ${i + 1}) ${describe(r, w)}`);
      }
    });
    if (allOk) { pass(); console.log('  ' + c.ok('✓ ') + c.dim(`exemple (línia ${mdl.line})${expectErr ? ` — mostra un error ${ERR_NAME[expectErr]}, com s'espera` : ''}`)); }
  }

  // Solucions de referència i solucions incorrectes
  exercises.forEach((ex, idx) => {
    const n = idx + 1;
    const refs = solutions.filter(s => s.kind === 'solucio' && s.exercici === n);
    const bads = solutions.filter(s => s.kind === 'solucio-incorrecta' && s.exercici === n);
    const label = `exercici ${n} (línia ${ex.line}, ${ex.worlds.length} ${ex.worlds.length === 1 ? 'món' : 'mons'})`;
    if (!refs.length) { fail(ex.where, `${label}: falta la solució de referència (<solucio${n > 1 ? ` exercici="${n}"` : ''}> dins d'un comentari)`); return; }
    for (const sol of refs) {
      let allOk = true;
      ex.worlds.forEach((w, i) => {
        const r = K.runHeadless({ map: w.map, code: sol.code, bag: w.bag, goal: w.goal });
        if (!r.ok || !r.passed) { allOk = false; fail(ex.where, `${label}: la solució de referència (línia ${sol.line}) falla el món ${i + 1}: ${describe(r, w)}`); }
      });
      if (allOk) { pass(); console.log('  ' + c.ok('✓ ') + `${label}: la solució supera tots els mons`); }
    }
    for (const sol of bads) {
      const results = ex.worlds.map(w => K.runHeadless({ map: w.map, code: sol.code, bag: w.bag, goal: w.goal }));
      const failed = results.findIndex(r => !r.ok || !r.passed);
      if (failed === -1) fail(ex.where, `${label}: la solució incorrecta «${sol.motiu}» (línia ${sol.line}) supera tots els mons: el verificador no la detecta`);
      else { pass(); console.log('  ' + c.ok('✓ ') + c.dim(`${label}: detecta «${sol.motiu}» (falla el món ${failed + 1})`)); }
    }
  });

  for (const sol of solutions) {
    if (sol.exercici < 1 || sol.exercici > exercises.length)
      fail(rel, `la ${sol.kind} de la línia ${sol.line} diu exercici="${sol.exercici}", però la pàgina té ${exercises.length} exercicis amb objectiu`);
  }
  return models;
}


// ════════════════════════════════════════════════════════
// 4. Coherència de curs/capitols.js
// ════════════════════════════════════════════════════════

function checkCapitolsJs(pageModels) {
  console.log(c.bold('\ncurs/capitols.js'));
  const src = fs.readFileSync(path.join(CURS, 'capitols.js'), 'utf8');
  const block = src.slice(src.indexOf('const REPTES_DATA'), src.indexOf('];', src.indexOf('const REPTES_DATA')));
  const re = /\{\s*num:\s*(\d+),[^}]*?arxiu:\s*'([^']+)'[^}]*?\}/g;
  let m, n = 0;
  while ((m = re.exec(block))) {
    n++;
    const [entry, num, arxiu] = m;
    const mons = /mons:\s*(\d+)/.exec(entry);
    const models = pageModels[arxiu];
    if (!fs.existsSync(path.join(CURS, arxiu))) { fail('capitols.js', `REPTES_DATA ${num}: el fitxer ${arxiu} no existeix`); continue; }
    const multi = (models || []).find(x => x.hasGoal && !x.readonly);
    const real = multi ? multi.worlds.length : 0;
    if (!mons) fail('capitols.js', `REPTES_DATA ${num} (${arxiu}): falta el camp mons (la pàgina en té ${real})`);
    else if (parseInt(mons[1], 10) !== real) fail('capitols.js', `REPTES_DATA ${num} (${arxiu}): diu mons: ${mons[1]} però la pàgina en té ${real}`);
    else pass();
  }
  if (errors.every(e => e.where !== 'capitols.js')) console.log('  ' + c.ok(`✓ ${n} reptes coherents amb les seves pàgines`));
}


// ════════════════════════════════════════════════════════
// Execució
// ════════════════════════════════════════════════════════

console.log(c.bold('Karel — comprovació automàtica del curs'));
engineTests();

const pageModels = {};
const files = fs.readdirSync(CURS)
  .filter(f => f.endsWith('.html'))
  .sort((a, b) => a.localeCompare(b, 'ca', { numeric: true }));
for (const f of files) {
  const models = checkPage(path.join(CURS, f));
  if (models) pageModels[f] = models;
}
checkCapitolsJs(pageModels);

console.log('\n' + '─'.repeat(60));
if (errors.length) {
  console.log(c.err(c.bold(`✗ ${errors.length} error${errors.length > 1 ? 's' : ''} de ${nChecks} comprovacions:`)));
  for (const e of errors) console.log(c.err('  • ') + c.dim(e.where + ': ') + e.msg.split('\n')[0]);
  process.exit(1);
} else {
  console.log(c.ok(c.bold(`✓ Tot correcte: ${nChecks} comprovacions superades.`)));
}
