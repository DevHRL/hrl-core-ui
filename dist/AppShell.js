import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useRef, useState } from "react";
import { Sprite, Icon } from "./icons.js";
import { EmptyState } from "./EmptyState.js";
import { HrlLogo } from "./HrlLogo.js";
import { PageHeader } from "./PageHeader.js";
import { PageBanner } from "./PageBanner.js";
import { Tooltip } from "./Tooltip.js";
import { readTheme, applyTheme } from "./theme.js";
import { useExitAnimation } from "./useExitAnimation.js";
const TABS_NOTIF = ["Todas", "No le\xEDdas", "Archivadas"];
const LOGO_POR_DEFECTO = /* @__PURE__ */ jsxs(Fragment, { children: [
  /* @__PURE__ */ jsx(HrlLogo, { width: 158, className: "hrl-sidebar__logo-completo" }),
  /* @__PURE__ */ jsx(HrlLogo, { variant: "mark", width: 52, className: "hrl-sidebar__logo-escudo" })
] });
function iniciales(nombre) {
  if (!nombre) return "\xB7\xB7";
  const partes = nombre.trim().split(/\s+/).slice(0, 2);
  return partes.map((p) => p[0]?.toUpperCase() ?? "").join("") || "\xB7\xB7";
}
function agrupar(navItems) {
  const grupos = [];
  for (const item of navItems) {
    const titulo = item.group ?? "";
    let grupo = grupos.find((g) => g.title === titulo);
    if (!grupo) {
      grupo = { title: titulo, items: [] };
      grupos.push(grupo);
    }
    grupo.items.push(item);
  }
  return grupos;
}
function SidebarNav({ navItems, active, onSelect, plegado }) {
  return /* @__PURE__ */ jsx("nav", { className: "hrl-sidebar__nav", children: agrupar(navItems).map((sec, i) => /* @__PURE__ */ jsxs("div", { className: "hrl-sidebar__group", children: [
    sec.title && /* @__PURE__ */ jsx("div", { className: "hrl-sidebar__group-label", children: sec.title }),
    sec.items.map((item) => {
      const Etiqueta = item.href ? "a" : "button";
      const boton = /* @__PURE__ */ jsxs(
        Etiqueta,
        {
          type: item.href ? void 0 : "button",
          href: item.href,
          className: `hrl-nav-item${item.id === active ? " hrl-nav-item--on" : ""}`,
          onClick: () => onSelect?.(item.id),
          "aria-current": item.id === active ? "page" : void 0,
          "aria-label": plegado ? item.label : void 0,
          children: [
            /* @__PURE__ */ jsx(Icon, { name: item.icon }),
            /* @__PURE__ */ jsx("span", { className: "hrl-nav-item__label", children: item.label }),
            item.badge != null && /* @__PURE__ */ jsx("span", { className: "hrl-nav-item__badge", children: item.badge })
          ]
        },
        item.id
      );
      return plegado ? /* @__PURE__ */ jsx(
        Tooltip,
        {
          as: "div",
          style: { display: "block", width: "100%" },
          focusable: false,
          title: item.label,
          body: item.group ? `${item.group} \xB7 ${item.label}` : item.label,
          children: boton
        },
        item.id
      ) : boton;
    })
  ] }, sec.title || `g-${i}`)) });
}
function NotificationsDrawer({ items, tab, onTab, onMarkAllRead, onClose, leaving }) {
  const noLeidas = items.filter((n) => n.unread).length;
  const conteos = { Todas: items.length, "No le\xEDdas": noLeidas, Archivadas: items.length - noLeidas };
  const visibles = items.filter((n) => tab === "Todas" ? true : tab === "No le\xEDdas" ? n.unread : !n.unread);
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: `hrl-drawer hrl-drawer--notif${leaving ? " hrl-drawer--saliendo" : ""}`,
      role: "dialog",
      "aria-label": "Notificaciones",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "hrl-drawer__head", children: [
          /* @__PURE__ */ jsx("h2", { children: "Notificaciones" }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "hrl-drawer__link", onClick: onMarkAllRead, disabled: !noLeidas, children: "Marcar le\xEDdas" }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "hrl-iconbtn", onClick: onClose, "aria-label": "Cerrar", children: /* @__PURE__ */ jsx(Icon, { name: "sh-close", size: 18 }) })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hrl-drawer__tabs", children: TABS_NOTIF.map((t) => /* @__PURE__ */ jsxs("button", { type: "button", className: `hrl-tab${t === tab ? " hrl-tab--on" : ""}`, onClick: () => onTab(t), children: [
          t,
          /* @__PURE__ */ jsx("span", { className: "hrl-tab__count", children: conteos[t] })
        ] }, t)) }),
        /* @__PURE__ */ jsx("div", { className: "hrl-drawer__body", children: visibles.length === 0 ? /* @__PURE__ */ jsx(
          EmptyState,
          {
            icon: "sh-bell",
            tone: "var(--info)",
            title: "Sin notificaciones",
            body: "El sistema todav\xEDa no registra avisos. Este panel se llenar\xE1 cuando el backend exponga el endpoint de notificaciones."
          }
        ) : visibles.map((n, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            className: "hrl-notif-row",
            style: {
              display: "flex",
              gap: 14,
              padding: "16px 20px",
              borderBottom: "1px dashed var(--border)",
              background: n.unread ? "var(--info-soft)" : "transparent",
              animation: `hrl-rowIn .4s var(--ease) both`,
              animationDelay: `${i * 45}ms`
            },
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    width: 38,
                    height: 38,
                    flex: "0 0 auto",
                    borderRadius: "var(--radius-md)",
                    background: n.bg,
                    color: n.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  },
                  children: /* @__PURE__ */ jsx(Icon, { name: n.icon, size: 18 })
                }
              ),
              /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 6 }, children: [
                /* @__PURE__ */ jsxs("p", { style: { margin: 0, fontSize: "var(--text-md)", lineHeight: "var(--leading-normal)" }, children: [
                  /* @__PURE__ */ jsx("strong", { style: { fontWeight: 700 }, children: n.title }),
                  " ",
                  n.body
                ] }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "var(--text-sm)", color: "var(--muted-foreground)" }, children: n.meta })
              ] }),
              n.unread && /* @__PURE__ */ jsx("span", { style: { width: 8, height: 8, borderRadius: "var(--radius-full)", background: "var(--info)", flex: "0 0 auto", marginTop: 6 } })
            ]
          },
          n.id
        )) }),
        /* @__PURE__ */ jsx("div", { className: "hrl-drawer__foot", children: /* @__PURE__ */ jsx("button", { type: "button", className: "hrl-drawer__btn", onClick: onClose, children: "Cerrar" }) })
      ]
    }
  );
}
function InterruptorTema({ tema, onCambiar }) {
  const oscuro = tema === "oscuro";
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      className: `hrl-tema${oscuro ? " hrl-tema--on" : ""}`,
      onClick: () => onCambiar(oscuro ? "claro" : "oscuro"),
      role: "switch",
      "aria-checked": oscuro,
      children: [
        /* @__PURE__ */ jsxs("span", { className: "hrl-tema__texto", children: [
          /* @__PURE__ */ jsx("strong", { children: "Modo oscuro" }),
          /* @__PURE__ */ jsx("span", { children: oscuro ? "Activado" : "Desactivado" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "hrl-tema__palanca", "aria-hidden": "true", children: /* @__PURE__ */ jsx("span", { className: "hrl-tema__bolita" }) })
      ]
    }
  );
}
function ProfileDrawer({ user, onClose, onSignOut, leaving, tema, onTema }) {
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: `hrl-drawer hrl-drawer--profile${leaving ? " hrl-drawer--saliendo" : ""}`,
      role: "dialog",
      "aria-label": "Perfil",
      children: [
        /* @__PURE__ */ jsx("div", { style: { padding: "16px 16px 0" }, children: /* @__PURE__ */ jsx("button", { type: "button", className: "hrl-iconbtn", onClick: onClose, "aria-label": "Cerrar", children: /* @__PURE__ */ jsx(Icon, { name: "sh-close", size: 18 }) }) }),
        /* @__PURE__ */ jsxs("div", { className: "hrl-profile__head", children: [
          /* @__PURE__ */ jsx("span", { className: "hrl-profile__ring", children: user?.avatar ? /* @__PURE__ */ jsx("img", { className: "hrl-profile__foto", src: user.avatar, alt: "" }) : /* @__PURE__ */ jsx("span", { className: "hrl-profile__initials", children: iniciales(user?.name) }) }),
          /* @__PURE__ */ jsx("strong", { className: "hrl-profile__name", children: user?.name ?? "Sin sesi\xF3n" }),
          /* @__PURE__ */ jsx("span", { className: "hrl-profile__mail", children: user?.email ?? user?.role ?? "\u2014" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "hrl-perfil__cuerpo", children: /* @__PURE__ */ jsx(InterruptorTema, { tema, onCambiar: onTema }) }),
        /* @__PURE__ */ jsx("div", { className: "hrl-profile__foot", children: /* @__PURE__ */ jsx("button", { type: "button", className: "hrl-signout", onClick: onSignOut, children: "Cerrar sesi\xF3n" }) })
      ]
    }
  );
}
const ID_CONTENIDO = "contenido-principal";
const ANCHO_MOVIL = 899;
function AppShell({
  navItems = [],
  active,
  onSelect,
  title,
  subtitle,
  breadcrumbs,
  actions,
  banner,
  user,
  logo,
  brand,
  themeKey,
  notifications = [],
  onSignOut,
  panelLeaving,
  children
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [tab, setTab] = useState("Todas");
  const [leidas, setLeidas] = useState({});
  const [plegado, setPlegado] = useState(() => localStorage.getItem("hrl_menu") === "plegado");
  const [menuMovil, setMenuMovil] = useState(false);
  const [tema, setTema] = useState(() => readTheme(themeKey));
  useEffect(() => {
    applyTheme(tema, themeKey);
  }, [tema, themeKey]);
  const topbarRef = useRef(null);
  useEffect(() => {
    const el = topbarRef.current;
    if (!el) return void 0;
    const medir = () => {
      document.documentElement.style.setProperty("--hrl-topbar-h", `${el.offsetHeight}px`);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [title, subtitle, breadcrumbs, banner]);
  const abierto = notifOpen || profileOpen;
  useEffect(() => {
    if (!menuMovil) return void 0;
    const alTeclear = (e) => {
      if (e.key === "Escape") setMenuMovil(false);
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [menuMovil]);
  const saltarAlContenido = (e) => {
    e.preventDefault();
    document.getElementById(ID_CONTENIDO)?.focus();
  };
  const ocultar = useCallback(() => {
    setNotifOpen(false);
    setProfileOpen(false);
  }, []);
  const { leaving, close } = useExitAnimation(ocultar);
  useEffect(() => {
    if (!abierto) return void 0;
    const alTeclear = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", alTeclear);
    return () => window.removeEventListener("keydown", alTeclear);
  }, [abierto, close]);
  const lista = notifications.map((n) => ({ ...n, unread: n.unread && !leidas[n.id] }));
  const noLeidas = lista.filter((n) => n.unread).length;
  const cambiarTema = (siguiente) => setTema(siguiente);
  const esEstrecha = () => typeof window !== "undefined" && window.matchMedia?.(`(max-width: ${ANCHO_MOVIL}px)`).matches;
  const alternarMenu = () => {
    if (esEstrecha()) {
      setMenuMovil((v) => !v);
      return;
    }
    setPlegado((v) => {
      localStorage.setItem("hrl_menu", v ? "desplegado" : "plegado");
      return !v;
    });
  };
  return /* @__PURE__ */ jsxs("div", { className: "hrl-nuevo", children: [
    /* @__PURE__ */ jsx(Sprite, {}),
    /* @__PURE__ */ jsx("a", { className: "hrl-saltar", href: `#${ID_CONTENIDO}`, onClick: saltarAlContenido, children: "Saltar al contenido" }),
    /* @__PURE__ */ jsxs("div", { className: `hrl-shell${plegado ? " hrl-shell--plegado" : ""}${menuMovil ? " hrl-shell--menu-abierto" : ""}`, children: [
      /* @__PURE__ */ jsxs("aside", { className: "hrl-sidebar", "aria-label": "Men\xFA principal", children: [
        /* @__PURE__ */ jsx("div", { className: "hrl-sidebar__logo", children: logo === void 0 ? LOGO_POR_DEFECTO : logo }),
        /* @__PURE__ */ jsx(
          SidebarNav,
          {
            navItems,
            active,
            onSelect: (id) => {
              setMenuMovil(false);
              onSelect?.(id);
            },
            plegado
          }
        )
      ] }),
      menuMovil && /* @__PURE__ */ jsx("button", { type: "button", className: "hrl-sidebar__velo", onClick: () => setMenuMovil(false), "aria-label": "Cerrar el men\xFA" }),
      /* @__PURE__ */ jsxs("div", { className: "hrl-main", children: [
        /* @__PURE__ */ jsxs("header", { className: "hrl-topbar", ref: topbarRef, children: [
          /* @__PURE__ */ jsxs("div", { className: "hrl-topbar__row", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: `hrl-plegar${plegado ? " hrl-plegar--plegado" : ""}`,
                onClick: alternarMenu,
                "aria-label": plegado ? "Mostrar el men\xFA lateral" : "Replegar el men\xFA lateral",
                "aria-expanded": menuMovil || !plegado,
                children: /* @__PURE__ */ jsx(Icon, { name: "sh-sidebar-collapse", size: 18 })
              }
            ),
            brand && /* @__PURE__ */ jsx("span", { className: "hrl-topbar__brand", children: brand }),
            /* @__PURE__ */ jsx("div", { className: "hrl-topbar__spacer" }),
            /* @__PURE__ */ jsx("div", { className: "hrl-topbar__acciones", id: "hrl-acciones-modulo" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: `hrl-bell${notifOpen ? " hrl-bell--on" : ""}`,
                onClick: () => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                },
                "aria-label": `Notificaciones${noLeidas ? `: ${noLeidas} sin leer` : ""}`,
                children: [
                  /* @__PURE__ */ jsx(Icon, { name: "sh-bell", size: 21 }),
                  noLeidas > 0 && /* @__PURE__ */ jsx("span", { className: "hrl-bell__badge", children: noLeidas })
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "hrl-avatar",
                onClick: () => {
                  setProfileOpen(true);
                  setNotifOpen(false);
                },
                "aria-label": "Perfil",
                children: user?.avatar ? /* @__PURE__ */ jsx("img", { className: "hrl-avatar__foto", src: user.avatar, alt: "" }) : /* @__PURE__ */ jsx("span", { className: "hrl-avatar__initials", children: iniciales(user?.name) })
              }
            )
          ] }),
          !banner && /* @__PURE__ */ jsx(PageHeader, { title, description: subtitle, breadcrumbs, actions })
        ] }),
        /* @__PURE__ */ jsxs("main", { id: ID_CONTENIDO, tabIndex: -1, className: `hrl-content${panelLeaving ? " hrl-content--saliendo" : ""}`, children: [
          banner && /* @__PURE__ */ jsx(
            PageBanner,
            {
              title,
              description: subtitle,
              breadcrumbs,
              clock: banner.clock,
              status: banner.status,
              mascot: banner.mascot,
              actions: banner.actions || actions ? /* @__PURE__ */ jsxs(Fragment, { children: [
                banner.actions,
                actions
              ] }) : null
            }
          ),
          children
        ] })
      ] }),
      abierto && /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: `hrl-overlay${leaving ? " hrl-overlay--saliendo" : ""}`,
          onClick: close,
          "aria-label": "Cerrar panel"
        }
      ),
      notifOpen && /* @__PURE__ */ jsx(
        NotificationsDrawer,
        {
          items: lista,
          tab,
          onTab: setTab,
          onMarkAllRead: () => setLeidas(Object.fromEntries(notifications.map((n) => [n.id, true]))),
          onClose: close,
          leaving
        }
      ),
      profileOpen && /* @__PURE__ */ jsx(
        ProfileDrawer,
        {
          user,
          onClose: close,
          onSignOut,
          leaving,
          tema,
          onTema: cambiarTema
        }
      )
    ] })
  ] });
}
export {
  AppShell,
  ID_CONTENIDO
};
//# sourceMappingURL=AppShell.js.map
