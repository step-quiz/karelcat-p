# BRIEFING-REPTES — karelcat2-p

> **Propòsit:** fitxa de cada un dels 9 reptes del -p, generada a partir de les pàgines
> `curs/repte-N.html`. Si canvies un repte, actualitza'n la fitxa (o torna-la a generar).
> El test automàtic (`node tests/comprova-curs.js`) comprova que cada solució superi el
> seu món i que cada solució incorrecta el falli.

---

## Context ràpid

- **Alumnat:** Primària i aula d'acollida. Enunciats curts, en català de lectura fàcil,
  sense punts cardinals i sense pistes.
- **Un sol món per repte** (`data-map` + `data-goal`). L'alumne veu l'objectiu amb el
  botó «🎯 Objectiu» i, si falla, les diferències en vermell.
- **Format dels objectius** (verificador de karelcat2, `K.compareGoal`): es compara
  també la casella de sota en Karel (`K>A` = acaba damunt d'una perla). Si l'objectiu
  no té cap `K`, no es mira on acaba en Karel. Vegeu `docs/CURRENT-STATE.md`, secció 4.
- **Solucions de referència:** dins d'un comentari HTML al final de cada pàgina, entre
  `<solucio>` i `</solucio>`; mai a `data-code`.
- **Progrés:** quan l'alumne supera el repte, la barra lateral hi posa ✓ (`REPTES_DATA`
  a `curs/capitols.js`, amb `mons: 1`).
- **No inclosos:** els reptes avançats 10–13 de karelcat2.

---

## Taula de reptes

| # | Fitxer | Títol | Grup |
|---|--------|-------|------|
| 1 | `repte-1.html` | Recollir la perla | A |
| 2 | `repte-2.html` | El passadís | A |
| 3 | `repte-3.html` | L'escala diagonal | A |
| 4 | `repte-4.html` | Distribuir les perles | A |
| 5 | `repte-5.html` | El serpentí | B |
| 6 | `repte-6.html` | Construir torres | B |
| 7 | `repte-7.html` | L'escala doble | B |
| 8 | `repte-8.html` | El vigilant | B |
| 9 | `repte-9.html` | Les files alternes | B |

---

## Detall per repte

### Repte 1 — Recollir la perla

**Enunciat:** En Karel té una perla davant seu, a tres caselles. Escriu un programa perquè hi arribi i la reculli.

**Conceptes:** Seqüència d'instruccions, `grab()`.

**Mapa inicial i objectiu:**
```
mapa:     .,.,.,.,.|K>,.,.,A,.|.,.,.,.,.
objectiu: .,.,.,.,.|.,.,.,K>,.|.,.,.,.,.
```

**Notes:** Primer repte: molt curt, per guanyar confiança.

**Solució de referència:**
```python
move()
move()
move()
grab()
```

---

### Repte 2 — El passadís

**Enunciat:** En Karel és al principi d'un passadís. Hi ha algunes perles per terra. Recull-les totes i atura't al final.

**Conceptes:** `while front_is_clear()` + `if pearl_here()`.

**Mapa inicial i objectiu:**
```
mapa:     K>,A,.,A,A,.,A,.
objectiu: .,.,.,.,.,.,.,K>
```

**Notes:** Error de límit: l'última casella s'ha de mirar fora del `while` (en aquest món és buida, però és bo comentar-ho).

**Solució de referència:**
```python
while front_is_clear():
    if pearl_here():
        grab()
    move()
if pearl_here():
    grab()
```

---

### Repte 3 — L'escala diagonal

**Enunciat:** En Karel és a la cantonada inferior esquerra. Ha de pujar per l'escala fins a la cantonada superior dreta deixant una perla a cada graó. Has de fer servir la funció puja_grao() i while front_is_clear().

**Conceptes:** `def puja_grao()`, `while front_is_clear()`, `drop()`.

**Mapa inicial i objectiu:**
```
mapa:     .,.,.,.,.|.,.,.,.,.|.,.,.,.,.|.,.,.,.,.|K>,.,.,.,.
objectiu: .,.,.,.,K>|.,.,.,A,.|.,.,A,.,.|.,A,.,.,.|A,.,.,.,.
motxilla: 99
```

**Notes:** Motxilla de 99 perles. En Karel acaba a la cantonada de dalt a la dreta, sense deixar-hi perla.

**Solució de referència:**
```python
def puja_grao():
    move()
    turn_left()
    move()
    turn_right()

while front_is_clear():
    drop()
    puja_grao()
```

---

### Repte 4 — Distribuir les perles

**Enunciat:** En Karel té perles a la motxilla. Ha de deixar-ne una a cada casella mentre avança, fins que la motxilla quedi buida.

**Conceptes:** `while bag_has_pearls()` (o `while not bag_is_empty()`), `drop()`.

**Mapa inicial i objectiu:**
```
mapa:     K>,.,.,.
objectiu: A,A,A,.
motxilla: 3
```

**Notes:** L'objectiu no mira on acaba en Karel: només que hi hagi una perla a cada una de les tres primeres caselles.

**Solució de referència:**
```python
while bag_has_pearls():
    drop()
    move()
```

---

### Repte 5 — El serpentí

**Enunciat:** El fons marí té dues files amb perles. En Karel és a la cantonada inferior esquerra. Ha de recollir totes les perles fent un recorregut: primer la fila de baix d'esquerra a dreta, després la fila de dalt de dreta a esquerra.

**Conceptes:** `while`, `if`, girs per canviar de fila.

**Mapa inicial i objectiu:**
```
mapa:     A,.,.,A,.,.|K>,.,A,.,A,.
objectiu: K<,.,.,.,.,.|.,.,.,.,.,.
```

**Notes:** Primer la fila de baix cap a la dreta, després la de dalt cap a l'esquerra.

**Solució de referència:**
```python
while front_is_clear():
    move()
    if pearl_here():
        grab()
turn_left()
move()
turn_left()
if pearl_here():
    grab()
while front_is_clear():
    move()
    if pearl_here():
        grab()
```

---

### Repte 6 — Construir torres

**Enunciat:** En Karel és a la cantonada inferior esquerra. A cada columna marcada amb una perla a terra ha de construir una torre de perles, de baix a dalt. Has de fer servir una funció omple_columna().

**Conceptes:** `def omple_columna()`, `while` dins d'una funció, `if not pearl_here()`.

**Mapa inicial i objectiu:**
```
mapa:     .,.,.,.,.,.,.|.,.,.,.,.,.,.|K>,.,.,A,.,.,A
objectiu: A,.,.,A,.,.,A|A,.,.,A,.,.,A|A,.,.,A,.,.,K>A
motxilla: 99
```

**Notes:** Motxilla de 99 perles. Les perles de terra formen part de la torre. En Karel acaba damunt de la perla de l'última torre (`K>A`).

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

def ves_a_la_següent():
    move()
    move()
    move()

omple_columna()
while front_is_clear():
    ves_a_la_següent()
    omple_columna()
```

---

### Repte 7 — L'escala doble

**Enunciat:** En Karel és al peu d'una piràmide. Ha de pujar fins al cim, recollir la perla, baixar per l'altra banda i deixar la perla al peu.

**Conceptes:** `def puja_grao()` i `def baixa_grao()`, `while not pearl_here()`, `while front_is_clear()`.

**Mapa inicial i objectiu:**
```
mapa:     .,.,.,.,A,.,.,.,.|.,.,.,.,P,.,.,.,.|.,.,.,P,P,P,.,.,.|.,.,P,P,P,P,P,.,.|K>,P,P,P,P,P,P,P,.
objectiu: .,.,.,.,.,.,.,.,.|.,.,.,.,P,.,.,.,.|.,.,.,P,P,P,.,.,.|.,.,P,P,P,P,P,.,.|.,P,P,P,P,P,P,P,K>A
```

**Notes:** En Karel deixa la perla al peu de la piràmide i s'hi queda a sobre (`K>A`).

**Solució de referència:**
```python
def puja_grao():
    turn_left()
    move()
    turn_right()
    move()

def baixa_grao():
    move()
    turn_right()
    move()
    turn_left()

while not pearl_here():
    puja_grao()
grab()
while front_is_clear():
    baixa_grao()
drop()
```

---

### Repte 8 — El vigilant

**Enunciat:** En Karel és un vigilant. Ha de donar una volta sencera al voltant del seu món rectangular i recollir les perles que es trobi pel camí.

**Conceptes:** `def pas_vigilant()`, `if front_is_blocked()`, `for`.

**Mapa inicial i objectiu:**
```
mapa:     .,A,.,.|.,.,.,A|K>,A,.,.
objectiu: .,.,.,.|.,.,.,.|K>,.,.,.
```

**Notes:** Una volta sencera són 10 passos. La motxilla comença buida.

**Solució de referència:**
```python
def pas_vigilant():
    if front_is_blocked():
        turn_left()
    move()
    if pearl_here():
        grab()

for i in range(10):
    pas_vigilant()
```

---

### Repte 9 — Les files alternes

**Enunciat:** En Karel ha d'omplir de perles algunes files del fons marí: la primera, la tercera, la cinquena... I deixar buides les altres.

**Conceptes:** `def omple_fila()`, girs alterns entre files.

**Mapa inicial i objectiu:**
```
mapa:     .,.,.,.,.,.|.,.,.,.,.,.|.,.,.,.,.,.|.,.,.,.,.,.|K>,.,.,.,.,.
objectiu: A,A,A,A,A,A|.,.,.,.,.,.|A,A,A,A,A,A|.,.,.,.,.,.|A,A,A,A,A,A
motxilla: 99
```

**Notes:** Motxilla de 99 perles. L'objectiu no mira on acaba en Karel.

**Solució de referència:**
```python
def omple_fila():
    drop()
    while front_is_clear():
        move()
        drop()

omple_fila()
turn_left()
move()
move()
turn_left()
omple_fila()
turn_right()
move()
move()
turn_right()
omple_fila()
```

---

*Última actualització: reptes d'un sol món amb el motor de karelcat2; objectius adaptats al verificador nou (reptes 4, 6, 7 i 9) i solucions de referència verificades pel test automàtic.*
