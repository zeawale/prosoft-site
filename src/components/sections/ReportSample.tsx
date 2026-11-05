'use client'

import { useId, useRef, useState, type KeyboardEvent } from 'react'
import type { Diagnostic } from '@/payload-types'
import styles from './ReportSample.module.css'

type Sample = Diagnostic['report']['sample']
type PageKey = Sample['startPage']

const ORDER: PageKey[] = ['title', 'findings', 'plan']

/**
 * Образец отчёта: лист и три вкладки. Клик по вкладке меняет лист и раскрывает
 * содержание этой части. Номер страницы только в подвале листа.
 */
export function ReportSample({
  brand,
  document: documentLabel,
  note,
  startPage,
  titlePage,
  findingsPage,
  planPage,
}: Sample) {
  const [active, setActive] = useState<PageKey>(startPage)
  const baseId = useId()
  const tabs = useRef<(HTMLButtonElement | null)[]>([])

  const parts = { title: titlePage, findings: findingsPage, plan: planPage }
  const activeIndex = ORDER.indexOf(active)

  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[event.key]
    if (!step) return
    event.preventDefault()
    const next = (activeIndex + step + ORDER.length) % ORDER.length
    setActive(ORDER[next])
    tabs.current[next]?.focus()
  }

  return (
    <div className={styles.viewer}>
      <div
        className={styles.sheet}
        role="tabpanel"
        id={`${baseId}-panel`}
        aria-labelledby={`${baseId}-tab-${active}`}
      >
        <div className={styles.sheetHead}>
          <span className={`label-14 ${styles.brand}`}>{brand}</span>
          <span className={`label-13 ${styles.document}`}>{documentLabel}</span>
        </div>

        <div key={active} className={styles.sheetBody}>
          {active === 'title' && <TitlePage {...titlePage} />}
          {active === 'findings' && <FindingsPage {...findingsPage} />}
          {active === 'plan' && <PlanPage {...planPage} />}
        </div>

        <div className={`label-12 ${styles.sheetFoot}`}>
          <span>{note}</span>
          <span>
            {activeIndex + 1} / {ORDER.length}
          </span>
        </div>
      </div>

      <div
        className={styles.tabs}
        role="tablist"
        aria-orientation="vertical"
        aria-label={documentLabel}
        onKeyDown={onKeyDown}
      >
        {ORDER.map((key, index) => {
          const part = parts[key]
          const selected = key === active
          return (
            <div key={key} className={styles.tab} data-active={selected || undefined}>
              <button
                ref={(node) => {
                  tabs.current[index] = node
                }}
                type="button"
                role="tab"
                id={`${baseId}-tab-${key}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel`}
                tabIndex={selected ? 0 : -1}
                className={styles.tabButton}
                onClick={() => setActive(key)}
              >
                <span className={`label-14 ${styles.num}`}>{index + 1}</span>
                <span className={styles.tabHead}>
                  <span className={`h5 ${styles.tabTitle}`}>{part.tabTitle}</span>
                  <span className={`body-s ${styles.tabLead}`}>{part.tabLead}</span>
                </span>
              </button>

              {selected && part.tabItems && part.tabItems.length > 0 && (
                <ul className={styles.inside}>
                  {part.tabItems.map((item) => (
                    <li key={item.text} className={`body-m ${styles.insideItem}`}>
                      {item.text}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TitlePage({ kicker, heading, spec, totals }: Sample['titlePage']) {
  return (
    <>
      <p className={`label-14 ${styles.kicker}`}>{kicker}</p>
      <p className={`h3 ${styles.heading}`}>{heading}</p>

      <dl className={styles.spec}>
        {spec?.map((row) => (
          <div key={row.label} className={styles.specRow}>
            <dt className={`label-13 ${styles.specLabel}`}>{row.label}</dt>
            <dd className={`body-s ${styles.specValue}`}>{row.value}</dd>
          </div>
        ))}
      </dl>

      <ul className={styles.totals}>
        {totals?.map((total) => (
          <li key={total.label} className={styles.total}>
            <span className={`number-m ${styles.totalValue}`}>{total.value}</span>
            <span className={`label-12 ${styles.totalLabel}`}>{total.label}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

function FindingsPage({
  heading,
  areaLabel,
  findingLabel,
  hoursLabel,
  rows,
  totalLabel,
  totalNote,
  totalHours,
}: Sample['findingsPage']) {
  return (
    <>
      <p className={`h4 ${styles.heading}`}>{heading}</p>

      <table className={`${styles.table} ${styles.findings}`}>
        <thead>
          <tr className={`label-13 ${styles.tableHead}`}>
            <th scope="col">{areaLabel}</th>
            <th scope="col">{findingLabel}</th>
            <th scope="col" className={styles.hours}>
              {hoursLabel}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row) => (
            <tr key={row.area}>
              <td className={`body-s ${styles.primary}`}>{row.area}</td>
              <td className={`body-s ${styles.secondary}`}>{row.finding}</td>
              <td className={`number-s ${styles.hours} ${styles.primary}`}>{row.hours}</td>
            </tr>
          ))}
          <tr className={styles.totalRow}>
            <td className={`label-14 ${styles.primary}`}>{totalLabel}</td>
            <td className={`body-s ${styles.secondary}`}>{totalNote}</td>
            <td className={`number-s ${styles.hours} ${styles.accent}`}>{totalHours}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

function PlanPage({
  heading,
  stages,
  stageLabel,
  resultLabel,
  acceptLabel,
  rows,
  note,
}: Sample['planPage']) {
  return (
    <>
      <p className={`h4 ${styles.heading}`}>{heading}</p>

      <ol className={styles.lane}>
        {stages?.map((stage) => (
          <li key={stage.label} className={styles.stage}>
            <span className={styles.rail} aria-hidden="true">
              <span className={styles.node} />
              <span className={styles.line} />
            </span>
            <span className={`label-13 ${styles.stageLabel}`}>{stage.label}</span>
            <span className={`body-s ${styles.primary}`}>{stage.title}</span>
            <span className={`number-s ${styles.accent}`}>{stage.term}</span>
          </li>
        ))}
      </ol>

      <table className={`${styles.table} ${styles.plan}`}>
        <thead>
          <tr className={`label-13 ${styles.tableHead}`}>
            <th scope="col">{stageLabel}</th>
            <th scope="col">{resultLabel}</th>
            <th scope="col">{acceptLabel}</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row) => (
            <tr key={row.stage} className="body-s">
              <td className={styles.primary}>{row.stage}</td>
              <td className={styles.secondary}>{row.result}</td>
              <td className={styles.primary}>{row.accept}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={`body-s ${styles.secondary}`}>{note}</p>
    </>
  )
}
