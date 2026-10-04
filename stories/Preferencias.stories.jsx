import { useState } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Input,
  PREFERENCE_DEFAULTS,
  SegmentedControl,
  Stack,
  Switch,
  usePreferences,
} from '../src/index.js';

export default { title: 'Fundamentos / Preferencias' };

/* Las tres preferencias de lectura del perfil (AppShell), aplicadas en vivo
   sobre todo el catálogo. Se recuerdan en este navegador con una clave propia
   del catálogo, así que no tocan las de ningún sistema. */
export const EnVivo = () => {
  const [prefs, cambiar, restablecer] = usePreferences('hrl_catalogo_prefs');
  const cambiado = Object.keys(PREFERENCE_DEFAULTS).some((k) => prefs[k] !== PREFERENCE_DEFAULTS[k]);
  return (
    <Stack gap={5} style={{ maxWidth: 720 }}>
      <Card accent="var(--primary)" icon="sh-gear" title="Apariencia y accesibilidad" subtitle="Lo mismo que el cajón del perfil">
        <Stack gap={4}>
          <SegmentedControl
            label="Contraste"
            value={prefs.contrast}
            onChange={(v) => cambiar({ contrast: v })}
            options={[
              { value: 'system', label: 'Sistema', ariaLabel: 'Como el sistema' },
              { value: 'standard', label: 'Estándar' },
              { value: 'high', label: 'Alto' },
            ]}
          />
          <SegmentedControl
            label="Tamaño del texto"
            value={prefs.textScale}
            onChange={(v) => cambiar({ textScale: v })}
            options={[1, 1.15, 1.3, 1.5].map((n) => ({ value: n, label: `${Math.round(n * 100)} %` }))}
          />
          <Switch label="Subrayar enlaces" checked={prefs.underlineLinks} onChange={(v) => cambiar({ underlineLinks: v })} />
          {cambiado && (
            <Button tone="link" onClick={restablecer}>
              Restablecer
            </Button>
          )}
        </Stack>
      </Card>

      <Card accent="var(--info)" icon="sh-doc" title="Así se ve" subtitle="Texto, enlaces, estados y un campo">
        <Stack gap={3}>
          <p style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--text-secondary)' }}>
            Un párrafo con texto secundario y un <a href="#ejemplo">enlace dentro del texto</a>, que se subraya si se pide.
          </p>
          <Stack direction="row" gap={2} wrap>
            <Badge label="Completo" tone="ok" />
            <Badge label="Por revisar" tone="warn" />
            <Badge label="Con error" tone="crit" />
          </Stack>
          <Input label="Un campo" />
          <Stack direction="row" gap={2} wrap>
            <Button>Principal</Button>
            <Button tone="ghost">Secundario</Button>
            <Button tone="link">Acción como enlace</Button>
          </Stack>
          <Alert tone="warning" title="Un aviso">Con su texto, que en alto contraste se lee a 7:1.</Alert>
        </Stack>
      </Card>
    </Stack>
  );
};

export const InterruptorYSegmentos = () => {
  const [activo, setActivo] = useState(true);
  const [valor, setValor] = useState('b');
  return (
    <Stack gap={4} style={{ maxWidth: 420 }}>
      <Switch label="Subrayar enlaces" checked={activo} onChange={setActivo} />
      <SegmentedControl
        label="Ejemplo"
        value={valor}
        onChange={setValor}
        options={[{ value: 'a', label: 'Uno' }, { value: 'b', label: 'Dos' }, { value: 'c', label: 'Tres' }]}
      />
    </Stack>
  );
};
