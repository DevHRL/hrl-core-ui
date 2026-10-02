import { Icon } from './icons.jsx';

/* El avance de un recorrido corto: círculos unidos por una línea.

   No es `Steps`. `Steps` son fichas que se pulsan, para un formulario largo
   que se llena en cualquier orden (los días de un mes). Esto es para un
   recorrido de pocos pasos que va hacia adelante —subir, revisar, enviar— y
   que se lee como una secuencia: dónde se está y qué falta. Salió del módulo
   de carga de Excel de Reporte Estadístico, donde las fichas de `Steps` no se
   entendían como pasos sucesivos.

   **No se pulsa.** Muestra el estado; moverse entre pasos lo hacen los botones
   de cada paso, que dicen qué va a pasar. Un círculo pulsable que lleva a un
   paso que todavía no se puede hacer es una promesa falsa.

   Minimalista a propósito: el círculo lleva el número, o un check de un solo
   trazo (`sh-check`) cuando el paso está listo, o un «!» si tiene errores.
   No usa `sh-ok` ni `sh-crit`: traen un disco tenue detrás que, dentro de un
   círculo de color, se veía como un segundo círculo de otro tono. El estado
   se dice además con la nota en texto, nunca solo con color. La línea que
   llega a un paso se pinta cuando el anterior está listo (`ok`). El paso
   activo lleva `aria-current="step"`.

     steps:  { key, title, note?, status }[]
     status: 'empty' | 'partial' | 'ok' | 'error'   (el mismo vocabulario que Steps)
     active: la `key` del paso en el que se está */

export function ProgressSteps({ steps = [], active, label = 'Pasos' }) {
  const activo = steps.findIndex((paso) => paso.key === active);

  return (
    <ol className="hrl-trayecto" aria-label={label} style={{ '--hrl-trayecto-pasos': steps.length || 1 }}>
      {steps.map((paso, i) => {
        const estado = paso.status ?? 'empty';
        const clases = ['hrl-trayecto__paso', `hrl-trayecto__paso--${estado}`, i === activo && 'hrl-trayecto__paso--on'].filter(Boolean);

        return (
          <li key={paso.key} className={clases.join(' ')} aria-current={i === activo ? 'step' : undefined}>
            <span className="hrl-trayecto__circulo" aria-hidden="true">
              {estado === 'ok' ? <Icon name="sh-check" size={14} /> : estado === 'error' ? '!' : i + 1}
            </span>
            <span className="hrl-trayecto__titulo">{paso.title}</span>
            {paso.note && <span className="hrl-trayecto__nota">{paso.note}</span>}
          </li>
        );
      })}
    </ol>
  );
}
