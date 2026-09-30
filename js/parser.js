// ════════════════════════════════════════════════════════
// parser.js — Classe Parser: tokens → AST
//
// Gramàtica basada en indentació (Python-compatible). El tokenitzador
// emet INDENT / DEDENT amb les mateixes regles que Python; el parser
// només ha de seguir-los. Cap token es descarta en silenci: qualsevol
// cosa que no encaixi amb la gramàtica és un error amb línia i missatge.
//
//   programa   := sentència* EOF
//   sentència  := if | while | for | def | línia_simple
//   línia_simple := simple (';' simple)* NL
//   simple     := ordre() | funció() | break
//   bloc       := ':' línia_simple            (tot a la mateixa línia)
//               | ':' NL INDENT sentència+ DEDENT
//
// Després de parsejar, es comprova que totes les funcions cridades
// existeixin (abans d'executar res), amb suggeriments «Volies dir…?».
// ════════════════════════════════════════════════════════

class KarelSyntaxError extends Error {
  constructor(msg, code, line) {
    super(msg);
    this.code      = code;
    this.errorLine = line ?? null;
  }
}

// Paraules que Python no deixa fer servir com a nom de funció
const _PY_RESERVED = new Set([
  'False','None','True','and','as','assert','async','await','break','class',
  'continue','def','del','elif','else','except','finally','for','from','global',
  'if','import','in','is','lambda','nonlocal','not','or','pass','raise',
  'return','try','while','with','yield',
]);

// Tradueix noms de token interns a text llegible per l'alumne
function tokLabel(tok) {
  if (tok.t === 'W' || tok.t === 'N') return String(tok.v);
  return { NL: 'final de línia', EOF: 'final del programa',
           INDENT: 'indentació', DEDENT: 'final del bloc' }[tok.t] ?? tok.t;
}

// Distància d'edició (Levenshtein amb transposicions de lletres veïnes)
function _editDistance(a, b) {
  const d = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 1; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
    }
  }
  return d[a.length][b.length];
}

// Busca el nom més semblant: { name, caseOnly } o null
function suggestName(w, candidates) {
  const lw = w.toLowerCase();
  for (const c of candidates) if (c !== w && c.toLowerCase() === lw) return { name: c, caseOnly: true };
  let best = null, bestD = Infinity;
  for (const c of candidates) {
    const dist = _editDistance(lw, c.toLowerCase());
    if (dist < bestD) { bestD = dist; best = c; }
  }
  const maxD = w.length <= 4 ? 1 : 2;
  return (best && bestD <= maxD) ? { name: best, caseOnly: false } : null;
}

function _suggestionText(sug) {
  if (!sug) return '';
  return K.tf('parse.did_you_mean', { s: sug.name }) + (sug.caseOnly ? K.t('parse.case_hint') : '');
}

class Parser {
  constructor(toks) {
    this.toks       = toks;
    this.i          = 0;
    this.loopDepth  = 0;   // dins de quants while/for som (per a break)
    this.blockDepth = 0;   // dins de quants blocs indentats som (per a def)
    // Noms de les funcions definides (per donar millors missatges d'error)
    this.procNames = new Set();
    for (let k = 0; k + 1 < toks.length; k++) {
      if (toks[k].t === 'W' && toks[k].v === K.lang.KW_DEF && toks[k + 1].t === 'W')
        this.procNames.add(toks[k + 1].v);
    }
  }

  // ── Accés als tokens ─────────────────────────────────────

  peek(offset = 0) {
    const idx = this.i + offset;
    const tok = idx < this.toks.length ? this.toks[idx] : this.toks[this.toks.length - 1];
    if (offset === 0 && tok.t === 'ERR') this._lexError(tok);
    return tok;
  }
  next() { const tok = this.peek(); this.i++; return tok; }

  // Llança un error de sintaxi amb un missatge de i18n (parse.<key>)
  fail(key, vars, code, line) {
    throw new KarelSyntaxError(K.tf('parse.' + key, { ...vars, n: line }), code, line);
  }

  _lexError(tok) {
    if (tok.code === 'bad_char') this.fail('bad_char', { c: tok.v }, 'syntax_char', tok.line);
    this.fail('dedent_mismatch', {}, 'syntax_indent', tok.line);
  }

  // ── Punt d'entrada ──────────────────────────────────────

  parseAll() {
    const stmts = [];
    while (this.peek().t !== 'EOF') stmts.push(...this.parseStatement());
    return stmts;
  }

  // ── Sentències ──────────────────────────────────────────

  // Retorna una llista (una línia simple pot tenir diverses instruccions amb ';')
  parseStatement() {
    const tok = this.peek();
    const L   = K.lang;
    if (tok.t === 'INDENT') this.fail('indent_unexpected', {}, 'syntax_indent', tok.line);
    if (tok.t === 'W') {
      const w = tok.v;
      if (w === L.KW_IF)    return [this.parseIf()];
      if (w === L.KW_WHILE) return [this.parseWhile()];
      if (w === L.KW_FOR)   return [this.parseFor()];
      if (w === L.KW_DEF)   return [this.parseDef()];
      if (w === L.KW_ELIF || L.KW_ELSE_ALIASES.includes(w))
        this.fail('else_without_if', { kw: w }, 'syntax_instr', tok.line);
    }
    return this.parseSimpleLine(false);
  }

  // Una o més instruccions simples separades per ';', fins al final de la línia
  parseSimpleLine(afterColon) {
    const stmts = [];
    for (;;) {
      stmts.push(this.parseSimple(afterColon && stmts.length === 0));
      const t = this.peek();
      if (t.t === ';') {
        this.next();
        if (this.peek().t === 'NL') { this.next(); return stmts; }
        continue;
      }
      if (t.t === 'NL')  { this.next(); return stmts; }
      if (t.t === 'EOF') return stmts;
      const prev = stmts[stmts.length - 1];
      const prevLabel = prev.type === 'break' ? 'break' : prev.name + '()';
      this.fail('one_per_line', { prev: prevLabel, tok: tokLabel(t) }, 'syntax_instr', t.line);
    }
  }

  parseSimple(afterColon) {
    const tok  = this.peek();
    const line = tok.line;
    const L    = K.lang;
    if (tok.t !== 'W') this.fail('unexpected', { tok: tokLabel(tok) }, 'syntax_instr', line);

    const w = tok.v;
    const compound = [L.KW_IF, L.KW_WHILE, L.KW_FOR, L.KW_DEF, L.KW_ELIF, ...L.KW_ELSE_ALIASES];
    if (compound.includes(w)) {
      if (afterColon) this.fail('block_same_line', { kw: w }, 'syntax_instr', line);
      this.fail('one_per_line', { prev: ';', tok: w }, 'syntax_instr', line);
    }

    if (w === 'break') {
      this.next();
      if (this.loopDepth === 0) this.fail('break_outside', {}, 'syntax_break', line);
      return { type: 'break', line };
    }

    if (L.KEYWORDS.has(w)) this.fail('unexpected', { tok: w }, 'syntax_instr', line);

    this.next();
    this._eatEmptyParens(w, line);
    if (L.COMMANDS.has(w)) return { type: 'command', name: w, line };
    if (L.CONDS.has(w))    this.fail('cond_as_cmd', { w }, 'syntax_cond', line);
    return { type: 'call', name: w, line };
  }

  // Consumeix '()' després d'un nom; missatges clars si falten o hi ha coses a dins
  _eatEmptyParens(w, line) {
    if (this.peek().t !== '(') this.fail('missing_parens', { w }, 'syntax_paren', line);
    this.next();
    const t = this.peek();
    if (t.t !== ')') {
      if (t.t === 'NL' || t.t === 'EOF' || t.t === ':')
        this.fail('expected', { want: ')', got: tokLabel(t) }, 'syntax_paren', t.line);
      this.fail('no_args', { w }, 'syntax_paren', line);
    }
    this.next();
  }

  _eatColon() {
    const t = this.peek();
    if (t.t === ':') { this.next(); return; }
    if (t.t === 'NL' || t.t === 'EOF') this.fail('missing_colon', {}, 'syntax_colon', t.line);
    this.fail('expected', { want: ':', got: tokLabel(t) }, 'syntax_colon', t.line);
  }

  // Bloc després d'una capçalera acabada en ':'
  // hdr: paraula de la capçalera (per als missatges); hdrLine: línia de la capçalera
  parseSuite(hdr, hdrLine) {
    this._eatColon();
    if (this.peek().t !== 'NL') return this.parseSimpleLine(true);   // for ...: move()

    this.next();                                       // NL
    if (this.peek().t !== 'INDENT') this.fail('indent_expected', { hdr }, 'syntax_indent', hdrLine);
    this.next();                                       // INDENT
    this.blockDepth++;
    const stmts = [];
    while (this.peek().t !== 'DEDENT' && this.peek().t !== 'EOF') stmts.push(...this.parseStatement());
    if (this.peek().t === 'DEDENT') this.next();
    this.blockDepth--;
    return stmts;
  }

  parseIf() {
    const L    = K.lang;
    const line = this.next().line;                     // 'if'
    const node = { type: 'if', cond: this.parseCond(), then: null, else: [], line };
    node.then  = this.parseSuite(L.KW_IF, line);

    // elif / else al mateix nivell: el bloc anterior ja ha consumit el seu DEDENT,
    // així que la paraula clau és el següent token.
    let tail = node;
    for (;;) {
      const t = this.peek();
      if (t.t === 'W' && t.v === L.KW_ELIF) {
        this.next();
        const n2 = { type: 'if', cond: this.parseCond(), then: null, else: [], line: t.line };
        n2.then = this.parseSuite(L.KW_ELIF, t.line);
        tail.else = [n2];
        tail = n2;
        continue;
      }
      if (t.t === 'W' && L.KW_ELSE_ALIASES.includes(t.v)) {
        this.next();
        tail.else = this.parseSuite(t.v, t.line);
      }
      break;
    }
    return node;
  }

  parseWhile() {
    const line = this.next().line;                     // 'while'
    const cond = this.parseCond();
    this.loopDepth++;
    const body = this.parseSuite(K.lang.KW_WHILE, line);
    this.loopDepth--;
    return { type: 'while', cond, body, line };
  }

  // for <variable> in range(N):   (el valor de la variable no s'usa)
  parseFor() {
    const L    = K.lang;
    const line = this.next().line;                     // 'for'
    const bad  = () => this.fail('for_syntax', {}, 'syntax_instr', line);
    let t = this.peek();
    if (t.t !== 'W' || L.KEYWORDS.has(t.v)) bad();
    this.next();
    t = this.peek(); if (t.t !== 'W' || t.v !== L.KW_IN)    bad(); this.next();
    t = this.peek(); if (t.t !== 'W' || t.v !== L.KW_RANGE) bad(); this.next();
    t = this.peek(); if (t.t !== '(') bad(); this.next();
    t = this.peek(); if (t.t !== 'N') bad();
    const count = this.next().v;
    t = this.peek(); if (t.t !== ')') bad(); this.next();
    this.loopDepth++;
    const body = this.parseSuite(L.KW_FOR, line);
    this.loopDepth--;
    return { type: 'repeat', count: Math.max(0, count), body, line };
  }

  parseDef() {
    const L    = K.lang;
    const line = this.next().line;                     // 'def'
    if (this.blockDepth > 0) this.fail('def_nested', {}, 'syntax_instr', line);
    const nt = this.peek();
    if (nt.t !== 'W') this.fail('expected_proc', {}, 'syntax_instr', nt.line);
    const name = nt.v;
    if (L.COMMANDS.has(name) || L.CONDS.has(name)) this.fail('def_builtin', { w: name }, 'syntax_instr', line);
    if (L.KEYWORDS.has(name) || _PY_RESERVED.has(name)) this.fail('def_keyword', { w: name }, 'syntax_instr', line);
    this.next();
    this._eatEmptyParens(name, line);
    const savedLoop = this.loopDepth;
    this.loopDepth = 0;                                // un break no pot sortir d'una funció
    const body = this.parseSuite(L.KW_DEF, line);
    this.loopDepth = savedLoop;
    return { type: 'proc', name, body, line };
  }

  // ── Condicions ───────────────────────────────────────────

  parseCond() { return this.parseOrCond(); }

  parseOrCond() {
    let l = this.parseAndCond();
    while (this.peek().t === 'W' && this.peek().v === K.lang.KW_OR) {
      const ln = this.next().line;
      l = { type: 'or', left: l, right: this.parseAndCond(), line: ln };
    }
    return l;
  }

  parseAndCond() {
    let l = this.parseNotCond();
    while (this.peek().t === 'W' && this.peek().v === K.lang.KW_AND) {
      const ln = this.next().line;
      l = { type: 'and', left: l, right: this.parseNotCond(), line: ln };
    }
    return l;
  }

  // Suporta tant `not cond()` com `not(cond())` (Python-compatible)
  parseNotCond() {
    const tok = this.peek();
    if (tok.t === 'W' && tok.v === K.lang.KW_NOT) {
      this.next();
      return { type: 'not', inner: this.parseNotCond(), line: tok.line };
    }
    return this.parseAtomCond();
  }

  parseAtomCond() {
    const tok  = this.peek();
    const line = tok.line;
    const L    = K.lang;

    // Condició entre parèntesis: (a() and b()) or c()
    if (tok.t === '(') {
      this.next();
      const inner = this.parseCond();
      const t = this.peek();
      if (t.t !== ')') this.fail('expected', { want: ')', got: tokLabel(t) }, 'syntax_paren', t.line);
      this.next();
      return inner;
    }

    if (tok.t === 'W') {
      const w = tok.v;
      if (L.CONDS.has(w)) {
        this.next();
        this._eatEmptyParens(w, line);
        return { type: 'condition', name: w, line };
      }
      if (w === 'True' || w === 'False') {
        this.next();
        return { type: 'bool_literal', value: w === 'True', line };
      }
      if (L.COMMANDS.has(w))     this.fail('cmd_as_cond',  { w }, 'syntax_cond', line);
      if (this.procNames.has(w)) this.fail('proc_as_cond', { w }, 'syntax_cond', line);
      if (!L.KEYWORDS.has(w)) {
        const msg = K.tf('parse.unknown_cond', { tok: w, n: line }) + _suggestionText(suggestName(w, [...L.CONDS]));
        throw new KarelSyntaxError(msg, 'syntax_cond', line);
      }
    }
    this.fail('unknown_cond', { tok: tokLabel(tok) }, 'syntax_cond', line);
  }
}

// Comprova, abans d'executar, que totes les funcions cridades existeixin
function checkNames(ast) {
  const L     = K.lang;
  const procs = new Set(ast.filter(n => n.type === 'proc').map(n => n.name));
  const walk  = stmts => {
    for (const s of stmts) {
      if (s.type === 'call' && !procs.has(s.name)) {
        const sug = suggestName(s.name, [...L.COMMANDS, ...procs]);
        const msg = K.tf('parse.unknown_name', { w: s.name, n: s.line })
                  + (sug ? _suggestionText(sug) : K.tf('parse.define_hint', { w: s.name }));
        throw new KarelSyntaxError(msg, 'syntax_name', s.line);
      }
      if (s.type === 'if') { walk(s.then); walk(s.else); }
      if (s.type === 'while' || s.type === 'repeat' || s.type === 'proc') walk(s.body);
    }
  };
  walk(ast);
}

// Parseja codi sense tocar la interfície: retorna l'AST o llança KarelSyntaxError
function parseProgram(code) {
  const ast = new Parser(K.tokenize(code)).parseAll();
  checkNames(ast);
  return ast;
}

// Versió per a la interfície: retorna AST o null (si hi ha error, el mostra)
function parseCode(code) {
  try {
    return parseProgram(code);
  } catch (e) {
    const ln      = (e instanceof KarelSyntaxError) ? e.errorLine : null;
    const errCode = (e instanceof KarelSyntaxError) ? e.code      : 'syntax_instr';
    K.logError(`❌ ${K.t('err.syntax')}: ${e.message}`, errCode, ln);
    if (ln) K.markErrorLine(ln);
    K.setStateUI('error');
    return null;
  }
}

K.KarelSyntaxError = KarelSyntaxError;
K.Parser           = Parser;
K.parseProgram     = parseProgram;
K.parseCode        = parseCode;
K.suggestName      = suggestName;
