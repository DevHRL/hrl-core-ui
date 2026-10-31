import { jsx, jsxs } from "react/jsx-runtime";
import { Icon } from "./icons.js";
const TONOS = {
  ok: { fg: "var(--ok-text)", bg: "var(--success-soft)", icono: "sh-ok" },
  warn: { fg: "var(--warning-text)", bg: "var(--warning-soft)", icono: "sh-warn" },
  crit: { fg: "var(--danger-text)", bg: "var(--destructive-soft)", icono: "sh-crit" },
  info: { fg: "var(--info-text)", bg: "var(--info-soft)", icono: "sh-info" },
  none: { fg: "var(--neutral-text)", bg: "var(--neutral-soft)", icono: "sh-none" }
};
function Badge({ label = "Estado", tone = "none" }) {
  const t = TONOS[tone] ?? TONOS.none;
  return /* @__PURE__ */ jsxs("span", { className: "hrl-badge", style: { "--tone-fg": t.fg, "--tone-bg": t.bg }, children: [
    /* @__PURE__ */ jsx(Icon, { name: t.icono, size: 14 }),
    label
  ] });
}
export {
  Badge
};
//# sourceMappingURL=Badge.js.map
