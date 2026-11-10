import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { t } from './lib'
import { REPORT_SAMPLE } from './report-sample'

const CASE_SLUGS = ['rutina-i-osvobozhdenie-vremeni']
const REVIEW_AUTHOR = 'Ольга'
const PUBLICATION_TITLE = t('Переход на~новый режим взаиморасчётов в~1С: что нужно знать бизнесу')

/** Тексты сняты с кадров 73:3703 и 417:9500 */
const seed = async () => {
  const payload = await getPayload({ config })

  const { docs: cases } = await payload.find({
    collection: 'cases',
    where: { slug: { in: CASE_SLUGS } },
    limit: CASE_SLUGS.length,
    depth: 0,
  })
  const { docs: reviews } = await payload.find({
    collection: 'reviews',
    where: { author: { equals: REVIEW_AUTHOR } },
    limit: 1,
    depth: 0,
  })
  const { docs: publications } = await payload.find({
    collection: 'publications',
    where: { title: { equals: PUBLICATION_TITLE } },
    limit: 1,
    depth: 0,
  })

  // Связи ставятся по тому, что уже засеяно: сид раздела можно прогнать и позже
  const missing = [
    cases.length < CASE_SLUGS.length && 'кейс (pnpm seed:cases)',
    !reviews[0] && 'отзыв (pnpm seed:reviews)',
    !publications[0] && 'статья (pnpm seed:publications)',
  ].filter(Boolean)
  if (missing.length) payload.logger.warn(`В блоке «Кейс» пропущено: ${missing.join(', ')}`)

  await payload.updateGlobal({
    context: { disableRevalidate: true },
    slug: 'dorabotka',
    data: {
      hero: {
        breadcrumb: 'Доработка и обновление 1С',
        title: t('Доработка и~обновление 1С без правки типовой конфигурации'),
        lead: t(
          'Обновим доработанную базу, переведём на~новый режим взаиморасчётов, свяжем 1С с~маркетплейсами и~Битрикс24. Задачу оцениваем целиком.',
        ),
        ctaLabel: 'Оставить заявку',
        ctaComment: t('Нужна доработка или обновление 1С.'),
      },

      work: {
        title: 'Что делаем',
        lead: t(
          'Обновляем доработанные базы, переводим учёт на~новый режим взаиморасчётов и~делаем доработки так, чтобы они не~мешали обновлениям.',
        ),
        items: [
          {
            icon: 'update',
            title: 'Обновление доработанной базы',
            text: t(
              'Обновляем базу до~актуального релиза и~переносим доработки так, чтобы они не~слетали при следующих обновлениях.',
            ),
          },
          {
            icon: 'payments',
            title: 'Новый режим взаиморасчётов',
            text: t(
              'Переводим учёт на~новый режим взаиморасчётов в~1С заранее, чтобы не~попасть в~аврал.',
            ),
          },
          {
            icon: 'construction',
            title: 'Расширения вместо правки конфигурации',
            text: t(
              'Доработки делаем расширениями: типовая конфигурация остаётся типовой и~обновляется без переписывания.',
            ),
          },
        ],
      },

      integrations: {
        title: 'Интеграции',
        lead: t(
          'Связываем 1С с~системами, в~которых уже работает компания, чтобы данные не~переносили вручную.',
        ),
        items: [
          {
            icon: 'cart',
            title: 'Маркетплейсы',
            systems: 'Wildberries, Ozon, Яндекс Маркет, Lamoda',
            text: t(
              'Карточки товаров, цены, скидки по~акциям, остатки и~заказы синхронизируются с~1С. Расчёты с~площадками ведутся в~учёте.',
            ),
            result: t('Ручной работы у~менеджеров меньше в~7 раз, внедрение окупилось за~2 недели'),
          },
          {
            icon: 'hub',
            title: t('CRM и~Битрикс24'),
            systems: 'Битрикс24, CRM',
            text: t(
              'Клиенты и~сделки из~CRM синхронизируются с~1С. Договор с~печатью формируется в~1С и~уходит клиенту по~почте и~ЭДО.',
            ),
            result: t('5 минут от~реквизитов до~договора в~ЭДО вместо нескольких дней'),
          },
          {
            icon: 'description',
            title: t('ЭДО и~закрывающие документы'),
            systems: '1С, ЭДО, e-mail',
            text: t(
              'Пакет закрывающих документов по~итогам месяца формируется в~1С и~уходит клиентам по~ЭДО и~почте с~факсимиле.',
            ),
            result: t(
              'Документы для 300+ клиентов за~15 минут вместо 3 рабочих дней, внедрение окупилось за~1 месяц',
            ),
          },
          {
            icon: 'factory',
            title: 'Отраслевое ПО',
            systems: t('AltaWin и~другие системы'),
            text: t(
              'Документы из~отраслевой системы попадают в~1С автоматически через http-сервис, без ручного переноса.',
            ),
            result: t('Контрагент, договор и~заказ за~5 минут'),
          },
          {
            icon: 'verified',
            title: 'Маркировка',
            systems: '«Честный ЗНАК»',
            text: t(
              'Настраиваем маркировку «Честный ЗНАК» в~1С и~разбираем ошибки учёта маркированного товара.',
            ),
          },
          {
            icon: 'swap',
            title: t('Сайт и~B2B-портал'),
            systems: 'Сайт, B2B-портал',
            text: t('Подключаем сайт и~B2B-портал к~1С, когда учёт уже работает в~новой базе.'),
          },
        ],
      },

      audit: {
        title: 'Аудит базы 1С',
        lead: t(
          'Перед обновлением или доработкой проверяем, в~каком состоянии база. Находки и~план работ отдаём отчётом.',
        ),
        checks: [
          { icon: 'construction', title: t('Доработки: в~расширениях или в~самой конфигурации') },
          { icon: 'update', title: t('Готовность базы к~обновлению на~актуальный релиз') },
          { icon: 'swap', title: t('Обмены и~интеграции с~другими системами') },
          { icon: 'bank', title: t('Готовность учёта к~новому режиму взаиморасчётов') },
        ],
        sample: { ...REPORT_SAMPLE, document: 'Отчёт аудита', startPage: 'findings' as const },
        buttonLabel: 'Получить диагностику',
      },

      format: {
        title: 'Как оцениваем задачу',
        lead: t(
          'Оцениваем задачу целиком, а~не~по~часам. Делим на~этапы и~берём оплату только после приёмки этапа по~чек-листу.',
        ),
        principles: [
          { text: t('Задачу оцениваем целиком, а~не~по~часам') },
          { text: t('Доработки делаем расширениями, без правки конфигурации') },
        ],
        table: {
          stageLabel: 'Этап',
          termLabel: 'Срок',
          resultLabel: 'Результат',
          payLabel: 'Оплата',
          steps: [
            {
              title: 'Диагностика',
              term: t('2 дня'),
              result: t('Отчёт на~руках'),
              pay: 'Бесплатно',
              accent: true,
            },
            {
              title: t('Обследование и~смета'),
              term: t('2–4 недели'),
              result: t('Смета по~этапам'),
              pay: 'После приёмки',
            },
            {
              title: 'Первый этап',
              term: t('1–2 месяца'),
              result: t('Первый участок работает в~новой базе'),
              pay: 'После приёмки',
            },
            {
              title: 'Следующие этапы',
              term: t('1–2 месяца'),
              result: t('Остальные участки по~плану этапов'),
              pay: 'После приёмки',
            },
            {
              title: t('Запуск и~сопровождение'),
              term: t('1 месяц'),
              result: 'Система работает',
              pay: 'После приёмки',
            },
          ],
        },
      },

      proof: {
        title: 'Кейс доработки',
        allLabel: 'Все кейсы',
        cases: cases.map((item) => item.id),
        review: reviews[0]?.id,
        publication: publications[0]?.id,
        closeLabel: 'Закрыть',
        labels: {
          before: 'Было',
          after: 'Стало',
          task: 'Задача',
          done: 'Сделали',
          read: 'Читать кейс',
        },
      },

      seo: {
        metaTitle: 'Доработка и обновление 1С в Нижнем Новгороде',
        metaDescription:
          'Доработка 1С без правки типовой конфигурации: обновление доработанных баз, новый режим взаиморасчётов, интеграция 1С с маркетплейсами и Битрикс24. Оцениваем задачу целиком.',
      },
    },
  })

  payload.logger.info('Страница «Доработка» заполнена')
  process.exit(0)
}

await seed()
