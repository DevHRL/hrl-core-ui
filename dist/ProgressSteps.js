import { jsx, jsxs } from "react/jsx-runtime";
import { Icon } from "./icons.js";
const NOTA = { partial: "sh-clock", error: "sh-crit" };
function ProgressSteps({ steps = [], active, label = "Pasos" }) {
  const activo = steps.findIndex((paso) => paso.key === active);
  return /* @__PURE__ */ jsx("ol", { className: "hrl-trayecto", "aria-label": label, style: { "--hrl-trayecto-pasos": steps.length || 1 }, children: steps.map((paso, i) => {
    const estado = paso.status ?? "empty";
    const clases = ["hrl-trayecto__paso", `hrl-trayecto__paso--${estado}`, i === activo && "hrl-trayecto__paso--on"].filter(Boolean);
    return /* @__PURE__ */ jsxs("li", { className: clases.join(" "), "aria-current": i === activo ? "step" : void 0, children: [
      /* @__PURE__ */ jsx("span", { className: "hrl-trayecto__circulo", "aria-hidden": "true", children: estado === "ok" ? /* @__PURE__ */ jsx(Icon, { name: "sh-ok", size: 18 }) : estado === "error" ? /* @__PURE__ */ jsx(Icon, { name: "sh-crit", size: 18 }) : i + 1 }),
      /* @__PURE__ */ jsx("span", { className: "hrl-trayecto__titulo", children: paso.title }),
      paso.note && /* @__PURE__ */ jsxs("span", { className: "hrl-trayecto__nota", children: [
        NOTA[estado] && /* @__PURE__ */ jsx(Icon, { name: NOTA[estado], size: 13 }),
        paso.note
      ] })
    ] }, paso.key);
  }) });
}
export {
  ProgressSteps
};
//# sourceMappingURL=ProgressSteps.js.map
