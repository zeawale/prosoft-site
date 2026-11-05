import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { erpOrKa } from './erp-or-ka'
import { t } from './lib'

/**
 * Тексты сняты с кадров 70:2822 и 417:8682. В макете панель заполнена только
 * у производства: у остальных участков квадратные скобки до текста от заказчика.
 * Перед этим сидом идёт seed:cases.
 */
const seed = async () => {
  const payload = await getPayload({ config })

  const caseId = async (slug: string) => {
    const { docs } = await payload.find({
      collection: 'cases',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
    })
    if (!docs[0]) throw new Error(`Нет кейса ${slug}: сначала seed:cases`)
    return docs[0].id
  }

  const transition = await caseId('perehod-s-upp-na-erp')
  const debt = await caseId('debitorka-i-pribyl')
  const sales = await caseId('prodazhi-i-oborot')

  await payload.updateGlobal({
    context: { disableRevalidate: true },
    slug: 'erp',
    data: {
      hero: {
        breadcrumb: t('Внедрение 1С:ERP и~1С:КА'),
        title: t('Внедрение 1С:ERP и~1С:КА для производства и~торговли'),
        lead: t(
          'Покажем, когда нужна ERP, а~когда хватит КА. Внедряем этапами за~3–12 месяцев, каждый этап оплачивается после приёмки.',
        ),
      },

      erpOrKa: erpOrKa({
        title: t('Когда нужна ERP, а~когда хватит КА'),
        termLabel: 'Срок внедрения',
        termKa: '4–9 месяцев',
        termErp: '6–12 месяцев',
      }),

      map: {
        title: t('Что закрывает 1С:ERP в~вашей компании'),
        lead: t('Нажмите на~участок: покажем подсистему 1С:ERP, что она даёт и~похожий кейс.'),
        integrationsTitle: 'Интеграции',
        integrations: [
          { label: 'Маркетплейсы' },
          { label: 'Битрикс24' },
          { label: 'Честный знак' },
          { label: 'Отраслевое ПО' },
          { label: 'Обмен между базами' },
        ],
        nodePrefix: t('В~1С:ERP:'),
        subsystemLabel: 'Подсистема 1С:ERP',
        benefitLabel: 'Что получаете',
        caseLabel: 'Кейс',
        nodes: [
          {
            icon: 'cart',
            title: 'Закупки',
            subsystem: 'Закупки',
            benefit: '[что получаете по закупкам]',
            caseLink: '[кейс по закупкам]',
          },
          {
            icon: 'warehouse',
            title: 'Склад',
            subsystem: t('Склад и~доставка'),
            benefit: '[что получаете по складу]',
            caseLink: '[кейс по складу]',
          },
          {
            icon: 'factory',
            title: 'Производство',
            subsystem: 'Производство',
            benefit: t('Планирование загрузки, учёт выпуска и~себестоимости по~заказам'),
            relatedCase: transition,
            caseLink: t('Переход с~УПП на~ERP за~11 месяцев'),
            openByDefault: true,
          },
          {
            icon: 'sell',
            title: 'Продажи',
            subsystem: 'Продажи',
            benefit: '[что получаете по продажам]',
            relatedCase: sales,
          },
          {
            icon: 'bank',
            title: 'Финансы',
            subsystem: t('Казначейство и~бюджетирование, регламентированный учёт'),
            benefit: '[что получаете по финансам]',
            relatedCase: debt,
          },
        ],
      },

      stages: {
        title: t('Этапы и~стоимость: 3–12 месяцев, от~3 млн ₽'),
        lead: t(
          'Каждый этап закрывается приёмкой по~чек-листу, платите только после неё. Точную смету по~этапам даём после обследования, лицензии 1С считаются отдельно.',
        ),
        table: {
          stageLabel: 'Этап',
          termLabel: 'Срок',
          resultLabel: 'Результат',
          priceLabel: 'Стоимость',
          payLabel: 'Оплата',
          steps: [
            {
              title: 'Диагностика',
              term: '2 дня',
              result: t('Отчёт на~руках'),
              price: '—',
              pay: 'Бесплатно',
              accent: true,
            },
            {
              title: t('Обследование и~смета'),
              term: '2–4 недели',
              result: t('Смета по~этапам'),
              price: t('от~150 тыс. ₽'),
              pay: 'После приёмки',
            },
            {
              title: 'Первый этап',
              term: '1–2 месяца',
              result: t('Первый участок работает в~новой базе'),
              price: t('от~600 тыс. ₽'),
              pay: 'После приёмки',
            },
            {
              title: 'Следующие этапы',
              term: '1–2 месяца',
              result: t('Остальные участки по~плану этапов'),
              price: t('от~400 тыс. ₽ за~этап'),
              pay: 'После приёмки',
            },
            {
              title: t('Запуск и~сопровождение'),
              term: '1 месяц',
              result: 'Система работает',
              price: t('от~200 тыс. ₽'),
              pay: 'После приёмки',
            },
          ],
        },
      },

      proof: {
        title: 'Кейсы внедрения',
        allLabel: 'Все кейсы',
        cases: [transition, debt],
        labels: {
          before: 'Было',
          after: 'Стало',
          task: 'Задача',
          done: 'Сделали',
          read: 'Читать кейс',
        },
      },

      faq: {
        title: t('Вопросы о~внедрении'),
        lead: t('Отвечаем до~звонка на~то, о~чём спрашивают чаще всего.'),
        items: [
          {
            question: t('Долго ли~внедрять?'),
            answer: t(
              'Срок зависит от~масштаба. От~3 до~12 месяцев. Мы~даём чёткий план с~этапами и~сроками на~старте. Вы~видите каждый шаг',
            ),
          },
          {
            question: t('Сотрудники не~поймут новую систему?'),
            answer: t(
              'Мы~обучаем, встраиваем подсказки прямо в~систему и~сопровождаем после запуска. Люди работают правильно, потому что им~удобно, а~не~потому что их~заставили',
            ),
          },
          {
            question: t('Что будет, если проект пойдёт не~по~плану?'),
            answer: t(
              'У~нас ни~одного судебного дела за~20 лет. Мы~даём чёткую дорожную карту, проводим тестовую эксплуатацию и~не~бросаем клиентов после запуска. Если что-то идёт не~так, мы~это видим на~раннем этапе и~корректируем',
            ),
          },
          {
            question: t('Почему постоплата? Это не~риск для вас?'),
            answer: t(
              'Это наш способ сказать: мы~уверены в~результате. Мы~сделаем работу, вы~проверите, и~только потом оплатите. Если мы~не~делаем, мы~не~берём деньги',
            ),
          },
        ],
      },

      seo: {
        metaTitle: 'Внедрение 1С:ERP и 1С:КА: стоимость и сроки',
        metaDescription:
          'Внедрение 1С:ERP и 1С:КА для производства и торговли в Нижнем Новгороде: от 3 млн ₽, 3–12 месяцев, этапы с оплатой после приёмки. Бесплатная диагностика за 2 дня.',
      },
    },
  })

  console.log('Глобал erp заполнен')
  process.exit(0)
}

await seed()
