import { useCallback, useEffect, useState } from 'react';

/* Preferencias de lectura: contraste, tamaño del texto y subrayado de los
   enlaces. Complementan los ajustes del propio equipo (zoom del navegador,
   tema y contraste del sistema operativo), no los reemplazan: el contraste
   arranca en «Como el sistema» y sigue sus cambios en vivo.

   Se resuelven aquí y se escriben en <html> ya resueltas; el CSS (tokens.css)
   solo mira los atributos:

     contrast        'system' | 'standard' | 'high'  → data-contraste-hrl="estandar|alto"
     textScale       1 | 1.15 | 1.3 | 1.5            → --hrl-escala-texto
     underlineLinks  false | true                    → data-enlaces-hrl="no|si"

   En <html>, como el tema, para alcanzar lo que se monta por portal en
   document.body. Se guardan en localStorage bajo la clave que pase el sistema
   (no del kit: cada sistema recuerda lo suyo), y todo acceso va en try/catch:
   en modo privado se aplican en la sesión y no se recuerdan. */

export const PREFERENCE_DEFAULTS = Object.freeze({ contrast: 'system', textScale: 1, underlineLinks: false });

export const PREFERENCE_OPTIONS = Object.freeze({
  contrast: Object.freeze(['system', 'standard', 'high']),
  textScale: Object.freeze([1, 1.15, 1.3, 1.5]),
  underlineLinks: Object.freeze([false, true]),
});

const CONSULTA_CONTRASTE = '(prefers-contrast: more)';

/* Cada opción se valida por separado: un valor desconocido vuelve a su valor
   por defecto, no arrastra a las demás. */
function validar(crudo) {
  const p = { ...PREFERENCE_DEFAULTS };
  if (crudo && typeof crudo === 'object') {
    for (const clave of Object.keys(PREFERENCE_DEFAULTS)) {
      if (PREFERENCE_OPTIONS[clave].includes(crudo[clave])) p[clave] = crudo[clave];
    }
  }
  return p;
}

export function readPreferences(key) {
  try {
    return validar(JSON.parse(localStorage.getItem(key) ?? 'null'));
  } catch {
    // JSON roto o almacenamiento bloqueado: los valores por defecto.
    return { ...PREFERENCE_DEFAULTS };
  }
}

function contrasteDelSistema() {
  return typeof window !== 'undefined' && window.matchMedia?.(CONSULTA_CONTRASTE).matches;
}

/* El contraste que de verdad se aplica, con «Como el sistema» ya resuelto. */
export function resolveContrast(prefs) {
  if (prefs.contrast === 'high') return 'high';
  if (prefs.contrast === 'standard') return 'standard';
  return contrasteDelSistema() ? 'high' : 'standard';
}

/* Aplica en <html> y, si se pasa la clave, recuerda. Se puede llamar antes del
   primer render (main.jsx) para que no destelle el contraste equivocado. */
export function applyPreferences(prefs, key) {
  const p = validar(prefs);
  const raiz = document.documentElement;
  raiz.dataset.contrasteHrl = resolveContrast(p) === 'high' ? 'alto' : 'estandar';
  raiz.dataset.enlacesHrl = p.underlineLinks ? 'si' : 'no';
  raiz.style.setProperty('--hrl-escala-texto', String(p.textScale));
  if (key) {
    try {
      localStorage.setItem(key, JSON.stringify(p));
    } catch {
      // Si no se puede recordar, al menos se aplica en esta sesión.
    }
  }
  return p;
}

/* [prefs, cambiar(parcial), restablecer]. Con contraste «Como el sistema»,
   escucha el cambio del sistema operativo y lo aplica sin recargar. */
export function usePreferences(key) {
  const [prefs, setPrefs] = useState(() => readPreferences(key));

  useEffect(() => {
    applyPreferences(prefs, key);
    if (prefs.contrast !== 'system' || !window.matchMedia) return undefined;
    const consulta = window.matchMedia(CONSULTA_CONTRASTE);
    const alCambiar = () => applyPreferences(prefs);
    consulta.addEventListener?.('change', alCambiar);
    return () => consulta.removeEventListener?.('change', alCambiar);
  }, [prefs, key]);

  const cambiar = useCallback((parcial) => setPrefs((p) => validar({ ...p, ...parcial })), []);
  const restablecer = useCallback(() => setPrefs({ ...PREFERENCE_DEFAULTS }), []);
  return [prefs, cambiar, restablecer];
}
