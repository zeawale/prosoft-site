import { LeadButton } from '@/components/lead/LeadButton'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { SectionShell } from './SectionShell'
import styles from './DiagnosticsOffer.module.css'

type Props = {
  caption?: string | null
  title: string
  lead?: string | null
  checksTitle?: string | null
  checksText?: string | null
  buttonLabel: string
  note?: string | null
  deliverables?: { title: string; text: string }[] | null
  /** Откуда заявка, например `home-diagnostics` */
  source: string
}

/** Тёмный блок диагностики: на главной и внизу 404 один и тот же */
export function DiagnosticsOffer({
  caption,
  title,
  lead,
  checksTitle,
  checksText,
  buttonLabel,
  note,
  deliverables,
  source,
}: Props) {
  return (
    <SectionShell inverse noStickyCta>
      <div className={styles.layout}>
        <div className={styles.offer}>
          <SectionHeader caption={caption} title={title} lead={lead} />

          {checksText && (
            <div className={styles.checks}>
              {checksTitle && <p className={`label-14 ${styles.checksTitle}`}>{checksTitle}</p>}
              <p className={`body-m ${styles.checksText}`}>{checksText}</p>
            </div>
          )}

          <div className={styles.actions}>
            <LeadButton source={source}>{buttonLabel}</LeadButton>
            {note && <p className={`body-s ${styles.note}`}>{note}</p>}
          </div>
        </div>

        {deliverables && deliverables.length > 0 && (
          <ol className={styles.deliverables}>
            {deliverables.map((item, index) => (
              <li key={item.title} className={styles.card}>
                <span className={`number-m ${styles.number}`}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className={styles.text}>
                  <span className={`h4 ${styles.cardTitle}`}>{item.title}</span>
                  <span className={`body-m ${styles.cardText}`}>{item.text}</span>
                </span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </SectionShell>
  )
}
