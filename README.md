# Inventario Kubera, contado desde los packing lists

Copia completa del artifact de Claude **«Catálogo Vivo Kubera»**
(https://claude.ai/artifact/QGPgvZBTfBC2RMQd12n2C6), para consultarlo y modificarlo fuera del chat
donde se hizo.

> **Este repositorio es público.** Los datos traen el costo por pieza y el precio de compra de
> proveedor de cada producto. Brandon decidió subirlo así el 7-oct-2026. Si eso cambia, hay que
> pasar el repo a privado; borrar los archivos no los quita del historial.

Corte de los datos: **7 de octubre de 2026**. Es una foto, no se actualiza sola.

## Qué hay aquí

| Carpeta | Qué es |
|---|---|
| `inventario-packing-lists/` | **El artifact**, tal como está publicado: la página, sus datos y sus fotos. |
| `fuente/` | El código que lo genera (copia de `conocimientoGeneral/CATALOGO_VIVO` de la rama `conocimiento` del repo OMNICANAL). |

Dentro de `inventario-packing-lists/`:

| Archivo | Qué es |
|---|---|
| `index.html` | La página lista para abrir. |
| `pagina_pl.html` | El mismo contenido sin envoltura: es el archivo que se publica al artifact. |
| `datos_pl.json` | Todos los datos: una fila por SKU o por producto sin SKU. |
| `datos_pl.js` | Los mismos datos como script, para que `index.html` abra con doble clic. |
| `img/h*.jpg`, `img/p*.jpg` | Mosaicos de fotos de 72 px (Odoo y packing list) para las tablas. |
| `img/g*.jpg`, `img/q*.jpg` | Las mismas fotos a 256 px, para verlas en grande al dar clic. |
| `packing_lists_procesados.xlsx` | Los 186 archivos de packing list que se leyeron y los 103 contenedores. |
| `humo_pl.js` | Prueba sin navegador: `node humo_pl.js` debe terminar en `OK`. |

## Cómo consultarlo

- **En tu máquina:** baja el repo y abre `inventario-packing-lists/index.html` con doble clic.
- **En el artifact:** la liga de arriba.

## Qué muestra la página

`Comprado − Salió = Queda`.

- **Comprado:** las piezas de los packing lists de todos los contenedores. Si bodega ya validó el
  contenedor, vale su conteo; si no, lo que declaró el proveedor.
- **Salió:** los movimientos hechos de Odoo de la bodega hacia afuera (no los pedidos registrados).
- **Queda:** la resta. Un producto está SOLD OUT cuando salió todo lo que se compró.
- **Valor:** piezas que quedan × el precio promedio (la media) de cada marketplace, por separado.
  - *Mercado Libre:* mínimo, media y máximo del archivo de Eduardo (cotización por API del 6 y 7 de
    octubre). La media es de las publicaciones del mismo producto o, si no las hay, de los más
    vendidos de su categoría; la página dice cuál.
  - *Amazon:* búsqueda por palabra clave, precio de la caja de compra, y solo las publicaciones que
    un juez (IA) marcó como el mismo producto. Lo que no se pudo medir se estima.

La pestaña «De dónde sale cada dato» de la página explica cada regla.

## Cómo modificarlo

Hay dos caminos, según qué se quiera cambiar.

### 1 · Cambiar cómo se ve (textos, columnas, estilos, filtros)

Los datos y la página van separados, así que esto no necesita regenerar nada:

1. Edita `inventario-packing-lists/pagina_pl.html` (todo el HTML, CSS y JavaScript están ahí).
2. Copia el mismo cambio a `index.html`, que es ese archivo con una envoltura mínima alrededor.
3. Prueba: `node inventario-packing-lists/humo_pl.js` y abre `index.html`.
4. Sube el cambio a este repo.

Qué significa cada campo de una fila de `datos_pl.json` se ve en `fuente/scripts/pagina_pl.py` (función `construir`).

### 2 · Cambiar los datos o las reglas (precios, conteos, empates)

Eso se hace con el código de `fuente/scripts/`. La versión que manda vive en el repo OMNICANAL,
rama `conocimiento`, carpeta `conocimientoGeneral/CATALOGO_VIVO/`; lo de aquí es una copia.

```bash
python catalogo_vivo.py pagina_pl --salida <carpeta de salida>
```

`pagina_pl` solo lee archivos; arma la página en 20 segundos. Las etapas anteriores
(`pl_bajar`, `pl_leer`, `movimientos`, `inventario`, `titulos`, `mercado_amazon`, `fotos_grandes`…)
sí consultan sistemas, siempre en solo lectura, y están explicadas en `fuente/scripts/LEEME.md`.
Lo aprendido al construirlo está en `fuente/CONOCIMIENTO.md`.

**Lo que NO está en este repo**, y hace falta para regenerar los datos: los packing lists (3.3 GB),
el volcado de movimientos de Odoo, el paquete de precios de Mercado Libre de Eduardo y las llaves.
Están en la máquina donde se generó (`omnicanal/reportes/catalogo_vivo/datos/`).

### Publicar el cambio al artifact (desde Claude Code)

Con la herramienta Artifact, **pasando la liga como `url`** (sin ella se crea un artifact nuevo):
`file_path` = `pagina_pl.html`, y en `files` lo que haya cambiado (`datos_pl.json`, `img/…`). Los
archivos que no se mandan se conservan. En un chat nuevo hay que leer el artifact antes del primer
publish. Solo puede publicarlo la cuenta dueña del artifact, o alguien con permiso de edición.

## Lo que hay que saber antes de fiarse de un número

- El valor de Mercado Libre con la media sale más alto que con el precio «depurado» de Eduardo
  (mediana o nuestro precio, con tope de 10 veces el FOB). La página muestra los dos.
- La mayor parte del valor de Mercado Libre viene de la «banda de categoría», que no es el mismo
  producto y no está calibrada.
- Siete contenedores sin número Kubera y el 105 no tienen validado de bodega: sus piezas cuentan
  completas como «queda» y falta confirmar si ya llegaron.
- Los productos «sin SKU» son renglones de packing list a los que nadie les ha puesto SKU; se
  agrupan por nombre.
- Los insumos (cajas, costales, material de tienda) se cuentan y no se valúan.
