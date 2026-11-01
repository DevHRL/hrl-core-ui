/* Devuelve el foco a quien abrió una capa (§ 3.1 del contrato) sin que su
   tooltip salte solo: al volver de un cajón o de un menú, el aviso aparecía
   sobre el botón como si se acabara de llegar a él. La marca la lee Tooltip
   y la consume en ese mismo foco; con el siguiente, todo vuelve a ser normal.
   El anillo de foco sí se ve: quien navega con teclado tiene que saber dónde
   quedó. */
export function devolverFoco(el) {
  if (!el || typeof el.focus !== 'function') return;
  el.setAttribute('data-hrl-foco-devuelto', '');
  el.focus();
}
