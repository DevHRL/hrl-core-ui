import { jsx, jsxs } from "react/jsx-runtime";
import { Tooltip } from "./Tooltip.js";
import { Icon } from "./icons.js";
const SEVERIDAD = {
  neutral: "var(--accent)",
  normal: "var(--success)",
  suspect: "var(--warning)",
  abnormal: "var(--destructive)",
  nodata: "var(--subtle-foreground)"
};
const SEVERIDAD_TEXTO = {
  neutral: "var(--primary-text)",
  normal: "var(--success-text)",
  suspect: "var(--warning-fg)",
  abnormal: "var(--destructive-text)",
  nodata: "var(--subtle-foreground)"
};
const ICONO = {
  neutral: "sh-chart",
  normal: "sh-ok",
  suspect: "sh-warn",
  abnormal: "sh-crit",
  nodata: "sh-none"
};
function StatCard({ label = "M\xE9trica", value = "\u2014", note, severity = "neutral", percent, delay = 0, info, onClick }) {
  const color = SEVERIDAD[severity] ?? SEVERIDAD.neutral;
  const conBarra = typeof percent === "number";
  const pct = conBarra ? Math.max(0, Math.min(100, percent)) : 0;
  const Etiqueta = onClick ? "button" : "article";
  return /* @__PURE__ */ jsxs(
    Etiqueta,
    {
      type: onClick ? "button" : void 0,
      className: `hrl-stat${onClick ? " hrl-stat--clic" : ""}`,
      style: { "--sev": color, "--sev-texto": SEVERIDAD_TEXTO[severity] ?? SEVERIDAD_TEXTO.neutral, "--delay": `${delay}ms`, "--pct": `${pct}%` },
      onClick,
      "aria-label": onClick ? `${label}: ${value}` : void 0,
      children: [
        /* @__PURE__ */ jsxs("div", { className: "hrl-stat__top", children: [
          info ? /* @__PURE__ */ jsx(Tooltip, { title: label, body: info, focusable: !onClick, children: /* @__PURE__ */ jsxs("span", { className: "hrl-stat__label hrl-stat__label--info", children: [
            label,
            /* @__PURE__ */ jsx(Icon, { name: "sh-info", size: 14 })
          ] }) }) : /* @__PURE__ */ jsx("span", { className: "hrl-stat__label", children: label }),
          /* @__PURE__ */ jsx("span", { className: "hrl-stat__icon", children: /* @__PURE__ */ jsx(Icon, { name: ICONO[severity] ?? ICONO.neutral, size: 18 }) })
        ] }),
        /* @__PURE__ */ jsx("strong", { className: "hrl-stat__value", children: value }),
        conBarra && /* @__PURE__ */ jsx("div", { className: "hrl-stat__track", children: /* @__PURE__ */ jsx("span", { className: "hrl-stat__bar" }) }),
        note && /* @__PURE__ */ jsx("span", { className: "hrl-stat__note", children: note })
      ]
    }
  );
}
export {
  StatCard
};
//# sourceMappingURL=StatCard.js.map
