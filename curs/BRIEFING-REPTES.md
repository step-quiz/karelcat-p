# BRIEFING-REPTES — karelcat_primaria

> **Propòsit d'aquest document:** registrar l'estat de la implementació dels 9 reptes del curs. Cada sessió de treball ha d'actualitzar la taula d'estat i les notes de cada repte implementat abans de tancar. Un BRIEFING obsolet és més perillós que no tenir-ne.

---

## Context ràpid

- **Projecte:** karelcat_primaria — adaptació de karelcat per a alumnes de Primària (9 anys aproximadament). Curs interactiu d'en Karel en català, temàtica marina.
- **Reptes:** no introdueixen sintaxi nova. L'alumne combina tot el que sap. Inspirats en els exercicis de Stanford CS106A / Code in Place.
- **Document de disseny de referència:** `docs/reptes.docx` (conté enunciats, mapes, principis pedagògics i ordre recomanat d'implementació).
- **Plantilla HTML:** `curs/capitol.html` (cada repte segueix la mateixa estructura que els capítols anteriors).
- **Regla de mapes HTML:** el separador de files és `|` (literal, no és `\n` ni tampoc és `\\n`).
- **Solució de referència:** s'inclou en un comentari HTML al final del fitxer, mai en `data-code`.
- **Reptes no inclosos a primària:** els reptes avançats 10–13 de karelcat ("El detector", "El tauler d'escacs", "El laberint", "El punt mig") no s'inclouen en aquesta adaptació.

---

## Taula d'estat dels 9 reptes

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
- La navegació del repte apunta a `capitol-futur.html` (anterior) i `repte-2.html` (següent).
- El badge de dificultat `★ Fàcil` es mostra amb CSS inline al fitxer.
- La introducció als reptes (filosofia + badges de dificultat) es troba a la secció inicial d'aquest fitxer. Els reptes 2–9 **no han de repetir** aquesta introducció; han de començar directament amb el seu repte i incloure la navegació prev/next adequada.

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
com a indicador de paritat implícit.

**Notes d'implementació:**
- La navegació: anterior → `repte-8.html`. És l'últim repte del curs; el botó "següent" està deshabilitat.

---

## Notes d'arquitectura a tenir en compte

- **Navegació prev/next:** cada fitxer `repte-N.html` ha d'apuntar a `repte-(N-1).html` i `repte-(N+1).html`. El repte 1 apunta a `capitol-futur.html` com a anterior. El repte 9 és l'últim del curs i el seu botó "següent" està deshabilitat.
- **CURRENT_REPTE:** tots els reptes usen `const CURRENT_REPTE = N;` (on N és el número del repte) i criden `renderReptesSidebar(CURRENT_REPTE)` per marcar el repte actiu a la sidebar.
- **La introducció al curs de reptes** (filosofia + badges de dificultat) ja està al repte 1. Els reptes 2–9 comencen directament amb l'enunciat.
- **Futur (opcional):** afegir entrades a `reptes.js` per fer accessibles els reptes via `?repte=N`. Additiu, no trenca res existent.

---

*Última actualització: adaptació del BRIEFING a karelcat_primaria. S'han retirat les fitxes de detall dels reptes 10–13 (avançats, no inclosos a primària) i s'han actualitzat les referències creuades, la taula d'estat i les notes d'arquitectura.*
