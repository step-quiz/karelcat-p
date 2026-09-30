// ════════════════════════════════════════════════════════
// progress.js — Progrés de l'alumne via localStorage
//
// Estructura guardada a localStorage['karel_progress']:
// {
//   capitols: { 1: true, 3: true, ... },            // exercici superat
//   reptes:   { 2: { mons: ['a1b2c3d4', null, 'a1b2c3d4'],
//                    complet: false }, ... }
// }
// A `mons` es desa, per a cada món superat, l'empremta (codeHash) del codi
// amb què es va superar. Un repte només és complet quan TOTS els mons
// s'han superat amb el MATEIX codi (la mateixa empremta). Així no es pot
// superar cada món amb un programa diferent fet a mida.
// Un cop complet, queda complet per sempre (mai no es desgrava).
//
// Format antic (abans de les empremtes): reptes: { 2: [true, false, true] }.
// Es continua llegint: cada `true` compta com una mateixa empremta 'antic'.
// ════════════════════════════════════════════════════════

const KProgress = (() => {

  const KEY = 'karel_progress';

  function _load() {
    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (d && typeof d === 'object') return { capitols: d.capitols || {}, reptes: d.reptes || {} };
    } catch (e) { /* localStorage bloquejat o dades malmeses */ }
    return { capitols: {}, reptes: {} };
  }

  function _save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
  }

  // Normalitza l'entrada d'un repte (accepta el format antic)
  function _repte(data, repteNum) {
    const r = data.reptes[repteNum];
    if (Array.isArray(r)) return { mons: r.map(ok => ok ? 'antic' : null), complet: false };
    if (r && Array.isArray(r.mons)) return { mons: r.mons, complet: !!r.complet };
    return { mons: [], complet: false };
  }

  // ── Capítols ──────────────────────────────────────────

  /** Marca l'exercici d'un capítol com a superat (només si success=true; mai es desgrava) */
  function saveExercici(capitolNum, success) {
    if (!success) return;
    const data = _load();
    data.capitols[capitolNum] = true;
    _save(data);
  }

  /** Retorna true si l'exercici del capítol N ha estat superat */
  function exerciciSuperat(capitolNum) {
    return !!_load().capitols[capitolNum];
  }

  // ── Reptes ────────────────────────────────────────────

  /**
   * Desa que el món `monIdx` (0-based) del repte s'ha superat amb el codi
   * d'empremta `codeHash`. `total` és el nombre de mons del repte.
   * Els fracassos no es desen (mai no es desgrava un èxit).
   */
  function saveMon(repteNum, monIdx, codeHash, total) {
    if (!codeHash) return;
    const data = _load();
    const r = _repte(data, repteNum);
    while (r.mons.length <= monIdx) r.mons.push(null);
    r.mons[monIdx] = codeHash;
    if (total > 0 && _millor(r.mons, total) >= total) r.complet = true;
    data.reptes[repteNum] = r;
    _save(data);
  }

  /** Empremtes desades per a cada món del repte N (null = no superat) */
  function monsRepte(repteNum) {
    return _repte(_load(), repteNum).mons;
  }

  // Quants mons s'han superat, com a màxim, amb un mateix codi
  function _millor(mons, total) {
    const counts = {};
    let millor = 0;
    for (const h of mons.slice(0, total)) {
      if (!h) continue;
      counts[h] = (counts[h] || 0) + 1;
      millor = Math.max(millor, counts[h]);
    }
    return millor;
  }

  /** { complet, millor }: complet si tots els mons s'han superat amb el mateix codi */
  function estatRepte(repteNum, total) {
    const r = _repte(_load(), repteNum);
    const millor = _millor(r.mons, total);
    return { complet: r.complet || (total > 0 && millor >= total), millor };
  }

  /** Esborra tot el progrés */
  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  return { saveExercici, exerciciSuperat, saveMon, monsRepte, estatRepte, clear };
})();
