import { Icon } from './Icon'
import { TextLink } from './TextLink'
import { SITE_URL } from '@/lib/site'
import styles from './Breadcrumbs.module.css'

export type Crumb = { label: string; href?: string }

/**
 * Хлебные крошки с разметкой BreadcrumbList. Последний пункт без ссылки.
 * Главная подставляется сама: передавать только то, что ниже неё.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const trail: Crumb[] = [{ label: 'Главная', href: '/' }, ...items]

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE_URL}${item.href}` } : {}),
    })),
  }

  return (
    <nav aria-label="Хлебные крошки">
      <ol className={styles.list}>
        {trail.map((item, index) => (
          <li key={item.label} className={styles.item}>
            {index > 0 && <Icon slug="chevron-right" size={20} className={styles.chevron} />}
            {item.href ? (
              <TextLink href={item.href} size="S">
                {item.label}
              </TextLink>
            ) : (
              <span className={`body-s ${styles.current}`} aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </nav>
  )
}
