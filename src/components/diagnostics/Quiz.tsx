'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { LeadForm } from '@/components/lead/LeadForm'
import { SectionShell } from '@/components/sections/SectionShell'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { SectionHeader } from '@/components/ui/SectionHeader'
import type { Diagnostic } from '@/payload-types'
import styles from './Quiz.module.css'

type Props = Diagnostic['quiz'] & {
  /** Откуда заявка: пишется в поле «Источник» */
  source: string
  /** Телефон для экрана ошибки формы */
  phone: string
}

type Answers = Record<number, number[]>

const plain = (text: string) => text.replace(/ /g, ' ')

/** Квиз подбора сценария: шаги с прогрессом, результат и заявка с ответами */
export function Quiz({
  title,
  lead,
  stepLabel,
  backLabel,
  nextLabel,
  finishLabel,
  questions,
  defaultScenario,
  result,
  transition,
  update,
  form,
  source,
  phone,
}: Props) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [finished, setFinished] = useState(false)
  const anchor = useRef<HTMLDivElement>(null)
  const moved = useRef(false)
  const groupId = useId()

  const list = questions ?? []
  const question = list[step]
  const picked = answers[step] ?? []
  const isLast = step === list.length - 1

  // Шаги разной высоты: после перехода начало шага должно остаться на экране
  useEffect(() => {
    if (!moved.current) return
    moved.current = false
    const node = anchor.current
    if (!node) return
    if (node.getBoundingClientRect().top < 0) node.scrollIntoView({ block: 'start' })
    node.focus({ preventScroll: true })
  }, [step, finished])

  const go = (next: () => void) => {
    moved.current = true
    next()
  }

  const toggle = (option: number) => {
    setAnswers((prev) => {
      const current = prev[step] ?? []
      if (!question?.multiple) return { ...prev, [step]: [option] }
      return {
        ...prev,
        [step]: current.includes(option)
          ? current.filter((item) => item !== option)
          : [...current, option],
      }
    })
  }

  const restart = () => {
    go(() => {
      setAnswers({})
      setStep(0)
      setFinished(false)
    })
  }

  // Сценарий задаёт первый ответ по порядку вопросов, у которого он указан
  const chosen = list
    .flatMap((item, index) => (answers[index] ?? []).map((option) => item.options?.[option]))
    .find((option) => option?.scenario)
  const scenario = (chosen?.scenario ?? defaultScenario) === 'transition' ? transition : update

  const details = [
    `${result.caption}: ${scenario.title}`,
    ...list.map((item, index) => {
      const labels = (answers[index] ?? []).map((option) => item.options?.[option]?.label)
      return `${item.title}: ${labels.join('; ')}`
    }),
  ]
    .map(plain)
    .join('\n')

  return (
    <div className={styles.band} data-no-sticky-cta>
      <SectionShell>
        <div className={styles.layout}>
          <div className={styles.head}>
            <SectionHeader title={title} lead={lead} />
          </div>

          <div ref={anchor} className={styles.main} tabIndex={-1}>
            {finished ? (
              <div className={styles.result}>
                <div className={styles.resultHead}>
                  <p className={`label-14 ${styles.resultCaption}`}>{result.caption}</p>
                  <h3 className={`h2 ${styles.resultTitle}`}>{scenario.title}</h3>
                </div>

                <dl className={styles.spec}>
                  <div className={styles.specRow}>
                    <dt className={`label-13 ${styles.specLabel}`}>{result.termLabel}</dt>
                    <dd className={`number-s ${styles.specTerm}`}>{scenario.term}</dd>
                  </div>
                  <div className={styles.specRow}>
                    <dt className={`label-13 ${styles.specLabel}`}>{result.nextLabel}</dt>
                    <dd className={`body-m ${styles.specText}`}>{scenario.next}</dd>
                  </div>
                </dl>

                <p className={`body-s ${styles.disclaimer}`}>{result.disclaimer}</p>

                <div className={styles.form}>
                  <LeadForm
                    source={source}
                    phone={phone}
                    title={form.title}
                    lead={form.lead}
                    submitLabel={form.submitLabel}
                    details={details}
                    onDone={restart}
                  />
                </div>
              </div>
            ) : (
              question && (
                <div className={styles.step}>
                  <div className={styles.progress}>
                    <p className={`label-13 ${styles.progressLabel}`} aria-live="polite">
                      {stepLabel
                        .replace('{n}', String(step + 1))
                        .replace('{total}', String(list.length))}
                    </p>
                    <div className={styles.track} aria-hidden="true">
                      {list.map((item, index) => (
                        <span
                          key={item.title}
                          className={styles.segment}
                          data-done={index <= step || undefined}
                        />
                      ))}
                    </div>
                  </div>

                  <div key={step} className={styles.question}>
                    <div className={styles.questionHead}>
                      <h3 id={groupId} className={`h3 ${styles.questionTitle}`}>
                        {question.title}
                      </h3>
                      {question.hint && <p className={`body-s ${styles.hint}`}>{question.hint}</p>}
                    </div>

                    <div
                      className={styles.options}
                      role={question.multiple ? 'group' : 'radiogroup'}
                      aria-labelledby={groupId}
                    >
                      {question.options?.map((option, index) => {
                        const selected = picked.includes(index)
                        return (
                          <label
                            key={option.label}
                            className={styles.option}
                            data-selected={selected || undefined}
                          >
                            <input
                              className={styles.input}
                              type={question.multiple ? 'checkbox' : 'radio'}
                              name={`${groupId}-${step}`}
                              checked={selected}
                              onChange={() => toggle(index)}
                            />
                            <span
                              className={styles.indicator}
                              data-kind={question.multiple ? 'checkbox' : 'radio'}
                              aria-hidden="true"
                            >
                              {question.multiple && selected && <Icon slug="check" size={20} />}
                            </span>
                            <span className={styles.optionText}>
                              <span className={`label-16 ${styles.optionTitle}`}>
                                {option.label}
                              </span>
                              {option.caption && (
                                <span className={`body-s ${styles.optionCaption}`}>
                                  {option.caption}
                                </span>
                              )}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>

                  <div className={styles.nav}>
                    <Button
                      variant="ghost"
                      size="M"
                      iconLeft="arrow-back"
                      disabled={step === 0}
                      onClick={() => go(() => setStep(step - 1))}
                    >
                      {backLabel}
                    </Button>
                    <Button
                      size="M"
                      disabled={picked.length === 0}
                      onClick={() =>
                        go(() => {
                          if (isLast) setFinished(true)
                          else setStep(step + 1)
                        })
                      }
                    >
                      {isLast ? finishLabel : nextLabel}
                    </Button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </SectionShell>
    </div>
  )
}
