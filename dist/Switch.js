import { jsx, jsxs } from "react/jsx-runtime";
import { cx } from "./variants.js";
function Switch({ label, checked = false, onChange, description, className }) {
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": checked,
      className: cx("hrl-tema", checked && "hrl-tema--on", className),
      onClick: () => onChange?.(!checked),
      children: [
        /* @__PURE__ */ jsxs("span", { className: "hrl-tema__texto", children: [
          /* @__PURE__ */ jsx("strong", { children: label }),
          /* @__PURE__ */ jsx("span", { children: description ?? (checked ? "Activado" : "Desactivado") })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "hrl-tema__palanca", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { className: "hrl-tema__bolita" }) })
      ]
    }
  );
}
export {
  Switch
};
//# sourceMappingURL=Switch.js.map
