# Claude Cursor Mini App

Telegram Mini App для витрины и продажи тарифов `Claude` и `Cursor`.

## Что есть в MVP

- карточки товаров `Claude Pro`, `Claude Max`, `Cursor Pro`, `Cursor Ultra`;
- выбор тарифа внутри mini app;
- форма контактов клиента;
- кнопка для связи с продавцом `@metifrysell`;
- возможность заменить ссылку продавца через `VITE_SELLER_URL`;
- backend для заявок;
- Telegram-бот с кнопкой открытия `Mini App`.

## Как создать бота

1. Открой `@BotFather`.
2. Отправь `/newbot`.
3. Придумай имя бота.
4. Придумай `username`, который заканчивается на `bot`.
5. Сохрани токен, который пришлет `BotFather`.

## Запуск

1. Установить зависимости:

```powershell
npm install
```

2. Создать `.env` из примера:

```powershell
copy .env.example .env
```

3. Заполнить `.env`:

```text
VITE_SELLER_URL=https://t.me/metifrysell
VITE_API_BASE_URL=http://localhost:3001
TELEGRAM_BOT_TOKEN=токен_от_BotFather
ADMIN_CHAT_ID=ваш_chat_id
WEB_APP_URL=https://ваш_https_url_miniapp
SELLER_URL=https://t.me/metifrysell
REQUIRED_CHANNEL_USERNAME=@Omni_Key
REQUIRED_CHANNEL_URL=https://t.me/Omni_Key
CRYPTO_PAY_TOKEN=токен_CryptoBot
SUPABASE_URL=https://ваш-проект.supabase.co
SUPABASE_SERVICE_ROLE_KEY=service_role_key_из_Supabase
SUPABASE_STORE_KEY=omnikey
ACCOUNT_DELIVERY_THRESHOLD=0.1
ACTIVATION_SITE_URL=https://ваш_https_url_miniapp/activate
```

4. Запустить backend и Telegram-бота:

```powershell
npm run dev:server
```

5. В отдельном окне запустить mini app фронт:

```powershell
npm run dev
```

## Как подключить к Telegram

- выложить фронт на HTTPS;
- в `@BotFather` открыть `Bot Settings` -> `Menu Button`;
- вставить туда `WEB_APP_URL`;
- открыть бота и нажать `/start`.

## Как подключить Supabase

Supabase нужен, чтобы баланс, покупки и пополнения не пропадали после перезапуска Render на бесплатном тарифе.

1. Создай бесплатный проект на `supabase.com`.
2. Открой `SQL Editor` и выполни:

```sql
create table if not exists app_store (
  key text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
```

3. Открой `Project Settings` -> `API`.
4. Скопируй `Project URL` в `SUPABASE_URL`.
5. Скопируй `service_role key` в `SUPABASE_SERVICE_ROLE_KEY`.
6. Добавь эти переменные в Render и сделай redeploy.

## Автовыдача после пополнения

После успешного пополнения баланса на сумму от `ACCOUNT_DELIVERY_THRESHOLD` бот отправляет пользователю случайный ключ и ссылку на страницу активации `ACTIVATION_SITE_URL`.

Для текущего теста установи:

```text
ACCOUNT_DELIVERY_THRESHOLD=0.1
ACTIVATION_SITE_URL=https://ваш_https_url_miniapp/activate
```

На странице активации пользователь вводит ключ, после чего сайт показывает случайно сгенерированные `email` и `password`. Один и тот же ключ всегда возвращает одни и те же данные после первой активации.

## Локально и для Telegram

- локально mini app откроется в браузере на `http://localhost:5173`;
- внутри Telegram нужен публичный `HTTPS` адрес;
- для теста можно использовать `ngrok`, `Cloudflare Tunnel`, `Vercel` или `Netlify`.
