import { Badge, Button, Card, Mosaic, DataTable } from '../src/index.js';

export default { title: 'Primitivos / Card' };

export const Basica = () => <Card title="Sección">Contenido de la sección.</Card>;

export const ConSubtituloYTotal = () => (
  <Card title="Registros en revisión" subtitle="Últimos 30 días" total="128" icon="sh-doc">
    Contenido de la sección.
  </Card>
);

/* La banda completa: icono, título, estado y acción a la misma altura. */
export const EnBanda = () => (
  <Card
    icon="sh-calendar"
    title="Reporte del mes"
    subtitle="Todavía no se cargó nada. Suba el archivo del mes."
    meta={<Badge label="Plazo vencido" tone="warn" />}
    actions={<Button icon="sh-upload">Subir el archivo</Button>}
  />
);

export const ConAcciones = () => (
  <Card title="Producción" icon="sh-chart" actions={<Button size="sm" tone="ghost">Ver todo</Button>}>
    Contenido de la sección.
  </Card>
);

/* El mosaico decide solo: las dos cortas lado a lado, la tabla a lo ancho, y
   la corta que queda sola se estira. */
export const EnMosaico = () => (
  <Mosaic>
    <Card icon="sh-calendar" title="Periodo en curso" subtitle="Agosto" meta={<Badge label="En llenado" />} />
    <Card icon="sh-chart" title="Sin meses enviados" subtitle="Aquí aparecerá el historial." />
    <Card icon="sh-table" title="Detalle" flush>
      <DataTable columns={[{ key: 'a', label: 'Área' }, { key: 'b', label: 'Estado' }]} rows={[{ a: 'Farmacia', b: 'Enviado' }]} />
    </Card>
    <Card icon="sh-info" title="Una tarjeta sola" subtitle="Ocupa la fila entera porque no tiene pareja." />
  </Mosaic>
);
