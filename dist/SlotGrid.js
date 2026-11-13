import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useRef } from "react";
import { Icon } from "./icons.js";
import { useFloatingTip } from "./useFloatingTip.js";
import { FloatingTip } from "./Tooltip.js";
import { toneVars } from "./tones.js";
const SLOT_STATUS = {
  free: { texto: "Libre", tono: "ok", icono: null, contorno: true, uno: "libre", varios: "libres" },
  taken: { texto: "Ocupado", tono: "info", icono: "sh-profile", contorno: false, uno: "ocupado", varios: "ocupados" },
  held: { texto: "Retenido", tono: "warn", icono: "sh-clock", contorno: false, uno: "retenido", varios: "retenidos" },
  blocked: { texto: "Bloqueado", tono: "none", icono: "sh-close", contorno: false, uno: "bloqueado", varios: "bloqueados" },
  past: { texto: "Ya pas\xF3", tono: "none", icono: null, contorno: true, uno: "ya pas\xF3", varios: "ya pasaron" }
};
function gruposDeLeyenda(slots) {
  const orden = Object.keys(SLOT_STATUS);
  const grupos = /* @__PURE__ */ new Map();
  for (const s of slots) {
    const status = SLOT_STATUS[s.status] ? s.status : "free";
    const clave = `${status}|${s.tone ?? ""}|${s.note ?? ""}`;
    const g = grupos.get(clave) ?? { clave, status, tone: s.tone, note: s.note, n: 0 };
    g.n += 1;
    grupos.set(clave, g);
  }
  return [...grupos.values()].sort((a, b) => orden.indexOf(a.status) - orden.indexOf(b.status));
}
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
    legend && /* @__PURE__ */ jsxs("ul", { className: "hrl-cupos__leyenda", "aria-label": `Leyenda de ${label}`, children: [
      gruposDeLeyenda(slots).map((g) => {
        const e = SLOT_STATUS[g.status];
        return /* @__PURE__ */ jsxs("li", { className: "hrl-cupos__muestra", children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              className: `hrl-cupo hrl-cupo--${g.status} hrl-cupos__cuadro`,
              style: toneVars(g.tone ?? e.tono, e.contorno),
              "aria-hidden": "true",
              children: e.icono && /* @__PURE__ */ jsx(Icon, { name: e.icono, size: 10 })
            }
          ),
          /* @__PURE__ */ jsxs("span", { children: [
            /* @__PURE__ */ jsx("strong", { children: g.n }),
            " ",
            g.n === 1 ? e.uno : e.varios,
            g.note ? ` en ${g.note}` : ""
          ] })
        ] }, g.clave);
      }),
      slots.some((s) => s.extra) && /* @__PURE__ */ jsxs("li", { className: "hrl-cupos__muestra", children: [
        /* @__PURE__ */ jsx("span", { className: "hrl-cupos__cuadro hrl-cupos__cuadro--extra", "aria-hidden": "true", children: "+" }),
        /* @__PURE__ */ jsx("span", { children: "adicional (sobrecupo)" })
      ] })
    ] }),
    /* @__PURE__ */ jsx(FloatingTip, { tip })
  ] });
}
export {
  SlotGrid
};
//# sourceMappingURL=SlotGrid.js.map
