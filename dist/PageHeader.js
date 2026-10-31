import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Icon } from "./icons.js";
import { PAGE_ACTIONS_ID } from "./PageActions.js";
import { cx } from "./variants.js";
const HORA = new Intl.DateTimeFormat("es-PE", { hour: "2-digit", minute: "2-digit", hour12: false });
function Reloj() {
  const [ahora, setAhora] = useState(() => /* @__PURE__ */ new Date());
  useEffect(() => {
    const t = setInterval(() => setAhora(/* @__PURE__ */ new Date()), 15e3);
    return () => clearInterval(t);
  }, []);
  return /* @__PURE__ */ jsx("time", { className: "hrl-pagehead__hora", dateTime: ahora.toISOString(), children: HORA.format(ahora) });
}
function PageHeader({ title, description, breadcrumbs = [], date, clock = false, status, actions, className }) {
  const conLado = breadcrumbs.length > 0 || date || clock;
  return /* @__PURE__ */ jsxs("header", { className: cx("hrl-pagehead", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "hrl-pagehead__fila", children: [
      /* @__PURE__ */ jsxs("div", { className: "hrl-pagehead__textos", children: [
        /* @__PURE__ */ jsx("h1", { children: title }),
        description && /* @__PURE__ */ jsx("p", { className: "hrl-pagehead__bajada", children: description })
      ] }),
      conLado && /* @__PURE__ */ jsxs("div", { className: "hrl-pagehead__lado", children: [
        breadcrumbs.length > 0 && /* @__PURE__ */ jsxs("nav", { className: "hrl-migas", "aria-label": "Ruta de navegaci\xF3n", children: [
          /* @__PURE__ */ jsx(Icon, { name: "sh-folder", size: 17, className: "hrl-migas__icono" }),
          breadcrumbs.map((m, i) => {
            const ultimo = i === breadcrumbs.length - 1;
            return /* @__PURE__ */ jsxs("span", { className: "hrl-migas__paso", children: [
              i > 0 && /* @__PURE__ */ jsx(Icon, { name: "sh-chevron", size: 12, className: "hrl-migas__separador" }),
              ultimo || !m.href ? /* @__PURE__ */ jsx("span", { "aria-current": ultimo ? "page" : void 0, children: m.label }) : /* @__PURE__ */ jsx("a", { href: m.href, children: m.label })
            ] }, m.label);
          })
        ] }),
        (date || clock) && /* @__PURE__ */ jsxs("p", { className: "hrl-pagehead__fecha", children: [
          date,
          date && clock && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: " \xB7 " }),
          clock && /* @__PURE__ */ jsx(Reloj, {})
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "hrl-pagehead__franja", children: [
      status && /* @__PURE__ */ jsxs("p", { className: cx("hrl-pagehead__estado", status.tone === "warning" && "hrl-pagehead__estado--aviso"), children: [
        status.icon && /* @__PURE__ */ jsx("span", { className: "hrl-pagehead__estado-icono", "aria-hidden": "true", children: /* @__PURE__ */ jsx(Icon, { name: status.icon, size: 17 }) }),
        /* @__PURE__ */ jsxs("span", { className: "hrl-pagehead__estado-textos", children: [
          /* @__PURE__ */ jsx("strong", { children: status.label }),
          status.detail && /* @__PURE__ */ jsx("span", { children: status.detail })
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hrl-pagehead__acciones", id: PAGE_ACTIONS_ID, children: actions })
    ] })
  ] });
}
export {
  PageHeader
};
//# sourceMappingURL=PageHeader.js.map
