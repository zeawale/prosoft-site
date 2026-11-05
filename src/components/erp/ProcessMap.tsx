'use client'

import { useId, useState } from 'react'
import { Icon } from '@/components/ui/Icon'
import { TextLink } from '@/components/ui/TextLink'
import styles from './ProcessMap.module.css'

type Node = {
  icon: string
  title: string
  subsystem: string
  benefit: string
  /** Адрес кейса. Пока его нет, подпись показывается без ссылки */
  caseHref?: string | null
  caseLink?: string | null
  openByDefault?: boolean | null
}

type Props = {
  integrationsTitle: string
  integrations?: { label: string }[] | null
  nodePrefix: string
  subsystemLabel: string
  benefitLabel: string
  caseLabel: string
  nodes: Node[]
}

/**
 * Карта процессов: участки компании и панель с подсистемой 1С:ERP. Открыт один
 * участок, повторный клик закрывает. Панель стоит в разметке сразу за своим
 * участком: на телефоне так и видно, а в десктопном ряду сетка уводит её вниз.
 */
export function ProcessMap({
  integrationsTitle,
  integrations,
  nodePrefix,
  subsystemLabel,
  benefitLabel,
  caseLabel,
  nodes,
}: Props) {
  const panelId = useId()
  const [active, setActive] = useState(() => nodes.findIndex((node) => node.openByDefault))

  return (
    <div className={styles.map}>
      <div className={styles.integrations}>
        <div className={styles.integrationsHead}>
          <Icon slug="hub" size={24} className={styles.icon} />
          <p className={`h6 ${styles.integrationsTitle}`}>{integrationsTitle}</p>
        </div>
        {integrations?.map((item) => (
          <span key={item.label} className={`label-13 ${styles.tag}`}>
            {item.label}
          </span>
        ))}
      </div>

      <ul className={styles.nodes}>
        {nodes.map((node, index) => {
          const open = index === active
          return (
            <li key={node.title} className={styles.item}>
              <button
                type="button"
                className={styles.node}
                aria-expanded={open}
                aria-controls={open ? panelId : undefined}
                data-open={open || undefined}
                onClick={() => setActive(open ? -1 : index)}
              >
                <Icon slug={node.icon} size={24} className={styles.icon} />
                <span className={`h6 ${styles.nodeTitle}`}>{node.title}</span>
                <span className={`body-s ${styles.nodeCaption}`}>
                  {nodePrefix} {node.subsystem}
                </span>
              </button>

              {index < nodes.length - 1 && (
                <span className={styles.connector}>
                  <Icon slug="chevron-right" size={24} />
                </span>
              )}

              {open && (
                <div id={panelId} className={styles.panel}>
                  <div className={`${styles.column} ${styles.subsystem}`}>
                    <p className={`label-13 ${styles.panelLabel}`}>{subsystemLabel}</p>
                    <p className={`h5 ${styles.panelTitle}`}>{node.subsystem}</p>
                  </div>
                  <div className={styles.column}>
                    <p className={`label-13 ${styles.panelLabel}`}>{benefitLabel}</p>
                    <p className={`body-m ${styles.panelText}`}>{node.benefit}</p>
                  </div>
                  {node.caseLink && (
                    <div className={styles.column}>
                      <p className={`label-13 ${styles.panelLabel} ${styles.caseLabel}`}>
                        {caseLabel}
                      </p>
                      {node.caseHref ? (
                        <TextLink href={node.caseHref}>{node.caseLink}</TextLink>
                      ) : (
                        <p className={`body-m ${styles.panelText}`}>{node.caseLink}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
