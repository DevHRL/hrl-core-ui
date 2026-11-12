import { useState } from 'react';
import { Avatar, CapacityMeter, DayTimeline, ScheduleGrid, SlotGrid, Stack } from '../src/index.js';

export default { title: 'Datos / Agenda' };

/* Datos genéricos: el kit no sabe de ningún sistema. */
const PERSONAS = ['Persona Uno', 'Persona Dos', 'Persona Tres'];
const LEYENDA = [
  { label: 'Publicado', tone: 'ok' },
  { label: 'Aprobado', tone: 'info' },
  { label: 'Borrador', tone: 'none', outline: true },
  { label: 'Otro origen', tone: 'violet' },
];

export const Rol = () => {
  const dias = Array.from({ length: 14 }, (_, i) => {
    const d = i + 1;
    const semana = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'][i % 7];
    return { key: String(d), label: String(d), sublabel: semana, muted: semana === 'do' };
  });
  const filas = PERSONAS.map((p, i) => ({ key: String(i), title: p, subtitle: `Área ${i + 1}` }));
  return (
    <ScheduleGrid
      label="Rol de ejemplo"
      rowHeader="Persona"
      columns={dias}
      rows={filas}
      legend={LEYENDA}
      entriesOf={(fila, dia) => {
        const n = Number(dia.key) + Number(fila.key);
        if (dia.muted || n % 3 === 0) return [];
        const tono = ['ok', 'info', 'none', 'violet'][n % 4];
        return [{
          key: 'm',
          label: n % 2 ? 'M' : 'T',
          tone: tono,
          outline: tono === 'none',
          tip: { title: `${fila.title} · día ${dia.label}`, body: '08:00–12:00' },
          onSelect: () => {},
        }];
      }}
    />
  );
};

export const Linea_de_tiempo = () => (
  <DayTimeline
    label="Salas del día"
    now="10:30"
    legend={LEYENDA}
    rows={[
      {
        key: 'a',
        title: 'Sala 101',
        subtitle: 'Piso 1',
        blocks: [
          { key: '1', start: '08:00', end: '12:00', label: 'Persona Uno', detail: '12 de 16 ocupados', tone: 'ok', onSelect: () => {} },
          { key: '2', start: '11:00', end: '13:00', label: 'Persona Dos', detail: 'Se cruza con la anterior', tone: 'crit' },
          { key: '3', start: '14:00', end: '18:00', label: 'Persona Tres', tone: 'violet' },
        ],
      },
      { key: 'b', title: 'Sala 102', subtitle: 'Piso 1', blocks: [{ key: '4', start: '07:00', end: '13:00', label: 'Persona Dos', tone: 'none', outline: true }] },
      { key: 'c', title: 'Sala 201', subtitle: 'Piso 2', blocks: [] },
    ]}
  />
);

export const Cupos = () => {
  const [elegido, setElegido] = useState(null);
  const estados = ['taken', 'free', 'free', 'held', 'taken', 'free', 'blocked', 'free'];
  const cupos = estados.map((status, i) => ({
    key: String(i),
    time: `${String(8 + Math.floor((i * 15) / 60)).padStart(2, '0')}:${String((i * 15) % 60).padStart(2, '0')}`,
    status,
    note: i % 3 === 0 ? 'Nuevo' : undefined,
  }));
  cupos.unshift({ key: 'p', time: '07:45', status: 'past' });
  cupos.push({ key: 'x', time: '10:00', status: 'free', extra: true });
  return <SlotGrid label="Cupos del turno" slots={cupos} selected={elegido} onSelect={(s) => setElegido(s.key)} />;
};

export const Capacidad = () => (
  <Stack gap={4}>
    <CapacityMeter
      label="Cupos del turno"
      unit="cupos"
      total={20}
      segments={[
        { key: 'a', label: 'Ocupados aquí', value: 9 },
        { key: 'b', label: 'Ocupados en otro sistema', value: 5, tone: 'violet' },
      ]}
    />
    <CapacityMeter label="Con sobrecupo" unit="cupos" total={10} segments={[{ key: 'a', label: 'Ocupados', value: 12 }]} />
    <CapacityMeter label="Sin capacidad conocida" unit="cupos" total={null} segments={[{ key: 'a', label: 'Ocupados', value: 4 }]} />
  </Stack>
);

export const Avatares = () => (
  <Stack direction="row" gap={3} align="center">
    <Avatar name="Persona Uno" size="sm" />
    <Avatar name="Persona Dos" tone="ok" />
    <Avatar name="Persona Tres" size="lg" tone="violet" label="Persona Tres, de otro origen" />
  </Stack>
);
