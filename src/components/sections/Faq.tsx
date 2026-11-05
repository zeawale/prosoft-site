import { Icon } from '@/components/ui/Icon'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SectionShell } from './SectionShell'
import styles from './Faq.module.css'

export type FaqItem = { question: string; answer: string }

type Props = {
  title: string
  lead?: string | null
  items?: FaqItem[] | null
}

/**
 * Аккордеон: заголовок слева, вопросы справа, открыт один вопрос. Нативный
 * details с общим name закрывает соседа сам, поэтому JS здесь нет, а ответы
 * лежат в разметке и индексируются. Разметку FAQPage даёт FaqJsonLd.
 */
export function Faq({ title, lead, items }: Props) {
  if (!items?.length) return null

  return (
    <SectionShell>
      <div className={styles.layout}>
        <div className={styles.head}>
          <SectionHeader title={title} lead={lead} />
        </div>

        <div className={styles.questions}>
          {items.map((item, index) => (
            <details key={item.question} className={styles.item} name="faq" open={index === 0}>
              <summary className={styles.question}>
                <span className={`h5 ${styles.questionText}`}>{item.question}</span>
                <Icon slug="add" size={24} className={styles.iconAdd} />
                <Icon slug="remove" size={24} className={styles.iconRemove} />
              </summary>
              <div className={styles.answer}>
                {item.answer.split('\n').map((paragraph, n) => (
                  // Индекс в ключе: в ответе бывают одинаковые абзацы
                  <p key={n} className={`body-m ${styles.paragraph}`}>
                    {paragraph}
                  </p>
                ))}
              </div>
            </details>
          ))}
        </div>
      </div>
    </SectionShell>
  )
}
