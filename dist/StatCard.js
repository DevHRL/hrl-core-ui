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
const AVISA = /* @__PURE__ */ new Set(["suspect", "abnormal"]);
const ICONO = {
  neutral: "sh-chart",
  normal: "sh-ok",
  suspect: "sh-warn",
  abnormal: "sh-crit",
  nodata: "sh-none"
};
const ANCHO_TENDENCIA = 104;
const ALTO_TENDENCIA = 40;
function Tendencia({ trend }) {
  const puntos = trend.points ?? [];
  if (puntos.length < 2) return null;
  const valores = puntos.map((p) => p.value).filter((v) => typeof v === "number");
  const maximo = Math.max(...valores, 0);
  const formato = trend.format ?? ((v) => v.toLocaleString("es-PE"));
  const hueco = 3;
  const ancho = (ANCHO_TENDENCIA - hueco * (puntos.length - 1)) / puntos.length;
  const detalle = puntos.map((p) => `${p.title ?? p.label} ${p.value == null ? "sin dato" : formato(p.value)}`).join(" \xB7 ");
  const rotulo = (p, i, actual) => i === 0 || actual ? /* @__PURE__ */ jsx(
    "text",
    {
      className: `hrl-stat__tendencia-mes${actual ? " hrl-stat__tendencia-mes--actual" : ""}`,
      x: actual ? ANCHO_TENDENCIA : 0,
      y: ALTO_TENDENCIA + 13,
      textAnchor: actual ? "end" : "start",
      children: p.label
    }
  ) : null;
  return /* @__PURE__ */ jsx(Tooltip, { title: trend.label ?? "Tendencia", body: detalle, focusable: false, children: /* @__PURE__ */ jsx(
    "svg",
    {
      className: "hrl-stat__tendencia",
      width: ANCHO_TENDENCIA,
      height: ALTO_TENDENCIA + 14,
      viewBox: `0 0 ${ANCHO_TENDENCIA} ${ALTO_TENDENCIA + 14}`,
      role: "img",
      "aria-label": `${trend.label ?? "Tendencia"}: ${detalle}`,
      children: puntos.map((p, i) => {
        const x = i * (ancho + hueco);
        const actual = i === puntos.length - 1;
        if (p.value == null || maximo === 0) {
          return /* @__PURE__ */ jsxs("g", { children: [
            /* @__PURE__ */ jsx("line", { className: "hrl-stat__tendencia-hueco", x1: x, x2: x + ancho, y1: ALTO_TENDENCIA - 1, y2: ALTO_TENDENCIA - 1 }),
            rotulo(p, i, actual)
          ] }, p.label + i);
        }
        const alto = Math.max(3, p.value / maximo * (ALTO_TENDENCIA - 2));
        return /* @__PURE__ */ jsxs("g", { children: [
          /* @__PURE__ */ jsx(
            "rect",
            {
              className: `hrl-stat__tendencia-barra${actual ? " hrl-stat__tendencia-barra--actual" : ""}`,
              x,
              y: ALTO_TENDENCIA - alto,
              width: ancho,
              height: alto,
              rx: Math.min(4, ancho / 2),
              style: { animationDelay: `${i * 40}ms` }
            }
          ),
          rotulo(p, i, actual)
        ] }, p.label + i);
      })
    }
  ) });
}
function StatCard({ label = "M\xE9trica", value = "\u2014", note, severity = "neutral", percent, delay = 0, info, onClick, trend }) {
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
          AVISA.has(severity) && /* @__PURE__ */ jsx("span", { className: "hrl-stat__icon", children: /* @__PURE__ */ jsx(Icon, { name: ICONO[severity], size: 18 }) })
        ] }),
        trend ? /* @__PURE__ */ jsxs("div", { className: "hrl-stat__cuerpo", children: [
          /* @__PURE__ */ jsx("strong", { className: "hrl-stat__value", children: value }),
          /* @__PURE__ */ jsx(Tendencia, { trend })
        ] }) : /* @__PURE__ */ jsx("strong", { className: "hrl-stat__value", children: value }),
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
