import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useId, useState } from "react";
import { Tooltip } from "./Tooltip.js";
import { Icon } from "./icons.js";
function Input({
  label = "Campo",
  kind = "text",
  placeholder = "",
  required = false,
  searchIcon = false,
  hint,
  info,
  error,
  options = [],
  /* Alternativa a `options` cuando el desplegable necesita encabezados:
     [{ label, options: [{ value, label }] }]. Sin esto, un panel que
     necesita <optgroup> termina escribiendo el <select> a mano. */
  groups,
  value,
  onChange,
  autoComplete,
  /* Enfoca el campo al montarse: la primera casilla de un ingreso. */
  autoFocus = false,
  disabled = false,
  /* Dentro de una tabla el nombre del campo ya lo da la cabecera de la
     columna. La etiqueta sigue existiendo para los lectores de pantalla. */
  labelHidden = false
}) {
  const esSelect = kind === "select";
  const base = useId();
  const idError = error ? `${base}-error` : void 0;
  const idPista = hint ? `${base}-pista` : void 0;
  const describe = [idError, idPista].filter(Boolean).join(" ") || void 0;
  const [verClave, setVerClave] = useState(false);
  const etiquetaVisible = /* @__PURE__ */ jsxs(Fragment, { children: [
    label,
    required && /* @__PURE__ */ jsx("span", { className: "hrl-field__req", children: "*" }),
    info && /* @__PURE__ */ jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", "aria-hidden": "true", style: { color: "var(--subtle-foreground)", flex: "0 0 auto" }, children: [
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", fill: "none", stroke: "currentColor", strokeWidth: "2" }),
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7.8", r: "1.3", fill: "currentColor" }),
      /* @__PURE__ */ jsx("path", { d: "M12 11v6", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
    ] })
  ] });
  return /* @__PURE__ */ jsxs("label", { className: `hrl-field${error ? " hrl-field--error" : ""}`, children: [
    info ? /* @__PURE__ */ jsx(Tooltip, { title: label, body: info, as: "span", children: /* @__PURE__ */ jsx("span", { className: "hrl-field__label", style: { cursor: "help" }, children: etiquetaVisible }) }) : /* @__PURE__ */ jsx("span", { className: labelHidden ? "hrl-oculto-visual" : "hrl-field__label", children: etiquetaVisible }),
    esSelect ? /* @__PURE__ */ jsxs(
      "select",
      {
        className: "hrl-field__control",
        value,
        onChange,
        disabled,
        "aria-invalid": error ? true : void 0,
        "aria-describedby": describe,
        children: [
          options.map((o) => {
            const value2 = typeof o === "string" ? o : o.value;
            const label2 = typeof o === "string" ? o : o.label;
            return /* @__PURE__ */ jsx("option", { value: value2, children: label2 }, value2);
          }),
          groups?.map((g) => /* @__PURE__ */ jsx("optgroup", { label: g.label, children: g.options.map((o) => /* @__PURE__ */ jsx("option", { value: o.value, children: o.label }, o.value)) }, g.label))
        ]
      }
    ) : /* @__PURE__ */ jsxs("span", { className: "hrl-field__wrap", children: [
      searchIcon && /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", style: { color: "var(--subtle-foreground)", flex: "0 0 auto" }, "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "6", fill: "none", stroke: "currentColor", strokeWidth: "1.8" }),
        /* @__PURE__ */ jsx("path", { d: "M15.5 15.5L20 20", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round" })
      ] }),
      /* @__PURE__ */ jsx(
        "input",
        {
          className: "hrl-field__input",
          type: kind === "date" ? "date" : kind === "password" && !verClave ? "password" : "text",
          inputMode: kind === "number" ? "decimal" : void 0,
          style: kind === "number" ? { textAlign: "right" } : void 0,
          disabled,
          placeholder,
          value,
          onChange,
          autoComplete,
          autoFocus,
          "aria-invalid": error ? true : void 0,
          "aria-describedby": describe
        }
      ),
      kind === "password" && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "hrl-field__ver",
          onClick: () => setVerClave((v) => !v),
          "aria-label": verClave ? "Ocultar la contrase\xF1a" : "Mostrar la contrase\xF1a",
          "aria-pressed": verClave,
          disabled,
          children: /* @__PURE__ */ jsx(Icon, { name: verClave ? "sh-eye-off" : "sh-eye", size: 18 })
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxs("span", { className: "hrl-field__error", id: idError, children: [
      /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", "aria-hidden": "true", children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9", fill: "currentColor", opacity: "0.2" }),
        /* @__PURE__ */ jsx("path", { d: "M12 7.5v6M12 16.6h0", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" })
      ] }),
      error
    ] }),
    hint && /* @__PURE__ */ jsx("span", { className: "hrl-field__hint", id: idPista, children: hint })
  ] });
}
export {
  Input
};
//# sourceMappingURL=Input.js.map
