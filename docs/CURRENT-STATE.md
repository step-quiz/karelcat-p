# karelcat2-p — Estat actual del projecte

> **Spin-off de karelcat2.** El motor (`js/`, `simulador.html`, estils, test) és
> el de karelcat2; el contingut del curs és propi, en català de lectura fàcil.
> Per portar-hi millores futures de karelcat2, vegeu la secció 17.
>
> **Font única de veritat.** Aquest document descriu l'estat real del projecte
> en el moment de l'última actualització. Qualsevol sessió de treball que
> modifiqui vocabulari, arquitectura, comportament o estat de tasques ha
> d'actualitzar aquest document abans de tancar.
>
> **Regla d'or:** un document d'estat obsolet és més perillós que no tenir-ne.

---

## 1. Visió general

**karelcat2-p** és un entorn interactiu per aprendre a programar en Python, adreçat a:

- alumnat de **Primària** (uns 9–11 anys), i
- alumnat de **Secundària que fa menys de 2 anys que és a Catalunya** (aula d'acollida)
  i encara no entén bé el català.

L'alumne controla **en Karel**, una medusa programable que viu en una graella submarina.

**Objectiu lingüístic:** tot és **només en català**, en català de **lectura fàcil**. Un
alumne que, per exemple, només parla urdú, vol que en Karel avanci: per aconseguir-ho
llegeix instruccions, missatges d'error i enunciats en català, i així aprèn català
«sense voler». Per això no hi ha cap altre idioma d'interfície, i els textos són curts,
concrets i sempre amb les mateixes paraules (vegeu la secció 10).

Inspirat en el [Stanford Karel Reader](https://compedu.stanford.edu/karel-reader/docs/python/en/intro.html).
El dialecte Karel és un **subconjunt vàlid de Python**: qualsevol programa Karel
vàlid es pot executar en un intèrpret Python real (amb un shim que defineixi les
funcions d'en Karel).

**Configuració d'idiomes:** codi en anglès (Python-compatible), interfície en català de lectura fàcil.

**Diferències amb karelcat2:** 10 capítols + epíleg amb el text simplificat, 9 reptes
d'**un sol món** (sense els reptes avançats 10–13), enunciats simplificats (sense punts
cardinals, sense pistes) i missatges de lectura fàcil.

---

## 2. Estat del curs — completat al 100 %

### 2.1 Capítols (10 + epíleg)

Els títols coincideixen amb `CAPITOLS_DATA` (`curs/capitols.js`) i amb el `<h1>` de cada pàgina.

| # | Fitxer | Títol | Conceptes nous |
|---|--------|-------|----------------|
| 1 | `curs/capitol-1.html` | Coneix en Karel | `move()`, `turn_left()`, `turn_right()`. Món, graella, dreta/esquerra/amunt/avall. |
| 2 | `curs/capitol-2.html` | Recollir i deixar | `grab()`, `drop()`, motxilla. |
| 3 | `curs/capitol-3.html` | Gestió d'errors en un codi | «Quan escrivim, ens podem equivocar» i «La medusa intenta fer una cosa impossible». |
| 4 | `curs/capitol-4.html` | Repeteix | `for i in range(N):`, espais al davant (indentació). |
| 5 | `curs/capitol-5.html` | Funcions | `def nom():`. Crear instruccions noves. |
| 6 | `curs/capitol-6.html` | Descomposició | Cap sintaxi nova. Dividir una missió en parts. |
| 7 | `curs/capitol-7.html` | Condicionals | `if cond():` / `else:`, condicions. |
| 8 | `curs/capitol-8.html` | Mentre | `while cond():`. |
| 9 | `curs/capitol-9.html` | Combinant condicions | `not`, `and`, `or`. |
| 10 | `curs/capitol-10.html` | Codi net | Cap sintaxi nova. No repetir codi, noms que expliquen, cada funció una sola feina. |
| — | `curs/capitol-futur.html` | D'en Karel al Python | Epíleg: pont al Python real. |

Tots els capítols estan llistats a `DISPONIBLES` a `curs/index.html`.

**Capítol 10 («Codi net»):** té tres exercicis de «netejar» un codi brut (el mateix
resultat amb una funció i un `while`, noms que expliquen, `turn_around()`). Les pistes
van dins de l'enunciat, en una frase curta, com a la resta del -p.

### 2.2 Reptes (9/9 implementats, un sol món cadascun)

Cada repte és un fitxer HTML independent amb **un sol simulador d'un sol món**
(`data-map` + `data-goal`). L'alumne veu l'objectiu amb el botó «🎯 Objectiu».

| # | Fitxer | Títol | Grup |
|---|--------|-------|------|
| 1 | `curs/repte-1.html` | Recollir la perla | A |
| 2 | `curs/repte-2.html` | El passadís | A |
| 3 | `curs/repte-3.html` | L'escala diagonal | A |
| 4 | `curs/repte-4.html` | Distribuir les perles | A |
| 5 | `curs/repte-5.html` | El serpentí | B |
| 6 | `curs/repte-6.html` | Construir torres | B |
| 7 | `curs/repte-7.html` | L'escala doble | B |
| 8 | `curs/repte-8.html` | El vigilant | B |
| 9 | `curs/repte-9.html` | Les files alternes | B |

El document de referència dels reptes (mapes, objectius, solucions) és `curs/BRIEFING-REPTES.md`.

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
pearl_here()        bag_is_empty()      bag_has_pearls()
```
*(`bag_is_full()` és el nom antic de `bag_has_pearls()`: es continua acceptant, però no surt
al glossari ni a l'autocompletat, perquè en anglès *full* vol dir «plena».)*

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

**Indentació:** les mateixes regles que Python. El tokenitzador manté una pila de
nivells i emet `INDENT`/`DEDENT`: es pot indentar amb 2, 3 o 4 espais (o amb tabulador,
que compta fins al següent múltiple de 4), però dins d'un bloc totes les línies han de
tenir exactament la mateixa indentació. Cap línia s'ignora en silenci: una línia massa
indentada, una indentació que no coincideix amb cap nivell anterior o un bloc buit són
errors de sintaxi amb número de línia.
**Una instrucció per línia**, o diverses separades per `;` (`move(); move()`).
Després de `:` hi pot anar una instrucció simple a la mateixa línia (`for i in range(3): move()`).
**Comentaris:** `#` fins al final de línia.
**Noms:** poden portar accents i ela geminada (`col·loca_perla`). Abans d'executar, es comprova
que totes les funcions cridades existeixin, amb suggeriments («Volies dir move()?»).

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
| `K>A`, `K^A`… | Karel damunt d'una casella amb perla |
| `A` | Perla (recollible amb `grab()`) |
| `P` | Roca (obstacle infranquejable) |

**La primera fila** de la cadena és la **fila superior** del món.
**La última fila** és la fila inferior (on normalment comença en Karel).

**Separador de files: `|` (pipe).** `js/world.js` fa `.split('|')`.
Mai usar `\n`, `\\n` ni salts de línia reals dins d'un mapa (el test automàtic ho detecta).

### Format dels objectius (`data-goal` / `data-goals`)

Mateix format que els mapes, amb aquestes regles (`K.parseGoal` i `K.compareGoal` a `js/world.js`):

- Es compara el contingut de **totes** les caselles, també la de sota en Karel
  (`K>A` = en Karel acaba damunt d'una perla; `K>` = hi acaba i la casella és buida).
- Si l'objectiu té una `K`, en Karel ha d'acabar en aquella casella (la direcció no es mira).
- Si l'objectiu **no té cap K**, no es comprova on acaba en Karel (només les perles).
- Opcions al final, separades per `;`: `;motxilla=N` (ha d'acabar amb N perles a la
  motxilla) i `;direccio` (també es comprova cap a on mira).
- **Alternatives:** diversos objectius separats per un salt de línia; n'hi ha prou amb
  un. A `data-goals` (JSON) un element pot ser un array: `[".,A,.", [".,A,.,.", ".,.,A,."]]`.

**L'alumne veu l'objectiu.** Quan un simulador té objectiu, a dalt a l'esquerra del món
hi ha el botó **«🎯 Objectiu»**: dibuixa per sobre del món, transparents, les perles i en
Karel tal com han de quedar, i una ✕ vermella a les perles que hi sobren (si hi ha
alternatives, cada clic en mostra una: «🎯 Objectiu 1/2», «2/2», amagat). Després d'un
intent que acaba sense errors però no arriba a l'objectiu, `K.goalDiff` (a `world.js`)
calcula les diferències amb l'alternativa més propera: les caselles diferents es marquen
en vermell i el registre les explica (perles que falten o sobren, on ha d'acabar en Karel,
direcció, motxilla). Les marques s'esborren en tornar a executar o en reiniciar. El test
automàtic comprova `goalDiff`.

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

Altres atributs: `data-bags='[3,5,7]'` (motxilla per món), `data-readonly="true"`
(exemple no editable), `data-error="sintaxi"` o `"execucio"` (exemple que mostra un
error a propòsit; el test comprova que l'error es produeixi).

### Solucions de referència (verificades pel test automàtic)

Cada exercici editable amb objectiu té la seva solució dins d'un comentari HTML de la
mateixa pàgina, entre les marques `<solucio>` i `</solucio>` (codi a la columna 0).
Si la pàgina té més d'un exercici: `<solucio exercici="2">`. També s'hi poden posar
errors típics de l'alumne que el verificador ha de detectar:
`<solucio-incorrecta motiu="oblida l'última casella"> … </solucio-incorrecta>`.
Vegeu la secció 16.

---

## 5. Arquitectura de fitxers i responsabilitats

```
index.html          — Pàgina d'inici (4 targetes: curs, reptes, simulador, editor).
simulador.html      — Simulador lliure i simulador incrustat als iframes del curs.
style.css           — ~698 línies. Sense zombies des de la neteja (Categoria C).
edit-mapa.html      — Editor visual de mapes (eina auxiliar, no és part del curs).
favicon.svg         — Icona de la pestanya: la medusa pixel art (rosa, vora granat).
favicon.ico         — La mateixa icona en 16, 32 i 48 px (navegadors sense SVG).
apple-touch-icon.png — Icona de 180 px per a la pantalla d'inici d'iPhone/iPad.
                      Totes les pàgines (també curs/*.html, amb ../) enllacen les tres
                      icones just després del <title>. Una pàgina nova ha de fer el mateix.

js/constants.js     — Namespace K, SVG assets, DIRS, CMD_ACTIONS, COND_ACTIONS,
                      SPEED_DELAYS, DEFAULT_CSV, DEFAULT_CODE, escHtml/sanitizeHtml.
js/i18n.js          — K.CODE_LANGS (vocabulari codi) + K.UI_LANGS (textos UI).
                      Funcions K.t(key) i K.tf(key, vars). Idèntic a karelcat2.
js/i18n-facil.js    — NOMÉS del -p. Substitueix textos de K.UI_LANGS.ca per
                      versions de lectura fàcil (vegeu la secció 10).
js/state.js         — K.state (estat centralitzat) + K.lang (tokens del parser actiu).
                      Funció K.applyCodeLang(lang).
js/tokenizer.js     — Funció pura K.tokenize(code) → tokens, amb INDENT/DEDENT com Python.
js/parser.js        — Classe Parser. K.parseProgram(code) → AST o llança KarelSyntaxError
                      (pur, sense interfície). K.parseCode(code) → AST o null (mostra l'error).
                      Suporta elif, break (només dins de bucles), True/False, ;, condicions
                      entre parèntesis, i comprova els noms de funció abans d'executar.
js/interpreter.js   — Generadors K.runStmts/K.runStmt → yield {cmd,line} | {type:'error'}.
                      Propaga break via flag _break en while i for.
js/execution.js     — K.applyCommand (pura), K.execAction, K.runProgram, K.stepProgram,
                      K.stopProgram, K.resetKarel, K.runHeadless (executa un programa
                      sencer en un altre món sense tocar la pantalla: tests i
                      «Comprova tots els mons»), K.checkAllWorlds.
js/world.js         — K.parseCSV (split per |, K>A), K.parseGoal, K.compareGoal,
                      K.loadMapFromCSV, K.isRock, K.getCell, K.setCell, K.front(),
                      K.evalCond (inclou left/right), K.worldToCSV, K.currentStateToCSV.
js/renderer.js      — K.renderWorld (diferencial), K.renderWorldFull, K.updateStatus.
js/editor.js        — Ressaltat sintàctic, numeració de línies, marca d'error,
                      autocompletat (Tab/Enter; afegeix els parèntesis), indentació
                      automàtica en prémer Enter (+4 espais després de ':'), Tab i
                      Maj+Tab per indentar/desindentar, retrocés que esborra un nivell.
                      K.editText manté l'historial de desfer (Ctrl+Z).
js/kbd-accessory.js — Barra de tecles tàctil a sota de l'editor (només pantalles tàctils):
                      ⇥ ⇤ ( ) : _ # i les instruccions i paraules clau més habituals.
js/ui.js            — K.log, K.logError, K.setStateUI, K.updateUI,
                      K.initSpeedSlider, K.handleRunClick, K.toggleTheme, K.initTheme.
js/main.js          — IIFE d'inicialització. Llegeix URL params, connecta mòduls.
js/reptes.js        — K.REPTES[N]: 5 reptes predefinits per al simulador lliure
                      (accessibles via ?repte=N a index.html). Independents dels
                      reptes del curs (repte-N.html).

curs/index.html     — Índex del curs (10 capítols + epíleg, estil Stanford).
curs/capitol.html   — Plantilla HTML reutilitzable per a capítols (comentada).
curs/capitol-1..10  — Els 10 capítols del curs. Tots implementats. ✅
curs/capitol-futur  — Epíleg: d'en Karel al Python. ✅
curs/repte-1..9     — Els 9 reptes, d'un sol món cadascun. ✅
curs/capitols.js    — CAPITOLS_DATA + REPTES_DATA (amb el nombre de mons de cada repte) +
                      renderSidebar() + renderSimuladors() + toggle mòbil + listener
                      de missatges dels iframes.
curs/progress.js    — KProgress: progrés de l'alumne a localStorage (vegeu 7.3).
curs/curs.css       — Estils per a totes les pàgines del curs.
curs/BRIEFING-REPTES.md — Estat detallat de cada repte (mapes, notes pedagògiques).

tests/comprova-curs.js — Test automàtic de tot el curs (vegeu secció 16).
.github/workflows/comprova-curs.yml — Executa el test a GitHub a cada push.
```

**Ordre de càrrega a `simulador.html`** (crític — les dependències globals K.* s'han de
carregar en aquest ordre):
```
constants.js → i18n.js → i18n-facil.js → state.js → tokenizer.js → parser.js →
interpreter.js → world.js → renderer.js → editor.js → ui.js →
execution.js → reptes.js → main.js
```

### Contractes verificats
- **K.***: cada símbol `K.X` cridat des de qualsevol fitxer JS és definit en algun altre.
- **HTML↔JS**: cada `getElementById` al JS apunta a un ID que existeix a `simulador.html`.
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

El simulador incrustat als capítols del curs s'executa dins d'un `<iframe>` i envia
missatges a la pàgina del curs (`execution.js` → `capitols.js`). Tots porten
`codeHash`, l'empremta del codi de l'editor (`K.codeHash`: ignora comentaris i línies buides).

**Missatges possibles:**
- `{ type: 'karel-ready',  goalId, codeHash }` — l'iframe s'ha carregat.
- `{ type: 'karel-clear',  goalId, codeHash }` — l'alumne ha modificat el codi, ha reiniciat o torna a executar: s'esborra el feedback.
- `{ type: 'karel-result', goalId, success, error, codeHash }` — ha acabat una execució (`error: true` si s'ha aturat per un error d'execució).

`K.parentOrigin` s'obté de `document.referrer` (no de `'*'`, excepte si els fitxers
s'obren des del disc, on l'origen és `null`). `capitols.js` ignora missatges d'altres orígens.

**Reptes amb diversos mons** (el motor ho permet; al -p ara no se'n fa servir cap): cada món recorda amb quin `codeHash` s'ha superat. Quan
arriba un missatge amb una empremta diferent, els mons superats amb un altre codi tornen a
«○». Així «Tots els mons superats» vol dir que *el codi actual* els supera tots.
El botó **«✓ Comprova tots els mons»** (dins l'iframe, paràmetre `worlds`) executa el
codi a tots els mons amb `K.runHeadless` i envia un `karel-result` per a cada món.

**Reptes d'un sol món (-p):** el simulador d'un món (`_renderSingleMon` a `capitols.js`)
sap si és a una pàgina de repte (`CURRENT_REPTE`); quan l'alumne l'encerta, desa el món 0
del repte amb `KProgress.saveMon(repte, 0, codeHash, 1)` i la barra lateral hi posa ✓.

**Progrés (`curs/progress.js`):** `reptes[N] = { mons: [codeHash|null…], complet }`.
Un repte és complet quan tots els mons s'han superat amb la mateixa empremta; un cop
complet, no es desgrava. El format antic (`[true, false, true]`) es continua llegint.

**Codi de l'alumne:** cada simulador editable del curs desa el codi a
`localStorage['karel-code:<pàgina>:<núm. de simulador>']` (paràmetre `save`), i el botó
**«⟲ Codi inicial»** el torna a l'esquelet original. El simulador lliure fa servir la
clau `karel-code-v3` i els exercicis ja no la sobreescriuen.

### 7.4 Renderitzat diferencial (`renderer.js`)

`renderWorld()` no reconstrueix el DOM complet en cada tick. Manté un `_renderedSnapshot` de la clau de cada cel·la (string que combina contingut + presència de Karel + direcció). Només actualitza les cel·les on la clau ha canviat o la mida de cel·la ha variat.

La clau de cada cel·la inclou també la capa de l'objectiu (`_overlay`: perla o Karel
transparents, ✕, vora vermella de diferència), de manera que aquesta capa es redibuixa
amb el mateix mecanisme.

Reconstrucció completa (`renderWorldFull`) només quan canvien les dimensions del món. Útil per saber-ho si cales al renderer: trucar `renderWorldFull()` força un rebuild; `renderWorld()` és incremental.

---

## 8. Gestió d'errors a l'intèrpret

Hi ha dos tipus d'errors diferenciats:

**Errors de sintaxi** (detectats per `parser.js` / `parseCode`):
- Llancen `KarelSyntaxError` dins del parser. Missatges a `K.UI_LANGS.ca.parse`
  (al -p, amb el text de `js/i18n-facil.js`). Al registre surten com a
  «❌ Codi mal escrit: Línia N: …».
- Inclouen: indentació (inesperada, que no quadra, bloc buit), falten `:` o `()`,
  més d'una instrucció per línia, `break` fora de bucle, `else` sense `if`, caràcters
  no vàlids, funcions no definides o mal escrites (amb suggeriment), condicions usades
  com a ordres i a l'inrevés, `def` dins d'un bloc o amb el nom d'una ordre.
- Capturats pel `try/catch` de `parseCode`, que crida `K.logError` i `K.markErrorLine`.
- Retornen `null` i el programa no arrenca.

**Errors de runtime** (detectats per `interpreter.js` o `execution.js`):
- L'intèrpret fa `yield { type: 'error', code, msg, line }` (no llança excepcions).
- `execAction` detecta `step.type === 'error'` i crida `errStop`.
- `_runtimeError` crida `stopProgram()` i després `K.logError`, `K.markErrorLine`,
  `K.setStateUI('error')` (en aquest ordre, perquè la línia de l'error quedi marcada) i
  avisa la pàgina del curs (`karel-result` amb `error: true`).
- Errors de runtime possibles: `'rock'` (xoc), `'no_pearl'` (grab sense perla), `'bag_empty'` (drop sense perles a la motxilla), `'inf_loop'` (un `while` que no acabarà mai: es detecta **exactament i al moment** quan, a l'inici de dues voltes del mateix `while`, el món és idèntic — posició, direcció, motxilla i perles —; com que no hi ha variables, el programa repetiria el mateix per sempre. Com a salvaguarda, també a les 50.000 voltes), `'too_many'` (range > 10.000), `'deep_rec'` (callDepth > 50), `'proc_undef'` (no hauria de passar: el parser ja ho comprova). `K.runHeadless` afegeix `'too_long'` (més de 100.000 accions).

**Important**: els errors de runtime *no llancen excepcions JS*. Si modifiques l'intèrpret o l'executor, usa sempre el mecanisme de `yield { type:'error' }` / `errStop`, no `throw`. Llançar dins d'un generador que és consumit per `tick()` provocaria una excepció no capturada.

---

## 9. Interfície (disseny Stanford)

- **Fila 1 (topbar):** logo medusa + «Karel», navegació, glossari, botó tema. (Al curs, dins dels iframes, no es mostra.)
- **Fila 2 (toolbar):** botó mutant Executa → Atura (mentre corre) → Continua (en mode pas a pas),
  **⏭ Pas** (executa una instrucció; si el programa corre, el posa en pausa), Reinicia, slider de velocitat
  i **Motxilla** (sempre visible). Als exercicis del curs, a més: «✓ Comprova tots els mons»
  (només en reptes de diversos mons; al -p no n'hi ha), «⟲ Codi inicial» i «✕ Surt» (quan l'iframe és a pantalla completa).
- **Món:** botó «🎯 Objectiu» (només si l'exercici té objectiu; vegeu secció 4).
- **Barra de tecles** (només pantalles tàctils): a sota de l'editor.
- **Pantalla completa:** a les pàgines del curs, cada exercici té el botó «⛶ Pantalla completa».
- **Peu de pàgina** (`footer.js`): no és fix, és l'última fila; contingut CC BY-NC-SA 4.0, codi MIT.
- **Zona principal:** editor de codi (esquerra, 50%) + món de Karel (dreta, 50%).
- **Log:** sota l'editor, es buida automàticament a cada execució.
- **Mides de lletra** (pensades per a portàtil i tauleta): editor 14 px (15 px en pantalla
  tàctil), registre i botons ≈ 12,5–13 px, cap text d'interfície per sota de ≈ 11,5 px.
- **Presentació inicial** (`presentacio-karel.html`): només n'hi ha una d'automàtica, la
  primera vegada que s'obre el simulador lliure (mai dins dels iframes del curs). La
  portada no redirigeix: té l'enllaç «▶ És el primer cop? Mira la presentació», destacat
  mentre no s'ha vist. Totes dues vies posen `karel_tour_done_v1`. Tancar-la no demana
  confirmació i torna a la pàgina d'on es venia (o a la portada).
  **Al -p la presentació és pròpia**, de lectura fàcil, en 9 diapositives: què vol dir
  programar, les instruccions van en ordre («primer, després, al final»), el vocabulari
  del món (en Karel, casella, perla, roca, motxilla), les direccions (amunt, avall,
  esquerra, dreta), què vol dir cada instrucció, una **demostració animada** (el codi
  s'il·lumina línia a línia mentre en Karel es mou) i què fer si t'equivoques
  (missatge vermell, botó «🎯 Objectiu»). Sense referències a xarxes socials.
- **Esborrar el progrés:** botó «🗑 Esborra el meu progrés» a la part de baix de la barra
  lateral del curs i al final de `curs/index.html` (ja no és a la capçalera). La funció
  `karelClearProgress` és a `curs/capitols.js`: demana confirmació i esborra el progrés
  (`karel_progress`) i el codi desat dels exercicis (`karel-code:*`).
- **Eliminats definitivament:** modals, menú hamburguesa, selectors d'idioma, panells de pistes/referència, editor de mapes integrat.

### Mode fosc/clar
Botó sol/lluna a la topbar. Preferència desada a `localStorage` (clau `'karel-theme'`).

---

## 10. Idioma: només català, de lectura fàcil

El motor té dos eixos d'idioma (`K.CODE_LANGS` per al vocabulari del codi i `K.UI_LANGS`
per als textos de la interfície), però **el -p només fa servir el català** (`uiLang: 'ca'`)
i el codi en anglès (Python). No s'afegirà cap altre idioma d'interfície: la
immersió en català és part de l'objectiu (vegeu la secció 1).

**`js/i18n-facil.js`** (fitxer propi del -p) es carrega just després de `js/i18n.js` i
substitueix els textos de `K.UI_LANGS.ca` que l'alumne llegeix més sovint: missatges
d'error, avisos, diferències amb l'objectiu i títols dels botons. Així, la resta de
`js/` és idèntica a karelcat2.

Els textos de retroacció de sota de cada exercici i el glossari són a `curs/capitols.js`
(i el glossari del simulador lliure, a `simulador.html`).

### Criteris de lectura fàcil (per a tots els textos nous)

1. **Frases curtes**, una idea per frase, en **present**. Millor l'imperatiu per dir què cal fer: «Escriu move()», «Compta els espais».
2. **Sempre les mateixes paraules:** en Karel, casella, perla, roca, vora del món, motxilla, instrucció, condició, funció, línia, espais (al davant).
3. **Sense punts cardinals:** dreta, esquerra, amunt, avall (també als missatges de direcció: «En Karel ha de mirar a la dreta ➡️»).
4. **Evitar paraules tècniques** quan n'hi ha una de quotidiana: «codi mal escrit» (no «error de sintaxi»), «espais al davant» (no «indentació»), «signe» (no «caràcter»).
5. **Un emoji al començament** ajuda a reconèixer el missatge sense llegir-lo tot: 💥 xoc, ⚪ perla, 🎒 motxilla, 🎯 objectiu, ✓ / ✗.
6. **Sempre el número de línia** al començament dels errors: és una pista que no depèn de la llengua.
7. Evitar pronoms febles difícils («n'hi», «l'has») i el subjuntiu.

---

## 11. Paràmetres d'URL acceptats per `simulador.html`

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
| `multi=1` | qualsevol | Simulador d'un repte amb diversos mons (estils de la barra). |
| `save=CLAU` | string | Desa el codi de l'alumne a `localStorage[CLAU]` i mostra «⟲ Codi inicial». |
| `cur=BASE64` | codi | Codi actual de l'alumne en canviar de món (si no hi ha localStorage). |
| `worlds=BASE64` | JSON `[{map, goal, bag, goalId}]` | Tots els mons del repte: mostra «✓ Comprova tots els mons». |

El codi només es desa a localStorage al simulador lliure (clau `karel-code-v3`) o quan hi ha `save=CLAU`.

---

## 12. Tasques pendents

### Categoria D — Millores visuals (prioritat mitjana)

| # | Tasca | Detall |
|---|-------|--------|
| D.3 | Responsive mòbil | El mòbil no és prioritari (massa informació). Portàtil i tauleta sí: fet (vegeu secció 9). |

Fetes (igual que a karelcat2): **D.1** (perla en mode clar: cada color del sprite té una
classe `pl-*` a `K.KAREL_ASSETS.PEARL` i `style.css` n'enfosqueix la vora, el cos i
l'ombra quan `body.light`; el mode fosc no canvia) i **D.4** (icona de la pestanya,
vegeu la secció 5).

### Categoria P — Contingut propi del -p

Totes fetes: P.1 (presentació inicial de lectura fàcil, vegeu la secció 9), P.2 (capítol
«D'en Karel al Python» de lectura fàcil, sense `elif`, que no s'explica al curs), P.3
(el repte 8 ja no comença amb una perla a la motxilla) i P.4 (capítol 10 «Codi net»
recuperat, amb les seccions 3 i 4 i els exercicis en lectura fàcil).

### Categoria E — Funcionalitat futura (prioritat baixa)

| # | Tasca | Detall |
|---|-------|--------|
| E.6 | Editor de mapes | Recuperar l'editor visual (eliminat a la neteja). `edit-mapa.html` ja existeix com a eina separada. |
| E.7 | Càrrega CSV extern | Recuperar `?mapa=CSV` a la URL o input file. |
| E.8 | Reptes predefinits al curs | Exposar els 9 reptes del curs via `?repte=N` a `index.html` (additiu a `reptes.js`). |

Les tasques E.1–E.5 de karelcat2 (altres idiomes i selector d'idioma) **no s'apliquen al -p**:
és només en català (vegeu la secció 10).

---

## 13. Principis de disseny a respectar

1. **Netedat Stanford:** si dubtes entre afegir un element a la interfície o no, no l'afegis.
2. **Ortogonalitat d'idiomes:** `codeLang` i `uiLang` independents. Mai barrejar tokens del codi amb textos de la interfície.
3. **Coherència terminològica:** roques i perles. Les paraules `wall` i `water` no s'han d'usar com a termes del domini (la variable CSS `--cell-rock` és acceptable com a nom tècnic).
4. **Semàntica canònica:** `grab()` i `drop()` operen sobre la casella actual. `pearl_here()` en referència a la casella on és Karel.
5. **Escalabilitat additiva:** afegir un idioma, capítol, repte o mode ha de ser additiu (afegir codi), mai invasiu (modificar codi existent).
6. **L'alumne és un infant de Primària, o un adolescent d'aula d'acollida que encara aprèn català.** No té experiència. Tot text nou segueix els criteris de lectura fàcil (secció 10).
7. **Python primer:** qualsevol programa Karel vàlid ha de ser Python vàlid. En cas de dubte sintàctic, el criteri és la compatibilitat amb Python.

### Decisions de disseny a no qüestionar

Algunes decisions poden semblar discutibles però són intencionals:

**`grab()` i `drop()` operen sobre la casella *actual*, no la del davant.** Coherent amb el Karel original de Rich Pattis (1972) i amb `pearl_here()`.

**L'invariant de posició és estructural, no defensiu.** Karel mai pot estar sobre una roca. Qualsevol guard del tipus `if (cell === 'P') return errStop('rock')` dins de `drop()` seria codi mort. No afegir-lo: és confús i indueix a pensar que l'estat podria ser invàlid quan no pot ser-ho.

**`compareGoal` ignora per defecte la direcció final de Karel.** Decisió pedagògica: l'exercici es considera resolt si Karel és a la posició correcta i el món té el contingut correcte (també la casella de sota en Karel). Si cal, l'objectiu pot demanar-la amb `;direccio`.

**La indentació segueix exactament les regles de Python** (pila de nivells, INDENT/DEDENT). Cap línia s'ignora en silenci: si alguna cosa no quadra, és un error de sintaxi amb número de línia i un missatge en català.

**Les funcions es poden cridar abans de la línia on es defineixen** (com si totes les `def` es llegissin primer). En Python real cal definir-les abans; els esquelets del curs sempre les posen a dalt.

**`not` suporta dues sintaxis.** `not cond()` i `not(cond())` ambdues funcionen. Això és Python-compatible i pedagògicament útil.

---

## 14. Checklist per a qualsevol modificació

Abans de fer qualsevol canvi:

- [ ] El canvi és **additiu** o **invasiu**? Preferir sempre additiu.
- [ ] Si modifiques `i18n.js`: has mantingut la paritat d'ordre entre `commands[]` i `K.CMD_ACTIONS`? Entre `conditions[]` i `K.COND_ACTIONS`?
- [ ] Si hi ha textos nous per a l'alumne: segueixen els criteris de lectura fàcil (secció 10)? Si són de `K.UI_LANGS.ca`, tenen la versió fàcil a `js/i18n-facil.js`?
- [ ] Si afegeixes un script nou: l'has inclòs a `simulador.html` (i a `tests/comprova-curs.js` si és del motor) en la posició correcta? Has exportat totes les funcions via `K.nomFuncio`?
- [ ] Si modifiques el parser o tokenitzador: `for _ in range(10): move()` i `for i in range(3):\n    move()` segueixen funcionant tots dos? (el test automàtic ho comprova)
- [ ] Has executat `node tests/comprova-curs.js` i surt «✓ Tot correcte»?
- [ ] Si has creat o modificat un exercici amb objectiu: té la seva `<solucio>` i el test la supera?
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
| `curs/BRIEFING-REPTES.md` | Detall de cada repte: mapes, notes pedagògiques. | ✅ Actiu |
| `tests/comprova-curs.js` | Test automàtic (vegeu secció 16). | ✅ Actiu |

---

## 16. Test automàtic del curs

```
node tests/comprova-curs.js
```

No cal instal·lar res (només Node.js). Carrega els mateixos fitxers `js/*.js` que el
navegador i comprova:

1. **El motor:** ~50 programes que han de funcionar o donar un error concret (amb els missatges de lectura fàcil)
   (indentació, parèntesis, noms mal escrits…) i el verificador d'objectius.
2. **Totes les pàgines de `curs/`:** format dels mapes i objectius (una sola K, mateixes
   dimensions, roques iguals al mapa i a l'objectiu, JSON vàlid…); que cada
   `<solucio>` superi **tots** els mons del seu exercici; que cada `<solucio-incorrecta>`
   en falli almenys un; i que els exemples no editables s'executin bé (o mostrin
   l'error que diuen amb `data-error`).
3. **`curs/capitols.js`:** que `REPTES_DATA` apunti a fitxers que existeixen i que el
   nombre de mons (`mons`) coincideixi amb la pàgina.

Acaba amb «✓ Tot correcte» o amb la llista d'errors (i codi de sortida 1). A GitHub,
l'acció `.github/workflows/comprova-curs.yml` l'executa a cada push.

---

---

## 17. Com portar millores de karelcat2

El -p fa servir el mateix motor que karelcat2. Quan karelcat2 millori:

1. **Copiar tal qual** de karelcat2: `js/*.js` (sense esborrar `js/i18n-facil.js`),
   `style.css`, `nav.css`, `footer.js`, `curs/progress.js`, `curs/curs.css`,
   `curs/capitol.html`, `favicon.svg`, `favicon.ico` i `apple-touch-icon.png`.
2. **Copiar i tornar a aplicar els canvis del -p:**
   - `simulador.html`: la línia `<script src="js/i18n-facil.js">` després de `js/i18n.js`,
     el codi inicial (`if front_is_clear():` / `move()`) i el glossari de lectura fàcil.
   - `edit-mapa.html`: la mateixa línia `<script src="js/i18n-facil.js">`.
   - `curs/capitols.js`: `CAPITOLS_DATA` i `REPTES_DATA` del -p, el progrés dels reptes
     d'un sol món (`repteNum` a `_renderSingleMon` i al listener) i els textos fàcils.
   - `tests/comprova-curs.js`: `'i18n-facil'` a la llista de fitxers i les expressions
     dels missatges d'error.
   - `index.html` i `curs/index.html`: els textos i els números (10 capítols, 9 reptes).
   - `presentacio-karel.html`: **no copiar-la**, és pròpia del -p. Si karelcat2 hi millora
     la navegació (el `<script>` del final), portar només aquell canvi.
3. **Missatges nous:** si karelcat2 afegeix claus a `K.UI_LANGS.ca`, afegir-ne la versió
   fàcil a `js/i18n-facil.js`.
4. **No copiar** les pàgines `curs/capitol-*.html` ni `curs/repte-*.html`: el contingut
   és propi. Si karelcat2 canvia l'estructura d'aquestes pàgines, aplicar només aquell canvi.
5. Executar `node tests/comprova-curs.js` i comprovar que surt «✓ Tot correcte».

---

*Última actualització: perla més visible en mode clar (D.1) i icona de la pestanya del
navegador a totes les pàgines (D.4), portades de karelcat2. Abans: capítol 10 «Codi net»
recuperat (P.4), presentació inicial pròpia (P.1), capítol futur (P.2), repte 8 (P.3).*
