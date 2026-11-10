import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { t } from './lib'

/** Тексты двух форм заявки и кнопок мессенджеров */
const seed = async () => {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    context: { disableRevalidate: true },
    slug: 'lead-forms',
    data: {
      diagnostics: {
        title: t('Получить диагностику за~2~дня'),
        lead: t('Перезвоним и~договоримся о~времени диагностики. Бесплатно, отчёт на~руки.'),
        comment: t('Хочу записаться на~бесплатную диагностику 1С за~2~дня.'),
        successText: t('Перезвоним в~течение рабочего дня и~договоримся о~времени диагностики.'),
      },
      request: {
        title: 'Оставить заявку',
        lead: t('Перезвоним в~течение рабочего дня и~ответим на~вопросы.'),
        comment: '',
        successText: t('Перезвоним в~течение рабочего дня и~ответим на~вопросы.'),
      },
      submitLabel: 'Отправить заявку',
      maxLabel: 'Отправить сообщение в MAX',
      telegramLabel: 'Отправить сообщение в Telegram',
      messageIntro: 'Здравствуйте! Пишу с сайта про-софт.рф.',
    },
  })

  console.log('Глобал lead-forms заполнен')
  process.exit(0)
}

await seed()
