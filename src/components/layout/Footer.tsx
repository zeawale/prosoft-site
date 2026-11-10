import Link from 'next/link'
import { MessengerLogo } from '@/components/ui/MessengerLogo'
import { TextLink } from '@/components/ui/TextLink'
import { footerServices, legalNav, mainNav, ROUTES } from '@/lib/navigation'
import { getSettings } from '@/lib/queries'
import styles from './Footer.module.css'

/** Подвал: всегда тёмный, data-no-sticky-cta прячет нижнюю панель на телефоне */
export async function Footer() {
  const settings = await getSettings()
  // Пустая ссылка в реквизитах — значка нет
  const socials = [
    { name: 'max' as const, label: 'MAX', url: settings.maxUrl },
    { name: 'telegram' as const, label: 'Telegram', url: settings.telegramUrl },
  ].filter((item): item is typeof item & { url: string } => Boolean(item.url))

  return (
    <footer className={`inverse ${styles.footer}`} data-no-sticky-cta>
      <div className={`wrap ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href={ROUTES.home} aria-label="ПРО-СОФТ, на главную">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/logo-dark.svg" alt="ПРО-СОФТ" width={134} height={37} />
            </Link>
            <p className={`body-s ${styles.secondary}`}>{settings.footerTagline}</p>
          </div>

          <nav className={styles.column} aria-label="Услуги">
            <p className={`label-14 ${styles.muted}`}>Услуги</p>
            {footerServices.map((item) => (
              <Link key={item.href} href={item.href} className={`body-m ${styles.link}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <nav className={styles.column} aria-label="Компания">
            <p className={`label-14 ${styles.muted}`}>Компания</p>
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className={`body-m ${styles.link}`}>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className={styles.column}>
            <p className={`label-14 ${styles.muted}`}>Контакты</p>
            <a href={`tel:${settings.phoneRaw}`} className={`h5 ${styles.primary}`}>
              {settings.phone}
            </a>
            <a href={`mailto:${settings.email}`} className={`body-m ${styles.email}`}>
              {settings.email}
            </a>
            <p className={`body-s ${styles.secondary}`}>{settings.address}</p>
            {socials.length > 0 && (
              <div className={styles.socials}>
                {socials.map(({ name, label, url }) => (
                  <a
                    key={name}
                    href={url}
                    className={styles.social}
                    aria-label={label}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessengerLogo name={name} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.legal}>
          <div className={styles.requisites}>
            <p className={`body-s ${styles.secondary}`}>
              {settings.legalName}, ИНН {settings.inn}, ОГРН {settings.ogrn}
            </p>
            <p className={`body-s ${styles.secondary}`}>{settings.accreditation}</p>
          </div>
          <div className={styles.docs}>
            {legalNav.map((item) => (
              <TextLink key={item.href} href={item.href}>
                {item.label}
              </TextLink>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
