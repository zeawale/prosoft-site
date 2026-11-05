import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/navigation'
import { CaseTags } from './CaseTags'
import styles from './CaseNext.module.css'

type Props = {
  tags?: { label: string; accent?: boolean | null }[] | null
  next?: { title: string; summary: string; href: string } | null
  labels: { tags: string; all: string; caption: string; button: string }
}

/** Низ кейса: теги, ссылка на все кейсы, карточка следующего кейса */
export function CaseNext({ tags, next, labels }: Props) {
  return (
    <div className={`wrap ${styles.next}`}>
      <div className={styles.tags}>
        <p className={`label-14 ${styles.tagsLabel}`}>{labels.tags}</p>
        <div className={styles.list}>{tags && <CaseTags tags={tags} />}</div>
        <Button variant="ghost" size="M" href={ROUTES.cases}>
          {labels.all}
        </Button>
      </div>

      {next && (
        <section className={styles.card}>
          <div className={styles.content}>
            <p className={`label-14 ${styles.caption}`}>{labels.caption}</p>
            <h2 className={`h2 ${styles.title}`}>{next.title}</h2>
            <p className={`body-m ${styles.summary}`}>{next.summary}</p>
          </div>
          <div className={styles.action}>
            <Button variant="secondary" size="M" fill href={next.href}>
              {labels.button}
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}
