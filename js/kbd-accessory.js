/* ──────────────────────────────────────────────────────────────
   Barra d'accessos directes per al teclat nadiu (mòbil).
   Una sola fila amb tecles difícils: ( ) _ # : Tab.
   S'ancora a la part baixa del viewport quan el textarea té focus,
   i fa servir la Visual Viewport API (quan existeix) per quedar
   just a sobre del teclat del sistema.
   ─────────────────────────────────────────────────────────────── */
(function () {
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouch) return;

  const ta = document.getElementById('code-editor');
  if (!ta) return;

  // Tecles: etiqueta → text a inserir
  const KEYS = [
    { label: '(',   text: '(' },
    { label: ')',   text: ')' },
    { label: '_',   text: '_' },
    { label: '#',   text: '#' },
    { label: ':',   text: ':' },
    { label: '↹',   text: '    ' }  // Tab = 4 espais
  ];

  function insert(text) {
    const start = ta.selectionStart;
    const end   = ta.selectionEnd;
    const val   = ta.value;
    ta.value = val.slice(0, start) + text + val.slice(end);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    ta.dispatchEvent(new Event('input', { bubbles: true }));
  }

  // ── Mode embed (dins d'un iframe del curs): NO creem barra local.
  //    Avisem el pare via postMessage quan l'editor té focus, i
  //    inserim els caràcters que el pare ens envia. La barra real
  //    viu al document pare (vegeu curs/capitols.js). ──
  if (window.self !== window.top) {
    ta.addEventListener('focus', () => {
      if (ta.readOnly || ta.disabled) return;
      window.parent.postMessage('karel-editing', '*');
    });
    ta.addEventListener('blur',  () => window.parent.postMessage('karel-idle',    '*'));
    window.addEventListener('message', (e) => {
      const d = e.data;
      if (d && d.type === 'karel-insert' && typeof d.text === 'string') {
        if (document.activeElement !== ta) ta.focus();
        insert(d.text);
      }
    });
    return;
  }

  // ── Mode pantalla completa (simulador.html obert directe): barra local. ──
  const bar = document.createElement('div');
  bar.id = 'kbd-accessory';
  bar.className = 'kbd-accessory kbd-accessory--hidden';
  KEYS.forEach(k => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'kbd-accessory__btn';
    b.textContent = k.label;
    // mousedown/touchstart amb preventDefault: no treu el focus del textarea
    // i, per tant, el teclat nadiu no es tanca.
    b.addEventListener('mousedown', e => { e.preventDefault(); insert(k.text); });
    b.addEventListener('touchstart', e => { e.preventDefault(); insert(k.text); }, { passive: false });
    bar.appendChild(b);
  });
  document.body.appendChild(bar);

  // Posiciona la barra just sobre el teclat nadiu fent servir
  // la Visual Viewport API (Chrome/Safari modern). Si no existeix,
  // cau a position:fixed bottom:0 — el teclat la taparà parcialment
  // però el navegador sol fer scroll al focus i tot funciona.
  const vv = window.visualViewport;

  // Detecta si el teclat nadiu està obert: visualViewport.height
  // baixa significativament respecte de window.innerHeight.
  // Quan és així, marquem el body amb .kbd-open perquè el CSS pugui
  // limitar l'alçada de l'editor i el navegador no hagi de fer un scroll
  // agressiu del textarea cap amunt (que amaga el mapa).
  function syncKbdState() {
    if (!vv) return;
    const keyboardPx = window.innerHeight - vv.height;
    const open = keyboardPx > 150;   // llindar: teclat > 150px
    document.body.classList.toggle('kbd-open', open);
  }

  function reposition() {
    if (!vv) return;
    // offsetTop + height = coordenada Y del fons de la part visible.
    // window.innerHeight - (offsetTop + height) = quant espai ocupa el teclat.
    const bottomOffset = window.innerHeight - (vv.offsetTop + vv.height);
    bar.style.bottom = bottomOffset + 'px';
    syncKbdState();
  }
  if (vv) {
    vv.addEventListener('resize', reposition);
    vv.addEventListener('scroll', reposition);
  }

  ta.addEventListener('focus', () => {
    bar.classList.remove('kbd-accessory--hidden');
    reposition();
  });
  ta.addEventListener('blur', () => {
    // Petit delay: si el blur ha estat per tocar un botó de la barra,
    // el focus tornarà al textarea i no volem parpelleig.
    setTimeout(() => {
      if (document.activeElement !== ta) {
        bar.classList.add('kbd-accessory--hidden');
        document.body.classList.remove('kbd-open');
      }
    }, 100);
  });
})();
