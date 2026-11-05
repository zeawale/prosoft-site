import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

/** Тексты cookie-баннера, сняты с макета */
const seed = async () => {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    context: { disableRevalidate: true },
    slug: 'cookie-banner',
    data: {
      version: '2026-11-05',
      text: 'Используем cookie для работы сайта и обезличенной аналитики. Подробнее в',
      policyLabel: 'политике обработки персональных данных',
      necessaryOnlyLabel: 'Только необходимые',
      acceptAllLabel: 'Принять все',
    },
  })

  console.log('Глобал cookie-banner заполнен')
  process.exit(0)
}

await seed()
