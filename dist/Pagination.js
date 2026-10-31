import { jsx, jsxs } from "react/jsx-runtime";
import { PAGE_SIZES } from "./paginate.js";
import { Icon } from "./icons.js";
function numeros(total, actual) {
  const salida = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - actual) <= 1) salida.push(i);
    else if (salida[salida.length - 1] !== "\u2026") salida.push("\u2026");
  }
  return salida;
}
function Pagination({
  page = 1,
  totalPages = 1,
  perPage = 20,
  totalItems = 0,
  accent = "var(--accent)",
  onChange,
  /* Opcional: si se pasa, aparece el selector de filas por página. */
  onPerPageChange,
  sizes = PAGE_SIZES
}) {
  const actual = Math.max(1, Math.min(totalPages, page));
  const ir = (n) => onChange?.(Math.max(1, Math.min(totalPages, n)));
  const botones = [
    { clave: "prev", icono: "sh-chevron", girado: true, nombre: "P\xE1gina anterior", ir: () => ir(actual - 1), off: actual === 1 },
    ...numeros(totalPages, actual).map((n, i) => ({
      clave: n === "\u2026" ? `gap-${i}` : `p-${n}`,
      etiqueta: String(n),
      ir: n === "\u2026" ? void 0 : () => ir(n),
      off: n === "\u2026",
      hueco: n === "\u2026",
      on: n === actual,
      nombre: n === "\u2026" ? void 0 : `P\xE1gina ${n}`
    })),
    { clave: "next", icono: "sh-chevron", nombre: "P\xE1gina siguiente", ir: () => ir(actual + 1), off: actual === totalPages }
  ];
  return /* @__PURE__ */ jsxs("div", { className: "hrl-pag", style: { "--accent": accent }, children: [
    /* @__PURE__ */ jsx("span", { className: "hrl-pag__counter", children: onPerPageChange ? `P\xE1gina ${actual} de ${totalPages} \xB7 ${totalItems.toLocaleString("es-PE")} registros` : `P\xE1gina ${actual} de ${totalPages} \xB7 ${perPage} por p\xE1gina \xB7 ${totalItems.toLocaleString("es-PE")} registros` }),
    onPerPageChange && /* @__PURE__ */ jsxs("label", { className: "hrl-pag__tamano", children: [
      "Filas por p\xE1gina",
      /* @__PURE__ */ jsx("select", { value: perPage, onChange: (e) => onPerPageChange(Number(e.target.value)), "aria-label": "Filas por p\xE1gina", children: sizes.map((t) => /* @__PURE__ */ jsx("option", { value: t, children: t }, t)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "hrl-pag__pages", children: botones.map((b) => /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: `hrl-pag__btn${b.on ? " hrl-pag__btn--on" : ""}${b.hueco ? " hrl-pag__btn--hueco" : ""}`,
        onClick: b.ir,
        disabled: b.off,
        "aria-label": b.nombre,
        "aria-current": b.on ? "page" : void 0,
        "aria-hidden": b.hueco || void 0,
        children: b.icono ? /* @__PURE__ */ jsx(Icon, { name: b.icono, size: 15, style: b.girado ? { transform: "rotate(180deg)" } : void 0 }) : b.etiqueta
      },
      b.clave
    )) })
  ] });
}
export {
  Pagination
};
//# sourceMappingURL=Pagination.js.map
