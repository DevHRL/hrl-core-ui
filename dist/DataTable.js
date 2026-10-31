import { jsx, jsxs } from "react/jsx-runtime";
import { Tooltip } from "./Tooltip.js";
import { Icon } from "./icons.js";
import { nextSort } from "./sort.js";
import { SkeletonRows } from "./Skeleton.js";
function FlechaOrden({ estado }) {
  const activo = estado === "asc" || estado === "desc";
  return /* @__PURE__ */ jsx(
    Icon,
    {
      name: activo ? "sh-chevron-down" : "sh-sort",
      size: 13,
      style: {
        color: activo ? "var(--primary-text)" : "var(--subtle-foreground)",
        flex: "0 0 auto",
        transform: estado === "asc" ? "rotate(180deg)" : void 0
      }
    }
  );
}
function tramosDeGrupo(columns) {
  const tramos = [];
  for (const c of columns) {
    const ultimo = tramos.at(-1);
    if (ultimo && c.group && ultimo.group === c.group) ultimo.span += 1;
    else tramos.push({ group: c.group ?? null, span: 1, key: c.key, ayuda: c.groupTooltip });
  }
  return tramos;
}
function DataTable({
  columns,
  rows,
  sort,
  onSortChange,
  rowKey,
  legend,
  empty,
  changing,
  rowClass,
  /* Mientras es true se pintan filas fantasma en lugar de la tabla vacía:
     así la altura no salta cuando llegan los datos. */
  loading = false,
  loadingRows = 5
}) {
  const conGrupos = columns.some((c) => c.group);
  return /* @__PURE__ */ jsxs("div", { className: `hrl-table-wrap${changing ? " hrl-table-wrap--cambiando" : ""}`, children: [
    /* @__PURE__ */ jsxs("table", { className: "hrl-table", children: [
      /* @__PURE__ */ jsxs("thead", { children: [
        conGrupos && /* @__PURE__ */ jsx("tr", { className: "hrl-table__grupos", children: tramosDeGrupo(columns).map((t) => /* @__PURE__ */ jsx("th", { colSpan: t.span, scope: t.group ? "colgroup" : void 0, children: t.group && t.ayuda ? /* @__PURE__ */ jsx(Tooltip, { title: t.group, body: t.ayuda, children: /* @__PURE__ */ jsx("span", { className: "hrl-table__head-cell", children: t.group }) }) : t.group }, `grupo-${t.key}`)) }),
        /* @__PURE__ */ jsx("tr", { children: columns.map((c) => {
          const estado = sort?.key === c.key ? sort.dir : "none";
          const contenido = /* @__PURE__ */ jsxs("span", { className: "hrl-table__head-cell", style: { justifyContent: c.align === "right" ? "flex-end" : void 0 }, children: [
            c.label,
            c.sortable && /* @__PURE__ */ jsx(FlechaOrden, { estado })
          ] });
          return /* @__PURE__ */ jsx(
            "th",
            {
              style: { width: c.width, textAlign: c.align ?? "left" },
              "aria-sort": estado === "asc" ? "ascending" : estado === "desc" ? "descending" : void 0,
              children: c.sortable ? /* @__PURE__ */ jsx("button", { type: "button", className: "hrl-table__sort", onClick: () => onSortChange(nextSort(sort, c)), children: c.tooltip ? /* @__PURE__ */ jsx(Tooltip, { title: c.label, body: c.tooltip, focusable: false, children: contenido }) : contenido }) : c.tooltip ? /* @__PURE__ */ jsx(Tooltip, { title: c.label, body: c.tooltip, children: contenido }) : contenido
            },
            c.key
          );
        }) })
      ] }),
      /* @__PURE__ */ jsx("tbody", { children: loading ? /* @__PURE__ */ jsx(SkeletonRows, { rows: loadingRows, columns: columns.length }) : rows.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, className: "hrl-table__empty", children: empty ?? "Sin registros." }) }) : rows.map((fila, i) => /* @__PURE__ */ jsx(
        "tr",
        {
          className: rowClass ? rowClass(fila) : void 0,
          style: { animationDelay: `${Math.min(i, 14) * 30}ms` },
          children: columns.map((c) => /* @__PURE__ */ jsx("td", { style: { textAlign: c.align ?? "left" }, children: c.render ? c.render(fila) : fila[c.key] }, c.key))
        },
        rowKey ? rowKey(fila) : i
      )) })
    ] }),
    legend && /* @__PURE__ */ jsx("div", { className: "hrl-legend", children: legend })
  ] });
}
export {
  DataTable
};
//# sourceMappingURL=DataTable.js.map
