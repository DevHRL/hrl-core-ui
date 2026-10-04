import { useCallback, useEffect, useState } from "react";
const PREFERENCE_DEFAULTS = Object.freeze({ contrast: "system", textScale: 1, underlineLinks: false });
const PREFERENCE_OPTIONS = Object.freeze({
  contrast: Object.freeze(["system", "standard", "high"]),
  textScale: Object.freeze([1, 1.15, 1.3, 1.5]),
  underlineLinks: Object.freeze([false, true])
});
const CONSULTA_CONTRASTE = "(prefers-contrast: more)";
function validar(crudo) {
  const p = { ...PREFERENCE_DEFAULTS };
  if (crudo && typeof crudo === "object") {
    for (const clave of Object.keys(PREFERENCE_DEFAULTS)) {
      if (PREFERENCE_OPTIONS[clave].includes(crudo[clave])) p[clave] = crudo[clave];
    }
  }
  return p;
}
function readPreferences(key) {
  try {
    return validar(JSON.parse(localStorage.getItem(key) ?? "null"));
  } catch {
    return { ...PREFERENCE_DEFAULTS };
  }
}
function contrasteDelSistema() {
  return typeof window !== "undefined" && window.matchMedia?.(CONSULTA_CONTRASTE).matches;
}
function resolveContrast(prefs) {
  if (prefs.contrast === "high") return "high";
  if (prefs.contrast === "standard") return "standard";
  return contrasteDelSistema() ? "high" : "standard";
}
function applyPreferences(prefs, key) {
  const p = validar(prefs);
  const raiz = document.documentElement;
  raiz.dataset.contrasteHrl = resolveContrast(p) === "high" ? "alto" : "estandar";
  raiz.dataset.enlacesHrl = p.underlineLinks ? "si" : "no";
  raiz.style.setProperty("--hrl-escala-texto", String(p.textScale));
  if (key) {
    try {
      localStorage.setItem(key, JSON.stringify(p));
    } catch {
    }
  }
  return p;
}
function usePreferences(key) {
  const [prefs, setPrefs] = useState(() => readPreferences(key));
  useEffect(() => {
    applyPreferences(prefs, key);
    if (prefs.contrast !== "system" || !window.matchMedia) return void 0;
    const consulta = window.matchMedia(CONSULTA_CONTRASTE);
    const alCambiar = () => applyPreferences(prefs);
    consulta.addEventListener?.("change", alCambiar);
    return () => consulta.removeEventListener?.("change", alCambiar);
  }, [prefs, key]);
  const cambiar = useCallback((parcial) => setPrefs((p) => validar({ ...p, ...parcial })), []);
  const restablecer = useCallback(() => setPrefs({ ...PREFERENCE_DEFAULTS }), []);
  return [prefs, cambiar, restablecer];
}
export {
  PREFERENCE_DEFAULTS,
  PREFERENCE_OPTIONS,
  applyPreferences,
  readPreferences,
  resolveContrast,
  usePreferences
};
//# sourceMappingURL=preferences.js.map
