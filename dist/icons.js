import { jsx, jsxs } from "react/jsx-runtime";
import { memo } from "react";
import { ICONS, ICON_ALIASES } from "./icon-catalog.js";
import { aliasObsoleto } from "./deprecated.js";
function P({ d, opacity }) {
  return /* @__PURE__ */ jsx("path", { d, fill: "currentColor", fillRule: "evenodd", opacity });
}
const IconSprite = memo(function IconSprite2() {
  return /* @__PURE__ */ jsxs("svg", { width: "0", height: "0", style: { position: "absolute" }, "aria-hidden": "true", children: [
    /* @__PURE__ */ jsx("symbol", { id: "sh-diamond", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2.5l9.5 9.5-9.5 9.5L2.5 12zM12 9.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-check", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M9.4 18.6L3.6 12.8l1.9-1.9 3.9 3.9 9.1-9.1 1.9 1.9z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-lines", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M3 5.5h18v2.4H3zm0 5.3h18v2.4H3zm0 5.3h18v2.4H3z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-pie", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M10.8 3.1A9 9 0 1 0 20.9 13.2H10.8z" }),
      /* @__PURE__ */ jsx(P, { d: "M13 2.1v8.9h8.9A9 9 0 0 0 13 2.1z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-table", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 6.5V13h6V9.5zm8 0V13h6V9.5zM5 15v4h6v-4zm8 0v4h6v-4z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-swap", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M15.5 2.8l5.5 4.9-5.5 4.9V9.1H4V6.3h11.5z" }),
      /* @__PURE__ */ jsx(P, { d: "M8.5 11.4l-5.5 4.9 5.5 4.9v-3.5H20v-2.8H8.5z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-bell", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2a6 6 0 0 0-6 6v3.6L4 15v1.4h16V15l-2-3.4V8a6 6 0 0 0-6-6zm0 20a3 3 0 0 0 2.9-2.3H9.1A3 3 0 0 0 12 22z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-close", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M6.3 4.3L12 10l5.7-5.7 2 2L14 12l5.7 5.7-2 2L12 14l-5.7 5.7-2-2L10 12 4.3 6.3z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-chevron", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M9 5.2l7 6.8-7 6.8z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-arrow-right", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M13.2 5.3L20 12l-6.8 6.7-1.7-1.7 3.8-3.8H4v-2.4h11.3L11.5 7z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-crit", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 4.6h2.4v8h-2.4zm0 10h2.4V19h-2.4z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-eye", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 5C6.6 5 2.8 9.2 1.5 12c1.3 2.8 5.1 7 10.5 7s9.2-4.2 10.5-7C21.2 9.2 17.4 5 12 5zm0 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-eye-off", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M12 5C6.6 5 2.8 9.2 1.5 12c.7 1.5 2.1 3.4 4.1 4.9L16.9 5.6A10.9 10.9 0 0 0 12 5zm6.4 2.1L7.1 18.4c1.4.4 3 .6 4.9.6 5.4 0 9.2-4.2 10.5-7-.8-1.7-2.2-3.5-4.1-4.9z" }),
      /* @__PURE__ */ jsx(P, { d: "M3.3 2l18.7 18.7-1.4 1.4L2 3.4z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-chevron-down", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M5.2 9h13.6L12 16z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-info", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 8.4h2.4V17.4h-2.4zm0-3.8h2.4V9h-2.4z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-upload", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M12 2.6l6.4 6.6h-4.3v6.6H9.9V9.2H5.6z" }),
      /* @__PURE__ */ jsx(P, { d: "M3.5 16.6h2.6v2.2h11.8v-2.2h2.6v4.8h-17z" })
    ] }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-trash", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M9 2.5h6l1 2h4.5v2.6h-17V4.5H8z" }),
      /* @__PURE__ */ jsx(P, { d: "M5.2 8.6h13.6l-1.1 11.5a2 2 0 0 1-2 1.9H8.3a2 2 0 0 1-2-1.9zm4.1 2.6v7.6h1.9v-7.6zm3.5 0v7.6h1.9v-7.6z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-doc", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M6 2h8.2L20 7.8V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm2 9.2v1.9h8v-1.9zm0 3.7v1.9h8v-1.9zm0 3.7v1.6h5v-1.6z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-ok", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.1 14.3L6.6 12l1.7-1.7 2.6 2.6 5.6-5.6 1.7 1.7z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-warn", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2.2l10.6 19H1.4zm-1.2 6.4v6.4h2.4V8.6zm0 8.2v2.4h2.4v-2.4z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-export", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M10.6 2.5h2.8v8.7h4.3L12 17.1l-5.7-5.9h4.3z" }),
      /* @__PURE__ */ jsx(P, { d: "M3.5 16.6h2.6v2.2h11.8v-2.2h2.6v4.8h-17z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-expand", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M3.5 3.5h7.2v2.6H7.9l3.6 3.6-1.8 1.8-3.6-3.6v2.8H3.5zm17 17h-7.2v-2.6h2.8l-3.6-3.6 1.8-1.8 3.6 3.6v-2.8h2.6z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-chart", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M3.5 12.5h4.6v8.5H3.5zm6.2-6.5h4.6v15H9.7zm6.2 3.2h4.6V21h-4.6z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-none", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-4.8 8.8v2.4h9.6v-2.4z", opacity: "0.55" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-people", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M8.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM17 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM2 20v-1.4c0-2.5 2.9-4.6 6.5-4.6S15 16.1 15 18.6V20zm15 0v-1.4c0-1.3-.5-2.5-1.4-3.4 2.9.3 5.4 2 5.4 4.1V20z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-calendar", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M7 2h2.4v2.2h5.2V2H17v2.2h2a2 2 0 0 1 2 2V8H3V6.2a2 2 0 0 1 2-2h2z" }),
      /* @__PURE__ */ jsx(P, { d: "M3 9.6h18V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zm3.5 3.2v2.6h2.6v-2.6zm4.2 0v2.6h2.6v-2.6zm4.2 0v2.6h2.6v-2.6zm-8.4 4v2.6h2.6v-2.6zm4.2 0v2.6h2.6v-2.6z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-flask", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M8.6 2h6.8v2.4h-1.2v4.1l5.4 9.3A2.2 2.2 0 0 1 17.7 21H6.3a2.2 2.2 0 0 1-1.9-3.2l5.4-9.3V4.4H8.6zm.9 11.4l-2.6 4.4h10.2l-2.6-4.4z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-pulse", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zm0 8.2v1.6h4l1-2.4 3 7 2.3-4.6H19v-1.6h-4.7l-1.3 2.4-3-7-2 4.6z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-clock", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm-1.2 4.8h2.4v4.5l3.9 2.3-1.2 2.1-5.1-3z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-home", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2.6l9.4 7.6V20a1.8 1.8 0 0 1-1.8 1.8h-5V15.2H9.4v6.6h-5A1.8 1.8 0 0 1 2.6 20v-9.8z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-profile", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zm0 2c-4.6 0-8 2.3-8 5.1V21h16v-1.9c0-2.8-3.4-5.1-8-5.1z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-folder", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M2.5 6A2 2 0 0 1 4.5 4h5.1l2.2 2.2h7.7a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-15a2 2 0 0 1-2-2z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-bill", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M5 2h14v20l-2.3-1.6-2.4 1.6-2.3-1.6-2.3 1.6-2.4-1.6L5 22zm3 5v1.9h8V7zm0 4v1.9h8V11zm0 4v1.9h5V15z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-shield", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2l8.2 3.3v6.3c0 5-3.5 9.2-8.2 10.4-4.7-1.2-8.2-5.4-8.2-10.4V5.3zm0 6.2a2 2 0 0 0-1.1 3.7V15h2.2v-3.1A2 2 0 0 0 12 8.2z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-gear", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M10.5 2h3l.5 2.6 1.9.8 2.2-1.5 2.1 2.1-1.5 2.2.8 1.9 2.5.4v3l-2.5.5-.8 1.9 1.5 2.2-2.1 2.1-2.2-1.5-1.9.8-.5 2.5h-3l-.5-2.5-1.9-.8-2.2 1.5-2.1-2.1 1.5-2.2-.8-1.9L2 13.5v-3l2.6-.5.8-1.9-1.5-2.2 2.1-2.1 2.2 1.5 1.9-.8zM12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-sidebar-collapse", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M5 3.5h14a2.5 2.5 0 0 1 2.5 2.5v12a2.5 2.5 0 0 1-2.5 2.5H5A2.5 2.5 0 0 1 2.5 18V6A2.5 2.5 0 0 1 5 3.5zm5 2.4v12.2h9.1V5.9z" }),
      /* @__PURE__ */ jsx(P, { d: "M17 8.6v6.8L13.2 12z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-pill", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxs("g", { transform: "rotate(-40 12 12)", children: [
      /* @__PURE__ */ jsx(P, { d: "M7.4 7.4h3.8v9.2H7.4a4.6 4.6 0 0 1 0-9.2z" }),
      /* @__PURE__ */ jsx(P, { d: "M12.8 7.4h3.8a4.6 4.6 0 0 1 0 9.2h-3.8z", opacity: "0.6" })
    ] }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-drop", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 2.4s7.2 7.4 7.2 12.2a7.2 7.2 0 0 1-14.4 0C4.8 9.8 12 2.4 12 2.4zm-4.4 12a4.4 4.4 0 0 0 4.4 4.4v-1.9a2.5 2.5 0 0 1-2.5-2.5z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-scalpel", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M13 10.6l6.4-6.8a2.2 2.2 0 0 1 3.1 3.1l-6.8 6.4z" }),
      /* @__PURE__ */ jsx(P, { d: "M12 11.6l1.6 1.6-9.1 8.6a1.5 1.5 0 0 1-2.2-2.1z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-washer", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M6.4 2h11.2A2.4 2.4 0 0 1 20 4.4v15.2a2.4 2.4 0 0 1-2.4 2.4H6.4A2.4 2.4 0 0 1 4 19.6V4.4A2.4 2.4 0 0 1 6.4 2zm.6 2.6v2h2v-2zm3.2 0v2h2v-2zM12 9a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-cutlery", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M4.6 2h1.6v5.6h1.2V2H9v5.6h1.2V2h1.6v6.8a3.1 3.1 0 0 1-2.3 3V22H6.9V11.8a3.1 3.1 0 0 1-2.3-3z" }),
      /* @__PURE__ */ jsx(P, { d: "M15.6 2c3 1.5 4.4 4.5 4.4 7.9 0 2.3-1 3.6-2.1 4V22h-2.3z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-xray", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M6.4 2h11.2A2.4 2.4 0 0 1 20 4.4v15.2a2.4 2.4 0 0 1-2.4 2.4H6.4A2.4 2.4 0 0 1 4 19.6V4.4A2.4 2.4 0 0 1 6.4 2zm4.8 3.4v13.2h1.6V5.4zM6.8 8.6V10h3.6V8.6zm6.8 0V10h3.6V8.6zm-6.2 3.8v1.4h3v-1.4zm6.2 0v1.4h3v-1.4z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-wrench", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M15.8 2.6a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8zm.7.6l-2.3 2.3 4.3 4.3 2.3-2.3z" }),
      /* @__PURE__ */ jsx(P, { d: "M10.6 11.6l1.8 1.8-7.6 7.7a1.6 1.6 0 0 1-2.3-2.3z" })
    ] }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-baby", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M12 2.4a4.9 4.9 0 1 0 0 9.8 4.9 4.9 0 0 0 0-9.8zm-1.6 3.8a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9zm3.2 0a.95.95 0 1 1 0 1.9.95.95 0 0 1 0-1.9zm-3.3 3.1h3.4a1.7 1.7 0 0 1-3.4 0z" }),
      /* @__PURE__ */ jsx(P, { d: "M4.6 21.6a7.4 7.4 0 0 1 14.8 0z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-send", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M2 21l20-9L2 3v7l13 2-13 2z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-share", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M6 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm12-7a3 3 0 1 1 0 6 3 3 0 0 1 0-6zm0 14a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" }),
      /* @__PURE__ */ jsx(P, { d: "M7.6 10.4l8.6-4.7 1 1.8-8.6 4.7zm1 1.4l8.6 4.7-1 1.8-8.6-4.7z" })
    ] }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-stamp", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M9 2h6a1 1 0 0 1 1 1v4.4a2.6 2.6 0 0 1-1.4 2.3l-.6.3V13h-4v-3l-.6-.3A2.6 2.6 0 0 1 8 7.4V3a1 1 0 0 1 1-1z" }),
      /* @__PURE__ */ jsx(P, { d: "M4 14.2h16a1 1 0 0 1 1 1v3H3v-3a1 1 0 0 1 1-1zM4 19.6h16V22H4z" })
    ] }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-traffic-light", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M5 3.5h2a1.5 1.5 0 0 1 1.5 1.5v2A1.5 1.5 0 0 1 7 8.5H5A1.5 1.5 0 0 1 3.5 7V5A1.5 1.5 0 0 1 5 3.5zm12 6h2a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-2a1.5 1.5 0 0 1-1.5-1.5v-2A1.5 1.5 0 0 1 17 9.5zm-6 6h2a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 9.5 19v-2a1.5 1.5 0 0 1 1.5-1.5z" }),
      /* @__PURE__ */ jsx(P, { d: "M11 3.5h2A1.5 1.5 0 0 1 14.5 5v2A1.5 1.5 0 0 1 13 8.5h-2A1.5 1.5 0 0 1 9.5 7V5A1.5 1.5 0 0 1 11 3.5zm-6 6h2A1.5 1.5 0 0 1 8.5 11v2A1.5 1.5 0 0 1 7 14.5H5A1.5 1.5 0 0 1 3.5 13v-2A1.5 1.5 0 0 1 5 9.5zm12 6h2a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-2a1.5 1.5 0 0 1-1.5-1.5v-2a1.5 1.5 0 0 1 1.5-1.5z", opacity: "0.55" }),
      /* @__PURE__ */ jsx(P, { d: "M17 3.5h2A1.5 1.5 0 0 1 20.5 5v2A1.5 1.5 0 0 1 19 8.5h-2A1.5 1.5 0 0 1 15.5 7V5A1.5 1.5 0 0 1 17 3.5zm-6 6h2a1.5 1.5 0 0 1 1.5 1.5v2a1.5 1.5 0 0 1-1.5 1.5h-2A1.5 1.5 0 0 1 9.5 13v-2A1.5 1.5 0 0 1 11 9.5zm-6 6h2A1.5 1.5 0 0 1 8.5 17v2A1.5 1.5 0 0 1 7 20.5H5A1.5 1.5 0 0 1 3.5 19v-2A1.5 1.5 0 0 1 5 15.5z", opacity: "0.25" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-bulletin", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M6.4 2h11.2A2.4 2.4 0 0 1 20 4.4v15.2a2.4 2.4 0 0 1-2.4 2.4H6.4A2.4 2.4 0 0 1 4 19.6V4.4A2.4 2.4 0 0 1 6.4 2zm1.2 3.4v1.9h8.8V5.4zm0 7.6v5h2.6v-5zm3.7-3v8h2.6v-8zm3.7 2v6h2.6v-6z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-inbox", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M7.8 3.5h8.4a2 2 0 0 1 1.9 1.4L21 13v5.5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V13l2.9-8.1a2 2 0 0 1 1.9-1.4zm.4 2.4L6 12.2h3.6l1.2 2h2.4l1.2-2H18l-2.2-6.3z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-pencil", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M15.4 3.2a2.4 2.4 0 0 1 3.4 0l2 2a2.4 2.4 0 0 1 0 3.4L9.6 19.8l-5.9 1.5 1.5-5.9z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-scissors", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M6.5 14.4a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2zm0 2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2zm11-2a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2zm0 2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2z" }),
      /* @__PURE__ */ jsx(P, { d: "M8.2 15.2L18.6 2.4l1.5 1.2L9.8 16.6zm7.6 0L5.4 2.4 3.9 3.6l10.3 13z" })
    ] }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-box", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M12 2.4l8.8 4.4L12 11.2 3.2 6.8z" }),
      /* @__PURE__ */ jsx(P, { d: "M2.5 8.5l8.7 4.3v9L2.5 17.5zm19 0v9l-8.7 4.3v-9z", opacity: "0.7" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-search", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M10 2a8 8 0 0 1 6.3 12.9l5.1 5.1-1.7 1.7-5.1-5.1A8 8 0 1 1 10 2zm0 2.6a5.4 5.4 0 1 0 0 10.8 5.4 5.4 0 0 0 0-10.8z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-plus", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M10.7 4h2.6v6.7H20v2.6h-6.7V20h-2.6v-6.7H4v-2.6h6.7z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-sort", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M12 3.5l5 6H7zm0 17l-5-6h10z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-logout", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M5 3h8a2 2 0 0 1 2 2v3h-2.6V5.6H5.6v12.8h6.8V16H15v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" }),
      /* @__PURE__ */ jsx(P, { d: "M16.4 7.6L21 12l-4.6 4.4v-3.1H9v-2.6h7.4z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-more", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M5.5 9.8a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4zm6.5 0a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4zm6.5 0a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-refresh", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M12 4A8 8 0 0 0 4.1 10.7l2.4.4A5.6 5.6 0 0 1 16.2 8.2l-2.6 2.6H21V3.4l-3.1 3.1A8 8 0 0 0 12 4z" }),
      /* @__PURE__ */ jsx(P, { d: "M12 20a8 8 0 0 0 7.9-6.7l-2.4-.4a5.6 5.6 0 0 1-9.7 2.9l2.6-2.6H3v7.4l3.1-3.1A8 8 0 0 0 12 20z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-stethoscope", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M5 2.5h2.4v6.3a3.6 3.6 0 0 0 7.2 0V2.5H17v6.3a6 6 0 0 1-4.8 5.9v1.8a3.3 3.3 0 0 0 6.6 0v-1.1a2.8 2.8 0 1 1 2.4 0v1.1a5.7 5.7 0 0 1-11.4 0v-1.8A6 6 0 0 1 5 8.8zm15 9.1a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z" }) }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-door", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M6 2.5h12a1 1 0 0 1 1 1v16.1h2V22H3v-2.4h2V3.5a1 1 0 0 1 1-1zm8.6 8.3a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z" }) }),
    /* @__PURE__ */ jsxs("symbol", { id: "sh-print", viewBox: "0 0 24 24", children: [
      /* @__PURE__ */ jsx(P, { d: "M7 2.5h10V7H7z" }),
      /* @__PURE__ */ jsx(P, { d: "M5 8.2h14a2 2 0 0 1 2 2V16h-2.8v-3.4H5.8V16H3v-5.8a2 2 0 0 1 2-2zm12.2 1.9a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" }),
      /* @__PURE__ */ jsx(P, { d: "M7.4 14.2h9.2v7.3H7.4z" })
    ] }),
    /* @__PURE__ */ jsx("symbol", { id: "sh-fullscreen", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsx(P, { d: "M3 3h6.5v2.4H5.4v4.1H3zm11.5 0H21v6.5h-2.4V5.4h-4.1zM21 21h-6.5v-2.4h4.1v-4.1H21zM3 21v-6.5h2.4v4.1h4.1V21z" }) })
  ] });
});
function Icon({ name: nombrePedido, size = 19, className, style, title }) {
  const name = aliasObsoleto(ICON_ALIASES, nombrePedido, "Icon");
  if (import.meta.env?.DEV && !ICONS.includes(name)) {
    console.warn(`Icon: \xAB${name}\xBB no est\xE1 en el registro. A\xF1\xE1delo a icons.jsx y a icon-catalog.js, o usa uno de: ${ICONS.join(", ")}`);
  }
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: size,
      height: size,
      className,
      style,
      role: title ? "img" : void 0,
      "aria-label": title,
      "aria-hidden": title ? void 0 : "true",
      children: [
        title && /* @__PURE__ */ jsx("title", { children: title }),
        /* @__PURE__ */ jsx("use", { href: `#${name}` })
      ]
    }
  );
}
import { ICONS as ICONS2 } from "./icon-catalog.js";
export {
  ICONS2 as ICONS,
  Icon,
  IconSprite,
  IconSprite as Sprite
};
//# sourceMappingURL=icons.js.map
