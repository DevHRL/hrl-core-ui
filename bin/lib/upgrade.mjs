/* `hrl-core-ui upgrade <vX.Y.Z|latest>`: sube la versión del kit sin sorpresas.

   Lo que hace por ti, y por qué:
   - Cambia el tag en package.json e instala. Un `npm install` puede subir, de
     paso, otras dependencias: se compara el lockfile y, si algo más cambió, se
     restaura y se reinstala para que solo cambie el kit.
   - Lee el CHANGELOG entre la versión anterior y la nueva: es lo que dice qué
     cambia de aspecto y qué nombres quedan obsoletos.
   - Refresca el bloque del kit en CLAUDE.md, y corre `doctor`. */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { doctor } from './doctor.mjs';
import { refrescar } from './plantilla.mjs';
import {
  KIT, SEMVER, comparar, escribirJson, especificacionKit, etiquetaDe, leerJson, leerTexto, raizGit, versionInstalada, versionesDelLockfile,
} from './proyecto.mjs';

const normalizar = (v) => v.replace(/^v/, '');

/* La dirección del repositorio a partir de la dependencia: `github:usuario/repo#v1`
   o `git+https://…/repo.git#v1`. */
function repositorioDe(valor) {
  const sinTag = valor.replace(/#.*$/, '');
  if (sinTag.startsWith('github:')) return `https://github.com/${sinTag.slice(7)}.git`;
  return sinTag.replace(/^git\+/, '');
}

function ultimaVersion(valor) {
  const salida = execFileSync('git', ['ls-remote', '--tags', repositorioDe(valor)], { encoding: 'utf8' });
  const versiones = [...salida.matchAll(/refs\/tags\/v(\d+\.\d+\.\d+)$/gm)].map((m) => m[1]);
  if (!versiones.length) throw new Error('no encontré etiquetas vX.Y.Z en el repositorio');
  return versiones.sort(comparar).at(-1);
}

/* Secciones del CHANGELOG con versión en (desde, hasta]. */
export function cambiosEntre(changelog, desde, hasta) {
  const partes = changelog.split(/^(?=## \d+\.\d+\.\d+)/m).filter((s) => /^## \d/.test(s));
  return partes.filter((s) => {
    const v = s.match(/^## (\d+\.\d+\.\d+)/)[1];
    return comparar(v, desde) > 0 && comparar(v, hasta) <= 0;
  });
}

/* Paquetes del lockfile que cambiaron de versión y no son el kit. Dos mapas
   `clave del lockfile → versión`, el de antes y el de después. */
export function dependenciasAjenas(antes, ahora) {
  if (!antes || !ahora) return [];
  return Object.keys({ ...antes, ...ahora }).filter((k) => !k.includes('@hrl/core-ui') && antes[k] !== ahora[k]);
}

/* Como una sola cadena: en Windows npm es un .cmd y solo se puede lanzar con shell,
   y pasarle un array de argumentos con shell activo está en desuso (DEP0190). No
   lleva ningún dato del usuario. */
const npmInstall = (dir) => spawnSync('npm install', { cwd: dir, shell: true, encoding: 'utf8' });

export async function upgrade({ dir, pkg }, objetivo, { fix = false } = {}, escribir = (t) => console.log(t)) {
  const espec = especificacionKit(pkg);
  if (!espec) return { error: `El kit no está declarado en package.json. Instálalo primero: npm i "git+https://github.com/DevHRL/hrl-core-ui.git#vX.Y.Z"` };

  const actual = etiquetaDe(espec.valor) ?? versionInstalada(dir);
  let nueva;
  try {
    nueva = objetivo === 'latest' ? ultimaVersion(espec.valor) : normalizar(objetivo);
  } catch (e) {
    return { error: `No pude averiguar la última versión: ${e.message}` };
  }
  if (!SEMVER.test(nueva)) return { error: `Versión no válida: "${objetivo}". Usa vX.Y.Z, vX.Y.Z-pre.N o latest.` };
  if (nueva === actual) return { error: `El proyecto ya está en v${nueva}.` };
  if (actual && comparar(nueva, actual) < 0) escribir(`  aviso  v${nueva} es anterior a la actual (v${actual}): se va a bajar de versión.`);

  // 1. Cambiar el tag e instalar, guardando el lockfile de antes.
  const rutaLock = join(dir, 'package-lock.json');
  const lockAntes = existsSync(rutaLock) ? readFileSync(rutaLock, 'utf8') : null;
  const versionesAntes = versionesDelLockfile(dir);

  const p = leerJson(join(dir, 'package.json'));
  const anterior = p.datos[espec.seccion][KIT];
  p.datos[espec.seccion][KIT] = /#v?\d+\.\d+\.\d+$/.test(anterior) ? anterior.replace(/#v?\d+\.\d+\.\d+$/, `#v${nueva}`) : `${anterior.replace(/#.*$/, '')}#v${nueva}`;
  escribirJson(join(dir, 'package.json'), p);
  escribir(`  hecho  package.json: ${anterior}  →  #v${nueva}`);

  let inst = npmInstall(dir);
  if (inst.status !== 0) {
    // No se deja el proyecto a medias: se devuelve el tag anterior.
    p.datos[espec.seccion][KIT] = anterior;
    escribirJson(join(dir, 'package.json'), p);
    if (lockAntes) writeFileSync(rutaLock, lockAntes);
    return { error: `npm install falló; se restauró package.json y el lockfile.\n${(inst.stderr || inst.stdout || '').split('\n').filter((l) => /error/i.test(l)).slice(0, 6).join('\n')}` };
  }

  // 2. Que solo haya cambiado el kit.
  const ajenos = () => dependenciasAjenas(versionesAntes, versionesDelLockfile(dir));
  let extra = ajenos();
  if (extra.length && lockAntes) {
    escribir(`  aviso  npm cambió ${extra.length} dependencia(s) que no son el kit (${extra.slice(0, 4).map((k) => k.replace(/^node_modules\//, '')).join(', ')}…). Restaurando el lockfile anterior.`);
    writeFileSync(rutaLock, lockAntes);
    inst = npmInstall(dir);
    extra = ajenos();
  }
  if (extra.length) escribir(`  error  no se logró dejar solo el kit: revisa el diff de package-lock.json (${extra.length} paquetes distintos).`);
  else escribir('  hecho  el lockfile solo cambió en el kit; el resto de dependencias sigue como estaba');

  /* Vite guarda en node_modules/.vite el kit ya pre-empaquetado. Si se queda con el de la
     versión anterior, la aplicación sale en blanco con «does not provide an export named…»
     al usar un componente nuevo. Es una caché: borrarla es seguro y se regenera sola. */
  if (existsSync(join(dir, 'node_modules', '.vite'))) {
    rmSync(join(dir, 'node_modules', '.vite'), { recursive: true, force: true });
    escribir('  hecho  caché de dependencias de Vite borrada (node_modules/.vite). Si el servidor de desarrollo está abierto, reinícialo.');
  }

  // 3. El CHANGELOG de lo que se sube.
  const rutaChangelog = join(dir, 'node_modules', '@hrl', 'core-ui', 'CHANGELOG.md');
  if (existsSync(rutaChangelog) && actual) {
    const secciones = cambiosEntre(leerTexto(rutaChangelog), actual, nueva);
    if (secciones.length) {
      escribir(`\nCambios entre v${actual} y v${nueva} (léelos: dicen qué cambia de aspecto y qué queda obsoleto):\n`);
      for (const s of secciones) {
        const lineas = s.trimEnd().split('\n');
        escribir(lineas.slice(0, 40).map((l) => '    ' + l).join('\n') + (lineas.length > 40 ? '\n    … (sigue en node_modules/@hrl/core-ui/CHANGELOG.md)' : '') + '\n');
      }
    }
  }

  // 4. El contrato del proyecto.
  const contrato = [join(dir, 'CLAUDE.md'), join(raizGit(dir), 'CLAUDE.md')].find(existsSync);
  if (contrato) {
    const texto = leerTexto(contrato);
    const nuevo = refrescar(texto, nueva);
    if (nuevo && nuevo !== texto) { writeFileSync(contrato, nuevo); escribir('  hecho  CLAUDE.md: bloque del kit refrescado'); }
  }

  // 5. Comprobar.
  const resultado = await doctor({ dir, pkg: JSON.parse(leerTexto(join(dir, 'package.json'))) }, { fix });
  return { resultado, actual, nueva, extra };
}
