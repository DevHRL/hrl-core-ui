import { Tooltip } from './Tooltip.jsx';
import { Icon } from './icons.jsx';
import { nextSort } from './sort.js';
import { SkeletonRows } from './Skeleton.jsx';

/* La flecha de orden: un solo triángulo cuando la columna manda el orden y
   los dos, más tenues, cuando todavía se puede ordenar por ella. */
function FlechaOrden({ estado }) {
  const activo = estado === 'asc' || estado === 'desc';
  return (
    <Icon
      name={activo ? 'sh-chevron-down' : 'sh-sort'}
      size={13}
      style={{
        color: activo ? 'var(--primary-text)' : 'var(--subtle-foreground)',
        flex: '0 0 auto',
        transform: estado === 'asc' ? 'rotate(180deg)' : undefined,
      }}
    />
  );
}

/* Tramos de la fila de grupos: columnas contiguas con el mismo `group` se
   funden en una sola celda. Una columna sin grupo deja su tramo en blanco,
   para que cada rótulo quede exactamente encima de las columnas que abarca. */
function tramosDeGrupo(columns) {
  const tramos = [];
  for (const c of columns) {
    const ultimo = tramos.at(-1);
    if (ultimo && c.group && ultimo.group === c.group) ultimo.span += 1;
    else tramos.push({ group: c.group ?? null, span: 1, key: c.key, ayuda: c.groupTooltip });
  }
  return tramos;
}

export function DataTable({
  columns,
  rows,
  sort,
  onSortChange,
  rowKey,
  legend,
  empty,
  changing,
  rowClass,
  /* Mientras es true se pintan filas fantasma en lugar de la tabla vacía:
     así la altura no salta cuando llegan los datos. */
  loading = false,
  loadingRows = 5,
}) {
  const conGrupos = columns.some((c) => c.group);

  return (
    <div className={`hrl-table-wrap${changing ? ' hrl-table-wrap--cambiando' : ''}`}>
      <table className="hrl-table">
        <thead>
          {conGrupos && (
            <tr className="hrl-table__grupos">
              {tramosDeGrupo(columns).map((t) => (
                <th key={`grupo-${t.key}`} colSpan={t.span} scope={t.group ? 'colgroup' : undefined}>
                  {t.group && t.ayuda ? (
                    <Tooltip title={t.group} body={t.ayuda}>
                      <span className="hrl-table__head-cell">{t.group}</span>
                    </Tooltip>
                  ) : (
                    t.group
                  )}
                </th>
              ))}
            </tr>
          )}
          <tr>
            {columns.map((c) => {
              const estado = sort?.key === c.key ? sort.dir : 'none';
              const contenido = (
                <span className="hrl-table__head-cell" style={{ justifyContent: c.align === 'right' ? 'flex-end' : undefined }}>
                  {c.label}
                  {c.sortable && <FlechaOrden estado={estado} />}
                </span>
              );
              return (
                <th
                  key={c.key}
                  style={{ width: c.width, textAlign: c.align ?? 'left' }}
                  aria-sort={estado === 'asc' ? 'ascending' : estado === 'desc' ? 'descending' : undefined}
                >
                  {c.sortable ? (
                    <button type="button" className="hrl-table__sort" onClick={() => onSortChange(nextSort(sort, c))}>
                      {c.tooltip ? (
                        <Tooltip title={c.label} body={c.tooltip} focusable={false}>
                          {contenido}
                        </Tooltip>
                      ) : (
                        contenido
                      )}
                    </button>
                  ) : c.tooltip ? (
                    <Tooltip title={c.label} body={c.tooltip}>{contenido}</Tooltip>
                  ) : (
                    contenido
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <SkeletonRows rows={loadingRows} columns={columns.length} />
          ) : rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="hrl-table__empty">
                {empty ?? 'Sin registros.'}
              </td>
            </tr>
          ) : (
            rows.map((fila, i) => (
              <tr
                key={rowKey ? rowKey(fila) : i}
                className={rowClass ? rowClass(fila) : undefined}
                style={{ animationDelay: `${Math.min(i, 14) * 30}ms` }}
              >
                {columns.map((c) => (
                  <td key={c.key} style={{ textAlign: c.align ?? 'left' }}>
                    {c.render ? c.render(fila) : fila[c.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {legend && <div className="hrl-legend">{legend}</div>}
    </div>
  );
}
