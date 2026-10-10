import { Alert, Badge, Button, Card, PREFERENCE_DEFAULTS, SegmentedControl, Stack, Switch, usePreferences } from '../../src/index.js';
import { PanelEjemplo } from '../_compartido/PanelEjemplo.jsx';
import { useTemaHrl } from '../_compartido/useTemaHrl.js';

export default { title: 'Composición / Personalizar' };

const RADIOS_BASE = { 'radius-xs': 6, 'radius-sm': 8, 'radius-md': 10, radius: 12, 'radius-lg': 14, 'radius-card': 16, 'radius-xl': 18 };

const FUENTES = {
  'Public Sans': "'Public Sans', Helvetica, Arial, sans-serif",
  'Sistema': "system-ui, -apple-system, 'Segoe UI', sans-serif",
  'Georgia': "Georgia, 'Times New Roman', serif",
  'IBM Plex Mono': "'IBM Plex Mono', ui-monospace, monospace",
};

function luminancia(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lineal = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * lineal(r) + 0.7152 * lineal(g) + 0.0722 * lineal(b);
}

/* Contraste del texto blanco de un botón sobre el color elegido: la misma
   vara con la que el kit valida sus propios colores. */
function contrasteConBlanco(hex) {
  return 1.05 / (luminancia(hex) + 0.05);
}

/* Cambiar tokens en un contenedor basta para que todo lo que hay dentro
   responda: los componentes no llevan ningún color escrito, solo `var()`. */
/* Las preferencias de lectura del perfil, junto a los tokens: se prueban sobre
   la misma vista. Clave propia del catálogo; no toca la de ningún sistema. */
function PreferenciasDeLectura() {
  const [prefs, cambiar, restablecer] = usePreferences('hrl_catalogo_prefs');
  const cambiado = Object.keys(PREFERENCE_DEFAULTS).some((k) => prefs[k] !== PREFERENCE_DEFAULTS[k]);
  return (
    <Card accent="var(--info)" icon="sh-gear" title="Preferencias de lectura" subtitle="Contraste, tamaño del texto y enlaces, sobre esta vista">
      <Stack direction="row" gap={5} wrap align="end">
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
        {cambiado && <Button tone="link" onClick={restablecer}>Restablecer</Button>}
      </Stack>
    </Card>
  );
}

export const TemaEnVivo = ({ color, fuente, redondeo }) => {
  const tema = useTemaHrl();
  const claro = tema !== 'oscuro';
  const contraste = contrasteConBlanco(color);

  const variables = {
    '--brand': color,
    /* En claro, el color de marca también oscurece su variante de texto y de
       énfasis; en oscuro esos tokens son claros a propósito y no se tocan. */
    ...(claro && {
      '--brand-deep': `color-mix(in srgb, ${color} 55%, black)`,
      '--brand-texto': `color-mix(in srgb, ${color} 55%, black)`,
      '--brand-hover': `color-mix(in srgb, ${color} 85%, black)`,
    }),
    '--font-sans': FUENTES[fuente],
    ...Object.fromEntries(Object.entries(RADIOS_BASE).map(([nombre, px]) => [`--${nombre}`, `${px * redondeo}px`])),
  };

  return (
    <div className="showroom-pagina">
      <Alert
        tone={contraste >= 4.5 ? 'success' : 'warning'}
        title={contraste >= 4.5 ? 'El color cumple contraste AA' : 'El color no llega a contraste AA'}
      >
        Texto blanco sobre este color: {contraste.toFixed(2)}:1 (mínimo 4.5:1 para texto normal). Ajusta los
        controles de la barra lateral y mira cómo responde toda la vista.
      </Alert>
      <PreferenciasDeLectura />
      <div className="hrl-nuevo" style={variables}>
        <div style={{ display: 'grid', gap: 12 }}>
          <div className="showroom-fila">
            <Badge label={`Fuente: ${fuente}`} tone="info" />
            <Badge label={`Redondeo ×${redondeo}`} tone="none" />
          </div>
          <PanelEjemplo />
        </div>
      </div>
    </div>
  );
};

TemaEnVivo.args = { color: '#008659', fuente: 'Public Sans', redondeo: 1 };

TemaEnVivo.argTypes = {
  color: { control: { type: 'color' } },
  fuente: { control: { type: 'select' }, options: Object.keys(FUENTES) },
  redondeo: { control: { type: 'range', min: 0, max: 2, step: 0.25 } },
};
