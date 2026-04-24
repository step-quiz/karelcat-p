// ════════════════════════════════════════════════════════
// progress.js — Progrés de l'alumne via localStorage
//
// Estructura guardada a localStorage['karel_progress']:
// {
//   capitols: { 1: true, 3: true, ... },   // exercici superat
//   reptes:   { 2: [true, false, true], ... } // mons superats
// }
// ════════════════════════════════════════════════════════

const KProgress = (() => {

  const KEY = 'karel_progress';

  function _load() {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || { capitols: {}, reptes: {} };
    } catch (e) {
      return { capitols: {}, reptes: {} };
    }
  }

  function _save(data) {
    try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) {}
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
   * Actualitza l'estat d'un món d'un repte.
   * monIdx és 0-based. success=true mai es desgrava.
   */
  function saveMon(repteNum, monIdx, success) {
    const data = _load();
    if (!data.reptes[repteNum]) data.reptes[repteNum] = [];
    const arr = data.reptes[repteNum];
    // Amplia l'array si cal
    while (arr.length <= monIdx) arr.push(false);
    if (success) arr[monIdx] = true;   // mai desgravem un èxit
    _save(data);
  }

  /** Retorna array de booleans per al repte N ([] si no hi ha dades) */
  function monsRepte(repteNum) {
    return _load().reptes[repteNum] || [];
  }

  /** Esborra tot el progrés */
  function clear() {
    try { localStorage.removeItem(KEY); } catch (e) {}
  }

  return { saveExercici, exerciciSuperat, saveMon, monsRepte, clear };
})();
