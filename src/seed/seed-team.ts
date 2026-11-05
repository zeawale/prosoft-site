import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'
import { seedMedia, t } from './lib'

const TEAM = [
  {
    name: 'Дмитрий Круглецов',
    role: t('Основатель ПРО-СОФТ и~НПП «ПРО-М», 20 лет в~автоматизации на~1С'),
    file: 'team-kruglecov.webp',
    quote: t(
      'Клиенту нужна не~«ещё одна 1С», а~измеримый бизнес-результат: меньше потерь, быстрее процессы, прозрачнее управление и~больше прибыли.',
    ),
    isFounder: true,
    links: [
      { label: 'vc.ru', url: 'https://vc.ru/id5940069' },
      { label: 'ВКонтакте', url: 'https://vk.ru/dmitry_krugletsov' },
      { label: 'Telegram', url: 'https://t.me/krugletsov_arch' },
      { label: 'TenChat', url: 'https://tenchat.ru/0347519' },
      { label: 'Rutube', url: 'https://rutube.ru/channel/78163346' },
    ],
  },
  {
    name: 'Александр Тренкин',
    role: 'CEO ИТ-компании «ПРО-СОФТ»',
    file: 'team-trenkin.webp',
    quote: t(
      'Хорошее внедрение: это когда через год клиент говорит: «Мы~не~представляем, как работали без этого». Всё остальное просто написанный код.',
    ),
  },
  {
    name: 'Алексей Чибисов',
    role: 'Руководитель отдела системного администрирования',
    file: 'team-chibisov.webp',
    quote: t(
      'Внедрение это не~просто задачи в~трекере. Это ответственность за~то, что система заработает и~будет приносить пользу. Поэтому мы~не~закрываем проект, пока клиент не~скажет: «Работает».',
    ),
  },
  {
    name: 'Илья Чернов',
    role: 'Руководитель проектов',
    file: 'team-chernov.webp',
    quote: t(
      'Клиент должен понимать, что происходит в~проекте, на~каком мы~этапе и~что будет дальше. Прозрачность это не~отчётность ради отчётности, это основа доверия.',
    ),
  },
]

const seed = async () => {
  const payload = await getPayload({ config })

  await payload.delete({
    context: { disableRevalidate: true },
    collection: 'team',
    where: { id: { exists: true } },
  })

  for (const [index, { file, ...member }] of TEAM.entries()) {
    const photo = await seedMedia(payload, file, member.name)
    await payload.create({
      context: { disableRevalidate: true },
      collection: 'team',
      data: { ...member, photo, order: index },
    })
  }

  console.log(`Команда: ${TEAM.length}`)
  process.exit(0)
}

await seed()
