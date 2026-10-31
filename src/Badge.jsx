import { Icon } from './icons.jsx';

/* El color nunca es la única señal: cada tono lleva su propio icono, de
   relleno como el resto del sistema. Los fondos son los tenues de estado
   (--*-soft), que el tema oscuro refuerza. */
const TONOS = {
  ok: { fg: 'var(--ok-text)', bg: 'var(--success-soft)', icono: 'sh-ok' },
  warn: { fg: 'var(--warning-text)', bg: 'var(--warning-soft)', icono: 'sh-warn' },
  crit: { fg: 'var(--danger-text)', bg: 'var(--destructive-soft)', icono: 'sh-crit' },
  info: { fg: 'var(--info-text)', bg: 'var(--info-soft)', icono: 'sh-info' },
  none: { fg: 'var(--neutral-text)', bg: 'var(--neutral-soft)', icono: 'sh-none' },
};

export function Badge({ label = 'Estado', tone = 'none' }) {
  const t = TONOS[tone] ?? TONOS.none;

  return (
    <span className="hrl-badge" style={{ '--tone-fg': t.fg, '--tone-bg': t.bg }}>
      <Icon name={t.icono} size={14} />
      {label}
    </span>
  );
}
