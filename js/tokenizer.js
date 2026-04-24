// ════════════════════════════════════════════════════════
// tokenizer.js — Funció pura: codi → tokens
//
// Sintaxi Python-compatible:
//   - Blocs per indentació (no per { })
//   - Comentaris amb # (no amb //)
//   - ':' marca final de capçalera d'estructura
//   - Emet INDENT, NL per al parser
// ════════════════════════════════════════════════════════

// Detecta automàticament la unitat d'indentació (espais per nivell)
// a partir del mínim sagnat no nul present al codi.
// Exemples: 2 espais → 2, 3 espais → 3, 4 espais → 4.
function _detectIndentUnit(lines) {
  let min = Infinity;
  for (const raw of lines) {
    const commentIdx = raw.indexOf('#');
    const line = commentIdx === -1 ? raw : raw.slice(0, commentIdx);
    if (line.trim() === '') continue;
    let s = 0;
    while (s < line.length && line[s] === ' ') s++;
    if (s > 0 && s < min) min = s;
  }
  return min === Infinity ? 2 : min;
}

function tokenize(code) {
  const toks  = [];
  const lines = code.split('\n');

  // Detecta la unitat d'indentació una sola vegada per tot el codi.
  // Així 3 espais/nivell, 4 espais/nivell, etc. funcionen tots correctament.
  const indentUnit = _detectIndentUnit(lines);

  for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
    const lineNum = lineIdx + 1;
    const raw     = lines[lineIdx];

    // Eliminar comentari de final de línia (#)
    const commentIdx = raw.indexOf('#');
    const line = commentIdx === -1 ? raw : raw.slice(0, commentIdx);

    // Ignorar línies buides (o que eren només comentari)
    if (line.trim() === '') continue;

    // Calcular nivell d'indentació dividint pels espais detectats com a unitat.
    // Math.round absorbeix 1 espai de desviació accidental (ex: 5 espais amb
    // unitat 4 → nivell 1, no 2).
    let spaces = 0;
    while (spaces < line.length && line[spaces] === ' ') spaces++;
    const indentLevel = Math.round(spaces / indentUnit);
    toks.push({ t: 'INDENT', v: indentLevel, line: lineNum });

    // Tokenitzar la part no-indentada de la línia
    let i = spaces;
    while (i < line.length) {
      const c = line[i];

      // Espai (dins de la línia, fora de la indentació inicial)
      if (c === ' ' || c === '\t') { i++; continue; }

      // Parèntesis i dos-punts
      if (c === '(' || c === ')' || c === ':') {
        toks.push({ t: c, line: lineNum });
        i++;
        continue;
      }

      // Número
      if (/[0-9]/.test(c)) {
        let n = '';
        while (i < line.length && /[0-9]/.test(line[i])) n += line[i++];
        toks.push({ t: 'N', v: parseInt(n, 10), line: lineNum });
        continue;
      }

      // Paraula (keyword, comanda, condició, nom de procediment, o '_')
      // Regex Unicode per suportar lletres accentuades en noms de procediment
      if (/[a-zA-Z_\u00C0-\u024F]/.test(c)) {
        let w = '';
        while (i < line.length && /[a-zA-Z0-9_\u00C0-\u024F]/.test(line[i])) w += line[i++];
        toks.push({ t: 'W', v: w, line: lineNum });
        continue;
      }

      // Caràcter desconegut: saltar
      i++;
    }

    // Fi de línia significatiu
    toks.push({ t: 'NL', line: lineNum });
  }

  toks.push({ t: 'EOF', line: lines.length });
  return toks;
}

K.tokenize = tokenize;
