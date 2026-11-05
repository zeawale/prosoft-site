'use client'

import { useSyncExternalStore } from 'react'
import { CaseCard, type CaseCardLabels } from '@/components/sections/CaseCard'
import { Button } from '@/components/ui/Button'
import { ROUTES } from '@/lib/navigation'
import { FilterChip } from './FilterChip'
import styles from './CasesCatalog.module.css'

export type CatalogCase = {
  id: number
  title: string
  slug: string
  metric: string
  before: string
  after: string
  result: string
  task: string
  done: string
}

export type FilterGroup = {
  key: string
  label: string
  options: { value: string; label: string; caseIds: number[] }[]
}

type Props = {
  cases: CatalogCase[]
  groups: FilterGroup[]
  allLabel: string
  labels: CaseCardLabels
  results: {
    countLabel: string
    countOneLabel: string
    emptyCountLabel: string
    resetLabel: string
    emptyTitle: string
    emptyText: string
  }
}

/**
 * Страница статическая, поэтому выбор читается из адреса уже в браузере:
 * useSearchParams убрал бы карточки из готового HTML. replaceState сам событий
 * не шлёт, подписчиков оповещаем руками.
 */
const listeners = new Set<() => void>()

const subscribe = (onChange: () => void) => {
  listeners.add(onChange)
  window.addEventListener('popstate', onChange)
  return () => {
    listeners.delete(onChange)
    window.removeEventListener('popstate', onChange)
  }
}

const getSearch = () => window.location.search
const getServerSearch = () => ''

const writeSearch = (params: URLSearchParams) => {
  const query = params.toString()
  window.history.replaceState(null, '', query ? `?${query}` : window.location.pathname)
  listeners.forEach((listener) => listener())
}

const fillCount = (template: string, shown: number, total: number) =>
  template.replace('{shown}', String(shown)).replace('{total}', String(total))

/** Каталог кейсов: группы фильтров работают вместе, внутри группы одно значение */
export function CasesCatalog({ cases, groups, allLabel, labels, results }: Props) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch)
  const params = new URLSearchParams(search)

  // Значение, которого нет в списке, игнорируем: адрес могли сохранить до правки в админке
  const active = groups.flatMap((group) => {
    const option = group.options.find((item) => item.value === params.get(group.key))
    return option ? [{ key: group.key, option }] : []
  })
  const visible = cases.filter((item) =>
    active.every(({ option }) => option.caseIds.includes(item.id)),
  )

  const choose = (key: string, value: string | null) => {
    const next = new URLSearchParams(window.location.search)
    if (value) next.set(key, value)
    else next.delete(key)
    writeSearch(next)
  }

  const reset = () => {
    const next = new URLSearchParams(window.location.search)
    groups.forEach((group) => next.delete(group.key))
    writeSearch(next)
  }

  const shown = visible.length
  const isOne = shown % 10 === 1 && shown % 100 !== 11
  const count = shown
    ? fillCount(isOne ? results.countOneLabel : results.countLabel, shown, cases.length)
    : results.emptyCountLabel

  return (
    <>
      <div className={styles.filters}>
        {groups.map((group) => {
          const current = active.find((item) => item.key === group.key)?.option.value
          return (
            <div
              key={group.key}
              className={styles.group}
              role="group"
              aria-labelledby={`filter-${group.key}`}
            >
              <p id={`filter-${group.key}`} className={`label-14 ${styles.groupLabel}`}>
                {group.label}
              </p>
              <div className={styles.chips}>
                <FilterChip
                  label={allLabel}
                  selected={!current}
                  onClick={() => choose(group.key, null)}
                />
                {group.options.map((option) => (
                  <FilterChip
                    key={option.value}
                    label={option.label}
                    selected={option.value === current}
                    onClick={() => choose(group.key, option.value)}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <div className={styles.results}>
        <p className={`body-m ${styles.count}`} aria-live="polite">
          {count}
        </p>
        {active.length > 0 && (
          <button type="button" className={styles.reset} onClick={reset}>
            <span className={styles.resetText}>{results.resetLabel}</span>
          </button>
        )}
      </div>

      {shown > 0 ? (
        <div className={styles.grid}>
          {visible.map((item) => (
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
      ) : (
        <div className={styles.empty}>
          <h2 className={`h3 ${styles.emptyTitle}`}>{results.emptyTitle}</h2>
          <p className={`body-m ${styles.emptyText}`}>{results.emptyText}</p>
          <Button variant="secondary" size="M" onClick={reset}>
            {results.resetLabel}
          </Button>
        </div>
      )}
    </>
  )
}
