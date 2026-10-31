/* Una sección de la página.

   Desde 1.11.0 la tarjeta es blanca, sin borde, con esquina de 22 px y una
   sombra difusa; la cabecera es el título (17 px, negrita) con su descripción
   debajo, y a la misma altura el estado (`meta`) y la acción (`actions`). La
   barra de color y la baldosa del icono de la versión anterior ya no se
   dibujan: la nueva interfaz distingue las secciones por su título y su
   contenido, no por un color. `accent` e `icon` se siguen aceptando para no
   romper a quien los pasa; `accent` aún fija `--accent` dentro de la tarjeta,
   que es lo que usan sus enlaces y su paginador.

   El título es un `h2` por defecto: va bajo el `h1` de la página (PageHeader)
   y un lector de pantalla recorre los títulos por nivel. Una tarjeta dentro de
   otra sección pide `headingLevel={3}`. El nivel no cambia el aspecto.

     meta       el estado de lo que muestra la sección: insignias o chips
     actions    la acción propia de la sección, al extremo derecho
     flush      el cuerpo va de borde a borde (una tabla); la cabecera conserva su relleno
     wide       ocupa siempre el ancho completo dentro de un Mosaic */
export function Card({
  title = 'Sección',
  subtitle,
  total,
  accent,
  meta,
  actions,
  flush = false,
  wide = false,
  headingLevel = 2,
  children,
}) {
  const Titulo = `h${Math.min(6, Math.max(2, Number(headingLevel) || 2))}`;
  const clases = ['hrl-section', flush && 'hrl-section--flush', wide && 'hrl-section--ancha'].filter(Boolean).join(' ');

  return (
    <section className={clases} style={accent ? { '--accent': accent } : undefined}>
      <div className="hrl-section__head">
        <div className="hrl-section__textos">
          <Titulo className="hrl-section__title">
            {title}
            {total && <span className="hrl-section__total"> · {total}</span>}
          </Titulo>
          {subtitle && <p className="hrl-section__subtitle">{subtitle}</p>}
        </div>
        {meta && <div className="hrl-section__meta">{meta}</div>}
        {actions && <div className="hrl-section__acciones">{actions}</div>}
      </div>
      {children}
    </section>
  );
}
