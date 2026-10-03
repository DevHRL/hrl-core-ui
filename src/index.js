/* Core UI — punto único de importación del sistema de diseño.

     import { Button, DataTable, Tooltip } from '@/core-ui';

   La API pública está en inglés —nombres, props y valores— porque es el
   vocabulario del sistema de diseño y se comparte entre proyectos. Los
   comentarios y las variables internas siguen en español, como el resto del
   repositorio.

   Regla: nada de este directorio puede importar de fuera de él. Si un
   componente necesita datos, los recibe por props. */

/* ----------------------------------------------------------- primitivos */
export { Button, IconButton } from './Button.jsx';
export { Input } from './Input.jsx';
export { CompactSelect } from './CompactSelect.jsx';
export { Badge } from './Badge.jsx';
export { Card } from './Card.jsx';
export { Stack, Grid, Mosaic } from './Layout.jsx';
export { HrlLogo } from './HrlLogo.jsx';
export { Mascot, MASCOT_STATES } from './Mascot.jsx';
export { LoginScreen, ChangePasswordScreen, backdropForHour, LOGIN_BACKDROPS } from './LoginScreen.jsx';
export { StatCard } from './StatCard.jsx';
export { Alert } from './Alert.jsx';
export { Dialog } from './Dialog.jsx';
export { DetailDialog, Field, Timeline } from './DetailDialog.jsx';
export { Tooltip, FloatingTip } from './Tooltip.jsx';
export { TruncatedText } from './TruncatedText.jsx';
export { Tabs } from './Tabs.jsx';
export { Toast } from './Toast.jsx';
export { Checkbox } from './Checkbox.jsx';
export { NumberCell } from './NumberCell.jsx';
export { Steps } from './Steps.jsx';
export { ProgressSteps } from './ProgressSteps.jsx';
export { SelectionStrip } from './SelectionStrip.jsx';
export { DropdownMenu } from './DropdownMenu.jsx';
export { Skeleton, SkeletonRows } from './Skeleton.jsx';
export { Spinner } from './Spinner.jsx';
export { EmptyState } from './EmptyState.jsx';

/* -------------------------------------------------------------- datos */
export { DataTable } from './DataTable.jsx';
export { PaginatedTable, Paginator } from './PaginatedTable.jsx';
export { Pagination } from './Pagination.jsx';
export { usePagination, ROWS_PER_PAGE, PAGE_SIZES } from './paginate.js';
export { sortRows, nextSort } from './sort.js';

/* ------------------------------------------------------------ gráficos */
export { GaugeArc, Sparkline, StackedBars, SeriesBars, Funnel, Ranking, SplitBar } from './Charts.jsx';
export { Calendar } from './Calendar.jsx';

/* -------------------------------------------------------------- layout */
export { AppShell, ID_CONTENIDO } from './AppShell.jsx';
export { PageHeader } from './PageHeader.jsx';
export { PageActions, PAGE_ACTIONS_ID } from './PageActions.jsx';
export { FilterBar } from './FilterBar.jsx';

/* ------------------------------------------------- iconos y utilidades */
export { Icon, IconSprite, Sprite } from './icons.jsx';
export { ICONS, ICON_ALIASES } from './icon-catalog.js';
export { DEPRECATED } from './deprecated.js';
export { variants, cx } from './variants.js';
export { preset, token, literalColor, tokensToCss } from './preset.js';

/* --------------------------------------------------------------- hooks */
export { useExitAnimation, useMountedWhile, useExpandedRows, EXIT_MS } from './useExitAnimation.js';
export { useFloatingTip } from './useFloatingTip.js';
export { readTheme, applyTheme } from './theme.js';
export { memoize, invalidate } from './cache.js';
