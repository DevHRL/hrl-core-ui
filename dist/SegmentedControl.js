import { jsx } from "react/jsx-runtime";
import { useRef } from "react";
import { cx } from "./variants.js";
function SegmentedControl({ label, options = [], value, onChange, className }) {
  const refs = useRef([]);
  const indice = Math.max(0, options.findIndex((o) => o.value === value));
  const mover = (paso) => {
    const siguiente = (indice + paso + options.length) % options.length;
    onChange?.(options[siguiente].value);
    refs.current[siguiente]?.focus();
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "radiogroup",
      "aria-label": label,
      className: cx("hrl-segmentos", className),
      onKeyDown: (e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          mover(1);
        }
        if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          mover(-1);
        }
      },
      children: options.map((o, i) => {
        const elegido = i === indice;
        return /* @__PURE__ */ jsx(
          "button",
          {
            ref: (el) => {
              refs.current[i] = el;
            },
            type: "button",
            role: "radio",
            "aria-checked": elegido,
            "aria-label": o.ariaLabel,
            tabIndex: elegido ? 0 : -1,
            className: "hrl-segmentos__opcion",
            onClick: () => onChange?.(o.value),
            children: o.label
          },
          String(o.value)
        );
      })
    }
  );
}
export {
  SegmentedControl
};
//# sourceMappingURL=SegmentedControl.js.map
