// ════════════════════════════════════════════════════════
// main.js — Inicialització: connecta els mòduls del motor
// ════════════════════════════════════════════════════════

// ── Lectura de paràmetres d'URL ──────────────────────────
// Suportat:
//   ?embed=1       → amaga topbar (body.embed, ja aplicat inline al HTML)
//   ?map=BASE64    → mapa inicial (base64 de CSV)
//   ?code=BASE64   → codi inicial de l'exercici (base64 de text)
//   ?readonly=1    → textarea en mode lectura (exemples no editables)
//   ?repte=N       → carrega el repte N de K.REPTES
//   ?theme=light   → força mode clar (ja aplicat inline)
//   ?goal=BASE64   → objectiu de l'exercici (vegeu parseGoal a world.js)
//   ?goalId=ID     → identificador de l'exercici per als missatges al curs
//   ?bag=N         → perles inicials a la motxilla
//   ?save=CLAU     → desa el codi de l'alumne al localStorage amb aquesta clau
//   ?cur=BASE64    → codi actual de l'alumne (en canviar de món, si no hi ha localStorage)
//   ?worlds=BASE64 → JSON [{map, goal, bag, goalId}] de tots els mons d'un repte
//                    (activa el botó «Comprova tots els mons»)

(function init() {
  const S      = K.state;
  const params = new URLSearchParams(location.search);

  // ── Descodifica un paràmetre base64 → string UTF-8 ──
  function decodeParam(b64) {
    try { return decodeURIComponent(escape(atob(b64))); } catch { return null; }
  }

  // ── Determina el mapa i el codi inicials ──
  let initMap        = K.DEFAULT_CSV;
  let initCode       = K.DEFAULT_CODE;
  let fromUrl        = false;     // true quan el contingut ve de la URL o d'un repte
  let enunciatRepte  = null;      // text a mostrar al log per als reptes

  const repteId  = params.get('repte') ? parseInt(params.get('repte'), 10) : null;
  const urlMap   = params.get('map')   ? decodeParam(params.get('map'))  : null;
  const urlCode  = params.get('code')  ? decodeParam(params.get('code')) : null;
  const embed    = params.get('embed') === '1';
  const readonly = params.get('readonly') === '1';

  if (repteId && K.REPTES && K.REPTES[repteId]) {
    const r     = K.REPTES[repteId];
    initMap     = r.map;
    initCode    = r.code;
    enunciatRepte = r.enunciat;
    fromUrl     = true;
  } else if (urlMap || urlCode) {
    if (urlMap)  initMap  = urlMap;
    if (urlCode) initCode = urlCode;
    fromUrl = true;
  }

  // Paràmetres de feedback d'exercici
  const urlGoal   = params.get('goal')   ? decodeParam(params.get('goal')) : null;
  const urlGoalId = params.get('goalId') || null;
  K.goalCSV = urlGoal   || '';
  K.goalId  = urlGoalId || '';

  // Tots els mons del repte (per a «Comprova tots els mons»)
  K.worlds = [];
  if (params.get('worlds')) {
    try { K.worlds = JSON.parse(decodeParam(params.get('worlds'))) || []; } catch { K.worlds = []; }
  }

  // Origen segur per a postMessage cap al pare (evita enviar a '*').
  // S'obté de document.referrer quan el simulador és dins un iframe.
  // Si els fitxers s'obren des del disc (file://) l'origen és 'null' i cal '*'.
  K.parentOrigin = (() => {
    try {
      const o = document.referrer ? new URL(document.referrer).origin : window.location.origin;
      return (o && o !== 'null') ? o : '*';
    } catch { return '*'; }
  })();

  // ── On es desa el codi de l'alumne ──
  //   · simulador lliure (sense res a la URL): la clau de sempre
  //   · exercici del curs (?save=CLAU): una clau pròpia per a cada exercici
  //   · exemples no editables o enllaços amb codi: no es desa
  const saveKey = params.get('save');
  if (!fromUrl && !embed)         K.codeStorageKey = K.LS_KEY_CODE;
  else if (saveKey && !readonly)  K.codeStorageKey = saveKey;
  else                            K.codeStorageKey = null;
  K.initialCode = initCode;

  // 0) Aplica el tema guardat
  K.initTheme();

  // 1) Aplica el llenguatge de programació
  K.applyCodeLang(S.codeLang);

  // 2) Inicialitza la UI mínima
  K.initSpeedSlider();
  K.initGlossari();

  // 3) Carrega el mapa (i l'objectiu, si n'hi ha, per poder-lo mostrar)
  K.initGoalView(K.goalCSV);
  K.loadMapFromCSV(initMap);

  // Inicialitza la motxilla si ve per paràmetre (?bag=N, usat pels simuladors del curs)
  const bagN = params.get('bag') ? parseInt(params.get('bag'), 10) : 0;
  if (bagN > 0) {
    K.state.karel.motxilla    = bagN;
    K.state.karelInit.motxilla = bagN;
    K.updateStatus();
  }

  // 4) Inicialitza l'editor de codi
  K.initEditor();
  const ta = document.getElementById('code-editor');
  if (ta) {
    // Prioritat: codi desat de l'alumne > codi actual (canvi de món) > codi inicial
    const saved  = K.codeStorageKey ? K.lsGet(K.codeStorageKey) : null;
    const urlCur = params.get('cur') ? decodeParam(params.get('cur')) : null;
    ta.value = saved !== null ? saved : (urlCur !== null ? urlCur : initCode);

    // Mode lectura (?readonly=1): l'alumne veu el codi però no el pot editar
    if (readonly) {
      ta.setAttribute('readonly', 'readonly');
      ta.style.cursor = 'default';
      document.body.classList.add('is-readonly');

      // Toast "No editable" en clicar l'editor readonly
      const toast = document.createElement('div');
      toast.className = 'readonly-toast';
      toast.textContent = K.t('ui.readonly');
      document.querySelector('.editor-inner').appendChild(toast);

      let hideTimer = null;
      ta.addEventListener('pointerdown', function() {
        clearTimeout(hideTimer);
        toast.classList.add('visible');
        hideTimer = setTimeout(function() { toast.classList.remove('visible'); }, 1400);
      });
    }

    K.updateEditor();
    setTimeout(() => K.updateEditor(), 50);

    // Esborra el feedback i reseteja el món en qualsevol modificació del codi
    ta.addEventListener('input', () => {
      K.notifyClearFeedback();
      // Reset silent: el codi ha canviat, l'estat anterior ja no és vàlid
      K.stopProgram();
      K.restoreInitialWorld();
    });
  }

  // 5) Botons extra de la barra d'eines (només als exercicis del curs)
  const toolbar   = document.querySelector('.toolbar');
  const speedRow  = document.querySelector('.toolbar .speed-row');
  function addToolbarButton(id, text, title, onClick) {
    if (!toolbar) return;
    const b = document.createElement('button');
    b.className = 'btn';
    b.id = id;
    b.type = 'button';
    b.textContent = text;
    b.title = title;
    b.addEventListener('click', onClick);
    toolbar.insertBefore(b, speedRow || null);
  }

  // «Comprova tots els mons»: el mateix codi a tots els mons del repte
  if (K.worlds.length > 1 && !readonly) {
    addToolbarButton('btn-check-all', K.t('ui.check_all'), K.t('ui.check_all_title'), () => K.checkAllWorlds());
  }

  // «Codi inicial»: recupera el codi amb què començava l'exercici
  if (ta && K.codeStorageKey && K.codeStorageKey !== K.LS_KEY_CODE) {
    addToolbarButton('btn-restore-code', K.t('ui.restore'), K.t('ui.restore_title'), () => {
      if (ta.value === K.initialCode) return;
      if (!confirm(K.t('ui.restore_confirm'))) return;
      ta.value = K.initialCode;
      ta.dispatchEvent(new Event('input', { bubbles: true }));
      K.log(K.t('log.code_restored'), 'dim');
    });
  }

  // «✕ Surt»: quan la pàgina del curs posa aquest iframe a pantalla completa
  try {
    const pd = window.parent !== window ? window.parent.document : null;
    if (pd && (pd.fullscreenEnabled || pd.webkitFullscreenEnabled)) {
      addToolbarButton('btn-exit-fs', K.t('ui.exit_fs'), K.t('ui.exit_fs_title'), () => {
        const exit = pd.exitFullscreen || pd.webkitExitFullscreen;
        if (exit) exit.call(pd);
      });
      const exitBtn = document.getElementById('btn-exit-fs');
      const sync = () => { exitBtn.hidden = !(pd.fullscreenElement || pd.webkitFullscreenElement); };
      pd.addEventListener('fullscreenchange', sync);
      pd.addEventListener('webkitfullscreenchange', sync);
      sync();
    }
  } catch (e) { /* pare d'un altre origen: sense botó */ }

  // «🎯 Objectiu»: mostra, transparent, com ha de quedar el món
  const worldAreaEl = document.getElementById('world-area');
  if (K.goalView && worldAreaEl) {
    const gb = document.createElement('button');
    gb.type = 'button';
    gb.id = 'btn-goal';
    gb.className = 'btn goal-btn';
    gb.addEventListener('click', () => K.cycleGoalView());
    worldAreaEl.appendChild(gb);
    K.updateGoalButton();
  }

  // 6) Auto-escala del grid en redimensionar
  const worldArea = document.getElementById('world-area');
  if (worldArea) {
    let rafId = null;
    new ResizeObserver(() => {
      if (S.world.rows <= 0) return;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => { rafId = null; K.renderWorld(); });
    }).observe(worldArea);
  }

  // 7) Pinta les etiquetes de la UI
  K.updateUI();

  // 8) Mostra l'enunciat del repte al log
  if (enunciatRepte) {
    setTimeout(() => K.log(enunciatRepte, 'inf'), 100);
  }

  // 9) Avisa la pàgina del curs que ja estem a punt (i amb quin codi)
  K.notifyReady();
})();
