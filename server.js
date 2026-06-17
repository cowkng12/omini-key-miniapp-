import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Markup, Telegraf } from 'telegraf'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const port = Number(process.env.PORT || 3001)
const botToken = process.env.TELEGRAM_BOT_TOKEN?.trim()
const adminChatId = process.env.ADMIN_CHAT_ID?.trim()
const webAppUrl = process.env.WEB_APP_URL?.trim() || 'http://localhost:5173'
const sendPaymentUrl = process.env.SEND_PAYMENT_URL?.trim() || 'https://t.me/send'

const products = {
  'claude-pro': { title: 'Claude Pro', price: 12 },
  'claude-max': { title: 'Claude Max', price: 75 },
  'cursor-pro': { title: 'Cursor Pro', price: 10 },
  'cursor-ultra': { title: 'Cursor Ultra', price: 24 },
}

const orders = []

app.use(cors())
app.use(express.json())

app.get('/api/config', (request, response) => {
  response.json({ sendPaymentUrl, products })
})

app.get('/api/orders', (request, response) => {
  response.json({ orders })
})

app.post('/api/orders', async (request, response) => {
  const { productId, customer = {}, telegramUser = null } = request.body ?? {}
  const product = products[productId]

  if (!product) {
    response.status(400).json({ error: 'Unknown product' })
    return
  }

  const order = {
    id: `ord_${Date.now()}`,
    productId,
    productTitle: product.title,
    price: product.price,
    status: 'new',
    customer: {
      name: (customer.name || '').trim(),
      telegram: (customer.telegram || '').trim(),
      contact: (customer.contact || '').trim(),
    },
    telegramUser,
    createdAt: new Date().toISOString(),
  }

  orders.unshift(order)

  if (bot && adminChatId) {
    const adminLines = [
      'Новый заказ',
      `ID: ${order.id}`,
      `Товар: ${order.productTitle}`,
      `Цена: $${order.price}`,
      `Имя: ${order.customer.name || 'Не указано'}`,
      `Telegram: ${order.customer.telegram || 'Не указан'}`,
      `Контакт: ${order.customer.contact || 'Не указан'}`,
      `Пользователь Telegram: ${telegramUser?.username ? `@${telegramUser.username}` : telegramUser?.id || 'Не определен'}`,
    ]

    await bot.telegram.sendMessage(adminChatId, adminLines.join('\n'))
  }

  response.status(201).json({ order })
})

app.use(express.static(path.join(__dirname, 'dist')))

app.get(/.*/, (request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

let bot = null

if (botToken) {
  bot = new Telegraf(botToken)

  const keyboard = Markup.inlineKeyboard([
    [Markup.button.webApp('Открыть магазин', webAppUrl)],
    [Markup.button.url('Открыть @send', sendPaymentUrl)],
  ])

  bot.start(async (context) => {
    await context.reply(
      'Магазин Claude и Cursor готов. Открой mini app и выбери тариф.',
      keyboard,
    )
  })

  bot.command('shop', async (context) => {
    await context.reply('Открываю магазин.', keyboard)
  })

  bot.launch()
    .then(() => {
      console.log('Telegram bot started')
    })
    .catch((error) => {
      console.error('Telegram bot failed to start', error)
    })
}

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
