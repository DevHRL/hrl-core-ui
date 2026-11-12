import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useFloatingTip } from "./useFloatingTip.js";
import { FloatingTip } from "./Tooltip.js";
import { toneVars } from "./tones.js";
const minutos = (hhmm) => {
  const [h, m] = String(hhmm ?? "").split(":").map(Number);
  return Number.isFinite(h) ? h * 60 + (Number.isFinite(m) ? m : 0) : null;
};
function carriles(bloques) {
  const fines = [];
  return [...bloques].map((b) => ({ ...b, ini: minutos(b.start), fin: minutos(b.end) })).filter((b) => b.ini != null && b.fin != null && b.fin > b.ini).sort((a, b) => a.ini - b.ini || a.fin - b.fin).map((b) => {
    let carril = fines.findIndex((f) => f <= b.ini);
    if (carril < 0) carril = fines.length;
    fines[carril] = b.fin;
    return { ...b, carril };
  });
}
function DayTimeline({
  rows = [],
  start = "07:00",
  end = "20:00",
  step = 60,
  now,
  label,
  legend = [],
  empty = "Sin reservas."
}) {
  const { tip, follow, anchor, hide } = useFloatingTip();
  const desde = minutos(start) ?? 420;
  const hasta = Math.max(desde + 60, minutos(end) ?? 1200);
  const rango = hasta - desde;
  const pct = (m) => `${(Math.min(hasta, Math.max(desde, m)) - desde) / rango * 100}%`;
  const marcas = [];
  for (let m = desde; m <= hasta; m += step) marcas.push(m);
  const ahora = minutos(now);
  const hhmm = (m) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  return /* @__PURE__ */ jsxs("div", { className: "hrl-agenda", children: [
    /* @__PURE__ */ jsxs("div", { className: "hrl-agenda__marco", role: "group", "aria-label": label, children: [
      /* @__PURE__ */ jsxs("div", { className: "hrl-agenda__fila hrl-agenda__fila--eje", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("span", { className: "hrl-agenda__recurso" }),
        /* @__PURE__ */ jsx("span", { className: "hrl-agenda__pista", children: marcas.map((m) => /* @__PURE__ */ jsx("span", { className: "hrl-agenda__marca", style: { left: pct(m) }, children: hhmm(m) }, m)) })
      ] }),
      rows.map((r) => {
        const bloques = carriles(r.blocks ?? []);
        const total = Math.max(1, ...bloques.map((b) => b.carril + 1));
        return /* @__PURE__ */ jsxs("div", { className: "hrl-agenda__fila", role: "group", "aria-label": r.title, children: [
          /* @__PURE__ */ jsxs("span", { className: "hrl-agenda__recurso", children: [
            /* @__PURE__ */ jsx("span", { className: "hrl-agenda__nombre", children: r.title }),
            r.subtitle && /* @__PURE__ */ jsx("span", { className: "hrl-agenda__sub", children: r.subtitle })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "hrl-agenda__pista", style: { "--carriles": total }, children: [
            marcas.map((m) => /* @__PURE__ */ jsx("span", { className: "hrl-agenda__guia", style: { left: pct(m) }, "aria-hidden": "true" }, m)),
            ahora != null && ahora >= desde && ahora <= hasta && /* @__PURE__ */ jsx("span", { className: "hrl-agenda__ahora", style: { left: pct(ahora) }, "aria-hidden": "true" }),
            bloques.length === 0 && /* @__PURE__ */ jsx("span", { className: "hrl-agenda__libre", children: "Libre todo el d\xEDa" }),
            bloques.map((b) => {
              const recortado = b.ini < desde || b.fin > hasta;
              const titulo = b.tip?.title ?? `${b.start}\u2013${b.end} \xB7 ${b.label}`;
              const cuerpo = `${b.tip?.body ?? b.detail ?? ""}${recortado ? " (sigue fuera del horario mostrado)" : ""}`.trim() || b.label;
              const comunes = {
                className: `hrl-agenda__bloque${b.outline ? " hrl-agenda__bloque--contorno" : ""}`,
                style: {
                  ...toneVars(b.tone ?? "info", b.outline),
                  left: pct(b.ini),
                  width: `calc(${pct(b.fin)} - ${pct(b.ini)})`,
                  top: `calc(${b.carril} * var(--agenda-carril))`
                },
                "aria-label": `${b.start} a ${b.end}. ${b.label}${b.detail ? `. ${b.detail}` : ""}`,
                onMouseEnter: (e) => follow(e, titulo, cuerpo),
                onMouseMove: (e) => follow(e, titulo, cuerpo),
                onMouseLeave: hide,
                onFocus: (e) => anchor(e.currentTarget, titulo, cuerpo),
                onBlur: hide
              };
              const contenido = /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsxs("span", { className: "hrl-agenda__bloque-hora", children: [
                  b.start,
                  "\u2013",
                  b.end
                ] }),
                /* @__PURE__ */ jsx("span", { className: "hrl-agenda__bloque-texto", children: b.label })
              ] });
              return b.onSelect ? /* @__PURE__ */ jsx("button", { type: "button", ...comunes, onClick: b.onSelect, children: contenido }, b.key) : /* @__PURE__ */ jsx("span", { role: "img", tabIndex: 0, ...comunes, children: contenido }, b.key);
            })
          ] })
        ] }, r.key);
      }),
      rows.length === 0 && /* @__PURE__ */ jsx("p", { className: "hrl-agenda__vacio", children: empty })
    ] }),
    legend.length > 0 && /* @__PURE__ */ jsx("div", { className: "hrl-rol__leyenda", children: legend.map((l) => /* @__PURE__ */ jsxs("span", { className: "hrl-rol__muestra", children: [
      /* @__PURE__ */ jsx("span", { className: `hrl-rol__turno hrl-rol__turno--muestra${l.outline ? " hrl-rol__turno--contorno" : ""}`, style: toneVars(l.tone, l.outline) }),
      l.label
    ] }, l.label)) }),
    /* @__PURE__ */ jsx(FloatingTip, { tip })
  ] });
}
export {
  DayTimeline
};
//# sourceMappingURL=DayTimeline.js.map
