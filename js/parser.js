// ════════════════════════════════════════════════════════
// parser.js — Classe Parser: tokens → AST
//
// Gramàtica basada en indentació (Python-compatible).
// Els blocs es delimiten per nivell d'INDENT, no per { }.
// ════════════════════════════════════════════════════════

class KarelSyntaxError extends Error {
  constructor(msg, code, line) {
    super(msg);
    this.code      = code;
    this.errorLine = line ?? null;
  }
}

// Tradueix noms de token interns a text llegible per l'alumne
function tokLabel(tok) {
  if (tok.v !== undefined) return tok.v;
  return { NL: '↵', EOF: 'fi del programa', INDENT: 'indentació' }[tok.t] ?? tok.t;
}

class Parser {
  constructor(toks) { this.toks = toks; this.i = 0; }

  // Accés als tokens
  peek(offset = 0) {
    const idx = this.i + offset;
    return idx < this.toks.length ? this.toks[idx] : this.toks[this.toks.length - 1];
  }
  next() { return this.toks[this.i++]; }

  // Retorna el nivell d'indentació del pròxim token, o -1 si EOF
  peekIndent() {
    const tok = this.peek();
    if (tok.t === 'INDENT') return tok.v;
    if (tok.t === 'EOF')    return -1;
    return null; // token no esperat aquí
  }

  // Consumeix un token del tipus (i valor) esperats, o llança error
  eat(t, v) {
    const tok = this.peek();
    if (tok.t !== t || (v !== undefined && tok.v !== v)) {
      const got  = tokLabel(tok);
      const want = v ?? t;
      const errCode = (t === ':')         ? 'syntax_colon'
                    : (t === '(' || t === ')') ? 'syntax_paren'
                    : t === 'N'           ? 'syntax_number'
                    :                       'syntax_instr';
      throw new KarelSyntaxError(
        K.tf('parse.expected', { want, got, n: tok.line }),
        errCode, tok.line
      );
    }
    return this.next();
  }

  // Consumeix NL si és present (final de línia d'una instrucció)
  eatNL() { if (this.peek().t === 'NL') this.next(); }

  // ── Punt d'entrada ──────────────────────────────────────

  parseAll() {
    const stmts = this.parseStmtsAt(0);
    // Ignorar EOF residual
    return stmts;
  }

  // ── Blocs per indentació ─────────────────────────────────

  // Parseja totes les instruccions al nivell exacte `level`
  parseStmtsAt(level) {
    const stmts = [];
    while (this.peekIndent() === level) {
      this.next();                      // consumeix INDENT
      stmts.push(this.parseStmt(level));
    }
    return stmts;
  }

  // Parseja el bloc indentat que segueix una capçalera `... :`
  // parentIndent: el nivell de la capçalera que obre el bloc
  parseBlock(parentIndent) {
    const nextIndent = this.peekIndent();
    if (nextIndent === -1 || nextIndent <= parentIndent) {
      // Bloc buit: error de l'alumne
      const tok = this.peek();
      throw new KarelSyntaxError(
        K.tf('parse.unexpected', { tok: tokLabel(tok), n: tok.line }),
        'syntax_instr', tok.line
      );
    }
    return this.parseStmtsAt(nextIndent);
  }

  // ── Instruccions ─────────────────────────────────────────

  // myIndent: nivell de la instrucció actual (necessari per detectar `else`)
  parseStmt(myIndent) {
    const tok  = this.peek();
    const line = tok.line;
    const L    = K.lang;

    if (tok.t !== 'W') {
      throw new KarelSyntaxError(
        K.tf('parse.unexpected', { tok: tokLabel(tok), n: line }),
        'syntax_instr', line
      );
    }

    const w = tok.v;

    // ── Comanda built-in: move(), turn_left(), etc. ──
    if (L.COMMANDS.has(w)) {
      this.next();
      this.eat('('); this.eat(')');
      this.eatNL();
      return { type: 'command', name: w, line };
    }

    // ── if condicio(): ──
    if (w === L.KW_IF) {
      this.next();                      // consumeix 'if'
      const cond = this.parseCond();
      this.eat(':');
      this.eatNL();
      const thenB = this.parseBlock(myIndent);

      // Detectar `elif` o `else` al mateix nivell d'indentació
      let elseB = [];
      while (this.peekIndent() === myIndent) {
        const nextW = this.peek(1);
        if (nextW.t === 'W' && nextW.v === L.KW_ELIF) {
          // elif → desucrar com a else { if ... }
          this.next();                  // consumeix INDENT
          this.next();                  // consumeix 'elif'
          const elifCond = this.parseCond();
          this.eat(':');
          this.eatNL();
          const elifThen = this.parseBlock(myIndent);
          // Construim un if anidat; la iteració continuarà per encadenar més elif/else
          const elifNode = { type: 'if', cond: elifCond, then: elifThen, else: [], line: nextW.line };
          elseB = [elifNode];
          // Continuar el while: el pròxim elif/else s'enganxarà a AQUEST elifNode
          // Per fer-ho, cal assignar al node intern, no a elseB directament.
          // Reescrivim amb recursió per simplicitat:
          // Detectar si ve un altre elif/else al mateix nivell
          let tail = elifNode;
          while (this.peekIndent() === myIndent) {
            const nw2 = this.peek(1);
            if (nw2.t === 'W' && nw2.v === L.KW_ELIF) {
              this.next(); this.next();
              const c2 = this.parseCond();
              this.eat(':'); this.eatNL();
              const t2 = this.parseBlock(myIndent);
              const n2 = { type: 'if', cond: c2, then: t2, else: [], line: nw2.line };
              tail.else = [n2];
              tail = n2;
            } else if (nw2.t === 'W' && L.KW_ELSE_ALIASES.includes(nw2.v)) {
              this.next(); this.next();
              this.eat(':'); this.eatNL();
              tail.else = this.parseBlock(myIndent);
              break;
            } else {
              break;
            }
          }
          break;  // sortim del while extern
        } else if (nextW.t === 'W' && L.KW_ELSE_ALIASES.includes(nextW.v)) {
          this.next();                  // consumeix INDENT
          this.next();                  // consumeix 'else'
          this.eat(':');
          this.eatNL();
          elseB = this.parseBlock(myIndent);
          break;
        } else {
          break;
        }
      }
      return { type: 'if', cond, then: thenB, else: elseB, line };
    }

    // ── while condicio(): ──
    if (w === L.KW_WHILE) {
      this.next();
      const cond = this.parseCond();
      this.eat(':');
      this.eatNL();
      return { type: 'while', cond, body: this.parseBlock(myIndent), line };
    }

    // ── for <var> in range(N): ──
    // La variable pot ser qualsevol identificador (convencionalment 'i' o '_').
    // El seu valor s'ignora durant l'execució (iteració comptada pura).
    if (w === L.KW_FOR) {
      this.next();                      // consumeix 'for'
      this.eat('W');                    // variable (qualsevol identificador)
      this.eat('W', L.KW_IN);
      this.eat('W', L.KW_RANGE);
      this.eat('(');
      const num = this.eat('N');
      this.eat(')');
      this.eat(':');
      this.eatNL();
      return { type: 'repeat', count: num.v, body: this.parseBlock(myIndent), line };
    }

    // ── def nom(): ──
    if (w === L.KW_DEF) {
      this.next();                      // consumeix 'def'
      const nt = this.peek();
      if (nt.t !== 'W') {
        throw new KarelSyntaxError(
          K.tf('parse.expected_proc', { n: nt.line }),
          'syntax_instr', nt.line
        );
      }
      const name = nt.v;
      this.next();                      // consumeix el nom
      this.eat('('); this.eat(')');
      this.eat(':');
      this.eatNL();
      return { type: 'proc', name, body: this.parseBlock(myIndent), line };
    }

    // ── break ──
    if (w === 'break') {
      this.next();
      this.eatNL();
      return { type: 'break', line };
    }

    // ── Crida a procediment definit per l'alumne: nom() ──
    this.next();
    this.eat('('); this.eat(')');
    this.eatNL();
    return { type: 'call', name: w, line };
  }

  // ── Condicions ───────────────────────────────────────────

  parseCond()    { return this.parseOrCond(); }

  parseOrCond() {
    let l = this.parseAndCond();
    while (this.peek().t === 'W' && this.peek().v === K.lang.KW_OR) {
      const ln = this.peek().line;
      this.next();
      l = { type: 'or', left: l, right: this.parseAndCond(), line: ln };
    }
    return l;
  }

  parseAndCond() {
    let l = this.parseNotCond();
    while (this.peek().t === 'W' && this.peek().v === K.lang.KW_AND) {
      const ln = this.peek().line;
      this.next();
      l = { type: 'and', left: l, right: this.parseNotCond(), line: ln };
    }
    return l;
  }

  parseNotCond() {
    const tok = this.peek();
    if (tok.t === 'W' && tok.v === K.lang.KW_NOT) {
      const line = tok.line;
      this.next();                      // consumeix 'not'
      // Suportar tant `not cond()` com `not(cond())` (Python-compatible)
      if (this.peek().t === '(') {
        this.next();                    // consumeix '('
        const inner = this.parseCond();
        this.eat(')');
        return { type: 'not', inner, line };
      }
      return { type: 'not', inner: this.parseAtomCond(), line };
    }
    return this.parseAtomCond();
  }

  parseAtomCond() {
    const tok = this.peek(), line = tok.line;
    if (tok.t === 'W' && K.lang.CONDS.has(tok.v)) {
      this.next();
      this.eat('('); this.eat(')');
      return { type: 'condition', name: tok.v, line };
    }
    // Boolean literals: True / False
    if (tok.t === 'W' && (tok.v === 'True' || tok.v === 'False')) {
      this.next();
      return { type: 'bool_literal', value: tok.v === 'True', line };
    }
    throw new KarelSyntaxError(
      K.tf('parse.unknown_cond', { tok: tokLabel(tok), n: line }),
      'syntax_cond', line
    );
  }
}

// Parseja codi: retorna AST o null (si error, crida logError)
function parseCode(code) {
  try {
    return new Parser(K.tokenize(code)).parseAll();
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
K.parseCode        = parseCode;
