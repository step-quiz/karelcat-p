// ════════════════════════════════════════════════════════
// i18n.js — Vocabulari del llenguatge + textos d'interfície
//
// Dos eixos ortogonals i independents:
//   K.CODE_LANGS[codeLang]  →  paraules que l'alumne escriu al codi
//   K.UI_LANGS[uiLang]      →  textos que l'alumne llegeix a la pantalla
//
// Ara: codeLang='en', uiLang='ca'. Afegir un altre codeLang o uiLang
// és tan senzill com afegir una entrada a l'objecte corresponent.
// ════════════════════════════════════════════════════════


// ── Vocabulari del llenguatge de programació ──

K.CODE_LANGS = {
  en: {
    _name: 'English (Python)',
    commands:   ['move','turn_left','turn_right','turn_around','grab','drop'],
    conditions: ['front_is_clear','front_is_blocked','left_is_clear','left_is_blocked','right_is_clear','right_is_blocked','pearl_here','bag_is_empty','bag_is_full'],
    keywords:   ['if','elif','else','while','for','in','range','def','not','and','or','break','True','False'],
    if_kw:      'if',
    elif_kw:    'elif',
    else_kw:    ['else'],
    while_kw:   'while',
    for_kw:     'for',
    in_kw:      'in',
    range_kw:   'range',
    def_kw:     'def',
    not_kw:     'not',
    and_kw:     'and',
    or_kw:      'or',
  },
};


// ── Textos d'interfície ──

K.UI_LANGS = {
  ca: {
    _name: 'Català',

    ui: {
      run:       '▶ Executa',
      stop:      '■ Atura',
      reset:     '↺ Reinicia',
      speed:     'Velocitat:',
      bag:       'Motxilla:',
      readonly:  'No editable',
    },

    state: {
      idle:    'aturat',
      running: 'executant',
      step:    'pas a pas',
      error:   'error',
    },

    speed: ['Molt lent', 'Lent', 'Normal', 'Ràpid', 'Molt ràpid', 'Màxim'],

    log: {
      running:    '▶ Executant…',
      step_mode:  '⏭ Mode pas a pas',
      done:       '✓ Programa acabat',
      reset:      '↺ Reiniciat',
      map_loaded: 'Mapa carregat ✓',
      line:       'línia',
      inf_loop:   '⚠ S\'ha detectat una iteració indefinida que no acabarà mai',
      deep_rec:   '⚠ Recursió massa profunda',
    },

    err: {
      rock:       'En Karel ha xocat',
      no_pearl:   'No hi ha cap perla en aquesta casella',
      bag_empty:  'En Karel no té cap perla a la motxilla i no en pot deixar cap',
      proc_undef: 'Aquesta funció no existeix, no l\'has definida prèviament',
      syntax:     'Error de sintaxi',
    },

    parse: {
      expected:      "Línia {n}: he llegit '{got}' però jo esperava llegir '{want}'",
      unexpected:    "Línia {n}: no esperava '{tok}'",
      unknown_cond:  "Línia {n}: condició desconeguda '{tok}'",
      expected_proc: "Línia {n}: falta el nom de la funció",
    },
  },
};


// ── Sistema d'idioma: lectura dels textos d'interfície ──

function t(key) {
  const parts = key.split('.');
  let obj = K.UI_LANGS[K.state.uiLang];
  for (const k of parts) obj = obj?.[k];
  return (obj !== undefined && obj !== null) ? String(obj) : key;
}

function tf(key, vars) {
  let s = t(key);
  for (const [k, v] of Object.entries(vars)) s = s.replace(`{${k}}`, v);
  return s;
}

K.t  = t;
K.tf = tf;
