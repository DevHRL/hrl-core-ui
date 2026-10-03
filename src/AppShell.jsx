import { useCallback, useEffect, useRef, useState } from 'react';
import { Sprite, Icon } from './icons.jsx';
import { EmptyState } from './EmptyState.jsx';
import { HrlLogo } from './HrlLogo.jsx';
import { PageHeader } from './PageHeader.jsx';
import { PageBanner } from './PageBanner.jsx';
import { Tooltip } from './Tooltip.jsx';
import { readTheme, applyTheme } from './theme.js';
import { useExitAnimation } from './useExitAnimation.js';

const TABS_NOTIF = ['Todas', 'No leídas', 'Archivadas'];

/* Logo por defecto: el extendido con el menú abierto y solo el escudo con el
   menú plegado, que no deja sitio para el nombre. Se montan los dos y el CSS
   decide cuál se ve, así plegar no vuelve a pintar el árbol. */
const LOGO_POR_DEFECTO = (
  <>
    <HrlLogo width={158} className="hrl-sidebar__logo-completo" />
    <HrlLogo variant="mark" width={52} className="hrl-sidebar__logo-escudo" />
  </>
);

/* Contrato de usuario del shell:
     { name, email?, role?, avatar? }
   Los nombres de campo son genéricos a propósito: cada sistema traduce los
   suyos al pasarlos, y el shell no aprende el vocabulario de ninguno. */
function iniciales(nombre) {
  if (!nombre) return '··';
  const partes = nombre.trim().split(/\s+/).slice(0, 2);
  return partes.map((p) => p[0]?.toUpperCase() ?? '').join('') || '··';
}

/* Navegación lateral.

   `navItems` es una lista plana; un `group` opcional agrupa entradas bajo un
   rótulo. El shell no decide qué módulos existen ni quién los ve: eso llega
   resuelto desde fuera.

     navItems: { id, label, icon, group?, badge?, href? }[] */
function agrupar(navItems) {
  const grupos = [];
  for (const item of navItems) {
    const titulo = item.group ?? '';
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
  return (
    <nav className="hrl-sidebar__nav">
      {agrupar(navItems).map((sec, i) => (
        <div className="hrl-sidebar__group" key={sec.title || `g-${i}`}>
          {sec.title && <div className="hrl-sidebar__group-label">{sec.title}</div>}
          {sec.items.map((item) => {
            const Etiqueta = item.href ? 'a' : 'button';
            const boton = (
              <Etiqueta
                key={item.id}
                type={item.href ? undefined : 'button'}
                href={item.href}
                className={`hrl-nav-item${item.id === active ? ' hrl-nav-item--on' : ''}`}
                onClick={() => onSelect?.(item.id)}
                aria-current={item.id === active ? 'page' : undefined}
                aria-label={plegado ? item.label : undefined}
              >
                <Icon name={item.icon} />
                <span className="hrl-nav-item__label">{item.label}</span>
                {item.badge != null && <span className="hrl-nav-item__badge">{item.badge}</span>}
              </Etiqueta>
            );

            /* Replegado solo queda el icono, así que la etiqueta pasa a un
               tooltip: sin él el menú sería una adivinanza de pictogramas. */
            return plegado ? (
              <Tooltip
                key={item.id}
                as="div"
                style={{ display: 'block', width: '100%' }}
                focusable={false}
                title={item.label}
                body={item.group ? `${item.group} · ${item.label}` : item.label}
              >
                {boton}
              </Tooltip>
            ) : (
              boton
            );
          })}
        </div>
      ))}
    </nav>
  );
}

function NotificationsDrawer({ items, tab, onTab, onMarkAllRead, onClose, leaving }) {
  const noLeidas = items.filter((n) => n.unread).length;
  const conteos = { Todas: items.length, 'No leídas': noLeidas, Archivadas: items.length - noLeidas };
  const visibles = items.filter((n) => (tab === 'Todas' ? true : tab === 'No leídas' ? n.unread : !n.unread));

  return (
    <aside
      className={`hrl-drawer hrl-drawer--notif${leaving ? ' hrl-drawer--saliendo' : ''}`}
      role="dialog"
      aria-label="Notificaciones"
    >
      <div className="hrl-drawer__head">
        <h2>Notificaciones</h2>
        <button type="button" className="hrl-drawer__link" onClick={onMarkAllRead} disabled={!noLeidas}>
          Marcar leídas
        </button>
        <button type="button" className="hrl-iconbtn" onClick={onClose} aria-label="Cerrar">
          <Icon name="sh-close" size={18} />
        </button>
      </div>

      <div className="hrl-drawer__tabs">
        {TABS_NOTIF.map((t) => (
          <button key={t} type="button" className={`hrl-tab${t === tab ? ' hrl-tab--on' : ''}`} onClick={() => onTab(t)}>
            {t}
            <span className="hrl-tab__count">{conteos[t]}</span>
          </button>
        ))}
      </div>

      <div className="hrl-drawer__body">
        {visibles.length === 0 ? (
          <EmptyState
            icon="sh-bell"
            tone="var(--info)"
            title="Sin notificaciones"
            body="El sistema todavía no registra avisos. Este panel se llenará cuando el backend exponga el endpoint de notificaciones."
          />
        ) : (
          visibles.map((n, i) => (
            <div
              key={n.id}
              className="hrl-notif-row"
              style={{
                display: 'flex',
                gap: 14,
                padding: '16px 20px',
                borderBottom: '1px dashed var(--border)',
                background: n.unread ? 'var(--info-soft)' : 'transparent',
                animation: `hrl-rowIn .4s var(--ease) both`,
                animationDelay: `${i * 45}ms`,
              }}
            >
              <span
                style={{
                  width: 38,
                  height: 38,
                  flex: '0 0 auto',
                  borderRadius: 'var(--radius-md)',
                  background: n.bg,
                  color: n.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name={n.icon} size={18} />
              </span>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ margin: 0, fontSize: 'var(--text-md)', lineHeight: 'var(--leading-normal)' }}>
                  <strong style={{ fontWeight: 700 }}>{n.title}</strong> {n.body}
                </p>
                {/* `subtle-foreground` es para íconos y estado inactivo, no
                    para texto que hay que leer: no llega a 4.5:1. */}
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{n.meta}</span>
              </div>
              {n.unread && (
                <span style={{ width: 8, height: 8, borderRadius: 'var(--radius-full)', background: 'var(--info)', flex: '0 0 auto', marginTop: 6 }} />
              )}
            </div>
          ))
        )}
      </div>

      <div className="hrl-drawer__foot">
        <button type="button" className="hrl-drawer__btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </aside>
  );
}

/* Interruptor de modo oscuro. Es lo único que hoy tiene sentido guardar por
   persona en este panel: el resto de la cuenta se administra en Configuración
   y la sesión se comparte con el sistema vigente. */
function InterruptorTema({ tema, onCambiar }) {
  const oscuro = tema === 'oscuro';

  return (
    <button
      type="button"
      className={`hrl-tema${oscuro ? ' hrl-tema--on' : ''}`}
      onClick={() => onCambiar(oscuro ? 'claro' : 'oscuro')}
      role="switch"
      aria-checked={oscuro}
    >
      <span className="hrl-tema__texto">
        <strong>Modo oscuro</strong>
        <span>{oscuro ? 'Activado' : 'Desactivado'}</span>
      </span>
      <span className="hrl-tema__palanca" aria-hidden="true">
        <span className="hrl-tema__bolita" />
      </span>
    </button>
  );
}

function ProfileDrawer({ user, onClose, onSignOut, leaving, tema, onTema }) {
  return (
    <aside
      className={`hrl-drawer hrl-drawer--profile${leaving ? ' hrl-drawer--saliendo' : ''}`}
      role="dialog"
      aria-label="Perfil"
    >
      <div style={{ padding: '16px 16px 0' }}>
        <button type="button" className="hrl-iconbtn" onClick={onClose} aria-label="Cerrar">
          <Icon name="sh-close" size={18} />
        </button>
      </div>

      <div className="hrl-profile__head">
        <span className="hrl-profile__ring">
          {user?.avatar ? (
            <img className="hrl-profile__foto" src={user.avatar} alt="" />
          ) : (
            <span className="hrl-profile__initials">{iniciales(user?.name)}</span>
          )}
        </span>
        <strong className="hrl-profile__name">{user?.name ?? 'Sin sesión'}</strong>
        <span className="hrl-profile__mail">{user?.email ?? user?.role ?? '—'}</span>
      </div>

      <div className="hrl-perfil__cuerpo">
        <InterruptorTema tema={tema} onCambiar={onTema} />
      </div>

      <div className="hrl-profile__foot">
        <button type="button" className="hrl-signout" onClick={onSignOut}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

/* Layout maestro: menú lateral replegable, barra superior con ranura de
   acciones, cajón de notificaciones, menú de perfil con tema y encabezado de
   página. Todo lo que muestra llega por props; no consulta nada.

     navItems  { id, label, icon, group?, badge?, href? }[]
     user      { name, email?, role?, avatar? }
     logo      nodo libre para la marca; si se omite, el logo del hospital (HrlLogo),
               que al plegar el menú queda en solo el escudo.
               Pasar `logo={null}` deja la barra lateral sin marca
     brand     nombre del sistema en la barra superior; el kit no lo sabe
     themeKey  clave con la que se recuerda el modo oscuro
     banner    { status?, mascot?, actions?, clock? }: la vista se presenta con
               PageBanner (la cabecera en banda) al principio del contenido, en
               vez de con PageHeader dentro de la barra superior. Usa el mismo
               title, subtitle y breadcrumbs; `actions` de la barra se suma a
               las de la banda */
/* El id del contenido principal: el destino del enlace «Saltar al contenido».
   Exportado para que la aplicación lleve el foco ahí al cambiar de pantalla. */
export const ID_CONTENIDO = 'contenido-principal';

/* Por debajo de este ancho el menú lateral es un cajón (tokens.css). */
const ANCHO_MOVIL = 899;

export function AppShell({
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
  children,
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [tab, setTab] = useState('Todas');
  const [leidas, setLeidas] = useState({});
  /* La preferencia se recuerda entre sesiones: quien trabaja en pantallas
     pequeñas deja el menú replegado y no quiere repetir el gesto cada vez. */
  const [plegado, setPlegado] = useState(() => localStorage.getItem('hrl_menu') === 'plegado');
  /* En pantallas estrechas el menú no se pliega: es un cajón que se abre sobre
     el contenido. Estado aparte, para no tocar la preferencia de escritorio. */
  const [menuMovil, setMenuMovil] = useState(false);
  const [tema, setTema] = useState(() => readTheme(themeKey));

  /* Se aplica también en el primer render: el atributo vive en <html>, fuera
     del árbol de React. */
  useEffect(() => {
    applyTheme(tema, themeKey);
  }, [tema, themeKey]);

  /* Alto real de la barra superior (fila + título de página, con o sin migas
     ni subtítulo): un panel con lateral fijo lo necesita para anclar su propio
     `sticky` justo debajo, y ese alto cambia de un módulo a otro. Se mide en
     vez de adivinarlo, porque un valor fijo se desalinea en cuanto el título
     ocupa dos líneas o el módulo no trae subtítulo. Vive en <html>, fuera del
     árbol de React, igual que el atributo del tema. */
  const topbarRef = useRef(null);
  useEffect(() => {
    const el = topbarRef.current;
    if (!el) return undefined;
    const medir = () => {
      document.documentElement.style.setProperty('--hrl-topbar-h', `${el.offsetHeight}px`);
    };
    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(el);
    return () => ro.disconnect();
  }, [title, subtitle, breadcrumbs, banner]);

  const abierto = notifOpen || profileOpen;

  useEffect(() => {
    if (!menuMovil) return undefined;
    const alTeclear = (e) => {
      if (e.key === 'Escape') setMenuMovil(false);
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [menuMovil]);

  /* El enlace de salto mueve el foco al contenido sin tocar la URL: muchas
     aplicaciones usan el hash para sus rutas, y `#contenido-principal` las
     rompería. */
  const saltarAlContenido = (e) => {
    e.preventDefault();
    document.getElementById(ID_CONTENIDO)?.focus();
  };

  /* Antes del efecto que lo usa: `close` es una constante y no se iza. */
  const ocultar = useCallback(() => {
    setNotifOpen(false);
    setProfileOpen(false);
  }, []);
  const { leaving, close } = useExitAnimation(ocultar);

  useEffect(() => {
    if (!abierto) return undefined;
    const alTeclear = (e) => {
      if (e.key === 'Escape') close();
    };
    window.addEventListener('keydown', alTeclear);
    return () => window.removeEventListener('keydown', alTeclear);
  }, [abierto, close]);

  const lista = notifications.map((n) => ({ ...n, unread: n.unread && !leidas[n.id] }));
  const noLeidas = lista.filter((n) => n.unread).length;

  const cambiarTema = (siguiente) => setTema(siguiente);

  const esEstrecha = () => typeof window !== 'undefined' && window.matchMedia?.(`(max-width: ${ANCHO_MOVIL}px)`).matches;

  const alternarMenu = () => {
    if (esEstrecha()) {
      setMenuMovil((v) => !v);
      return;
    }
    setPlegado((v) => {
      localStorage.setItem('hrl_menu', v ? 'desplegado' : 'plegado');
      return !v;
    });
  };

  return (
    <div className="hrl-nuevo">
      <Sprite />
      <a className="hrl-saltar" href={`#${ID_CONTENIDO}`} onClick={saltarAlContenido}>
        Saltar al contenido
      </a>
      <div className={`hrl-shell${plegado ? ' hrl-shell--plegado' : ''}${menuMovil ? ' hrl-shell--menu-abierto' : ''}`}>
        <aside className="hrl-sidebar" aria-label="Menú principal">
          <div className="hrl-sidebar__logo">{logo === undefined ? LOGO_POR_DEFECTO : logo}</div>
          <SidebarNav
            navItems={navItems}
            active={active}
            onSelect={(id) => {
              setMenuMovil(false);
              onSelect?.(id);
            }}
            plegado={plegado}
          />
        </aside>
        {menuMovil && <button type="button" className="hrl-sidebar__velo" onClick={() => setMenuMovil(false)} aria-label="Cerrar el menú" />}

        <div className="hrl-main">
          <header className="hrl-topbar" ref={topbarRef}>
            <div className="hrl-topbar__row">
              {/* Sin tooltip a propósito: el gesto se explica solo y el aviso
                  estorbaba justo donde está el cursor al navegar. */}
              <button
                type="button"
                className={`hrl-plegar${plegado ? ' hrl-plegar--plegado' : ''}`}
                onClick={alternarMenu}
                aria-label={plegado ? 'Mostrar el menú lateral' : 'Replegar el menú lateral'}
                aria-expanded={menuMovil || !plegado}
              >
                <Icon name="sh-sidebar-collapse" size={18} />
              </button>
              {brand && <span className="hrl-topbar__brand">{brand}</span>}
              <div className="hrl-topbar__spacer" />
              {/* Ranura para las acciones del módulo activo. La llena el propio
                  módulo con un portal, para que la barra no tenga que saber
                  qué acciones existen en cada panel. */}
              <div className="hrl-topbar__acciones" id="hrl-acciones-modulo" />
              <button
                type="button"
                className={`hrl-bell${notifOpen ? ' hrl-bell--on' : ''}`}
                onClick={() => {
                  setNotifOpen((v) => !v);
                  setProfileOpen(false);
                }}
                aria-label={`Notificaciones${noLeidas ? `: ${noLeidas} sin leer` : ''}`}
              >
                <Icon name="sh-bell" size={21} />
                {noLeidas > 0 && <span className="hrl-bell__badge">{noLeidas}</span>}
              </button>
              <button
                type="button"
                className="hrl-avatar"
                onClick={() => {
                  setProfileOpen(true);
                  setNotifOpen(false);
                }}
                aria-label="Perfil"
              >
                {user?.avatar ? (
                  <img className="hrl-avatar__foto" src={user.avatar} alt="" />
                ) : (
                  <span className="hrl-avatar__initials">{iniciales(user?.name)}</span>
                )}
              </button>
            </div>
            {!banner && <PageHeader title={title} description={subtitle} breadcrumbs={breadcrumbs} actions={actions} />}
          </header>

          {/* `main`, con id y enfocable: es el destino del enlace de salto y adonde la
              aplicación debe llevar el foco al cambiar de pantalla. */}
          <main id={ID_CONTENIDO} tabIndex={-1} className={`hrl-content${panelLeaving ? ' hrl-content--saliendo' : ''}`}>
            {banner && (
              <PageBanner
                title={title}
                description={subtitle}
                breadcrumbs={breadcrumbs}
                clock={banner.clock}
                status={banner.status}
                mascot={banner.mascot}
                actions={banner.actions || actions ? <>{banner.actions}{actions}</> : null}
              />
            )}
            {children}
          </main>
        </div>

        {abierto && (
          <button
            type="button"
            className={`hrl-overlay${leaving ? ' hrl-overlay--saliendo' : ''}`}
            onClick={close}
            aria-label="Cerrar panel"
          />
        )}

        {notifOpen && (
          <NotificationsDrawer
            items={lista}
            tab={tab}
            onTab={setTab}
            onMarkAllRead={() => setLeidas(Object.fromEntries(notifications.map((n) => [n.id, true])))}
            onClose={close}
            leaving={leaving}
          />
        )}

        {profileOpen && (
          <ProfileDrawer
            user={user}
            onClose={close}
            onSignOut={onSignOut}
            leaving={leaving}
            tema={tema}
            onTema={cambiarTema}
          />
        )}
      </div>
    </div>
  );
}
