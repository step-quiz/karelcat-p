# karelcat_primaria

Spin-off de [karelcat](https://github.com/...) adreçat a alumnes de Primària (9 anys aproximadament). L'alumne controla **en Karel**, una medusa programable que viu en una graella submarina.

Aquest projecte evoluciona de manera independent de karelcat. Respecte de karelcat, els reptes avançats (10–13) no s'inclouen, el capítol 10 ("Codi net") s'ha retirat per ser conceptualment lluny d'aquesta franja d'edat, i el llenguatge i els enunciats dels capítols s'han adaptat al perfil d'alumne.

## Què és

Un curs de 9 capítols + un epíleg ("D'en Karel al Python") i 9 reptes, accessible des del navegador sense instal·lació, inspirat en el [Stanford Karel Reader](https://compedu.stanford.edu/karel-reader/docs/python/en/intro.html). Cada capítol combina explicació breu, exemples executables incrustats i navegació cap als reptes finals. La interfície és intencionadament minimalista: editor de codi a l'esquerra, món de Karel a la dreta, dos botons.

## Estat actual

| Element | Estat |
|---------|-------|
| Motor (tokenizer + parser + intèrpret) | ✅ Complet |
| Sintaxi Python-compatible | ✅ Implementada |
| Infraestructura del curs (sidebar, iframes, deep links) | ✅ Completa |
| Capítol 1 — Coneix en Karel | ✅ Escrit |
| Capítol 2 — Recollir i deixar | ✅ Escrit |
| Capítol 3 — Gestió d'errors en un codi | ✅ Escrit |
| Capítol 4 — Repeteix | ✅ Escrit |
| Capítol 5 — Funcions | ✅ Escrit |
| Capítol 6 — Descomposició | ✅ Escrit |
| Capítol 7 — Condicionals | ✅ Escrit |
| Capítol 8 — Mentre | ✅ Escrit |
| Capítol 9 — Combinant condicions | ✅ Escrit |
| Capítol futur — D'en Karel al Python | ✅ Escrit |
| Capítol 10 — Codi net (de karelcat) | ⛔ Retirat a primària |
| Reptes 1–9 (fàcils + intermedis) | ✅ Tots implementats |
| Reptes 10–13 (avançats) | ⛔ No inclosos a primària |

## Sintaxi del llenguatge

```python
# Ordres
move()  turn_left()  turn_right()  turn_around()  grab()  drop()

# Condicions
front_is_clear()  front_is_blocked()
left_is_clear()   left_is_blocked()
right_is_clear()  right_is_blocked()
pearl_here()      bag_is_empty()      bag_is_full()

# Estructures de control
for _ in range(N):
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
index.html          — Simulador lliure
style.css           — Estils del simulador
edit-mapa.html      — Editor visual de mapes (eina auxiliar)
js/                 — Motor: constants, i18n, state, tokenizer, parser,
                      interpreter, execution, world, renderer, editor, ui, main, reptes
curs/
  index.html        — Índex del curs
  capitol.html      — Plantilla reutilitzable per a capítols
  capitol-1..9      — Els 9 capítols del curs
  capitol-futur     — Epíleg: pont al Python real
  repte-1..9        — Els 9 reptes del curs
  capitols.js       — Dades + renderSidebar() + renderSimuladors()
  curs.css          — Estils del curs
  BRIEFING-REPTES.md — Detall de cada repte (mapes, solucions, notes)
docs/
  CURRENT-STATE.md  — Estat actual complet del projecte (llegir aquí primer)
  i18n-spanish-guide.md — Guia per afegir castellà com a idioma d'interfície
```

## Com continuar el desenvolupament

Llegeix `docs/CURRENT-STATE.md` abans de fer cap canvi. Conté l'estat complet
del projecte, els contractes entre mòduls, els principis de disseny i les tasques pendents.

Les tasques pendents actuals són millores visuals (D.1–D.4) i funcionalitat futura
opcional (E.1–E.8): idiomes addicionals, selector d'idioma, editor de mapes integrat.
El contingut pedagògic del curs és complet.

<!-- atribucio-centre:inici -->

---

Material desenvolupat per **David Arso Civil** per al Departament de Matemàtiques de l'INS Miquel Tarradell.
Contingut sota CC BY-NC-SA 4.0, codi sota llicència MIT. Vegeu [`LLICENCIA.md`](LLICENCIA.md).

<!-- atribucio-centre:final -->
