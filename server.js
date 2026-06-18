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
  'claude-pro-duo': { title: 'Claude Pro 2 Accounts', price: 18 },
  'claude-max': { title: 'Claude Max', price: 75 },
  'perplexity-pro': { title: 'Perplexity Pro', price: 12 },
  'cursor-pro': { title: 'Cursor Pro', price: 10 },
  'cursor-pro-duo': { title: 'Cursor Pro 2 Accounts', price: 18 },
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
        `Привет, ${name}. Это OmniKey ⚡`,
        '',
        'Здесь можно быстро подобрать подписку на AI-сервисы для работы, кода, видео, голоса и ресерча.',
        '',
        'Что внутри:',
        '• каталог популярных нейросервисов',
        '• заявка прямо из Telegram Mini App',
        '• связь с продавцом без лишних шагов',
        '',
        'Начни с каталога или открой инструкцию ниже.',
      ].join('\n'),
      guide: [
        '📘 Как купить',
        '',
        '1. Нажмите "🛍 Открыть каталог".',
        '2. Выберите нужный AI-сервис и тариф.',
        '3. Укажите имя и Telegram.',
        '4. Нажмите "Подать заявку на покупку".',
        '5. В течение 5 минут с вами свяжется менеджер для подтверждения заказа.',
      ].join('\n'),
      orders: '🏆 Заказы\n\nПока что у вас нет заказов. Откройте каталог, чтобы его сделать.',
      promotions: [
        '🎁 Акции',
        '',
        'В честь открытия OmniKey Store действует специальное предложение:',
        '',
        '• Cursor Pro — $10',
        '• Claude Pro — $10',
        '• при заказе от 2 подписок каждая позиция — $9',
        '',
        'Акционное предложение уже отмечено в соответствующих позициях каталога.',
        '',
        'Чтобы получить акционную цену, укажите промокод: HAPPYOPENING.',
        '',
        'Для заказа выберите нужный товар в каталоге и подайте заявку.',
      ].join('\n'),
      support: `🛠 Поддержка\n\nЕсли у вас остались вопросы или появилась проблема, советуем обратиться в поддержку: ${sellerUrl.replace('https://t.me/', '@')}`,
      about: '💠 О проекте\n\nOmniKey Store помогает быстро покупать подписки на популярные AI-сервисы.',
      shop: '🛍 Открыть каталог',
      guideButton: '📘 Как купить',
      ordersButton: '🧾 Мои покупки',
      promotionsButton: '🎁 Акции',
      supportButton: '🛠 Поддержка',
      aboutButton: '💠 OmniKey',
      languageButton: '🌍 Сменить язык',
    },
    en: {
      languageSelected: 'Language selected: English.',
      welcome: (name) => [
        `Hi, ${name}. This is OmniKey ⚡`,
        '',
        'Pick AI subscriptions for work, coding, video, voice and research in one Telegram mini store.',
        '',
        'Inside:',
        '• popular AI service catalog',
        '• order request inside Telegram Mini App',
        '• direct seller contact without extra steps',
        '',
        'Start with the catalog or open the buying guide.',
      ].join('\n'),
      guide: [
        '📘 How to buy',
        '',
        '1. Press "🛍 Open catalog".',
        '2. Pick an AI service and plan.',
        '3. Enter your name and Telegram.',
        '4. Press "Submit purchase request".',
        '5. A manager will contact you within 5 minutes to confirm the order.',
      ].join('\n'),
      orders: '🏆 Orders\n\nYou do not have any orders yet. Open the catalog to place one.',
      promotions: [
        '🎁 Promotions',
        '',
        'Special opening offer from OmniKey Store:',
        '',
        '• Cursor Pro — $10',
        '• Claude Pro — $10',
        '• when ordering 2 or more subscriptions, each item is $9',
        '',
        'This offer is already marked inside the relevant catalog items.',
        '',
        'To get the promotional price, use promo code: HAPPYOPENING.',
        '',
        'To order, choose the required product in the catalog and submit a request.',
      ].join('\n'),
      support: `🛠 Support\n\nIf you still have questions or something went wrong, we recommend contacting support: ${sellerUrl.replace('https://t.me/', '@')}`,
      about: '💠 About\n\nOmniKey Store helps you buy subscriptions for popular AI services quickly.',
      shop: '🛍 Open catalog',
      guideButton: '📘 How to buy',
      ordersButton: '🧾 My purchases',
      promotionsButton: '🎁 Deals',
      supportButton: '🛠 Support',
      aboutButton: '💠 OmniKey',
      languageButton: '🌍 Change language',
    },
    zh: {
      languageSelected: '已选择语言：中文。',
      welcome: (name) => [
        `你好，${name}。这里是 OmniKey ⚡`,
        '',
        '在 Telegram 里快速选择适合工作、编程、视频、语音和研究的 AI 订阅。',
        '',
        '这里有：',
        '• 热门 AI 服务目录',
        '• Telegram Mini App 内提交需求',
        '• 直接联系卖家，无多余步骤',
        '',
        '可以先打开目录，或查看购买说明。',
      ].join('\n'),
      guide: [
        '📘 如何购买',
        '',
        '1. 点击“🛍 打开目录”。',
        '2. 选择 AI 服务和套餐。',
        '3. 填写姓名和 Telegram。',
        '4. 点击“提交购买申请”。',
        '5. 经理会在 5 分钟内联系你确认订单。',
      ].join('\n'),
      orders: '🏆 订单\n\n你目前还没有订单。打开目录即可下单。',
      promotions: [
        '🎁 优惠活动',
        '',
        'OmniKey Store 开业优惠：',
        '',
        '• Cursor Pro — $10',
        '• Claude Pro — $10',
        '• 购买 2 个或以上订阅，每个仅 $9',
        '',
        '该优惠已在对应的商品卡片中标注。',
        '',
        '如需享受优惠价格，请使用优惠码：HAPPYOPENING。',
        '',
        '下单请在目录中选择商品并提交申请。',
      ].join('\n'),
      support: `🛠 支持\n\n如果你还有问题，或遇到了故障，建议联系支持：${sellerUrl.replace('https://t.me/', '@')}`,
      about: '💠 关于项目\n\nOmniKey Store 帮助你快速购买热门 AI 服务订阅。',
      shop: '🛍 打开目录',
      guideButton: '📘 如何购买',
      ordersButton: '🧾 我的购买',
      promotionsButton: '🎁 优惠',
      supportButton: '🛠 支持',
      aboutButton: '💠 OmniKey',
      languageButton: '🌍 切换语言',
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
      [Markup.button.callback(text.guideButton, 'guide'), Markup.button.callback(text.promotionsButton, 'promotions')],
      [Markup.button.callback(text.ordersButton, 'orders'), Markup.button.callback(text.supportButton, 'support')],
      [Markup.button.callback(text.aboutButton, 'about')],
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

  bot.action('promotions', async (context) => {
    await context.answerCbQuery()
    await context.reply(botText[currentLanguage(context)].promotions)
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
    .then(async () => {
      await bot.telegram.setChatMenuButton({
        menu_button: {
          type: 'web_app',
          text: 'OmniKey',
          web_app: { url: webAppUrl },
        },
      })

      console.log('Telegram bot started')
    })
    .catch((error) => {
      console.error('Telegram bot failed to start', error)
    })
}

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`)
})
