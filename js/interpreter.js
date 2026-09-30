// ════════════════════════════════════════════════════════
// interpreter.js — Intèrpret (generadors JS)
//
// Yield objectes { cmd, line } per a cada acció.
// Els errors de runtime (iteració infinita, recursió) es senyalen
// amb yield { type:'error', code, msg, line }.
// La capa d'execució (execution.js) consumeix els yields.
// ════════════════════════════════════════════════════════

// Estat complet del món en un string: posició, direcció i motxilla d'en Karel
// i contingut de totes les caselles. Com que els programes d'en Karel no
// tenen variables, tot el que passarà a partir d'un punt del programa depèn
// només d'aquest estat.
function _worldKey() {
  const S = K.state, k = S.karel;
  return `${k.x},${k.y},${k.dir},${k.motxilla}|` + S.world.grid.map(r => r.join('')).join('/');
}

function* runStmts(stmts) {
  for (const s of stmts) {
    yield* runStmt(s);
    if (K.state._break) return;
  }
}

function* runStmt(node) {
  const S = K.state;

  switch (node.type) {
    case 'command':
      yield { cmd: node.name, line: node.line };
      break;

    case 'if':
      yield* runStmts(K.evalCond(node.cond) ? node.then : node.else);
      break;

    case 'while': {
      // Detecció exacta d'iteracions infinites: si a l'inici de dues voltes
      // d'aquest mateix while el món és idèntic, el programa farà exactament
      // el mateix a partir d'aquí i no acabarà mai (principi del colomar).
      const seen = new Set();
      let guard = 50000;
      while (K.evalCond(node.cond)) {
        const key = _worldKey();
        if (seen.has(key)) {
          yield { type: 'error', code: 'inf_loop', msg: K.t('log.inf_loop_same'), line: node.line };
          return;
        }
        seen.add(key);
        if (--guard <= 0) {
          yield { type: 'error', code: 'inf_loop', msg: K.t('log.inf_loop'), line: node.line };
          return;
        }
        yield* runStmts(node.body);
        if (S._break) { S._break = false; break; }
      }
      break;
    }

    case 'repeat': {
      const MAX_REPEAT = 10000;
      if (node.count > MAX_REPEAT) {
        yield { type: 'error', code: 'too_many', msg: K.t('log.too_many'), line: node.line };
        return;
      }
      for (let i = 0; i < node.count; i++) {
        yield* runStmts(node.body);
        if (S._break) { S._break = false; break; }
      }
      break;
    }

    case 'break':
      S._break = true;
      return;

    case 'call': {
      const body = S.procs[node.name];
      if (!body) {
        yield {
          type: 'error', code: 'proc_undef',
          msg: `'${node.name}' (${K.t('log.line')} ${node.line}): ${K.t('err.proc_undef')}`,
          line: node.line,
        };
        return;
      }
      S.callDepth++;
      if (S.callDepth > 50) {
        yield { type: 'error', code: 'deep_rec', msg: K.t('log.deep_rec'), line: node.line };
        S.callDepth = 0;
        return;
      }
      yield* runStmts(body);
      S.callDepth--;
      break;
    }

    case 'proc':
      break; // les definicions de procediment es processen al build
  }
}

K.runStmts = runStmts;
K.runStmt  = runStmt;
