import { jsx, jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { Icon } from "./icons.js";
import { Tooltip, FloatingTip } from "./Tooltip.js";
import { useFloatingTip } from "./useFloatingTip.js";
const SEMANA = [
  { corto: "Lun", largo: "Lunes" },
  { corto: "Mar", largo: "Martes" },
  { corto: "Mi\xE9", largo: "Mi\xE9rcoles" },
  { corto: "Jue", largo: "Jueves" },
  { corto: "Vie", largo: "Viernes" },
  { corto: "S\xE1b", largo: "S\xE1bado" },
  { corto: "Dom", largo: "Domingo" }
];
const MARCAS = {
  full: { clase: " hrl-cal__dia--lleno", icono: "sh-check", texto: "Completo" },
  partial: { clase: " hrl-cal__dia--parcial", icono: "sh-clock", texto: "Incompleto" },
  empty: { clase: "", icono: null, texto: "Sin registrar" }
};
function Calendar({
  year,
  month,
  selected,
  onSelect,
  statusOf = () => "empty",
  detailOf,
  descriptionOf,
  label = "Calendario del mes",
  legend = true
}) {
  const refs = useRef({});
  const { tip, follow, hide } = useFloatingTip();
  const totalDias = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const desfase = (new Date(Date.UTC(year, month - 1, 1)).getUTCDay() + 6) % 7;
  const dias = Array.from({ length: totalDias }, (_, i) => i + 1);
  const conteo = { full: 0, partial: 0, empty: 0 };
  for (const d of dias) conteo[statusOf(d) ?? "empty"] += 1;
  const ir = (dia) => {
    const destino = Math.min(totalDias, Math.max(1, dia));
    onSelect?.(destino);
    requestAnimationFrame(() => refs.current[destino]?.focus());
  };
  const alTeclear = (e, dia) => {
    const pasos = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    if (e.key in pasos) {
      e.preventDefault();
      ir(dia + pasos[e.key]);
    } else if (e.key === "Home") {
      e.preventDefault();
      ir(1);
    } else if (e.key === "End") {
      e.preventDefault();
      ir(totalDias);
    }
  };
  const celdas = [...Array.from({ length: desfase }, (_, i) => ({ hueco: i })), ...dias.map((d) => ({ dia: d }))];
  const semanas = Array.from({ length: Math.ceil(celdas.length / 7) }, (_, i) => celdas.slice(i * 7, i * 7 + 7));
  const diaDe = (d) => {
    const estado = statusOf(d) ?? "empty";
    const marca = MARCAS[estado] ?? MARCAS.empty;
    const indice = (desfase + d - 1) % 7;
    const nombre = `${SEMANA[indice].largo} ${d}`;
    const detalle = detailOf?.(d);
    const descripcion = descriptionOf?.(d) ?? marca.texto;
    const elegido = d === selected;
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref: (n) => {
          refs.current[d] = n;
        },
        type: "button",
        role: "gridcell",
        "aria-selected": elegido,
        "aria-label": `${nombre}. ${marca.texto}.${detalle ? ` ${detalle}.` : ""}`,
        tabIndex: elegido ? 0 : -1,
        className: `hrl-cal__dia${marca.clase}${elegido ? " hrl-cal__dia--on" : ""}${indice >= 5 ? " hrl-cal__dia--finde" : ""}`,
        onClick: () => onSelect?.(d),
        onKeyDown: (e) => alTeclear(e, d),
        onMouseEnter: (e) => follow(e, nombre, descripcion),
        onMouseMove: (e) => follow(e, nombre, descripcion),
        onMouseLeave: hide,
        children: [
          /* @__PURE__ */ jsx("span", { className: "hrl-cal__num", children: d }),
          marca.icono && /* @__PURE__ */ jsx("span", { className: "hrl-cal__marca", children: /* @__PURE__ */ jsx(Icon, { name: marca.icono, size: 12 }) }),
          detalle && /* @__PURE__ */ jsx("span", { className: "hrl-cal__detalle", children: detalle })
        ]
      },
      d
    );
  };
  return /* @__PURE__ */ jsxs("div", { className: "hrl-cal", children: [
    /* @__PURE__ */ jsx("div", { className: "hrl-cal__semana", "aria-hidden": "true", children: SEMANA.map((s) => /* @__PURE__ */ jsx(
      Tooltip,
      {
        title: s.largo,
        body: `Columna de los ${s.largo.toLowerCase()} del mes.`,
        focusable: false,
        style: { justifyContent: "center" },
        children: /* @__PURE__ */ jsx("span", { className: "hrl-cal__cabecera", children: s.corto })
      },
      s.corto
    )) }),
    /* @__PURE__ */ jsx("div", { className: "hrl-cal__rejilla", role: "grid", "aria-label": label, children: semanas.map((semana, s) => /* @__PURE__ */ jsx("div", { role: "row", className: "hrl-cal__fila", children: semana.map((celda) => celda.hueco != null ? /* @__PURE__ */ jsx("span", { className: "hrl-cal__hueco", "aria-hidden": "true" }, `hueco-${celda.hueco}`) : diaDe(celda.dia)) }, `semana-${s}`)) }),
    legend && /* @__PURE__ */ jsxs("div", { className: "hrl-cal__leyenda", children: [
      /* @__PURE__ */ jsxs("span", { className: "hrl-cal__muestra", children: [
        /* @__PURE__ */ jsx("span", { className: "hrl-cal__cuadro hrl-cal__cuadro--lleno" }),
        /* @__PURE__ */ jsx(Icon, { name: "sh-check", size: 12 }),
        "Completo \xB7 ",
        conteo.full
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "hrl-cal__muestra", children: [
        /* @__PURE__ */ jsx("span", { className: "hrl-cal__cuadro hrl-cal__cuadro--parcial" }),
        /* @__PURE__ */ jsx(Icon, { name: "sh-clock", size: 12 }),
        "Incompleto \xB7 ",
        conteo.partial
      ] }),
      /* @__PURE__ */ jsxs("span", { className: "hrl-cal__muestra", children: [
        /* @__PURE__ */ jsx("span", { className: "hrl-cal__cuadro" }),
        "Sin registrar \xB7 ",
        conteo.empty
      ] })
    ] }),
    /* @__PURE__ */ jsx(FloatingTip, { tip })
  ] });
}
export {
  Calendar
};
//# sourceMappingURL=Calendar.js.map
