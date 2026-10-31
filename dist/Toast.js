import { jsx, jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { useExitAnimation, EXIT_MS } from "./useExitAnimation.js";
import { Icon } from "./icons.js";
function Toast({ message, onClose, duration = 3600 }) {
  const { leaving, close } = useExitAnimation(onClose);
  useEffect(() => {
    if (!message) return void 0;
    const t = setTimeout(close, Math.max(0, duration - EXIT_MS));
    return () => clearTimeout(t);
  }, [message, close, duration]);
  if (!message) return null;
  return createPortal(
    /* @__PURE__ */ jsxs("div", { className: `hrl-portal hrl-toast${leaving ? " hrl-toast--saliendo" : ""}`, role: "status", children: [
      /* @__PURE__ */ jsx(Icon, { name: "sh-ok", size: 18, style: { color: "var(--toast-icono)", flex: "0 0 auto" } }),
      message
    ] }),
    document.body
  );
}
export {
  Toast
};
//# sourceMappingURL=Toast.js.map
