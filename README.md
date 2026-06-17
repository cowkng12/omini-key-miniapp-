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

## Локально и для Telegram

- локально mini app откроется в браузере на `http://localhost:5173`;
- внутри Telegram нужен публичный `HTTPS` адрес;
- для теста можно использовать `ngrok`, `Cloudflare Tunnel`, `Vercel` или `Netlify`.
