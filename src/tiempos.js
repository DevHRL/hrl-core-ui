/* Lee una duración de los tokens (`--delay-tip`…) en milisegundos, para el JS
   que tiene que coincidir con lo que hace el CSS. Así un tiempo se ajusta en
   tokens.json y no queda una copia en cada componente. Sin documento (pintado
   en el servidor) o sin el token, `porDefecto`. */
export function msDelToken(nombre, porDefecto) {
  if (typeof window === 'undefined') return porDefecto;
  const crudo = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  const n = parseFloat(crudo);
  if (!Number.isFinite(n)) return porDefecto;
  return crudo.endsWith('ms') ? n : n * 1000;
}
