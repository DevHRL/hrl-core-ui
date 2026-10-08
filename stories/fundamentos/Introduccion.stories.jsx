import { linkTo } from '@ladle/react';
import * as kit from '../../src/index.js';
import { Alert, Badge, Button, Card, ICONS, Mascot, PageBanner, StatCard } from '../../src/index.js';
import tokens from '../../tokens.json';
import pkg from '../../package.json';

export default { title: 'Fundamentos / Introducción' };

/* Las cifras se leen del propio kit, no se escriben a mano: la portada no
   puede quedarse desactualizada respecto a lo que realmente se publica. */
const componentes = new Set(
  Object.entries(kit)
    .filter(([nombre, valor]) => typeof valor === 'function' && /^[A-Z]/.test(nombre))
    .map(([, valor]) => valor),
).size;

/* Lo que trajo el rediseño, con la historia donde se ve cada pieza. Va en la
   portada para que quien abre el catálogo lo encuentre sin buscarlo. */
const NOVEDADES = [
  {
    titulo: 'Cabecera en banda',
    icono: 'sh-table',
    acento: 'var(--primary)',
    texto: 'La vista se presenta con PageBanner: el título a un lado y el estado del módulo —dicho una vez— con sus acciones al otro. En AppShell, con la prop banner.',
    historia: 'layout--appshell--con-banda',
    boton: 'Ver en una aplicación',
  },
  {
    titulo: 'Dr. Mochi, la mascota',
    icono: 'sh-ok',
    acento: 'var(--success)',
    texto: 'Mascot acompaña lo que el sistema está haciendo: espera, trabaja, termina bien o encontró algo. Siempre va junto a un texto que lo dice.',
    historia: 'primitivos--mascot--estados',
    boton: 'Ver sus estados',
    mascota: true,
  },
  {
    titulo: 'Preferencias de lectura',
    icono: 'sh-gear',
    acento: 'var(--info)',
    texto: 'Contraste (como el sistema, estándar o alto), tamaño del texto (100 a 150 %) y subrayar enlaces, en el cajón del perfil, junto al modo oscuro.',
    historia: 'fundamentos--preferencias--en-vivo',
    boton: 'Probarlas en vivo',
  },
];

const cantidadTokens = tokens.light.reduce((suma, grupo) => suma + Object.keys(grupo.tokens).length, 0);

export const Portada = () => (
  <div className="showroom-pagina">
    <header className="showroom-portada">
      <p className="showroom-sobretitulo">Hospital Regional de Loreto</p>
      <h1 className="showroom-titulo">Sistema de diseño HRL</h1>
      <p className="showroom-bajada">
        Los componentes y tokens con los que se construyen las aplicaciones del hospital. Una sola fuente de
        verdad para colores, tipografía y comportamiento, en modo claro y oscuro.
      </p>
      <div className="showroom-fila">
        <Button icon="sh-eye" onClick={linkTo('fundamentos--colores--paleta')}>Explorar el sistema</Button>
        <Badge label={`v${pkg.version}`} tone="none" />
      </div>
    </header>

    <section className="showroom-novedades" aria-labelledby="showroom-novedades-titulo">
      <h2 id="showroom-novedades-titulo" className="showroom-novedades__titulo">
        Novedades del rediseño <Badge label="Nuevo" tone="info" />
      </h2>
      <PageBanner
        title="Departamento de ejemplo"
        description="Así se presenta una vista en la portada de un área"
        breadcrumbs={[{ label: 'Área' }, { label: 'Inicio' }]}
        clock
        mascot="idle"
        status={{ icon: 'sh-clock', label: 'Pendiente de envío', detail: 'Reporte de septiembre · quedan 2 días' }}
        actions={<Button tone="cta" icon="sh-eye" onClick={linkTo('layout--appshell--con-banda')}>Verla en una aplicación</Button>}
      />
      <div className="showroom-principios">
        {NOVEDADES.map((n) => (
          <Card key={n.titulo} title={n.titulo} icon={n.icono} accent={n.acento}>
            <div className="showroom-principio showroom-novedad">
              {n.mascota && <Mascot state="done" size="sm" />}
              <p>{n.texto}</p>
              <Button tone="ghost" icon="sh-eye" onClick={linkTo(n.historia)}>{n.boton}</Button>
            </div>
          </Card>
        ))}
      </div>
    </section>

    <section className="showroom-cifras" aria-label="El sistema en cifras">
      <div className="showroom-cifra">
        <strong>{componentes}</strong>
        <span>componentes</span>
      </div>
      <div className="showroom-cifra">
        <strong>{cantidadTokens}</strong>
        <span>tokens de diseño</span>
      </div>
      <div className="showroom-cifra">
        <strong>{ICONS.length}</strong>
        <span>iconos</span>
      </div>
      <div className="showroom-cifra">
        <strong>AA</strong>
        <span>contraste WCAG verificado</span>
      </div>
    </section>

    <section className="showroom-principios">
      <Card title="Accesible por diseño">
        <div className="showroom-principio">
          <p>
            Cada par de texto y fondo se mide contra WCAG 2.1 AA en cada cambio. El color nunca es la única señal:
            siempre lo acompaña un icono o un texto.
          </p>
        </div>
      </Card>
      <Card title="Honesto con los datos">
        <div className="showroom-principio">
          <p>
            Un denominador cero no se muestra como 0 %, sino como «Sin datos». Los meses sin registro no se dibujan
            como ceros.
          </p>
        </div>
      </Card>
      <Card title="Un solo origen">
        <div className="showroom-principio">
          <p>
            Los colores, radios, sombras y tipografía salen de un único archivo de tokens. Cambiarlos ahí cambia
            todos los componentes a la vez.
          </p>
        </div>
      </Card>
    </section>

    <Card title="Un vistazo" subtitle="Algunos de los componentes, tal como se ven en las aplicaciones">
      <div style={{ display: 'grid', gap: 16 }}>
        <div className="showroom-fila">
          <Badge label="Normal" tone="ok" />
          <Badge label="Por revisar" tone="warn" />
          <Badge label="Crítico" tone="crit" />
          <Badge label="Informativo" tone="info" />
          <Badge label="Sin dato" tone="none" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
          <StatCard label="En rango" value="82 %" severity="normal" info="Ejemplo de indicador dentro de su meta" />
          <StatCard label="Por revisar" value="12 %" severity="suspect" info="Ejemplo de indicador en observación" />
          <StatCard label="Sin datos" value="—" severity="nodata" info="Sin denominador no se muestra un 0 %" />
        </div>
        <Alert tone="info" title="Modo claro y oscuro">
          Cambia el tema desde la barra superior del catálogo: todos los componentes lo siguen.
        </Alert>
      </div>
    </Card>
  </div>
);
