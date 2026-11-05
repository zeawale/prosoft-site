import type { ComponentProps } from 'react'
import { CaseCard, type CaseCardLabels } from '@/components/sections/CaseCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TextLink } from '@/components/ui/TextLink'
import { ROUTES } from '@/lib/navigation'
import type { Case } from '@/payload-types'
import { Webinar } from './Webinar'
import styles from './Proof.module.css'

type Props = {
  title: string
  allLabel: string
  cases: Case[]
  tag?: string | null
  labels: CaseCardLabels
  /** Запись вебинара: без неё блок остаётся с одним кейсом */
  webinar?: ComponentProps<typeof Webinar> | null
}

/** Блок «Как это проходит у клиентов»: кейс слева, запись вебинара с таймкодами справа */
export function Proof({ title, allLabel, cases, tag, labels, webinar }: Props) {
  return (
    <>
      <div className={styles.head}>
        <SectionHeader title={title} action={<TextLink href={ROUTES.cases}>{allLabel}</TextLink>} />
      </div>

      <div className={styles.row}>
        <div className={styles.cases}>
          {cases.map((item) => (
            <CaseCard
              key={item.id}
              title={item.title}
              href={`${ROUTES.cases}/${item.slug}`}
              metric={item.metric}
              before={item.before}
              after={item.after}
              result={item.result}
              task={item.task}
              done={item.done}
              labels={labels}
              top={tag ? <span className={`label-13 ${styles.tag}`}>{tag}</span> : undefined}
            />
          ))}
        </div>

        {webinar && <Webinar {...webinar} />}
      </div>
    </>
  )
}
