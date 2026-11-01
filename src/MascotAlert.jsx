import { useId } from 'react';
import { Icon } from './icons.jsx';
import { Mascot } from './Mascot.jsx';
import { cx } from './variants.js';

/* Aviso con Dr. Mochi: lo que el sistema necesita que alguien haga, dicho por
   la mascota del hospital. Va bajo la cabecera de la página, una sola vez:
   reemplaza a la franja de estado y a la banda verde de antes.

   Mochi a un lado, en su baldosa del color del tono, y al otro un globo de
   diálogo con la etiqueta (qué pasa, en una o dos palabras), el título (lo que
   hay que saber) y una línea de detalle. Las acciones van al extremo, a la
   altura del globo. El color nunca es la única señal: la etiqueta lleva su
   icono y su texto, y la cara de Mochi cambia con el estado.

     state    estado de Mascot: idle (pendiente), thinking (vence hoy),
              problem (vencido, error), done (enviado)
     tone     info | success | warning | danger: tiñe la baldosa y la etiqueta
     label    la etiqueta corta («Vence hoy», «Entregado»)
     icon     icono de la etiqueta (sh-…); por defecto, el del tono
     title    lo que hay que saber, en una frase
     children el detalle, una o dos líneas
     actions  nodos (Button): el principal con tone="cta"
     headingLevel  nivel del título (2 por defecto) */
const ICONO_DEL_TONO = { info: 'sh-info', success: 'sh-ok', warning: 'sh-warn', danger: 'sh-crit' };

export function MascotAlert({ state = 'idle', tone = 'info', label, icon, title, children, actions, headingLevel = 2, className }) {
  const id = useId();
  const Titulo = `h${Math.min(6, Math.max(2, Number(headingLevel) || 2))}`;
  return (
    <section className={cx('hrl-mochi-aviso', `hrl-mochi-aviso--${tone}`, className)} aria-labelledby={id}>
      <div className="hrl-mochi-aviso__mascota">
        <Mascot state={state} size={72} />
      </div>
      <div className="hrl-mochi-aviso__globo">
        {label && (
          <span className="hrl-mochi-aviso__etiqueta">
            <Icon name={icon ?? ICONO_DEL_TONO[tone] ?? 'sh-info'} size={14} />
            {label}
          </span>
        )}
        <Titulo className="hrl-mochi-aviso__titulo" id={id}>
          {title}
        </Titulo>
        {children && <p className="hrl-mochi-aviso__detalle">{children}</p>}
      </div>
      {actions && <div className="hrl-mochi-aviso__acciones">{actions}</div>}
    </section>
  );
}
