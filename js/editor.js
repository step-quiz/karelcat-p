// ════════════════════════════════════════════════════════
// editor.js — Ressaltat sintàctic, numeració, autocompletat
// ════════════════════════════════════════════════════════
//
// Arquitectura d'alineació caret ↔ ressaltat
// ──────────────────────────────────────────
// L'editor és un "stack" de 4 capes dins de `.editor-inner`:
//   #line-numbers   (costat esquerre, només numeració)
//   #line-bg        (fons per línia: activa/error)
//   #code-highlight (text ressaltat — <pre>)
//   #code-editor    (textarea transparent, conté el caret)
//
// Perquè el caret del textarea coincideixi píxel a píxel amb el
// text ressaltat, les 4 capes han de compartir el mateix offset de
// scroll en tot moment.
//
// HISTÒRIC: abans fèiem servir `elem.scrollTop / scrollLeft` a les
// capes passives. Això és inherentment LOSSY: el navegador fa clamp
// al rang [0, scrollWidth - clientWidth], i dues capes amb contingut
// lleugerament diferent (p.ex. la línia ressaltada té <span>s extra)
// poden tenir scrollWidths que difereixen per fraccions de píxel.
// Després d'un delete que escurça el contingut, el clamp es recalcula
// asíncronament i les capes divergeixen 1–Npx respecte del textarea.
// El caret queda on era; el text ressaltat s'ha mogut.
//
// SOLUCIÓ: `transform: translate(-scrollLeft, -scrollTop)`. No està
// subjecte a clamp. Si les capes passives i el textarea llegeixen la
// mateixa font (`ta.scrollLeft` / `ta.scrollTop`), el desplaçament és
// IDÈNTICAMENT el mateix. Qualsevol ajust posterior del navegador a
// `ta.scrollLeft` dispara un event `scroll` al textarea, que torna
// a cridar `syncLayers()`.
//
// Això fa el bug impossible per construcció, no "arreglat per a una
// taxonomia concreta de casos".

// ── Ressaltat sintàctic ──

function tokenizeLine(line) {
  const L = K.lang;
  let out = '', i = 0;
  while (i < line.length) {
    const c = line[i];
    if (/\s/.test(c)) {
      let ws = '';
      while (i < line.length && /\s/.test(line[i])) ws += line[i++];
      out += K.escHtml(ws);
    } else if ('():'.includes(c)) {
      out += `<span class="hl-br">${K.escHtml(c)}</span>`;
      i++;
    } else if (/[0-9]/.test(c)) {
      let n = '';
      while (i < line.length && /[0-9]/.test(line[i])) n += line[i++];
      out += `<span class="hl-num">${n}</span>`;
    } else {
      let w = '';
      while (i < line.length && !/[\s():\/]/.test(line[i])) w += line[i++];
      if (w === '') {
        // Caràcter sense categoria (p.ex. '/') — el mostrem tal qual i avancem
        out += K.escHtml(line[i++]);
      } else if (L.KEYWORDS.has(w)) out += `<span class="hl-kw">${K.escHtml(w)}</span>`;
      else if (L.COMMANDS.has(w))   out += `<span class="hl-cmd">${K.escHtml(w)}</span>`;
      else if (L.CONDS.has(w))      out += `<span class="hl-cond">${K.escHtml(w)}</span>`;
      else                          out += `<span class="hl-user">${K.escHtml(w)}</span>`;
    }
  }
  return out;
}

function highlightCode(code) {
  return code.split('\n').map((line, i) => {
    const ln = i + 1;
    const ci = line.indexOf('#');
    const content = ci !== -1
      ? tokenizeLine(line.slice(0, ci)) + `<span class="hl-cm">${K.escHtml(line.slice(ci))}</span>`
      : tokenizeLine(line);
    return `<span class="code-line" id="cln-${ln}">${content}</span>`;
  }).join('\n');
}

function updateLineBg(numLines) {
  const bg = document.getElementById('line-bg');
  if (!bg) return;
  bg.innerHTML = Array.from({ length: numLines }, (_, i) =>
    `<div class="lbg-row" id="lbg-${i + 1}"></div>`
  ).join('');
}


// ── Sincronització de les capes passives ──
//
// Font única de veritat: ta.scrollTop / ta.scrollLeft.
// Aplica `transform: translate(-scrollLeft, -scrollTop)` a:
//   - #code-highlight      (2 eixos)
//   - #line-bg             (només Y)
//   - .ln-inner dins       (només Y)
//     de #line-numbers
//
// El clipping el fan `.editor-inner` (overflow:hidden) i
// `#line-numbers` (overflow:hidden) — les capes poden sobrepassar
// els seus límits lògics sense cap efecte visible.
//
// Idempotent i barata: es pot cridar tantes vegades com calgui.

function syncLayers() {
  const ta = document.getElementById('code-editor');
  if (!ta) return;
  const st = ta.scrollTop;
  const sl = ta.scrollLeft;

  const hl = document.getElementById('code-highlight');
  if (hl) hl.style.transform = `translate(${-sl}px, ${-st}px)`;

  const bg = document.getElementById('line-bg');
  if (bg) bg.style.transform = `translateY(${-st}px)`;

  // Els números de línia viuen dins d'un wrapper intern (.ln-inner)
  // perquè #line-numbers manté el seu padding i background fixos.
  const ln = document.getElementById('line-numbers');
  if (ln) {
    const inner = ln.firstElementChild;
    if (inner) inner.style.transform = `translateY(${-st}px)`;
  }
}


// ── Marcatge de línies (activa / error) ──

function highlightLine(n) {
  document.querySelectorAll('.lbg-row.active').forEach(el => el.classList.remove('active'));
  if (!n) return;
  const row = document.getElementById('lbg-' + n);
  if (!row) return;
  row.classList.add('active');

  const ta = document.getElementById('code-editor');
  if (!ta) return;
  const style   = window.getComputedStyle(ta);
  const lineH   = parseFloat(style.lineHeight);
  const padTop  = parseFloat(style.paddingTop);
  const lineTop = padTop + (n - 1) * lineH;
  const edH     = ta.clientHeight;

  if (lineTop < ta.scrollTop || lineTop + lineH > ta.scrollTop + edH) {
    const target = Math.max(0, lineTop - edH / 2 + lineH / 2);
    ta.scrollTop = target;
    // L'assignació a ta.scrollTop dispararà un 'scroll' event,
    // però cridem syncLayers() aquí mateix per evitar un frame de
    // desalineació visible durant l'execució pas a pas.
    syncLayers();
  }
}

function markErrorLine(n) {
  if (n) document.getElementById('lbg-' + n)?.classList.add('error');
}

function clearLineMarks() {
  document.querySelectorAll('.lbg-row.active, .lbg-row.error')
    .forEach(el => el.classList.remove('active', 'error'));
}


// ── Actualitza l'editor complet ──

function updateEditor() {
  const ta = document.getElementById('code-editor');
  const hl = document.getElementById('code-highlight');
  const ln = document.getElementById('line-numbers');
  const bg = document.getElementById('line-bg');
  if (!ta || !hl || !ln) return;
  const code  = ta.value;
  const lines = code.split('\n');
  hl.innerHTML = highlightCode(code);
  // Els <div> dels números de línia van dins d'un wrapper perquè
  // puguem aplicar transform a aquest wrapper sense moure el padding
  // ni el background del contenidor extern.
  ln.innerHTML = '<div class="ln-inner">' +
    lines.map((_, i) => `<div>${i + 1}</div>`).join('') +
    '</div>';
  if (bg) updateLineBg(lines.length);
  syncLayers();
}


// ── Desa el codi de l'alumne ──
// K.codeStorageKey el decideix main.js: la clau del simulador lliure, la
// d'un exercici del curs (?save=...) o null (exemples: no es desa res).
function saveCode(code) {
  if (K.codeStorageKey) K.lsSet(K.codeStorageKey, code);
}


// ── Edició de text amb suport de «desfer» (Ctrl+Z) ──
// Substitueix el text entre `from` i `to` per `text`. Fa servir
// execCommand perquè el navegador ho afegeixi a l'historial de desfer;
// si no està disponible, modifica el valor directament.

const INDENT = '    ';   // 4 espais per nivell, com diu el glossari

function editText(ta, text, from = ta.selectionStart, to = ta.selectionEnd) {
  ta.focus();
  ta.setSelectionRange(from, to);
  let ok = false;
  try { ok = document.execCommand(text === '' ? 'delete' : 'insertText', false, text); } catch (e) { ok = false; }
  if (!ok) {
    const v = ta.value;
    ta.value = v.slice(0, from) + text + v.slice(to);
    ta.selectionStart = ta.selectionEnd = from + text.length;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

const _lineStart = (v, pos) => v.lastIndexOf('\n', pos - 1) + 1;

// Enter: la línia nova manté la indentació i n'afegeix un nivell després de ':'
function newlineWithIndent(ta) {
  const v = ta.value, s = ta.selectionStart;
  const line   = v.slice(_lineStart(v, s), s);
  const indent = (line.match(/^[ \t]*/) || [''])[0];
  const code   = line.replace(/#.*$/, '').trimEnd();
  editText(ta, '\n' + indent + (code.endsWith(':') ? INDENT : ''));
}

// Tab: sense selecció, espais fins al següent múltiple de 4; amb una
// selecció de diverses línies, indenta totes les línies
function indentSelection(ta) {
  const v = ta.value, s = ta.selectionStart;
  let e = ta.selectionEnd;
  if (!v.slice(s, e).includes('\n')) {
    const col = s - _lineStart(v, s);
    editText(ta, ' '.repeat(4 - (col % 4)));
    return;
  }
  if (v[e - 1] === '\n') e--;
  const ls = _lineStart(v, s);
  const block = v.slice(ls, e).split('\n').map(l => (l.trim() ? INDENT + l : l)).join('\n');
  editText(ta, block, ls, e);
  ta.setSelectionRange(ls, ls + block.length);
}

// Maj+Tab: treu un nivell d'indentació de la línia (o de les línies seleccionades)
function dedentSelection(ta) {
  const v = ta.value, s = ta.selectionStart;
  let e = ta.selectionEnd;
  if (e > s && v[e - 1] === '\n') e--;
  const ls = _lineStart(v, s);
  let le = v.indexOf('\n', e);
  if (le === -1) le = v.length;
  const lines    = v.slice(ls, le).split('\n');
  const newLines = lines.map(l => l.replace(/^( {1,4}|\t)/, ''));
  const block    = newLines.join('\n');
  if (block === lines.join('\n')) return;
  const removedFirst = lines[0].length - newLines[0].length;
  editText(ta, block, ls, le);
  if (s === ta.selectionEnd && s === e) {
    const p = Math.max(ls, s - removedFirst);
    ta.setSelectionRange(p, p);
  } else {
    ta.setSelectionRange(ls, ls + block.length);
  }
}

// Retrocés just després d'espais d'indentació: esborra fins al múltiple de 4 anterior
function backspaceIndent(ta) {
  const v = ta.value, s = ta.selectionStart;
  if (s !== ta.selectionEnd) return false;
  const before = v.slice(_lineStart(v, s), s);
  if (!before.length || /[^ ]/.test(before)) return false;
  const n = before.length % 4 || 4;
  if (n === 1) return false;                 // un sol espai: que ho faci el navegador
  editText(ta, '', s - n, s);
  return true;
}

function autocompleteVisible() {
  return !!document.getElementById('autocomplete')?.classList.contains('visible');
}


// ── Inicialització (cridada des de main.js) ──

function initEditor() {
  const ta = document.getElementById('code-editor');
  if (!ta) return;

  // Canal principal: cada canvi de contingut re-ressalta i re-sincronitza.
  ta.addEventListener('input', () => {
    updateEditor();
    saveCode(ta.value);
    // Safety net: el navegador pot ajustar ta.scrollLeft/scrollTop
    // DESPRÉS de 'input' (clamp al nou max-scroll, scroll per mantenir
    // el caret visible, reflow del teclat virtual en mòbil). Si no es
    // dispara un 'scroll' event explícit, capturem l'estat final al
    // proper (i al següent) frame.
    requestAnimationFrame(() => {
      syncLayers();
      requestAnimationFrame(syncLayers);
    });
  });

  // Scroll nadiu del textarea (rodeta, fletxes, arrossegant) → sync.
  // També captura el clamp automàtic del navegador quan el contingut
  // es fa més curt que la posició de scroll actual després d'un delete.
  ta.addEventListener('scroll', syncLayers);

  // Teclat virtual (mòbil): quan s'obre/tanca, el viewport canvia i
  // el navegador pot reubicar el caret. Re-sincronitzem.
  if (window.visualViewport) {
    const onViewportChange = () => {
      requestAnimationFrame(() => {
        syncLayers();
        requestAnimationFrame(syncLayers);
      });
    };
    window.visualViewport.addEventListener('resize', onViewportChange);
    window.visualViewport.addEventListener('scroll', onViewportChange);
  }

  // Si l'editor canvia de mida (redimensió de finestra, panell del
  // costat, canvi de densitat en mòbil), re-sincronitzem.
  if (window.ResizeObserver) {
    new ResizeObserver(syncLayers).observe(ta);
  }

  ta.addEventListener('keydown', e => {
    // Ctrl+Enter (o Cmd+Enter): equivalent a clicar el botó Executa/Atura
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      K.handleRunClick();
      return;
    }
    if (ta.readOnly) return;
    // Si l'autocompletat és obert, Tab i Enter són seus (vegeu initAutocomplete)
    if (e.key === 'Tab' && !autocompleteVisible()) {
      e.preventDefault();
      if (e.shiftKey) dedentSelection(ta); else indentSelection(ta);
    }
  });

  // Enter i retrocés es tracten a 'beforeinput' (i no a 'keydown') perquè
  // així també funcionen amb els teclats virtuals de les tauletes.
  ta.addEventListener('beforeinput', e => {
    if (ta.readOnly || !e.cancelable || e.isComposing) return;
    if ((e.inputType === 'insertLineBreak' || e.inputType === 'insertParagraph') && !autocompleteVisible()) {
      e.preventDefault();
      newlineWithIndent(ta);
    } else if (e.inputType === 'deleteContentBackward') {
      if (backspaceIndent(ta)) e.preventDefault();
    }
  });

  // Dreceres de teclat globals
  document.addEventListener('keydown', e => {
    const tag = document.activeElement.tagName;
    if (tag === 'TEXTAREA' || tag === 'INPUT') return;
    if (e.key === 'F5')  { e.preventDefault(); K.runProgram(); }
    if (e.key === 'F10') { e.preventDefault(); K.stepProgram(); }
    if (e.key === 'F8')  { e.preventDefault(); K.stopProgram(); }
  });

  initAutocomplete(ta);
}


// ── Autocompletat ──

function initAutocomplete(ta) {
  const ac = document.getElementById('autocomplete');
  if (!ac) return;

  let acItems = [];
  let acIndex = -1;

  function getVocab() {
    const tk = K.CODE_LANGS[K.state.codeLang];
    return [
      ...tk.commands.map(w   => ({ text: w, kind: 'cmd'  })),
      ...tk.conditions.map(w => ({ text: w, kind: 'cond' })),
      ...tk.keywords.map(w   => ({ text: w, kind: 'kw'   })),
    ];
  }

  function currentWord() {
    const before = ta.value.slice(0, ta.selectionStart);
    return (before.match(/[\w\u00B7\u00C0-\u024F]+$/) || [''])[0];
  }

  let _acCanvas = null;
  function caretScreenPos() {
    const rect  = ta.getBoundingClientRect();
    const style = window.getComputedStyle(ta);
    const lineH = parseFloat(style.lineHeight);
    const padT  = parseFloat(style.paddingTop);
    const padL  = parseFloat(style.paddingLeft);
    _acCanvas = _acCanvas || document.createElement('canvas');
    const ctx = _acCanvas.getContext('2d');
    ctx.font  = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const charW = ctx.measureText('m').width;
    const text  = ta.value.slice(0, ta.selectionStart);
    const lines = text.split('\n');
    const row   = lines.length - 1;
    const col   = lines[row].length;
    return {
      top:  rect.top  + padT + row * lineH - ta.scrollTop  + lineH + 2,
      left: rect.left + padL + col * charW - ta.scrollLeft,
    };
  }

  function renderAC() {
    ac.innerHTML = acItems.map((it, i) =>
      `<div class="ac-item${i === acIndex ? ' selected' : ''}"
            data-idx="${i}" data-kind="${it.kind}"
            role="option" aria-selected="${i === acIndex}">${it.text}</div>`
    ).join('');
  }

  function showAC(items) {
    acItems = items;
    acIndex = 0;
    const pos = caretScreenPos();
    const dropH = Math.min(items.length * 27 + 4, 200);
    const top = (pos.top + dropH > window.innerHeight - 8)
      ? pos.top - dropH - parseFloat(window.getComputedStyle(ta).lineHeight) - 4
      : pos.top;
    ac.style.top  = top + 'px';
    ac.style.left = Math.max(4, pos.left) + 'px';
    renderAC();
    ac.classList.add('visible');
  }

  function hideAC() {
    ac.classList.remove('visible');
    acItems = [];
    acIndex = -1;
  }

  function acceptAC(idx) {
    const item = acItems[idx ?? acIndex];
    if (!item) return;
    const word = currentWord();
    const pos  = ta.selectionStart;
    // Les ordres i les condicions porten parèntesis: move → move()
    const needsParens = (item.kind === 'cmd' || item.kind === 'cond') && ta.value[pos] !== '(';
    hideAC();
    editText(ta, item.text + (needsParens ? '()' : ''), pos - word.length, pos);
    hideAC();
    // Assignació a value + selection → possible scroll asíncron
    requestAnimationFrame(syncLayers);
  }

  ta.addEventListener('input', () => {
    const word = currentWord();
    if (word.length < 2) { hideAC(); return; }
    const wordLower = word.toLowerCase();
    const matches = getVocab().filter(it =>
      it.text.startsWith(wordLower) && it.text !== wordLower
    );
    if (matches.length) showAC(matches); else hideAC();
  });

  ta.addEventListener('keydown', e => {
    if (!ac.classList.contains('visible')) return;
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        acIndex = Math.min(acIndex + 1, acItems.length - 1);
        renderAC();
        ac.querySelector('.selected')?.scrollIntoView({ block: 'nearest' });
        break;
      case 'ArrowUp':
        e.preventDefault();
        acIndex = Math.max(acIndex - 1, 0);
        renderAC();
        ac.querySelector('.selected')?.scrollIntoView({ block: 'nearest' });
        break;
      case 'Enter':
      case 'Tab':
        if (acItems.length) { e.preventDefault(); acceptAC(); }
        break;
      case 'Escape':
        e.preventDefault();
        hideAC();
        break;
    }
  });

  ac.addEventListener('mousedown', e => {
    const item = e.target.closest('.ac-item');
    if (!item) return;
    e.preventDefault();
    acceptAC(+item.dataset.idx);
  });

  ta.addEventListener('blur', () => setTimeout(hideAC, 150));
  ta.addEventListener('click', hideAC);
  window.addEventListener('resize', hideAC);
}


// ── Exporta ──

K.highlightLine  = highlightLine;
K.markErrorLine  = markErrorLine;
K.clearLineMarks = clearLineMarks;
K.updateEditor   = updateEditor;
K.initEditor     = initEditor;
K.syncLayers     = syncLayers;   // exposat per si algun altre mòdul en depèn
K.editText       = editText;     // l'usa la barra de tecles tàctil (kbd-accessory.js)
K.indentSelection = indentSelection;
K.dedentSelection = dedentSelection;
