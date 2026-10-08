# Lo agregado el 7-oct-2026: precios para lo que no tenía y títulos propuestos

Lo agregó la sesión de Competencia de Eduardo (Claude) directo sobre los datos publicados (`datos_pl.json` y `datos_pl.js`). Esos datos los genera `fuente/scripts/pagina_pl.py`, así que **si se vuelve a correr el generador, lo agregado se pierde**: hay que volver a aplicarlo, o meterlo al generador. Todo lo agregado lleva `ag: "2026-10-07"`.

## 1. Precios de Mercado Libre para lo que no tenía

Hay filas sin precio de Mercado Libre porque la cotización de Eduardo solo cubría lo que viene en los packing lists de sus 104 contenedores. Además, los insumos se excluyen a propósito.

| Qué | Filas | Dónde queda en la fila | ¿Se suma al valor? |
|---|---|---|---|
| Revisado a mano: los 50 de más valor, con foto y fichas a la vista, por revisor y verificador | 38 | `ml` con `f`/`cl` = `r` | Sí, si la fila tiene piezas que quedan |
| Banda de su categoría de ML, buscada con el título nuevo | 370 | `ml` con `f`/`cl` = `b`, `sr: 1` (sin revisar) y `jc` si el juez dijo que la categoría es «cercana» | Sí, si la fila tiene piezas que quedan |
| Insumos: referencia por pieza revisada a mano | 12 | `mr` (no `ml`), con `lo` · `me` · `hi` | **No**: siguen como «insumo, no se valúa» |

- Mín, media y máx van en `lo`, `me` y `hi` (por pieza, MXN). En las bandas también van la mediana `d`, el p25 `a` y el p75 `b`. La página usa la media `me` como precio, igual que en el resto.
- **El total de la página no cambia.** Los SKUs con precio nuevo no tienen renglón en ningún packing list (la página ya dice «883 SKUs sin renglón, no suman»), y los insumos no se suman.
- **Ojo con la banda.** En la revisión de los 50 de más valor, la banda inflaba muchísimo: pasaron de $102.7 M a $9.4 M. 21 de 50 comparaban el precio de un paquete contra una pieza, por ejemplo flores sueltas contra ramos o costales sueltos contra paquetes de 100. Las 370 bandas sin revisar llevan `sr: 1` y en la celda dicen «sin revisar».
- El detalle está en `precios_agregados.csv`. Lo que sigue sin precio y por qué está en `sin_precio_todavia.csv` (437 filas):

  | Motivo | Filas |
  |---|---|
  | Sin nombre ni foto para saber qué es | 343 |
  | ML no dio más vendidos con precio en esa categoría | 56 |
  | Categoría equivocada según el juez | 24 |
  | Insumo sin revisar | 14 |

## 2. Títulos propuestos (Gemini viendo la foto)

Se propusieron títulos para 2,544 filas: los SKUs con título genérico o vacío de los contenedores, y los SKUs sin precio. Gemini (`gemini-3.8-flash`) vio la foto del catálogo (Odoo) y, si había, la del packing list.

| Campo | Qué es |
|---|---|
| `tg` | Título propuesto, al estilo de ML México, máx. 60 caracteres. **El color sale de la foto.** Si varias variantes de colores distintos comparten la misma foto, se usa el color del SKU y se marca para confirmar |
| `tv` | El título actual contra la foto: `s` coincide, `p` a medias, `n` es otro producto |
| `tfm` | La foto del catálogo contra la del packing list: `s` mismo producto, `n` distintos |
| `tq` | Término para buscar rivales |
| `trv`, `trm` | Hay que revisarlo con una persona, y por qué |

En la página, el título propuesto aparece en el detalle de cada producto, debajo del título actual. **No reemplaza al título actual**: falta que un KAM o Bodega lo apruebe. La lista completa está en `titulos_propuestos.csv`.

## 3. Cambios a la página

En `pagina_pl.html` e `index.html` (el mismo cambio en los dos):

- La celda de valor de un insumo muestra `ref. por pieza mín · media · máx` si trae `mr`.
- El detalle de un insumo dice su referencia de ML y qué es.
- El detalle de cualquier producto muestra el título propuesto y sus avisos.
- Las bandas sin revisar dicen «sin revisar».

`node humo_pl.js` termina en `OK`, y el valor total no cambia: $461,755,909 a precio de ML.
