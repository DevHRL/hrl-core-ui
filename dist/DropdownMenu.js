import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "./icons.js";
import { devolverFoco as devolverFocoA } from "./focus.js";
import { aliasObsoleto, PROP_ALIASES } from "./deprecated.js";
import { anchoVisible } from "./viewport.js";
const ALIGN_ALIASES = PROP_ALIASES.DropdownMenu.align;
const TONE_ALIASES = PROP_ALIASES.DropdownMenu.itemTone;
const MARGEN = 8;
const HUECO = 6;
const ALTO_MINIMO = 120;
function DropdownMenu({ trigger, items = [], align: alineacionPedida = "right", label = "Men\xFA de acciones" }) {
  const align = aliasObsoleto(ALIGN_ALIASES, alineacionPedida, "DropdownMenu");
  const [abierto, setAbierto] = useState(false);
  const [ancla, setAncla] = useState(null);
  const [colocacion, setColocacion] = useState(null);
  const [activo, setActivo] = useState(-1);
  const refDisparador = useRef(null);
  const refMenu = useRef(null);
  const id = useId();
  const seleccionables = items.filter((i) => !i.separator && !i.disabled);
  const cerrar = useCallback((conFoco = true) => {
    setAbierto(false);
    setActivo(-1);
    if (conFoco) devolverFocoA(refDisparador.current?.querySelector("button, a, [tabindex]") ?? refDisparador.current);
  }, []);
  const abrir = () => {
    const r = refDisparador.current?.getBoundingClientRect();
    if (!r) return;
    setAncla({ top: r.top, bottom: r.bottom, left: r.left, right: r.right });
    setColocacion(null);
    setAbierto(true);
  };
  useLayoutEffect(() => {
    const menu = refMenu.current;
    if (!abierto || !ancla || !menu) return;
    const ancho = menu.offsetWidth;
    const alto = menu.scrollHeight + menu.offsetHeight - menu.clientHeight;
    const visibleAncho = anchoVisible();
    const visibleAlto = window.innerHeight;
    const abajo = visibleAlto - ancla.bottom - HUECO - MARGEN;
    const arriba = ancla.top - HUECO - MARGEN;
    const haciaAbajo = alto <= abajo || abajo >= arriba;
    const disponible = Math.max(haciaAbajo ? abajo : arriba, ALTO_MINIMO);
    const altoFinal = Math.min(alto, disponible);
    const estilo = getComputedStyle(menu);
    const marco = estilo.boxSizing === "border-box" ? 0 : parseFloat(estilo.paddingTop) + parseFloat(estilo.paddingBottom) + parseFloat(estilo.borderTopWidth) + parseFloat(estilo.borderBottomWidth);
    const izquierda = align === "right" ? ancla.right - ancho : ancla.left;
    setColocacion({
      top: haciaAbajo ? ancla.bottom + HUECO : ancla.top - HUECO - altoFinal,
      left: Math.min(Math.max(izquierda, MARGEN), Math.max(visibleAncho - ancho - MARGEN, MARGEN)),
      maxHeight: altoFinal < alto ? altoFinal - marco : void 0,
      haciaAbajo
    });
  }, [abierto, ancla, align, items.length]);
  useEffect(() => {
    if (!abierto) return void 0;
    const alTeclear = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        cerrar();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActivo((v) => (v + 1) % seleccionables.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActivo((v) => v <= 0 ? seleccionables.length - 1 : v - 1);
      } else if (e.key === "Tab") {
        cerrar(false);
      }
    };
    const alPulsarFuera = (e) => {
      if (refMenu.current?.contains(e.target) || refDisparador.current?.contains(e.target)) return;
      cerrar(false);
    };
    const alMover = () => cerrar(false);
    window.addEventListener("keydown", alTeclear, true);
    window.addEventListener("mousedown", alPulsarFuera);
    window.addEventListener("scroll", alMover, true);
    window.addEventListener("resize", alMover);
    return () => {
      window.removeEventListener("keydown", alTeclear, true);
      window.removeEventListener("mousedown", alPulsarFuera);
      window.removeEventListener("scroll", alMover, true);
      window.removeEventListener("resize", alMover);
    };
  }, [abierto, cerrar, seleccionables.length]);
  useEffect(() => {
    if (abierto && colocacion && activo >= 0) {
      refMenu.current?.querySelectorAll('[role="menuitem"]')[activo]?.focus();
    }
  }, [abierto, colocacion, activo]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(
      "span",
      {
        ref: refDisparador,
        onClick: () => abierto ? cerrar() : abrir(),
        onKeyDown: (e) => {
          if (e.key === "ArrowDown" && !abierto) {
            e.preventDefault();
            abrir();
            setActivo(0);
          }
        },
        style: { display: "inline-flex" },
        "aria-haspopup": "menu",
        "aria-expanded": abierto,
        "aria-controls": abierto ? id : void 0,
        children: trigger
      }
    ),
    abierto && ancla && createPortal(
      /* @__PURE__ */ jsx(
        "div",
        {
          id,
          ref: refMenu,
          className: `hrl-portal hrl-menu${colocacion?.haciaAbajo === false ? " hrl-menu--arriba" : ""}`,
          role: "menu",
          "aria-label": label,
          style: {
            top: colocacion?.top ?? 0,
            left: colocacion?.left ?? 0,
            maxHeight: colocacion?.maxHeight,
            visibility: colocacion ? void 0 : "hidden"
          },
          children: items.map(
            (item, i) => item.separator ? /* @__PURE__ */ jsx("span", { className: "hrl-menu__separador", role: "separator" }, `sep-${i}`) : /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                role: "menuitem",
                className: `hrl-menu__item${aliasObsoleto(TONE_ALIASES, item.tone, "DropdownMenu") === "danger" ? " hrl-menu__item--peligro" : ""}`,
                disabled: item.disabled,
                onClick: () => {
                  item.onSelect?.();
                  cerrar();
                },
                children: [
                  item.icon && /* @__PURE__ */ jsx(Icon, { name: item.icon, size: 16 }),
                  /* @__PURE__ */ jsx("span", { style: { flex: 1, textAlign: "left" }, children: item.label }),
                  item.shortcut && /* @__PURE__ */ jsx("span", { className: "hrl-menu__atajo", children: item.shortcut })
                ]
              },
              item.id ?? item.label
            )
          )
        }
      ),
      document.body
    )
  ] });
}
export {
  DropdownMenu
};
//# sourceMappingURL=DropdownMenu.js.map
