export type LeadResult =
  | { ok: true }
  | { ok: false; kind: 'validation'; fieldErrors: Record<string, string> }
  | { ok: false; kind: 'failed' }

/** Десять цифр номера без кода страны: +7 и ведущая 8 отбрасываются */
export function phoneDigits(value: string): string {
  const digits = value.replace(/\D/g, '')
  return /^[78]/.test(digits) ? digits.slice(1, 11) : digits.slice(0, 10)
}

/** Маска +7 ___ ___-__-__ */
export function formatPhone(value: string): string {
  const d = phoneDigits(value)
  if (!d) return ''
  let out = '+7 ' + d.slice(0, 3)
  if (d.length > 3) out += ' ' + d.slice(3, 6)
  if (d.length > 6) out += '-' + d.slice(6, 8)
  if (d.length > 8) out += '-' + d.slice(8, 10)
  return out
}

/** Текст ошибки говорит, что исправить. null — номер в порядке */
export function phoneProblem(value: string): string | null {
  const count = phoneDigits(value).length
  if (count === 10) return null
  if (count === 0) return 'Напишите телефон: перезвоним по нему'
  return `В номере 10 цифр после +7, сейчас ${count}. Проверьте последнюю цифру`
}
