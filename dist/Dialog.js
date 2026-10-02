import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./icons.js";
import { useExitAnimation } from "./useExitAnimation.js";
function Dialog({ title, subtitle, onClose, maxWidth = 960, children, footer }) {
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
        children: /* @__PURE__ */ jsxs("div", { className: "hrl-modal", style: { maxWidth }, role: "dialog", "aria-modal": "true", "aria-label": title, children: [
          /* @__PURE__ */ jsx("button", { type: "button", className: "hrl-iconbtn hrl-modal__cerrar", onClick: close, "aria-label": "Cerrar", children: /* @__PURE__ */ jsx(Icon, { name: "sh-close", size: 18 }) }),
          /* @__PURE__ */ jsx("div", { className: "hrl-modal__head", children: /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ jsx("h2", { className: "hrl-modal__title", children: title }),
            subtitle && /* @__PURE__ */ jsx("p", { className: "hrl-modal__subtitle", children: subtitle })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "hrl-modal__body", children }),
          footer && /* @__PURE__ */ jsx("div", { className: "hrl-modal__foot", children: footer })
        ] })
      }
    ),
    document.body
  );
}
export {
  Dialog
};
//# sourceMappingURL=Dialog.js.map
