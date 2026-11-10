import 'dotenv/config'
import { randomBytes } from 'crypto'
import { getPayload } from 'payload'
import config from '../payload.config'

/**
 * Учётки администраторов со случайным паролем. Свой пароль человек задаёт
 * сам через «Забыли пароль?» на странице входа, письмо уходит через SMTP
 * сайта. Повторный прогон существующие учётки не трогает.
 *
 * Адреса — из SEED_ADMIN_EMAILS через запятую, в репозитории их нет: он
 * публичный, а адрес — это логин в админку.
 *   SEED_ADMIN_EMAILS=имя@домен pnpm seed:users
 *
 * Не входит в seed:all: пока пользователей нет, Payload показывает экран
 * создания первого администратора. На проде сначала свой админ, потом этот
 * сид (deploy/README.md, шаг «Админ»).
 */
const emails = (process.env.SEED_ADMIN_EMAILS ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const seed = async () => {
  if (emails.length === 0) {
    console.log('SEED_ADMIN_EMAILS пуст, учётки не созданы')
    process.exit(0)
  }

  const payload = await getPayload({ config })

  for (const email of emails) {
    const { totalDocs } = await payload.count({
      collection: 'users',
      where: { email: { equals: email } },
    })
    if (totalDocs > 0) {
      console.log(`Пользователь ${email} уже есть`)
      continue
    }

    await payload.create({
      collection: 'users',
      data: { email, password: randomBytes(24).toString('base64url') },
    })
    console.log(`Пользователь ${email} создан, пароль задаётся через «Забыли пароль?»`)
  }

  process.exit(0)
}

await seed()
