import { jsx, jsxs } from "react/jsx-runtime";
function Card({
  title = "Secci\xF3n",
  subtitle,
  total,
  accent,
  meta,
  actions,
  flush = false,
  wide = false,
  headingLevel = 2,
  children
}) {
  const Titulo = `h${Math.min(6, Math.max(2, Number(headingLevel) || 2))}`;
  const clases = ["hrl-section", flush && "hrl-section--flush", wide && "hrl-section--ancha"].filter(Boolean).join(" ");
  return /* @__PURE__ */ jsxs("section", { className: clases, style: accent ? { "--accent": accent } : void 0, children: [
    /* @__PURE__ */ jsxs("div", { className: "hrl-section__head", children: [
      /* @__PURE__ */ jsxs("div", { className: "hrl-section__textos", children: [
        /* @__PURE__ */ jsxs(Titulo, { className: "hrl-section__title", children: [
          title,
          total && /* @__PURE__ */ jsxs("span", { className: "hrl-section__total", children: [
            " \xB7 ",
            total
          ] })
        ] }),
        subtitle && /* @__PURE__ */ jsx("p", { className: "hrl-section__subtitle", children: subtitle })
      ] }),
      meta && /* @__PURE__ */ jsx("div", { className: "hrl-section__meta", children: meta }),
      actions && /* @__PURE__ */ jsx("div", { className: "hrl-section__acciones", children: actions })
    ] }),
    children
  ] });
}
export {
  Card
};
//# sourceMappingURL=Card.js.map
