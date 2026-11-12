import { jsx, jsxs } from "react/jsx-runtime";
import { useFloatingTip } from "./useFloatingTip.js";
import { FloatingTip } from "./Tooltip.js";
import { TONES } from "./tones.js";
const TONO_TRAMO = ["info", "violet", "warn", "crit", "ok"];
function CapacityMeter({ total, segments = [], label, unit = "", compact = false, format = (n) => n.toLocaleString("es-PE") }) {
  const { tip, follow, anchor, hide } = useFloatingTip();
  const usado = segments.reduce((n, s) => n + (Number(s.value) || 0), 0);
  const sinDato = total == null;
  const libre = sinDato ? null : Math.max(0, total - usado);
  const exceso = sinDato ? 0 : Math.max(0, usado - total);
  const base = sinDato ? 0 : Math.max(total, usado);
  const sufijo = unit ? ` ${unit}` : "";
  const texto = sinDato ? `${format(usado)}${sufijo} usados \xB7 capacidad sin dato` : `${format(usado)} de ${format(total)}${sufijo}${exceso ? ` \xB7 ${format(exceso)} sobre la capacidad` : ` \xB7 ${format(libre)} libres`}`;
  return /* @__PURE__ */ jsxs("div", { className: `hrl-capacidad${compact ? " hrl-capacidad--compacta" : ""}`, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        className: "hrl-capacidad__barra",
        role: "meter",
        "aria-label": label,
        "aria-valuemin": 0,
        "aria-valuemax": sinDato ? void 0 : total,
        "aria-valuenow": sinDato ? void 0 : Math.min(usado, total),
        "aria-valuetext": texto,
        children: !sinDato && base > 0 && segments.map((s, i) => {
          const valor = Number(s.value) || 0;
          if (!valor) return null;
          const tono = TONES[s.tone ?? TONO_TRAMO[i % TONO_TRAMO.length]] ?? TONES.info;
          const detalle = `${format(valor)}${sufijo}`;
          return /* @__PURE__ */ jsx(
            "span",
            {
              className: "hrl-capacidad__tramo",
              style: { width: `${valor / base * 100}%`, background: tono.line },
              tabIndex: compact ? -1 : 0,
              "aria-label": `${s.label}: ${detalle}`,
              onMouseEnter: (e) => follow(e, s.label, detalle),
              onMouseMove: (e) => follow(e, s.label, detalle),
              onMouseLeave: hide,
              onFocus: (e) => anchor(e.currentTarget, s.label, detalle),
              onBlur: hide
            },
            s.key
          );
        })
      }
    ),
    !compact && /* @__PURE__ */ jsx("span", { className: `hrl-capacidad__texto${exceso ? " hrl-capacidad__texto--exceso" : ""}`, children: texto }),
    /* @__PURE__ */ jsx(FloatingTip, { tip })
  ] });
}
export {
  CapacityMeter
};
//# sourceMappingURL=CapacityMeter.js.map
