'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LeadButton } from '@/components/lead/LeadButton'
import { Button } from '@/components/ui/Button'
import { Icon } from '@/components/ui/Icon'
import { mainNav, mobileNav, ROUTES, serviceNav } from '@/lib/navigation'
import { usePastHero } from '@/lib/useScrollState'
import styles from './Header.module.css'

type Props = { phone: string; phoneRaw: string }
type Menu = 'services' | 'mobile' | null

const FOCUSABLE = 'a[href], button:not([disabled])'

/**
 * Шапка: position sticky. Default 84, Compact 64 с тенью ниже hero, меню
 * «Услуги» открывается по клику и закрывается по Esc и клику мимо, мобильное
 * меню на весь экран с запертым фокусом. Ниже 1200 — кнопка меню: телефон,
 * пункты и кнопка в одну строку не помещаются.
 */
export function HeaderBar({ phone, phoneRaw }: Props) {
  const pathname = usePathname()
  const compact = usePastHero()
  const [menu, setMenu] = useState<Menu>(null)
  const rootRef = useRef<HTMLElement>(null)
  const mobileRef = useRef<HTMLDivElement>(null)

  const close = () => setMenu(null)

  useEffect(() => {
    if (menu === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenu(null)
        return
      }
      if (menu !== 'mobile' || e.key !== 'Tab' || !rootRef.current) return

      const focusable = rootRef.current.querySelectorAll<HTMLElement>(
        `.${styles.bar} [data-menu-toggle], .${styles.mobile} a, .${styles.mobile} button`,
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setMenu(null)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)

    const { overflow } = document.body.style
    if (menu === 'mobile') {
      document.body.style.overflow = 'hidden'
      mobileRef.current?.querySelector<HTMLElement>(FOCUSABLE)?.focus()
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
      document.body.style.overflow = overflow
    }
  }, [menu])

  return (
    <header
      ref={rootRef}
      className={`${styles.header} ${compact ? styles.compact : ''} ${
        menu === 'mobile' ? styles.mobileOpen : ''
      }`}
    >
      <div className={styles.bar}>
        <div className={styles.left}>
          <Link href={ROUTES.home} className={styles.logo} aria-label="ПРО-СОФТ, на главную">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logos/logo-light.svg" alt="ПРО-СОФТ" width={134} height={37} />
          </Link>

          <nav className={styles.nav} aria-label="Основное меню">
            {/* Без JS ссылка ведёт на список направлений на главной */}
            <Link
              href="/#services"
              className={`label-16 ${styles.navItem} ${menu === 'services' ? styles.navOpen : ''}`}
              role="button"
              aria-expanded={menu === 'services'}
              aria-haspopup="true"
              onClick={(e) => {
                e.preventDefault()
                setMenu(menu === 'services' ? null : 'services')
              }}
            >
              Услуги
              <Icon slug="expand-more" size={20} className={styles.chevron} />
            </Link>
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`label-16 ${styles.navItem}`}
                aria-current={pathname === item.href ? 'page' : undefined}
                onClick={close}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className={styles.right}>
          <a href={`tel:${phoneRaw}`} className={`label-16 ${styles.phone}`}>
            {phone}
          </a>
          <LeadButton source="header" size={compact ? 'S' : 'M'}>
            Получить диагностику
          </LeadButton>
        </div>

        <button
          type="button"
          data-menu-toggle
          className={styles.toggle}
          aria-label={menu === 'mobile' ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={menu === 'mobile'}
          onClick={() => setMenu(menu === 'mobile' ? null : 'mobile')}
        >
          <Icon slug={menu === 'mobile' ? 'close' : 'menu'} size={24} />
        </button>
      </div>

      {menu === 'services' && (
        <div className={styles.services}>
          <ul className={styles.directions}>
            {serviceNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.menuItem} onClick={close}>
                  <Icon slug={item.icon} size={24} className={styles.menuIcon} />
                  <span className={styles.menuText}>
                    <span className={`label-16 ${styles.menuTitle}`}>{item.title}</span>
                    <span className={`body-s ${styles.menuLead}`}>{item.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.servicesClose}>
            <Button variant="ghost" size="M" onClick={close}>
              Закрыть
            </Button>
          </div>
        </div>
      )}

      {menu === 'mobile' && (
        <div ref={mobileRef} className={styles.mobile}>
          <ul className={styles.mobileList}>
            {mobileNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={`h5 ${styles.mobileLink}`} onClick={close}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileFooter}>
            <a href={`tel:${phoneRaw}`} className="h5">
              {phone}
            </a>
            <LeadButton source="mobile-menu" fill>
              Получить диагностику
            </LeadButton>
          </div>
        </div>
      )}
    </header>
  )
}
