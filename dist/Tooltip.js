import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./icons.js";
import { anchoVisible } from "./viewport.js";
import { msDelToken } from "./tiempos.js";
import { useMountedWhile } from "./useExitAnimation.js";
const MARGEN = 12;
const SEPARACION_ANCLA = 8;
const SEPARACION_DATO = 14;
const SALIDA_MS = 120;
const CALENTAMIENTO_MS = 450;
let ultimoCierre = 0;
const ANCHO_MAX = 280;
const RELLENO = 24;
const ANCHO_TOTAL = ANCHO_MAX + RELLENO;
const SEPARACION = 20;
const ALTO_RESERVA = 120;
function ubicarAlCostado(x, y, separacion) {
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
  const { izquierda, estilo } = ubicarAlCostado(tip.x, tip.y, tip.gap ?? SEPARACION);
  return createPortal(
    /* @__PURE__ */ jsxs("div", { className: `hrl-portal hrl-tip hrl-tip--cursor${izquierda ? " hrl-tip--izquierda" : ""}`, style: estilo, role: "tooltip", children: [
      tip.title && /* @__PURE__ */ jsx("strong", { className: "hrl-tip__title", children: tip.title }),
      tip.body && /* @__PURE__ */ jsx("span", { className: "hrl-tip__body", children: tip.body })
    ] }),
    document.body
  );
}
function useUbicacionAnclada(caja, ancla, separacion, clave, lado = "top") {
  const [lugar, setLugar] = useState(null);
  const x = ancla?.x;
  const top = ancla?.top;
  const bottom = ancla?.bottom;
  const right = ancla?.right;
  const hayAncla = Boolean(ancla);
  const fijar = (nuevo) => setLugar(
    (previo) => previo && previo.left === nuevo.left && previo.top === nuevo.top && previo.flecha === nuevo.flecha && previo.lado === nuevo.lado ? previo : nuevo
  );
  useLayoutEffect(() => {
    const el = caja.current;
    if (!el || !hayAncla) return;
    const ancho = el.offsetWidth;
    const alto = el.offsetHeight;
    if (lado === "right" && right != null) {
      const centroY = (top + bottom) / 2;
      fijar({
        left: right + separacion,
        top: Math.min(Math.max(centroY - alto / 2, MARGEN), window.innerHeight - alto - MARGEN),
        flecha: 0,
        lado: "derecha"
      });
      return;
    }
    const centro = x;
    const left = Math.min(Math.max(centro - ancho / 2, MARGEN), anchoVisible() - ancho - MARGEN);
    const arriba = top - alto - separacion;
    const cabeArriba = arriba >= MARGEN;
    fijar({
      left,
      top: cabeArriba ? arriba : bottom + separacion,
      flecha: Math.min(Math.max(centro - left, 12), ancho - 12),
      lado: cabeArriba ? "arriba" : "abajo"
    });
  }, [caja, hayAncla, x, top, bottom, right, separacion, clave, lado]);
  return lugar;
}
function Burbuja({ id, ancla, inmediata, saliendo, title, body, placement }) {
  const caja = useRef(null);
  const lugar = useUbicacionAnclada(caja, ancla, SEPARACION_ANCLA, `${title}|${body}`, placement);
  return createPortal(
    /* @__PURE__ */ jsxs(
      "div",
      {
        ref: caja,
        id,
        role: "tooltip",
        className: [
          "hrl-portal hrl-tip hrl-tip--anclada",
          lugar && `hrl-tip--${lugar.lado}`,
          inmediata && "hrl-tip--inmediata",
          saliendo && "hrl-tip--saliendo"
        ].filter(Boolean).join(" "),
        style: lugar ? { left: lugar.left, top: lugar.top, "--hrl-tip-flecha": `${lugar.flecha}px` } : { left: 0, top: 0, visibility: "hidden" },
        children: [
          title && /* @__PURE__ */ jsx("strong", { className: "hrl-tip__title", children: title }),
          body && /* @__PURE__ */ jsx("span", { className: "hrl-tip__body", children: body })
        ]
      }
    ),
    document.body
  );
}
function anclaDe(elemento, xPuntero) {
  const r = elemento.getBoundingClientRect();
  const x = xPuntero == null ? r.left + r.width / 2 : Math.min(Math.max(xPuntero, r.left), r.right);
  return { x, top: r.top, bottom: r.bottom, right: r.right };
}
function useBurbuja() {
  const [estado, setEstado] = useState(null);
  const actual = useRef(null);
  actual.current = estado;
  const abiertaDesde = useRef(0);
  const temporizador = useRef(null);
  useEffect(() => () => clearTimeout(temporizador.current), []);
  const abrir = (elemento, xPuntero, sinEspera) => {
    clearTimeout(temporizador.current);
    abiertaDesde.current = Date.now();
    setEstado({
      ancla: anclaDe(elemento, xPuntero),
      inmediata: Boolean(sinEspera) || Date.now() - ultimoCierre < CALENTAMIENTO_MS,
      saliendo: false
    });
  };
  const cerrar = () => {
    const previo = actual.current;
    if (!previo || previo.saliendo) return;
    const seVio = previo.inmediata || Date.now() - abiertaDesde.current >= msDelToken("--delay-tip", 300);
    if (!seVio) {
      setEstado(null);
      return;
    }
    ultimoCierre = Date.now();
    setEstado({ ...previo, saliendo: true });
    temporizador.current = setTimeout(() => setEstado(null), SALIDA_MS);
  };
  const abierta = Boolean(estado && !estado.saliendo);
  useEffect(() => {
    if (!abierta) return void 0;
    const alTeclear = (e) => {
      if (e.key === "Escape") cerrar();
    };
    window.addEventListener("keydown", alTeclear);
    window.addEventListener("scroll", cerrar, true);
    return () => {
      window.removeEventListener("keydown", alTeclear);
      window.removeEventListener("scroll", cerrar, true);
    };
  }, [abierta]);
  return {
    abierta,
    ancla: estado?.ancla,
    montada: Boolean(estado),
    saliendo: Boolean(estado?.saliendo),
    inmediata: Boolean(estado?.inmediata),
    abrir,
    cerrar
  };
}
function esFocoDevuelto(e) {
  if (e.target.hasAttribute?.("data-hrl-foco-devuelto")) {
    e.target.removeAttribute("data-hrl-foco-devuelto");
    return true;
  }
  return false;
}
const CONTROL = 'button, a[href], select, input, textarea, [role="button"], [role="switch"], [role="tab"], [role="menuitem"]';
function callaSobre(envoltorio) {
  const control = envoltorio.matches(CONTROL) ? envoltorio : envoltorio.querySelector(CONTROL);
  if (!control) return false;
  return !(control.disabled || control.getAttribute("aria-disabled") === "true");
}
function Tooltip({ title, body, children, as: Etiqueta = "span", focusable = true, placement = "top", style }) {
  const id = useId();
  const b = useBurbuja();
  const hayTexto = Boolean(title || body);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      Etiqueta,
      {
        className: focusable ? "hrl-tip-objetivo" : void 0,
        style: { display: "inline-flex", alignItems: "center", gap: 6, maxWidth: "100%", ...style },
        onMouseEnter: (e) => hayTexto && !callaSobre(e.currentTarget) && b.abrir(e.currentTarget, e.clientX),
        onMouseLeave: b.cerrar,
        onFocus: (e) => hayTexto && !callaSobre(e.currentTarget) && !esFocoDevuelto(e) && b.abrir(e.currentTarget, null, true),
        onBlur: b.cerrar,
        onPointerDown: b.cerrar,
        tabIndex: focusable ? 0 : void 0,
        "aria-describedby": focusable && b.abierta ? id : void 0,
        children
      }
    ),
    b.montada && hayTexto && /* @__PURE__ */ jsx(Burbuja, { id, ancla: b.ancla, inmediata: b.inmediata, saliendo: b.saliendo, title, body, placement })
  ] });
}
function InfoTip({ label, title, body, children, size = 16, className }) {
  const id = useId();
  const b = useBurbuja();
  const [fijo, setFijo] = useState(false);
  const raiz = useRef(null);
  const cerrar = useRef(b.cerrar);
  cerrar.current = b.cerrar;
  const contenido = body ?? children;
  useEffect(() => {
    if (!b.abierta) setFijo(false);
  }, [b.abierta]);
  useEffect(() => {
    if (!fijo) return void 0;
    const fuera = (e) => {
      if (!raiz.current?.contains(e.target)) cerrar.current();
    };
    document.addEventListener("pointerdown", fuera);
    return () => document.removeEventListener("pointerdown", fuera);
  }, [fijo]);
  const puntero = useRef("mouse");
  const alTocar = (e) => {
    if (puntero.current === "mouse") return;
    if (fijo) {
      b.cerrar();
      return;
    }
    setFijo(true);
    b.abrir(e.currentTarget, null, true);
  };
  return /* @__PURE__ */ jsxs("span", { ref: raiz, className: ["hrl-infotip", className].filter(Boolean).join(" "), children: [
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "hrl-infotip__boton",
        "aria-label": label ? `Qu\xE9 significa: ${label}` : "M\xE1s informaci\xF3n",
        "aria-expanded": b.abierta,
        "aria-describedby": b.abierta ? id : void 0,
        onMouseEnter: (e) => !fijo && b.abrir(e.currentTarget),
        onMouseLeave: () => !fijo && b.cerrar(),
        onFocus: (e) => !esFocoDevuelto(e) && b.abrir(e.currentTarget, null, true),
        onBlur: b.cerrar,
        onPointerDown: (e) => {
          puntero.current = e.pointerType || "mouse";
        },
        onClick: alTocar,
        children: /* @__PURE__ */ jsx(Icon, { name: "sh-info", size })
      }
    ),
    b.montada && /* @__PURE__ */ jsx(Burbuja, { id, ancla: b.ancla, inmediata: b.inmediata, saliendo: b.saliendo, title, body: contenido })
  ] });
}
function DataTip({ open = true, anchor, label, value, detail, children, hint, expanded = false, id }) {
  const caja = useRef(null);
  const ultima = useRef(anchor);
  if (open && anchor) ultima.current = anchor;
  const { mounted, leaving } = useMountedWhile(Boolean(open && anchor), SALIDA_MS);
  const ancla = ultima.current && {
    x: ultima.current.x,
    top: ultima.current.top ?? ultima.current.y,
    bottom: ultima.current.bottom ?? ultima.current.y
  };
  const lugar = useUbicacionAnclada(caja, mounted ? ancla : null, SEPARACION_DATO, `${label}|${value}|${detail}|${hint}|${expanded}`);
  const [ubicada, setUbicada] = useState(false);
  useEffect(() => {
    if (!mounted) setUbicada(false);
    else if (lugar && !ubicada) {
      const t = requestAnimationFrame(() => setUbicada(true));
      return () => cancelAnimationFrame(t);
    }
    return void 0;
  }, [mounted, lugar, ubicada]);
  if (!mounted) return null;
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        ref: caja,
        id,
        role: "tooltip",
        className: [
          "hrl-portal hrl-datatip",
          lugar && `hrl-datatip--${lugar.lado}`,
          expanded && "hrl-datatip--ampliada",
          ubicada && "hrl-datatip--desliza",
          leaving && "hrl-datatip--saliendo"
        ].filter(Boolean).join(" "),
        style: lugar ? { transform: `translate3d(${lugar.left}px, ${lugar.top}px, 0)` } : { visibility: "hidden" },
        children: /* @__PURE__ */ jsxs("div", { className: "hrl-datatip__caja", children: [
          label && /* @__PURE__ */ jsx("span", { className: "hrl-datatip__rotulo", children: label }),
          value != null && /* @__PURE__ */ jsx("strong", { className: "hrl-datatip__valor", children: value }),
          detail && /* @__PURE__ */ jsx("span", { className: "hrl-datatip__detalle", children: detail }),
          children,
          hint && /* @__PURE__ */ jsx("span", { className: "hrl-datatip__pista", children: hint })
        ] }, expanded ? "ampliada" : "breve")
      }
    ),
    document.body
  );
}
export {
  DataTip,
  FloatingTip,
  InfoTip,
  Tooltip
};
//# sourceMappingURL=Tooltip.js.map
