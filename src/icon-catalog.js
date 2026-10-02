/* Nombres de icono aprobados.

   Vive fuera de icons.jsx porque un archivo de componentes solo puede exportar
   componentes si se quiere que funcione el refresco en caliente.

   Añadir un icono es un acto deliberado: se dibuja el <symbol> en icons.jsx y
   se declara su nombre aquí. Pedir uno que no esté en la lista avisa en
   desarrollo en lugar de pintar un hueco en silencio. */
export const ICONS = Object.freeze([
  'sh-diamond',
  'sh-check',
  'sh-lines',
  'sh-pie',
  'sh-table',
  'sh-swap',
  'sh-bell',
  'sh-close',
  'sh-chevron',
  'sh-crit',
  'sh-eye',
  'sh-eye-off',
  'sh-chevron-down',
  'sh-info',
  'sh-upload',
  'sh-trash',
  'sh-doc',
  'sh-ok',
  'sh-warn',
  'sh-export',
  'sh-expand',
  'sh-chart',
  'sh-none',
  'sh-people',
  'sh-calendar',
  'sh-flask',
  'sh-pulse',
  'sh-clock',
  'sh-home',
  'sh-profile',
  'sh-folder',
  'sh-bill',
  'sh-shield',
  'sh-gear',
  'sh-sidebar-collapse',

  /* Pictogramas de área y de flujo documental. */
  'sh-pill',
  'sh-drop',
  'sh-scalpel',
  'sh-washer',
  'sh-cutlery',
  'sh-xray',
  'sh-wrench',
  'sh-baby',
  'sh-send',
  'sh-share',
  'sh-stamp',
  'sh-traffic-light',
  'sh-bulletin',
  'sh-inbox',
  'sh-pencil',
  'sh-scissors',
  'sh-box'
]);

/* Nombres anteriores, en español, de iconos ya renombrados. Se siguen
   aceptando y avisan en desarrollo (ver deprecated.js); se retiran en la
   próxima versión mayor. */
export const ICON_ALIASES = Object.freeze({
  'sh-chevron-abajo': 'sh-chevron-down',
  'sh-plegar': 'sh-sidebar-collapse',
  'sh-pastilla': 'sh-pill',
  'sh-gota': 'sh-drop',
  'sh-bisturi': 'sh-scalpel',
  'sh-lavadora': 'sh-washer',
  'sh-cubiertos': 'sh-cutlery',
  'sh-radiografia': 'sh-xray',
  'sh-llave': 'sh-wrench',
  'sh-bebe': 'sh-baby',
  'sh-enviar': 'sh-send',
  'sh-remitir': 'sh-share',
  'sh-sello': 'sh-stamp',
  'sh-semaforo': 'sh-traffic-light',
  'sh-boletin': 'sh-bulletin',
  'sh-bandeja': 'sh-inbox',
  'sh-lapiz': 'sh-pencil',
  'sh-tijeras': 'sh-scissors',
  'sh-caja': 'sh-box',
});
