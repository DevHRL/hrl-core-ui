import { useState } from 'react';
import { Alert } from './Alert.jsx';
import { Button } from './Button.jsx';
import { HrlLogo } from './HrlLogo.jsx';
import { Sprite } from './icons.jsx';
import { Input } from './Input.jsx';
import { cx } from './variants.js';

/* Pantallas de acceso: ingreso y cambio obligatorio de contraseña.

   Ninguna consulta nada: reciben `onSubmit` y lo esperan. Si `onSubmit` lanza,
   se muestra el mensaje del error; si termina, la aplicación decide qué sigue.
   Así el kit no conoce ningún endpoint (design.md § 1) y cada sistema conserva
   su propio mecanismo de sesión.

   Fondo. Como en el sistema anterior, la pantalla muestra la fachada del
   hospital según la hora del día. `backdrop` elige:
     'auto'    (por defecto) la que corresponde a la hora
     'none'    sin imagen, solo el color de superficie
     'dawn' | 'morning' | 'afternoon' | 'dusk' | 'lit-night' | 'night'
   Mientras la imagen baja (pesa cientos de kB) se ve el color de fondo, no un
   hueco en blanco. */

/* Tramos de hora [desde, hasta) de cada fachada. Fuera de ellos, es de noche. */
const TRAMOS = [
  { desde: 5, hasta: 7, fondo: 'dawn' },
  { desde: 7, hasta: 12, fondo: 'morning' },
  { desde: 12, hasta: 17, fondo: 'afternoon' },
  { desde: 17, hasta: 19, fondo: 'dusk' },
  { desde: 19, hasta: 22, fondo: 'lit-night' },
];
export const LOGIN_BACKDROPS = ['dawn', 'morning', 'afternoon', 'dusk', 'lit-night', 'night'];

/* La fachada que corresponde a una hora (0-23). */
export function backdropForHour(hora) {
  return TRAMOS.find((t) => hora >= t.desde && hora < t.hasta)?.fondo ?? 'night';
}

const TEXTOS = {
  username: 'Usuario',
  password: 'Contraseña',
  submit: 'Ingresar',
  submitting: 'Ingresando…',
  errorTitle: 'No se pudo ingresar',
  changeTitle: 'Cambie su contraseña',
  changeIntro: 'Por seguridad debe reemplazar la contraseña inicial antes de usar el sistema.',
  current: 'Contraseña actual',
  next: 'Contraseña nueva',
  repeat: 'Repita la contraseña nueva',
  save: 'Guardar y continuar',
  saving: 'Guardando…',
  changeErrorTitle: 'No se pudo cambiar la contraseña',
  mismatch: 'Las contraseñas nuevas no coinciden.',
};

function Pantalla({ backdrop, children }) {
  const fondo = backdrop === 'auto' ? backdropForHour(new Date().getHours()) : backdrop;
  return (
    <div className={cx('hrl-nuevo', 'hrl-login', fondo && fondo !== 'none' && `hrl-login--${fondo}`)}>
      <Sprite />
      {/* La tarjeta es el contenido principal de la página de ingreso. */}
      <main className="hrl-login__tarjeta">{children}</main>
    </div>
  );
}

/* Ejecuta `accion` y devuelve el mensaje si falla; evita que el envío se repita mientras espera. */
function useEnvio() {
  const [error, setError] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const enviar = async (accion) => {
    setError(null);
    setEnviando(true);
    try {
      await accion();
    } catch (e) {
      setError(e?.message || String(e));
    } finally {
      setEnviando(false);
    }
  };
  return { error, setError, enviando, enviar };
}

/*   systemName  nombre del sistema, bajo el logo
     onSubmit    ({ username, password }) => Promise; lanzar un Error muestra su mensaje
     labels      textos que sustituyen a los de fábrica (ver TEXTOS)
     footer      nodo bajo el formulario (versión, ayuda) */
export function LoginScreen({ systemName, onSubmit, backdrop = 'auto', labels, footer }) {
  const t = { ...TEXTOS, ...labels };
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { error, enviando, enviar } = useEnvio();

  return (
    <Pantalla backdrop={backdrop}>
      <HrlLogo width={260} className="hrl-login__logo" />
      {systemName && <p className="hrl-login__subtitulo">{systemName}</p>}
      {/* Sin autoComplete="off": impedía que un gestor de contraseñas llenara
          el ingreso (WCAG 3.3.8, autenticación accesible). */}
      <form
        className="hrl-login__form"
        onSubmit={(e) => {
          e.preventDefault();
          enviar(() => onSubmit({ username: username.trim(), password }));
        }}
      >
        {error && <Alert tone="error" title={t.errorTitle}>{error}</Alert>}
        <Input label={t.username} required autoFocus autoComplete="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <Input label={t.password} kind="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" tone="cta" loading={enviando} loadingText={t.submitting} className="hrl-login__enviar">
          {t.submit}
        </Button>
      </form>
      {footer && <div className="hrl-login__pie">{footer}</div>}
    </Pantalla>
  );
}

/*   onSubmit    ({ current, next }) => Promise
     minLength   largo mínimo de la contraseña nueva (8 por defecto); solo se avisa en la etiqueta,
                 la regla real la impone el sistema que la guarda */
export function ChangePasswordScreen({ systemName, onSubmit, backdrop = 'auto', minLength = 8, labels, footer }) {
  const t = { ...TEXTOS, ...labels };
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [repeat, setRepeat] = useState('');
  const { error, setError, enviando, enviar } = useEnvio();

  return (
    <Pantalla backdrop={backdrop}>
      <HrlLogo width={260} className="hrl-login__logo" />
      {systemName && <p className="hrl-login__subtitulo">{systemName}</p>}
      <h1 className="hrl-login__titulo">{t.changeTitle}</h1>
      <p className="hrl-login__intro">{t.changeIntro}</p>
      <form
        className="hrl-login__form"
        onSubmit={(e) => {
          e.preventDefault();
          if (next !== repeat) {
            setError(t.mismatch);
            return;
          }
          enviar(() => onSubmit({ current, next }));
        }}
      >
        {error && <Alert tone="error" title={t.changeErrorTitle}>{error}</Alert>}
        <Input label={t.current} kind="password" required autoFocus autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} />
        <Input label={`${t.next} (mínimo ${minLength} caracteres)`} kind="password" required autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} />
        <Input label={t.repeat} kind="password" required autoComplete="new-password" value={repeat} onChange={(e) => setRepeat(e.target.value)} />
        <Button type="submit" tone="cta" loading={enviando} loadingText={t.saving} className="hrl-login__enviar">
          {t.save}
        </Button>
      </form>
      {footer && <div className="hrl-login__pie">{footer}</div>}
    </Pantalla>
  );
}
