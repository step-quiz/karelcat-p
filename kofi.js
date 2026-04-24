(function () {
  // Mode embed (iframes del curs): no mostrem el ko-fi per no saturar l'UI.
  try {
    if (new URLSearchParams(window.location.search).get('embed') === '1') return;
  } catch (e) { /* ignore */ }

  // ── Estils ────────────────────────────────────────────────────────────────
  var style = document.createElement('style');
  style.textContent = [
    /* Botó Ko-fi */
    '.kofi-wrap {',
    '  position: fixed; top: 16px; left: 16px; z-index: 301;',
    '  opacity: 0; pointer-events: none;',
    '  transition: opacity 0.5s ease;',
    '}',
    '.kofi-wrap.kofi-show { opacity: 1; pointer-events: auto; }',

    '.kofi-btn {',
    '  position: relative; white-space: nowrap;',
    '  padding: 8px 16px; border-radius: 24px; font-weight: 700; font-size: 14px;',
    '  color: #fff; border: none; background: #ff5e5b;',
    '  box-shadow: 0 4px 14px rgba(0,0,0,0.18); cursor: pointer;',
    '  text-decoration: none; display: inline-block;',
    '  -webkit-tap-highlight-color: transparent;',
    '  font-family: var(--mono, "Space Mono", "Courier New", monospace);',
    '}',

    '.kofi-wrap.kofi-show .kofi-btn { animation: kofi-shake-blink 2.5s ease-out forwards; }',
    '@keyframes kofi-shake-blink {',
    '  0%   { transform: translateX(0);    background: #fbbf24; }',
    '  8%   { transform: translateX(-7px); background: #94a3b8; }',
    '  16%  { transform: translateX( 7px); background: #fbbf24; }',
    '  24%  { transform: translateX(-6px); background: #94a3b8; }',
    '  32%  { transform: translateX( 6px); background: #fbbf24; }',
    '  40%  { transform: translateX(-5px); background: #94a3b8; }',
    '  48%  { transform: translateX( 5px); background: #fbbf24; }',
    '  56%  { transform: translateX(-4px); background: #94a3b8; }',
    '  64%  { transform: translateX( 4px); background: #fbbf24; }',
    '  72%  { transform: translateX(-3px); background: #94a3b8; }',
    '  80%  { transform: translateX( 3px); background: #fbbf24; }',
    '  90%  { transform: translateX(-1px); background: #94a3b8; }',
    '  100% { transform: translateX(0);    background: #ff5e5b; }',
    '}',

    '.sparks-container { position: absolute; top: 50%; left: 50%; width: 0; height: 0; pointer-events: none; }',
    '.spark { position: absolute; width: 7px; height: 7px; border-radius: 50%; opacity: 0; transform-origin: center; }',
    '.kofi-wrap.kofi-show .spark { animation: spark-fly 1.1s ease-out forwards; }',
    '@keyframes spark-fly {',
    '  0%   { opacity: 1; transform: rotate(var(--a)) translateY(0)      scale(1); }',
    '  60%  { opacity: 0.9; }',
    '  100% { opacity: 0;   transform: rotate(var(--a)) translateY(-72px) scale(0.3); }',
    '}',
    '.sp1 { --a:   0deg; background: #f59e0b; animation-delay: 1.75s; }',
    '.sp2 { --a:  45deg; background: #ef4444; animation-delay: 1.80s; }',
    '.sp3 { --a:  90deg; background: #a855f7; animation-delay: 1.85s; }',
    '.sp4 { --a: 135deg; background: #10b981; animation-delay: 1.90s; }',
    '.sp5 { --a: 180deg; background: #3b82f6; animation-delay: 1.95s; }',
    '.sp6 { --a: 225deg; background: #f59e0b; animation-delay: 2.00s; }',
    '.sp7 { --a: 270deg; background: #ec4899; animation-delay: 2.05s; }',
    '.sp8 { --a: 315deg; background: #14b8a6; animation-delay: 2.10s; }',

    /* Spotlight overlay */
    '.kofi-spotlight {',
    '  position: fixed; inset: 0; z-index: 300;',
    '  opacity: 0; pointer-events: none;',
    '  transition: opacity 0.5s ease;',
    '  /* El gradient es fixa per JS en el moment de l\'activació */',
    '}',
    '.kofi-spotlight.kofi-show {',
    '  opacity: 1;',
    '  /* Clicable fora del botó per tancar */',
    '  pointer-events: auto;',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ── Markup ────────────────────────────────────────────────────────────────
  // Overlay de spotlight (s'insereix ABANS del wrap perquè quedi per sota)
  var spotlight = document.createElement('div');
  spotlight.className = 'kofi-spotlight';
  spotlight.id = 'kofiSpotlight';
  document.body.appendChild(spotlight);

  var wrap = document.createElement('div');
  wrap.className = 'kofi-wrap';
  wrap.id = 'kofiWrap';
  wrap.innerHTML =
    '<div class="sparks-container">' +
      '<div class="spark sp1"></div><div class="spark sp2"></div>' +
      '<div class="spark sp3"></div><div class="spark sp4"></div>' +
      '<div class="spark sp5"></div><div class="spark sp6"></div>' +
      '<div class="spark sp7"></div><div class="spark sp8"></div>' +
    '</div>' +
    '<a class="kofi-btn" href="https://ko-fi.com/davidarsocivil" target="_blank" rel="noopener"' +
    '   aria-label="Invita\'m a un cafè a Ko-fi">☕ Ko-fi</a>';
  document.body.appendChild(wrap);

  // ── Tancar l'efecte ────────────────────────────────────────────────────────
  function hideKofi() {
    spotlight.classList.remove('kofi-show');
    wrap.classList.remove('kofi-show');
  }

  // Clic fora (sobre l'overlay fosc) → tanca
  spotlight.addEventListener('click', hideKofi);

  // ── Comptador de visites ───────────────────────────────────────────────────
  // Incrementem el comptador a cada càrrega. Quan arriba al total, es dispara
  // l'efecte i el comptador es torna a 0.
  var KOFI_THRESHOLD = 1000;
  var visits = parseInt(localStorage.getItem('kofiVisits') || '0', 10) + 1;
  if (visits >= KOFI_THRESHOLD) {
    localStorage.setItem('kofiVisits', '0');
  } else {
    localStorage.setItem('kofiVisits', String(visits));
    return; // Encara no toca → sortim sense muntar res
  }

  // ── Activació (5 s de retard) ──────────────────────────────────────────────
  setTimeout(function () {
    // Calcula el centre del botó en coordenades de viewport
    var btn   = wrap.querySelector('.kofi-btn');
    var rect  = btn.getBoundingClientRect();
    var cx    = rect.left + rect.width  / 2;
    var cy    = rect.top  + rect.height / 2;

    // Radi interior: zona completament il·luminada (just envolta el botó)
    var rInner = Math.max(rect.width, rect.height) * 0.85;
    // Radi exterior: on el dim arriba al 40% (transició suau)
    var rOuter = rInner * 2.4;

    spotlight.style.background =
      'radial-gradient(circle at ' + cx + 'px ' + cy + 'px, ' +
        'transparent '              + rInner + 'px, ' +
        'rgba(0,0,0,0.6) '          + rOuter + 'px)';

    spotlight.classList.add('kofi-show');
    wrap.classList.add('kofi-show');

    // Un cop acabades totes les animacions (la més llarga: última espurna a 2.10 s + 1.1 s = 3.20 s),
    // apaguem el focus de teatre i tornem la pantalla a plena lluminositat.
    setTimeout(function () {
      spotlight.classList.remove('kofi-show');
    }, 3300);
  }, 3000);
})();
