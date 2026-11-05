# Деплой ПРО-СОФТ

Второй сайт на сервере Timeweb Cloud `prom-site` (`<IP>`, Cloud-40, 2 vCPU, 2 ГБ, Ubuntu 24.04), рядом с pm52.ru и доской.
Схема: nginx на 80/443 → приложение Next.js + Payload на `127.0.0.1:3002` под systemd → SQLite и `media` в папке приложения.

Node 24, pnpm 11.22, nginx, certbot, swap 4 ГБ на сервере уже есть (см. деплой pm52.ru).

| Файл                                | Куда на сервере                                | Зачем                                   |
| ----------------------------------- | ---------------------------------------------- | --------------------------------------- |
| `nginx/prosoft-site-bootstrap.conf` | `/etc/nginx/sites-available/prosoft-site.conf` | Временный, только http, до сертификатов |
| `nginx/prosoft-site.conf`           | туда же, вместо временного                     | Боевой: https, сведение доменов         |
| `nginx/prosoft-site-proxy.conf`     | `/etc/nginx/snippets/`                         | Общие заголовки проксирования           |
| `systemd/prosoft-site.service`      | `/etc/systemd/system/`                         | Автозапуск приложения                   |
| `systemd/prosoft-site-backup.*`     | `/etc/systemd/system/`                         | Ежедневный бэкап в 04:00                |
| `backup.sh`, `update.sh`            | запускаются из репозитория                     | Бэкап и выкатка                         |

Команды ниже от `root`, если не сказано иное.

## 1. Пользователь и код

```bash
useradd --create-home --shell /bin/bash prosoft
mkdir -p /srv/prosoft-site && chown prosoft:prosoft /srv/prosoft-site
sudo -u prosoft git clone <адрес репозитория> /srv/prosoft-site
cd /home/prosoft && sudo -u prosoft -H bash -lc 'cd ~ && corepack prepare pnpm@11.22.0 --activate && pnpm -v'
```

## 2. .env

**До первой сборки:** `NEXT_PUBLIC_*` впекаются в сборку.

```bash
sudo -u prosoft tee /srv/prosoft-site/.env > /dev/null <<'EOF'
DATABASE_URL=file:./prosoft-site.db
PAYLOAD_SECRET=<openssl rand -hex 32>
NEXT_PUBLIC_SITE_URL=https://xn----0tbbbfiip.xn--p1ai
NEXT_PUBLIC_YM_ID=<номер счётчика>
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_USER=<ящик>
SMTP_PASS=<пароль приложения>
LEADS_NOTIFY_TO=<ящик для заявок>
EOF
chmod 600 /srv/prosoft-site/.env
```

Значения секретов в репозиторий не попадают.

## 3. База и сборка

Локальную базу на прод не копировать: в ней тестовые заявки. База создаётся миграциями и сидами. Папка `src/seed/assets/` с фото людей в git не входит: перед сидами скопировать её на сервер.

```bash
# на своём компьютере
scp -r src/seed/assets root@<IP>:/srv/prosoft-site/src/seed/
```

```bash
chown -R prosoft:prosoft /srv/prosoft-site/src/seed/assets
sudo -u prosoft -H bash -lc 'cd /srv/prosoft-site && pnpm install --frozen-lockfile && pnpm migrate'
sudo -u prosoft -H bash -lc 'cd /srv/prosoft-site && pnpm seed:all'
sudo -u prosoft -H bash -lc 'cd /srv/prosoft-site && pnpm build'
```

На 2 ГБ сборка идёт в подкачку. Собирать вечером: на это время pm52.ru и доска работают медленнее. **Сиды на проде только сейчас:** после правок в админке повторный сид их затрёт.

## 4. Автозапуск

```bash
cp /srv/prosoft-site/deploy/systemd/prosoft-site.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now prosoft-site
curl -sI http://127.0.0.1:3002/ | head -1      # HTTP/1.1 200 OK
```

Логи: `journalctl -u prosoft-site -f`.

## 5. Админ

Пароль по голому http не вводить, только через туннель:

```bash
# на своём компьютере
ssh -L 3002:127.0.0.1:3002 root@<IP>
```

В браузере `http://localhost:3002/admin`: создать пользователя-администратора, отправить тестовую заявку «Тест сайта, не звонить».

## 6. Бэкап

```bash
chmod +x /srv/prosoft-site/deploy/backup.sh /srv/prosoft-site/deploy/update.sh
cp /srv/prosoft-site/deploy/systemd/prosoft-site-backup.service /srv/prosoft-site/deploy/systemd/prosoft-site-backup.timer /etc/systemd/system/
systemctl daemon-reload
systemctl enable --now prosoft-site-backup.timer
/srv/prosoft-site/deploy/backup.sh
```

## 7. Домен

Оба домена сейчас на Тильде. Сначала решить с Дмитрием, какой главный, и снять домены с проекта Тильды только в день переключения.

1. За сутки снизить TTL записей `@` и `www` до 300.
2. nginx без сертификатов:

   ```bash
   cp /srv/prosoft-site/deploy/nginx/prosoft-site-proxy.conf /etc/nginx/snippets/
   cp /srv/prosoft-site/deploy/nginx/prosoft-site-bootstrap.conf /etc/nginx/sites-available/prosoft-site.conf
   ln -sf /etc/nginx/sites-available/prosoft-site.conf /etc/nginx/sites-enabled/prosoft-site.conf
   nginx -t && systemctl reload nginx
   ```

3. Поменять A-записи обоих доменов и их `www` на `<IP>`. Почтовые записи не трогать.
4. Дождаться DNS (`dig +short xn----0tbbbfiip.xn--p1ai @8.8.8.8`) и выпустить сертификаты:

   ```bash
   certbot certonly --webroot -w /var/www/certbot -d xn----0tbbbfiip.xn--p1ai -d www.xn----0tbbbfiip.xn--p1ai --deploy-hook 'systemctl reload nginx'
   certbot certonly --webroot -w /var/www/certbot -d 1cprosoft.ru -d www.1cprosoft.ru --deploy-hook 'systemctl reload nginx'
   ```

5. Боевой nginx:

   ```bash
   cp /srv/prosoft-site/deploy/nginx/prosoft-site.conf /etc/nginx/sites-available/prosoft-site.conf
   nginx -t && systemctl reload nginx
   ```

6. Проверка, у каждого адреса один 301 сразу на конечный:

   ```bash
   curl -sI http://www.xn----0tbbbfiip.xn--p1ai/  | grep -iE '^(HTTP|location)'
   curl -sI https://1cprosoft.ru/cases            | grep -iE '^(HTTP|location)'
   curl -sI https://xn----0tbbbfiip.xn--p1ai/     | head -1
   ```

7. Заявка с сайта доходит письмом. Вебмастер: добавить сайт и `sitemap.xml`, склейка зеркал второго домена.

## Обновление

```bash
sudo /srv/prosoft-site/deploy/update.sh
```

Бэкап → `git pull` → зависимости → сайт останавливается → сборка → запуск. 3–5 минут простоя.
