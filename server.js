import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import fs from 'node:fs'
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
const supportUsername = '@OmniKeySUPPORT'
const requiredChannelUsername = process.env.REQUIRED_CHANNEL_USERNAME?.trim() || '@Omni_Key'
const requiredChannelUrl = process.env.REQUIRED_CHANNEL_URL?.trim() || 'https://t.me/Omni_Key'
const cryptoPayToken = process.env.CRYPTO_PAY_TOKEN?.trim()
const cryptoPayApiUrl = process.env.CRYPTO_PAY_API_URL?.trim() || 'https://pay.crypt.bot/api'
const cryptoPayAsset = process.env.CRYPTO_PAY_ASSET?.trim() || 'USDT'
const storeFilePath = process.env.STORE_FILE_PATH?.trim() || path.join(__dirname, 'data', 'store.json')
const supabaseUrl = process.env.SUPABASE_URL?.trim()
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
const supabaseStoreKey = process.env.SUPABASE_STORE_KEY?.trim() || 'omnikey'
const accountDeliveryThreshold = Number(process.env.ACCOUNT_DELIVERY_THRESHOLD || 0.1)
const activationSiteUrl = process.env.ACTIVATION_SITE_URL?.trim() || `${webAppUrl.replace(/\/$/, '')}/activate`

const products = {
  'chatgpt-plus-ready': { title: 'ChatGPT Plus Ready Account', price: 0.1 },
  'chatgpt-go': { title: 'ChatGPT Go', price: 2.5 },
  'chatgpt-pro-ready': { title: 'ChatGPT Pro Ready Account', price: 60 },
  'chatgpt-business-seat': { title: 'ChatGPT Business Seat', price: 15 },
  'grok-x-premium': { title: 'Grok via X Premium', price: 4 },
  'grok-x-premium-plus': { title: 'Grok via X Premium+', price: 20 },
  'supergrok': { title: 'SuperGrok', price: 15 },
  'supergrok-heavy': { title: 'SuperGrok Heavy', price: 150 },
  'claude-pro': { title: 'Claude Pro', price: 10 },
  'claude-pro-duo': { title: 'Claude Pro 2 Accounts Pro', price: 18 },
  'claude-max': { title: 'Claude Max', price: 50 },
  'perplexity-pro': { title: 'Perplexity Pro', price: 10 },
  'gemini-pro': { title: 'Gemini Pro', price: 5 },
  'gemini-advanced': { title: 'Gemini Advanced', price: 10 },
  'gemini-ultra': { title: 'Gemini Ultra', price: 15 },
  'gemini-workspace-business': { title: 'Gemini Workspace Business', price: 10 },
  'gemini-workspace-enterprise': { title: 'Gemini Workspace Enterprise', price: 15 },
  'gemini-api-pack': { title: 'Gemini API Pack', price: 5 },
  'copilot-pro': { title: 'Microsoft Copilot Pro', price: 10 },
  'cursor-pro': { title: 'Cursor Pro', price: 10 },
  'cursor-pro-duo': { title: 'Cursor Pro 2 Accounts Pro', price: 18 },
  'cursor-ultra': { title: 'Cursor Ultra', price: 100 },
  'midjourney-basic': { title: 'Midjourney Basic', price: 5 },
  'runway-standard': { title: 'Runway Standard', price: 7.5 },
  'suno-pro': { title: 'Suno Pro', price: 5 },
  'kling-ai': { title: 'Kling AI', price: 5 },
  'leonardo-ai': { title: 'Leonardo AI', price: 6 },
  'elevenlabs-starter': { title: 'ElevenLabs Starter', price: 2.5 },
  'canva-pro': { title: 'Canva Pro', price: 7.5 },
  'notion-ai': { title: 'Notion AI Plus', price: 5 },
  'poe-subscription': { title: 'Poe Subscription', price: 10 },
}

const store = await loadStore()
const orders = store.orders
const topups = store.topups
const balances = new Map(Object.entries(store.balances))
const activations = store.activations
const refbotUsers = new Set(store.refbotUsers)
const topupAmounts = [0.1, 1, 1.5, ...Array.from({ length: 20 }, (_, index) => (index + 1) * 5)]
const issuedAccessKeys = new Set(Object.keys(activations))

function normalizeStore(rawStore = {}) {
  return {
    orders: Array.isArray(rawStore.orders) ? rawStore.orders : [],
    topups: Array.isArray(rawStore.topups) ? rawStore.topups : [],
    balances: rawStore.balances && typeof rawStore.balances === 'object' ? rawStore.balances : {},
    activations: rawStore.activations && typeof rawStore.activations === 'object' ? rawStore.activations : {},
    refbotUsers: Array.isArray(rawStore.refbotUsers) ? rawStore.refbotUsers : [],
  }
}

async function loadSupabaseStore() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/app_store?key=eq.${encodeURIComponent(supabaseStoreKey)}&select=data`, {
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Supabase store load failed')
  }

  return normalizeStore(data[0]?.data)
}

async function saveSupabaseStore(snapshot) {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return false
  }

  const response = await fetch(`${supabaseUrl}/rest/v1/app_store?on_conflict=key`, {
    method: 'POST',
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({
      key: supabaseStoreKey,
      data: snapshot,
      updated_at: new Date().toISOString(),
    }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data.message || 'Supabase store save failed')
  }

  return true
}

async function loadStore() {
  try {
    const supabaseStore = await loadSupabaseStore()

    if (supabaseStore) {
      return supabaseStore
    }
  } catch (error) {
    console.error('Supabase store load failed', error)
  }

  try {
    const rawStore = fs.readFileSync(storeFilePath, 'utf8')
    return normalizeStore(JSON.parse(rawStore))
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.error('Store load failed', error)
    }

    return { orders: [], topups: [], balances: {}, activations: {}, refbotUsers: [] }
  }
}

async function saveStore() {
  const snapshot = { orders, topups, balances: Object.fromEntries(balances), activations, refbotUsers: Array.from(refbotUsers) }

  try {
    if (await saveSupabaseStore(snapshot)) {
      return
    }
  } catch (error) {
    console.error('Supabase store save failed', error)
  }

  fs.mkdirSync(path.dirname(storeFilePath), { recursive: true })
  fs.writeFileSync(
    storeFilePath,
    JSON.stringify(snapshot, null, 2),
  )
}

function generateAccessKey() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let accessKey

  do {
    const parts = []

    for (let groupIndex = 0; groupIndex < 4; groupIndex += 1) {
      let group = ''

      for (let charIndex = 0; charIndex < 4; charIndex += 1) {
        group += alphabet[Math.floor(Math.random() * alphabet.length)]
      }

      parts.push(group)
    }

    accessKey = parts.join('-')
  } while (issuedAccessKeys.has(accessKey))

  issuedAccessKeys.add(accessKey)

  return accessKey
}

function generateCredentialEmail() {
  const prefixes = ['omni', 'spark', 'nova', 'pixel', 'orbit', 'neuro', 'cloud', 'orange']
  const domains = ['mailkey.pro', 'omniaccess.app', 'keymail.cloud', 'aivault.site']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const domain = domains[Math.floor(Math.random() * domains.length)]
  const suffix = Math.random().toString(36).slice(2, 8)

  return `${prefix}.${suffix}@${domain}`
}

function generateCredentialPassword() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%'
  let password = ''

  for (let index = 0; index < 14; index += 1) {
    password += alphabet[Math.floor(Math.random() * alphabet.length)]
  }

  return password
}

function createActivation(telegramId, amount) {
  const accessKey = generateAccessKey()

  activations[accessKey] = {
    key: accessKey,
    telegramId,
    amount,
    status: 'new',
    credentials: null,
    createdAt: new Date().toISOString(),
  }

  return activations[accessKey]
}

function activateKey(accessKey) {
  const normalizedKey = String(accessKey || '').trim().toUpperCase()
  const activation = activations[normalizedKey]

  if (!activation) {
    return null
  }

  if (!activation.credentials) {
    activation.credentials = {
      email: generateCredentialEmail(),
      password: generateCredentialPassword(),
    }
    activation.status = 'activated'
    activation.activatedAt = new Date().toISOString()
  }

  return activation
}

function purchaseDeliveryMessage(accessKey) {
  return [
    'Поздравляем с покупкой. Ваши данные для получения:',
    '',
    `1. Зайдите на сайт: ${activationSiteUrl}`,
    `2. Введите этот код: ${accessKey}`,
  ].join('\n')
}

function accountDeliveryMessage(accessKey) {
  return [
    'Оплата подтверждена. Ваш ключ для получения аккаунта:',
    '',
    accessKey,
    '',
    `Активируйте ключ на сайте: ${activationSiteUrl}`,
  ].join('\n')
}

function userFromInitData(initData) {
  const encodedUser = new URLSearchParams(initData || '').get('user')

  if (!encodedUser) {
    return null
  }

  try {
    return JSON.parse(encodedUser)
  } catch {
    return null
  }
}

function resolveTelegramUser({ telegramUser = null, telegramInitData = '' } = {}) {
  if (telegramUser?.id) {
    return telegramUser
  }

  return userFromInitData(telegramInitData)
}

async function createCryptoInvoice({ id, amount, description }) {
  if (!cryptoPayToken) {
    return null
  }

  const response = await fetch(`${cryptoPayApiUrl}/createInvoice`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Crypto-Pay-API-Token': cryptoPayToken,
    },
    body: JSON.stringify({
      asset: cryptoPayAsset,
      amount: String(amount),
      description,
      payload: id,
      allow_comments: false,
      allow_anonymous: true,
      expires_in: 3600,
    }),
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error?.message || 'CryptoBot invoice creation failed')
  }

  return data.result
}

async function getCryptoInvoice(invoiceId) {
  if (!cryptoPayToken || !invoiceId) {
    return null
  }

  const response = await fetch(`${cryptoPayApiUrl}/getInvoices?invoice_ids=${invoiceId}`, {
    headers: {
      'Crypto-Pay-API-Token': cryptoPayToken,
    },
  })

  const data = await response.json()

  if (!response.ok || !data.ok) {
    throw new Error(data.error?.message || 'CryptoBot invoice status request failed')
  }

  return data.result?.items?.[0] || null
}

async function isSubscribedToRequiredChannel(telegramId) {
  if (!bot || !telegramId) {
    return false
  }

  const member = await bot.telegram.getChatMember(requiredChannelUsername, telegramId)

  return ['creator', 'administrator', 'member'].includes(member.status)
}

async function creditTopup(topup) {
  const telegramId = String(topup?.telegramUser?.id || '').trim()

  if (!topup || !telegramId || topup.status === 'paid') {
    return balances.get(telegramId) || 0
  }

  const currentBalance = balances.get(telegramId) || 0
  const updatedBalance = Number((currentBalance + topup.amount).toFixed(2))

  balances.set(telegramId, updatedBalance)
  topup.status = 'paid'
  topup.paidAt = new Date().toISOString()
  topup.balanceAfter = updatedBalance

  await saveStore()

  await bot?.telegram.sendMessage(
    telegramId,
    [`Баланс пополнен на $${topup.amount}.`, `Текущий баланс: $${updatedBalance}.`].join('\n'),
  )

  if (bot && topup.amount >= accountDeliveryThreshold && refbotUsers.has(telegramId) && !topup.accountDataDelivered) {
    const activation = createActivation(telegramId, topup.amount)
    topup.activationKey = activation.key
    await bot.telegram.sendMessage(telegramId, accountDeliveryMessage(activation.key))
    topup.accountDataDelivered = true
    await saveStore()
  }

  if (bot && adminChatId) {
    await bot.telegram.sendMessage(
      adminChatId,
      [
        'Баланс пополнен',
        `ID: ${topup.id}`,
        `Сумма: $${topup.amount}`,
        `Баланс после: $${updatedBalance}`,
        `Пользователь Telegram: ${topup.telegramUser?.username ? `@${topup.telegramUser.username}` : telegramId}`,
      ].join('\n'),
    )
  }

  return updatedBalance
}

async function refreshTopupStatus(topup) {
  const invoice = await getCryptoInvoice(topup?.cryptoInvoice?.id)

  if (invoice?.status) {
    topup.cryptoInvoice.status = invoice.status
  }

  if (invoice?.status === 'paid') {
    await creditTopup(topup)
  }

  return topup
}

function watchTopupPayment(topup, attempt = 0) {
  if (!topup || topup.status === 'paid' || attempt >= 36) {
    return
  }

  setTimeout(() => {
    refreshTopupStatus(topup)
      .catch((error) => {
        console.error('CryptoBot top-up background status check failed', error)
      })
      .finally(() => {
        watchTopupPayment(topup, attempt + 1)
      })
  }, 5000)
}

app.use(cors())
app.use(express.json())

app.get('/api/config', (request, response) => {
  response.json({ sellerUrl, products })
})

app.get('/api/orders', (request, response) => {
  response.json({ orders })
})

app.get('/api/balance/:telegramId', (request, response) => {
  const telegramId = request.params.telegramId?.trim()
  const balance = balances.get(telegramId) || 0

  response.json({ balance })
})

app.post('/api/subscription/check', async (request, response) => {
  const telegramUser = resolveTelegramUser(request.body)
  const telegramId = String(telegramUser?.id || '').trim()

  if (!telegramId) {
    response.status(400).json({ error: 'Open the app through Telegram to continue', channelUrl: requiredChannelUrl })
    return
  }

  try {
    const subscribed = await isSubscribedToRequiredChannel(telegramId)

    response.json({ subscribed, channelUrl: requiredChannelUrl })
  } catch (error) {
    console.error('Telegram channel subscription check failed', error)
    response.status(502).json({ error: 'Could not check channel subscription', channelUrl: requiredChannelUrl })
  }
})

app.post('/api/topups', async (request, response) => {
  const { amount } = request.body ?? {}
  const telegramUser = resolveTelegramUser(request.body)
  const normalizedAmount = Number(amount)
  const telegramId = String(telegramUser?.id || '').trim()

  if (!topupAmounts.includes(normalizedAmount)) {
    response.status(400).json({ error: 'Unsupported top-up amount' })
    return
  }

  if (!telegramId) {
    response.status(400).json({ error: 'Open the app through Telegram to top up balance' })
    return
  }

  if (!cryptoPayToken) {
    response.status(500).json({ error: 'CryptoBot token is not configured on Render' })
    return
  }

  const topup = {
    id: `top_${Date.now()}`,
    amount: normalizedAmount,
    status: cryptoPayToken ? 'payment_pending' : 'new',
    telegramUser,
    createdAt: new Date().toISOString(),
  }

  try {
    const invoice = await createCryptoInvoice({
      id: topup.id,
      amount: topup.amount,
      description: `OmniKey balance top-up: $${topup.amount}`,
    })

    if (invoice) {
      topup.cryptoInvoice = {
        id: invoice.invoice_id,
        status: invoice.status,
        payUrl: invoice.mini_app_invoice_url || invoice.web_app_invoice_url || invoice.bot_invoice_url || invoice.pay_url,
      }

      if (!topup.cryptoInvoice.payUrl) {
        response.status(502).json({ error: 'CryptoBot did not return a payment URL' })
        return
      }

      topups.unshift(topup)
      await saveStore()
      watchTopupPayment(topup)
    }
  } catch (error) {
    topup.status = 'payment_error'
    console.error('CryptoBot top-up invoice failed', error)
    response.status(502).json({ error: error.message || 'Payment invoice creation failed' })
    return
  }

  if (bot && adminChatId) {
    const adminLines = [
      'Новое пополнение баланса',
      `ID: ${topup.id}`,
      `Сумма: $${topup.amount}`,
      `Статус: ${topup.status}`,
      `Пользователь Telegram: ${telegramUser?.username ? `@${telegramUser.username}` : telegramUser?.id || 'Не определен'}`,
      topup.cryptoInvoice?.payUrl ? `Оплата CryptoBot: ${topup.cryptoInvoice.payUrl}` : null,
    ].filter(Boolean)

    await bot.telegram.sendMessage(adminChatId, adminLines.join('\n'))
  }

  response.status(201).json({ topup, paymentUrl: topup.cryptoInvoice?.payUrl || null })
})

app.post('/api/activate', async (request, response) => {
  const activation = activateKey(request.body?.key)

  if (!activation) {
    response.status(404).json({ error: 'Invalid activation key' })
    return
  }

  await saveStore()

  response.json({
    email: activation.credentials.email,
    password: activation.credentials.password,
  })
})

app.get('/api/topups/:topupId/status', async (request, response) => {
  const topupId = request.params.topupId?.trim()
  const topup = topups.find((item) => item.id === topupId)
  const telegramId = String(topup?.telegramUser?.id || '').trim()

  if (!topup) {
    response.status(404).json({ error: 'Top-up not found' })
    return
  }

  if (!telegramId) {
    response.status(400).json({ error: 'Telegram user is required' })
    return
  }

  try {
    await refreshTopupStatus(topup)
  } catch (error) {
    console.error('CryptoBot top-up status check failed', error)
    response.status(502).json({ error: 'Payment status check failed' })
    return
  }

  response.json({ topup, balance: balances.get(telegramId) || 0 })
})

app.post('/api/orders/balance', async (request, response) => {
  const { productId, customer = {} } = request.body ?? {}
  const telegramUser = resolveTelegramUser(request.body)
  const product = products[productId]
  const telegramId = String(telegramUser?.id || '').trim()

  if (!product) {
    response.status(400).json({ error: 'Unknown product' })
    return
  }

  if (!telegramId) {
    response.status(400).json({ error: 'Telegram user is required' })
    return
  }

  const currentBalance = balances.get(telegramId) || 0

  if (currentBalance < product.price) {
    response.status(402).json({ error: 'Insufficient balance', balance: currentBalance })
    return
  }

  const updatedBalance = Number((currentBalance - product.price).toFixed(2))
  balances.set(telegramId, updatedBalance)

  const order = {
    id: `ord_${Date.now()}`,
    productId,
    productTitle: product.title,
    price: product.price,
    status: 'paid_from_balance',
    paymentMethod: 'balance',
    accessKey: generateAccessKey(),
    customer: {
      name: (customer.name || '').trim(),
      telegram: (customer.telegram || '').trim(),
    },
    telegramUser,
    createdAt: new Date().toISOString(),
  }

  orders.unshift(order)
  await saveStore()

  await bot?.telegram.sendMessage(telegramId, purchaseDeliveryMessage(order.accessKey))

  if (bot && adminChatId) {
    const adminLines = [
      'Новый заказ с баланса',
      `ID: ${order.id}`,
      `Товар: ${order.productTitle}`,
      `Цена: $${order.price}`,
      `Статус: ${order.status}`,
      `Ключ: ${order.accessKey}`,
      `Остаток баланса: $${updatedBalance}`,
      `Пользователь Telegram: ${telegramUser?.username ? `@${telegramUser.username}` : telegramUser?.id || 'Не определен'}`,
    ]

    await bot.telegram.sendMessage(adminChatId, adminLines.join('\n'))
  }

  response.status(201).json({ order, balance: updatedBalance })
})

app.use(express.static(path.join(__dirname, 'dist')))

app.get(/.*/, (request, response) => {
  response.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

let bot = null

if (botToken) {
  bot = new Telegraf(botToken)
  const userLanguages = new Map()

  async function safeAnswerCbQuery(context, text) {
    try {
      await context.answerCbQuery(text)
    } catch (error) {
      const description = error?.response?.description || error?.message || ''

      if (!description.includes('query is too old') && !description.includes('query ID is invalid')) {
        throw error
      }
    }
  }

  const botText = {
    ru: {
      languageSelected: 'Язык выбран: Русский.',
      welcome: (name) => [
        `Добро пожаловать, ${name}. Это OmniKey ⚡`,
        '',
        'Здесь можно купить подписки и готовые AI-товары для работы, кода, учебы, видео, голоса и ресерча.',
        '',
        'Открой каталог, выбери нужный сервис и тариф, затем оформи заказ прямо в Mini App.',
        '',
        'Начни с каталога или открой инструкцию ниже.',
      ].join('\n'),
      guide: [
        '📘 Как купить',
        '',
        '1. Нажмите "🛍 Открыть каталог".',
        '2. Пополните баланс на нужную вам сумму.',
        '3. Выберите товар.',
        '4. Оплатите товар.',
        '5. В бота придут данные от товара.',
      ].join('\n'),
      orders: '🧾 Мои покупки\n\nПока что у вас нет заказов. Откройте каталог, чтобы его сделать.',
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
      support: `🛠 Поддержка\n\nЕсли у вас остались вопросы или появилась проблема, советуем обратиться в поддержку: ${supportUsername}`,
      about: '💠 О проекте\n\nOmniKey Store помогает быстро покупать подписки на популярные AI-сервисы.',
      balance: (amount) => `💰 Баланс\n\nВаш текущий баланс: $${amount}`,
      subscribeRequired: [
        'Подпишитесь на канал OmniKey, чтобы открыть каталог.',
        '',
        'Если вы уже подписаны, нажмите кнопку проверки ниже.',
      ].join('\n'),
      subscribeSuccess: 'Подписка найдена. Открываю меню.',
      subscribeMissing: 'Подписка не найдена. Подпишитесь на канал и нажмите проверку еще раз.',
      subscribeButton: 'Подписаться на канал',
      checkSubscribeButton: 'Я подписался',
      shop: '🛍 Открыть каталог',
      guideButton: '📘 Как купить',
      ordersButton: '🧾 Мои покупки',
      balanceButton: '💰 Баланс',
      promotionsButton: '🎁 Акции',
      supportButton: '🛠 Поддержка',
      aboutButton: '💠 OmniKey',
      languageButton: '🌍 Сменить язык',
    },
    en: {
      languageSelected: 'Language selected: English.',
      welcome: (name) => [
        `Welcome, ${name}. This is OmniKey ⚡`,
        '',
        'Here you can buy AI subscriptions and ready AI products for work, coding, study, video, voice and research.',
        '',
        'Open the catalog, choose the service and plan, then place your order inside the Mini App.',
        '',
        'Start with the catalog or open the buying guide.',
      ].join('\n'),
      guide: [
        '📘 How to buy',
        '',
        '1. Press "🛍 Open catalog".',
        '2. Top up your balance with the required amount.',
        '3. Choose a product.',
        '4. Pay for the product.',
        '5. Product access details will arrive in the bot.',
      ].join('\n'),
      orders: '🧾 My purchases\n\nYou do not have any orders yet. Open the catalog to place one.',
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
      support: `🛠 Support\n\nIf you still have questions or something went wrong, we recommend contacting support: ${supportUsername}`,
      about: '💠 About\n\nOmniKey Store helps you buy subscriptions for popular AI services quickly.',
      balance: (amount) => `💰 Balance\n\nYour current balance: $${amount}`,
      subscribeRequired: [
        'Subscribe to the OmniKey channel to open the catalog.',
        '',
        'If you are already subscribed, press the check button below.',
      ].join('\n'),
      subscribeSuccess: 'Subscription found. Opening the menu.',
      subscribeMissing: 'Subscription was not found. Subscribe to the channel and press check again.',
      subscribeButton: 'Subscribe to channel',
      checkSubscribeButton: 'I subscribed',
      shop: '🛍 Open catalog',
      guideButton: '📘 How to buy',
      ordersButton: '🧾 My purchases',
      balanceButton: '💰 Balance',
      promotionsButton: '🎁 Deals',
      supportButton: '🛠 Support',
      aboutButton: '💠 OmniKey',
      languageButton: '🌍 Change language',
    },
    zh: {
      languageSelected: '已选择语言：中文。',
      welcome: (name) => [
        `欢迎，${name}。这里是 OmniKey ⚡`,
        '',
        '这里可以购买适合工作、编程、学习、视频、语音和研究的 AI 订阅和现成 AI 商品。',
        '',
        '打开目录，选择需要的服务和套餐，然后直接在 Mini App 内下单。',
        '',
        '可以先打开目录，或查看购买说明。',
      ].join('\n'),
      guide: [
        '📘 如何购买',
        '',
        '1. 点击“🛍 打开目录”。',
        '2. 按所需金额充值余额。',
        '3. 选择商品。',
        '4. 支付商品。',
        '5. 商品数据会发送到机器人。',
      ].join('\n'),
      orders: '🧾 我的购买\n\n你目前还没有订单。打开目录即可下单。',
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
      support: `🛠 支持\n\n如果你还有问题，或遇到了故障，建议联系支持：${supportUsername}`,
      about: '💠 关于项目\n\nOmniKey Store 帮助你快速购买热门 AI 服务订阅。',
      balance: (amount) => `💰 余额\n\n当前余额：$${amount}`,
      subscribeRequired: [
        '请先订阅 OmniKey 频道，然后打开目录。',
        '',
        '如果你已经订阅，请点击下面的检查按钮。',
      ].join('\n'),
      subscribeSuccess: '已找到订阅。正在打开菜单。',
      subscribeMissing: '未找到订阅。请订阅频道后再次点击检查。',
      subscribeButton: '订阅频道',
      checkSubscribeButton: '我已订阅',
      shop: '🛍 打开目录',
      guideButton: '📘 如何购买',
      ordersButton: '🧾 我的购买',
      balanceButton: '💰 余额',
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
      [Markup.button.callback(text.ordersButton, 'orders'), Markup.button.callback(text.balanceButton, 'balance')],
      [Markup.button.callback(text.supportButton, 'support')],
      [Markup.button.callback(text.aboutButton, 'about')],
      [Markup.button.callback(text.languageButton, 'language')],
    ])
  }

  function subscriptionKeyboard(language) {
    const text = botText[language]

    return Markup.inlineKeyboard([
      [Markup.button.url(text.subscribeButton, requiredChannelUrl)],
      [Markup.button.callback(text.checkSubscribeButton, 'check_subscription')],
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

  async function sendSubscriptionGate(context, language) {
    await context.reply(botText[language].subscribeRequired, subscriptionKeyboard(language))
  }

  async function sendMainMenuIfSubscribed(context, language) {
    const telegramId = String(context.from?.id || '').trim()

    try {
      if (await isSubscribedToRequiredChannel(telegramId)) {
        await sendMainMenu(context, language)
        return true
      }
    } catch (error) {
      console.error('Telegram channel subscription check failed', error)
    }

    await sendSubscriptionGate(context, language)
    return false
  }

  bot.start(async (context) => {
    if (context.startPayload?.startsWith('refbot_') && context.from?.id) {
      refbotUsers.add(String(context.from.id))
      await saveStore()
    }

    await context.reply(
      'Выберите язык / Choose language / 选择语言',
      languageKeyboard,
    )
  })

  bot.command('shop', async (context) => {
    await sendMainMenuIfSubscribed(context, currentLanguage(context))
  })

  bot.command('myid', async (context) => {
    await context.reply(`Ваш Telegram ID: ${context.from.id}`)
  })

  bot.command('setbalance', async (context) => {
    if (String(context.from.id) !== adminChatId) {
      await context.reply('Команда доступна только администратору.')
      return
    }

    const [, telegramId, amount] = context.message.text.trim().split(/\s+/)
    const balance = Number(amount)

    if (!telegramId || !Number.isFinite(balance) || balance < 0) {
      await context.reply('Использование: /setbalance <telegram_id> <amount>')
      return
    }

    balances.set(telegramId, balance)
    await saveStore()
    await context.reply(`Баланс пользователя ${telegramId} установлен: $${balance}`)
  })

  bot.action('support', async (context) => {
    await safeAnswerCbQuery(context)
    await context.reply(botText[currentLanguage(context)].support)
  })

  bot.action('guide', async (context) => {
    await safeAnswerCbQuery(context)
    await context.reply(botText[currentLanguage(context)].guide)
  })

  bot.action('orders', async (context) => {
    await safeAnswerCbQuery(context)
    await context.reply(botText[currentLanguage(context)].orders)
  })

  bot.action('balance', async (context) => {
    await safeAnswerCbQuery(context)

    const telegramId = String(context.from?.id || '').trim()
    const balance = balances.get(telegramId) || 0

    await context.reply(botText[currentLanguage(context)].balance(balance))
  })

  bot.action('promotions', async (context) => {
    await safeAnswerCbQuery(context)
    await context.reply(botText[currentLanguage(context)].promotions)
  })

  bot.action('about', async (context) => {
    await safeAnswerCbQuery(context)
    await context.reply(botText[currentLanguage(context)].about)
  })

  bot.action('language', async (context) => {
    await safeAnswerCbQuery(context)
    await context.reply('Выберите язык / Choose language / 选择语言', languageKeyboard)
  })

  bot.action('check_subscription', async (context) => {
    const language = currentLanguage(context)

    try {
      if (await isSubscribedToRequiredChannel(String(context.from?.id || '').trim())) {
        await safeAnswerCbQuery(context, botText[language].subscribeSuccess)
        await sendMainMenu(context, language)
        return
      }
    } catch (error) {
      console.error('Telegram channel subscription check failed', error)
    }

    await safeAnswerCbQuery(context, botText[language].subscribeMissing)
    await sendSubscriptionGate(context, language)
  })

  bot.action(/set_lang_(ru|en|zh)/, async (context) => {
    const language = context.match[1]

    userLanguages.set(context.from.id, language)
    await safeAnswerCbQuery(context, botText[language].languageSelected)
    await context.reply(botText[language].languageSelected)
    await sendMainMenuIfSubscribed(context, language)
  })

  bot.catch((error, context) => {
    console.error('Telegram bot update error', {
      error: error?.message,
      description: error?.response?.description,
      updateType: context.updateType,
      callbackData: context.callbackQuery?.data,
      fromId: context.from?.id,
    })
  })

  bot.launch()
    .then(async () => {
      await bot.telegram.setChatMenuButton({
        menu_button: {
          type: 'web_app',
          text: 'Open',
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
