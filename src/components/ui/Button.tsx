import Link from 'next/link'
import type { ReactNode } from 'react'
import { Icon } from './Icon'
import type { IconName } from '@/lib/icons'
import styles from './Button.module.css'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'S' | 'M' | 'L'

type Common = {
  children: ReactNode
  variant?: ButtonVariant
  size?: ButtonSize
  /** Ширина FILL: в формах и на телефоне */
  fill?: boolean
  iconLeft?: IconName
  iconRight?: IconName
  className?: string
}

type AsLink = Common & { href: string; external?: boolean }
type AsButton = Common & {
  href?: undefined
  type?: 'button' | 'submit'
  onClick?: () => void
  disabled?: boolean
}

/** Класс кнопки отдельно: формы и LeadButton вешают его на свой элемент */
export function buttonClass({
  variant = 'primary',
  size = 'L',
  fill = false,
  className,
}: Pick<Common, 'variant' | 'size' | 'fill' | 'className'>) {
  return [styles.button, styles[variant], styles[`size${size}`], fill && styles.fill, className]
    .filter(Boolean)
    .join(' ')
}

/** Кнопка макета: Primary, Secondary, Ghost; размеры S 40, M 48, L 56 */
export function Button(props: AsLink | AsButton) {
  const { children, iconLeft, iconRight } = props
  const className = buttonClass(props)
  const content = (
    <>
      {iconLeft && <Icon slug={iconLeft} size={20} />}
      <span>{children}</span>
      {iconRight && <Icon slug={iconRight} size={20} />}
    </>
  )

  if (props.href !== undefined) {
    return props.external ? (
      <a href={props.href} className={className} target="_blank" rel="noreferrer">
        {content}
      </a>
    ) : (
      <Link href={props.href} className={className}>
        {content}
      </Link>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      className={className}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {content}
    </button>
  )
}
