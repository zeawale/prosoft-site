import { CaseCard, type CaseCardLabels } from '@/components/sections/CaseCard'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { TextLink } from '@/components/ui/TextLink'
import { ROUTES } from '@/lib/navigation'
import type { Case } from '@/payload-types'
import styles from './Proof.module.css'

type Props = {
  title: string
  allLabel: string
  cases: Case[]
  labels: CaseCardLabels
}

/** Блок «Кейсы внедрения»: карточки из коллекции кейсов, высоты в ряду равны */
export function Proof({ title, allLabel, cases, labels }: Props) {
  return (
    <>
      <div className={styles.head}>
        <SectionHeader title={title} action={<TextLink href={ROUTES.cases}>{allLabel}</TextLink>} />
      </div>

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
          />
        ))}
      </div>
    </>
  )
}
