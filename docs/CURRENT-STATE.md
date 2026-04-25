# karelcat_primaria — Estat actual del projecte

> **Spin-off de karelcat.** Aquest projecte evoluciona de manera independent
> de karelcat. Respecte de karelcat: els reptes avançats (10–13) no s'inclouen,
> el capítol 10 ("Codi net") s'ha retirat per ser conceptualment lluny de la
> franja d'edat de primària, i el llenguatge i els enunciats dels capítols
> s'han adaptat al perfil d'alumne.
>
> **Font única de veritat.** Aquest document descriu l'estat real del projecte
> en el moment de l'última actualització. Qualsevol sessió de treball que
> modifiqui vocabulari, arquitectura, comportament o estat de tasques ha
> d'actualitzar aquest document abans de tancar.
>
> **Regla d'or:** un document d'estat obsolet és més perillós que no tenir-ne.

---

## 1. Visió general

**karelcat_primaria** és un entorn interactiu per aprendre a programar en Python,
adreçat a alumnes de Primària (9 anys aproximadament). L'alumne controla
**en Karel**, una medusa programable que viu en una graella submarina.

Inspirat en el [Stanford Karel Reader](https://compedu.stanford.edu/karel-reader/docs/python/en/intro.html).
El dialecte Karel és un **subconjunt vàlid de Python**: qualsevol programa Karel
vàlid es pot executar en un intèrpret Python real (amb un shim que defineixi les
funcions d'en Karel).

**Configuració d'idiomes:** codi en anglès (Python-compatible), interfície en català.

---

## 2. Estat del curs — completat al 100 %

### 2.1 Capítols (9 + epíleg, escrits)

| # | Fitxer | Títol | Conceptes nous |
|---|--------|-------|----------------|
| 1 | `curs/capitol-1.html` | Coneix en Karel | `move()`, `turn_left()`, `turn_right()`. Món, graella, direccions (esquerra/dreta/amunt/avall). |
| 2 | `curs/capitol-2.html` | Recollir i deixar | `grab()`, `drop()`, motxilla, `pearl_here()`. Errors. |
| 3 | `curs/capitol-3.html` | Gestió d'errors en un codi | Llegir missatges d'error i corregir el codi. |
| 4 | `curs/capitol-4.html` | Repeteix | `for _ in range(N):`, indentació, blocs. |
| 5 | `curs/capitol-5.html` | Funcions | `def nom():`. Crear ordres noves. Metàfora de la recepta. |
| 6 | `curs/capitol-6.html` | Descomposició | Cap sintaxi nova. Dividir una missió en fases. |
| 7 | `curs/capitol-7.html` | Condicionals | `if cond():` / `else:`. |
| 8 | `curs/capitol-8.html` | Mentre | `while cond():`. Error de límit. |
| 9 | `curs/capitol-9.html` | Combinant condicions | `not`, `and`, `or`. |
| futur | `curs/capitol-futur.html` | D'en Karel al Python | Epíleg. Pont al món real. Cap simulador. |

Diferència respecte de karelcat: el capítol 10 ("Codi net": DRY, responsabilitat única, nomenclatura) s'ha retirat per ser conceptualment lluny de la franja d'edat de primària.

Tots els capítols disponibles estan llistats a `DISPONIBLES` a `curs/index.html`.

### 2.2 Reptes (9/9 implementats)

Els reptes són la part final del curs. Cada repte és un fitxer HTML independent.

| # | Fitxer | Títol | Grup | Dificultat |
|---|--------|-------|------|------------|
| 1 | `curs/repte-1.html` | El diari | A | ★ Fàcil |
| 2 | `curs/repte-2.html` | El passadís | A | ★ Fàcil |
| 3 | `curs/repte-3.html` | L'escala diagonal | A | ★ Fàcil |
| 4 | `curs/repte-4.html` | Distribuir les perles | A | ★ Fàcil |
| 5 | `curs/repte-5.html` | El serpentí | B | ★★ Intermedi |
| 6 | `curs/repte-6.html` | Construir torres | B | ★★ Intermedi |
| 7 | `curs/repte-7.html` | L'escala doble | B | ★★ Intermedi |
| 8 | `curs/repte-8.html` | El vigilant | B | ★★ Intermedi |
| 9 | `curs/repte-9.html` | Les files alternes | B | ★★ Intermedi |

Els reptes avançats (10–13) de karelcat no s'inclouen a karelcat_primaria.

El document de referència complet dels reptes (mapes, solucions, notes pedagògiques)
és `curs/BRIEFING-REPTES.md`.

---

## 3. Vocabulari del llenguatge (sintaxi Python-compatible)

### Ordres (6)
```
move()  turn_left()  turn_right()  turn_around()  grab()  drop()
```
*(Nota: `turn_around()` és una ordre directa del motor, no cal definir-la amb `def`.)*

### Condicions (9)
```
front_is_clear()    front_is_blocked()
left_is_clear()     left_is_blocked()
right_is_clear()    right_is_blocked()
pearl_here()        bag_is_empty()      bag_is_full()
```

### Literals booleans
```
True    False
```

### Paraules clau estructurals
```
if  elif  else  while  for  in  range  def  not  and  or  break
```

### Estructures de control
```python
# Condicional (amb elif il·limitat)
if front_is_clear():
    move()
elif pearl_here():
    grab()
else:
    turn_left()

# Iteració comptada
for _ in range(N):
    move()

# Iteració condicional
while front_is_clear():
    move()

# Sortida anticipada
while True:
    move()
    if pearl_here():
        break

# Definició de procediment
def nom():
    move()
    turn_left()
```

**Indentació:** 2 espais per nivell (4 també acceptat; el tokenitzador detecta automàticament la unitat mínima).
**Comentaris:** `#` fins al final de línia.

### Decisions de semàntica importants
- `grab()` i `drop()` operen sobre la **casella actual** de Karel (no la del davant).
- `pearl_here()` reflecteix aquesta semàntica amb el sufix `_here`.
- `front_is_clear()` i `front_is_blocked()` miren la casella del davant.
- `left_is_clear()` mira esquerra relativa a l'orientació actual; `right_is_clear()` mira dreta relativa.
- `not front_is_clear()` i `front_is_blocked()` són equivalents; tots dos funcionen.

---

## 4. Format dels mapes

```
K>,.,A,P|.,.,.,.|.,.,.,P
```

| Caràcter | Significat |
|----------|------------|
| `.` | Casella buida |
| `,` | Separador de columnes |
| `\|` | **Separador de files** |
| `K>` | Karel mirant Est |
| `K^` | Karel mirant Nord |
| `Kv` | Karel mirant Sud |
| `K<` | Karel mirant Oest |
| `A` | Perla (recollible amb `grab()`) |
| `P` | Roca (obstacle infranquejable) |

**La primera fila** de la cadena és la **fila superior** del món.
**La última fila** és la fila inferior (on normalment comença en Karel).

**Separador de files: `|` (pipe).** `js/world.js` fa `.split('|')` a la línia 8.
Mai usar `\n`, `\\n` ni salts de línia reals — el mapa fallaria silenciosament.

### Atributs HTML dels simuladors

```html
<!-- Món únic -->
<div class="simulador"
     data-map="K>,.,A|.,P,."
     data-goal=".,.,K>|.,P,."
     data-bag="0"
     data-code="move()"
     data-label="Títol del simulador"
     data-height="260">
</div>

<!-- Múltiples mons (format DRY) -->
<div class="simulador"
     data-maps='["K>,.,A|.,P,.", "K>,.,.,A|.,P,.,P"]'
     data-goals='[".,.,K>|.,P,.", ".,.,.,K>|.,P,.,P"]'
     data-labels='["Test A", "Test B"]'
     data-code="while front_is_clear():
    move()
"
     data-label="Títol"
     data-height="300">
</div>
```

---

## 5. Arquitectura de fitxers i responsabilitats

```
index.html          — Simulador lliure. HTML mínim: topbar + toolbar + editor + món.
style.css           — ~698 línies. Sense zombies des de la neteja (Categoria C).
edit-mapa.html      — Editor visual de mapes (eina auxiliar, no és part del curs).

js/constants.js     — Namespace K, SVG assets, DIRS, CMD_ACTIONS, COND_ACTIONS,
                      SPEED_DELAYS, DEFAULT_CSV, DEFAULT_CODE, escHtml/sanitizeHtml.
js/i18n.js          — K.CODE_LANGS (vocabulari codi) + K.UI_LANGS (textos UI).
                      Funcions K.t(key) i K.tf(key, vars).
js/state.js         — K.state (estat centralitzat) + K.lang (tokens del parser actiu).
                      Funció K.applyCodeLang(lang).
js/tokenizer.js     — Funció pura K.tokenize(code) → array de tokens.
                      Detecta automàticament la unitat d'indentació.
js/parser.js        — Classe Parser + K.parseCode(code) → AST o null.
                      Suporta elif (cadena il·limitada), break, True/False.
js/interpreter.js   — Generadors K.runStmts/K.runStmt → yield {cmd,line} | {type:'error'}.
                      Propaga break via flag _break en while i for.
js/execution.js     — K.execAction, K.runProgram, K.stepProgram, K.stopProgram,
                      K.resetKarel. Reset de _break a l'inici d'execució.
js/world.js         — K.parseCSV (split per |), K.loadMapFromCSV, K.isRock,
                      K.getCell, K.setCell, K.front(), K.evalCond (inclou left/right),
                      K.worldToCSV, K.currentStateToCSV.
js/renderer.js      — K.renderWorld (diferencial), K.renderWorldFull, K.updateStatus.
js/editor.js        — Ressaltat sintàctic, numeració de línies, marca d'error,
                      autocompletat (Tab).
js/ui.js            — K.log, K.logError, K.setStateUI, K.updateUI,
                      K.initSpeedSlider, K.handleRunClick, K.toggleTheme, K.initTheme.
js/main.js          — IIFE d'inicialització. Llegeix URL params, connecta mòduls.
js/reptes.js        — K.REPTES[N]: 5 reptes predefinits per al simulador lliure
                      (accessibles via ?repte=N a index.html). Independents dels
                      reptes del curs (repte-N.html).

curs/index.html     — Índex del curs (estil Stanford).
curs/capitol.html   — Plantilla HTML reutilitzable per a capítols (comentada).
curs/capitol-1..9   — Els 9 capítols del curs. Tots implementats. ✅
curs/capitol-futur  — Epíleg: pont al Python real. ✅
curs/repte-1..9     — Els 9 reptes del curs. Tots implementats. ✅
curs/capitols.js    — CAPITOLS_DATA + REPTES_DATA + renderSidebar() +
                      renderSimuladors() + toggle mòbil.
curs/curs.css       — Estils per a totes les pàgines del curs.
curs/AI_INSTRUCTIONS.md — Instruccions tècniques per a IA sobre el format de mapes.
curs/BRIEFING-REPTES.md — Estat detallat de cada repte (mapes, solucions, notes).
```

**Ordre de càrrega a `index.html`** (crític — les dependències globals K.* s'han de
carregar en aquest ordre):
```
constants.js → i18n.js → state.js → tokenizer.js → parser.js →
interpreter.js → world.js → renderer.js → editor.js → ui.js →
execution.js → reptes.js → main.js
```

### Contractes verificats
- **K.***: cada símbol `K.X` cridat des de qualsevol fitxer JS és definit en algun altre.
- **HTML↔JS**: cada `getElementById` al JS apunta a un ID que existeix a `index.html`.
- **Nomenclatura**: les paraules `wall` i `water` no apareixen en el codi amb significat semàntic. (La variable CSS `--cell-rock` a `style.css` designa l'obstacle; `wall` i `water` no s'usen com a termes del domini.)

---

### Sidebar: `CURRENT_CAPITOL` i `CURRENT_REPTE`

Cada **capítol** declara `const CURRENT_CAPITOL = N;` i crida `renderSidebar(CURRENT_CAPITOL)`.
Cada **repte** declara `const CURRENT_REPTE = N;` i crida `renderReptesSidebar(CURRENT_REPTE)`.

---

## 6. Flux de dades complet (codi → acció al món)

Seguir aquest flux és la millor manera d'entendre el sistema:

```
Alumne escriu codi (textarea #code-editor)
  │
  ▼
K.tokenize(code)          [tokenizer.js]
  → tokens: [{t:'INDENT',v:0}, {t:'W',v:'move'}, {t:'('}, {t:')'}, {t:'NL'}, ...]
  │
  ▼
new Parser(tokens).parseAll()   [parser.js]
  → AST: [{type:'command', name:'move', line:1}, {type:'while', cond:{...}, body:[...], ...}]
  │
  ▼
K.runStmts(ast)           [interpreter.js — generador JS]
  → yield {cmd:'move', line:1}
  → yield {cmd:'turn_left', line:3}
  → yield {type:'error', code:'inf_loop', ...}   ← si hi ha iteració infinita
  │
  ▼
execAction(step)          [execution.js]
  → CMD_TO_ACTION['move'] = 'move'   (via K.lang, configurat per applyCodeLang)
  → K.isRock(fx, fy) → si roca: errStop('rock')
  → S.karel.x = fx; S.karel.y = fy
  → K.renderWorld()   [renderer.js — diferencial]
  → K.updateStatus()
```

**Punts clau del flux:**
- L'intèrpret és un **generador JS**. No executa tot de cop: retorna un valor per `yield` i es queda suspès fins al `tick` següent. Això permet el mode pas a pas i el control de velocitat sense bloquejar el navegador.
- `CMD_TO_ACTION` és una indirección: el motor no coneix les paraules de l'alumne (`move`, `avança`, etc.), només les accions internes (`'move'`, `'turn-left'`, etc.). Afegir un idioma de codi nou no requereix tocar l'intèrpret ni l'executor.
- **Invariant de posició** (important per a auditories futures): `S.karel.x/y` **sempre** apunta a una casella que no és `'P'`. `move` comprova `isRock` *abans* d'actualitzar la posició; si xoca, para. Per tant, qualsevol codi que assumeixi "Karel pot estar sobre una pedra" és incorrecte.

---

## 7. Punts forts verificats (no modificar sense raó sòlida)

### 7.1 Generadors JS per a l'intèrpret (`interpreter.js`)

L'intèrpret usa `function*` i `yield*`. Això és elegant i correcte per diverses raons:

- Permet **suspendre l'execució** entre passos sense callbacks ni màquines d'estats manuals.
- El mode pas a pas (`stepProgram`) i el mode continu (`runProgram`/`tick`) comparteixen exactament el mateix generador; la diferència és només qui el fa avançar.
- La recursió de procediments de l'alumne es mapeja directament sobre la pila de crida JS (via `yield* runStmts(body)`), cosa que simplifica molt el codi i fa que la detecció de recursió excessiva (`callDepth > 50`) sigui trivial.
- **No tocar** l'estructura del generador sense entendre bé com interactua amb `tick()` i `doStep()` a `execution.js`.

### 7.2 Sanitització HTML robusta (`constants.js`)

`sanitizeHtml(html)` usa `DOMParser` i reconstrueix el DOM element per element, permetent només una llista blanca de tags (`em, strong, code, br, span, b, i, u, sub, sup`) i atributs (`class, title`). Qualsevol altre tag es desenbolica (es conserven els fills, no el contenidor). Qualsevol altre atribut s'elimina silenciosament.

Complementàriament, `escHtml(s)` escapa els quatre caràcters perillosos (`&`, `<`, `>`, `"`) per a usos on no cal HTML (logs, missatges d'error).

**El curs usa `sanitizeHtml`** per al contingut dels capítols que arriba de fitxers HTML externs. Continuar usant-la sempre que es mostri contingut dinàmic al DOM.

### 7.3 Contracte postMessage entre iframes (`execution.js` + `curs/`)

El simulador incrustat als capítols del curs s'executa dins d'un `<iframe>`. Quan acaba un programa, `execution.js` envia un missatge al pare:

```js
// Al final de l'execució (tick / doStep):
notifyGoalResult(compareGoal(K.goalCSV));

// La funció:
function notifyGoalResult(success) {
  if (!K.goalCSV || !K.goalId) return;
  window.parent.postMessage(
    { type: 'karel-result', goalId: K.goalId, success },
    K.parentOrigin
  );
}
```

`K.parentOrigin` s'obté de `document.referrer` (no de `'*'`), cosa que evita enviar dades a orígens arbitraris. La pàgina del curs escolta `'message'` i actualitza el feedback visual de l'exercici.

**Missatges possibles:**
- `{ type: 'karel-result', goalId, success }` — resultat final (✓ o ✗)
- `{ type: 'karel-clear', goalId }` — l'alumne ha modificat el codi o ha reiniciat; esborrar el feedback

`compareGoal(goalCSV)` compara la posició final de Karel (sense direcció) i el contingut de cada casella. No compara la direcció final: és una decisió de disseny explícita.

### 7.4 Renderitzat diferencial (`renderer.js`)

`renderWorld()` no reconstrueix el DOM complet en cada tick. Manté un `_renderedSnapshot` de la clau de cada cel·la (string que combina contingut + presència de Karel + direcció). Només actualitza les cel·les on la clau ha canviat o la mida de cel·la ha variat.

Reconstrucció completa (`renderWorldFull`) només quan canvien les dimensions del món. Útil per saber-ho si cales al renderer: trucar `renderWorldFull()` força un rebuild; `renderWorld()` és incremental.

---

## 8. Gestió d'errors a l'intèrpret

Hi ha dos tipus d'errors diferenciats:

**Errors de sintaxi** (detectats per `parser.js` / `parseCode`):
- Llancen `KarelSyntaxError` dins del parser.
- Capturats pel `try/catch` de `parseCode`, que crida `K.logError` i `K.markErrorLine`.
- Retornen `null` i el programa no arrenca.

**Errors de runtime** (detectats per `interpreter.js` o `execution.js`):
- L'intèrpret fa `yield { type: 'error', code, msg, line }` (no llança excepcions).
- `execAction` detecta `step.type === 'error'` i crida `errStop`.
- `errStop` crida `K.logError`, `K.markErrorLine`, `K.setStateUI('error')`, `stopProgram()`.
- Errors de runtime possibles: `'rock'` (xoc), `'no_pearl'` (grab sense perla), `'bag_empty'` (drop sense perles a la motxilla), `'inf_loop'` (while amb guard > 50000), `'deep_rec'` (callDepth > 50), `'proc_undef'` (crida a procediment no definit).

**Important**: els errors de runtime *no llancen excepcions JS*. Si modifiques l'intèrpret o l'executor, usa sempre el mecanisme de `yield { type:'error' }` / `errStop`, no `throw`. Llançar dins d'un generador que és consumit per `tick()` provocaria una excepció no capturada.

---

## 9. Interfície (disseny Stanford)

- **Fila 1 (topbar):** logo medusa + «Karel», badge d'estat (dot + text), motxilla, botó tema.
- **Fila 2 (toolbar):** botó mutant Executa↔Atura + botó Reinicia + slider velocitat.
- **Zona principal:** editor de codi (esquerra, 50%) + món de Karel (dreta, 50%).
- **Log:** sota l'editor, es buida automàticament a cada execució.
- **Eliminats definitivament:** modals, menú hamburguesa, selectors d'idioma, panells de pistes/referència, editor de mapes integrat, onboarding.

### Mode fosc/clar
Botó sol/lluna a la topbar. Preferència desada a `localStorage` (clau `'karel-theme'`).

---

## 10. Sistema i18n (dos eixos ortogonals)

- **`K.CODE_LANGS`** — vocabulari del llenguatge de programació. Ara: `en` (únic).
- **`K.UI_LANGS`** — textos de la interfície. Ara: `ca` (únic).
- `K.state.codeLang` i `K.state.uiLang` controlen quin idioma s'usa a cada eix.
- Afegir un idioma nou és **additiu** (afegir una entrada a l'objecte corresponent).

**Regla d'or**: mai barrejar claus de `CODE_LANGS` amb claus de `UI_LANGS`. Si una clau controla una paraula que l'alumne escriu → `CODE_LANGS`. Si controla un text que l'alumne llegeix → `UI_LANGS`.

---

## 11. Paràmetres d'URL acceptats per `index.html`

Gestionats per `main.js` a l'IIFE d'inicialització:

| Paràmetre | Valor | Efecte |
|---|---|---|
| `embed=1` | qualsevol | Aplica classe `embed` al body → amaga topbar. |
| `map=BASE64` | CSV codificat en base64 | Mapa inicial en lloc del DEFAULT_CSV. |
| `code=BASE64` | codi codificat en base64 | Codi inicial en lloc del DEFAULT_CODE. |
| `readonly=1` | qualsevol | textarea amb atribut `readonly` (exemples no editables). |
| `repte=N` | 1–5 | Carrega el repte N de `K.REPTES`. Té prioritat sobre `map`/`code`. |
| `goal=BASE64` | CSV codificat en base64 | Estat final objectiu per a la verificació d'exercicis. |
| `goalId=STRING` | string | Identificador de l'exercici per al postMessage. |
| `bag=N` | enter | Motxilla inicial de Karel (usada pels simuladors del curs). |
| `theme=light` | `light` | Força mode clar (aplicat inline al HTML, sincronitzat per `initTheme`). |

Quan `embed=1` és present, **no es guarda res a localStorage** (`useLocalStorage = false`).

---

## 12. Tasques pendents

### Categoria D — Millores visuals (prioritat mitjana)

| # | Tasca | Detall |
|---|-------|--------|
| D.1 | Perla en mode clar | El SVG de la perla té píxels blancs purs que desapareixen sobre fons blanc. Revisar el sprite. |
| D.2 | Emoji motxilla | Decidir si afegir ⚪ al costat del comptador numèric. |
| D.3 | Responsive mòbil | Verificar les mediaqueries (820px, 600px) amb el layout 50/50. |
| D.4 | Favicon | Afegir la medusa rosa com a favicon de la pàgina. |

### Categoria E — Funcionalitat futura (prioritat baixa)

| # | Tasca | Detall |
|---|-------|--------|
| E.1 | Idioma codi català | Afegir `K.CODE_LANGS.ca` amb `mentre`, `si`, `sinó`, `repeteix`, etc. |
| E.2 | Idioma codi castellà | Afegir `K.CODE_LANGS.es`. |
| E.3 | Idioma interfície anglès | Afegir `K.UI_LANGS.en`. |
| E.4 | Idioma interfície castellà | Afegir `K.UI_LANGS.es`. Vegeu `docs/i18n-spanish-guide.md`. |
| E.5 | Selector d'idioma | UI per triar `codeLang` i `uiLang` (ara fixats a `state.js`). |
| E.6 | Editor de mapes | Recuperar l'editor visual (eliminat a la neteja). `edit-mapa.html` ja existeix com a eina separada. |
| E.7 | Càrrega CSV extern | Recuperar `?mapa=CSV` a la URL o input file. |
| E.8 | Reptes predefinits al curs | Exposar els 9 reptes del curs via `?repte=N` a `index.html` (additiu a `reptes.js`). |

---

## 13. Principis de disseny a respectar

1. **Netedat Stanford:** si dubtes entre afegir un element a la interfície o no, no l'afegis.
2. **Ortogonalitat d'idiomes:** `codeLang` i `uiLang` independents. Mai barrejar tokens del codi amb textos de la interfície.
3. **Coherència terminològica:** roques i perles. Les paraules `wall` i `water` no s'han d'usar com a termes del domini (la variable CSS `--cell-rock` és acceptable com a nom tècnic).
4. **Semàntica canònica:** `grab()` i `drop()` operen sobre la casella actual. `pearl_here()` en referència a la casella on és Karel.
5. **Escalabilitat additiva:** afegir un idioma, capítol, repte o mode ha de ser additiu (afegir codi), mai invasiu (modificar codi existent).
6. **L'alumne és un infant català d'uns 9 anys** sense experiència, en una sessió de classe.
7. **Python primer:** qualsevol programa Karel vàlid ha de ser Python vàlid. En cas de dubte sintàctic, el criteri és la compatibilitat amb Python.

### Decisions de disseny a no qüestionar

Algunes decisions poden semblar discutibles però són intencionals:

**`grab()` i `drop()` operen sobre la casella *actual*, no la del davant.** Coherent amb el Karel original de Rich Pattis (1972) i amb `pearl_here()`.

**L'invariant de posició és estructural, no defensiu.** Karel mai pot estar sobre una roca. Qualsevol guard del tipus `if (cell === 'P') return errStop('rock')` dins de `drop()` seria codi mort. No afegir-lo: és confús i indueix a pensar que l'estat podria ser invàlid quan no pot ser-ho.

**`compareGoal` ignora la direcció final de Karel.** Decisió pedagògica: l'exercici es considera resolt si Karel és a la posició correcta i el món té el contingut correcte.

**El tokenitzador detecta automàticament la unitat d'indentació.** `_detectIndentUnit` calcula el mínim sagnat no nul present al codi. Això permet que 2, 3 o 4 espais per nivell funcionin tots sense configuració.

**`not` suporta dues sintaxis.** `not cond()` i `not(cond())` ambdues funcionen. Això és Python-compatible i pedagògicament útil.

---

## 14. Checklist per a qualsevol modificació

Abans de fer qualsevol canvi:

- [ ] El canvi és **additiu** o **invasiu**? Preferir sempre additiu.
- [ ] Si modifiques `i18n.js`: has mantingut la paritat d'ordre entre `commands[]` i `K.CMD_ACTIONS`? Entre `conditions[]` i `K.COND_ACTIONS`?
- [ ] Si afegeixes un script nou: l'has inclòs a `index.html` en la posició correcta? Has exportat totes les funcions via `K.nomFuncio`?
- [ ] Si modifiques el parser o tokenitzador: `for _ in range(10): move()` i `for i in range(3):\n    move()` segueixen funcionant tots dos?
- [ ] Si modifiques `execution.js`: els errors de runtime es comuniquen via `errStop()` o `yield {type:'error'}`, no via `throw`?
- [ ] Si modifiques el renderer: `renderWorld()` diferencial i `renderWorldFull()` rebuild complet produeixen el mateix resultat visual?
- [ ] Els mapes dels simuladors usen `|` com a separador de files (no `\n`)?
- [ ] Les paraules `wall` i `water` no s'han usat com a termes del domini en cap fitxer nou?
- [ ] El projecte és **Python-compatible**: qualsevol programa Karel vàlid ha de ser Python vàlid amb un shim adequat?
- [ ] Has actualitzat aquest document (`CURRENT-STATE.md`) si has canviat l'estat de qualsevol tasca?

---

## 15. Guia de documents del projecte

| Document | Propòsit | Estat |
|----------|----------|-------|
| `docs/CURRENT-STATE.md` | **Aquest fitxer.** Font única de veritat. | ✅ Actiu |
| `docs/i18n-spanish-guide.md` | Guia pas a pas per afegir `uiLang: 'es'` (castellà). | ✅ Actiu |
| `curs/BRIEFING-REPTES.md` | Detall de cada repte: mapes, solucions, notes pedagògiques. | ✅ Actiu |

---

*Última actualització: adaptació a primària. Respecte de karelcat: s'han
eliminat els reptes 10–13 (avançats), s'ha retirat el capítol 10 ("Codi net")
per inadequació a la franja d'edat, s'han harmonitzat els títols dels capítols
2 ("Recollir i deixar") i 5 ("Funcions") i del capítol futur, i s'ha adaptat
el llenguatge i els enunciats dels capítols al perfil d'alumne (eliminació de
direccions Nord/Sud/Est/Oest, eliminació de pistes, simplificació de capçaleres
i correccions lingüístiques puntuals).*
