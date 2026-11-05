import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import styles from './TextLink.module.css'

type Props = {
  href: string
  children: ReactNode
  /** M — Body/M в тексте и под блоками, S — Body/S в подписях и подвале */
  size?: 'M' | 'S'
  /** Иконка open_in_new, новая вкладка */
  external?: boolean
  className?: string
}

/** Текстовая ссылка макета: подчёркнута рамкой снизу, на hover подчёркивание уходит */
export function TextLink({ href, children, size = 'M', external = false, className }: Props) {
  const cls = [styles.link, size === 'S' ? styles.sizeS : styles.sizeM, className]
    .filter(Boolean)
    .join(' ')
  const content = (
    <>
      <span className={styles.text}>{children}</span>
      {external && <Icon slug="open-in-new" size={20} />}
    </>
  )

  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noreferrer">
        {content}
      </a>
    )
  }

  return (
    <Link href={href} className={cls}>
      {content}
    </Link>
  )
}
