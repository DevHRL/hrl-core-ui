/* Registro único de iconos del sistema.

   Ningún módulo puede traer iconos por su cuenta: si hace falta uno nuevo, se
   añade aquí y se declara en ICONS. Así todos los sistemas que usen esta
   plantilla comparten el mismo trazo y el mismo grosor.

   Los trazos actuales vienen del handoff de diseño y son provisionales; el día
   que se adopte un set definitivo (lucide, phosphor…) se sustituyen los
   <symbol> de este archivo y nada más del código cambia, porque todo el
   sistema pide los iconos por nombre.

   Uso:
     <IconSprite />        una vez, en la raíz de la aplicación
     <Icon name="sh-eye" size={16} />
*/

import { memo } from 'react';
import { ICONS, ICON_ALIASES } from './icon-catalog.js';
import { aliasObsoleto } from './deprecated.js';

/* Memorizado: no recibe nada y no cambia nunca, pero el AppShell lo monta y
   cada vez que el shell se repintaba (plegar el menú, abrir un cajón) React
   recorría de nuevo los cientos de nodos de todos los iconos. */
export const IconSprite = memo(function IconSprite() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
      <symbol id="sh-diamond" viewBox="0 0 24 24">
        <path d="M12 4l8 8-8 8-8-8z" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      </symbol>
      <symbol id="sh-check" viewBox="0 0 24 24">
        <path d="M4 13l5 5L20 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-lines" viewBox="0 0 24 24">
        <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-pie" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 3.5V12h8.5A8.5 8.5 0 0 0 12 3.5z" fill="currentColor" />
      </symbol>
      <symbol id="sh-table" viewBox="0 0 24 24">
        <rect x="4" y="5" width="16" height="14" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 10h16M4 14.5h16M12 10v9" stroke="currentColor" strokeWidth="1.4" />
      </symbol>
      <symbol id="sh-swap" viewBox="0 0 24 24">
        <path d="M4 9h13l-3-3M20 15H7l3 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-bell" viewBox="0 0 24 24">
        <path d="M6 17V11a6 6 0 1 1 12 0v6l1.5 2h-15z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M10 20a2 2 0 0 0 4 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </symbol>
      <symbol id="sh-close" viewBox="0 0 24 24">
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-chevron" viewBox="0 0 24 24">
        <path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-crit" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.18" />
        <path d="M12 7.5v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="16.6" r="1.2" fill="currentColor" />
      </symbol>
      <symbol id="sh-eye" viewBox="0 0 24 24">
        <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </symbol>
      <symbol id="sh-eye-off" viewBox="0 0 24 24">
        <path d="M2.5 12S6 6.5 12 6.5 21.5 12 21.5 12 18 17.5 12 17.5 2.5 12 2.5 12z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 4l16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-chevron-down" viewBox="0 0 24 24">
        <path d="M6 9l6 7 6-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-info" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="7.8" r="1.2" fill="currentColor" />
        <path d="M12 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-upload" viewBox="0 0 24 24">
        <path d="M12 16V4M8 8l4-4 4 4M5 19h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-trash" viewBox="0 0 24 24">
        <path d="M5 7h14M9 7V5h6v2M7 7l1 13h8l1-13" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-doc" viewBox="0 0 24 24">
        <rect x="5" y="3" width="14" height="18" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 9h6M9 13h6M9 17h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-ok" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.18" />
        <path d="M7.5 12.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-warn" viewBox="0 0 24 24">
        <path d="M12 4l9 16H3z" fill="currentColor" opacity="0.18" />
        <path d="M12 4l9 16H3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 10v4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="12" cy="17.3" r="1.1" fill="currentColor" />
      </symbol>
      <symbol id="sh-export" viewBox="0 0 24 24">
        <path d="M12 4v12M8 12l4 4 4-4M5 20h14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-expand" viewBox="0 0 24 24">
        <path d="M4 10V4h6M20 14v6h-6M4 4l6 6M20 20l-6-6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-chart" viewBox="0 0 24 24">
        <rect x="4" y="13" width="4" height="7" rx="1.2" fill="currentColor" />
        <rect x="10" y="8" width="4" height="12" rx="1.2" fill="currentColor" opacity="0.65" />
        <rect x="16" y="4" width="4" height="16" rx="1.2" fill="currentColor" opacity="0.4" />
      </symbol>
      <symbol id="sh-none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" />
        <path d="M8.5 12h7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-people" viewBox="0 0 24 24">
        <circle cx="9" cy="9" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3.5 19a5.5 5.5 0 0 1 11 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16 6.2a3.2 3.2 0 0 1 0 5.6M17 14.4a5.5 5.5 0 0 1 3.5 4.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-calendar" viewBox="0 0 24 24">
        <rect x="3" y="6" width="18" height="15" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-flask" viewBox="0 0 24 24">
        <path d="M9 4h6v4l4 9a2 2 0 0 1-1.8 3H6.8A2 2 0 0 1 5 17l4-9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-pulse" viewBox="0 0 24 24">
        <path d="M3 12h3l2.5-6 3.5 12 3-8 2 2h4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-clock" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 7.5V12l3.5 2" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-home" viewBox="0 0 24 24">
        <path d="M4 11l8-6 8 6v8a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19z" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-profile" viewBox="0 0 24 24">
        <rect x="4" y="4" width="16" height="16" rx="3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="10" r="2.4" fill="currentColor" />
        <path d="M7.5 17a4.5 4.5 0 0 1 9 0" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </symbol>
      <symbol id="sh-folder" viewBox="0 0 24 24">
        <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </symbol>
      <symbol id="sh-bill" viewBox="0 0 24 24">
        <path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9.5 8h5M9.5 12h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-shield" viewBox="0 0 24 24">
        <path d="M12 3l7 3v6c0 4.4-3 7.8-7 9-4-1.2-7-4.6-7-9V6z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <circle cx="12" cy="11" r="1.6" fill="currentColor" />
        <path d="M12 12.8V15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-gear" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path
          d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21M5.6 5.6l1.6 1.6M16.8 16.8l1.6 1.6M18.4 5.6l-1.6 1.6M7.2 16.8l-1.6 1.6"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </symbol>
      <symbol id="sh-sidebar-collapse" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M9 5v14" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16.4 10l-2.4 2 2.4 2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      {/* Pictogramas de área y de flujo documental, traídos del prototipo de
          Reporte Estadístico. */}
      <symbol id="sh-pill" viewBox="0 0 24 24">
        <rect x="3" y="8.5" width="18" height="7" rx="3.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 12a3.5 3.5 0 0 1 3.5-3.5H12v7H6.5A3.5 3.5 0 0 1 3 12z" fill="currentColor" opacity="0.22" />
        <path d="M12 8.5v7" stroke="currentColor" strokeWidth="1.6" />
      </symbol>
      <symbol id="sh-drop" viewBox="0 0 24 24">
        <path d="M12 3.4s6 6.4 6 10.3a6 6 0 0 1-12 0c0-3.9 6-10.3 6-10.3z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 17.6a3.6 3.6 0 0 0 3.6-3.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-scalpel" viewBox="0 0 24 24">
        <path d="M14 11l6-6.5a1.9 1.9 0 0 1 2.6 2.6L16.2 13z" fill="currentColor" opacity="0.22" />
        <path d="M14 11l6-6.5a1.9 1.9 0 0 1 2.6 2.6L16.2 13z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M13.4 11.6L3.6 20.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-washer" viewBox="0 0 24 24">
        <rect x="4.5" y="3.5" width="15" height="17" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4.5 8h15" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="5.7" r="1" fill="currentColor" />
        <circle cx="11.2" cy="5.7" r="1" fill="currentColor" />
        <circle cx="12" cy="14.4" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9.6 14.5a2.4 2.4 0 0 1 4.8 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-cutlery" viewBox="0 0 24 24">
        <path d="M7 3v5.2a2.2 2.2 0 0 0 4.4 0V3M9.2 10.6V21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <path d="M9.2 3.2v5.2" stroke="currentColor" strokeWidth="1.3" />
        <path d="M16.6 21V3c2 1.7 2.6 4.1 2.4 6.5-.2 2-1.2 3-2.4 3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-xray" viewBox="0 0 24 24">
        <rect x="4" y="3.5" width="16" height="17" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M12 7v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M12 9.2c-2.4 0-3.6 1-4 2.2M12 9.2c2.4 0 3.6 1 4 2.2M12 13c-2.3 0-3.3.9-3.7 2M12 13c2.3 0 3.3.9 3.7 2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-wrench" viewBox="0 0 24 24">
        <path d="M13.9 10.3a4.5 4.5 0 0 1 6-5.8l-2.7 2.7.7 2.7 2.7.7a4.5 4.5 0 0 1-5.8 6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.8 13.6L5.9 20.4a1.9 1.9 0 0 1-2.7-2.7l6.8-7.9" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-baby" viewBox="0 0 24 24">
        <circle cx="12" cy="7.8" r="4.3" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="10.4" cy="7.4" r="0.9" fill="currentColor" />
        <circle cx="13.6" cy="7.4" r="0.9" fill="currentColor" />
        <path d="M10.6 10.1a2.3 2.3 0 0 0 2.8 0" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M5.5 20.5a6.5 6.5 0 0 1 13 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-send" viewBox="0 0 24 24">
        <path d="M21 3L3 10.6l7.2 3.2L13.4 21z" fill="currentColor" opacity="0.18" />
        <path d="M21 3L3 10.6l7.2 3.2L13.4 21z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M21 3l-10.8 10.8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-share" viewBox="0 0 24 24">
        <path d="M7.2 11.2L17 6.2M7.2 12h9.8M7.2 12.8L17 17.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="5" cy="12" r="2.3" fill="currentColor" />
        <circle cx="19" cy="5.6" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="19" cy="12" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="19" cy="18.4" r="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      </symbol>
      <symbol id="sh-stamp" viewBox="0 0 24 24">
        <path d="M8 3.5h8v4.2a2 2 0 0 1-.6 1.4L14 10.5V13h-4v-2.5L8.6 9.1A2 2 0 0 1 8 7.7z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <rect x="4" y="14" width="16" height="3.6" rx="1.4" fill="currentColor" opacity="0.22" />
        <rect x="4" y="14" width="16" height="3.6" rx="1.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M5 20.6h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-traffic-light" viewBox="0 0 24 24">
        <rect x="3.5" y="3.5" width="5" height="5" rx="1.5" fill="currentColor" />
        <rect x="9.5" y="3.5" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.45" />
        <rect x="15.5" y="3.5" width="5" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <rect x="3.5" y="9.5" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.45" />
        <rect x="9.5" y="9.5" width="5" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <rect x="15.5" y="9.5" width="5" height="5" rx="1.5" fill="currentColor" />
        <rect x="3.5" y="15.5" width="5" height="5" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9.5" y="15.5" width="5" height="5" rx="1.5" fill="currentColor" />
        <rect x="15.5" y="15.5" width="5" height="5" rx="1.5" fill="currentColor" opacity="0.45" />
      </symbol>
      <symbol id="sh-bulletin" viewBox="0 0 24 24">
        <rect x="4.5" y="3" width="15" height="18" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8 7h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <rect x="8" y="13" width="2.6" height="4.6" rx="0.9" fill="currentColor" />
        <rect x="11.7" y="10.8" width="2.6" height="6.8" rx="0.9" fill="currentColor" opacity="0.6" />
        <rect x="15.4" y="12" width="2.6" height="5.6" rx="0.9" fill="currentColor" opacity="0.38" />
      </symbol>
      <symbol id="sh-inbox" viewBox="0 0 24 24">
        <path d="M3.5 13.6l2.6-7A2 2 0 0 1 8 5.2h8a2 2 0 0 1 1.9 1.4l2.6 7v3.9a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M3.5 13.6h4l1.4 2.4h6.2l1.4-2.4h4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </symbol>
      <symbol id="sh-pencil" viewBox="0 0 24 24">
        <path d="M4 20l.9-4 11-11a2.2 2.2 0 0 1 3.1 3.1L8 19.1z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M14.3 6.7l3 3" stroke="currentColor" strokeWidth="1.5" />
      </symbol>
      <symbol id="sh-scissors" viewBox="0 0 24 24">
        <circle cx="6.6" cy="17.9" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.4" cy="17.9" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M8.5 16L19 3.4M15.5 16L5 3.4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </symbol>
      <symbol id="sh-box" viewBox="0 0 24 24">
        <path d="M3.5 7.6L12 3.4l8.5 4.2v8.8L12 20.6l-8.5-4.2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M3.5 7.6L12 11.8l8.5-4.2M12 11.8v8.8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </symbol>
    </svg>
  );
});

export function Icon({ name: nombrePedido, size = 19, className, style, title }) {
  const name = aliasObsoleto(ICON_ALIASES, nombrePedido, 'Icon');
  if (import.meta.env?.DEV && !ICONS.includes(name)) {
    console.warn(`Icon: «${name}» no está en el registro. Añádelo a icons.jsx y a icon-catalog.js, o usa uno de: ${ICONS.join(', ')}`);
  }

  /* Decorativo por defecto: el significado lo da el texto que acompaña al
     icono. Con `title` pasa a ser contenido con nombre accesible. */
  return (
    <svg
      width={size}
      height={size}
      className={className}
      style={style}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      {title && <title>{title}</title>}
      <use href={`#${name}`} />
    </svg>
  );
}

/* Alias de compatibilidad: el nombre anterior del sprite. */
export { IconSprite as Sprite };
export { ICONS } from './icon-catalog.js';
