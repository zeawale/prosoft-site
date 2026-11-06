<div align="center">

# prosoft-site 🏭

### Сайт ООО «ПРО-СОФТ» · внедрение и сопровождение 1С для производства и торговли

*каждое слово на сайте правится в админке — без деплоя и пересборки*

![Next.js](https://img.shields.io/badge/Next.js_16-1e1e2e?style=for-the-badge&logo=nextdotjs&logoColor=a6e3a1)
![React](https://img.shields.io/badge/React_19-1e1e2e?style=for-the-badge&logo=react&logoColor=a6e3a1)
![TypeScript](https://img.shields.io/badge/TypeScript-1e1e2e?style=for-the-badge&logo=typescript&logoColor=a6e3a1)
![Payload CMS](https://img.shields.io/badge/Payload_CMS_3-1e1e2e?style=for-the-badge&logo=payloadcms&logoColor=a6e3a1)
![SQLite](https://img.shields.io/badge/SQLite-1e1e2e?style=for-the-badge&logo=sqlite&logoColor=a6e3a1)
![Playwright](https://img.shields.io/badge/Playwright-1e1e2e?style=for-the-badge&logo=playwright&logoColor=a6e3a1)
![pnpm](https://img.shields.io/badge/pnpm-1e1e2e?style=for-the-badge&logo=pnpm&logoColor=a6e3a1)

[![Figma](https://img.shields.io/badge/%D0%9C%D0%B0%D0%BA%D0%B5%D1%82_%D0%B2_Figma-1e1e2e?style=for-the-badge&logo=figma&logoColor=a6e3a1)](https://www.figma.com/design/0dXjHKn3lZVqQsk0GTi8tl/)

</div>

---

## 📋 о проекте

Новый сайт **ПРО-СОФТ** — проектная автоматизация на 1С для компаний от 50 человек: переход с 1С:УПП, внедрение 1С:ERP и 1С:КА, доработка, сопровождение. Заменяет два одностраничника на Тильде.

Собран на основе [моего сайта для ПРО-М](https://github.com/zeawale/prom-site): та же админка, технологии и хостинг, а дизайн и дизайн-система в Figma сделаны заново.

Главное требование то же: **весь текстовый контент правится в админке**, без правок кода и без деплоя.

<div align="center">

![Первый экран главной](docs/hero.gif)

</div>

## ✨ возможности

- 🎬 3D-ролики в первом экране каждой страницы: постер сразу, ролик подгружается, есть пауза, при отключённой анимации только постер
- 🧭 Квизы: подбор сценария за 5 вопросов с заявкой и выбор ERP или КА за 3 вопроса
- 🗺️ Интерактивная карта процессов и образец отчёта диагностики
- 🗂️ Десять кейсов с цифрами «было и стало», фильтры включаются в админке
- 📝 Форма заявки с маской телефона, проверкой полей, согласием и повторной отправкой при обрыве связи; в заявке источник и ответы квиза
- 🍪 Cookie-баннер: до согласия на странице нет ни Метрики, ни карты Яндекса, выбор живёт 12 месяцев
- ✏️ Правится всё: страницы, кейсы, отзывы, команда, публикации, юридические документы, контакты
- 🧱 Схема базы меняется только миграциями
- 🗺️ `sitemap.xml`, `robots.txt`, разметка Schema.org, своя страница 404
- 📱 Адаптив: десктоп, планшет (до 1199px) и телефон (до 767px), нижняя панель заявки на телефоне

## 🧭 страницы

| Маршрут | Страница |
|---|---|
| `/` | Главная |
| `/perehod-s-upp` | Переход с 1С:УПП |
| `/vnedrenie-erp` | Внедрение 1С:ERP и 1С:КА |
| `/dorabotka` | Доработка и обновление 1С |
| `/soprovozhdenie` | Сопровождение 1С |
| `/diagnostika` | Диагностика и квиз |
| `/cases`, `/cases/[slug]` | Кейсы × 10 |
| `/about` | О компании и контакты |
| `/privacy`, `/consent` | Юридические документы |
| `/admin` | Админка Payload |

## 🛠️ стек

- **Фреймворк:** Next.js 16 (App Router) + React 19
- **CMS:** Payload CMS 3, встроена в то же приложение Next.js
- **База данных:** SQLite через адаптер Payload на Drizzle
- **Язык:** TypeScript
- **Стили:** CSS Modules и дизайн-токены из Figma, тёмные секции — режим токенов `.inverse`
- **Шрифты и иконки:** Onest, IBM Plex Mono и Material Symbols лежат локально, с CDN не грузится ничего
- **Тесты:** Playwright (e2e) и Vitest (интеграционные)
- **Инструменты:** ESLint 9, Prettier, pnpm

## 🗃️ структура проекта

```
src/
  app/
    (frontend)/      страницы, layout, tokens.css
    (payload)/       админка и маршруты API
  collections/       Cases, Publications, Reviews, Team, Leads, LegalPages, Media, Users
  globals/           глобал на страницу, Settings, CookieBanner
  components/
    sections/        общие блоки: PageHero, StageTable, CaseCard, Faq, ErpOrKa…
    ui/, layout/     примитивы, шапка, подвал
    home/, upp/, …   блоки одной страницы
  lib/               запросы, навигация, ревалидация, согласие на cookie
  migrations/        история схемы базы
  seed/              сиды контента
  proxy.ts           канонический домен и слэши
deploy/              nginx, systemd, бэкап, обновление
tests/               Playwright и Vitest
```

## 🚀 запуск

Нужны Node.js 20.9+ и pnpm. Фото людей и обложки видео в репозиторий не входят: папку `src/seed/assets/` положить руками.

```bash
cp .env.example .env
# в .env задать PAYLOAD_SECRET

pnpm install
pnpm migrate
pnpm seed:all
pnpm dev
```

Сайт откроется на `http://localhost:3000`, админка на `/admin`: при первом входе она предложит создать пользователя.

## 🧪 команды

| Команда | Зачем |
|---|---|
| `pnpm dev` | Разработка |
| `pnpm build` | Сборка, заодно проверка типов |
| `pnpm lint` | Линтер |
| `pnpm test:e2e` | Playwright |
| `pnpm migrate:create <имя>`, `pnpm migrate` | Изменение схемы |
| `pnpm seed:all`, `pnpm seed:<раздел>` | Наполнение базы |

Деплой описан в [`deploy/README.md`](deploy/README.md).
