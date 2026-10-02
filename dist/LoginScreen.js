import { jsx, jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Alert } from "./Alert.js";
import { Button } from "./Button.js";
import { HrlLogo } from "./HrlLogo.js";
import { Sprite } from "./icons.js";
import { Input } from "./Input.js";
import { cx } from "./variants.js";
const TRAMOS = [
  { desde: 5, hasta: 7, fondo: "dawn" },
  { desde: 7, hasta: 12, fondo: "morning" },
  { desde: 12, hasta: 17, fondo: "afternoon" },
  { desde: 17, hasta: 19, fondo: "dusk" },
  { desde: 19, hasta: 22, fondo: "lit-night" }
];
const LOGIN_BACKDROPS = ["dawn", "morning", "afternoon", "dusk", "lit-night", "night"];
function backdropForHour(hora) {
  return TRAMOS.find((t) => hora >= t.desde && hora < t.hasta)?.fondo ?? "night";
}
const TEXTOS = {
  username: "Usuario",
  password: "Contrase\xF1a",
  submit: "Ingresar",
  submitting: "Ingresando\u2026",
  errorTitle: "No se pudo ingresar",
  changeTitle: "Cambie su contrase\xF1a",
  changeIntro: "Por seguridad debe reemplazar la contrase\xF1a inicial antes de usar el sistema.",
  current: "Contrase\xF1a actual",
  next: "Contrase\xF1a nueva",
  repeat: "Repita la contrase\xF1a nueva",
  save: "Guardar y continuar",
  saving: "Guardando\u2026",
  changeErrorTitle: "No se pudo cambiar la contrase\xF1a",
  mismatch: "Las contrase\xF1as nuevas no coinciden."
};
function Pantalla({ backdrop, children }) {
  const fondo = backdrop === "auto" ? backdropForHour((/* @__PURE__ */ new Date()).getHours()) : backdrop;
  return /* @__PURE__ */ jsxs("div", { className: cx("hrl-nuevo", "hrl-login", fondo && fondo !== "none" && `hrl-login--${fondo}`), children: [
    /* @__PURE__ */ jsx(Sprite, {}),
    /* @__PURE__ */ jsx("main", { className: "hrl-login__tarjeta", children })
  ] });
}
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
function LoginScreen({ systemName, onSubmit, backdrop = "auto", labels, footer }) {
  const t = { ...TEXTOS, ...labels };
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { error, enviando, enviar } = useEnvio();
  return /* @__PURE__ */ jsxs(Pantalla, { backdrop, children: [
    /* @__PURE__ */ jsx(HrlLogo, { width: 260, className: "hrl-login__logo" }),
    systemName && /* @__PURE__ */ jsx("p", { className: "hrl-login__subtitulo", children: systemName }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        className: "hrl-login__form",
        onSubmit: (e) => {
          e.preventDefault();
          enviar(() => onSubmit({ username: username.trim(), password }));
        },
        children: [
          error && /* @__PURE__ */ jsx(Alert, { tone: "error", title: t.errorTitle, children: error }),
          /* @__PURE__ */ jsx(Input, { label: t.username, required: true, autoFocus: true, autoComplete: "username", value: username, onChange: (e) => setUsername(e.target.value) }),
          /* @__PURE__ */ jsx(Input, { label: t.password, kind: "password", required: true, autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value) }),
          /* @__PURE__ */ jsx(Button, { type: "submit", tone: "cta", loading: enviando, loadingText: t.submitting, className: "hrl-login__enviar", children: t.submit })
        ]
      }
    ),
    footer && /* @__PURE__ */ jsx("div", { className: "hrl-login__pie", children: footer })
  ] });
}
function ChangePasswordScreen({ systemName, onSubmit, backdrop = "auto", minLength = 8, labels, footer }) {
  const t = { ...TEXTOS, ...labels };
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const { error, setError, enviando, enviar } = useEnvio();
  return /* @__PURE__ */ jsxs(Pantalla, { backdrop, children: [
    /* @__PURE__ */ jsx(HrlLogo, { width: 260, className: "hrl-login__logo" }),
    systemName && /* @__PURE__ */ jsx("p", { className: "hrl-login__subtitulo", children: systemName }),
    /* @__PURE__ */ jsx("h1", { className: "hrl-login__titulo", children: t.changeTitle }),
    /* @__PURE__ */ jsx("p", { className: "hrl-login__intro", children: t.changeIntro }),
    /* @__PURE__ */ jsxs(
      "form",
      {
        className: "hrl-login__form",
        onSubmit: (e) => {
          e.preventDefault();
          if (next !== repeat) {
            setError(t.mismatch);
            return;
          }
          enviar(() => onSubmit({ current, next }));
        },
        children: [
          error && /* @__PURE__ */ jsx(Alert, { tone: "error", title: t.changeErrorTitle, children: error }),
          /* @__PURE__ */ jsx(Input, { label: t.current, kind: "password", required: true, autoFocus: true, autoComplete: "current-password", value: current, onChange: (e) => setCurrent(e.target.value) }),
          /* @__PURE__ */ jsx(Input, { label: `${t.next} (m\xEDnimo ${minLength} caracteres)`, kind: "password", required: true, autoComplete: "new-password", value: next, onChange: (e) => setNext(e.target.value) }),
          /* @__PURE__ */ jsx(Input, { label: t.repeat, kind: "password", required: true, autoComplete: "new-password", value: repeat, onChange: (e) => setRepeat(e.target.value) }),
          /* @__PURE__ */ jsx(Button, { type: "submit", tone: "cta", loading: enviando, loadingText: t.saving, className: "hrl-login__enviar", children: t.save })
        ]
      }
    ),
    footer && /* @__PURE__ */ jsx("div", { className: "hrl-login__pie", children: footer })
  ] });
}
export {
  ChangePasswordScreen,
  LOGIN_BACKDROPS,
  LoginScreen,
  backdropForHour
};
//# sourceMappingURL=LoginScreen.js.map
