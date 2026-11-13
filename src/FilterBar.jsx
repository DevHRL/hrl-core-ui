/* Barra de filtros de una vista.

   Rejilla de cuatro columnas con los campos; los botones ocupan la última
   columna de la fila donde quede hueco (con 3 filtros, a su lado; con 4, en
   una fila propia, a la derecha). Las columnas dependen del ancho de la propia
   barra, no de la ventana: dentro de una tarjeta angosta pasan a 2 y en un
   celular a 1, así ninguna etiqueta se parte en dos líneas y descuadra la fila.

     <FilterBar
       actions={
         <>
           <Button onClick={consultar}>Consultar</Button>
           <Button tone="ghost" onClick={limpiar}>Limpiar</Button>
         </>
       }
       footer={<span>Consulta acotada al último mes cerrado.</span>}
     >
       <Input label="Desde" kind="date" value={desde} onChange={...} />
       <Input label="Hasta" kind="date" value={hasta} onChange={...} />
     </FilterBar> */
export function FilterBar({ children, actions, footer, columns }) {
  return (
    <div className="hrl-filtros">
      <div
        className={`hrl-filtros-barra${columns ? ' hrl-filtros-barra--fija' : ''}`}
        style={columns ? { gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` } : undefined}
      >
        {children}
        {actions && <div className="hrl-filtros-barra__acciones">{actions}</div>}
      </div>
      {footer && <div className="hrl-chips-consulta">{footer}</div>}
    </div>
  );
}
