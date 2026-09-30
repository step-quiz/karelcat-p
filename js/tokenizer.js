// ════════════════════════════════════════════════════════
// tokenizer.js — Funció pura: codi → tokens
//
// Sintaxi Python-compatible:
//   - Blocs per indentació, amb les mateixes regles que Python:
//     una pila de nivells d'indentació que emet INDENT i DEDENT.
//   - Un tabulador compta com a salt fins al següent múltiple de 4.
//   - Comentaris amb # (fins al final de la línia)
//   - ':' marca el final de la capçalera d'una estructura
//   - ';' separa instruccions simples a la mateixa línia
//
// Els errors lèxics (caràcters no vàlids, indentació que no quadra
// amb cap nivell anterior) NO es llancen aquí: s'emeten com a tokens
// { t:'ERR', code, ... } i el parser els converteix en errors quan
// hi arriba. Així els errors es mostren en l'ordre del codi.
// ════════════════════════════════════════════════════════

const TAB_WIDTH = 4;

// Caràcters que poden començar / continuar un nom (identificador).
// Inclou lletres accentuades i la ela geminada (col·loca), com Python.
const _ID_START = /[a-zA-Z_À-ɏ]/;
const _ID_CONT  = /[a-zA-Z0-9_·À-ɏ]/;

function _isBlank(c) { return c === ' ' || c === '\t' || c === ' '; }

function tokenize(code) {
  const toks  = [];
  const lines = String(code).replace(/\r\n?/g, '\n').split('\n');
  const stack = [0];          // nivells d'indentació oberts (en columnes)

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineNum = lineIdx + 1;
    const raw     = lines[lineIdx];

    // Eliminar comentari de final de línia (#). En Karel no hi ha cadenes
    // de text, així que un # sempre comença un comentari.
    const commentIdx = raw.indexOf('#');
    const line = commentIdx === -1 ? raw : raw.slice(0, commentIdx);

    // Les línies buides (o només amb comentari) no compten per a la indentació
    if ([...line].every(_isBlank)) continue;

    // Amplada de la indentació (espais = 1 columna; tabulador = fins al múltiple de 4)
    let col = 0, i = 0;
    while (i < line.length && _isBlank(line[i])) {
      col = line[i] === '\t' ? (Math.floor(col / TAB_WIDTH) + 1) * TAB_WIDTH : col + 1;
      i++;
    }

    const top = stack[stack.length - 1];
    if (col > top) {
      stack.push(col);
      toks.push({ t: 'INDENT', line: lineNum });
    } else if (col < top) {
      while (col < stack[stack.length - 1]) {
        stack.pop();
        toks.push({ t: 'DEDENT', line: lineNum });
      }
      if (col !== stack[stack.length - 1]) {
        toks.push({ t: 'ERR', code: 'dedent_mismatch', line: lineNum });
        stack.push(col);   // continuem com si fos un nivell nou per no encadenar errors
      }
    }

    // Tokenitzar la part no indentada de la línia
    while (i < line.length) {
      const c = line[i];

      if (_isBlank(c)) { i++; continue; }

      if (c === '(' || c === ')' || c === ':' || c === ';') {
        toks.push({ t: c, line: lineNum });
        i++;
        continue;
      }

      // Número (enter, opcionalment negatiu: range(-2) és vàlid en Python)
      if (/[0-9]/.test(c) || (c === '-' && /[0-9]/.test(line[i + 1] || ''))) {
        let n = c;
        i++;
        while (i < line.length && /[0-9]/.test(line[i])) n += line[i++];
        toks.push({ t: 'N', v: parseInt(n, 10), line: lineNum });
        continue;
      }

      // Paraula: paraula clau, ordre, condició o nom de funció
      if (_ID_START.test(c)) {
        let w = '';
        while (i < line.length && _ID_CONT.test(line[i])) w += line[i++];
        toks.push({ t: 'W', v: w, line: lineNum });
        continue;
      }

      // Qualsevol altre caràcter no forma part del llenguatge d'en Karel
      toks.push({ t: 'ERR', code: 'bad_char', v: c, line: lineNum });
      i++;
    }

    toks.push({ t: 'NL', line: lineNum });
  }

  // Tanca els blocs que queden oberts al final del programa
  const lastLine = lines.length;
  while (stack.length > 1) {
    stack.pop();
    toks.push({ t: 'DEDENT', line: lastLine });
  }
  toks.push({ t: 'EOF', line: lastLine });
  return toks;
}

K.tokenize = tokenize;
