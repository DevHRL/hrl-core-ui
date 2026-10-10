import { PageHeader, Button } from '../src/index.js';

/* La cabecera clásica: la que AppShell dibuja en la barra superior cuando no
   recibe `banner`. Las vistas nuevas usan PageBanner (Layout / PageBanner). */
export default { title: 'Layout / PageHeader (clásica)' };

export const Basico = () => <PageHeader title="Indicadores" description="Resumen del periodo seleccionado" />;

export const Completo = () => (
  <PageHeader
    title="Calidad de datos"
    description="Registros pendientes de revisión"
    breadcrumbs={[{ label: 'Inicio', href: '#' }, { label: 'Calidad de datos' }]}
    actions={<Button icon="sh-export">Exportar</Button>}
  />
);
