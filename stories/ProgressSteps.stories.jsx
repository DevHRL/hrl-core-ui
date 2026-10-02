import { useState } from 'react';
import { Button, ProgressSteps, Stack } from '../src/index.js';

export default { title: 'Primitivos / ProgressSteps' };

const PASOS = ['subir', 'revisar', 'enviar'];

/* No se pulsa: avanzar lo hacen los botones de cada paso. */
export const Recorrido = () => {
  const [i, setI] = useState(1);
  const estado = (n) => (n < i ? 'ok' : 'empty');
  return (
    <Stack gap={5}>
      <ProgressSteps
        label="Pasos del reporte"
        active={PASOS[i]}
        steps={[
          { key: 'subir', title: 'Subir el archivo', note: n(0, i, 'reporte.xlsx', 'La plantilla del mes'), status: estado(0) },
          { key: 'revisar', title: 'Revisar y resolver', note: n(1, i, 'Listo para enviar', 'Pendiente'), status: estado(1) },
          { key: 'enviar', title: 'Enviar', note: 'A la oficina responsable', status: estado(2) },
        ]}
      />
      <Stack direction="row" gap={3}>
        <Button tone="ghost" disabled={i === 0} onClick={() => setI(i - 1)}>
          Anterior
        </Button>
        <Button disabled={i === PASOS.length - 1} onClick={() => setI(i + 1)}>
          Siguiente
        </Button>
      </Stack>
    </Stack>
  );
};

function n(paso, actual, hecho, pendiente) {
  return paso < actual ? hecho : pendiente;
}

export const ConErroresYPendientes = () => (
  <ProgressSteps
    active="revisar"
    steps={[
      { key: 'subir', title: 'Subir el archivo', note: 'reporte.xlsx', status: 'ok' },
      { key: 'revisar', title: 'Revisar y resolver', note: '3 errores por corregir', status: 'error' },
      { key: 'enviar', title: 'Enviar', note: 'Faltan 2 justificaciones', status: 'partial' },
    ]}
  />
);
