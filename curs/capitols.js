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


// ── Dades dels 10 capítols del curs ──────────────────────

const CAPITOLS_DATA = [
  { num: 1,  titol: 'Coneix en Karel',           arxiu: 'capitol-1.html'  },
  { num: 2,  titol: 'Agafa i deixa',             arxiu: 'capitol-2.html'  },
  { num: 3,  titol: "Gestió d'errors en un codi", arxiu: 'capitol-3.html' },
  { num: 4,  titol: 'Repeteix',                  arxiu: 'capitol-4.html'  },
  { num: 5,  titol: 'Procediments',              arxiu: 'capitol-5.html'  },
  { num: 6,  titol: 'Descomposició',             arxiu: 'capitol-6.html'  },
  { num: 7,  titol: 'Condicionals',              arxiu: 'capitol-7.html'  },
  { num: 8,  titol: 'Mentre',                    arxiu: 'capitol-8.html'  },
  { num: 9,  titol: 'Combinant condicions',      arxiu: 'capitol-9.html'  },
  { num: 10, titol: 'Escriure codi net',         arxiu: 'capitol-10.html' },
  { num: 'futur', titol: 'Resum',  arxiu: 'capitol-futur.html' },
];


// ── B.2 — Genera i munta la barra lateral ────────────────

const REPTES_DATA = [
  { num: 1,  titol: 'Recollir la perla',   arxiu: 'repte-1.html' },
  { num: 2,  titol: 'El passadís',         arxiu: 'repte-2.html' },
  { num: 3,  titol: "L'escala diagonal",   arxiu: 'repte-3.html' },
  { num: 4,  titol: 'Distribuir les perles',arxiu: 'repte-4.html' },
  { num: 5,  titol: 'El serpentí',         arxiu: 'repte-5.html' },
  { num: 6,  titol: 'Construir torres',    arxiu: 'repte-6.html' },
  { num: 7,  titol: "L'escala doble",      arxiu: 'repte-7.html' },
  { num: 8,  titol: 'El vigilant',         arxiu: 'repte-8.html' },
  { num: 9,  titol: 'Les files alternes',  arxiu: 'repte-9.html' },
];

function renderReptesSidebar(currentNum) {
  const nav = document.getElementById('sidebar-nav');
  if (!nav) return;

  let html = '<ul class="sidebar-list">';
  for (const r of REPTES_DATA) {
    const isActive = r.num === currentNum;
    const mons = KProgress.monsRepte(r.num);
    const nOk  = mons.filter(Boolean).length;
    const nTot = 3; // sempre 3 mons per repte
    let badge = '';
    if (nOk === nTot) {
      badge = '<span class="prog-badge prog-badge--all" title="Tots els mons superats">✓✓✓</span>';
    } else if (nOk > 0) {
      badge = `<span class="prog-badge prog-badge--part" title="${nOk}/${nTot} mons superats">${nOk}/${nTot}</span>`;
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
  html += '</ul>';
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
  html += '</ul>';
  nav.innerHTML = html;
}


// ── B.4 — Converteix .simulador divs en iframes funcionals ──
//
// Atributs reconeguts al div.simulador:
//
//   MODE 1 MON (capítols 1–9, comportament original):
//   data-map      (string) CSV del mapa (raw, sense escapar)
//   data-goal     (string) CSV de l'estat final esperat
//
//   MODE N MONS (capítol 10, reptes):
//   data-maps     (string) JSON array de CSVs: '["map1","map2","map3"]'
//   data-goals    (string) JSON array de goals paral·lel a data-maps
//                          Les files se separen amb | (barra vertical)
//
//   COMUNS als dos modes:
//   data-code     (string) Codi Karel inicial
//   data-readonly (string) "true" → textarea en mode lectura
//   data-height   (number) alçada en px (340 per defecte, 380 recomanat per a reptes)
//   data-title    (string) text de llegenda sota el simulador (opcional)
//   data-label    (string) badge: 'Exemple' | 'Exercici' | ''
//   data-bag      (number) perles inicials a la motxilla (valor únic per a tots els mons)
//   data-bags     (string) JSON array de perles per món: '[3,5,7]' (prioritari sobre data-bag)
//
// Exemple N mons (capítol 10):
//   <div class="simulador"
//        data-maps='["K>,.,A|.,.,.", "K>,A,.|.,.,.", "K>,.,.|.,A,."]'
//        data-goals='[".,.,K>|.,.,.", ".,.,K>|.,.,.", ".,.,K>|.,.,." ]'
//        data-code="# escriu la solució aquí"
//        data-height="380"
//        data-label="Exercici">
//   </div>
// ════════════════════════════════════════════════════════

let _goalUid = 0;
function nextGoalId() { return 'goal-' + (++_goalUid); }

// ── Construeix la URL de l'iframe a partir de les dades en clar ──
function _iframeSrc(map, code, goalCSV, goalId, readonly, bag, multi) {
  const theme    = document.body.classList.contains('curs-light') ? '&theme=light' : '';
  const roParam  = readonly ? '&readonly=1' : '';
  const bagParam = bag > 0  ? `&bag=${bag}` : '';
  const multiP   = multi    ? '&multi=1'   : '';
  const enc      = s => btoa(unescape(encodeURIComponent(s)));
  const goalP    = goalCSV
    ? `&goal=${encodeURIComponent(enc(goalCSV))}&goalId=${goalId}`
    : '';
  return `../simulador.html?embed=1&map=${encodeURIComponent(enc(map))}&code=${encodeURIComponent(enc(code))}${roParam}${theme}${goalP}${bagParam}${multiP}`;
}

// ── Llegeix el codi de l'editor dins l'iframe (same-origin) ──
function _readCode(iframe) {
  try {
    const ta = iframe.contentWindow.document.getElementById('code-editor');
    return ta ? ta.value : null;
  } catch { return null; }
}

// ── Actualitza el text i les classes de color d'un botó de món ──
function _updateBtnLabel(btn, idx, status) {
  const icons = { pending: '○', ok: '✓', error: '✗' };
  btn.textContent = `Món ${idx + 1} ${icons[status] ?? '○'}`;
  btn.classList.toggle('status-ok',  status === 'ok');
  btn.classList.toggle('status-err', status === 'error');
}

// ── Registre global goalId → context multi-món (per al listener de postMessage) ──
const _multiGoalRegistry = new Map();

// ── Registre global goalId → context 1 món (label + pàgina) ──
const _singleGoalRegistry = new Map();

// ── Renderitza un simulador de N mons (capítol 10) ──
function _renderMultiMon(div) {
  let maps, goals;
  try { maps  = JSON.parse(div.dataset.maps);  } catch { maps  = []; }
  try { goals = JSON.parse(div.dataset.goals); } catch { goals = []; }

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
  let monLabels  = [];
  try { monLabels = JSON.parse(div.dataset.labels); } catch { monLabels = []; }

  // Estat de validació per a cada món
  const monState = maps.map(() => 'pending');
  // GoalId únic per a cada món (buit si no hi ha goal per a aquell món)
  const goalIds  = maps.map((_, i) => goals[i] ? nextGoalId() : '');

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

  // Contenidor relatiu per poder superposar el label de món actiu
  const iframeWrap = document.createElement('div');
  iframeWrap.className = 'simulador-iframe-wrap';

  // Label del món actiu, flotant a dalt-dreta (sobre el mapa)
  const monActiveLabel = document.createElement('div');
  monActiveLabel.className = 'mon-active-label';
  monActiveLabel.textContent = 'Món 1';
  iframeWrap.appendChild(monActiveLabel);

  // iframe (comença al món 0)
  const iframe = document.createElement('iframe');
  iframe.className    = 'simulador-frame';
  iframe.style.height = height + 'px';
  iframe.title        = title || 'Simulador Karel';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allowfullscreen', '');
  iframe.src = _iframeSrc(maps[0], code, goals[0] || '', goalIds[0], readonly, getBag(0), true);
  iframeWrap.appendChild(iframe);
  wrap.appendChild(iframeWrap);

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
    const currentCode = _readCode(iframe) ?? code;
    btns[activeIdx].classList.remove('mon-btn--active');
    btns[newIdx].classList.add('mon-btn--active');
    monActiveLabel.textContent = `Món ${newIdx + 1}`;
    activeIdx = newIdx;
    iframe.src = _iframeSrc(
      maps[newIdx],
      currentCode,
      goals[newIdx] || '',
      goalIds[newIdx],
      readonly,
      getBag(newIdx),
      true
    );
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
      const isLastRepte = typeof CURRENT_REPTE !== 'undefined' && CURRENT_REPTE === lastRepteNum;
      const nextHint = isLastRepte
        ? 'Ja pots practicar amb el simulador.'
        : 'Ja pots passar al repte següent.';
      fbGlobal.textContent = `✓ Tots els mons han estat superats. Bona feina! ${nextHint}`;
    } else if (nErr > 0 || nOk > 0) {
      fbGlobal.className   = 'simulador-feedback fb-error';
      fbGlobal.textContent = `${nOk}/${n} mons superats. Comprova els mons marcats amb ✗.`;
    } else {
      fbGlobal.className   = 'simulador-feedback';
      fbGlobal.textContent = '';
    }
  }

  // Registra cada goalId al registre global perquè el listener de postMessage
  // pugui actualitzar l'estat del botó i el feedback global
  goalIds.forEach((gid, i) => {
    if (!gid) return;
    _multiGoalRegistry.set(gid, {
      monState, btns, idx: i, total: n, updateGlobalFeedback,
      repteNum: typeof CURRENT_REPTE !== 'undefined' ? CURRENT_REPTE : null,
    });
  });

  // Restaura l'estat guardat a localStorage
  if (typeof CURRENT_REPTE !== 'undefined') {
    const saved = KProgress.monsRepte(CURRENT_REPTE);
    saved.forEach((ok, i) => {
      if (ok && i < monState.length) {
        monState[i] = 'ok';
        _updateBtnLabel(btns[i], i, 'ok');
      }
    });
    updateGlobalFeedback();
  }

  div.replaceWith(wrap);
}

// ── Renderitza un simulador d'1 món (comportament original, sense canvis) ──
function _renderSingleMon(div) {
  const rawMap  = div.dataset.map  || '';
  const rawCode = div.dataset.code || '';
  const height  = parseInt(div.dataset.height || '340', 10);
  const readonly = div.dataset.readonly === 'true';
  const title   = div.dataset.title || '';
  const label   = div.dataset.label || '';
  const rawGoal = div.dataset.goal || '';
  const goalCSV = rawGoal;          // ← ja ve amb | directament
  const goalId  = goalCSV ? nextGoalId() : '';
  const bag     = parseInt(div.dataset.bag || '0', 10);

  const map  = rawMap;              // ← ja ve amb | directament
  const code = rawCode.replace(/\\n/g, '\n');  // ← conservar: és codi font, no mapa

  const iframe = document.createElement('iframe');
  iframe.src        = _iframeSrc(map, code, goalCSV, goalId, readonly, bag);
  iframe.className  = 'simulador-frame';
  iframe.style.height = height + 'px';
  iframe.title      = title || 'Simulador Karel';
  iframe.setAttribute('loading', 'lazy');
  iframe.setAttribute('allowfullscreen', '');

  const wrap = document.createElement('div');
  wrap.className = 'simulador-wrap';
  if (label) {
    const badge = document.createElement('span');
    badge.className = `simulador-badge simulador-badge--${label.toLowerCase()}`;
    badge.textContent = label;
    wrap.appendChild(badge);
  }
  wrap.appendChild(iframe);

  if (goalCSV) {
    const fb = document.createElement('div');
    fb.className = 'simulador-feedback';
    fb.dataset.goalId = goalId;
    wrap.appendChild(fb);
    // Registra per al progrés
    _singleGoalRegistry.set(goalId, { label, pageNum: typeof CURRENT_CAPITOL !== 'undefined' ? CURRENT_CAPITOL : null });
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
  document.querySelectorAll('.simulador').forEach(div => {
    if (div.dataset.maps) {
      _renderMultiMon(div);
    } else {
      _renderSingleMon(div);
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
  if (localStorage.getItem('karel-theme') === 'light') {
    document.body.classList.add('curs-light');
  }
})();

function toggleCursTheme() {
  const isLight = document.body.classList.toggle('curs-light');
  localStorage.setItem('karel-theme', isLight ? 'light' : 'dark');
  updateCursThemeBtn();
}

window.injectCursLogo     = injectCursLogo;
window.toggleCursTheme    = toggleCursTheme;
window.updateCursThemeBtn = updateCursThemeBtn;

// ── Listener global de feedback d'exercicis (B.6 + multi-món) ────────
window.addEventListener('message', function(e) {
  if (!e.data) return;
  const { type, goalId, success } = e.data;

  // ── Reset de feedback (qualsevol trigger d'execució) ──
  if (type === 'karel-clear') {
    // Mode 1 món: feedback per data-goal-id
    const fb = document.querySelector(`.simulador-feedback[data-goal-id="${goalId}"]`);
    if (fb) { fb.className = 'simulador-feedback'; fb.textContent = ''; }

    // Mode N mons: neteja l'estat del botó corresponent
    const ctx = _multiGoalRegistry.get(goalId);
    if (ctx) {
      ctx.monState[ctx.idx] = 'pending';
      _updateBtnLabel(ctx.btns[ctx.idx], ctx.idx, 'pending');
      ctx.updateGlobalFeedback();
    }
    return;
  }

  if (type !== 'karel-result') return;

  // ── Mode 1 món ──
  const fb = document.querySelector(`.simulador-feedback[data-goal-id="${goalId}"]`);
  if (fb) {
    if (success) {
      fb.className   = 'simulador-feedback fb-ok';
      fb.textContent = "✓ Correcte! En Karel ha complert tots els objectius.";
    } else {
      fb.className   = 'simulador-feedback fb-error';
      fb.textContent = '✗ El codi és correcte, però en Karel no ha complert l\'objectiu. Modifica el codi i torna-ho a intentar.';
    }
    // Progrés: només guardem si és un Exercici
    const sCtx = _singleGoalRegistry.get(goalId);
    if (sCtx && sCtx.label === 'Exercici' && sCtx.pageNum !== null) {
      KProgress.saveExercici(sCtx.pageNum, success);
      if (success) renderSidebar(sCtx.pageNum);
    }
  }

  // ── Mode N mons ──
  const ctx = _multiGoalRegistry.get(goalId);
  if (ctx) {
    ctx.monState[ctx.idx] = success ? 'ok' : 'error';
    _updateBtnLabel(ctx.btns[ctx.idx], ctx.idx, ctx.monState[ctx.idx]);
    ctx.updateGlobalFeedback();
    // Progrés: guarda l'estat de cada món
    if (ctx.repteNum !== null) {
      KProgress.saveMon(ctx.repteNum, ctx.idx, success);
      if (success) renderReptesSidebar(ctx.repteNum);
    }
  }
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
            <code>turn_left()</code><span>Gira 90° a l'esquerra</span>
            <code>turn_right()</code><span>Gira 90° a la dreta</span>
            <code>turn_around()</code><span>Mitja volta (180°)</span>
            <code>grab()</code><span>Agafa la perla de la casella</span>
            <code>drop()</code><span>Deixa una perla a la casella</span>
          </div>
        </div>

        <div class="glossari-section">
          <h3>Condicions</h3>
          <p class="glossari-hint">Sempre amb parèntesis <code>()</code> — s'usen dins de <code>if</code> i <code>while</code></p>
          <div class="glossari-grid">
            <code>front_is_clear()</code><span>El camí del davant és lliure</span>
            <code>front_is_blocked()</code><span>Hi ha una roca al davant</span>
            <code>left_is_clear()</code><span>L'esquerra és lliure</span>
            <code>left_is_blocked()</code><span>Hi ha una roca a l'esquerra</span>
            <code>right_is_clear()</code><span>La dreta és lliure</span>
            <code>right_is_blocked()</code><span>Hi ha una roca a la dreta</span>
            <code>pearl_here()</code><span>Hi ha una perla aquí</span>
            <code>bag_is_empty()</code><span>La motxilla és buida</span>
            <code>bag_is_full()</code><span>La motxilla té perles</span>
          </div>
        </div>

        <div class="glossari-section">
          <h3>Estructures</h3>
          <p class="glossari-hint">Acaben amb dos punts <code>:</code> i el bloc interior va <strong>indentat</strong></p>
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
          <div class="glossari-rule">③ El codi dins d'un bloc s'ha d'indentar (4 espais)</div>
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
