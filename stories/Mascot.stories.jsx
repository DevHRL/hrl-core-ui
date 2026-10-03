import { useState } from 'react';
import { Button, Card, Checkbox, Mascot, MASCOT_STATES, Stack } from '../src/index.js';

export default { title: 'Primitivos / Mascot' };

/* Lo que cada estado expresa, para rotularlo: la mascota nunca es la única
   señal, siempre va con un texto que lo dice. */
const ROTULOS = {
  idle: 'Esperando',
  thinking: 'Trabajando',
  done: 'Terminó bien',
  problem: 'Encontró algo',
  sleeping: 'En pausa',
};

function Rotulada({ children, texto }) {
  return (
    <Stack gap={2} align="center">
      {children}
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>{texto}</span>
    </Stack>
  );
}

/* Los cinco estados. Cada uno tiene su mirada y todos parpadean. */
export const Estados = () => (
  <Stack direction="row" gap={6} align="end" wrap>
    {MASCOT_STATES.map((estado) => (
      <Rotulada key={estado} texto={`${ROTULOS[estado]} · ${estado}`}>
        <Mascot state={estado} size="lg" />
      </Rotulada>
    ))}
  </Stack>
);

/* Los tamaños con nombre, y uno en px. */
export const Tamanos = () => (
  <Stack direction="row" gap={6} align="end" wrap>
    <Rotulada texto="sm · 40"><Mascot size="sm" /></Rotulada>
    <Rotulada texto="md · 64"><Mascot size="md" /></Rotulada>
    <Rotulada texto="lg · 104"><Mascot size="lg" /></Rotulada>
    <Rotulada texto="xl · 160"><Mascot size="xl" /></Rotulada>
    <Rotulada texto="220 px"><Mascot size={220} /></Rotulada>
  </Stack>
);

/* Sin boca: la expresión queda en los ojos, la postura y el globo. */
export const SinBoca = () => (
  <Stack direction="row" gap={6} align="end" wrap>
    {MASCOT_STATES.map((estado) => (
      <Rotulada key={estado} texto={ROTULOS[estado]}>
        <Mascot state={estado} size="lg" mouth={false} />
      </Rotulada>
    ))}
  </Stack>
);

/* Con interactive responde al clic y al teclado. Lo que dice lo pone quien la
   usa, con onReact: la mascota no tiene texto propio. */
const DICE = { tap: '¡Hola!', squeeze: '¡Eso es un abrazo!', dizzy: 'Todo da vueltas…' };

export const Interactiva = () => {
  const [dice, setDice] = useState('Haga clic, mantenga presionado o haga clic cinco veces seguidas.');
  return (
    <Stack gap={3} align="start">
      <Mascot size="xl" interactive label="Mascota del hospital: haga clic para saludar" onReact={(n) => setDice(DICE[n])} />
      <p role="status" style={{ margin: 0, fontSize: 'var(--text-base)' }}>{dice}</p>
    </Stack>
  );
};

/* Para probarla entera: estado, boca y tamaño. */
export const Banco = () => {
  const [estado, setEstado] = useState('idle');
  const [boca, setBoca] = useState(true);
  const [grande, setGrande] = useState(true);
  return (
    <Stack gap={5} align="start">
      <Stack direction="row" gap={2} wrap>
        {MASCOT_STATES.map((e) => (
          <Button key={e} size="sm" tone={e === estado ? 'cta' : 'ghost'} onClick={() => setEstado(e)}>
            {ROTULOS[e]}
          </Button>
        ))}
      </Stack>
      <Stack direction="row" gap={5} wrap>
        <Checkbox label="Con boca" checked={boca} onChange={setBoca} />
        <Checkbox label="Tamaño xl" checked={grande} onChange={setGrande} />
      </Stack>
      <Rotulada texto={ROTULOS[estado]}>
        <Mascot state={estado} size={grande ? 'xl' : 'md'} mouth={boca} interactive />
      </Rotulada>
    </Stack>
  );
};

/* En contexto: junto al texto que dice lo mismo que su gesto. */
export const EnUnaTarjeta = () => (
  <Card icon="sh-doc" accent="var(--primary)" title="Revisión del archivo">
    <Stack direction="row" gap={4} align="center">
      <Mascot state="problem" size="md" />
      <span style={{ fontSize: 'var(--text-base)' }}>Se encontraron 3 casillas por corregir antes de enviar.</span>
    </Stack>
  </Card>
);
