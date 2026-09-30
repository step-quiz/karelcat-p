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
    conditions: ['front_is_clear','front_is_blocked','left_is_clear','left_is_blocked','right_is_clear','right_is_blocked','pearl_here','bag_is_empty','bag_has_pearls'],
    // Noms antics que es continuen acceptant (no surten a l'autocompletat)
    condition_aliases: { bag_is_full: 'bag_has_pearls' },
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
      cont:      '▶ Continua',
      step:      '⏭ Pas',
      step_title: 'Executa una sola instrucció (i atura l\'execució contínua)',
      reset:     '↺ Reinicia',
      speed:     'Velocitat:',
      bag:       'Motxilla:',
      readonly:  'No editable',
      check_all: '✓ Comprova tots els mons',
      check_all_title: 'Executa el mateix codi a tots els mons del repte i marca quins supera',
      goal:      '🎯 Objectiu',
      goal_title: 'Mostra, transparent, com ha de quedar el món (una ✕ vermella marca les perles que hi sobren). Torna-hi a clicar per amagar-ho',
      goal_title_alts: 'Mostra, transparent, com ha de quedar el món (una ✕ vermella marca les perles que hi sobren). N\'hi ha diverses possibilitats: cada clic mostra la següent',
      exit_fs:   '✕ Surt',
      exit_fs_title: 'Surt de la pantalla completa',
      restore:   '⟲ Codi inicial',
      restore_title: 'Torna a posar el codi amb què començava l\'exercici',
      restore_confirm: 'Vols esborrar el teu codi i tornar a començar amb el codi inicial de l\'exercici?',
    },

    state: {
      idle:    'aturat',
      running: 'executant',
      step:    'pas a pas',
      error:   'error',
    },

    speed: ['Molt lent', 'Lent', 'Normal', 'Ràpid', 'Molt ràpid', 'Màxim'],

    dir: ["a l'Est", 'al Sud', "a l'Oest", 'al Nord'],   // mateix ordre que K.DIRS

    log: {
      running:    '▶ Executant…',
      step_mode:  '⏭ Mode pas a pas',
      done:       '✓ Programa acabat',
      reset:      '↺ Reiniciat',
      map_loaded: 'Mapa carregat ✓',
      line:       'línia',
      inf_loop:   '⚠ S\'ha detectat una iteració indefinida que no acabarà mai',
      inf_loop_same: '⚠ Aquest while no acabarà mai: en Karel ha tornat exactament a la mateixa situació (casella, direcció, motxilla i perles) que en una volta anterior',
      deep_rec:   '⚠ Recursió massa profunda',
      too_many:   '⚠ range() massa gran: el màxim és 10.000 repeticions',
      drop_occupied: '⚠ {cmd}: ja hi ha una perla aquí — la teva es queda a la motxilla',
      code_restored: '⟲ S\'ha recuperat el codi inicial de l\'exercici',
      check_all:  'Comprovació de tots els mons amb el mateix codi:',
      world_ok:   'Món {i}: ✓ superat',
      world_fail: 'Món {i}: ✗ en Karel no arriba a l\'objectiu',
      world_err:  'Món {i}: ✗ error a la línia {n}: {msg}',
      all_ok:     '✓ El codi supera tots els mons!',
      diff_title: '✗ En Karel no ha arribat a l\'objectiu (diferències en vermell al món):',
      diff_missing_1: '• hi falta 1 perla (la perla transparent)',
      diff_missing:   '• hi falten {n} perles (les perles transparents)',
      diff_extra_1:   '• hi sobra 1 perla',
      diff_extra:     '• hi sobren {n} perles',
      diff_karel: '• en Karel no ha acabat a la casella de l\'objectiu (la medusa transparent)',
      diff_dir:   '• en Karel hauria d\'acabar mirant cap {dir}',
      diff_bag:   '• perles a la motxilla: n\'hi hauria d\'haver {want} i n\'hi ha {got}',
    },

    err: {
      rock:       'En Karel ha xocat',
      no_pearl:   'No hi ha cap perla en aquesta casella',
      bag_empty:  'En Karel no té cap perla a la motxilla i no en pot deixar cap',
      proc_undef: 'Aquesta funció no existeix, no l\'has definida prèviament',
      syntax:     'Error de sintaxi',
      too_long:   'El programa ha fet massa passos (potser no acaba mai)',
    },

    parse: {
      expected:      "Línia {n}: he llegit '{got}' però jo esperava llegir '{want}'",
      unexpected:    "Línia {n}: no esperava '{tok}'",
      unknown_cond:  "Línia {n}: no conec la condició '{tok}'.",
      expected_proc: "Línia {n}: falta el nom de la funció",
      missing_colon: "Línia {n}: falten els dos punts ':' al final de la línia",
      missing_parens:"Línia {n}: a '{w}' li falten els parèntesis: escriu {w}()",
      no_args:       "Línia {n}: {w}() no porta res dins dels parèntesis",
      indent_expected: "Línia {n}: falta el bloc de '{hdr}': a sota hi ha d'haver almenys una instrucció indentada (amb espais al davant)",
      indent_unexpected: "Línia {n}: aquesta línia té espais al davant, però no és dins de cap bloc. Només s'indenten les línies que hi ha a sota d'una línia acabada en ':'",
      dedent_mismatch: "Línia {n}: la indentació no coincideix amb la de cap línia de més amunt. Revisa quants espais hi ha al davant",
      one_per_line:  "Línia {n}: només hi pot haver una instrucció per línia (després de '{prev}' hi ha '{tok}')",
      block_same_line: "Línia {n}: després de ':' no hi pot haver un '{kw}' a la mateixa línia. Posa'l a la línia de sota, indentat",
      break_outside: "Línia {n}: 'break' només es pot fer servir a dins d'un while o d'un for",
      else_without_if: "Línia {n}: aquest '{kw}' no té cap 'if' just a sobre, amb la mateixa indentació",
      def_nested:    "Línia {n}: les funcions s'han de definir fora de qualsevol bloc (sense espais al davant de 'def')",
      def_builtin:   "Línia {n}: '{w}' ja és una instrucció d'en Karel. Posa un altre nom a la teva funció",
      def_keyword:   "Línia {n}: '{w}' és una paraula reservada de Python i no pot ser el nom d'una funció",
      bad_char:      "Línia {n}: el caràcter '{c}' no es pot fer servir aquí",
      unknown_name:  "Línia {n}: no conec '{w}()'.",
      did_you_mean:  " Volies dir {s}()?",
      case_hint:     " (en Python, les majúscules i les minúscules són diferents)",
      define_hint:   " Si és una funció teva, l'has de definir amb 'def {w}():'",
      cond_as_cmd:   "Línia {n}: '{w}()' és una condició: només es pot fer servir dins d'un if o d'un while",
      cmd_as_cond:   "Línia {n}: '{w}()' és una instrucció, no una condició. Condicions són, per exemple, front_is_clear() o pearl_here()",
      proc_as_cond:  "Línia {n}: '{w}()' és una funció teva, i les funcions no poden fer de condició",
      for_syntax:    "Línia {n}: el for s'escriu així: for i in range(4):",
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
  for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(v);
  return s;
}

K.t  = t;
K.tf = tf;
