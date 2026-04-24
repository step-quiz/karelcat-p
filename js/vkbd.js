/* ──────────────────────────────────────────────────────────────
   Teclat virtual per a mòbil (simple-keyboard).
   Estratègia: simple-keyboard només dispara events; el textarea
   continua sent la font de veritat. Inserim al cursor i disparem
   un event 'input' perquè el ressaltador i l'autocompletat es
   mantinguin sincronitzats com si fos una pulsació real.
   ─────────────────────────────────────────────────────────────── */
(function () {
  // Activa només en dispositius amb punter groller (mòbil/tablet).
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouch) return;

  const ta = document.getElementById('code-editor');
  if (!ta) return;

  // Suprimeix el teclat natiu del sistema
  ta.setAttribute('inputmode', 'none');
  ta.setAttribute('autocomplete', 'off');
  ta.setAttribute('autocapitalize', 'off');

  // Container per al teclat
  const host = document.createElement('div');
  host.id = 'vkbd-host';
  host.className = 'vkbd-host vkbd-hidden';
  host.innerHTML = '<div class="simple-keyboard"></div>';
  document.body.appendChild(host);

  // Layout pensat per a Karel/Python. Sense fila de nombres per defecte:
  // el codi gairebé no els fa servir. Sense Shift (snake_case minúscula).
  // El botó {num} commuta a la capa numèrica/símbols; {abc} torna enrere.
  const layout = {
    default: [
      'q w e r t y u i o p',
      'a s d f g h j k l _',
      '{num} z x c v b n m {bksp}',
      '# ( ) {space} {enter}'
    ],
    num: [
      '1 2 3 4 5 6 7 8 9 0',
      '! = + - * / < > : ;',
      '{abc} " \' . , _ {bksp}',
      '# ( ) {space} {enter}'
    ]
  };

  const display = {
    '{bksp}':  '⌫',
    '{enter}': '⏎',
    '{num}':   '?123',
    '{abc}':   'ABC',
    '{space}': ' '
  };

  // Espera que simple-keyboard estigui carregat (script al final del body)
  let tries = 0;
  function init() {
    // UMD: window.SimpleKeyboard és la classe directament.
    // ESM:  hi ha un .default. Acceptem tots dos.
    const SK = window.SimpleKeyboard
      && (window.SimpleKeyboard.default || window.SimpleKeyboard);

    if (typeof SK !== 'function') {
      if (++tries > 60) {
        // Fallback: no hem pogut carregar simple-keyboard (CDN? xarxa?).
        // Restaurem el teclat nadiu perquè l'usuari pugui escriure.
        console.warn('[vkbd] simple-keyboard no s\'ha carregat; torno al teclat nadiu.');
        ta.removeAttribute('inputmode');
        host.remove();
        return;
      }
      setTimeout(init, 50);
      return;
    }

    let shifted = false;
    const kb = new SK('.simple-keyboard', {
      layout,
      display,
      layoutName: 'default',
      mergeDisplay: true,
      useMouseEvents: false,
      preventMouseDownDefault: true,     // evita perdre el focus del textarea
      physicalKeyboardHighlight: false,
      onKeyPress: handleKey,
    });

    function handleKey(btn) {
      // Insereix tokens al cursor i dispara 'input' perquè la resta
      // de l'editor (highlight, line numbers, autocomplete) reaccioni.
      ta.focus({ preventScroll: true });
      const start = ta.selectionStart;
      const end   = ta.selectionEnd;
      const val   = ta.value;

      if (btn === '{num}') {
        kb.setOptions({ layoutName: 'num' });
        return;
      }
      if (btn === '{abc}') {
        kb.setOptions({ layoutName: 'default' });
        return;
      }

      let insert = '';
      let caret  = start;

      if (btn === '{bksp}') {
        if (start !== end) {
          ta.value = val.slice(0, start) + val.slice(end);
          caret = start;
        } else if (start > 0) {
          ta.value = val.slice(0, start - 1) + val.slice(end);
          caret = start - 1;
        }
      } else if (btn === '{enter}') {
        insert = '\n';
      } else if (btn === '{space}') {
        insert = ' ';
      } else {
        insert = btn;
      }

      if (insert) {
        ta.value = val.slice(0, start) + insert + val.slice(end);
        caret = start + insert.length;
      }

      ta.selectionStart = ta.selectionEnd = caret;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // Mostrar en tocar el textarea (encara que ja tingui focus)
    const showKbd = () => {
      host.classList.remove('vkbd-hidden');
      // Porta el textarea a dalt del viewport perquè el teclat no el tapi.
      // Fem servir scrollIntoView al proper frame perquè el navegador
      // hagi calculat ja la visual viewport amb el teclat visible.
      requestAnimationFrame(() => {
        try {
          ta.scrollIntoView({ block: 'start', behavior: 'smooth' });
        } catch (e) { /* navegadors antics */ }
      });
    };
    ta.addEventListener('focus', showKbd);
    ta.addEventListener('pointerdown', showKbd);
    ta.addEventListener('click', showKbd);

    // Amagar NOMÉS quan el focus marxa a un altre element interactiu
    // (un altre input, botó…) — no pas en scrollejar o tocar el mapa.
    ta.addEventListener('blur', () => {
      // Espera al cicle següent per veure cap a on ha anat el focus
      setTimeout(() => {
        const a = document.activeElement;
        if (!a || a === document.body) return;            // scroll/tap passiu
        if (a === ta || host.contains(a)) return;         // dins teclat o textarea
        // Només amaguem si el nou focus és un control que probablement
        // necessita el seu propi teclat o és un botó d'acció.
        if (a.matches('input, textarea, [contenteditable]')) {
          host.classList.add('vkbd-hidden');
        }
      }, 0);
    });
  }

  init();
})();
