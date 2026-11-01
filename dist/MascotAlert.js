import { jsx, jsxs } from "react/jsx-runtime";
import { useId } from "react";
import { Icon } from "./icons.js";
import { Mascot } from "./Mascot.js";
import { cx } from "./variants.js";
const ICONO_DEL_TONO = { info: "sh-info", success: "sh-ok", warning: "sh-warn", danger: "sh-crit" };
function MascotAlert({ state = "idle", tone = "info", label, icon, title, children, actions, headingLevel = 2, className }) {
  const id = useId();
  const Titulo = `h${Math.min(6, Math.max(2, Number(headingLevel) || 2))}`;
  return /* @__PURE__ */ jsxs("section", { className: cx("hrl-mochi-aviso", `hrl-mochi-aviso--${tone}`, className), "aria-labelledby": id, children: [
    /* @__PURE__ */ jsx("div", { className: "hrl-mochi-aviso__mascota", children: /* @__PURE__ */ jsx(Mascot, { state, size: 72 }) }),
    /* @__PURE__ */ jsxs("div", { className: "hrl-mochi-aviso__globo", children: [
      label && /* @__PURE__ */ jsxs("span", { className: "hrl-mochi-aviso__etiqueta", children: [
        /* @__PURE__ */ jsx(Icon, { name: icon ?? ICONO_DEL_TONO[tone] ?? "sh-info", size: 14 }),
        label
      ] }),
      /* @__PURE__ */ jsx(Titulo, { className: "hrl-mochi-aviso__titulo", id, children: title }),
      children && /* @__PURE__ */ jsx("p", { className: "hrl-mochi-aviso__detalle", children })
    ] }),
    actions && /* @__PURE__ */ jsx("div", { className: "hrl-mochi-aviso__acciones", children: actions })
  ] });
}
export {
  MascotAlert
};
//# sourceMappingURL=MascotAlert.js.map
