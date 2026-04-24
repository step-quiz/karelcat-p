# Adding `uiLang: 'es'` (Spanish) to KarelCat

## Context for the AI implementor

KarelCat has two orthogonal language axes defined in `js/i18n.js`:

- **`codeLang`** (`K.state.codeLang`): the programming vocabulary the student types. Always `'en'`. The tokens `move()`, `turn_left()`, `while`, `if`, `def`, `range`, `not`, `and`, `or`, `True`, `False`, `break`, etc. are **immutable** and must never be translated.
- **`uiLang`** (`K.state.uiLang`): the human language shown on screen — buttons, error messages, log entries, tooltips, challenge descriptions. Currently only `'ca'` (Catalan) exists.

Your task is to add `'es'` (Spanish) as a second `uiLang` option. The coding-language remains English in all cases.

---

## Step 1 — Add the `es` block to `K.UI_LANGS` in `js/i18n.js`

Insert a sibling entry to `ca` inside `K.UI_LANGS`. The structure must mirror `ca` exactly — same keys, same nesting. Here is the complete block:

```javascript
es: {
  _name: 'Español',

  ui: {
    run:       '▶ Ejecutar',
    stop:      '■ Detener',
    reset:     '↺ Reiniciar',
    speed:     'Velocidad:',
    bag:       'Mochila:',
  },

  state: {
    idle:    'detenido',
    running: 'ejecutando',
    step:    'paso a paso',
    error:   'error',
  },

  speed: ['Muy lento', 'Lento', 'Normal', 'Rápido', 'Muy rápido', 'Máximo'],

  log: {
    running:    '▶ Ejecutando…',
    step_mode:  '⏭ Modo paso a paso',
    done:       '✓ Programa terminado',
    reset:      '↺ Reiniciado',
    map_loaded: 'Mapa cargado ✓',
    line:       'línea',
    inf_loop:   '⚠ Bucle infinito detectado',
    deep_rec:   '⚠ Recursión demasiado profunda',
  },

  err: {
    rock:       'Karel ha chocado contra una roca',
    no_pearl:   'No hay ninguna perla en esta casilla',
    bag_empty:  'La mochila está vacía',
    proc_undef: 'Procedimiento no definido',
    syntax:     'Error de sintaxis',
  },

  parse: {
    expected:      "Línea {n}: he leído '{got}' pero esperaba '{want}'",
    unexpected:    "Línea {n}: no esperaba '{tok}'",
    unknown_cond:  "Línea {n}: condición desconocida '{tok}'",
    expected_proc: "Línea {n}: falta el nombre del procedimiento",
  },
},
```

## Step 2 — Identify and migrate hardcoded Catalan strings

Several UI-visible strings bypass `K.t()` and are written as Catalan literals. Each one must be moved into both `K.UI_LANGS.ca` and `K.UI_LANGS.es`, then replaced with a `K.t()` call. The exhaustive list follows.

### 2.1 `js/ui.js` — theme toggle tooltip (line ~96)

Current code:
```javascript
btn.title = isLight ? 'Mode fosc' : 'Mode clar';
```

Add to `UI_LANGS.ca.ui` / `UI_LANGS.es.ui`:
```javascript
// ca:
theme_dark:  'Mode fosc',
theme_light: 'Mode clar',
// es:
theme_dark:  'Modo oscuro',
theme_light: 'Modo claro',
```

Replace with:
```javascript
btn.title = isLight ? K.t('ui.theme_dark') : K.t('ui.theme_light');
```

### 2.2 `js/execution.js` — drop on existing pearl (line ~92)

Current code:
```javascript
K.log(`⚠ ${cmd}: ja hi ha una perla aquí — la teva es conserva`, 'inf');
```

Add to `UI_LANGS.ca.err` / `UI_LANGS.es.err`:
```javascript
// ca:
drop_exists: 'Ja hi ha una perla aquí — la teva es conserva',
// es:
drop_exists: 'Ya hay una perla aquí — la tuya se conserva',
```

Replace with:
```javascript
K.log(`⚠ ${cmd}: ${K.t('err.drop_exists')}`, 'inf');
```

### 2.3 `js/constants.js` — `DEFAULT_CODE` (line ~89)

Current code:
```javascript
const DEFAULT_CODE = `# Benvingut a Karel!\n# Prem Executa per veure en Karel moure's\n\nmove()\nmove()\n`;
```

Replace the single string with a per-language object:
```javascript
const DEFAULT_CODES = {
  ca: `# Benvingut a Karel!\n# Prem Executa per veure en Karel moure's\n\nmove()\nmove()\n`,
  es: `# ¡Bienvenido a Karel!\n# Pulsa Ejecutar para ver a Karel moverse\n\nmove()\nmove()\n`,
};
```

Export as `K.DEFAULT_CODES` instead of `K.DEFAULT_CODE`. Then in `js/main.js`, where `initCode` is assigned, resolve it:
```javascript
let initCode = K.DEFAULT_CODES[S.uiLang] || K.DEFAULT_CODES.ca;
```

### 2.4 `js/reptes.js` — challenge titles, descriptions, and starter code

Every entry in `K.REPTES` contains `titol`, `enunciat`, and `code` as plain Catalan strings. Convert each to a `{ca, es}` object:

```javascript
1: {
  titol:    { ca: 'Primers passos', es: 'Primeros pasos' },
  enunciat: {
    ca: '🎯 Repte 1 — Primers passos: En Karel s\'ha de moure fins a la perla i recollir-la.',
    es: '🎯 Reto 1 — Primeros pasos: Karel debe moverse hasta la perla y recogerla.',
  },
  map: `K>,.,.,A,.,.|.,.,.,.,.,.|.,.,.,.,.,.`,
  code: {
    ca: `# Repte 1: Primers passos\n# Porta en Karel fins a la perla i recull-la.\n\n`,
    es: `# Reto 1: Primeros pasos\n# Lleva a Karel hasta la perla y recógela.\n\n`,
  },
},
```

The `map` field is language-independent and stays as a plain string.

Then update `js/main.js` where challenge data is read (inside the `if (repteId && K.REPTES ...)` block) to resolve by `uiLang`:

```javascript
const r       = K.REPTES[repteId];
const lang    = S.uiLang;
initMap       = r.map;
initCode      = (typeof r.code === 'object') ? (r.code[lang] || r.code.ca) : r.code;
enunciatRepte = (typeof r.enunciat === 'object') ? (r.enunciat[lang] || r.enunciat.ca) : r.enunciat;
```

This pattern (object with fallback to `ca`) keeps backward compatibility if some entries haven't been translated yet.

### 2.5 `index.html` — initial HTML text content

The following hardcoded strings appear in the HTML before any JS runs:

- `<span id="state-lbl">aturat</span>` (line 58)
- `<span id="lbl-bag">Motxilla:</span>` (line 60)
- `▶ Executa` inside `#btn-run` (line 76)
- `↺ Reinicia` inside `#btn-reset` (line 77)
- `Velocitat:` inside `#lbl-speed` (line 79)
- `Lent` inside `#speed-lbl` (line 81)

These are all overwritten by `K.updateUI()` and `K.setStateUI()` on init. However, to avoid a brief flash of Catalan when `uiLang` is `es`, either:

**(A)** Leave them empty and let JS fill them (simplest):
```html
<span id="state-lbl"></span>
<span id="lbl-bag"></span>
```

**(B)** Or set them inline from the early `<script>` block that already reads URL params.

Option A is recommended.

## Step 3 — Language selection mechanism

The `uiLang` must be set **before** `K.updateUI()` runs in `main.js`. Insert this logic at the top of the `init()` IIFE, right after `const params = ...`:

```javascript
// Resolve uiLang: URL param > localStorage > browser detection > 'ca'
const urlLang     = params.get('lang');
const savedLang   = localStorage.getItem('karel-uilang');
const browserLang = navigator.language.slice(0, 2);
S.uiLang = [urlLang, savedLang, browserLang].find(l => l && K.UI_LANGS[l]) || 'ca';
document.documentElement.lang = S.uiLang;
```

Priority order: `?lang=es` in the URL (useful for iframes) > user's previous choice in localStorage > browser language > fallback to Catalan.

### Optional: visible selector in the topbar

Add inside `<header class="topbar">`, near the theme button:

```html
<select id="lang-select" onchange="changeUiLang(this.value)"></select>
```

And in JS (after `K.updateUI` is defined, e.g. at the end of `ui.js`):

```javascript
function initLangSelector() {
  const sel = document.getElementById('lang-select');
  if (!sel) return;
  sel.innerHTML = Object.entries(K.UI_LANGS)
    .map(([k, v]) => `<option value="${k}"${k === K.state.uiLang ? ' selected' : ''}>${v._name}</option>`)
    .join('');
}

function changeUiLang(lang) {
  if (!K.UI_LANGS[lang]) return;
  K.state.uiLang = lang;
  localStorage.setItem('karel-uilang', lang);
  document.documentElement.lang = lang;
  K.updateUI();
  K.initSpeedSlider();  // refreshes speed label
}

K.initLangSelector = initLangSelector;
window.changeUiLang = changeUiLang;
```

Call `K.initLangSelector()` from `main.js` after `K.updateUI()`.

## Step 4 — The course pages (`curs/*.html`)

The chapter and challenge HTML files (`capitol-*.html`, `repte-*.html`) contain extensive pedagogical prose in Catalan. These are static standalone pages, not driven by `K.UI_LANGS`. Two strategies:

**A) Duplicate directory** (recommended for simplicity): create `curs/es/capitol-1.html`, etc. with Spanish content. The iframe simulators embedded inside them already accept `?lang=es` if Step 3 is implemented.

**B) Build-time templating**: use a static site generator (Nunjucks, Eleventy, etc.) with a `locale` variable. This is more maintainable long-term but adds build tooling.

In either case, the `curs/capitols.js` file (which defines chapter metadata for the progress tracker) must also be localized, following the same `{ca, es}` object pattern used for `K.REPTES`.

## Summary of files to modify

| File | Change |
|------|--------|
| `js/i18n.js` | Add `es` block to `K.UI_LANGS` |
| `js/ui.js` | Theme tooltip → `K.t()`, add `changeUiLang()`, `initLangSelector()` |
| `js/execution.js` | Drop-exists message → `K.t('err.drop_exists')` |
| `js/constants.js` | `DEFAULT_CODE` → `DEFAULT_CODES` keyed by lang |
| `js/reptes.js` | `titol`, `enunciat`, `code` → `{ca, es}` objects |
| `js/main.js` | Resolve `uiLang` from URL/localStorage/browser; resolve lang-keyed data; call `initLangSelector()` |
| `index.html` | Empty initial text in UI elements; add `<select id="lang-select">` |
| `curs/*.html` | Duplicate to `curs/es/` or templatize |
| `curs/capitols.js` | Localize chapter metadata |
