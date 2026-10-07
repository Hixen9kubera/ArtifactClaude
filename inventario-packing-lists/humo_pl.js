// Prueba de humo SIN navegador de la página de packing lists: corre su script contra un DOM de mentiras.
const fs = require("fs");
const dir = __dirname + "/";
const html = fs.readFileSync(dir + "pagina_pl.html", "utf8");
const m = html.match(/<script>([\s\S]*?)<\/script>/);
const els = {};
function el(id) {
  if (!els[id]) els[id] = { id, innerHTML: "", textContent: "", value: "", hidden: false, _l: {}, _a: {},
    addEventListener(t, f) { (this._l[t] = this._l[t] || []).push(f); },
    setAttribute(k, v) { this._a[k] = v; }, getAttribute(k) { return this._a[k]; },
    appendChild() {}, scrollIntoView() {}, focus() {}, select() {} };
  return els[id];
}
const docL = {};
global.document = { getElementById: el, createElement: () => ({}), head: { appendChild() {} },
  addEventListener(t, f) { (docL[t] = docL[t] || []).push(f); } };
global.window = { INVENTARIO: JSON.parse(fs.readFileSync(dir + "datos_pl.json", "utf8")) };
global.navigator = {};
new Function(m[1])();
const txt = s => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const filas = () => (els.libro.innerHTML.match(/<tr class="f/g) || []).length;
const clic = (dataset, extra) => docL.click.forEach(f => f({ target: { closest: () => Object.assign({ dataset, id: "", getAttribute: () => null }, extra || {}) } }));
const cambia = (id, v) => { els[id].value = v; (els[id]._l.change || els[id]._l.input || []).forEach(f => f.call(els[id])); };
console.log("CUENTA:", txt(els.cuenta.innerHTML).slice(0, 1500));
console.log("PORQUE:", txt(els.porque.innerHTML).slice(0, 900));
console.log("VALOR:", txt(els.valor.innerHTML).slice(0, 4200));
console.log("TOTAL:", txt(els.total.innerHTML));
console.log("FUENTES:", txt(els.fuentes.innerHTML), "|", els.cuando.textContent);
console.log("filas pág 1:", filas(), "|", txt(els.pag.innerHTML));
console.log("fila 1:", txt(els.libro.innerHTML.split("</thead>")[1]).slice(0, 420));
let pags = 0, abiertos = 0;
const total = parseInt(txt(els.pag.innerHTML).match(/\/ (\d+)/)[1], 10);
for (let p = 0; p < total; p++) {
  const ids = [...els.libro.innerHTML.matchAll(/data-i="(\d+)"/g)].map(x => x[1]);
  if (p % 12 === 0) for (const i of ids.slice(0, 12)) { clic({ i }); abiertos++; clic({ i }); }
  pags++;
  if (p < total - 1) clic({}, { id: "sig" });
}
console.log("páginas recorridas:", pags, "· detalles abiertos y cerrados sin excepción:", abiertos);
console.log("CATS:", (els.cats.innerHTML.match(/<tr class=""/g) || []).length, "categorías |", txt(els.cats.innerHTML).slice(0, 500));
for (let i = 0; i < 6; i++) clic({ xc: String(i) });
clic({ xs: "0:0" }); clic({ xs: "1:0" });
console.log("  expandidas:", (els.cats.innerHTML.match(/class="sub"/g) || []).length, "subcategorías ·", (els.cats.innerHTML.match(/sublista/g) || []).length, "listas de productos");
console.log("CONTS:", (els.conts.innerHTML.match(/<tr>/g) || []).length, "|", txt(els.conts.innerHTML).slice(0, 420));
console.log("EMPATE:", txt(els.empate.innerHTML).slice(0, 1400));
console.log("METODO bloques:", (els.metodo.innerHTML.match(/class="blo"/g) || []).length);
for (const est of ["queda", "so", "sin", "est", "nopl", "dm", "noodoo"]) { cambia("f-est", est); console.log(`estado=${est} →`, txt(els.total.innerHTML).slice(0, 170)); }
cambia("f-est", "");
for (const pre of ["ml", "az", "dos", "no"]) { cambia("f-pre", pre); console.log(`precio=${pre} →`, txt(els.total.innerHTML).slice(0, 230)); }
cambia("f-pre", "");
for (const emp of ["foto", "texto", "bodega", "foto_odoo", "cantidad"]) { cambia("f-emp", emp); console.log(`empate=${emp} →`, filas(), txt(els.pag.innerHTML).slice(0, 30)); }
cambia("f-emp", "");
clic({ vc: "0" }); console.log("ver categoría 0 →", els["f-cat"].value, "|", txt(els.total.innerHTML).slice(0, 150));
clic({ con: "1" }); console.log("ver contenedor 1 →", txt(els.total.innerHTML).slice(0, 150));
for (const ord of ["pc", "ps", "pq", "lb", "mlm", "_vm", "azm", "_va", "s"]) { clic({ ord }); clic({ ord }); }
els.q.value = "sabana"; els.q._l.input.forEach(f => f.call(els.q));
console.log("buscar «sabana» →", txt(els.total.innerHTML).slice(0, 200));
els.limpiar._l.click.forEach(f => f.call(els.limpiar));
console.log("sin filtros →", txt(els.total.innerHTML).slice(0, 120));
for (const pre of ["c-f", "c-n", "c-r", "c-b", "c-e", "c-u"]) { cambia("f-pre", pre); console.log(`precio=${pre} ->`, txt(els.total.innerHTML).slice(0, 260)); const ids = [...els.libro.innerHTML.matchAll(/data-i="(\d+)"/g)].map(x => x[1]); for (const i of ids.slice(0, 20)) { clic({ i }); clic({ i }); } if (pre === "c-u") console.log("  fila:", txt(els.libro.innerHTML.split("</thead>")[1]).slice(0, 700)); }
cambia("f-pre", "");
els.copiar.textContent = ""; els.copiar._l.click.forEach(f => f.call(els.copiar));
console.log("TSV:", els.copia.value.split(String.fromCharCode(10)).slice(0, 3).join(" || ").slice(0, 900));
console.log("OK");
