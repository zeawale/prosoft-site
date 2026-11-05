'use client'

import { useRef, useState, type FocusEvent, type FormEvent } from 'react'
import { submitLead } from '@/app/actions/submitLead'
import { reachGoal } from '@/components/analytics/YandexMetrika'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { TextLink } from '@/components/ui/TextLink'
import { formatPhone, phoneProblem } from '@/lib/leads'
import { ROUTES } from '@/lib/navigation'
import styles from './LeadForm.module.css'

type Props = {
  /** Откуда заявка: пишется в поле «Источник» */
  source: string
  /** Телефон для экрана ошибки */
  phone: string
  title?: string
  lead?: string
  submitLabel?: string
  /** Ответы квиза: уходят в заявку скрытым полем */
  details?: string
  /** id заголовка для aria-labelledby модалки */
  titleId?: string
  /** «Вернуться на страницу» на экране успеха. Нет — форма откроется заново */
  onDone?: () => void
}

type Status = 'idle' | 'sending' | 'sent' | 'failed'
type Errors = Record<string, string>

const check = (name: string, value: string): string | undefined => {
  if (name === 'name' && value.trim().length < 2) return 'Напишите, как к вам обращаться'
  if (name === 'phone') return phoneProblem(value) ?? undefined
  if (name === 'company' && value.trim().length < 2) return 'Напишите название компании'
  return undefined
}

/**
 * Форма заявки на диагностику: в модалке, на странице диагностики и в
 * результате квиза. Проверка при уходе с поля и при отправке; при ошибке сети
 * данные остаются в форме, и отправить можно ещё раз.
 */
export function LeadForm({
  source,
  phone,
  title = 'Получить диагностику за 2 дня',
  lead = 'Перезвоним и договоримся о времени диагностики. Бесплатно, отчёт на руки.',
  submitLabel = 'Получить диагностику',
  details,
  titleId,
  onDone,
}: Props) {
  const [status, setStatus] = useState<Status>('idle')
  const [errors, setErrors] = useState<Errors>({})
  const [values, setValues] = useState({ name: '', phone: '', company: '', comment: '' })
  const [consent, setConsent] = useState(false)
  const lastData = useRef<FormData | null>(null)

  const update = (name: keyof typeof values, value: string) => {
    setValues((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(({ [name]: _gone, ...rest }) => rest)
  }

  const onBlur = (e: FocusEvent<HTMLInputElement>) => {
    const error = check(e.target.name, e.target.value)
    if (error) setErrors((prev) => ({ ...prev, [e.target.name]: error }))
  }

  async function send(data: FormData) {
    setStatus('sending')
    lastData.current = data

    try {
      const result = await submitLead(data)

      if (result.ok) {
        setStatus('sent')
        // Цель «Заявка отправлена»: без неё не посчитать заявки из поиска
        reachGoal('lead_sent')
      } else if (result.kind === 'validation') {
        setStatus('idle')
        setErrors(result.fieldErrors)
      } else {
        setStatus('failed')
      }
    } catch {
      setStatus('failed')
    }
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const found: Errors = {}
    for (const [name, value] of Object.entries(values)) {
      const error = check(name, value)
      if (error) found[name] = error
    }
    if (!consent) found.consent = 'Без согласия не сможем принять заявку. Отметьте пункт выше'

    setErrors(found)
    if (Object.keys(found).length > 0) return

    void send(new FormData(e.currentTarget))
  }

  if (status === 'sent') {
    return (
      <div className={`${styles.status} ${styles.success}`} role="status">
        <Icon slug="check-circle" size={24} className={styles.statusIconOk} />
        <p id={titleId} className="h4">
          Заявка принята
        </p>
        <p className="body-m">
          Перезвоним в течение рабочего дня и договоримся о времени диагностики.
        </p>
        <Button
          variant="secondary"
          size="M"
          onClick={() => {
            if (onDone) onDone()
            else setStatus('idle')
          }}
        >
          Вернуться на страницу
        </Button>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className={`${styles.status} ${styles.failure}`} role="alert">
        <Icon slug="error" size={24} className={styles.statusIconError} />
        <p id={titleId} className="h4">
          Заявка не отправилась
        </p>
        <p className="body-m">
          Связь с сервером прервалась, данные в форме сохранились. Отправьте ещё раз или позвоните:{' '}
          {phone}.
        </p>
        <Button
          size="M"
          onClick={() => {
            if (lastData.current) void send(lastData.current)
          }}
        >
          Отправить ещё раз
        </Button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate>
      <div className={styles.head}>
        <p id={titleId} className={`h4 ${styles.title}`}>
          {title}
        </p>
        <p className={`body-s ${styles.lead}`}>{lead}</p>
      </div>

      <input type="hidden" name="page" value={source} />
      {details && <input type="hidden" name="details" value={details} />}

      <div className={styles.fields}>
        <Field label="Имя" id={`${source}-name`} error={errors.name}>
          <input
            id={`${source}-name`}
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Как к вам обращаться"
            className={styles.control}
            value={values.name}
            onChange={(e) => update('name', e.target.value)}
            onBlur={onBlur}
            aria-invalid={Boolean(errors.name)}
          />
        </Field>

        <Field label="Телефон" id={`${source}-phone`} error={errors.phone}>
          <input
            id={`${source}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 ___ ___-__-__"
            className={styles.control}
            value={values.phone}
            onChange={(e) => update('phone', formatPhone(e.target.value))}
            onBlur={onBlur}
            aria-invalid={Boolean(errors.phone)}
          />
        </Field>

        <Field label="Компания" id={`${source}-company`} error={errors.company}>
          <input
            id={`${source}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            placeholder="Название компании"
            className={styles.control}
            value={values.company}
            onChange={(e) => update('company', e.target.value)}
            onBlur={onBlur}
            aria-invalid={Boolean(errors.company)}
          />
        </Field>

        <Field label="Комментарий, необязательно" id={`${source}-comment`} error={errors.comment}>
          <textarea
            id={`${source}-comment`}
            name="comment"
            placeholder="Что хотите обсудить"
            className={`${styles.control} ${styles.textarea}`}
            value={values.comment}
            onChange={(e) => update('comment', e.target.value)}
          />
        </Field>
      </div>

      <div className={styles.consent}>
        <label className={styles.checkbox}>
          <input
            name="consent"
            type="checkbox"
            checked={consent}
            className={styles.box}
            aria-invalid={Boolean(errors.consent)}
            onChange={(e) => {
              setConsent(e.target.checked)
              if (e.target.checked) setErrors(({ consent: _gone, ...rest }) => rest)
            }}
          />
          <span className="body-m">Согласен на обработку персональных данных</span>
        </label>
        {errors.consent && <p className={`body-s ${styles.errorText}`}>{errors.consent}</p>}
        <TextLink href={ROUTES.privacy} size="S">
          Политика обработки персональных данных
        </TextLink>
      </div>

      <Button type="submit" fill disabled={status === 'sending'}>
        {status === 'sending' ? 'Отправляем…' : submitLabel}
      </Button>
    </form>
  )
}

function Field({
  label,
  id,
  error,
  children,
}: {
  label: string
  id: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={`label-14 ${styles.label}`}>
        {label}
      </label>
      {children}
      {error && (
        <p className={`body-s ${styles.error}`}>
          <Icon slug="error" size={20} />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
