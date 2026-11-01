import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Tooltip } from "./Tooltip.js";
const PAGE_TABS_ID = "hrl-vistas-pagina";
function TabsPill({ items, active, onSelect, label, current = "true", alerts = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const nav = ref.current;
    const activa = nav?.querySelector("[aria-current]");
    if (!activa || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollLeft = activa.offsetLeft - (nav.clientWidth - activa.offsetWidth) / 2;
  }, [active]);
  return /* @__PURE__ */ jsx("nav", { className: "hrl-vistas", ref, "aria-label": label, children: items.map((v) => {
    const activa = v.key === active;
    const Etiqueta = v.href ? "a" : "button";
    const aviso = !activa ? alerts[v.key] : null;
    return /* @__PURE__ */ jsxs(
      Etiqueta,
      {
        type: v.href ? void 0 : "button",
        href: v.href,
        className: `hrl-vistas__item${activa ? " hrl-vistas__item--on" : ""}`,
        "aria-current": activa ? current : void 0,
        onClick: () => onSelect?.(v.key),
        children: [
          v.label,
          aviso && /* @__PURE__ */ jsx(Tooltip, { title: "Requiere atenci\xF3n", body: aviso, focusable: false, children: /* @__PURE__ */ jsx("span", { className: "hrl-punto-vivo", role: "img", "aria-label": `Requiere atenci\xF3n: ${aviso}` }) })
        ]
      },
      v.key
    );
  }) });
}
function PageTabs({ tabs = [], active, onChange, label = "Vistas de la pantalla", alerts }) {
  const [destino, setDestino] = useState(null);
  useEffect(() => {
    setDestino(document.getElementById(PAGE_TABS_ID));
  }, []);
  if (!destino || tabs.length < 2) return null;
  return createPortal(/* @__PURE__ */ jsx(TabsPill, { items: tabs, active, onSelect: onChange, label, alerts }), destino);
}
export {
  PAGE_TABS_ID,
  PageTabs,
  TabsPill
};
//# sourceMappingURL=PageTabs.js.map
