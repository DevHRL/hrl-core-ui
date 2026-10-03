import { Icon } from './icons.jsx';

/* Una sección de la página.

   La cabecera es una sola banda: la barra de color (`accent`), el icono de lo
   que trata la sección, el título con su descripción, el estado (`meta`) y la
   acción (`actions`), en ese orden y a la misma altura. Antes el estado y la
   acción iban en filas propias debajo del título y dejaban un hueco largo
   entre ellos. La barra marca el grupo de la sección y el icono dice qué es:
   entre los dos, una sección se reconoce sin leer su título.

   El título es un `h2` por defecto: va bajo el `h1` de la página (PageHeader)
   y un lector de pantalla recorre los títulos por nivel. Una tarjeta dentro de
   otra sección pide `headingLevel={3}`. El nivel no cambia el aspecto.

     accent     color de la barra junto al título (un token: var(--…)); también tiñe el icono
     icon       nombre del registro de iconos (sh-…); decorativo, va junto al título
     meta       el estado de lo que muestra la sección: insignias o chips
     actions    la acción propia de la sección, al extremo derecho
     flush      el cuerpo va de borde a borde (una tabla); la cabecera conserva su relleno
     wide       ocupa siempre el ancho completo dentro de un Mosaic */
export function Card({
  title = 'Sección',
  subtitle,
  total,
  accent,
  icon,
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
        {accent && <span className="hrl-section__accent" aria-hidden="true" />}
        {icon && (
          <span className="hrl-section__icono" aria-hidden="true">
            <Icon name={icon} size={20} />
          </span>
        )}
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
