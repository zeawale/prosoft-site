import { Icon } from '@/components/ui/Icon'
import { SectionHeader } from '@/components/ui/SectionHeader'
import styles from './CaseStory.module.css'

type Props = {
  task: string
  solution: string
  results?: { text: string }[] | null
  labels: { task: string; solution: string; result: string }
}

/** История кейса: задача, решение, результат списком */
export function CaseStory({ task, solution, results, labels }: Props) {
  return (
    <div className={`wrap ${styles.story}`}>
      <section className={styles.block}>
        <SectionHeader title={labels.task} />
        <p className={`body-l ${styles.text}`}>{task}</p>
      </section>

      <section className={styles.block}>
        <SectionHeader title={labels.solution} />
        <p className={`body-l ${styles.text}`}>{solution}</p>
      </section>

      {results && results.length > 0 && (
        <section className={styles.block}>
          <SectionHeader title={labels.result} />
          <ul className={styles.points}>
            {results.map((point) => (
              <li key={point.text} className={styles.point}>
                <Icon slug="task-alt" className={styles.marker} />
                <span className={`body-m ${styles.pointText}`}>{point.text}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
