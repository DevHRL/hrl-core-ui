import { jsx } from "react/jsx-runtime";
import { toneVars } from "./tones.js";
const TAMANOS = ["sm", "md", "lg"];
function iniciales(nombre) {
  const palabras = String(nombre ?? "").replace(/[^\p{L}\s]/gu, " ").split(/\s+/).filter(Boolean);
  return palabras.slice(0, 2).map((p) => p[0]).join("").toUpperCase() || "?";
}
function Avatar({ name, size = "md", tone = "none", label }) {
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `hrl-avatar hrl-avatar--${TAMANOS.includes(size) ? size : "md"}`,
      style: toneVars(tone),
      role: label ? "img" : void 0,
      "aria-label": label,
      "aria-hidden": label ? void 0 : true,
      children: iniciales(name)
    }
  );
}
export {
  Avatar
};
//# sourceMappingURL=Avatar.js.map
