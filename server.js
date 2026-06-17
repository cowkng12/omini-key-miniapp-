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
const sellerUrl = process.env.SELLER_URL?.trim() || 'https://t.me/metifrysell'

const products = {
  'claude-pro': { title: 'Claude Pro', price: 12 },
  'claude-max': { title: 'Claude Max', price: 75 },
  'perplexity-pro': { title: 'Perplexity Pro', price: 12 },
  'cursor-pro': { title: 'Cursor Pro', price: 10 },
  'cursor-ultra': { title: 'Cursor Ultra', price: 24 },
  'midjourney-basic': { title: 'Midjourney Basic', price: 10 },
  'runway-standard': { title: 'Runway Standard', price: 15 },
  'elevenlabs-starter': { title: 'ElevenLabs Starter', price: 5 },
  'notion-ai': { title: 'Notion AI Plus', price: 10 },
  'poe-subscription': { title: 'Poe Subscription', price: 20 },
}

const orders = []

app.use(cors())
app.use(express.json())

app.get('/api/config', (request, response) => {
  response.json({ sellerUrl, products })
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
  const userLanguages = new Map()

  const botText = {
    ru: {
      languageSelected: 'Язык выбран: Русский.',
      welcome: (name) => [
        `С возвращением, ${name}! 🚀`,
        '',
        'Добро пожаловать в OmniKey Store. Мы предлагаем премиум AI подписки по выгодным ценам.',
        '',
        '⚡ Мгновенная доставка',
        '🎯 Безопасные платежи',
        '🌐 Поддержка 24/7',
        '',
        'Нажмите кнопку ниже, чтобы начать!',
      ].join('\n'),
      guide: [
        '📚 Руководство',
        '',
        '1. Нажмите "🔥 Запустить магазин".',
        '2. Выберите нужный AI-сервис и тариф.',
        '3. Оставьте имя и контакт.',
        '4. Нажмите "Написать для покупки".',
        '5. Напишите продавцу и завершите покупку.',
      ].join('\n'),
      orders: '🏆 Заказы\n\nИстория покупок скоро появится. Пока по заказам пишите в поддержку.',
      support: `💬 Поддержка\n\nНапишите продавцу: ${sellerUrl.replace('https://t.me/', '@')}`,
      about: '💎 О нас\n\nOmniKey Store помогает быстро покупать подписки на популярные AI-сервисы.',
      shop: '🔥 Запустить магазин',
      guideButton: '📚 Руководство',
      ordersButton: '🏆 Заказы',
      supportButton: '💬 Поддержка',
      aboutButton: '💎 О нас',
      languageButton: '🌍 Язык',
    },
    en: {
      languageSelected: 'Language selected: English.',
      welcome: (name) => [
        `Welcome back, ${name}! 🚀`,
        '',
        'Welcome to OmniKey Store. We offer premium AI subscriptions at good prices.',
        '',
        '⚡ Instant delivery',
        '🎯 Safe payments',
        '🌐 24/7 support',
        '',
        'Press a button below to start!',
      ].join('\n'),
      guide: [
        '📚 Guide',
        '',
        '1. Press "🔥 Launch store".',
        '2. Pick an AI service and plan.',
        '3. Leave your name and contact.',
        '4. Press "Message to buy".',
        '5. Message the seller and complete the purchase.',
      ].join('\n'),
      orders: '🏆 Orders\n\nPurchase history is coming soon. For now, contact support about your orders.',
      support: `💬 Support\n\nMessage the seller: ${sellerUrl.replace('https://t.me/', '@')}`,
      about: '💎 About\n\nOmniKey Store helps you buy subscriptions for popular AI services quickly.',
      shop: '🔥 Launch store',
      guideButton: '📚 Guide',
      ordersButton: '🏆 Orders',
      supportButton: '💬 Support',
      aboutButton: '💎 About',
      languageButton: '🌍 Language',
    },
    zh: {
      languageSelected: '已选择语言：中文。',
      welcome: (name) => [
        `欢迎回来，${name}！🚀`,
        '',
        '欢迎来到 OmniKey Store。我们提供高性价比的高级 AI 订阅。',
        '',
        '⚡ 即时交付',
        '🎯 安全支付',
        '🌐 24/7 支持',
        '',
        '点击下方按钮开始！',
      ].join('\n'),
      guide: [
        '📚 指南',
        '',
        '1. 点击“🔥 打开商店”。',
        '2. 选择 AI 服务和套餐。',
        '3. 留下姓名和联系方式。',
        '4. 点击“联系购买”。',
        '5. 联系卖家并完成购买。',
      ].join('\n'),
      orders: '🏆 订单\n\n购买记录即将上线。目前请联系客服查询订单。',
      support: `💬 支持\n\n联系卖家：${sellerUrl.replace('https://t.me/', '@')}`,
      about: '💎 关于我们\n\nOmniKey Store 帮助你快速购买热门 AI 服务订阅。',
      shop: '🔥 打开商店',
      guideButton: '📚 指南',
      ordersButton: '🏆 订单',
      supportButton: '💬 支持',
      aboutButton: '💎 关于',
      languageButton: '🌍 语言',
    },
  }

  const languageKeyboard = Markup.inlineKeyboard([
    [Markup.button.callback('Русский 🇷🇺', 'set_lang_ru')],
    [Markup.button.callback('English 🇬🇧', 'set_lang_en')],
    [Markup.button.callback('中文 🇨🇳', 'set_lang_zh')],
  ])

  function mainKeyboard(language) {
    const text = botText[language]

    return Markup.inlineKeyboard([
      [Markup.button.webApp(text.shop, webAppUrl)],
      [Markup.button.callback(text.guideButton, 'guide'), Markup.button.callback(text.ordersButton, 'orders')],
      [Markup.button.callback(text.supportButton, 'support'), Markup.button.callback(text.aboutButton, 'about')],
      [Markup.button.callback(text.languageButton, 'language')],
    ])
  }

  function currentLanguage(context) {
    return userLanguages.get(context.from?.id) || 'ru'
  }

  async function sendMainMenu(context, language) {
    const name = context.from?.first_name || 'friend'
    await context.reply(botText[language].welcome(name), mainKeyboard(language))
  }

  bot.start(async (context) => {
    await context.reply(
      'Выберите язык / Choose language / 选择语言',
      languageKeyboard,
    )
  })

  bot.command('shop', async (context) => {
    await sendMainMenu(context, currentLanguage(context))
  })

  bot.action('support', async (context) => {
    await context.answerCbQuery()
    await context.reply(botText[currentLanguage(context)].support)
  })

  bot.action('guide', async (context) => {
    await context.answerCbQuery()
    await context.reply(botText[currentLanguage(context)].guide)
  })

  bot.action('orders', async (context) => {
    await context.answerCbQuery()
    await context.reply(botText[currentLanguage(context)].orders)
  })

  bot.action('about', async (context) => {
    await context.answerCbQuery()
    await context.reply(botText[currentLanguage(context)].about)
  })

  bot.action('language', async (context) => {
    await context.answerCbQuery()
    await context.reply('Выберите язык / Choose language / 选择语言', languageKeyboard)
  })

  bot.action(/set_lang_(ru|en|zh)/, async (context) => {
    const language = context.match[1]

    userLanguages.set(context.from.id, language)
    await context.answerCbQuery(botText[language].languageSelected)
    await context.reply(botText[language].languageSelected)
    await sendMainMenu(context, language)
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
