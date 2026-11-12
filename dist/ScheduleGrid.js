import { jsx, jsxs } from "react/jsx-runtime";
import { useFloatingTip } from "./useFloatingTip.js";
import { FloatingTip } from "./Tooltip.js";
import { toneVars } from "./tones.js";
function ScheduleGrid({
  columns = [],
  rows = [],
  entriesOf = () => [],
  label,
  rowHeader = "",
  legend = [],
  empty = "Sin asignaciones.",
  loading = false
}) {
  const { tip, follow, anchor, hide } = useFloatingTip();
  return /* @__PURE__ */ jsxs("div", { className: "hrl-rol", children: [
    /* @__PURE__ */ jsx("div", { className: `hrl-rol__marco${loading ? " hrl-rol__marco--cargando" : ""}`, "aria-busy": loading || void 0, children: /* @__PURE__ */ jsxs("table", { className: "hrl-rol__tabla", "aria-label": label, children: [
      /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs("tr", { children: [
        /* @__PURE__ */ jsx("th", { scope: "col", className: "hrl-rol__fija", children: rowHeader }),
        columns.map((c) => /* @__PURE__ */ jsxs("th", { scope: "col", className: `hrl-rol__dia${c.muted ? " hrl-rol__dia--suave" : ""}`, children: [
          c.sublabel && /* @__PURE__ */ jsx("span", { className: "hrl-rol__sub", children: c.sublabel }),
          /* @__PURE__ */ jsx("span", { children: c.label })
        ] }, c.key))
      ] }) }),
      /* @__PURE__ */ jsxs("tbody", { children: [
        rows.map((r) => /* @__PURE__ */ jsxs("tr", { children: [
          /* @__PURE__ */ jsxs("th", { scope: "row", className: "hrl-rol__fija", children: [
            /* @__PURE__ */ jsx("span", { className: "hrl-rol__nombre", children: r.title }),
            r.subtitle && /* @__PURE__ */ jsx("span", { className: "hrl-rol__sub", children: r.subtitle })
          ] }),
          columns.map((c) => {
            const entradas = entriesOf(r, c) ?? [];
            return /* @__PURE__ */ jsx("td", { className: c.muted ? "hrl-rol__celda--suave" : void 0, children: entradas.length > 0 && /* @__PURE__ */ jsx("span", { className: "hrl-rol__celda", children: entradas.map((e) => {
              const titulo = e.tip?.title ?? `${r.title} \xB7 ${c.label}`;
              const cuerpo = e.tip?.body ?? e.label;
              const comunes = {
                className: `hrl-rol__turno${e.outline ? " hrl-rol__turno--contorno" : ""}`,
                style: toneVars(e.tone, e.outline),
                "aria-label": e.ariaLabel ?? `${titulo}. ${cuerpo}`,
                onMouseEnter: (ev) => follow(ev, titulo, cuerpo),
                onMouseMove: (ev) => follow(ev, titulo, cuerpo),
                onMouseLeave: hide,
                onFocus: (ev) => anchor(ev.currentTarget, titulo, cuerpo),
                onBlur: hide
              };
              return e.onSelect ? /* @__PURE__ */ jsx("button", { type: "button", ...comunes, onClick: e.onSelect, children: e.label }, e.key) : /* @__PURE__ */ jsx("span", { role: "img", tabIndex: 0, ...comunes, children: e.label }, e.key);
            }) }) }, c.key);
          })
        ] }, r.key)),
        rows.length === 0 && /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length + 1, className: "hrl-rol__vacio", children: empty }) })
      ] })
    ] }) }),
    legend.length > 0 && /* @__PURE__ */ jsx("div", { className: "hrl-rol__leyenda", children: legend.map((l) => /* @__PURE__ */ jsxs("span", { className: "hrl-rol__muestra", children: [
      /* @__PURE__ */ jsx("span", { className: `hrl-rol__turno hrl-rol__turno--muestra${l.outline ? " hrl-rol__turno--contorno" : ""}`, style: toneVars(l.tone, l.outline) }),
      l.label
    ] }, l.label)) }),
    /* @__PURE__ */ jsx(FloatingTip, { tip })
  ] });
}
export {
  ScheduleGrid
};
//# sourceMappingURL=ScheduleGrid.js.map
