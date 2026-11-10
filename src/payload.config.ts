import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Leads } from './collections/Leads'
import { LegalPages } from './collections/LegalPages'
import { Reviews } from './collections/Reviews'
import { Cases } from './collections/Cases'
import { Publications } from './collections/Publications'
import { Team } from './collections/Team'
import { Settings } from './globals/Settings'
import { CookieBanner } from './globals/CookieBanner'
import { LeadForms } from './globals/LeadForms'
import { Home } from './globals/Home'
import { Upp } from './globals/Upp'
import { Erp } from './globals/Erp'
import { Dorabotka } from './globals/Dorabotka'
import { Support } from './globals/Support'
import { Diagnostics } from './globals/Diagnostics'
import { CasesPage } from './globals/CasesPage'
import { About } from './globals/About'
import { migrations } from './migrations'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  collections: [Users, Media, Leads, Cases, Publications, Reviews, Team, LegalPages],
  globals: [
    Home,
    Upp,
    Erp,
    Dorabotka,
    Support,
    Diagnostics,
    CasesPage,
    About,
    Settings,
    LeadForms,
    CookieBanner,
  ],
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  /**
   * Схема базы меняется только миграциями, авто-push выключен: dev и прод
   * проходят одну и ту же последовательность, а drizzle не отличает
   * переименование поля от «удалить и создать» и теряет данные молча.
   *
   * Правишь коллекцию или глобал → `pnpm migrate:create <имя>` →
   * смотришь файл в src/migrations → `pnpm migrate`. Снимок схемы (`*.json`)
   * рядом с миграцией нужен для следующего diff, из репозитория не удалять.
   *
   * prodMigrations: на проде непримёненные миграции прогоняются сами при
   * старте приложения и при `next build`.
   */
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URL || '',
    },
    push: false,
    prodMigrations: migrations,
  }),
  /**
   * Почта — SMTP Яндекса. Отправитель обязан совпадать с SMTP_USER: письмо с
   * чужим From Яндекс не примет. Без SMTP_HOST адаптер не подключается, и
   * Payload пишет письма в консоль: с машины разработки ничего не уходит.
   */
  email: process.env.SMTP_HOST
    ? nodemailerAdapter({
        defaultFromAddress: process.env.SMTP_USER || '',
        defaultFromName: 'Сайт ПРО-СОФТ',
        transportOptions: {
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 465),
          secure: Number(process.env.SMTP_PORT || 465) === 465,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        },
      })
    : undefined,
  sharp,
  plugins: [],
})
