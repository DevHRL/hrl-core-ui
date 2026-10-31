import { PAGE_SIZES } from './paginate.js';
import { Icon } from './icons.jsx';

/* Siempre muestra la primera, la última y ±1 alrededor de la actual. */
function numeros(total, actual) {
  const salida = [];
  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || Math.abs(i - actual) <= 1) salida.push(i);
    else if (salida[salida.length - 1] !== '…') salida.push('…');
  }
  return salida;
}

export function Pagination({
  page = 1,
  totalPages = 1,
  perPage = 20,
  totalItems = 0,
  accent = 'var(--accent)',
  onChange,
  /* Opcional: si se pasa, aparece el selector de filas por página. */
  onPerPageChange,
  sizes = PAGE_SIZES,
}) {
  const actual = Math.max(1, Math.min(totalPages, page));
  const ir = (n) => onChange?.(Math.max(1, Math.min(totalPages, n)));

  const botones = [
    { clave: 'prev', icono: 'sh-chevron', girado: true, nombre: 'Página anterior', ir: () => ir(actual - 1), off: actual === 1 },
    ...numeros(totalPages, actual).map((n, i) => ({
      clave: n === '…' ? `gap-${i}` : `p-${n}`,
      etiqueta: String(n),
      ir: n === '…' ? undefined : () => ir(n),
      off: n === '…',
      hueco: n === '…',
      on: n === actual,
      nombre: n === '…' ? undefined : `Página ${n}`,
    })),
    { clave: 'next', icono: 'sh-chevron', nombre: 'Página siguiente', ir: () => ir(actual + 1), off: actual === totalPages },
  ];

  return (
    <div className="hrl-pag" style={{ '--accent': accent }}>
      <span className="hrl-pag__counter">
        {onPerPageChange
          ? `Página ${actual} de ${totalPages} · ${totalItems.toLocaleString('es-PE')} registros`
          : `Página ${actual} de ${totalPages} · ${perPage} por página · ${totalItems.toLocaleString('es-PE')} registros`}
      </span>

      {onPerPageChange && (
        <label className="hrl-pag__tamano">
          Filas por página
          <select value={perPage} onChange={(e) => onPerPageChange(Number(e.target.value))} aria-label="Filas por página">
            {sizes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      )}
      <div className="hrl-pag__pages">
        {botones.map((b) => (
          <button
            key={b.clave}
            type="button"
            className={`hrl-pag__btn${b.on ? ' hrl-pag__btn--on' : ''}${b.hueco ? ' hrl-pag__btn--hueco' : ''}`}
            onClick={b.ir}
            disabled={b.off}
            aria-label={b.nombre}
            aria-current={b.on ? 'page' : undefined}
            aria-hidden={b.hueco || undefined}
          >
            {b.icono ? <Icon name={b.icono} size={15} style={b.girado ? { transform: 'rotate(180deg)' } : undefined} /> : b.etiqueta}
          </button>
        ))}
      </div>
    </div>
  );
}
