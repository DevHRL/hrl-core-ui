import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { createPortal } from "react-dom";
import { anchoVisible } from "./viewport.js";
const MARGEN = 12;
const ANCHO_MAX = 320;
const RELLENO = 36;
const ANCHO_TOTAL = ANCHO_MAX + RELLENO;
const SEPARACION = 20;
const SEPARACION_ELEMENTO = 8;
const ALTO_RESERVA = 150;
function ubicar(x, y, separacion) {
  const ancho = anchoVisible();
  const espacioDerecha = ancho - x - separacion - MARGEN;
  const espacioIzquierda = x - separacion - MARGEN;
  const izquierda = espacioDerecha < ANCHO_TOTAL && espacioIzquierda > espacioDerecha;
  const espacio = izquierda ? espacioIzquierda : espacioDerecha;
  const mitad = ALTO_RESERVA / 2 + MARGEN;
  const top = Math.min(Math.max(y, mitad), window.innerHeight - mitad);
  return {
    izquierda,
    estilo: {
      top,
      maxWidth: Math.max(Math.min(ANCHO_MAX, espacio - RELLENO), 120),
      left: izquierda ? x - separacion : x + separacion
    }
  };
}
function FloatingTip({ tip }) {
  if (!tip) return null;
  const { izquierda, estilo } = ubicar(tip.x, tip.y, tip.gap ?? SEPARACION);
  return createPortal(
    /* @__PURE__ */ jsxs("div", { className: `hrl-portal hrl-tip${izquierda ? " hrl-tip--izquierda" : ""}`, style: estilo, role: "tooltip", children: [
      tip.title && /* @__PURE__ */ jsx("strong", { className: "hrl-tip__title", children: tip.title }),
      tip.body
    ] }),
    document.body
  );
}
function Tooltip({ title, body, children, as: Etiqueta = "span", focusable = true, style }) {
  const [pos, setPos] = useState(null);
  const mover = (e) => setPos({ x: e.clientX, y: e.clientY });
  const alEnfocar = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    setPos({ x: r.right, y: r.top + r.height / 2, gap: SEPARACION_ELEMENTO });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Etiqueta,
      {
        className: focusable ? "hrl-tip-objetivo" : void 0,
        style: { display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%", ...style },
        onMouseEnter: mover,
        onMouseMove: mover,
        onMouseLeave: () => setPos(null),
        onFocus: alEnfocar,
        onBlur: () => setPos(null),
        tabIndex: focusable ? 0 : void 0,
        children
      }
    ),
    /* @__PURE__ */ jsx(FloatingTip, { tip: pos ? { title, body, ...pos } : null })
  ] });
}
export {
  FloatingTip,
  Tooltip
};
//# sourceMappingURL=Tooltip.js.map
