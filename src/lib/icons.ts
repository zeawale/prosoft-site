/**
 * Единственный источник иконок проекта.
 * value  — ключ, который лежит в базе и виден в CMS
 * label  — подпись в выпадающем списке админки
 * symbol — имя в наборе material-symbols: в макете Material Symbols Outlined,
 *          поэтому у глифов с заливкой суффикс -outline
 *
 * Новая иконка в макете → новая строка здесь, и она сразу появится в селекте
 * админки. В базе лежит value, символ можно менять без миграции.
 */
export const ICONS = [
  // Интерфейс
  { value: 'expand-more', label: 'Стрелка вниз', symbol: 'expand-more' },
  { value: 'chevron-right', label: 'Стрелка вправо', symbol: 'chevron-right' },
  { value: 'chevron-left', label: 'Стрелка влево', symbol: 'chevron-left' },
  { value: 'arrow-forward', label: 'Стрелка вперёд', symbol: 'arrow-forward' },
  { value: 'arrow-back', label: 'Стрелка назад', symbol: 'arrow-back' },
  { value: 'open-in-new', label: 'Внешняя ссылка', symbol: 'open-in-new' },
  { value: 'menu', label: 'Меню', symbol: 'menu' },
  { value: 'close', label: 'Закрыть', symbol: 'close' },
  { value: 'add', label: 'Плюс', symbol: 'add' },
  { value: 'remove', label: 'Минус', symbol: 'remove' },
  { value: 'pause', label: 'Пауза', symbol: 'pause' },
  { value: 'play', label: 'Воспроизвести', symbol: 'play-arrow-outline' },
  { value: 'check', label: 'Галочка', symbol: 'check' },
  { value: 'check-circle', label: 'Галочка в круге', symbol: 'check-circle-outline' },
  { value: 'error', label: 'Ошибка', symbol: 'error-outline' },
  { value: 'download', label: 'Скачать', symbol: 'download' },

  // Направления
  { value: 'factory', label: 'Завод', symbol: 'factory-outline' },
  { value: 'update', label: 'Обновление', symbol: 'update' },
  { value: 'construction', label: 'Инструменты', symbol: 'construction' },
  { value: 'support', label: 'Поддержка', symbol: 'support-agent' },
  { value: 'swap', label: 'Обмен', symbol: 'sync-alt' },

  // Процессы
  { value: 'cart', label: 'Закупки', symbol: 'shopping-cart-outline' },
  { value: 'sell', label: 'Продажи', symbol: 'sell-outline' },
  { value: 'warehouse', label: 'Склад', symbol: 'warehouse-outline' },
  { value: 'bank', label: 'Финансы', symbol: 'account-balance-outline' },
  { value: 'groups', label: 'Люди', symbol: 'groups-outline' },
  { value: 'hub', label: 'Интеграции', symbol: 'hub-outline' },
  { value: 'database', label: 'База данных', symbol: 'database-outline' },
  { value: 'fact-check', label: 'Отчётность', symbol: 'fact-check-outline' },
  { value: 'payments', label: 'Расходы', symbol: 'payments-outline' },
  { value: 'dns', label: 'Сервер', symbol: 'dns-outline' },
  { value: 'backup', label: 'Резервная копия', symbol: 'backup-outline' },
  { value: 'description', label: 'Документ', symbol: 'description-outline' },
  { value: 'verified', label: 'Проверено', symbol: 'verified-outline' },
  { value: 'task-alt', label: 'Выполнено', symbol: 'task-alt' },
] as const satisfies { value: string; label: string; symbol: string }[]

export type IconName = (typeof ICONS)[number]['value']

/** Опции для селекта в CMS */
export const iconOptions = ICONS.map(({ value, label }) => ({ value, label }))

/** Ключ → имя глифа в material-symbols */
export const ICON_MAP = Object.fromEntries(
  ICONS.map(({ value, symbol }) => [value, symbol]),
) as Record<IconName, string>

export const FALLBACK_ICON = 'apps'

export const resolveIcon = (slug?: string | null): string =>
  (slug && ICON_MAP[slug as IconName]) || FALLBACK_ICON
