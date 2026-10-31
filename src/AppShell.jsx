import { memo, useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Sprite, Icon } from './icons.jsx';
import { EmptyState } from './EmptyState.jsx';
import { HrlLogo } from './HrlLogo.jsx';
import { PageHeader } from './PageHeader.jsx';
import { Tooltip } from './Tooltip.jsx';
import { readTheme, applyTheme } from './theme.js';
import { usePreferences, PREFERENCE_DEFAULTS } from './preferences.js';
import { SegmentedControl } from './SegmentedControl.jsx';
import { Switch } from './Switch.jsx';
import { Button } from './Button.jsx';
import { useExitAnimation } from './useExitAnimation.js';

const TABS_NOTIF = ['Todas', 'No leídas', 'Archivadas'];

/* Marca por defecto: el escudo del hospital en su baldosa y, al lado, el
   hospital y el nombre del sistema (`brand`) en dos líneas. Con el menú
   plegado queda solo el escudo: el CSS esconde los textos, así plegar no
   vuelve a pintar el árbol. */
function MarcaPorDefecto({ brand }) {
  return (
    <span className="hrl-marca">
      <span className="hrl-marca__escudo">
        <HrlLogo variant="mark" width={30} />
      </span>
      <span className="hrl-marca__textos">
        <span className="hrl-marca__hospital">Hospital Regional de Loreto</span>
        {brand && <span className="hrl-marca__sistema">{brand}</span>}
      </span>
    </span>
  );
}

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

/* Un grupo desplegable se abre solo cuando la pantalla activa cae dentro: si
   quedara cerrado, el menú escondería dónde está el usuario. Cerrarlo después
   es decisión suya y se respeta hasta que vuelva a entrar desde fuera. */
function useGruposAbiertos(navItems, active, collapsibleGroups) {
  const grupoActivo = navItems.find((n) => n.id === active)?.group ?? null;
  const [abiertos, setAbiertos] = useState(() => new Set(grupoActivo ? [grupoActivo] : []));
  const [ultimoActivo, setUltimoActivo] = useState(grupoActivo);
  if (grupoActivo !== ultimoActivo) {
    setUltimoActivo(grupoActivo);
    if (grupoActivo && collapsibleGroups.includes(grupoActivo) && !abiertos.has(grupoActivo)) {
      setAbiertos(new Set(abiertos).add(grupoActivo));
    }
  }
  const alternar = useCallback((titulo) => {
    setAbiertos((prev) => {
      const sig = new Set(prev);
      if (sig.has(titulo)) sig.delete(titulo);
      else sig.add(titulo);
      return sig;
    });
  }, []);
  return [abiertos, alternar];
}

/* Memorizado: el AppShell se vuelve a pintar por cosas que no son del menú
   (abrir un cajón, plegar) y el menú solo cambia con sus propias props. */
const SidebarNav = memo(function SidebarNav({ navItems, active, onSelect, plegado, collapsibleGroups = [] }) {
  const [abiertos, alternar] = useGruposAbiertos(navItems, active, collapsibleGroups);
  const idBase = useId();
  return (
    <nav className="hrl-sidebar__nav">
      {agrupar(navItems).map((sec, i) => {
        /* Plegado, el rótulo es solo una línea y no hay dónde hacer clic: los
           iconos del grupo se muestran todos, como en un grupo normal. */
        const desplegable = !plegado && sec.title && collapsibleGroups.includes(sec.title);
        const abierto = !desplegable || abiertos.has(sec.title);
        const idLista = `${idBase}-g${i}`;
        return (
        <div className={`hrl-sidebar__group${desplegable ? ' hrl-sidebar__group--desplegable' : ''}`} key={sec.title || `g-${i}`}>
          {desplegable ? (
            <button
              type="button"
              className="hrl-sidebar__group-toggle"
              aria-expanded={abierto}
              aria-controls={idLista}
              onClick={() => alternar(sec.title)}
            >
              <span className="hrl-sidebar__group-label">{sec.title}</span>
              <Icon name="sh-chevron-down" size={16} className="hrl-sidebar__group-chevron" />
            </button>
          ) : (
            sec.title && <div className="hrl-sidebar__group-label">{sec.title}</div>
          )}
          <div className="hrl-sidebar__group-items" id={idLista} hidden={!abierto}>
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
        </div>
        );
      })}
    </nav>
  );
});

/* La cabecera no depende de que el menú esté plegado: sin memo, cada plegado
   la volvía a pintar entera (con el reloj). */
const CabeceraMemo = memo(PageHeader);

/* El menú cambia de ancho por CSS; el contenido no se anima con su margen
   (ver .hrl-main en tokens.css) sino deslizándose: el margen ya cambió de
   golpe, y el contenido arranca desplazado lo que cambió el menú y vuelve a su
   sitio. Solo `transform`, que el navegador compone sin recolocar nada.
   La animación no deja estilo al terminar (sin `fill`): un `transform` que se
   quedara puesto convertiría al contenido en bloque contenedor de cualquier
   `position: fixed` de dentro (§ 3.1 del contrato). */
function deslizarContenido(main, desde) {
  if (!main || !desde || typeof main.animate !== 'function') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  const estilo = getComputedStyle(main);
  const duracion = parseFloat(estilo.getPropertyValue('--hrl-menu-duracion')) || 280;
  const curva = estilo.getPropertyValue('--ease').trim() || 'ease-out';
  main.getAnimations?.().forEach((a) => a.cancel());
  main.animate([{ transform: `translateX(${desde}px)` }, { transform: 'none' }], { duration: duracion, easing: curva });
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

const CONTRASTES = [
  { value: 'system', label: 'Sistema', ariaLabel: 'Como el sistema' },
  { value: 'standard', label: 'Estándar' },
  { value: 'high', label: 'Alto' },
];
const NOMBRE_CONTRASTE = { system: 'como el sistema', standard: 'estándar', high: 'alto' };
const TAMANOS_TEXTO = [1, 1.15, 1.3, 1.5];
const porcentaje = (n) => `${Math.round(n * 100)} %`;

/* Apariencia y accesibilidad: modo oscuro, contraste, tamaño del texto y
   subrayado de enlaces. Todo se aplica al instante —el cambio es su propia
   vista previa— y una región aria-live dice qué cambió sin mover el foco. */
function Preferencias({ tema, onTema, prefs, onPrefs, onRestablecer }) {
  const [anuncio, setAnuncio] = useState('');
  const cambiado = Object.keys(PREFERENCE_DEFAULTS).some((k) => prefs[k] !== PREFERENCE_DEFAULTS[k]);

  return (
    <section className="hrl-pref" aria-labelledby="hrl-pref-titulo">
      <h2 className="hrl-pref__seccion" id="hrl-pref-titulo">Apariencia y accesibilidad</h2>

      <InterruptorTema tema={tema} onCambiar={onTema} />

      <div className="hrl-pref__opcion">
        <p className="hrl-pref__nombre">Contraste</p>
        <p className="hrl-pref__ayuda">Texto y bordes más marcados. Útil con poca vista o con una pantalla con reflejos.</p>
        <SegmentedControl
          label="Contraste"
          options={CONTRASTES}
          value={prefs.contrast}
          onChange={(v) => {
            onPrefs({ contrast: v });
            setAnuncio(`Contraste ${NOMBRE_CONTRASTE[v]}`);
          }}
        />
      </div>

      <div className="hrl-pref__opcion">
        <p className="hrl-pref__nombre">
          Tamaño del texto <span className="hrl-pref__valor">{porcentaje(prefs.textScale)}</span>
        </p>
        <p className="hrl-pref__ayuda">Agranda el texto de toda la interfaz. Para agrandar también los controles, use el zoom del navegador.</p>
        <SegmentedControl
          label="Tamaño del texto"
          options={TAMANOS_TEXTO.map((n) => ({
            value: n,
            ariaLabel: `Texto al ${porcentaje(n)}`,
            /* Cada «A» se ve al tamaño que produce, sin importar el actual. */
            label: <span aria-hidden="true" style={{ fontSize: `calc(var(--text-md, 14px) * ${n} / var(--hrl-escala-texto, 1))` }}>A</span>,
          }))}
          value={prefs.textScale}
          onChange={(v) => {
            onPrefs({ textScale: v });
            setAnuncio(`Texto al ${porcentaje(v)}`);
          }}
        />
      </div>

      <Switch
        label="Subrayar enlaces"
        description={prefs.underlineLinks ? 'Los enlaces se subrayan' : 'Los enlaces se distinguen por su color'}
        checked={prefs.underlineLinks}
        onChange={(v) => {
          onPrefs({ underlineLinks: v });
          setAnuncio(v ? 'Enlaces subrayados' : 'Enlaces sin subrayar');
        }}
      />

      {cambiado && (
        <Button
          tone="link"
          className="hrl-pref__restablecer"
          onClick={() => {
            onRestablecer();
            setAnuncio('Apariencia restablecida');
          }}
        >
          Restablecer
        </Button>
      )}
      <p className="hrl-oculto-visual" aria-live="polite">{anuncio}</p>
    </section>
  );
}

function ProfileDrawer({ user, onClose, onSignOut, leaving, tema, onTema, prefs, onPrefs, onRestablecer }) {
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
        <Preferencias tema={tema} onTema={onTema} prefs={prefs} onPrefs={onPrefs} onRestablecer={onRestablecer} />
      </div>

      <div className="hrl-profile__foot">
        <button type="button" className="hrl-signout" onClick={onSignOut}>
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}

/* Layout maestro: menú lateral replegable con el perfil al pie, barra superior
   (replegar, acción principal, vistas al centro, notificaciones y menú de la
   cuenta), cajones de notificaciones y de perfil, y la cabecera de la página al
   principio del contenido. Todo lo que muestra llega por props; no consulta
   nada.

     navItems  { id, label, icon, group?, badge?, href? }[]
     collapsibleGroups  títulos de `group` que se pliegan y despliegan con un
               clic en su rótulo; se abren solos si contienen la pantalla
               activa. Pásalo como constante: el menú está memorizado
     user      { name, email?, role?, avatar? }: se muestra al pie del menú
               lateral, y al pulsarlo se abre el cajón del perfil
     logo      nodo libre para la marca; si se omite, el escudo del hospital con
               su nombre y el de `brand`. `logo={null}` deja el menú sin marca
     brand     nombre del sistema, bajo el del hospital; el kit no lo sabe
     title, subtitle, breadcrumbs
               la cabecera de la página (PageHeader): el título grande, el
               mensaje debajo y, al otro lado, la ruta
     date      la fecha que la cabecera muestra bajo la ruta («Sábado, 31 de
               octubre de 2026»); la decide la aplicación, que sabe qué día es
               para ella
     actions   controles junto al estado de la cabecera (y destino de PageActions)
     banner    { status?, actions?, clock?, mascot? }: el estado de la vista
               (icono, etiqueta, detalle y tono), sus acciones y la hora junto a
               la fecha. `mascot` se acepta y por ahora no se dibuja: la nueva
               cabecera ya no lleva la banda verde con la mascota
     primaryAction  { icon, label, description?, onClick }: la acción de crear
               del sistema, en el botón verde agua al inicio de la barra
     tabs      { items: { id, label }[], active, onSelect, label? }: las vistas
               de la sección, en la píldora del centro de la barra
     themeKey  clave con la que se recuerda el modo oscuro
     preferencesKey  clave de contraste, tamaño del texto y subrayado de
               enlaces (usePreferences); por defecto, la de themeKey con «_prefs» */
/* El id del contenido principal: el destino del enlace «Saltar al contenido».
   Exportado para que la aplicación lleve el foco ahí al cambiar de pantalla. */
export const ID_CONTENIDO = 'contenido-principal';

/* Por debajo de este ancho el menú lateral es un cajón (tokens.css). */
const ANCHO_MOVIL = 899;

/* Las vistas de la sección, al centro de la barra: una píldora con la activa
   rellena. Es navegación (enlaces o botones con aria-current), no un grupo de
   pestañas con paneles: cada vista es una pantalla con su propia dirección. */
function VistasBarra({ tabs }) {
  const items = tabs?.items ?? [];
  const ref = useRef(null);
  /* Con muchas vistas la píldora se desplaza de lado: la activa se trae a la
     parte visible, o quien entra a «Epidemiología» no vería cuál está abierta. */
  useEffect(() => {
    const activa = ref.current?.querySelector('[aria-current="page"]');
    const nav = ref.current;
    if (!activa || !nav || nav.scrollWidth <= nav.clientWidth) return;
    nav.scrollLeft = activa.offsetLeft - (nav.clientWidth - activa.offsetWidth) / 2;
  }, [tabs?.active]);
  if (items.length < 2) return <div className="hrl-topbar__spacer" />;
  return (
    <nav className="hrl-vistas" ref={ref} aria-label={tabs.label ?? 'Vistas de la sección'}>
      {items.map((v) => {
        const activa = v.id === tabs.active;
        const Etiqueta = v.href ? 'a' : 'button';
        return (
          <Etiqueta
            key={v.id}
            type={v.href ? undefined : 'button'}
            href={v.href}
            className={`hrl-vistas__item${activa ? ' hrl-vistas__item--on' : ''}`}
            aria-current={activa ? 'page' : undefined}
            onClick={() => tabs.onSelect?.(v.id)}
          >
            {v.label}
          </Etiqueta>
        );
      })}
    </nav>
  );
}

export function AppShell({
  navItems = [],
  collapsibleGroups,
  active,
  onSelect,
  title,
  subtitle,
  breadcrumbs,
  date,
  actions,
  banner,
  primaryAction,
  tabs,
  user,
  logo,
  brand,
  themeKey,
  preferencesKey,
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
  const [prefs, cambiarPrefs, restablecerPrefs] = usePreferences(preferencesKey ?? `${themeKey ?? 'hrl_theme'}_prefs`);

  /* Se aplica también en el primer render: el atributo vive en <html>, fuera
     del árbol de React. */
  useEffect(() => {
    applyTheme(tema, themeKey);
  }, [tema, themeKey]);

  /* Alto real de la barra superior: un panel con lateral fijo lo necesita para
     anclar su propio `sticky` justo debajo. Se mide en vez de adivinarlo,
     porque la barra baja a dos filas en pantallas medianas (las vistas pasan
     debajo). Vive en <html>, fuera del árbol de React, igual que el tema. */
  const topbarRef = useRef(null);
  const mainRef = useRef(null);
  /* Dónde empezaba el contenido antes de plegar o desplegar: se mide en el
     momento del clic, así vale aunque un sistema cambie el ancho del menú. */
  const inicioContenido = useRef(null);
  useLayoutEffect(() => {
    const main = mainRef.current;
    if (inicioContenido.current == null || !main) return;
    const desde = inicioContenido.current - main.getBoundingClientRect().left;
    inicioContenido.current = null;
    deslizarContenido(main, desde);
  }, [plegado]);
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
  }, []);

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

  /* Quien abrió un cajón recupera el foco al cerrarlo (§ 3.1): el perfil se
     abre desde el pie del menú o desde la barra, y la campana desde la barra. */
  const disparador = useRef(null);

  /* Antes del efecto que lo usa: `close` es una constante y no se iza. */
  const ocultar = useCallback(() => {
    setNotifOpen(false);
    setProfileOpen(false);
    const el = disparador.current;
    disparador.current = null;
    if (el && typeof el.focus === 'function') requestAnimationFrame(() => el.focus());
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
    inicioContenido.current = mainRef.current?.getBoundingClientRect().left ?? null;
    setPlegado((v) => {
      localStorage.setItem('hrl_menu', v ? 'desplegado' : 'plegado');
      return !v;
    });
  };

  /* Estable entre pintadas, para que el menú memorizado no se repinte. */
  const alElegir = useCallback(
    (id) => {
      setMenuMovil(false);
      onSelect?.(id);
    },
    [onSelect],
  );

  const abrirPerfil = (e) => {
    disparador.current = e?.currentTarget ?? null;
    setMenuMovil(false);
    setProfileOpen(true);
    setNotifOpen(false);
  };

  /* Un fragmento nuevo en cada pintada anularía el memo de la cabecera. */
  const accionesCabecera = useMemo(
    () => (banner?.actions || actions ? <>{banner?.actions}{actions}</> : null),
    [banner, actions],
  );

  const marca = logo === undefined ? <MarcaPorDefecto brand={brand} /> : logo;
  const nombreCuenta = user?.name ?? 'Sin sesión';
  const detalleCuenta = user?.role ?? user?.email;

  return (
    <div className="hrl-nuevo">
      <Sprite />
      <a className="hrl-saltar" href={`#${ID_CONTENIDO}`} onClick={saltarAlContenido}>
        Saltar al contenido
      </a>
      <div className={`hrl-shell${plegado ? ' hrl-shell--plegado' : ''}${menuMovil ? ' hrl-shell--menu-abierto' : ''}`}>
        <aside className="hrl-sidebar" aria-label="Menú principal">
          {marca && <div className="hrl-sidebar__logo">{marca}</div>}
          <SidebarNav navItems={navItems} active={active} onSelect={alElegir} plegado={plegado} collapsibleGroups={collapsibleGroups} />
          {user && (
            <div className="hrl-sidebar__pie">
              {/* El perfil vive aquí, al pie del menú: abre el cajón con la
                  apariencia, la accesibilidad y el cierre de sesión. Plegado,
                  queda el avatar y el nombre pasa al tooltip. */}
              <Tooltip
                as="div"
                style={{ display: 'block', width: '100%' }}
                focusable={false}
                title={nombreCuenta}
                body={detalleCuenta ? `${detalleCuenta} · abre el perfil, la apariencia y el cierre de sesión` : 'Abre el perfil, la apariencia y el cierre de sesión'}
              >
                <button type="button" className="hrl-cuenta" onClick={abrirPerfil} aria-label={`Perfil de ${nombreCuenta}`}>
                  <span className="hrl-cuenta__avatar" aria-hidden="true">
                    {user.avatar ? <img className="hrl-avatar__foto" src={user.avatar} alt="" /> : iniciales(user.name)}
                  </span>
                  <span className="hrl-cuenta__textos">
                    <span className="hrl-cuenta__nombre">{nombreCuenta}</span>
                    {detalleCuenta && <span className="hrl-cuenta__detalle">{detalleCuenta}</span>}
                  </span>
                </button>
              </Tooltip>
            </div>
          )}
        </aside>
        {menuMovil && <button type="button" className="hrl-sidebar__velo" onClick={() => setMenuMovil(false)} aria-label="Cerrar el menú" />}

        <div className="hrl-main" ref={mainRef}>
          <header className="hrl-topbar" ref={topbarRef}>
            <div className="hrl-topbar__row">
              <div className="hrl-topbar__inicio">
                {/* Sin tooltip a propósito: el gesto se explica solo y el aviso
                    estorbaba justo donde está el cursor al navegar. */}
                <button
                  type="button"
                  className={`hrl-barra-boton hrl-plegar${plegado ? ' hrl-plegar--plegado' : ''}`}
                  onClick={alternarMenu}
                  aria-label={plegado ? 'Mostrar el menú lateral' : 'Replegar el menú lateral'}
                  aria-expanded={menuMovil || !plegado}
                >
                  <Icon name="sh-sidebar-collapse" size={19} />
                </button>
                {primaryAction && (
                  <Tooltip title={primaryAction.label} body={primaryAction.description ?? primaryAction.label} focusable={false}>
                    <button type="button" className="hrl-barra-boton hrl-barra-boton--primario" onClick={primaryAction.onClick} aria-label={primaryAction.label}>
                      <Icon name={primaryAction.icon ?? 'sh-plus'} size={20} />
                    </button>
                  </Tooltip>
                )}
              </div>

              <VistasBarra tabs={tabs} />

              <div className="hrl-topbar__fin">
                {/* Ranura para controles del módulo activo. La llena el propio
                    módulo con un portal, para que la barra no tenga que saber
                    qué controles existen en cada panel. */}
                <div className="hrl-topbar__acciones" id="hrl-acciones-modulo" />
                <Tooltip
                  title="Notificaciones"
                  body={noLeidas ? `${noLeidas} sin leer. Avisos que el sistema deriva de lo que pasa ahora: plazos, envíos, observaciones.` : 'Avisos que el sistema deriva de lo que pasa ahora: plazos, envíos, observaciones.'}
                  focusable={false}
                >
                  <button
                    type="button"
                    className={`hrl-barra-boton hrl-bell${notifOpen ? ' hrl-bell--on' : ''}`}
                    onClick={(e) => {
                      disparador.current = e.currentTarget;
                      setNotifOpen((v) => !v);
                      setProfileOpen(false);
                    }}
                    aria-label={`Notificaciones${noLeidas ? `: ${noLeidas} sin leer` : ''}`}
                  >
                    <Icon name="sh-bell" size={19} />
                    {noLeidas > 0 && <span className="hrl-bell__badge">{noLeidas}</span>}
                  </button>
                </Tooltip>
                <Tooltip title="Menú de la cuenta" body="Perfil, modo oscuro, tamaño del texto, contraste y cierre de sesión." focusable={false}>
                  <button type="button" className="hrl-barra-boton" onClick={abrirPerfil} aria-label="Abrir el menú de la cuenta">
                    <Icon name="sh-lines" size={19} />
                  </button>
                </Tooltip>
              </div>
            </div>
          </header>

          {/* `main`, con id y enfocable: es el destino del enlace de salto y adonde la
              aplicación debe llevar el foco al cambiar de pantalla. */}
          <main id={ID_CONTENIDO} tabIndex={-1} className={`hrl-content${panelLeaving ? ' hrl-content--saliendo' : ''}`}>
            {title && (
              <CabeceraMemo
                title={title}
                description={subtitle}
                breadcrumbs={breadcrumbs}
                date={date}
                clock={banner?.clock}
                status={banner?.status}
                actions={accionesCabecera}
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
            prefs={prefs}
            onPrefs={cambiarPrefs}
            onRestablecer={restablecerPrefs}
          />
        )}
      </div>
    </div>
  );
}
