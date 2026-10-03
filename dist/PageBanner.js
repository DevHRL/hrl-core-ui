import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { Icon } from "./icons.js";
import { Mascot } from "./Mascot.js";
import { PAGE_ACTIONS_ID } from "./PageActions.js";
import { cx } from "./variants.js";
const HORA = new Intl.DateTimeFormat("es-PE", { hour: "numeric", minute: "2-digit", hour12: true });
function Reloj() {
  const [ahora, setAhora] = useState(() => /* @__PURE__ */ new Date());
  useEffect(() => {
    const t = setInterval(() => setAhora(/* @__PURE__ */ new Date()), 15e3);
    return () => clearInterval(t);
  }, []);
  return /* @__PURE__ */ jsx("time", { className: "hrl-banda__hora", dateTime: ahora.toISOString(), children: HORA.format(ahora) });
}
function PageBanner({ title, description, breadcrumbs = [], clock = false, status, mascot, actions, className }) {
  return /* @__PURE__ */ jsxs("header", { className: cx("hrl-banda", status?.tone === "warning" && "hrl-banda--aviso", className), children: [
    /* @__PURE__ */ jsxs("div", { className: "hrl-banda__titulo", children: [
      breadcrumbs.length > 0 && /* @__PURE__ */ jsx("nav", { className: "hrl-banda__migas", "aria-label": "Ruta de navegaci\xF3n", children: breadcrumbs.map((m, i) => {
        const ultimo = i === breadcrumbs.length - 1;
        return /* @__PURE__ */ jsxs("span", { className: "hrl-banda__paso", children: [
          i > 0 && /* @__PURE__ */ jsx(Icon, { name: "sh-chevron", size: 11 }),
          ultimo || !m.href ? /* @__PURE__ */ jsx("span", { "aria-current": ultimo ? "page" : void 0, children: m.label }) : /* @__PURE__ */ jsx("a", { href: m.href, children: m.label })
        ] }, m.label);
      }) }),
      /* @__PURE__ */ jsx("h1", { children: title }),
      (description || clock) && /* @__PURE__ */ jsxs("p", { className: "hrl-banda__bajada", children: [
        description,
        description && clock && /* @__PURE__ */ jsx("span", { className: "hrl-banda__separador", "aria-hidden": "true", children: "|" }),
        clock && /* @__PURE__ */ jsx(Reloj, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "hrl-banda__lado", children: [
      (status || mascot) && /* @__PURE__ */ jsxs("div", { className: "hrl-banda__estado-fila", children: [
        status && /* @__PURE__ */ jsxs("div", { className: "hrl-banda__estado", children: [
          /* @__PURE__ */ jsxs("p", { className: "hrl-banda__etiqueta", children: [
            status.icon && /* @__PURE__ */ jsx(Icon, { name: status.icon, size: 18 }),
            status.label
          ] }),
          status.detail && /* @__PURE__ */ jsx("p", { className: "hrl-banda__detalle", children: status.detail })
        ] }),
        mascot && /* @__PURE__ */ jsx(Mascot, { state: mascot, size: "md" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "hrl-banda__acciones", id: PAGE_ACTIONS_ID, children: actions })
    ] }),
    /* @__PURE__ */ jsxs("svg", { className: "hrl-banda__ondas", viewBox: "0 0 1200 72", preserveAspectRatio: "none", "aria-hidden": "true", focusable: "false", children: [
      /* @__PURE__ */ jsx("path", { d: "M0 40 C200 10 400 70 600 40 S1000 10 1200 35 V72 H0Z" }),
      /* @__PURE__ */ jsx("path", { d: "M0 52 C250 30 450 75 700 50 S1050 30 1200 50 V72 H0Z" }),
      /* @__PURE__ */ jsx("path", { d: "M0 62 C300 50 600 75 900 60 S1100 52 1200 60 V72 H0Z" })
    ] })
  ] });
}
export {
  PageBanner
};
//# sourceMappingURL=PageBanner.js.map
