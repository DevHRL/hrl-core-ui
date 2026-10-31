# @hrl/core-ui

Sistema de diseño del Hospital Regional de Loreto: componentes React y tokens
CSS. **Sin dependencias**: lo único que necesita el proyecto que lo use es
React 19.

Nació dentro del Sistema de Vigilancia Oncológica y se extrajo cuando un
segundo sistema lo necesitó. La lista completa de lo que ofrece está en
[`UI_CATALOG.md`](UI_CATALOG.md).

---

## Empezar en un proyecto

Cinco pasos, en este orden. El único que exige escribir código es el cuarto.

1. **Acceso.** El repositorio es **privado**: la máquina que instale necesita una
   credencial de lectura (ver [Acceso al repositorio](#acceso-al-repositorio)).
2. **Instalar**, fijando la versión con el tag (la más reciente está en
   `CHANGELOG.md`):

   ```bash
   npm i "git+https://github.com/GiancarloChavez/hrl-core-ui.git#vX.Y.Z"
   ```

3. **Integrar.** El kit trae su propia herramienta, sin dependencias:

   ```bash
   npx hrl-core-ui init
   ```

   `init` es **idempotente** (repetirlo no cambia nada; `--dry-run` muestra qué haría) y
   solo hace lo que se puede hacer sin adivinar: fija la versión en `package.json` si no
   lo estaba; carga `tokens.css` en el punto de entrada **antes** que los estilos propios;
   escribe el contrato del proyecto (`CLAUDE.md`, con las reglas del kit en un bloque con
   marcas que `upgrade` refresca y un hueco para las propias; si el proyecto ya documenta
   el kit, no lo toca); y añade el script `kit:doctor`.

4. **Montar la interfaz** (lo único que depende de tu aplicación): `<AppShell>` con su
   navegación y su usuario. `init` te deja un ejemplo mínimo. El nombre del sistema se le
   pasa por `brand` y la clave del modo oscuro por `themeKey`; el kit no sabe de qué
   sistema forma parte. Una pantalla sin `AppShell` (un login) monta `<IconSprite />`.

5. **Comprobar:**

   ```bash
   npx hrl-core-ui doctor [--fix] [--strict]   # o: npm run kit:doctor
   ```

   `doctor` comprueba que la versión esté fija, instalada y coincida con el lockfile; que
   `tokens.css` se cargue antes que los estilos propios (entiende imports estáticos y
   dinámicos, y no confunde un CSS de otra rama `if/else` con uno anterior); que no haya
   imports por rutas internas ni una copia local del kit; que el sprite de iconos esté
   montado; que no se usen **nombres obsoletos** (con `--fix` los reescribe él); que el
   proyecto tenga un contrato que mencione el kit; y que los componentes **se monten** con
   el React del proyecto. También avisa de lo que una migración suele dejar a medias:
   recursos cargados de internet, el icono de pestaña de Vite (`init` lo cambia solo), clases
   `hrl-…` sin definición, colores escritos como literal y HTML nativo con equivalente en
   el kit (`init` lo lista con su arreglo). Sale con código 1 si hay errores; con `--strict`, también si hay
   avisos: es lo que conviene poner en un CI.

## Actualizar

```bash
npx hrl-core-ui upgrade vX.Y.Z     # o "latest"
```

Un cambio en el kit no altera ningún proyecto hasta que este lo actualiza: cada uno fija su
versión. `upgrade` cambia el tag, instala, comprueba que **solo cambió el kit** en el
lockfile (si npm subió otra dependencia, restaura el lockfile y reinstala), muestra el
CHANGELOG entre la versión anterior y la nueva —léelo: dice qué cambia de aspecto y qué
queda obsoleto—, refresca el bloque del kit en `CLAUDE.md` y corre `doctor`. Si la
instalación falla, deja `package.json` y el lockfile exactamente como estaban.

Después, la verificación propia del proyecto (lint, build, pruebas) y commit de
`package.json`, `package-lock.json` y los ajustes. **No borres el lockfile para
regenerarlo**: npm sube todas las dependencias a su última versión permitida.

La herramienta viaja en el paquete desde la **1.5.0**: un proyecto en una versión anterior
sube primero a mano (cambia el tag y `npm install`) y desde ahí ya la tiene.

Migrar una interfaz que ya existe: [`MIGRACION.md`](MIGRACION.md) (el recorrido, lo que
falla y cómo arreglarlo, equivalencias y lo que el kit aún no cubre). Viaja en el paquete.

Las reglas que `init` escribe en el contrato —y que `doctor` hace cumplir— salen de
[`design.md`](design.md), que también viaja dentro del paquete
(`node_modules/@hrl/core-ui/design.md`).

### Acceso al repositorio

npm deja `git+ssh://git@github.com/…` en el lockfile para cualquier repositorio de
GitHub, escribas la dependencia como la escribas (`github:`, `git+https://`…). Es
normal y no obliga a tener una llave SSH. Lo que cada máquina necesita es **una
credencial de lectura del repositorio**, por SSH o por https. Comprobado: con SSH
desactivado y credenciales https guardadas, `npm ci` instala igual; sin ninguna
credencial falla con `Could not read from remote repository` sobre
`ssh://git@github.com/…`. El acceso lo concede el dueño (`GiancarloChavez`) al invitar
como colaborador.

- **En tu máquina**, con una llave SSH registrada en GitHub o con Git Credential Manager
  (que guarda el acceso tras el primer `git clone` o `git push` por https).
- **En un CI o servidor**, sin usuario interactivo: un token de solo lectura del
  repositorio y, antes de `npm ci`, decirle a git que lo use tanto para las direcciones
  https como para la SSH que trae el lockfile:

  ```bash
  git config --global url."https://x-access-token:$TOKEN@github.com/".insteadOf "https://github.com/"
  git config --global --add url."https://x-access-token:$TOKEN@github.com/".insteadOf "ssh://git@github.com/"
  ```

  El `--add` de la segunda línea es necesario: sin él sustituiría a la primera. La
  reescritura de las dos direcciones está comprobada con git; lo que no se ha probado es
  que GitHub acepte un token real desde un CI.

- **`EALLOWSCRIPTS` al instalar**: npm prepara las dependencias de Git en una instalación
  anidada, y una línea `allow-scripts=…` en tu `~/.npmrc` global (no es una clave real de
  npm) la rechaza. Coméntala. El kit ya declara `allowScripts` para sus propias
  herramientas de desarrollo.

Las fuentes (Plus Jakarta Sans e IBM Plex Mono) y la identidad del hospital —logo, escudo y las
fachadas de la pantalla de ingreso— **vienen en el paquete**: no dependen de internet ni
de Google Fonts, y no hay que copiarlas ni configurar nada. `<AppShell>` dibuja el logo
solo y `<LoginScreen>` trae el ingreso con la fachada según la hora.

## Uso

```jsx
// Los tokens se cargan una vez, en el punto de entrada (`init` lo hace).
import '@hrl/core-ui/tokens.css';

// En cualquier parte, solo desde el punto de entrada público:
import { AppShell, Card, DataTable, Button } from '@hrl/core-ui';
```

Catálogo completo en [`UI_CATALOG.md`](UI_CATALOG.md) y, para verlo en pantalla, en el
catálogo visual (`npm run ladle:serve` en este repositorio).

## Qué es de aquí y qué no

- **Del kit:** lo reutilizable. Un componente de aquí no hace `fetch`, no
  conoce ningún endpoint y no nombra ningún dominio: si necesita datos, los
  recibe por props.
- **De cada aplicación:** sus pantallas, sus reglas y sus estilos propios, en su
  propia hoja CSS, que se carga después de `tokens.css` y puede ajustar
  componentes del kit dentro de su contexto. Al revés nunca: el kit no sabe de
  la aplicación.

**Idioma:** la API pública —nombres, props y valores— está en inglés, porque es
el vocabulario del sistema de diseño y se comparte entre proyectos. Los
comentarios y las variables internas están en español, como el resto del
código del hospital.

**Nada de valores arbitrarios:** un color, un radio, una sombra o un tamaño de
fuente se escriben con su token. Los únicos literales de color viven en
`tokens.css` y en `preset.js`, y solo en la definición del token.

## Los tokens

`tokens.json` es la única fuente de los valores del sistema —colores, radios,
sombras, tipografía, movimiento—. `tokens.css` y `src/preset.js` se generan
desde ahí; no se editan a mano, empiezan con un aviso de que son generados.
Cambiar un color es cambiar `tokens.json` y correr:

```bash
npm run tokens        # regenera tokens.css y src/preset.js
```

Antes de esto, `tokens.css` y `preset.js` se mantenían a mano en paralelo, y
fue exactamente así como dos copias del kit terminaron con 658 líneas de
diferencia en esta hoja sin que nadie lo notara.

### Contraste

```bash
npm run contrast      # WCAG 2.1 AA de cada combinación texto/fondo, en los dos temas
```

Solo falla (y hace fallar el CI) si una combinación cae por debajo de 3:1, el
umbral mínimo de cualquier texto o componente. Por encima de eso reporta la
razón exacta de contraste de cada combinación
real que produce el sistema (no cada combinación matemáticamente posible) y
contra qué umbral pasa —4.5:1 para texto normal, 3:1 para texto grande o
componentes de interfaz—, para que decidir qué corregir sea una decisión de
diseño, no una sorpresa en producción.

## Desarrollo

Las reglas para modificar el kit —qué entra aquí y qué se queda en cada
aplicación, tokens, iconos, idioma, versiones— están en [`design.md`](design.md).

```bash
npm install
npm run tokens        # regenera tokens.css y preset.js desde tokens.json
npm run build         # compila src/ a dist/ con esbuild
npm run humo          # monta cada componente del compilado y falla si alguno revienta
npm run contrast      # WCAG AA de los tokens, informativo
npm run literales     # falla si un font-size vuelve a escribirse fuera de la escala
npm run eol           # el generador de tokens respeta el fin de línea (LF y CRLF)
npm run cli           # prueba la herramienta hrl-core-ui contra un proyecto de ejemplo
npm run verificar     # tokens + eol + literales + build + humo + herramienta
npm run ladle:serve   # catálogo visual en local
npm run ladle:build   # catálogo como sitio estático en build/
```

### Catálogo visual

Ladle muestra cada componente y los fundamentos (colores, tipografía, formas)
leyendo directamente `tokens.json`, en claro y en oscuro. «Composición /
Personalizar» permite cambiar el color de marca, la fuente y el redondeo en
vivo y calcula el contraste del color elegido. Las historias viven en
`stories/`; los datos de ejemplo son genéricos a propósito, porque el kit no
sabe de ningún sistema concreto.

### Publicar el catálogo

El workflow `.github/workflows/catalogo.yml` compila el catálogo y lo sube a la
rama `catalogo`, que contiene solo el sitio ya compilado (sin código fuente) y
se sobrescribe entera en cada publicación: no se edita a mano. Se ejecuta al
crear un tag `v*`, o a demanda desde Actions → «Catálogo» → «Run workflow».

Netlify publica esa rama. Una sola vez, en app.netlify.com: *Add new site* →
*Import an existing project* → GitHub → `hrl-core-ui` → rama `catalogo`. El
`netlify.toml` de la rama ya indica que no hay comando de build y que se
publica la raíz; a partir de ahí cada publicación de la rama redespliega sola.

El sitio publicado es **público** aunque el repositorio sea privado: quien tenga
la URL ve los componentes, los tokens y el código compilado. El código fuente
del repositorio no se publica.

### Publicar una versión

1. Cambia lo que haga falta en `src/`, `tokens.json` o `tokens.css`. Si renombras algo
   público, déjalo como alias en `src/deprecated.js`: así `doctor --fix` lo corrige en los
   proyectos y nada se rompe hasta la próxima versión mayor.
2. Anota el cambio en `CHANGELOG.md`: qué cambió y por qué; si cambia el aspecto, cuánto.
3. `npm run verificar`, `npm run contrast` y, si tocaste el catálogo, `npm run ladle:build`.
4. Sube la versión en `package.json` y en `package-lock.json`, y crea el tag `vX.Y.Z`.
5. `git push origin main` y `git push origin vX.Y.Z`. El CI valida y el tag regenera la rama
   `catalogo`, con lo que Netlify actualiza el catálogo solo.
6. Cada proyecto actualiza cuando decide: `npx hrl-core-ui upgrade vX.Y.Z`.

La versión es semántica: quitar o renombrar una prop, un valor de prop o un icono sin dejar
alias es un cambio **mayor**; añadir algo o cambiar el aspecto a propósito, **menor**; corregir
sin cambiar la API ni el aspecto, **parche**.

## Consumidores

| Sistema | Estado |
|---|---|
| Vigilancia Oncológica (HRL) | origen del kit; lo consume como paquete (rama `UI_standard`) |
| Reporte Estadístico (HRL) | aún con su propia copia del kit, con la API en español; migrarlo es un trabajo aparte |
