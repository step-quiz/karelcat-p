// ════════════════════════════════════════════════════════
// js/i18n-facil.js — Textos en català de LECTURA FÀCIL (només karelcat2-p)
//
// Aquest fitxer NO existeix a karelcat2. Es carrega just després de
// js/i18n.js i substitueix textos de K.UI_LANGS.ca per versions més fàcils
// per a alumnat de Primària i d'aula d'acollida, que aprèn català mentre
// programa. Els textos que no surten aquí es queden com a js/i18n.js.
//
// Per què un fitxer a part: així tota la resta de js/ pot ser IDÈNTICA a
// karelcat2. Per portar millores del motor n'hi ha prou de copiar js/ de
// karelcat2 (sense esborrar aquest fitxer) i revisar si hi ha claus noves
// a K.UI_LANGS.ca que calgui simplificar aquí.
//
// Criteris de lectura fàcil (vegeu docs/CURRENT-STATE.md, secció 10):
//   · frases curtes, una idea per frase, en present;
//   · sempre les mateixes paraules: en Karel, casella, perla, roca, vora,
//     motxilla, instrucció, condició, funció, línia, espais;
//   · sense punts cardinals (dreta, esquerra, amunt, avall);
//   · un emoji al començament ajuda a reconèixer el missatge.
//
// Cal conservar els marcadors entre claus: {n}, {w}, {tok}, {cmd}, etc.
// ════════════════════════════════════════════════════════

(function () {
  const FACIL = {
    ui: {
      step_title:      'Fes només una instrucció',
      check_all_title: 'Prova el mateix codi a tots els mons',
      goal_title:      'Mira com ha de quedar el món. Clica una altra vegada per amagar-ho',
      goal_title_alts: 'Mira com ha de quedar el món. Hi ha més d\'una possibilitat: clica per veure la següent',
      exit_fs_title:   'Surt de la pantalla completa',
      restore_title:   'Torna al codi del principi',
      restore_confirm: 'Vols esborrar el teu codi i començar de nou?',
    },

    // Mateix ordre que K.DIRS: dreta, avall, esquerra, amunt
    dir: ['a la dreta ➡️', 'avall ⬇️', 'a l\'esquerra ⬅️', 'amunt ⬆️'],

    log: {
      done:          '✓ Fi del programa',
      inf_loop:      '⚠ Aquest while no s\'acaba mai',
      inf_loop_same: '⚠ Aquest while no s\'acaba mai. En Karel torna a estar igual: la mateixa casella, la mateixa direcció i les mateixes perles',
      deep_rec:      '⚠ Una funció es crida a ella mateixa massa vegades',
      too_many:      '⚠ El número de range() és massa gran. El màxim és 10.000',
      drop_occupied: '⚠ {cmd}: aquí ja hi ha una perla. La teva perla es queda a la motxilla 🎒',
      code_restored: '⟲ Tornes a tenir el codi del principi',
      check_all:     'Prova del mateix codi a tots els mons:',
      world_ok:      'Món {i}: ✓ molt bé',
      world_fail:    'Món {i}: ✗ en Karel no arriba a l\'objectiu 🎯',
      world_err:     'Món {i}: ✗ error a la línia {n}: {msg}',
      all_ok:        '✓ El codi funciona a tots els mons!',
      diff_title:     '✗ En Karel no arriba a l\'objectiu 🎯. Mira les caselles vermelles:',
      diff_missing_1: '• Falta 1 perla (la perla transparent)',
      diff_missing:   '• Falten {n} perles (les perles transparents)',
      diff_extra_1:   '• Sobra 1 perla',
      diff_extra:     '• Sobren {n} perles',
      diff_karel:     '• En Karel ha d\'acabar a la casella de la medusa transparent',
      diff_dir:       '• En Karel ha de mirar {dir}',
      diff_bag:       '• 🎒 A la motxilla hi ha d\'haver {want} perles. Ara hi ha {got} perles',
    },

    err: {
      rock:       '💥 En Karel ha xocat. Al davant hi ha una roca o la vora del món',
      no_pearl:   '⚪ Aquí no hi ha cap perla. En Karel no pot agafar res',
      bag_empty:  '🎒 La motxilla és buida. En Karel no pot deixar cap perla',
      proc_undef: 'Aquesta funció no existeix',
      syntax:     'Codi mal escrit',
      too_long:   'El programa fa massa passos. Potser no s\'acaba mai',
    },

    parse: {
      expected:          "Línia {n}: aquí ha d'anar '{want}', però hi ha '{got}'",
      unexpected:        "Línia {n}: '{tok}' no va aquí",
      unknown_cond:      "Línia {n}: '{tok}' no és una condició",
      expected_proc:     "Línia {n}: falta el nom de la funció",
      missing_colon:     "Línia {n}: falten els dos punts ':' al final de la línia",
      missing_parens:    "Línia {n}: falten els parèntesis. Escriu {w}()",
      no_args:           "Línia {n}: dins de {w}() no hi va res",
      indent_expected:   "Línia {n}: sota '{hdr}' hi ha d'haver una línia amb espais al davant",
      indent_unexpected: "Línia {n}: sobren els espais al davant. Només porten espais les línies de sota d'una línia amb ':'",
      dedent_mismatch:   "Línia {n}: els espais del davant no quadren amb les línies de dalt. Compta els espais",
      one_per_line:      "Línia {n}: a cada línia només hi va una instrucció. Posa '{tok}' a la línia de sota",
      block_same_line:   "Línia {n}: posa '{kw}' a la línia de sota, amb espais al davant",
      break_outside:     "Línia {n}: 'break' només va dins d'un while o d'un for",
      else_without_if:   "Línia {n}: aquest '{kw}' necessita un 'if' just a sobre, amb els mateixos espais al davant",
      def_nested:        "Línia {n}: 'def' no pot tenir espais al davant",
      def_builtin:       "Línia {n}: '{w}' ja és una instrucció d'en Karel. Tria un altre nom per a la teva funció",
      def_keyword:       "Línia {n}: '{w}' és una paraula de Python. Tria un altre nom per a la teva funció",
      bad_char:          "Línia {n}: el signe '{c}' no va aquí",
      unknown_name:      "Línia {n}: '{w}()' no existeix.",
      did_you_mean:      " Vols dir {s}()?",
      case_hint:         " (Compte: les majúscules i les minúscules són diferents)",
      define_hint:       " Si és una funció teva, falta 'def {w}():'",
      cond_as_cmd:       "Línia {n}: '{w}()' és una condició. Va després d'un if o d'un while",
      cmd_as_cond:       "Línia {n}: '{w}()' és una instrucció, no una condició. Una condició és, per exemple, front_is_clear() o pearl_here()",
      proc_as_cond:      "Línia {n}: '{w}()' és una funció teva. Una funció no pot ser una condició",
      for_syntax:        "Línia {n}: el for s'escriu així: for i in range(4):",
    },
  };

  // Copia FACIL dins de K.UI_LANGS.ca (només les claus que hi ha a FACIL)
  function merge(dst, src) {
    for (const [k, v] of Object.entries(src)) {
      if (v && typeof v === 'object' && !Array.isArray(v) && dst[k] && typeof dst[k] === 'object') merge(dst[k], v);
      else dst[k] = v;
    }
  }
  merge(K.UI_LANGS.ca, FACIL);
})();
