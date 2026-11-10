export type Messenger = 'max' | 'telegram'

type MessageInput = {
  /** Первая строка из «Форм заявки» */
  intro: string
  name: string
  phone: string
  company: string
  comment: string
  /** Ответы квиза */
  details?: string
}

/**
 * Текст сообщения в мессенджер: приветствие, комментарий своими словами без
 * подписи, ниже контакты. Простой текст без разметки: ни MAX, ни Telegram
 * не форматируют черновик в поле ввода. Пустые поля пропускаются.
 */
export function buildLeadMessage(input: MessageInput): string {
  const rows: [string, string][] = [
    ['Имя', input.name],
    ['Телефон', input.phone],
    ['Компания', input.company],
    ['Ответы квиза', input.details ?? ''],
  ]
  const contacts = rows
    .map(([label, value]) => [label, value.trim()] as const)
    .filter(([, value]) => value)
    .map(([label, value]) => `${label}: ${value}`)

  const blocks = [input.intro, input.comment.trim(), contacts.join('\n')].filter(Boolean)
  return blocks.join('\n\n')
}

/**
 * Ссылка на чат. Telegram подставляет текст в поле ввода по параметру text
 * (core.telegram.org/api/links, ссылки на публичное имя). У MAX такого
 * параметра нет: ссылка ведёт в чат, а текст форма кладёт в буфер обмена.
 *
 * encodeURIComponent, а не URLSearchParams: тот кодирует пробел плюсом, и
 * клиент может оставить плюсы в тексте.
 */
export function messengerHref(messenger: Messenger, url: string, text: string): string {
  if (messenger === 'max') return url
  return `${url}${url.includes('?') ? '&' : '?'}text=${encodeURIComponent(text)}`
}
