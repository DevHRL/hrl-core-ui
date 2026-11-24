import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import { useFloatingTip } from "./useFloatingTip.js";
import { FloatingTip } from "./Tooltip.js";
import { cx } from "./variants.js";
const R = 80;
const LARGO = Math.PI * R;
function GaugeArc({ value, color, label }) {
  const hayDato = typeof value === "number" && Number.isFinite(value);
  const pct = hayDato ? Math.max(0, Math.min(100, value)) : 0;
  const offset = LARGO - LARGO * pct / 100;
  return /* @__PURE__ */ jsxs("div", { className: "hrl-gauge", children: [
    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 200 112", role: "img", "aria-label": label ?? `${pct}%`, children: [
      /* @__PURE__ */ jsx("path", { d: `M 20 100 A ${R} ${R} 0 0 1 180 100`, fill: "none", stroke: "rgba(145,158,171,0.24)", strokeWidth: "14", strokeLinecap: "round" }),
      hayDato && /* @__PURE__ */ jsx(
        "path",
        {
          d: `M 20 100 A ${R} ${R} 0 0 1 180 100`,
          fill: "none",
          style: { stroke: color },
          strokeWidth: "14",
          strokeLinecap: "round",
          strokeDasharray: LARGO,
          strokeDashoffset: offset,
          className: "hrl-gauge__arco"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("span", { className: `hrl-gauge__valor${hayDato ? "" : " hrl-gauge__valor--sin-dato"}`, style: { color: hayDato ? void 0 : "var(--text-disabled)" }, children: hayDato ? `${Number(value.toFixed(2))}%` : "Sin datos" })
  ] });
}
function Sparkline({ values, color, height = 30 }) {
  const max = Math.max(1, ...values);
  return /* @__PURE__ */ jsx("span", { className: "hrl-spark", style: { height }, children: values.map((v, i) => /* @__PURE__ */ jsx(
    "span",
    {
      className: "hrl-spark__barra",
      style: {
        height: `${Math.max(8, v / max * 100)}%`,
        background: color,
        opacity: 0.35 + 0.65 * (i + 1) / values.length
      }
    },
    i
  )) });
}
function StackedBars({ labels, series, height = 260, emptyLabel, unit = "registros" }) {
  const { tip, follow, hide } = useFloatingTip();
  const totales = labels.map((_, i) => series.reduce((s, serie) => s + (serie.values[i] ?? 0), 0));
  const max = Math.max(1, ...totales);
  const marcas = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const compacto = (n) => n >= 1e3 ? `${(n / 1e3).toFixed(1).replace(".0", "")}k` : String(n);
  const cifra = (n) => n.toLocaleString("es-PE");
  return /* @__PURE__ */ jsxs("div", { className: "hrl-barras", children: [
    /* @__PURE__ */ jsx("div", { className: "hrl-barras__eje", children: [...marcas].reverse().map((m) => /* @__PURE__ */ jsx("span", { children: compacto(m) }, m)) }),
    /* @__PURE__ */ jsxs("div", { className: "hrl-barras__lienzo", style: { height }, children: [
      labels.map((mes, i) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "hrl-barras__col",
          role: "img",
          "aria-label": `${mes}: ${cifra(totales[i])} ${unit}`,
          children: [
            /* @__PURE__ */ jsx("div", { className: "hrl-barras__pila", children: series.map((serie, j) => {
              const v = serie.values[i] ?? 0;
              if (v <= 0) return null;
              const total = totales[i];
              const parte = total ? v / total * 100 : 0;
              const titulo = series.length > 1 ? `${serie.name} \xB7 ${mes}` : `${mes}`;
              const cuerpo = series.length > 1 ? `${cifra(v)} ${unit} \xB7 ${parte.toFixed(parte < 10 ? 1 : 0)}% de las ${cifra(total)} del mes` : `${cifra(v)} ${unit}`;
              return /* @__PURE__ */ jsx(
                "span",
                {
                  className: "hrl-barras__tramo",
                  style: {
                    height: `${v / max * 100}%`,
                    background: serie.color,
                    "--retardo": `${i * 55 + j * 40}ms`
                  },
                  onMouseEnter: (e) => follow(e, titulo, cuerpo),
                  onMouseMove: (e) => follow(e, titulo, cuerpo),
                  onMouseLeave: hide
                },
                serie.name
              );
            }) }),
            /* @__PURE__ */ jsx("span", { className: "hrl-barras__etiqueta", children: mes })
          ]
        },
        mes
      )),
      emptyLabel && /* @__PURE__ */ jsxs("div", { className: "hrl-barras__col hrl-barras__col--vacia", children: [
        /* @__PURE__ */ jsx("div", { className: "hrl-barras__vacio", children: emptyLabel }),
        /* @__PURE__ */ jsx("span", { className: "hrl-barras__etiqueta", children: "\u2014" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FloatingTip, { tip })
  ] });
}
const SEPARACION_ETIQUETAS = 6;
function usePasoDeEtiquetas(lienzo, columnas) {
  const [paso, setPaso] = useState(1);
  useEffect(() => {
    const el = lienzo.current;
    if (!el || columnas < 2 || typeof ResizeObserver === "undefined") return void 0;
    const medir = () => {
      const etiquetas = [...el.querySelectorAll(".hrl-barras__col--serie .hrl-barras__etiqueta")];
      if (!etiquetas.length) return;
      const recorte = el.querySelector(".hrl-barras__col--recorte")?.offsetWidth ?? 0;
      const columna = Math.max(1, (el.clientWidth - recorte) / columnas);
      const masAncha = Math.max(...etiquetas.map((e) => e.scrollWidth)) + SEPARACION_ETIQUETAS;
      setPaso(Math.max(1, Math.ceil(masAncha / columna)));
    };
    medir();
    const observador = new ResizeObserver(medir);
    observador.observe(el);
    return () => observador.disconnect();
  }, [lienzo, columnas]);
  return paso;
}
function SeriesBars({
  points = [],
  color = "var(--primary)",
  unit = "",
  height = 220,
  format = (n) => n.toLocaleString("es-PE"),
  noDataLabel = "Sin dato",
  emptyTail,
  label
}) {
  const { tip, follow, hide } = useFloatingTip();
  const lienzo = useRef(null);
  let fin = points.length;
  while (fin > 0 && points[fin - 1].value == null) fin -= 1;
  const visibles = points.slice(0, fin);
  const recortados = points.slice(fin);
  const paso = usePasoDeEtiquetas(lienzo, visibles.length);
  const max = Math.max(1, ...visibles.filter((p) => p.value != null).map((p) => p.value));
  const marcas = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));
  const compacto = (n) => n >= 1e3 ? `${(n / 1e3).toFixed(1).replace(".0", "")}k` : String(n);
  return /* @__PURE__ */ jsxs("div", { className: "hrl-barras", role: "group", "aria-label": label, children: [
    /* @__PURE__ */ jsx("div", { className: "hrl-barras__eje", style: { paddingTop: 18 }, children: [...marcas].reverse().map((m, i) => /* @__PURE__ */ jsx("span", { children: compacto(m) }, `${m}-${i}`)) }),
    /* @__PURE__ */ jsxs("div", { className: "hrl-barras__lienzo", style: { height }, ref: lienzo, children: [
      visibles.map((p, i) => {
        const sinDato = p.value == null;
        const conEtiqueta = (visibles.length - 1 - i) % paso === 0;
        const titulo = p.title ?? p.label;
        const cuerpo = sinDato ? p.detail ?? noDataLabel : `${format(p.value)}${unit ? ` ${unit}` : ""}${p.detail ? ` \xB7 ${p.detail}` : ""}`;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            className: "hrl-barras__col hrl-barras__col--serie",
            role: "img",
            "aria-label": `${titulo}: ${cuerpo}`,
            onMouseEnter: (e) => follow(e, titulo, cuerpo),
            onMouseMove: (e) => follow(e, titulo, cuerpo),
            onMouseLeave: hide,
            children: [
              /* @__PURE__ */ jsx("span", { className: "hrl-barras__valor", children: !sinDato && i === visibles.length - 1 ? format(p.value) : "" }),
              sinDato ? /* @__PURE__ */ jsx("span", { className: "hrl-barras__hueco", children: /* @__PURE__ */ jsx("span", { children: noDataLabel }) }) : /* @__PURE__ */ jsx("span", { className: "hrl-barras__pila", children: /* @__PURE__ */ jsx(
                "span",
                {
                  className: "hrl-barras__tramo",
                  style: { height: `${p.value / max * 100}%`, background: color, "--retardo": `${i * 55}ms` }
                }
              ) }),
              /* @__PURE__ */ jsx("span", { className: cx("hrl-barras__etiqueta", !conEtiqueta && "hrl-barras__etiqueta--oculta"), "aria-hidden": !conEtiqueta || void 0, children: p.label })
            ]
          },
          p.key ?? p.label
        );
      }),
      recortados.length > 0 && emptyTail && /* @__PURE__ */ jsxs("div", { className: "hrl-barras__col hrl-barras__col--recorte", children: [
        /* @__PURE__ */ jsx("span", { className: "hrl-barras__valor" }),
        /* @__PURE__ */ jsx("span", { className: "hrl-barras__vacio", children: emptyTail }),
        /* @__PURE__ */ jsx("span", { className: "hrl-barras__etiqueta", children: recortados.map((p) => p.label).join(" \xB7 ") })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FloatingTip, { tip })
  ] });
}
function Funnel({ stages }) {
  const base = stages[0]?.value || 0;
  return /* @__PURE__ */ jsx("div", { className: "hrl-embudo", children: stages.map((e, i) => {
    const pctBase = base ? e.value / base * 100 : 0;
    const previa = i > 0 ? stages[i - 1].value : null;
    const conversion = previa ? e.value / previa * 100 : null;
    const excede = conversion != null && conversion > 100;
    return /* @__PURE__ */ jsxs("div", { className: "hrl-embudo__par", children: [
      i > 0 && /* @__PURE__ */ jsxs("div", { className: "hrl-embudo__flecha", title: excede ? "Esta etapa tiene m\xE1s personas que la anterior: no es una conversi\xF3n." : void 0, children: [
        /* @__PURE__ */ jsx("span", { children: "\u2192" }),
        conversion == null ? /* @__PURE__ */ jsx("strong", { children: "\u2014" }) : excede ? /* @__PURE__ */ jsx("strong", { style: { color: "var(--warning-text)" }, children: "no aplica" }) : /* @__PURE__ */ jsxs("strong", { children: [
          conversion.toFixed(1),
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxs("article", { className: "hrl-embudo__etapa", style: { "--delay": `${i * 60}ms` }, children: [
        /* @__PURE__ */ jsxs("span", { className: "hrl-embudo__rotulo", children: [
          "Etapa ",
          i + 1
        ] }),
        /* @__PURE__ */ jsx("span", { className: "hrl-embudo__nombre", children: e.name }),
        /* @__PURE__ */ jsx("strong", { className: "hrl-embudo__valor", children: e.value.toLocaleString("es-PE") }),
        /* @__PURE__ */ jsx("span", { className: "hrl-reparto", children: /* @__PURE__ */ jsx("span", { className: "hrl-reparto__relleno", style: { width: `${pctBase}%`, background: e.color } }) }),
        /* @__PURE__ */ jsx("span", { className: "hrl-embudo__nota", children: base ? `${pctBase.toFixed(pctBase < 10 ? 1 : 0)}% del total de la etapa 1` : "Sin datos" })
      ] })
    ] }, e.name);
  }) });
}
function Ranking({ rows, format = (n) => n.toLocaleString("es-PE") }) {
  const max = Math.max(1, ...rows.map((f) => f.value));
  return /* @__PURE__ */ jsx("div", { className: "hrl-ranking", children: rows.map((f, i) => /* @__PURE__ */ jsxs("div", { className: "hrl-ranking__fila", style: { "--delay": `${i * 40}ms` }, children: [
    /* @__PURE__ */ jsxs("div", { className: "hrl-ranking__alto", children: [
      /* @__PURE__ */ jsxs("span", { className: "hrl-ranking__nombre", children: [
        /* @__PURE__ */ jsx("span", { className: "hrl-leyenda-series__punto", style: { background: f.color } }),
        f.name
      ] }),
      /* @__PURE__ */ jsx("strong", { className: "hrl-ranking__valor", children: format(f.value) })
    ] }),
    /* @__PURE__ */ jsx("span", { className: "hrl-reparto", children: /* @__PURE__ */ jsx("span", { className: "hrl-reparto__relleno", style: { width: `${f.value / max * 100}%`, background: f.color } }) })
  ] }, f.name)) });
}
function SplitBar({ value, total, color }) {
  const pct = total > 0 ? value / total * 100 : 0;
  return /* @__PURE__ */ jsx("span", { className: "hrl-reparto", children: /* @__PURE__ */ jsx("span", { className: "hrl-reparto__relleno", style: { width: `${pct}%`, background: color } }) });
}
export {
  Funnel,
  GaugeArc,
  Ranking,
  SeriesBars,
  Sparkline,
  SplitBar,
  StackedBars
};
//# sourceMappingURL=Charts.js.map
