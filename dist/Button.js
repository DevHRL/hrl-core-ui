import { jsx, jsxs } from "react/jsx-runtime";
import { variants } from "./variants.js";
import { Icon } from "./icons.js";
import { aliasObsoleto, PROP_ALIASES } from "./deprecated.js";
const clase = variants(
  "hrl-btn",
  {
    tone: {
      cta: "hrl-btn--cta",
      blue: "hrl-btn--blue",
      ghost: "hrl-btn--ghost",
      danger: "hrl-btn--peligro",
      plain: "",
      link: "hrl-btn--enlace"
    },
    size: { md: "", sm: "hrl-btn--mini" }
  },
  { tone: "cta", size: "md" }
);
function Button({
  tone = "cta",
  size = "md",
  icon,
  loading = false,
  loadingText = "Procesando\u2026",
  disabled,
  className,
  children,
  type = "button",
  ...rest
}) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type,
      className: clase({ tone, size, className }),
      disabled: disabled || loading,
      "aria-busy": loading || void 0,
      ...rest,
      children: [
        icon && /* @__PURE__ */ jsx(Icon, { name: icon, size: size === "sm" ? 15 : 16 }),
        loading ? loadingText : children
      ]
    }
  );
}
const TONE_ALIASES = PROP_ALIASES.IconButton.tone;
function IconButton({ icon, "aria-label": label, tone: tonoPedido = "plain", className, ...rest }) {
  const tone = aliasObsoleto(TONE_ALIASES, tonoPedido, "IconButton");
  if (!label && import.meta.env?.DEV) {
    console.warn("IconButton sin aria-label: un bot\xF3n sin texto necesita nombre accesible.");
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      className: `hrl-iconbtn${tone === "action" ? " hrl-accion" : ""}${className ? ` ${className}` : ""}`,
      "aria-label": label,
      ...rest,
      children: /* @__PURE__ */ jsx(Icon, { name: icon, size: 18 })
    }
  );
}
export {
  Button,
  IconButton
};
//# sourceMappingURL=Button.js.map
