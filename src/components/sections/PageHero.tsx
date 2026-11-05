import type { ReactNode } from 'react'
import { Breadcrumbs, type Crumb } from '@/components/ui/Breadcrumbs'
import { HeroVisual, type HeroName } from './HeroVisual'
import styles from './PageHero.module.css'

type Props = {
  title: string
  lead?: string | null
  /** Комплект ролика из public/hero */
  visual: HeroName
  /** Крошки без главной, она подставляется сама */
  breadcrumbs?: Crumb[]
  /** Стиль заголовка: на 404 он Heading/H1, на остальных Display/48 */
  titleStyle?: 'display-48' | 'h1'
  /** Кнопки: Button и LeadButton */
  actions?: ReactNode
  /** Список ссылок под кнопками, на 404 это направления */
  links?: ReactNode
  /** Строки фактов под кнопками */
  facts?: { text: string }[] | null
  /** Блок под сценой, например DateStrip */
  below?: ReactNode
  /** Расстояние до блока под сценой: 96 на главной, 48 на внутренних */
  belowGap?: 48 | 96
}

/** Первый экран: сцена 720 с роликом на всю ширину, контент в пяти колонках из двенадцати */
export function PageHero({
  title,
  lead,
  visual,
  breadcrumbs,
  titleStyle = 'display-48',
  actions,
  links,
  facts,
  below,
  belowGap = 48,
}: Props) {
  const hasNext = Boolean(actions || links || facts?.length)

  return (
    <div className={belowGap === 96 ? styles.gapL : styles.gapM}>
      <section className={styles.stage} data-hero>
        <div className={styles.visual}>
          <HeroVisual name={visual} />
        </div>

        <div className={`wrap ${styles.grid}`}>
          <div className={styles.content}>
            <div className={styles.head}>
              {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
              <h1 className={`${titleStyle} ${styles.title}`}>{title}</h1>
              {lead && <p className={`body-l ${styles.lead}`}>{lead}</p>}
            </div>

            {hasNext && (
              <div className={styles.next}>
                {actions && <div className={styles.actions}>{actions}</div>}
                {links}
                {facts && facts.length > 0 && (
                  <ul className={styles.facts}>
                    {facts.map((fact) => (
                      <li key={fact.text} className={`body-m ${styles.fact}`}>
                        {fact.text}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {below}
    </div>
  )
}
