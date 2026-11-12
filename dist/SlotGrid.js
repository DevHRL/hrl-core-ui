import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { Icon } from "./icons.js";
import { useFloatingTip } from "./useFloatingTip.js";
import { FloatingTip } from "./Tooltip.js";
import { toneVars } from "./tones.js";
const SLOT_STATUS = {
  free: { texto: "Libre", tono: "ok", icono: null, contorno: true },
  taken: { texto: "Ocupado", tono: "info", icono: "sh-profile", contorno: false },
  held: { texto: "Retenido", tono: "warn", icono: "sh-clock", contorno: false },
  blocked: { texto: "Bloqueado", tono: "none", icono: "sh-close", contorno: false },
  past: { texto: "Ya pas\xF3", tono: "none", icono: null, contorno: true }
};
function SlotGrid({
  slots = [],
  label,
  onSelect,
  selectable = (s) => s.status === "free",
  selected,
  legend = true,
  empty = "Sin cupos."
}) {
  const refs = useRef([]);
  const { tip, follow, anchor, hide } = useFloatingTip();
  const elegibles = onSelect ? slots.map((s, i) => selectable(s) ? i : -1).filter((i) => i >= 0) : [];
  const conTab = (() => {
    const i = slots.findIndex((s) => s.key === selected);
    return elegibles.includes(i) ? i : elegibles[0];
  })();
  const mover = (desde, paso) => {
    const pos = elegibles.indexOf(desde);
    const siguiente = elegibles[(pos + paso + elegibles.length) % elegibles.length];
    refs.current[siguiente]?.focus();
  };
  if (!slots.length) return /* @__PURE__ */ jsx("p", { className: "hrl-cupos__vacio", children: empty });
  const conteo = {};
  for (const s of slots) conteo[s.status] = (conteo[s.status] ?? 0) + 1;
  return /* @__PURE__ */ jsxs("div", { className: "hrl-cupos", children: [
    /* @__PURE__ */ jsx("div", { className: "hrl-cupos__rejilla", role: "group", "aria-label": label, children: slots.map((s, i) => {
      const estado = SLOT_STATUS[s.status] ?? SLOT_STATUS.free;
      const puede = elegibles.includes(i);
      const titulo = s.tip?.title ?? `${s.time} \xB7 ${estado.texto}${s.extra ? " (adicional)" : ""}`;
      const cuerpo = s.tip?.body ?? (s.note || estado.texto);
      const nombre = `${s.time}. ${estado.texto}${s.extra ? ", adicional" : ""}${s.note ? `. ${s.note}` : ""}`;
      const clase = `hrl-cupo hrl-cupo--${s.status}${s.key === selected ? " hrl-cupo--on" : ""}${puede ? " hrl-cupo--elegible" : ""}`;
      const contenido = /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("span", { className: "hrl-cupo__hora", children: [
          s.time,
          s.extra && /* @__PURE__ */ jsx("span", { className: "hrl-cupo__extra", "aria-hidden": "true", children: "+" })
        ] }),
        estado.icono && /* @__PURE__ */ jsx(Icon, { name: estado.icono, size: 12 }),
        s.note && /* @__PURE__ */ jsx("span", { className: "hrl-cupo__nota", children: s.note })
      ] });
      const comunes = {
        className: clase,
        style: toneVars(s.tone ?? estado.tono, estado.contorno),
        onMouseEnter: (e) => follow(e, titulo, cuerpo),
        onMouseMove: (e) => follow(e, titulo, cuerpo),
        onMouseLeave: hide,
        onBlur: hide
      };
      if (!puede) {
        return /* @__PURE__ */ jsx("span", { ...comunes, role: "img", "aria-label": nombre, children: contenido }, s.key);
      }
      return /* @__PURE__ */ jsx(
        "button",
        {
          ...comunes,
          ref: (n) => {
            refs.current[i] = n;
          },
          type: "button",
          "aria-label": nombre,
          "aria-pressed": s.key === selected,
          tabIndex: i === conTab ? 0 : -1,
          onClick: () => onSelect(s),
          onFocus: (e) => anchor(e.currentTarget, titulo, cuerpo),
          onKeyDown: (e) => {
            if (e.key === "ArrowRight" || e.key === "ArrowDown") {
              e.preventDefault();
              mover(i, 1);
            }
            if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
              e.preventDefault();
              mover(i, -1);
            }
          },
          children: contenido
        },
        s.key
      );
    }) }),
    legend && /* @__PURE__ */ jsxs("div", { className: "hrl-cupos__leyenda", children: [
      Object.entries(SLOT_STATUS).filter(([k]) => conteo[k]).map(([k, e]) => /* @__PURE__ */ jsxs("span", { className: "hrl-cupos__muestra", children: [
        /* @__PURE__ */ jsx("span", { className: `hrl-cupos__cuadro hrl-cupo--${k}`, style: toneVars(e.tono, e.contorno) }),
        e.texto,
        " \xB7 ",
        conteo[k]
      ] }, k)),
      slots.some((s) => s.extra) && /* @__PURE__ */ jsx("span", { className: "hrl-cupos__muestra", children: "+ adicional" })
    ] }),
    /* @__PURE__ */ jsx(FloatingTip, { tip })
  ] });
}
export {
  SlotGrid
};
//# sourceMappingURL=SlotGrid.js.map
