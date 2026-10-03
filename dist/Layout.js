import { jsx } from "react/jsx-runtime";
import { useLayoutEffect, useRef } from "react";
import { cx } from "./variants.js";
const ALINEACION = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" };
const REPARTO = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" };
function Stack({
  direction = "column",
  gap = 4,
  align,
  justify,
  wrap = false,
  as: Etiqueta = "div",
  className,
  style,
  children,
  ...rest
}) {
  return /* @__PURE__ */ jsx(
    Etiqueta,
    {
      className: cx("hrl-stack", direction === "row" && "hrl-stack--fila", wrap && "hrl-stack--envuelta", className),
      style: {
        "--hrl-gap": `var(--space-${gap})`,
        alignItems: ALINEACION[align],
        justifyContent: REPARTO[justify],
        ...style
      },
      ...rest,
      children
    }
  );
}
function Grid({
  min = 240,
  columns,
  gap = 4,
  as: Etiqueta = "div",
  className,
  style,
  children,
  ...rest
}) {
  const columnas = columns ? `repeat(${columns}, minmax(0, 1fr))` : `repeat(auto-fill, minmax(min(100%, ${min}px), 1fr))`;
  return /* @__PURE__ */ jsx(
    Etiqueta,
    {
      className: cx("hrl-grid", className),
      style: { "--hrl-gap": `var(--space-${gap})`, gridTemplateColumns: columnas, ...style },
      ...rest,
      children
    }
  );
}
const ANCHO = ".hrl-table-wrap, .hrl-table, .hrl-cal, .hrl-pasos, .hrl-trayecto, .hrl-tira, .hrl-grid, .hrl-mosaico";
const esCorta = (el) => el.classList.contains("hrl-section") && !el.classList.contains("hrl-section--ancha") && !el.querySelector(ANCHO);
function acomodar(contenedor) {
  const columnas = getComputedStyle(contenedor).gridTemplateColumns.split(" ").filter(Boolean).length || 1;
  const hijos = [...contenedor.children];
  let corrida = [];
  const cerrar = () => {
    const resto = corrida.length % columnas;
    corrida.forEach((el, i) => {
      const enUltimaFila = resto && i >= corrida.length - resto;
      if (columnas === 1 || corrida.length === 1) el.style.removeProperty("--hrl-mosaico-span");
      else if (!enUltimaFila) el.style.setProperty("--hrl-mosaico-span", "1");
      else {
        const k = i - (corrida.length - resto);
        const base = Math.floor(columnas / resto);
        el.style.setProperty("--hrl-mosaico-span", String(k === resto - 1 ? columnas - base * (resto - 1) : base));
      }
      el.toggleAttribute("data-mosaico", columnas > 1 && corrida.length > 1);
    });
    corrida = [];
  };
  for (const el of hijos) {
    if (esCorta(el)) corrida.push(el);
    else {
      cerrar();
      el.style.removeProperty("--hrl-mosaico-span");
      el.removeAttribute("data-mosaico");
    }
  }
  cerrar();
}
function Mosaic({ min = 420, gap = 4, as: Etiqueta = "div", className, style, children, ...rest }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return void 0;
    let pendiente = 0;
    const programar = () => {
      cancelAnimationFrame(pendiente);
      pendiente = requestAnimationFrame(() => acomodar(el));
    };
    acomodar(el);
    const ro = new ResizeObserver(programar);
    ro.observe(el);
    const mo = new MutationObserver(programar);
    mo.observe(el, { childList: true, subtree: true });
    return () => {
      cancelAnimationFrame(pendiente);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);
  return /* @__PURE__ */ jsx(
    Etiqueta,
    {
      ref,
      className: cx("hrl-mosaico", className),
      style: { "--hrl-gap": `var(--space-${gap})`, "--hrl-mosaico-min": `${min}px`, ...style },
      ...rest,
      children
    }
  );
}
export {
  Grid,
  Mosaic,
  Stack
};
//# sourceMappingURL=Layout.js.map
