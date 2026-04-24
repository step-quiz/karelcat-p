// ════════════════════════════════════════════════════════
// state.js — Estat centralitzat (substitueix les globals disperses)
// ════════════════════════════════════════════════════════

K.state = {
  // Idiomes (ortogonals: un és el del codi, l'altre el de la interfície)
  codeLang:     'en',
  uiLang:       'ca',
  currentState: 'idle',

  // Món
  world:     { grid: [], rows: 0, cols: 0 },
  worldInit: [],
  karel:     { x: 0, y: 0, dir: 0, motxilla: 0 },
  karelInit: { x: 0, y: 0, dir: 0, motxilla: 0 },

  // Execució
  running:     false,
  stepMode:    false,
  interpreter: null,
  tickTimer:   null,
  stepDelay:   K.SPEED_DELAYS[1],

  // Intèrpret
  procs:      {},
  callDepth:  0,
  _break:     false,
  stepCount:  0,
};

// ── Tokens dinàmics del parser (configurats per applyCodeLang) ──

K.lang = {
  COMMANDS:        new Set(),
  CONDS:           new Set(),
  KEYWORDS:        new Set(),
  KW_IF:           '',
  KW_ELIF:         '',
  KW_WHILE:        '',
  KW_FOR:          '',
  KW_IN:           '',
  KW_RANGE:        '',
  KW_ELSE_ALIASES: [],
  KW_DEF:          '',
  KW_NOT:          '',
  KW_AND:          '',
  KW_OR:           '',
  CMD_TO_ACTION:   {},
  COND_TO_ACTION:  {},
};

// Aplica el llenguatge de programació (tokens del parser)
function applyCodeLang(lang) {
  const tk = K.CODE_LANGS[lang];
  const L  = K.lang;
  L.COMMANDS        = new Set(tk.commands);
  L.CONDS           = new Set(tk.conditions);
  L.KEYWORDS        = new Set(tk.keywords);
  L.KW_IF           = tk.if_kw;
  L.KW_ELIF         = tk.elif_kw;
  L.KW_WHILE        = tk.while_kw;
  L.KW_FOR          = tk.for_kw;
  L.KW_IN           = tk.in_kw;
  L.KW_RANGE        = tk.range_kw;
  L.KW_ELSE_ALIASES = tk.else_kw;
  L.KW_DEF          = tk.def_kw;
  L.KW_NOT          = tk.not_kw;
  L.KW_AND          = tk.and_kw;
  L.KW_OR           = tk.or_kw;
  L.CMD_TO_ACTION   = {};
  L.COND_TO_ACTION  = {};
  tk.commands.forEach((c, i)   => L.CMD_TO_ACTION[c]  = K.CMD_ACTIONS[i]);
  tk.conditions.forEach((c, i) => L.COND_TO_ACTION[c] = K.COND_ACTIONS[i]);
}

K.applyCodeLang = applyCodeLang;

