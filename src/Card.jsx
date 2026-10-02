/* El título de la sección es un `h2` por defecto: va bajo el `h1` de la página
   (PageHeader) y un lector de pantalla recorre los títulos por nivel. Antes era
   `h3` fijo, así que toda página saltaba de h1 a h3. Una tarjeta dentro de
   otra sección pide `headingLevel={3}`. El nivel no cambia el aspecto. */
export function Card({ title = 'Sección', subtitle, total, accent, actions, flush = false, headingLevel = 2, children }) {
  const Titulo = `h${Math.min(6, Math.max(2, Number(headingLevel) || 2))}`;
  return (
    <section className={`hrl-section${flush ? ' hrl-section--flush' : ''}`}>
      <div className="hrl-section__head">
        <div className="hrl-section__title-row">
          {accent && <span className="hrl-section__accent" style={{ '--accent': accent }} />}
          <div style={{ minWidth: 0 }}>
            <Titulo className="hrl-section__title">{title}</Titulo>
            {subtitle && <p className="hrl-section__subtitle">{subtitle}</p>}
          </div>
          {total && <span className="hrl-section__total">· {total}</span>}
        </div>
        {/* Al otro extremo de la fila, a la altura del título: así una acción
           propia de la sección (exportar, expandir todo) no cae en una fila
           aparte más abajo, descuadrada del encabezado. */}
        {actions && <div className="hrl-section__acciones">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
