/* ──────────────────────────────────────────────────────────────
   Barra de tecles per a pantalles tàctils (tauletes, mòbils).

   Una fila a sota de l'editor (es pot desplaçar horitzontalment) amb
   els símbols difícils d'escriure amb el teclat virtual, la indentació
   i les instruccions més habituals. Funciona igual al simulador lliure
   i dins dels iframes del curs.

   Els botons no treuen el focus de l'editor (mousedown → preventDefault)
   i escriuen amb K.editText, de manera que Ctrl+Z / desfer funciona.
   Només apareix en dispositius amb punter «groller» (pantalla tàctil
   com a entrada principal) i mai en exemples no editables.
   ─────────────────────────────────────────────────────────────── */
(function () {
  if (!window.matchMedia || !window.matchMedia('(pointer: coarse)').matches) return;

  const ta   = document.getElementById('code-editor');
  const wrap = document.querySelector('.editor-wrap');
  if (!ta || !wrap || ta.readOnly || !K.editText) return;

  const KEYS = [
    { label: '⇥', title: 'Indenta (4 espais)',     act: () => K.indentSelection(ta) },
    { label: '⇤', title: 'Treu un nivell d\'indentació', act: () => K.dedentSelection(ta) },
    { label: '(' }, { label: ')' }, { label: ':' }, { label: '_' }, { label: '#', text: '# ' },
    { sep: true },
    { label: 'move()' }, { label: 'turn_left()' }, { label: 'turn_right()' },
    { label: 'turn_around()' }, { label: 'grab()' }, { label: 'drop()' },
    { sep: true },
    { label: 'if', text: 'if ' }, { label: 'elif', text: 'elif ' }, { label: 'else:' },
    { label: 'while', text: 'while ' }, { label: 'for', text: 'for i in range(' },
    { label: 'def', text: 'def ' }, { label: 'not', text: 'not ' },
    { label: 'front_is_clear()' }, { label: 'pearl_here()' },
  ];

  const bar = document.createElement('div');
  bar.className = 'kbd-bar';
  bar.setAttribute('role', 'toolbar');
  bar.setAttribute('aria-label', 'Tecles per escriure codi');

  for (const k of KEYS) {
    if (k.sep) {
      const s = document.createElement('span');
      s.className = 'kbd-bar__sep';
      bar.appendChild(s);
      continue;
    }
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kbd-bar__btn' + (k.label.length > 2 ? ' kbd-bar__btn--word' : '');
    b.textContent = k.label;
    b.tabIndex = -1;
    if (k.title) b.title = k.title;
    // mousedown amb preventDefault: el focus es queda a l'editor i el
    // teclat virtual no es tanca. L'acció es fa a 'click', així un
    // lliscament per desplaçar la barra no escriu res.
    b.addEventListener('mousedown', e => e.preventDefault());
    b.addEventListener('click', () => {
      if (k.act) k.act();
      else K.editText(ta, k.text ?? k.label);
    });
    bar.appendChild(b);
  }

  wrap.after(bar);
})();
