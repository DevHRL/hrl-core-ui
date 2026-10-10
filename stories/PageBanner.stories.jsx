import { Button, PageBanner } from '../src/index.js';

export default { title: 'Layout / PageBanner' };

const MIGAS = [{ label: 'Área' }, { label: 'Inicio' }];

/* La portada de un área: la fecha y la hora bajo el título, la mascota junto
   al estado y las dos acciones. */
export const Portada = () => (
  <PageBanner
    title="Departamento de ejemplo"
    description="Sábado, 3 de octubre de 2026"
    breadcrumbs={MIGAS}
    clock
    mascot="idle"
    status={{ icon: 'sh-clock', label: 'Pendiente de envío', detail: 'Reporte de septiembre · hasta el lunes 5 de octubre (quedan 2 días)' }}
    actions={
      <>
        <Button tone="cta" icon="sh-upload">Subir el archivo</Button>
        <Button tone="ghost" icon="sh-pencil">Llenar a mano</Button>
      </>
    }
  />
);

/* Un plazo que vence hoy: la etiqueta va sobre amarillo y lo dice. */
export const Aviso = () => (
  <PageBanner
    title="Departamento de ejemplo"
    description="Lunes, 5 de octubre de 2026"
    breadcrumbs={MIGAS}
    clock
    mascot="thinking"
    status={{ icon: 'sh-warn', label: 'Vence hoy', detail: 'Reporte de septiembre · último día del plazo', tone: 'warning' }}
    actions={<Button tone="cta" icon="sh-upload">Subir el archivo</Button>}
  />
);

/* Cualquier otra vista: sin mascota ni hora, solo información y acciones. */
export const Vista = () => (
  <PageBanner
    title="Historial de reportes"
    description="Periodos anteriores, su estado, su puntualidad y sus constancias"
    breadcrumbs={[{ label: 'Área' }, { label: 'Historial' }]}
    status={{ icon: 'sh-ok', label: '8 reportes enviados', detail: 'Enero a agosto de 2026 · todos dentro del plazo' }}
    actions={<Button tone="cta" icon="sh-export">Exportar</Button>}
  />
);

/* Solo el título: sin estado ni acciones, la banda queda como presentación. */
export const SoloTitulo = () => (
  <PageBanner title="Matriz de destinos" description="Qué oficina recibe el reporte de cada área, y por qué" breadcrumbs={[{ label: 'Estadística' }, { label: 'Matriz' }]} />
);

/* Para probarla: estado de la mascota, tono del estado, hora y acciones. */
export const Banco = ({ mascota, aviso, reloj, acciones }) => (
  <PageBanner
    title="Departamento de ejemplo"
    description="Sábado, 3 de octubre de 2026"
    breadcrumbs={MIGAS}
    clock={reloj}
    mascot={mascota === 'ninguna' ? undefined : mascota}
    status={
      aviso
        ? { icon: 'sh-warn', label: 'Vence hoy', detail: 'Reporte de septiembre · último día del plazo', tone: 'warning' }
        : { icon: 'sh-clock', label: 'Pendiente de envío', detail: 'Reporte de septiembre · quedan 2 días' }
    }
    actions={
      acciones && (
        <>
          <Button tone="cta" icon="sh-upload">Subir el archivo</Button>
          <Button tone="ghost" icon="sh-pencil">Llenar a mano</Button>
        </>
      )
    }
  />
);

Banco.args = { mascota: 'idle', aviso: false, reloj: true, acciones: true };
Banco.argTypes = {
  mascota: { control: { type: 'select' }, options: ['ninguna', 'idle', 'thinking', 'done', 'problem', 'sleeping'] },
};
