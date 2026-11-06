import type { ReactNode } from 'react'
import { TextLink } from '@/components/ui/TextLink'
import { OfficeMap } from './OfficeMap'
import type { Setting } from '@/payload-types'
import styles from './ContactsBlock.module.css'

type Props = {
  phoneLabel: string
  emailLabel: string
  addressLabel: string
  hoursLabel: string
  hoursValue: string
  hoursCaption?: string | null
  mapTitle: string
  mapLinkLabel: string
  mapUrl: string
  mapWidgetUrl: string
  mapNote: string
  mapButtonLabel: string
  requisitesTitle: string
  legalNameLabel: string
  innLabel: string
  ogrnLabel: string
  requisites?: { label: string; value: string }[] | null
  settings: Setting
  consentVersion: string
}

/** В настройках адрес одной строкой, в карточке этаж и кабинет уходят в подпись */
const splitAddress = (address: string) => {
  const [value, ...rest] = address.split(/,\s*(?=этаж)/i)
  const caption = rest.join(', ')
  return { value, caption: caption && caption[0].toUpperCase() + caption.slice(1) }
}

function ContactCard({
  label,
  caption,
  children,
}: {
  label: string
  caption?: string | null
  children: ReactNode
}) {
  return (
    <div className={styles.card}>
      <p className={`label-14 ${styles.label}`}>{label}</p>
      <p className={`h5 ${styles.value}`}>{children}</p>
      {caption && <p className={`body-s ${styles.caption}`}>{caption}</p>}
    </div>
  )
}

/** Контакты: карточки, виджет Яндекс Карт с адресом поверх, реквизиты */
export function ContactsBlock({
  phoneLabel,
  emailLabel,
  addressLabel,
  hoursLabel,
  hoursValue,
  hoursCaption,
  mapTitle,
  mapLinkLabel,
  mapUrl,
  mapWidgetUrl,
  mapNote,
  mapButtonLabel,
  requisitesTitle,
  legalNameLabel,
  innLabel,
  ogrnLabel,
  requisites,
  settings,
  consentVersion,
}: Props) {
  const address = splitAddress(settings.address)
  const items = [
    { label: legalNameLabel, value: settings.legalName },
    { label: innLabel, value: settings.inn },
    { label: ogrnLabel, value: settings.ogrn },
    ...(requisites ?? []),
  ]

  return (
    <>
      <div className={styles.cards}>
        <ContactCard label={phoneLabel}>
          <a href={`tel:${settings.phoneRaw}`}>{settings.phone}</a>
        </ContactCard>
        <ContactCard label={emailLabel}>
          <a href={`mailto:${settings.email}`}>{settings.email}</a>
        </ContactCard>
        <ContactCard label={hoursLabel} caption={hoursCaption}>
          {hoursValue}
        </ContactCard>
        <ContactCard label={addressLabel} caption={address.caption}>
          {address.value}
        </ContactCard>
      </div>

      <div className={styles.map}>
        <OfficeMap
          url={mapWidgetUrl}
          title={mapTitle}
          note={mapNote}
          buttonLabel={mapButtonLabel}
          consentVersion={consentVersion}
        />
        <div className={styles.address}>
          <p className={`h6 ${styles.addressTitle}`}>{mapTitle}</p>
          <p className={`body-s ${styles.addressText}`}>{settings.address}</p>
          <TextLink href={mapUrl} size="S" external>
            {mapLinkLabel}
          </TextLink>
        </div>
      </div>

      <div className={styles.requisites}>
        <p className={`label-14 ${styles.requisitesTitle}`}>{requisitesTitle}</p>
        <dl className={styles.items}>
          {items.map((item) => (
            <div key={item.label} className={styles.item}>
              <dt className={`label-12 ${styles.itemLabel}`}>{item.label}</dt>
              <dd className={`body-s ${styles.itemValue}`}>{item.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </>
  )
}
