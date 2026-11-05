import type { IconName } from './icons'

/**
 * Навигация сайта: шапка, меню «Услуги», мобильное меню, футер, 404.
 * Адреса живут только здесь: страницы и компоненты импортируют эти константы.
 */
export const ROUTES = {
  home: '/',
  upp: '/perehod-s-upp',
  erp: '/vnedrenie-erp',
  dorabotka: '/dorabotka',
  support: '/soprovozhdenie',
  diagnostics: '/diagnostika',
  cases: '/cases',
  about: '/about',
  contacts: '/about#contacts',
  privacy: '/privacy',
  consent: '/consent',
  cookie: '/cookie',
} as const

export type ServiceLink = {
  href: string
  title: string
  description: string
  icon: IconName
}

/** Порядок как в оверлее меню «Услуги»: две колонки слева направо */
export const serviceNav: ServiceLink[] = [
  {
    href: ROUTES.erp,
    title: 'Внедрение 1С:ERP и 1С:КА',
    description: 'Производство, склад, продажи и финансы в одной базе, 4–12 месяцев',
    icon: 'factory',
  },
  {
    href: ROUTES.upp,
    title: 'Переход с 1С:УПП',
    description: 'На ERP или КА без остановки производства, 6–18 месяцев',
    icon: 'update',
  },
  {
    href: ROUTES.dorabotka,
    title: 'Доработка и обновление 1С',
    description: 'Обновление доработанной базы, интеграции, аудит',
    icon: 'construction',
  },
  {
    href: ROUTES.support,
    title: 'Сопровождение 1С',
    description: 'Абонемент, системное администрирование, время реакции [SLA]',
    icon: 'support',
  },
]

export const mainNav = [
  { href: ROUTES.cases, label: 'Кейсы' },
  { href: ROUTES.about, label: 'О компании' },
  { href: ROUTES.contacts, label: 'Контакты' },
] as const

/** Услуги в футере и мобильном меню: порядок как в этих макетах */
export const footerServices = [
  { href: ROUTES.upp, label: 'Переход с 1С:УПП' },
  { href: ROUTES.erp, label: 'Внедрение 1С:ERP и 1С:КА' },
  { href: ROUTES.dorabotka, label: 'Доработка и обновление 1С' },
  { href: ROUTES.support, label: 'Сопровождение 1С' },
  { href: ROUTES.diagnostics, label: 'Диагностика за 2 дня' },
] as const

/** Полноэкранное меню на телефоне: порядок как в макете */
export const mobileNav = [
  { href: ROUTES.upp, label: 'Переход с 1С:УПП' },
  { href: ROUTES.erp, label: 'Внедрение 1С:ERP и 1С:КА' },
  { href: ROUTES.dorabotka, label: 'Доработка и обновление 1С' },
  { href: ROUTES.support, label: 'Сопровождение 1С' },
  ...mainNav,
] as const

export const legalNav = [
  { href: ROUTES.privacy, label: 'Политика обработки персональных данных' },
  { href: ROUTES.consent, label: 'Согласие на обработку' },
] as const
