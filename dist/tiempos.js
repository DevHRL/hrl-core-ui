function msDelToken(nombre, porDefecto) {
  if (typeof window === "undefined") return porDefecto;
  const crudo = getComputedStyle(document.documentElement).getPropertyValue(nombre).trim();
  const n = parseFloat(crudo);
  if (!Number.isFinite(n)) return porDefecto;
  return crudo.endsWith("ms") ? n : n * 1e3;
}
export {
  msDelToken
};
//# sourceMappingURL=tiempos.js.map
