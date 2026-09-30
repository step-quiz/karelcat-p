// ════════════════════════════════════════════════════════
// curs/capitols.js — Dades dels capítols i helpers de UI del curs
//
// Depèn de: cap (és pur JS sense K.* ni cap altra dependència)
//
// Funcions exportades al window global:
//   injectCursLogo()           — pobla els <span class="logo-icon"></span> buits
//                                amb el SVG de la medusa (font única de veritat)
//   renderSidebar(currentNum)  — omple #sidebar-nav amb la llista de capítols
//   renderSimuladors()         — converteix .simulador divs en iframes funcionals (B.4)
//   initSidebarToggle()        — hamburger per a mòbil (B.2)
//   toggleCursTheme()          — toggle de tema SOLAMENT a curs/index.html
//   updateCursThemeBtn()       — sincronitza icona del botó de tema amb l'estat
// ════════════════════════════════════════════════════════


// ── Logo centralitzat: font única de veritat ─────────────
// Totes les pàgines del curs que vulguin el logo posen al HTML:
//   <span class="logo-icon"></span>
// i capitols.js l'omple automàticament en carregar-se.

const CURS_LOGO_SVG = `<svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor" shape-rendering="crispEdges" width="18" height="18" aria-hidden="true"><rect x="5" y="2" width="1" height="1"/><rect x="6" y="2" width="1" height="1"/><rect x="7" y="2" width="1" height="1"/><rect x="8" y="2" width="1" height="1"/><rect x="9" y="2" width="1" height="1"/><rect x="10" y="2" width="1" height="1"/><rect x="4" y="3" width="1" height="1"/><rect x="5" y="3" width="1" height="1"/><rect x="10" y="3" width="1" height="1"/><rect x="11" y="3" width="1" height="1"/><rect x="3" y="4" width="1" height="1"/><rect x="4" y="4" width="1" height="1"/><rect x="5" y="4" width="1" height="1"/><rect x="6" y="4" width="1" height="1"/><rect x="7" y="4" width="1" height="1"/><rect x="8" y="4" width="1" height="1"/><rect x="9" y="4" width="1" height="1"/><rect x="10" y="4" width="1" height="1"/><rect x="11" y="4" width="1" height="1"/><rect x="12" y="4" width="1" height="1"/><rect x="3" y="5" width="1" height="1"/><rect x="4" y="5" width="1" height="1"/><rect x="5" y="5" width="1" height="1"/><rect x="6" y="5" width="1" height="1"/><rect x="7" y="5" width="1" height="1"/><rect x="8" y="5" width="1" height="1"/><rect x="9" y="5" width="1" height="1"/><rect x="10" y="5" width="1" height="1"/><rect x="11" y="5" width="1" height="1"/><rect x="12" y="5" width="1" height="1"/><rect x="3" y="6" width="1" height="1"/><rect x="4" y="6" width="1" height="1"/><rect x="5" y="6" width="1" height="1"/><rect x="6" y="6" width="1" height="1"/><rect x="7" y="6" width="1" height="1"/><rect x="8" y="6" width="1" height="1"/><rect x="9" y="6" width="1" height="1"/><rect x="10" y="6" width="1" height="1"/><rect x="11" y="6" width="1" height="1"/><rect x="12" y="6" width="1" height="1"/><rect x="3" y="7" width="1" height="1"/><rect x="4" y="7" width="1" height="1"/><rect x="5" y="7" width="1" height="1"/><rect x="6" y="7" width="1" height="1"/><rect x="7" y="7" width="1" height="1"/><rect x="8" y="7" width="1" height="1"/><rect x="9" y="7" width="1" height="1"/><rect x="10" y="7" width="1" height="1"/><rect x="11" y="7" width="1" height="1"/><rect x="12" y="7" width="1" height="1"/><rect x="4" y="8" width="1" height="1"/><rect x="5" y="8" width="1" height="1"/><rect x="6" y="8" width="1" height="1"/><rect x="7" y="8" width="1" height="1"/><rect x="8" y="8" width="1" height="1"/><rect x="9" y="8" width="1" height="1"/><rect x="10" y="8" width="1" height="1"/><rect x="11" y="8" width="1" height="1"/><rect x="4" y="9" width="1" height="1"/><rect x="7" y="9" width="1" height="1"/><rect x="8" y="9" width="1" height="1"/><rect x="11" y="9" width="1" height="1"/><rect x="4" y="10" width="1" height="1"/><rect x="7" y="10" width="1" height="1"/><rect x="8" y="10" width="1" height="1"/><rect x="11" y="10" width="1" height="1"/><rect x="4" y="11" width="1" height="1"/><rect x="7" y="11" width="1" height="1"/><rect x="8" y="11" width="1" height="1"/><rect x="11" y="11" width="1" height="1"/><rect x="3" y="12" width="1" height="1"/><rect x="7" y="12" width="1" height="1"/><rect x="8" y="12" width="1" height="1"/><rect x="12" y="12" width="1" height="1"/><rect x="3" y="13" width="1" height="1"/><rect x="7" y="13" width="1" height="1"/><rect x="8" y="13" width="1" height="1"/><rect x="12" y="13" width="1" height="1"/><rect x="6" y="3" width="1" height="1" fill="#141414"/><rect x="7" y="3" width="1" height="1" fill="#141414"/><rect x="8" y="3" width="1" height="1" fill="#141414"/><rect x="9" y="3" width="1" height="1" fill="#141414"/></svg>`;

function injectCursLogo() {
  document.querySelectorAll('.logo-icon').forEach(el => {
    if (!el.innerHTML.trim()) el.innerHTML = CURS_LOGO_SVG;
  });
}


// ── Dades dels 10 capítols del curs + l'epíleg ───────────

const CAPITOLS_DATA = [
  { num: 1,  titol: 'Coneix en Karel',           arxiu: 'capitol-1.html'  },
  { num: 2,  titol: 'Recollir i deixar',         arxiu: 'capitol-2.html'  },
  { num: 3,  titol: "Gestió d'errors en un codi", arxiu: 'capitol-3.html' },
  { num: 4,  titol: 'Repeteix',                  arxiu: 'capitol-4.html'  },
  { num: 5,  titol: 'Funcions',                  arxiu: 'capitol-5.html'  },
  { num: 6,  titol: 'Descomposició',             arxiu: 'capitol-6.html'  },
  { num: 7,  titol: 'Condicionals',              arxiu: 'capitol-7.html'  },
  { num: 8,  titol: 'Mentre',                    arxiu: 'capitol-8.html'  },
  { num: 9,  titol: 'Combinant condicions',      arxiu: 'capitol-9.html'  },
  { num: 10, titol: 'Codi net',                  arxiu: 'capitol-10.html' },
  { num: 'futur', titol: "D'en Karel al Python", arxiu: 'capitol-futur.html' },
];


// ── B.2 — Genera i munta la barra lateral ────────────────

// `mons` = nombre de mons de test del repte (el test automàtic comprova
// que coincideixi amb la pàgina). Al -p cada repte té UN SOL MÓN (data-map /
// data-goal): és més fàcil d'entendre, i el botó «🎯 Objectiu» mostra com
// ha de quedar. El mode de diversos mons (data-maps) continua funcionant.
const REPTES_DATA = [
  { num: 1,  titol: 'Recollir la perla',    arxiu: 'repte-1.html',  mons: 1 },
  { num: 2,  titol: 'El passadís',          arxiu: 'repte-2.html',  mons: 1 },
  { num: 3,  titol: "L'escala diagonal",    arxiu: 'repte-3.html',  mons: 1 },
  { num: 4,  titol: 'Distribuir les perles', arxiu: 'repte-4.html', mons: 1 },
  { num: 5,  titol: 'El serpentí',          arxiu: 'repte-5.html',  mons: 1 },
  { num: 6,  titol: 'Construir torres',     arxiu: 'repte-6.html',  mons: 1 },
  { num: 7,  titol: "L'escala doble",       arxiu: 'repte-7.html',  mons: 1 },
  { num: 8,  titol: 'El vigilant',          arxiu: 'repte-8.html',  mons: 1 },
  { num: 9,  titol: 'Les files alternes',   arxiu: 'repte-9.html',  mons: 1 },
];

// ── Esborrar el progrés ──
// El botó és a la part de baix de la barra lateral (i al final de l'índex del
// curs), lluny dels botons d'ús freqüent, perquè no s'hi cliqui per error.
function _sidebarFooter() {
  return `
    <div class="sidebar-footer">
      <button type="button" class="karel-clear-btn" onclick="karelClearProgress()"
              title="Esborra d'aquest navegador els capítols i reptes superats i el codi desat dels exercicis">🗑 Esborra el meu progrés</button>
    </div>`;
}

window.karelClearProgress = function () {
  const ok = confirm('Vols esborrar tot el progrés desat en aquest navegador?\n\n'
    + '· els capítols i els reptes marcats com a superats\n'
    + '· el codi que has escrit als exercicis\n\n'
    + 'No es pot desfer.');
  if (!ok) return;
  try {
    if (window.KProgress) KProgress.clear(); else localStorage.removeItem('karel_progress');
    Object.keys(localStorage)
      .filter(k => k.startsWith('karel-code:'))
      .forEach(k => localStorage.removeItem(k));
  } catch (e) { /* localStorage bloquejat: no hi ha res a esborrar */ }
  location.reload();
};

function renderReptesSidebar(currentNum) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  let html = '<ul class="sidebar-list">';
  for (const r of REPTES_DATA) {
    const isActive = r.num === currentNum;
    const nTot  = r.mons;
    const estat = KProgress.estatRepte(r.num, nTot);
    let badge = '';
    if (estat.complet && nTot === 1) {
      badge = '<span class="prog-badge prog-badge--all" title="Repte superat">✓</span>';
    } else if (estat.complet) {
      badge = `<span class="prog-badge prog-badge--all" title="Tots els mons superats amb el mateix codi">✓ ${nTot}/${nTot}</span>`;
    } else if (estat.millor > 0) {
      badge = `<span class="prog-badge prog-badge--part" title="${estat.millor} de ${nTot} mons superats amb un mateix codi">${estat.millor}/${nTot}</span>`;
    }
    html += `
      <li class="sidebar-item${isActive ? ' active' : ''}">
        <a href="${r.arxiu}" class="sidebar-link">
          <span class="sidebar-num">${String(r.num).padStart(2, '0')}</span>
          <span class="sidebar-titol">${r.titol}</span>
          ${badge}
        </a>
      </li>`;
  }
  html += '</ul>' + _sidebarFooter();
  nav.innerHTML = html;
}

function renderSidebar(currentNum) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  let html = '<ul class="sidebar-list">';
  for (const c of CAPITOLS_DATA) {
    const isActive = c.num === currentNum;
    const done = KProgress.exerciciSuperat(c.num);
    const badge = done
      ? '<span class="prog-badge prog-badge--all" title="Exercici superat">✓</span>'
      : '';
    const numLabel = (typeof c.num === 'number')
      ? String(c.num).padStart(2, '0')
      : '—';
    html += `
      <li class="sidebar-item${isActive ? ' active' : ''}">
        <a href="${c.arxiu}" class="sidebar-link">
          <span class="sidebar-num">${numLabel}</span>
          <span class="sidebar-titol">${c.titol}</span>
          ${badge}
        </a>
      </li>`;
  }
  html += '</ul>' + _sidebarFooter();
  nav.innerHTML = html;
}


// ── B.4 — Converteix .simulador divs en iframes funcionals ──
//
// Atributs reconeguts al div.simulador:
//
//   MODE 1 MÓN (capítols):
//   data-map      (string) mapa del món (files separades per |)
//   data-goal     (string) estat final esperat (vegeu parseGoal a js/world.js:
//                          sense K no es comprova la posició; opcions ;motxilla=N
//                          i ;direccio; alternatives separades per salt de línia)
//
//   MODE N MONS (reptes):
//   data-maps     (string) JSON array de mapes: '["map1","map2","map3"]'
//   data-goals    (string) JSON array d'objectius paral·lel a data-maps. Un element
//                          pot ser un array d'alternatives: [".,A,.", [".,A", "A,."]]
//   data-labels   (string) JSON array amb el nom de cada món (opcional)
//
//   COMUNS als dos modes:
//   data-code     (string) Codi Karel inicial
//   data-readonly (string) "true" → textarea en mode lectura
//   data-height   (number) alçada en px (340 per defecte, 380 recomanat per a reptes)
//   data-title    (string) text de llegenda sota el simulador (opcional)
//   data-label    (string) badge: 'Exemple' | 'Exercici' | ''
//   data-bag      (number) perles inicials a la motxilla (valor únic per a tots els mons)
//   data-bags     (string) JSON array de perles per món: '[3,5,7]' (prioritari sobre data-bag)
//   data-error    (string) "sintaxi" | "execucio": l'exemple mostra un error a propòsit
//                          (només el fa servir el test automàtic)
//
// El codi que escriu l'alumne en un simulador editable es desa al
// localStorage amb la clau `karel-code:<pàgina>:<núm. de simulador>`, de
// manera que si surt de la pàgina i hi torna, el recupera.
// ════════════════════════════════════════════════════════

let _goalUid = 0;
function nextGoalId() { return 'goal-' + (++_goalUid); }

// Clau de localStorage per al codi del simulador núm. `idx` d'aquesta pàgina
function _saveKey(idx) {
  const page = location.pathname.split('/').pop() || 'index.html';
  return `karel-code:${page}:${idx}`;
}

// ── Construeix la URL de l'iframe a partir de les dades en clar ──
function _iframeSrc({ map, code, goal = '', goalId = '', readonly = false, bag = 0,
                      multi = false, saveKey = '', cur = null, worlds = null }) {
  const enc = s => encodeURIComponent(btoa(unescape(encodeURIComponent(s))));
  let src = `../simulador.html?embed=1&map=${enc(map)}&code=${enc(code)}`;
  if (document.body.classList.contains('curs-light')) src += '&theme=light';
  if (readonly) src += '&readonly=1';
  if (goal)     src += `&goal=${enc(goal)}&goalId=${goalId}`;
  if (bag > 0)  src += `&bag=${bag}`;
  if (multi)    src += '&multi=1';
  if (saveKey && !readonly) src += `&save=${encodeURIComponent(saveKey)}`;
  if (cur !== null && cur !== undefined) src += `&cur=${enc(cur)}`;
  if (worlds)   src += `&worlds=${enc(JSON.stringify(worlds))}`;
  return src;
}

// ── Llegeix el codi de l'editor dins l'iframe (same-origin) ──
function _readCode(iframe) {
  try {
    const ta = iframe.contentWindow.document.getElementById('code-editor');
    return ta ? ta.value : null;
  } catch { return null; }
}

// ── Botó «Pantalla completa» per a un iframe ──
// A pantalla completa l'editor i el món ocupen tota la pantalla (molt útil
// en portàtils petits i tauletes). Es surt amb Esc, amb el gest «enrere»
// de la tauleta o amb el botó «✕ Surt» que apareix a dins del simulador.
function _fullscreenButton(iframe) {
  const enabled = document.fullscreenEnabled || document.webkitFullscreenEnabled;
  if (!enabled) return null;
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'fs-btn';
  b.textContent = '⛶ Pantalla completa';
  b.title = 'Obre el simulador a pantalla completa (Esc per sortir)';
  b.addEventListener('click', () => {
    const req = iframe.requestFullscreen || iframe.webkitRequestFullscreen;
    if (req) Promise.resolve(req.call(iframe)).catch(() => {});
  });
  return b;
}

// Un objectiu de data-goals pot ser un string o un array d'alternatives
function _goalStr(g) {
  return Array.isArray(g) ? g.join('\n') : (g || '');
}

// ── Actualitza el text i les classes de color d'un botó de món ──
function _updateBtnLabel(btn, idx, status) {
  const icons = { pending: '○', ok: '✓', error: '✗' };
  btn.textContent = `Món ${idx + 1} ${icons[status] ?? '○'}`;
  btn.classList.toggle('status-ok',  status === 'ok');
  btn.classList.toggle('status-err', status === 'error');
}

// ── Registre global goalId → { group, idx } (per al listener de postMessage) ──
const _multiGoalRegistry = new Map();

// ── Registre global goalId → context 1 món (label + pàgina) ──
const _singleGoalRegistry = new Map();

// ── Renderitza un simulador de N mons (reptes) ──
//
// Cada món recorda amb quin codi (empremta codeHash) s'ha superat. Quan el
// codi canvia, els mons superats amb un codi diferent tornen a «pendent»:
// el missatge «Tots els mons superats» vol dir que el codi ACTUAL els
// supera tots, no que cada món s'hagi superat amb un programa diferent.
function _renderMultiMon(div, simIndex) {
  let maps, goals;
  try { maps  = JSON.parse(div.dataset.maps);  } catch { maps  = []; }
  try { goals = JSON.parse(div.dataset.goals); } catch { goals = []; }
  goals = maps.map((_, i) => _goalStr(goals[i]));

  const code     = (div.dataset.code  || '').replace(/\\n/g, '\n');  // ← conservar: és codi font, no mapa
  const height   = parseInt(div.dataset.height || '380', 10);
  const readonly = div.dataset.readonly === 'true';
  const defaultBag = parseInt(div.dataset.bag || '0', 10);
  let bags = [];
  try { bags = JSON.parse(div.dataset.bags); } catch { bags = []; }
  const getBag = i => (bags[i] !== undefined ? bags[i] : defaultBag);
  const label    = div.dataset.label || '';
  const title    = div.dataset.title || '';
  const n        = maps.length;
  const saveKey  = readonly ? '' : _saveKey(simIndex);
  const repteNum = typeof CURRENT_REPTE !== 'undefined' ? CURRENT_REPTE : null;

  // Estat de validació i empremta del codi amb què s'ha superat cada món
  const monState = maps.map(() => 'pending');
  const monHash  = maps.map(() => null);
  // GoalId únic per a cada món (buit si no hi ha goal per a aquell món)
  const goalIds  = maps.map((_, i) => goals[i] ? nextGoalId() : '');
  // Tots els mons, per al botó «Comprova tots els mons» de dins l'iframe
  const worlds   = goals.some(Boolean)
    ? maps.map((m, i) => ({ map: m, goal: goals[i], bag: getBag(i), goalId: goalIds[i] }))
    : null;

  // ── Estructura DOM ──
  const wrap = document.createElement('div');
  wrap.className = 'simulador-wrap simulador-wrap--multi';

  if (label) {
    const badge = document.createElement('span');
    badge.className = `simulador-badge simulador-badge--${label.toLowerCase()}`;
    badge.textContent = label;
    wrap.appendChild(badge);
  }

  // Barra de botons de selecció de món
  const bar = document.createElement('div');
  bar.className = 'mon-switcher';

  const btns = maps.map((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'mon-btn' + (i === 0 ? ' mon-btn--active' : '');
    btn.type = 'button';
    btn.dataset.idx = i;
    _updateBtnLabel(btn, i, 'pending');
    return btn;
  });
  btns.forEach(b => bar.appendChild(b));
  wrap.appendChild(bar);

  const iframeWrap = document.createElement('div');
  iframeWrap.className = 'simulador-iframe-wrap';

  const srcFor = (i, cur) => _iframeSrc({
    map: maps[i], code, goal: goals[i], goalId: goalIds[i], readonly,
    bag: getBag(i), multi: true, saveKey, cur, worlds,
  });

  // iframe (comença al món 0)
  const iframe = document.createElement('iframe');
  iframe.className    = 'simulador-frame';
  iframe.style.height = height + 'px';
  iframe.title        = title || 'Simulador Karel';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allowfullscreen', '');
  iframe.src = srcFor(0, null);
  iframeWrap.appendChild(iframe);
  wrap.appendChild(iframeWrap);

  if (!readonly) {
    const fs = _fullscreenButton(iframe);
    if (fs) bar.appendChild(fs);
  }

  // Feedback global: "X / N mons superats"
  const fbGlobal = document.createElement('div');
  fbGlobal.className = 'simulador-feedback';
  wrap.appendChild(fbGlobal);

  if (title) {
    const cap = document.createElement('p');
    cap.className = 'simulador-caption';
    cap.textContent = title;
    wrap.appendChild(cap);
  }

  // ── Canvi de món: preserva el codi i recarrega l'iframe ──
  let activeIdx = 0;

  function switchMon(newIdx) {
    if (newIdx === activeIdx) return;
    const currentCode = _readCode(iframe);
    btns[activeIdx].classList.remove('mon-btn--active');
    btns[newIdx].classList.add('mon-btn--active');
    activeIdx = newIdx;
    iframe.src = srcFor(newIdx, currentCode);
  }

  bar.addEventListener('click', e => {
    const btn = e.target.closest('.mon-btn');
    if (!btn) return;
    switchMon(parseInt(btn.dataset.idx, 10));
  });

  // ── Actualitza el feedback global ("X / N mons superats") ──
  function updateGlobalFeedback() {
    const nOk  = monState.filter(s => s === 'ok').length;
    const nErr = monState.filter(s => s === 'error').length;
    if (nOk === n) {
      fbGlobal.className   = 'simulador-feedback fb-ok';
      const lastRepteNum = REPTES_DATA[REPTES_DATA.length - 1].num;
      const isLastRepte = repteNum === lastRepteNum;
      const nextHint = isLastRepte
        ? 'Ja pots practicar amb el simulador.'
        : 'Ja pots passar al repte següent.';
      fbGlobal.textContent = `✓ El teu codi supera tots els mons. Bona feina! ${nextHint}`;
    } else if (nErr > 0 || nOk > 0) {
      fbGlobal.className   = 'simulador-feedback fb-error';
      fbGlobal.textContent = `${nOk}/${n} mons superats amb aquest codi. El mateix codi ha de superar-los tots: prova'l als mons marcats amb ○ o ✗ (o prem «Comprova tots els mons»).`;
    } else {
      fbGlobal.className   = 'simulador-feedback';
      fbGlobal.textContent = '';
    }
  }

  function setState(i, state, hash) {
    monState[i] = state;
    monHash[i]  = state === 'pending' ? null : hash;   // amb quin codi s'ha obtingut ✓ o ✗
    _updateBtnLabel(btns[i], i, state);
  }

  // Els mons superats amb un codi diferent de `hash` deixen de valer
  function invalidateOthers(hash) {
    monState.forEach((s, j) => {
      if (s !== 'pending' && monHash[j] !== hash) setState(j, 'pending', null);
    });
  }

  const group = {
    // L'iframe s'ha carregat amb un codi d'empremta `hash`
    onReady(hash) {
      invalidateOthers(hash);
      // Recupera els mons superats en visites anteriors amb aquest mateix codi
      if (repteNum !== null) {
        KProgress.monsRepte(repteNum).forEach((h, j) => {
          if (h && h === hash && j < n) setState(j, 'ok', hash);
        });
      }
      updateGlobalFeedback();
    },
    // El codi ha canviat, o s'ha tornat a executar / reiniciar el món `i`
    onClear(i, hash) {
      setState(i, 'pending', null);
      if (hash) invalidateOthers(hash);
      updateGlobalFeedback();
    },
    // Resultat d'executar el codi d'empremta `hash` al món `i`
    onResult(i, success, hash) {
      setState(i, success ? 'ok' : 'error', hash);
      if (hash) invalidateOthers(hash);
      updateGlobalFeedback();
      if (repteNum !== null && success) {
        KProgress.saveMon(repteNum, i, hash, n);
        renderReptesSidebar(repteNum);
      }
    },
  };

  goalIds.forEach((gid, i) => {
    if (gid) _multiGoalRegistry.set(gid, { group, idx: i });
  });

  div.replaceWith(wrap);
}

// ── Renderitza un simulador d'1 món ──
function _renderSingleMon(div, simIndex) {
  const map      = div.dataset.map  || '';                        // ← ja ve amb | directament
  const code     = (div.dataset.code || '').replace(/\\n/g, '\n'); // ← conservar: és codi font, no mapa
  const height   = parseInt(div.dataset.height || '340', 10);
  const readonly = div.dataset.readonly === 'true';
  const title    = div.dataset.title || '';
  const label    = div.dataset.label || '';
  const goal     = div.dataset.goal || '';
  const goalId   = goal ? nextGoalId() : '';
  const bag      = parseInt(div.dataset.bag || '0', 10);

  const iframe = document.createElement('iframe');
  iframe.src        = _iframeSrc({ map, code, goal, goalId, readonly, bag,
                                   saveKey: readonly ? '' : _saveKey(simIndex) });
  iframe.className  = 'simulador-frame';
  iframe.style.height = height + 'px';
  iframe.title      = title || 'Simulador Karel';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allowfullscreen', '');

  const wrap = document.createElement('div');
  wrap.className = 'simulador-wrap';
  const fs = readonly ? null : _fullscreenButton(iframe);
  if (label || fs) {
    const head = document.createElement('div');
    head.className = 'simulador-head';
    const badge = document.createElement('span');
    badge.className = `simulador-badge simulador-badge--${label.toLowerCase()}`;
    badge.textContent = label;
    head.appendChild(badge);
    if (fs) head.appendChild(fs);
    wrap.appendChild(head);
  }
  wrap.appendChild(iframe);

  if (goal) {
    const fb = document.createElement('div');
    fb.className = 'simulador-feedback';
    fb.dataset.goalId = goalId;
    wrap.appendChild(fb);
    // Registra per al progrés (capítol o repte d'un sol món)
    _singleGoalRegistry.set(goalId, {
      label, fb,
      pageNum:  typeof CURRENT_CAPITOL !== 'undefined' ? CURRENT_CAPITOL : null,
      repteNum: typeof CURRENT_REPTE   !== 'undefined' ? CURRENT_REPTE   : null,
    });
  }

  if (title) {
    const cap = document.createElement('p');
    cap.className = 'simulador-caption';
    cap.textContent = title;
    wrap.appendChild(cap);
  }

  div.replaceWith(wrap);
}

// ── Punt d'entrada: delega al mode adequat segons els atributs ──
function renderSimuladors() {
  document.querySelectorAll('.simulador').forEach((div, idx) => {
    if (div.dataset.maps) {
      _renderMultiMon(div, idx);
    } else {
      _renderSingleMon(div, idx);
    }
  });
}


// ── B.2 — Sidebar toggle (hamburger per a mòbil) ─────────

function initSidebarToggle() {
  const toggle  = document.getElementById('sidebar-toggle');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  if (!toggle || !sidebar) return;

  const open = () => {
    sidebar.classList.add('open');
    if (overlay) overlay.classList.add('visible');
    toggle.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('visible');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? close() : open();
  });

  if (overlay) overlay.addEventListener('click', close);

  // Tanca en navegar (mòbil vertical o horitzontal)
  sidebar.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    if (window.innerWidth <= 820 || window.innerHeight <= 500) close();
  }));
}


// ── Sincronització del tema clar/fosc ─────────────────────
// Les pàgines del curs llegeixen el mateix localStorage que el simulador.

const CURS_ICON_SUN  = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
const CURS_ICON_MOON = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

function updateCursThemeBtn() {
  const btn = document.getElementById('btn-curs-theme');
  if (!btn) return;
  const isLight = document.body.classList.contains('curs-light');
  btn.innerHTML = isLight ? CURS_ICON_MOON : CURS_ICON_SUN;
  btn.title = isLight ? 'Mode fosc' : 'Mode clar';
}

(function applyCursTheme() {
  try {
    if (localStorage.getItem('karel-theme') === 'light') document.body.classList.add('curs-light');
  } catch (e) { /* localStorage bloquejat: es queda el tema per defecte */ }
})();

function toggleCursTheme() {
  const isLight = document.body.classList.toggle('curs-light');
  try { localStorage.setItem('karel-theme', isLight ? 'light' : 'dark'); } catch (e) {}
  updateCursThemeBtn();
}

window.injectCursLogo     = injectCursLogo;
window.toggleCursTheme    = toggleCursTheme;
window.updateCursThemeBtn = updateCursThemeBtn;

// ── Listener global de feedback d'exercicis (B.6 + multi-món) ────────
//
// Missatges que envien els iframes del simulador (js/execution.js):
//   { type:'karel-ready',  goalId, codeHash }            — l'iframe s'ha carregat
//   { type:'karel-clear',  goalId, codeHash }            — codi modificat / nova execució
//   { type:'karel-result', goalId, success, error, codeHash } — ha acabat una execució
window.addEventListener('message', function(e) {
  if (e.origin !== window.location.origin) return;       // només els nostres iframes
  const d = e.data;
  if (!d || typeof d !== 'object') return;
  const { type, goalId, success, error, codeHash } = d;
  const single = _singleGoalRegistry.get(goalId);
  const multi  = _multiGoalRegistry.get(goalId);

  if (type === 'karel-ready') {
    if (multi) multi.group.onReady(codeHash);
    return;
  }

  // ── Reset de feedback (qualsevol trigger d'execució) ──
  if (type === 'karel-clear') {
    if (single) { single.fb.className = 'simulador-feedback'; single.fb.textContent = ''; }
    if (multi) multi.group.onClear(multi.idx, codeHash);
    return;
  }

  if (type !== 'karel-result') return;

  // ── Mode 1 món ──
  if (single) {
    const fb = single.fb;
    if (success) {
      fb.className   = 'simulador-feedback fb-ok';
      const ultim = REPTES_DATA[REPTES_DATA.length - 1].num;
      fb.textContent = single.repteNum === null ? '✓ Molt bé! En Karel arriba a l\'objectiu 🎯.'
        : single.repteNum === ultim ? '✓ Molt bé! En Karel arriba a l\'objectiu 🎯. Has acabat tots els reptes! 🎉'
        : '✓ Molt bé! En Karel arriba a l\'objectiu 🎯. Ja pots passar al repte següent.';
    } else if (error) {
      fb.className   = 'simulador-feedback fb-error';
      fb.textContent = '✗ Hi ha un error. Llegeix el missatge vermell, sota el codi. Canvia el codi i prova-ho una altra vegada.';
    } else {
      fb.className   = 'simulador-feedback fb-error';
      fb.textContent = '✗ En Karel no arriba a l\'objectiu 🎯. Mira les caselles vermelles del món. Clica «🎯 Objectiu» per veure com ha de quedar. Canvia el codi i prova-ho una altra vegada.';
    }
    // Progrés: exercici d'un capítol, o repte d'un sol món
    if (single.label === 'Exercici' && single.pageNum !== null) {
      KProgress.saveExercici(single.pageNum, success);
      if (success) renderSidebar(single.pageNum);
    }
    if (single.repteNum !== null && success) {
      KProgress.saveMon(single.repteNum, 0, codeHash, 1);
      renderReptesSidebar(single.repteNum);
    }
  }

  // ── Mode N mons ──
  if (multi) multi.group.onResult(multi.idx, !!success, codeHash);
});


// ── Glossari — injectat dinàmicament a capítols i reptes ──────────

function initGlossariCurs() {
  const header = document.querySelector('.curs-header');
  if (!header) return;

  // Botó a la capçalera — dins del contenidor d'accions
  const btn = document.createElement('button');
  btn.className = 'glossari-curs-btn';
  btn.id = 'btn-glossari-curs';
  btn.textContent = '📖 Glossari';
  btn.type = 'button';
  const actions = header.querySelector('.curs-header-actions');
  (actions || header).appendChild(btn);

  // Modal
  const overlay = document.createElement('div');
  overlay.className = 'glossari-overlay';
  overlay.id = 'glossari-overlay';
  overlay.innerHTML = `
    <div class="glossari-modal" id="glossari-modal">
      <div class="glossari-header">
        <span class="glossari-title">📖 Glossari</span>
        <button class="glossari-close" id="glossari-close" aria-label="Tanca" type="button">✕</button>
      </div>
      <div class="glossari-body">

        <div class="glossari-section">
          <h3>Instruccions</h3>
          <p class="glossari-hint">Sempre amb parèntesis <code>()</code> al final</p>
          <div class="glossari-grid">
            <code>move()</code><span>Avança una casella</span>
            <code>turn_left()</code><span>Gira a l'esquerra</span>
            <code>turn_right()</code><span>Gira a la dreta</span>
            <code>turn_around()</code><span>Fa mitja volta</span>
            <code>grab()</code><span>Agafa la perla d'aquesta casella</span>
            <code>drop()</code><span>Deixa una perla en aquesta casella</span>
          </div>
        </div>

        <div class="glossari-section">
          <h3>Condicions</h3>
          <p class="glossari-hint">Sempre amb parèntesis <code>()</code>. Van després d'<code>if</code> o de <code>while</code></p>
          <div class="glossari-grid">
            <code>front_is_clear()</code><span>Al davant està lliure: en Karel pot avançar</span>
            <code>front_is_blocked()</code><span>Al davant hi ha una roca o la vora del món</span>
            <code>left_is_clear()</code><span>A l'esquerra està lliure</span>
            <code>left_is_blocked()</code><span>A l'esquerra hi ha una roca o la vora del món</span>
            <code>right_is_clear()</code><span>A la dreta està lliure</span>
            <code>right_is_blocked()</code><span>A la dreta hi ha una roca o la vora del món</span>
            <code>pearl_here()</code><span>En aquesta casella hi ha una perla</span>
            <code>bag_is_empty()</code><span>La motxilla és buida</span>
            <code>bag_has_pearls()</code><span>A la motxilla hi ha perles</span>
          </div>
        </div>

        <div class="glossari-section">
          <h3>Estructures</h3>
          <p class="glossari-hint">Acaben amb dos punts <code>:</code>. Les línies de sota porten <strong>espais al davant</strong></p>
          <pre class="glossari-example">if front_is_clear():
    move()
elif pearl_here():
    grab()
else:
    turn_left()</pre>
          <pre class="glossari-example">while front_is_clear():
    move()</pre>
          <pre class="glossari-example">for i in range(4):
    move()</pre>
          <pre class="glossari-example">def nom_funcio():
    move()
    turn_left()</pre>
        </div>

        <div class="glossari-section glossari-rules">
          <h3>Recorda</h3>
          <div class="glossari-rule">① Les instruccions i condicions porten <code>()</code> sempre</div>
          <div class="glossari-rule">② Després de <code>if</code>, <code>while</code>, <code>for</code>, <code>def</code> cal posar <code>:</code></div>
          <div class="glossari-rule">③ Les línies de sota d'un <code>:</code> porten 4 espais al davant. Quan prems Enter després de <code>:</code>, l'editor posa els espais</div>
        </div>

      </div>
    </div>`;
  document.body.appendChild(overlay);

  // Events
  btn.addEventListener('click', () => overlay.classList.toggle('is-open'));
  overlay.querySelector('#glossari-close').addEventListener('click', () => overlay.classList.remove('is-open'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('is-open'); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') overlay.classList.remove('is-open'); });
}

// Auto-init (capitols.js es carrega després del DOM)
initGlossariCurs();
