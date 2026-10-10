import {
  Badge,
  Button,
  Card,
  FilterBar,
  IconButton,
  Input,
  PageBanner,
  PaginatedTable,
  SeriesBars,
  StatCard,
} from '../../src/index.js';

/* Una vista completa armada solo con componentes del kit. Los datos son de
   ejemplo y genéricos a propósito: el catálogo enseña el sistema de diseño,
   no ningún sistema concreto. */

const REGISTROS = [
  { id: 'R-0142', servicio: 'Consulta externa', estado: 'ok', fecha: '2026-09-12' },
  { id: 'R-0143', servicio: 'Laboratorio', estado: 'warn', fecha: '2026-09-12' },
  { id: 'R-0144', servicio: 'Imagenología', estado: 'ok', fecha: '2026-09-13' },
  { id: 'R-0145', servicio: 'Emergencia', estado: 'crit', fecha: '2026-09-14' },
  { id: 'R-0146', servicio: 'Consulta externa', estado: 'ok', fecha: '2026-09-15' },
  { id: 'R-0147', servicio: 'Laboratorio', estado: 'none', fecha: '2026-09-15' },
];

const ROTULO = { ok: 'Completo', warn: 'Por revisar', crit: 'Con error', none: 'Sin dato' };

const COLUMNAS = [
  { key: 'id', label: 'Registro', render: (f) => <a href={`#${f.id}`}>{f.id}</a> },
  { key: 'servicio', label: 'Servicio' },
  { key: 'estado', label: 'Estado', render: (f) => <Badge label={ROTULO[f.estado]} tone={f.estado} /> },
  { key: 'fecha', label: 'Fecha', render: (f) => <span className="hrl-mono">{f.fecha}</span> },
  {
    key: 'acciones',
    label: '',
    align: 'right',
    render: (f) => <IconButton icon="sh-eye" aria-label={`Ver registro ${f.id}`} />,
  },
];

const MESES = [
  { label: 'abr', value: 64 },
  { label: 'may', value: 71 },
  { label: 'jun', value: 68 },
  { label: 'jul', value: 79 },
  { label: 'ago', value: 84 },
  { label: 'sep', value: null },
];

export function PanelEjemplo() {
  return (
    <div style={{ display: 'grid', gap: 24 }}>
      <PageBanner
        title="Resumen del periodo"
        description="Una vista de ejemplo construida solo con componentes del sistema de diseño."
        breadcrumbs={[{ label: 'Inicio', href: '#' }, { label: 'Resumen' }]}
        mascot="done"
        status={{ icon: 'sh-ok', label: '5 de 6 registros completos', detail: 'Septiembre de 2026 · uno por revisar' }}
        actions={<Button tone="cta" icon="sh-export">Exportar</Button>}
      />

      <FilterBar
        actions={
          <>
            <Button>Consultar</Button>
            <Button tone="ghost">Limpiar</Button>
          </>
        }
        footer={<span>La consulta se acota al último mes cerrado.</span>}
      >
        <Input label="Desde" kind="date" value="2026-04-01" onChange={() => {}} />
        <Input label="Hasta" kind="date" value="2026-09-15" onChange={() => {}} />
        <Input
          label="Servicio"
          kind="select"
          value="todos"
          onChange={() => {}}
          options={[{ value: 'todos', label: 'Todos los servicios' }]}
        />
      </FilterBar>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <StatCard label="Cobertura" value="82 %" percent={82} severity="normal" info="Registros completos sobre el total esperado" />
        <StatCard label="Oportunidad" value="64 %" percent={64} severity="suspect" info="Registros cargados dentro del plazo" />
        <StatCard label="Con error" value="6 %" percent={6} severity="abnormal" info="Registros con al menos una inconsistencia" />
        <StatCard label="Sin cierre" value="—" severity="nodata" info="Sin denominador no se muestra un 0 %" />
      </div>

      <Card title="Registros por mes" subtitle="El mes en curso todavía no tiene cierre y no se dibuja como cero">
        <SeriesBars points={MESES} unit="registros" emptyTail="Sin cierre" label="Registros por mes" />
      </Card>

      <Card title="Registros recientes" total={String(REGISTROS.length)}>
        <PaginatedTable columns={COLUMNAS} rows={REGISTROS} legend="Datos de ejemplo" />
      </Card>
    </div>
  );
}
