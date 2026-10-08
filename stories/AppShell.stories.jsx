import { useState } from 'react';
import { AppShell, Button, Card, Tooltip } from '../src/index.js';

export default { title: 'Layout / AppShell', meta: { fullscreen: true } };

const NAV = [
  { id: 'resumen', label: 'Resumen', icon: 'sh-pie' },
  { id: 'indicadores', label: 'Indicadores', icon: 'sh-lines', group: 'Análisis' },
  { id: 'calidad', label: 'Calidad de datos', icon: 'sh-check', group: 'Análisis', badge: 3 },
  { id: 'config', label: 'Configuración', icon: 'sh-gear', group: 'Sistema' },
];

const NOTIFICACIONES = [
  { id: '1', title: 'Nuevo aviso', body: 'Se encontraron 3 registros por revisar.', unread: true },
  { id: '2', title: 'Reporte generado', body: 'El reporte mensual ya está disponible.', unread: false },
];

/* Ejemplo mínimo, no una réplica de ningún sistema real: el shell no sabe de
   ningún dominio concreto, así que esta demo tampoco debería fingir que sí. */
export const Basico = () => {
  const [activo, setActivo] = useState('resumen');
  return (
    <div style={{ height: '100vh' }}>
      <AppShell
        navItems={NAV}
        active={activo}
        onSelect={setActivo}
        title="Resumen"
        brand="Sistema de ejemplo"
        user={{ name: 'Persona de prueba', role: 'Administración' }}
        notifications={NOTIFICACIONES}
        onSignOut={() => {}}
      >
        <Card title="Contenido de la vista">Aquí va el panel que corresponda a cada módulo.</Card>
      </AppShell>
    </div>
  );
};

/* El menú recuerda si estaba plegado (localStorage `hrl_menu`), así que la demo
   lo deja plegado antes de montar el shell. Al plegar, el logo pasa a ser solo
   el escudo y cada módulo queda a la misma altura que con el menú abierto:
   los rótulos de grupo se vuelven una línea del mismo alto. */
export const MenuPlegado = () => {
  const [listo] = useState(() => {
    try {
      localStorage.setItem('hrl_menu', 'plegado');
    } catch {
      /* Sin almacenamiento, el shell arranca abierto: se pliega con su botón. */
    }
    return true;
  });
  const [activo, setActivo] = useState('indicadores');
  return (
    listo && (
      <div style={{ height: '100vh' }}>
        <AppShell
          navItems={NAV}
          active={activo}
          onSelect={setActivo}
          title="Indicadores"
          brand="Sistema de ejemplo"
          user={{ name: 'Persona de prueba', role: 'Administración' }}
          notifications={NOTIFICACIONES}
          onSignOut={() => {}}
        >
          <Card title="Menú plegado">Use el botón de la barra superior para abrirlo y comparar las alturas.</Card>
        </AppShell>
      </div>
    )
  );
};

/* La cabecera en banda (`banner`): la vista se presenta con `PageBanner` al
   principio del contenido, en vez de `PageHeader` en la barra fija. En la
   portada lleva la mascota y la hora; el estado se dice una vez, con sus
   acciones. El avatar abre el cajón del perfil, donde están el modo oscuro y
   las preferencias de lectura (contraste, tamaño del texto, subrayar enlaces).
   Claves propias de la demo: lo que se elija aquí no se lleva a las demás
   historias. */
export const ConBanda = () => {
  const [activo, setActivo] = useState('resumen');
  return (
    <div style={{ height: '100vh' }}>
      <AppShell
        navItems={NAV}
        active={activo}
        onSelect={setActivo}
        title="Departamento de ejemplo"
        subtitle="Sábado, 3 de octubre de 2026"
        breadcrumbs={[{ label: 'Área' }, { label: 'Inicio' }]}
        brand="Sistema de ejemplo"
        themeKey="hrl_catalogo_theme"
        preferencesKey="hrl_catalogo_prefs"
        banner={{
          clock: true,
          mascot: 'idle',
          status: { icon: 'sh-clock', label: 'Pendiente de envío', detail: 'Reporte de septiembre · hasta el lunes 5 de octubre (quedan 2 días)' },
          actions: (
            <>
              <Tooltip title="Subir el archivo" body="Suba la plantilla del mes, llena, para que se revise.">
                <Button tone="cta" icon="sh-upload">Subir el archivo</Button>
              </Tooltip>
              <Tooltip title="Llenar a mano" body="Digite las cifras en los cuadros, sin archivo.">
                <Button tone="ghost" icon="sh-pencil">Llenar a mano</Button>
              </Tooltip>
            </>
          ),
        }}
        user={{ name: 'Persona de prueba', email: 'persona@ejemplo.pe', role: 'Jefatura de área' }}
        notifications={NOTIFICACIONES}
        onSignOut={() => {}}
      >
        <Card icon="sh-gear" accent="var(--primary)" title="Apariencia y accesibilidad">
          Abra el perfil (el avatar, arriba a la derecha) para cambiar el modo oscuro, el contraste, el tamaño del texto y
          el subrayado de los enlaces: la banda y el contenido cambian al instante.
        </Card>
      </AppShell>
    </div>
  );
};

/* Fuera de la portada, la banda dice solo el estado del módulo: sin mascota
   ni hora, y con una advertencia la etiqueta va sobre amarillo. */
export const ConBandaAviso = () => {
  const [activo, setActivo] = useState('indicadores');
  return (
    <div style={{ height: '100vh' }}>
      <AppShell
        navItems={NAV}
        active={activo}
        onSelect={setActivo}
        title="Cumplimiento del mes"
        subtitle="Qué áreas entregaron su reporte y cuáles faltan"
        breadcrumbs={[{ label: 'Análisis' }, { label: 'Indicadores' }]}
        brand="Sistema de ejemplo"
        themeKey="hrl_catalogo_theme"
        preferencesKey="hrl_catalogo_prefs"
        banner={{
          status: { icon: 'sh-warn', tone: 'warning', label: '7 de 10 áreas entregaron', detail: 'Septiembre de 2026 · 2 áreas tienen el plazo vencido' },
        }}
        user={{ name: 'Persona de prueba', role: 'Administración' }}
        notifications={NOTIFICACIONES}
        onSignOut={() => {}}
      >
        <Card title="Contenido de la vista">Aquí va el panel que corresponda a cada módulo.</Card>
      </AppShell>
    </div>
  );
};
