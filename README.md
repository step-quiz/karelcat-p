# karelcat-p

Spin-off de [karelcat](https://github.com/step-quiz/karelcat) per a:

- alumnat de **Primària**, i
- alumnat de **Secundària que fa menys de 2 anys que és a Catalunya** (aula d'acollida).

L'alumne controla **en Karel**, una medusa programable que viu en una graella submarina.

**Tot és en català de lectura fàcil, i només en català.** Un alumne que encara no parla
català (per exemple, que només parla urdú) vol que en Karel avanci. Per aconseguir-ho,
llegeix instruccions, missatges i enunciats en català, i així aprèn català «sense voler».

## Què és

Un curs de 10 capítols + un epíleg («D'en Karel al Python») i 9 reptes, accessible des del
navegador sense instal·lació, inspirat en el [Stanford Karel Reader](https://compedu.stanford.edu/karel-reader/docs/python/en/intro.html).
Cada capítol combina una explicació breu, exemples executables i un exercici.

El **motor** és el de karelcat: parser amb les regles de Python, verificador d'objectius,
botó «🎯 Objectiu», diferències marcades en vermell, pas a pas, codi desat per exercici i
test automàtic. El **contingut** és propi del -p: textos simplificats, sense punts cardinals,
reptes d'un sol món, i missatges d'error de lectura fàcil (`js/i18n-facil.js`).

## Estat actual

| Element | Estat |
|---------|-------|
| Motor (tokenizer + parser + intèrpret), igual que karelcat | ✅ Complet |
| Missatges en català de lectura fàcil | ✅ Fet |
| Capítol 1 — Coneix en Karel | ✅ Escrit |
| Capítol 2 — Recollir i deixar | ✅ Escrit |
| Capítol 3 — Gestió d'errors en un codi | ✅ Escrit |
| Capítol 4 — Repeteix | ✅ Escrit |
| Capítol 5 — Funcions | ✅ Escrit |
| Capítol 6 — Descomposició | ✅ Escrit |
| Capítol 7 — Condicionals | ✅ Escrit |
| Capítol 8 — Mentre | ✅ Escrit |
| Capítol 9 — Combinant condicions | ✅ Escrit |
| Capítol 10 — Codi net | ✅ Escrit |
| Epíleg — D'en Karel al Python | ✅ Escrit |
| Reptes 1–9 (un sol món cadascun) | ✅ Tots implementats |
| Reptes 10–13 de karelcat (avançats) | ⛔ No inclosos |

## Sintaxi del llenguatge

```python
# Instruccions
move()  turn_left()  turn_right()  turn_around()  grab()  drop()

# Condicions
front_is_clear()  front_is_blocked()
left_is_clear()   left_is_blocked()
right_is_clear()  right_is_blocked()
pearl_here()      bag_is_empty()      bag_has_pearls()

# Estructures de control
for i in range(N):
    move()

while front_is_clear():
    move()

if pearl_here():
    grab()
elif front_is_blocked():
    turn_left()
else:
    drop()

def nom():
    move()
    turn_left()
```

Qualsevol programa Karel vàlid és Python vàlid (amb un shim que defineixi les funcions).

## Estructura de fitxers

```
index.html          — Pàgina d'inici
presentacio-karel.html — Presentació inicial («És el primer cop?»), pròpia del -p
simulador.html      — Simulador lliure (i simulador incrustat als capítols)
style.css, nav.css  — Estils del simulador i de la navegació del curs
footer.js           — Peu de pàgina comú del curs
edit-mapa.html      — Editor visual de mapes (eina auxiliar)
editor-reptes.jsx   — Component React per editar els textos dels reptes (eina auxiliar;
                      no el carrega cap pàgina)
js/                 — Motor (igual que karelcat) + i18n-facil.js (textos de lectura fàcil, només -p).
curs/
  index.html        — Índex del curs
  capitol.html      — Plantilla reutilitzable per a capítols
  capitol-1..10     — Els 10 capítols del curs
  capitol-futur     — Epíleg: pont al Python real
  repte-1..9        — Els 9 reptes
  capitols.js       — Dades + barra lateral + simuladors + glossari
  progress.js       — Progrés de l'alumne (localStorage)
  curs.css          — Estils del curs
  BRIEFING-REPTES.md — Detall de cada repte (mapes, objectius, solucions)
tests/
  comprova-curs.js  — Test automàtic: motor, mapes i solucions de tots els exercicis
docs/
  CURRENT-STATE.md  — Estat actual complet del projecte (llegir aquí primer)
```

## Com continuar el desenvolupament

Llegeix `docs/CURRENT-STATE.md` abans de fer cap canvi. Hi ha els criteris de lectura
fàcil (secció 10) i com portar millores de karelcat (secció 17).

Després de qualsevol canvi, executa el test automàtic (només cal Node.js):

```
node tests/comprova-curs.js
```

Comprova el motor i executa la solució de referència de cada exercici (el bloc
`<solucio>` que hi ha en un comentari de cada pàgina) contra el seu món.
(No hi ha cap GitHub Action que l'executi sol: cal llançar-lo a mà.)

<!-- atribucio-centre:inici -->

---

Material desenvolupat per **David Arso Civil** per al Departament de Matemàtiques de l'INS Miquel Tarradell.
Contingut sota CC BY-NC-SA 4.0, codi sota llicència MIT. Vegeu [`LLICENCIA.md`](LLICENCIA.md).

<!-- atribucio-centre:final -->
