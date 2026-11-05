import { SectionHeader } from '@/components/ui/SectionHeader'
import type { Upp } from '@/payload-types'
import { ScenarioCard } from './ScenarioCard'
import styles from './Scenarios.module.css'

/** Блок «Три сценария»: остаться на УПП, перейти на КА, перейти на ERP */
export function Scenarios({ title, lead, items, ...labels }: Upp['scenarios']) {
  return (
    <>
      <SectionHeader title={title} lead={lead} />
      <div className={styles.cards}>
        {items?.map((item) => (
          <ScenarioCard
            key={item.title}
            title={item.title}
            fit={item.fit}
            term={item.term}
            budget={item.budget}
            licenses={item.licenses}
            labels={labels}
          />
        ))}
      </div>
    </>
  )
}
