# BRIEFING-REPTES — Capítol 10 de Karelcat

> **Propòsit d'aquest document:** registrar l'estat de la implementació dels 13 reptes del capítol 10. Cada sessió de treball ha d'actualitzar la taula d'estat i les notes de cada repte implementat abans de tancar. Un BRIEFING obsolet és més perillós que no tenir-ne.

---

## Context ràpid

- **Projecte:** karelcat — curs interactiu de en Karel en català, temàtica marina.
- **Capítol 10:** no introdueix sintaxi nova. L'alumne combina tot el que sap. Inspirat en els exercicis de Stanford CS106A / Code in Place.
- **Document de disseny de referència:** `docs/reptes.docx` (conté enunciats, mapes, principis pedagògics i ordre recomanat d'implementació).
- **Plantilla HTML:** `curs/capitol.html` (cada repte segueix la mateixa estructura que els capítols anteriors).
- **Regla de mapes HTML:** el separador de files és `|` (literal, no és `\n` ni tampoc és `\\n`).
- **Solució de referència:** s'inclou en un comentari HTML al final del fitxer, mai en `data-code`.

---

## Taula d'estat dels 13 reptes

| # | Fitxer | Títol | Grup | Dificultat | Estat |
|---|--------|-------|------|------------|-------|
| 1 | `repte-1.html` | El diari | A | ★ Fàcil | ✅ Implementat |
| 2 | `repte-2.html` | El passadís | A | ★ Fàcil | ✅ Implementat |
| 3 | `repte-3.html` | L'escala diagonal | A | ★ Fàcil | ✅ Implementat |
| 4 | `repte-4.html` | Distribuir les perles | A | ★ Fàcil | ✅ Implementat |
| 5 | `repte-5.html` | El serpentí | B | ★★ Intermedi | ✅ Implementat |
| 6 | `repte-6.html` | Construir torres | B | ★★ Intermedi | ✅ Implementat |
| 7 | `repte-7.html` | L'escala doble | B | ★★ Intermedi | ✅ Implementat |
| 8 | `repte-8.html` | El vigilant | B | ★★ Intermedi | ✅ Implementat |
| 9 | `repte-9.html` | Les files alternes | B | ★★ Intermedi | ✅ Implementat |
| 10 | `repte-10.html` | El detector | C | ★★★ Avançat | ✅ Implementat |
| 11 | `repte-11.html` | El tauler d'escacs | C | ★★★ Avançat | ✅ Implementat |
| 12 | `repte-12.html` | El laberint | C | ★★★ Avançat | ✅ Implementat |
| 13 | `repte-13.html` | El punt mig | C | ★★★ Avançat | ✅ Implementat |

---

## Detall per repte

### ✅ Repte 1 — El diari (A1, ★ Fàcil)

**Fitxer:** `curs/repte-1.html`
**Conceptes:** descomposició procedimental, `while front_is_clear()`, pre/postcondicions.
**Adaptació de:** Collect Newspaper en Karel (Stanford CS106A).

**Mons de test (3 simuladors):**
```
Test A — cova curta  (2 passos): P,P,P,P|K>,.,A,P|P,P,P,P
Test B — cova normal (3 passos): P,P,P,P,P|K>,.,.,A,P|P,P,P,P,P
Test C — cova llarga (4 passos): P,P,P,P,P,P|K>,.,.,.,A,P|P,P,P,P,P,P
```
*(Cova tancada per la dreta amb una roca. La paret dreta és la condició de parada per a `surt_de_la_cova()`; la frontera esquerra del món per a `torna_a_casa()`.)*

**Mapa final (data-goal):** en Karel de tornada a la posició inicial, cap perla al món.

**Clau pedagògica:** Un alumne que hardcodi `move()×N` passa el test B però falla els tests A i C. La solució correcta usa `while front_is_clear(): move()` dins de cada funció. La descomposició en tres funcions amb noms clars continua sent obligatòria.

**Solució de referència (professor):**
```python
def surt_de_la_cova():
    while front_is_clear():
        move()

def recull_la_perla():
    grab()

def torna_a_casa():
    turn_around()
    while front_is_clear():
        move()
    turn_around()

surt_de_la_cova()
recull_la_perla()
torna_a_casa()
```

**Notes d'implementació:**
- La navegació del repte apunta a `capitol-10.html` (anterior) i `repte-2.html` (següent).
- El badge de dificultat `★ Fàcil` es mostra amb CSS inline al fitxer.
- La introducció al capítol 10 (filosofia + badges de dificultat) es troba a la secció inicial d'aquest fitxer. Els reptes 2–10 **no han de repetir** aquesta introducció; han de començar directament amb el seu repte i incloure la navegació prev/next adequada.

---

### ✅ Repte 2 — El passadís (A2, ★ Fàcil)

**Fitxer:** `curs/repte-2.html`
**Conceptes:** `while` + `if`, error de límit.
**Adaptació de:** Cleanup en Karel.

**Mapa inicial (test A — 8 caselles):**
```
K>,A,.,A,A,.,A,.
```

**Mapa inicial (test B — 9 caselles):**
```
K>,.,A,.,A,.,.,A,.
```

**Mapa inicial (test C — 12 caselles):**
```
K>,A,A,.,.,A,.,A,.,.,A,.
```

**Mapa final (data-goal):** en Karel a l'extrem dret, cap perla al món. Ex.: `.,.,.,.,.,.,.,K>` (8 caselles).

**Clau pedagògica:** La iteració `while front_is_clear()` s'atura quan el camí és bloquejat, però en aquell moment en Karel és a l'última casella i encara no l'ha comprovat. L'alumne ha de detectar l'error de límit i afegir `if pearl_here(): grab()` fora del `while`.

**Solució de referència (professor):**
```python
while front_is_clear():
    if pearl_here():
        grab()
    move()
if pearl_here():
    grab()
```

**Notes d'implementació:**
- S'han implementat 3 mons de test (longituds 8, 9 i 12) com a simuladors separats en el mateix fitxer.
- El `data-goal` usa en Karel a l'extrem dret sense perles.
- El `data-code` inicial inclou l'esquelet amb el `while` per guiar l'alumne cap al error de límit.
- La navegació: anterior → `repte-1.html`, següent → `repte-3.html`.

---

### ✅ Repte 3 — L'escala diagonal (A3, ★ Fàcil)

**Fitxer:** `curs/repte-3.html`
**Conceptes:** `for`, seqüències compostes dins la iteració, pre/postcondicions de funció.
**Adaptació de:** Ramp Climbing en Karel (Stanford CS106A).

**Mons de test (3 simuladors):**
- Test A — 3×3, N=2 graons
- Test B — 5×5, N=4 graons
- Test C — 8×8, N=7 graons

**Motxilla inicial:** `data-bag="99"` (pràcticament infinita) als tres simuladors.

**Funció principal:** `construeix_grao()` = `drop()` + `move()` + `turn_left()` + `move()` + `turn_right()`

**Clau pedagògica:** La funció `construeix_grao()` té una precondició i postcondició idèntiques (en Karel mira a l'Est). Gràcies a aquesta simetria, encadenar N crides amb `for` és trivial. Si la postcondició no es compleix (p. ex. s'oblida el `turn_right()` final), el segon graó surt en la direcció equivocada.

**Notes d'implementació:**
- Nom de funció: `construeix_grao` (en lloc de `puja_grao`) — emfatitza l'acció de construir, no només de pujar.
- La navegació: anterior → `repte-2.html`, següent → `repte-4.html`.

---

### ✅ Repte 4 — Distribuir les perles (A4, ★ Fàcil)

**Fitxer:** `curs/repte-4.html`
**Conceptes:** `while not bag_is_empty()`, `drop()`, motxilla com a comptador implícit.
**Adaptació de:** Spread Beepers (Stanford CS106A).

**Decisió de disseny:** el motor no suporta piles (N perles per casella). Les perles s'inicialitzen a la motxilla via `data-bag`. El passadís té sempre una casella extra de marge al final (N+1 caselles per a N perles) perquè l'últim `move()` no xoqui amb la paret.

**Mons de test (3 simuladors separats):**
- Test A — 3 perles, `K>,.,.,. ` → goal `A,A,A,K>`
- Test B — 5 perles, `K>,.,.,.,.,.` → goal `A,A,A,A,A,K>`
- Test C — 7 perles, `K>,.,.,.,.,.,.,.` → goal `A,A,A,A,A,A,A,K>`

**Solució de referència:**
```python
while not bag_is_empty():
    drop()
    move()
```

**Clau pedagògica:** `bag_is_empty()` com a condició de parada desacobla el codi de la geometria del món. El mateix programa funciona per a qualsevol longitud de passadís (sempre que hi hagi la casella de marge final).

**Notes d'implementació:**
- La navegació: anterior → `repte-3.html`, següent → `repte-5.html`.

---

### ✅ Repte 5 — El serpentí (B1, ★★ Intermedi)

**Conceptes:** `while`, `if`, girs condicionals, navegació multi-fila.
**Adaptació de:** Cleanup en Karel (variant dues files).

**Enunciat:** En Karel ha de recollir totes les perles d'un món de dues files (amplada desconeguda). Ha de fer el recorregut en ziga-zaga: fila inferior cap a l'Est, puja, fila superior cap a l'Oest.

**Mapa exemple:**
```
.,A,.,A,.,A
K>,A,.,A,.,A
```

**Clau pedagògica:** El gir al canvi de fila ha de ser precís (dos `turn_left()` o equivalent). Postcondicions de gir.

---

### ✅ Repte 6 — Construir torres (B2, ★★ Intermedi)

**Fitxer:** `curs/repte-6.html`
**Conceptes:** `def`, descomposició, pre/postcondicions, `while` imbricat.
**Adaptació de:** Stone Mason Karel (Stanford CS106A).

**Mons de test (3 simuladors):**
```
Test A — 7×3, 3 torres (cols 0, 3, 6):
  Inicial: .,.,.,.,.,.,.|.,.,.,.,.,.,.|K>,.,.,A,.,.,A
  Goal:    A,.,.,A,.,.,A|A,.,.,A,.,.,A|A,.,.,A,.,.,K>

Test B — 7×4, 3 torres (cols 0, 3, 6):
  Inicial: .,.,.,.,.,.,.|.,.,.,.,.,.,.|.,.,.,.,.,.,.|K>,.,.,A,.,.,A
  Goal:    A,.,.,A,.,.,A|A,.,.,A,.,.,A|A,.,.,A,.,.,A|A,.,.,A,.,.,K>

Test C — 10×4, 4 torres (cols 0, 3, 6, 9):
  Inicial: .,.,.,.,.,.,.,.,.,.|.,.,.,.,.,.,.,.,.,.|.,.,.,.,.,.,.,.,.,.|K>,.,.,A,.,.,A,.,.,A
  Goal:    A,.,.,A,.,.,A,.,.,A|A,.,.,A,.,.,A,.,.,A|A,.,.,A,.,.,A,.,.,A|A,.,.,A,.,.,A,.,.,K>
```

**Motxilla inicial:** `data-bag="99"` (pràcticament infinita) als tres simuladors.

**Solució de referència:**
```python
def omple_columna():
    turn_left()
    while front_is_clear():
        if not pearl_here():
            drop()
        move()
    if not pearl_here():
        drop()
    turn_around()
    while front_is_clear():
        move()
    turn_left()

def avança_a_seguent():
    move()
    move()
    move()

omple_columna()
while front_is_clear():
    avança_a_seguent()
    omple_columna()
```

**Clau pedagògica:** La pre/postcondició de `omple_columna()` és sempre *(base de la columna, orientació Est)*. Aquesta simetria permet encadenar N crides amb un sol `while` sense cap comptador. El gir final és `turn_left()` (Sud→Est), no `turn_right()` (que donaria Oest). Un alumne que confon el gir final passa el Test A però la columna 2 es construeix en la direcció equivocada.

**Notes d'implementació:**
- Les bases (perles marcadores) es compten com a part de la torre: `if not pearl_here(): drop()` dins la iteració les preserva i no gasta motxilla de més.
- El `while front_is_clear()` principal s'atura sol perquè els tres mons estan dissenyats sense caselles buides a la dreta de l'última torre.
- La navegació: anterior → `repte-5.html`, següent → `repte-7.html`.

---

### ✅ Repte 7 — L'escala doble (B3, ★★ Intermedi)

**Fitxer:** `curs/repte-7.html`
**Conceptes:** `def`, `while not pearl_here()`, `while front_is_clear()`, seqüències simètriques, transició pujada/baixada.
**Adaptació de:** Double Staircase en Karel (variant CS106A).

**Mons de test (3 simuladors):**
```
Test A — 5×3, N=2 graons:
  Inicial: .,.,A,.,.|.,.,.,.,.|K>,.,.,.,. 
  Goal:    .,.,.,.,.|.,.,.,.,.|.,.,.,.,K>

Test B — 7×4, N=3 graons:
  Inicial: .,.,.,A,.,.,.|.,.,.,.,.,.,.|.,.,.,.,.,.,.|K>,.,.,.,.,.,. 
  Goal:    .,.,.,.,.,.,.|.,.,.,.,.,.,.|.,.,.,.,.,.,.|.,.,.,.,.,.,K>

Test C — 9×5, N=4 graons:
  Inicial: .,.,.,.,A,.,.,.,.|.,.,.,.,.,.,.,.,.|.,.,.,.,.,.,.,.,.|.,.,.,.,.,.,.,.,.|K>,.,.,.,.,.,.,.,.
  Goal:    .,.,.,.,.,.,.,.,.|.,.,.,.,.,.,.,.,.|.,.,.,.,.,.,.,.,.|.,.,.,.,.,.,.,.,.|.,.,.,.,.,.,.,.,K>
```

*(Món completament obert. La perla de la cima és l'únic marcador de posició. La paret dreta del món atura la baixada.)*

**Motxilla inicial:** `data-bag` no s'usa (en Karel no porta perles pròpies; recull la perla de la cima).

**Solució de referència:**
```python
def puja_grao():
    move()
    turn_left()
    move()
    turn_right()

def baixa_grao():
    turn_right()
    move()
    turn_left()
    move()

while not pearl_here():
    puja_grao()

grab()

while front_is_clear():
    baixa_grao()

drop()
```

**Esquelet visible per l'alumne:** `puja_grao()` implementada com a referència; `baixa_grao()` buida (l'alumne ha de descobrir la inversió); iteració de pujada donada (`while not pearl_here()`); iteració de baixada i `drop()` a completar.

**Clau pedagògica:** La simetria `puja_grao ↔ baixa_grao` és el nucli del repte: `baixa_grao()` és exactament l'invers pas a pas de `puja_grao()`. Un cop identificada aquesta simetria, el programa principal resulta trivial. La condició `while not pearl_here()` demostra que es pot aturar una iteració per l'estat del món (presència d'una perla) en comptes d'un comptador; `while front_is_clear()` per a la baixada aprofita la paret del món com a condició de parada natural.

**Notes d'implementació:**
- Mons completament oberts (sense roques interiors); l'estructura de l'escala la defineix l'algorisme, no la geometria del món.
- `while not pearl_here(): puja_grao()` és agnòstic de N: funciona per a 2, 3 o 4 graons sense canvis.
- `while front_is_clear(): baixa_grao()` s'atura automàticament quan en Karel arriba a la paret dreta del món (col 2N, fila inferior).
- Per a cada test, la posició final de en Karel coincideix amb la posició on es deixa la perla (extrem inferior dret de l'escala).
- La navegació: anterior → `repte-6.html`, següent → `repte-8.html`.

---

### ✅ Repte 8 — El vigilant (B4, ★★ Intermedi)

**Fitxer:** `curs/repte-8.html`
**Conceptes:** `while`, `drop()` com a marca, perímetre rectangular, pre/postcondicions.
**Adaptació de:** Exercici de perímetre (original karelcat).

**Enunciat:** En Karel ha de caminar pel perímetre d'un rectangle buit i deixar
una perla a cada cantonada.

**Mons de test (3 simuladors DRY):**
```
Test A — rectangle 4×3
Test B — rectangle 6×4
Test C — rectangle 5×5
```

**Clau pedagògica:** `drop()` com a marca física en lloc d'una variable comptadora.
La solució generalitzada funciona per a qualsevol rectangle sense hardcodejar dimensions.

**Notes d'implementació:**
- La navegació: anterior → `repte-7.html`, següent → `repte-9.html`.

---

### ✅ Repte 9 — Les files alternes (B5, ★★ Intermedi)

**Fitxer:** `curs/repte-9.html`
**Conceptes:** `while`, `if`, serpentí multifiles, paritat sense variables.
**Adaptació de:** Variant del serpentí de dues files estès a N files.

**Enunciat:** En Karel ha de recollir totes les perles d'un món de N files
(amplada i alçada desconegudes) fent un recorregut en ziga-zaga generalitzat.

**Mons de test (3 simuladors DRY):**
```
Test A — 2 files
Test B — 3 files
Test C — 4 files
```

**Clau pedagògica:** La paritat de la fila (parell/senar) determina la direcció,
però sense variables numèriques. `pearl_here()` al moment de canvi de fila actua
com a indicador de paritat implícit, igual que al repte 11 del tauler d'escacs.

**Notes d'implementació:**
- La navegació: anterior → `repte-8.html`, següent → `repte-10.html`.

---

### ✅ Repte 10 — El detector (C0, ★★★ Avançat)

**Fitxer:** `curs/repte-10.html`
**Conceptes:** `while`, `if/elif/else`, `left_is_clear()`, `right_is_clear()`, alcoves laterals, error de límit.
**Adaptació de:** Original karelcat.

**Enunciat:** En Karel avança per un corredor amb alcoves laterals. Cada cop que
detecta una alcova (esquerra o dreta lliure), ha de deixar-hi una perla i continuar.

**Mons de test (3 simuladors DRY):**
```
Test A — corredor amb alcoves esquerres
Test B — corredor amb alcoves dretes
Test C — corredor amb alcoves mixtes
```

**Clau pedagògica:** `left_is_clear()` i `right_is_clear()` com a detectors
de geometria lateral. L'error de límit és el moment de decidir si la primera i l'última
casella del corredor compten com a alcova.

**Notes d'implementació:**
- La navegació: anterior → `repte-9.html`, següent → `repte-11.html`.

---

### ✅ Repte 11 — El tauler d'escacs (C1, ★★★ Avançat)

**Fitxer:** `curs/repte-11.html`
**Conceptes:** `while`, `if`, `pearl_here()` com a memòria de paritat, serpentí bidireccional, pre/postcondicions.
**Adaptació de:** Checkerboard en Karel (Stanford CS106A — el repte més cèlebre).

**Mons de test (3 simuladors):**
```
Test A — 3×3:
  Inicial: .,.,.|.,.,.|K>,.,.
  Goal:    A,.,K>|.,A,.|A,.,A

Test B — 4×4:
  Inicial: .,.,.,.|.,.,.,.|.,.,.,.|K>,.,.,.
  Goal:    K<,A,.,A|A,.,A,.|.,A,.,A|A,.,A,.

Test C — 5×3:
  Inicial: .,.,.,.,.|.,.,.,.,.|K>,.,.,.,.
  Goal:    A,.,A,.,K>|.,A,.,A,.|A,.,A,.,A
```

*(La cantonada inferior esquerra sempre és ON. El patró alterna ON/OFF per (row+col)%2.)*

**Motxilla inicial:** `data-bag="99"` (pràcticament infinita).

**Clau del disseny — el truc de la paritat física:**
Al final de cada fila, `pearl_here()` codifica la paritat de la darrera casella visitada.
- `True` (ON) → la primera casella de la nova fila és OFF → cridar `omple_fila_des_de_off()`
- `False` (OFF) → la primera casella de la nova fila és ON → cridar `omple_fila_des_de_on()`

Sense variables numèriques, l'estat físic del món substitueix el comptador de paritat.

**Solució de referència:**
```python
def omple_fila_des_de_on():
    if not pearl_here():
        drop()
    while front_is_clear():
        move()
        if front_is_clear():
            move()
            if not pearl_here():
                drop()

def omple_fila_des_de_off():
    while front_is_clear():
        move()
        if not pearl_here():
            drop()
        if front_is_clear():
            move()

def canvia_fila_des_d_est():
    turn_left()
    move()
    turn_left()

def canvia_fila_des_d_oest():
    turn_right()
    move()
    turn_right()

omple_fila_des_de_on()

while left_is_clear():
    if pearl_here():
        canvia_fila_des_d_est()
        omple_fila_des_de_off()
    else:
        canvia_fila_des_d_est()
        omple_fila_des_de_on()

    if not right_is_clear():
        break
    if pearl_here():
        canvia_fila_des_d_oest()
        omple_fila_des_de_off()
    else:
        canvia_fila_des_d_oest()
        omple_fila_des_de_on()
```

**Esquelet visible per l'alumne:** `omple_fila_des_de_on()` completament implementada com a referència; `omple_fila_des_de_off()` buida (l'alumne descobreix la versió simètrica); les dues funcions de transició donades; programa principal complet mostrant el truc de `pearl_here()`.

**Clau pedagògica:** `pearl_here()` com a «variable» de paritat és l'epifania del repte. L'alumne descobreix que l'estat físic del món pot substituir una variable booleana, sempre que es consulti en el moment precís (just abans de moure's a la nova fila). La simetria `omple_fila_des_de_on ↔ omple_fila_des_de_off` paral·lela a la de `puja_grao ↔ baixa_grao` del repte 7.

**Notes d'implementació:**
- El `while left_is_clear()` + `break` gestiona tots els casos: nombre parell i senar de files, quadrats i rectangles.
- `left_is_clear()` comprova el Nord quan en Karel mira l'Est; `right_is_clear()` comprova el Nord quan en Karel mira l'Oest.
- La navegació: anterior → `repte-10.html`, següent → `repte-12.html`.

---

### ✅ Repte 12 — El laberint (C2, ★★★ Avançat)

**Fitxer:** `curs/repte-12.html`
**Conceptes:** `while`, `if/elif/else`, `right_is_clear()`, `front_is_clear()`, `def`, estratègia de la mà dreta.
**Adaptació de:** Maze en Karel / Repte predefinit 5 del projecte.

**Mons de test (5 simuladors DRY — un sol editor):**
```
Test A — 3×5 (Simple):
  Inicial: K>,.,.,.,P|P,P,P,.,P|.,.,.,.,A
  Goal:    K>,.,.,.,P|P,P,P,.,P|.,.,.,.,K>

Test B — 5×6 (Clàssic — laberint del repte predefinit 5):
  Inicial: K>,.,P,.,.,.|.,.,P,.,P,.|.,.,.,.,P,.|P,P,P,.,P,.|.,.,.,.,.,A
  Goal:    K>,.,P,.,.,.|.,.,P,.,P,.|.,.,.,.,P,.|P,P,P,.,P,.|.,.,.,.,.,K>

Test C — 5×7 (Complex):
  Inicial: K>,.,P,.,.,.,P|.,.,P,.,P,.,P|.,.,.,.,P,.,P|P,P,P,P,P,.,P|.,.,.,.,.,.,A
  Goal:    K>,.,P,.,.,.,P|.,.,P,.,P,.,P|.,.,.,.,P,.,P|P,P,P,P,P,.,P|.,.,.,.,.,.,K>

Test D — 5×7 (Cul-de-sac):
  Inicial: K>,.,.,.,P,P,P|P,P,P,.,P,P,P|.,.,.,.,.,.,.|P,P,.,P,P,P,P|.,.,.,.,.,.,A
  Goal:    .,.,.,.,P,P,P|P,P,P,.,P,P,P|.,.,.,.,.,.,.|P,P,.,P,P,P,P|.,.,.,.,.,.,K>

Test E — 9×9 (El gran laberint — dos culs-de-sac):
  Inicial: K>,.,P,P,P,P,P,P,P|P,.,P,P,P,P,P,P,P|P,.,.,.,.,.,.,.,P|P,P,P,P,P,P,P,.,P|P,.,.,.,.,.,.,.,P|P,P,.,P,P,P,P,P,P|.,.,.,.,P,P,P,P,P|P,P,P,.,P,P,P,P,P|P,P,P,.,.,.,.,.,A
  Goal:    .,.,P,P,P,P,P,P,P|P,.,P,P,P,P,P,P,P|P,.,.,.,.,.,.,.,P|P,P,P,P,P,P,P,.,P|P,.,.,.,.,.,.,.,P|P,P,.,P,P,P,P,P,P|.,.,.,.,P,P,P,P,P|P,P,P,.,P,P,P,P,P|P,P,P,.,.,.,.,.,K>
```

*(Test D: en Karel entra al cul-de-sac de la fila 2 (cols 2→0), xoca, torna enrere i troba la sortida.
Test E: en Karel explora les 30 caselles del laberint, entrant en dos culs-de-sac: (4,1) i (6,0).)*

**Esquelet visible per l'alumne:**
```python
def pas():
    # Regla de la mà dreta — tres casos mútuament excloents:
    # 1. Si la dreta és lliure → gira a la dreta i avança un pas
    # 2. Si la dreta és bloquejada però el davant és lliure → avança un pas
    # 3. Si dreta i davant estan bloquejats → gira a l'esquerra (no avancis)


# ── Programa principal ──
while not pearl_here():
    pas()

grab()
```

**Solució de referència:**
```python
def pas():
    if right_is_clear():
        turn_right()
        move()
    elif front_is_clear():
        move()
    else:
        turn_left()

while not pearl_here():
    pas()

grab()
```

**Clau pedagògica:** La regla de la mà dreta demostra que un algorisme senzill i genèric pot resoldre problemes aparentment complexos. La descomposició en una sola funció `pas()` dins d'un `while not pearl_here()` és l'exemple més net del curs de «algorisme = iteració + condició de parada». El test C detecta qui ha confós `turn_left()` amb `turn_right()` (la mà esquerra funciona en molts laberints però no en tots). Els tests D i E demostren que el mateix codi funciona amb culs-de-sac: en Karel hi entra, xoca, gira, en surt sol, i continua cap a la perla sense canviar ni una línia.

**Notes d'implementació:**
- Format DRY: un sol `data-code`, cinc mons via `data-maps`/`data-goals`/`data-labels`.
- Test B reutilitza exactament el mapa del repte predefinit 5 de `reptes.js`.
- `data-bag` no s'usa (en Karel no porta perles pròpies; recull una perla existent).
- La navegació: anterior → `repte-11.html`, següent → `repte-13.html`.

---

### ✅ Repte 13 — El punt mig (C3, ★★★ Avançat)

**Fitxer:** `curs/repte-13.html`
**Conceptes:** `while`, `if`, `grab`/`drop` com a marcadors, algorisme dels dos punters.
**Adaptació de:** Midpoint en Karel (l'exercici més citat del CS106A).

**Enunciat:** El món és un passadís buit de longitud desconeguda (sempre ≥ 1). En Karel porta 2 perles a la motxilla i ha de deixar exactament una perla al punt mig. Si la longitud és imparella, al centre exacte; si és parella, s'accepta qualsevol de les dues caselles centrals.

**Mons de test (3 simuladors DRY — un sol editor):**
```
Test A — longitud 3 (imparella, centre a casella 1):
  Inicial: K>,.,.
  Goal:    .,K>,.

Test B — longitud 7 (imparella, centre a casella 3):
  Inicial: K>,.,.,.,.,.,.
  Goal:    .,.,.,K>,.,.,.

Test C — longitud 8 (parella, centre a casella 3 o 4):
  Inicial: K>,.,.,.,.,.,.,.
  Goal:    .,.,.,K<,.,.,.,.
```

**Motxilla inicial:** `data-bag="2"` (les dues perles fan de marcadors).

**Nota sobre els goals:** al final de l'algorisme, en Karel es queda damunt de la perla del punt mig (un dels dos marcadors). `currentStateToCSV()` mostra `K{dir}` en aquella casella (la perla queda amagada sota en Karel). El goal reflecteix la posició i orientació final de en Karel:
- Longitud imparella: en Karel acaba orientat **Est** (`K>`) sobre la casella central.
- Longitud parella: en Karel acaba orientat **Oest** (`K<`) sobre la casella central esquerra.

**Solució de referència:**
```python
def camina_fins_perla():
    while not pearl_here():
        move()

if not front_is_clear():
    drop()  # cas especial: longitud 1
else:
    drop()                  # marcador esquerre (L)
    while front_is_clear():
        move()
    drop()                  # marcador dret (R)
    turn_around()           # gira cap al centre

    while True:
        grab()              # recull R
        move()              # avança un pas cap al centre
        if pearl_here():    # L és aquí → punt mig trobat
            break
        drop()              # R en nova posició

        while not pearl_here():
            move()          # torna fins a L
        grab()              # recull L
        turn_around()       # gira cap al centre
        move()              # avança un pas cap al centre
        if pearl_here():    # R és aquí → punt mig trobat
            break
        drop()              # L en nova posició

        while not pearl_here():
            move()          # torna fins a R
        turn_around()       # prepara per al proper grab()
```

**Clau pedagògica:** L'algorisme dels dos punters és l'epifania final del curs. Sense variables numèriques ni aritmètica, la posició física de les perles substitueix qualsevol comptador. Cada iteració redueix en 2 la distància entre els marcadors, fins que es troben exactament al punt mig. La simetria de l'algorisme (moure dret → moure esquerre → repetir) paral·lela la de `puja_grao ↔ baixa_grao` (repte 7) i `omple_fila_des_de_on ↔ omple_fila_des_de_off` (repte 11): el curs tanca el cercle.

**Esquelet visible per l'alumne:** `camina_fins_perla()` completament implementada; els dos passos de l'algorisme descrits com a comentaris, sense codi. L'alumne ha de descobrir la iteració `while True`, els `grab()`/`drop()` i les condicions de sortida.

**Notes d'implementació:**
- Format DRY: un sol `data-code`, tres mons via `data-maps`/`data-goals`/`data-labels`.
- `data-bag="2"` — les dues perles de la motxilla fan de marcadors; no en cal cap de fixa al món.
- El cas de longitud 1 (front bloquejat) requereix un `if not front_is_clear(): drop()` inicial; si l'alumne l'omet, el test A (longitud 3) segueix funcionant, però un eventual test de longitud 1 fallaria.
- La navegació: anterior → `repte-12.html`, següent → `index.html` (tornar a l'índex).

---

## Notes d'arquitectura a tenir en compte

- **Navegació prev/next:** cada fitxer `repte-N.html` ha d'apuntar a `repte-(N-1).html` i `repte-(N+1).html`. El repte 1 apunta a `capitol-9.html` com a anterior. El repte 13 apunta a `index.html` (tornada a l'índex).
- **CURRENT_REPTE:** tots els reptes usen `const CURRENT_REPTE = N;` (on N és el número del repte) i criden `renderReptesSidebar(CURRENT_REPTE)` per marcar el repte actiu a la sidebar.
- **La introducció al capítol** (filosofia + badges de dificultat) ja està al repte 1. Els reptes 2–13 comencen directament amb l'enunciat.
- **Futur (opcional):** afegir entrades 6–18 a `reptes.js` per fer accessibles els reptes via `?repte=N`. Additiu, no trenca res existent.

---

*Última actualització: revisió de documentació — 13 reptes implementats. Numeració actualitzada: reptes 8 (El vigilant), 9 (Les files alternes) i 10 (El detector) afegits; antics reptes 8, 9, 10 renumerats a 11, 12, 13. Taula i fitxes de detall corregides per reflectir l'estat actual del codi.*
