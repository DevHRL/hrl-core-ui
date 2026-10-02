import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Badge } from "./Badge.js";
import { Icon } from "./icons.js";
import { useExitAnimation } from "./useExitAnimation.js";
function Field({ k, v, mono }) {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("span", { className: "hrl-campos__k", children: k }),
    /* @__PURE__ */ jsx("span", { className: `hrl-campos__v${mono ? " hrl-mono" : ""}`, children: v || "\u2014" })
  ] });
}
function Timeline({ title, items = [], status = "ok", empty, messages = {} }) {
  const textos = {
    loading: "Cargando\u2026",
    error: "No se pudo leer la informaci\xF3n.",
    empty: empty ?? "Sin registros.",
    ...messages
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsxs("h4", { className: "hrl-hist__titulo", children: [
      title,
      status === "ok" && items.length > 0 && /* @__PURE__ */ jsxs("span", { style: { fontWeight: 400, color: "var(--text-disabled)", fontSize: "var(--text-base)" }, children: [
        " ",
        "\xB7 ",
        items.length.toLocaleString("es-PE")
      ] })
    ] }),
    status === "loading" && /* @__PURE__ */ jsx("p", { style: { fontSize: "var(--text-base)", color: "var(--text-secondary)" }, children: textos.loading }),
    status === "error" && /* @__PURE__ */ jsx("p", { style: { fontSize: "var(--text-base)", color: "var(--danger-text)" }, children: textos.error }),
    status === "ok" && items.length === 0 && /* @__PURE__ */ jsx("p", { style: { fontSize: "var(--text-base)", color: "var(--text-secondary)" }, children: textos.empty }),
    status === "ok" && items.length > 0 && /* @__PURE__ */ jsx("div", { className: "hrl-hist__lista", children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { className: "hrl-hist__fila", style: { animationDelay: `${Math.min(i, 12) * 30}ms` }, children: [
      /* @__PURE__ */ jsx("span", { className: "hrl-hist__fecha", children: it.date }),
      /* @__PURE__ */ jsx("span", { className: "hrl-hist__texto", children: it.title }),
      it.detail && /* @__PURE__ */ jsx("span", { className: "hrl-hist__autor", children: it.detail }),
      it.mark && /* @__PURE__ */ jsx("span", { className: "hrl-hist__marca", children: it.mark })
    ] }, it.key ?? i)) })
  ] });
}
function DetailDialog({
  tone,
  toneText,
  icon,
  badge,
  title,
  subtitle,
  fields,
  block,
  /* Contenido del panel derecho. El diálogo no sabe qué va ahí ni de dónde
     sale: lo monta quien lo usa. */
  aside,
  onClose,
  note
}) {
  const { leaving, close } = useExitAnimation(onClose);
  useEffect(() => {
    const alTeclear = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [close]);
  return createPortal(
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `hrl-portal hrl-modal-overlay${leaving ? " hrl-modal-overlay--saliendo" : ""}`,
        onMouseDown: (e) => e.target === e.currentTarget && close(),
        children: /* @__PURE__ */ jsxs("div", { className: "hrl-modal", style: { maxWidth: 1020 }, role: "dialog", "aria-modal": "true", "aria-label": title, children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "hrl-iconbtn hrl-modal__cerrar", onClick: close, "aria-label": "Cerrar", children: /* @__PURE__ */ jsx(Icon, { name: "sh-close", size: 18 }) }),
          /* @__PURE__ */ jsxs("div", { className: "hrl-detalle__cabecera", style: { "--tono": tone }, children: [
            /* @__PURE__ */ jsx("span", { className: "hrl-detalle__sello", children: /* @__PURE__ */ jsx(Icon, { name: icon, size: 22 }) }),
            /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
              /* @__PURE__ */ jsx(Badge, { label: badge.label, tone: badge.tone }),
              /* @__PURE__ */ jsx("h2", { className: "hrl-detalle__titulo", children: title }),
              /* @__PURE__ */ jsx("p", { className: "hrl-detalle__sub", children: subtitle })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "hrl-modal__body", children: /* @__PURE__ */ jsxs("div", { className: "hrl-detalle", children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: 16 }, children: [
              /* @__PURE__ */ jsx("div", { className: "hrl-campos", children: fields }),
              /* @__PURE__ */ jsxs("div", { className: "hrl-bloque", style: { "--tono": tone, "--tono-texto": toneText }, children: [
                /* @__PURE__ */ jsx("span", { className: "hrl-bloque__titulo", children: block.title }),
                /* @__PURE__ */ jsx("p", { children: block.text })
              ] }),
              note && /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "var(--text-sm)", color: "var(--text-disabled)", lineHeight: 1.55 }, children: note })
            ] }),
            aside
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "hrl-modal__foot", children: /* @__PURE__ */ jsx("button", { type: "button", className: "hrl-btn hrl-btn--ghost", onClick: onClose, children: "Cerrar" }) })
        ] })
      }
    ),
    document.body
  );
}
export {
  DetailDialog,
  Field,
  Timeline
};
//# sourceMappingURL=DetailDialog.js.map
