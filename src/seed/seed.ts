import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

/** Реквизиты и контакты: глобал Settings. Первый сид, без него не откроется шапка */
const seed = async () => {
  const payload = await getPayload({ config })

  await payload.updateGlobal({
    context: { disableRevalidate: true },
    slug: 'settings',
    data: {
      phone: '+7 831 413-06-67',
      email: 'info@pm52.ru',
      maxUrl: 'https://max.ru/u/f9LHodD0cOJs8yOrLDp-JCmUAdphEkOS6cBt_4EKo8GgKWRFGcLmolvw9hE',
      telegramUrl: 'https://t.me/dkpm52',
      address: 'г. Нижний Новгород, Казанское ш., 12, этаж 3, кабинет 311',
      footerTagline: 'ПРО-СОФТ: внедрение 1С, Нижний Новгород',
      legalName: 'ООО «ПРО-СОФТ»',
      inn: '5260480157',
      ogrn: '1215200037128',
      accreditation: 'Аккредитованная ИТ-компания, реестр Минцифры России',
    },
  })

  console.log('Глобал settings заполнен')
  process.exit(0)
}

await seed()
