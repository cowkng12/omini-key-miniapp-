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
const walletPayOptions = [
  {
    id: 'ton',
    label: 'TON',
    network: 'TON',
    asset: 'USDT TON / GRAM',
    address: process.env.WALLET_PAY_TON_ADDRESS?.trim() || 'UQDpGKcwWkYJmRuamTSZhb7Q0gnqWiCzZ-LDlmihIGE34L3f',
  },
  {
    id: 'trc20',
    label: 'TRC20',
    network: 'TRC20',
    asset: 'USDT',
    address: process.env.WALLET_PAY_TRC20_ADDRESS?.trim() || 'TJKWXgisQTVtyPXy6Ns8BfbBCnFSQKmoPt',
  },
].filter((option) => option.address)
const storeFilePath = process.env.STORE_FILE_PATH?.trim() || path.join(__dirname, 'data', 'store.json')
const supabaseUrl = process.env.SUPABASE_URL?.trim()
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
const supabaseStoreKey = process.env.SUPABASE_STORE_KEY?.trim() || 'omnikey'
const accountDeliveryThreshold = Number(process.env.ACCOUNT_DELIVERY_THRESHOLD || 1)
const activationSiteUrl = process.env.ACTIVATION_SITE_URL?.trim() || `${webAppUrl.replace(/\/$/, '')}/activate`
const keepAliveUrl = process.env.KEEP_ALIVE_URL?.trim() || webAppUrl
const keepAliveEnabled = process.env.KEEP_ALIVE_ENABLED !== 'false'
const keepAliveIntervalMs = Number(process.env.KEEP_ALIVE_INTERVAL_MS || 5 * 60 * 1000)

const products = {
  'chatgpt-plus-ready': { title: 'ChatGPT Plus Ready Account', price: 1.5 },
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
const topupAmounts = [1, 1.5, ...Array.from({ length: 20 }, (_, index) => (index + 1) * 5)]
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

async function refreshStore() {
  const freshStore = await loadStore()

  orders.splice(0, orders.length, ...freshStore.orders)
  topups.splice(0, topups.length, ...freshStore.topups)

  balances.clear()
  Object.entries(freshStore.balances).forEach(([telegramId, balance]) => {
    balances.set(telegramId, balance)
  })

  Object.keys(activations).forEach((key) => {
    delete activations[key]
  })
  Object.assign(activations, freshStore.activations)

  refbotUsers.clear()
  freshStore.refbotUsers.forEach((telegramId) => {
    refbotUsers.add(telegramId)
  })

  issuedAccessKeys.clear()
  Object.keys(activations).forEach((key) => {
    issuedAccessKeys.add(key)
  })
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
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = Math.random().toString(36).slice(2, 8)

  return `${prefix}.${suffix}@gmail.com`
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

function registerActivationKey(accessKey, telegramId, amount, source) {
  const normalizedKey = String(accessKey || '').trim().toUpperCase()

  activations[normalizedKey] = activations[normalizedKey] || {
    key: normalizedKey,
    telegramId,
    amount,
    source,
    status: 'new',
    credentials: null,
    createdAt: new Date().toISOString(),
  }

  issuedAccessKeys.add(normalizedKey)

  return activations[normalizedKey]
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

function startKeepAlive() {
  if (!keepAliveEnabled || !keepAliveUrl || keepAliveUrl.includes('localhost')) {
    return
  }

  const healthUrl = `${keepAliveUrl.replace(/\/$/, '')}/health`

  setInterval(() => {
    fetch(healthUrl)
      .catch((error) => {
        console.error('Keep-alive ping failed', error.message)
      })
  }, keepAliveIntervalMs).unref?.()
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
  response.json({
    sellerUrl,
    products,
    walletPayments: walletPayOptions,
  })
})

app.get('/health', (request, response) => {
  response.json({ ok: true, service: 'omini-key-miniapp' })
})

app.get('/api/orders', (request, response) => {
  const telegramId = String(request.query.telegramId || '').trim()
  const userOrders = telegramId
    ? orders.filter((order) => String(order.telegramUser?.id || '').trim() === telegramId)
    : orders

  response.json({ orders: userOrders })
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

app.post('/api/topups/wallet', async (request, response) => {
  const { amount, networkId = 'ton' } = request.body ?? {}
  const telegramUser = resolveTelegramUser(request.body)
  const normalizedAmount = Number(amount)
  const telegramId = String(telegramUser?.id || '').trim()
  const walletPayOption = walletPayOptions.find((option) => option.id === networkId)

  if (!topupAmounts.includes(normalizedAmount)) {
    response.status(400).json({ error: 'Unsupported top-up amount' })
    return
  }

  if (!telegramId) {
    response.status(400).json({ error: 'Open the app through Telegram to top up balance' })
    return
  }

  if (!walletPayOption) {
    response.status(400).json({ error: 'Unsupported wallet payment network' })
    return
  }

  const uniquePart = (topups.filter((topup) => topup.status !== 'paid').length % 90) + 10
  const payableAmount = Number((normalizedAmount + uniquePart / 10000).toFixed(4))
  const topup = {
    id: `top_${Date.now()}`,
    amount: normalizedAmount,
    status: 'wallet_pending',
    paymentMethod: 'wallet',
    telegramUser,
    walletPayment: {
      id: walletPayOption.id,
      label: walletPayOption.label,
      address: walletPayOption.address,
      network: walletPayOption.network,
      asset: walletPayOption.asset,
      payableAmount,
    },
    createdAt: new Date().toISOString(),
  }

  topups.unshift(topup)
  await saveStore()

  if (bot && adminChatId) {
    await bot.telegram.sendMessage(
      adminChatId,
      [
        'Новое crypto-пополнение ожидает оплаты',
        `ID: ${topup.id}`,
        `Баланс к зачислению: $${topup.amount}`,
        `К оплате: ${payableAmount} ${walletPayOption.asset}`,
        `Сеть: ${walletPayOption.network}`,
        `Адрес: ${walletPayOption.address}`,
        `Пользователь Telegram: ${telegramUser?.username ? `@${telegramUser.username}` : telegramId}`,
        `Подтвердить после проверки: /confirmtopup ${topup.id}`,
      ].join('\n'),
    )
  }

  response.status(201).json({ topup })
})

app.post('/api/topups/paypage', async (request, response) => {
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

  const topup = {
    id: `top_${Date.now()}`,
    amount: normalizedAmount,
    status: 'payment_method_pending',
    paymentMethod: 'paypage',
    telegramUser,
    createdAt: new Date().toISOString(),
  }

  topups.unshift(topup)
  await saveStore()

  response.status(201).json({ topup, paymentPageUrl: `${webAppUrl.replace(/\/$/, '')}/pay/${topup.id}` })
})

app.post('/api/topups/:topupId/crypto', async (request, response) => {
  const topupId = request.params.topupId?.trim()
  const topup = topups.find((item) => item.id === topupId)

  if (!topup) {
    response.status(404).json({ error: 'Top-up not found' })
    return
  }

  if (!cryptoPayToken) {
    response.status(500).json({ error: 'CryptoBot token is not configured on Render' })
    return
  }

  if (topup.cryptoInvoice?.payUrl) {
    response.json({ topup, paymentUrl: topup.cryptoInvoice.payUrl })
    return
  }

  try {
    const invoice = await createCryptoInvoice({
      id: topup.id,
      amount: topup.amount,
      description: `OmniKey balance top-up: $${topup.amount}`,
    })

    topup.status = 'payment_pending'
    topup.paymentMethod = 'cryptobot'
    topup.cryptoInvoice = {
      id: invoice.invoice_id,
      status: invoice.status,
      payUrl: invoice.mini_app_invoice_url || invoice.web_app_invoice_url || invoice.bot_invoice_url || invoice.pay_url,
    }

    if (!topup.cryptoInvoice.payUrl) {
      response.status(502).json({ error: 'CryptoBot did not return a payment URL' })
      return
    }

    await saveStore()
    watchTopupPayment(topup)
    response.json({ topup, paymentUrl: topup.cryptoInvoice.payUrl })
  } catch (error) {
    topup.status = 'payment_error'
    console.error('CryptoBot top-up invoice failed', error)
    response.status(502).json({ error: error.message || 'Payment invoice creation failed' })
  }
})

app.post('/api/topups/:topupId/wallet', async (request, response) => {
  const topupId = request.params.topupId?.trim()
  const { networkId = 'ton' } = request.body ?? {}
  const topup = topups.find((item) => item.id === topupId)
  const walletPayOption = walletPayOptions.find((option) => option.id === networkId)

  if (!topup) {
    response.status(404).json({ error: 'Top-up not found' })
    return
  }

  if (!walletPayOption) {
    response.status(400).json({ error: 'Unsupported wallet payment network' })
    return
  }

  const uniquePart = (topups.filter((item) => item.status !== 'paid').length % 90) + 10
  const payableAmount = Number((topup.amount + uniquePart / 10000).toFixed(4))
  topup.status = 'wallet_pending'
  topup.paymentMethod = 'wallet'
  topup.walletPayment = {
    id: walletPayOption.id,
    label: walletPayOption.label,
    address: walletPayOption.address,
    network: walletPayOption.network,
    asset: walletPayOption.asset,
    payableAmount,
  }

  await saveStore()

  if (bot && adminChatId) {
    await bot.telegram.sendMessage(
      adminChatId,
      [
        'Новое wallet-пополнение ожидает оплаты',
        `ID: ${topup.id}`,
        `Баланс к зачислению: $${topup.amount}`,
        `К оплате: ${payableAmount} ${walletPayOption.asset}`,
        `Сеть: ${walletPayOption.network}`,
        `Адрес: ${walletPayOption.address}`,
        `Пользователь Telegram: ${topup.telegramUser?.username ? `@${topup.telegramUser.username}` : topup.telegramUser?.id || 'Не определен'}`,
        `Подтвердить после проверки: /confirmtopup ${topup.id}`,
      ].join('\n'),
    )
  }

  response.json({ topup })
})

app.post('/api/topups/:topupId/paid', async (request, response) => {
  const topupId = request.params.topupId?.trim()
  const topup = topups.find((item) => item.id === topupId)

  if (!topup) {
    response.status(404).json({ error: 'Top-up not found' })
    return
  }

  if (topup.paymentMethod !== 'wallet') {
    response.status(400).json({ error: 'Top-up is not a wallet payment' })
    return
  }

  if (topup.status !== 'paid') {
    topup.status = 'wallet_review'
    topup.markedPaidAt = new Date().toISOString()
    await saveStore()
  }

  if (bot && adminChatId) {
    await bot.telegram.sendMessage(
      adminChatId,
      [
        'Пользователь нажал "Я оплатил"',
        `ID: ${topup.id}`,
        `К оплате: ${topup.walletPayment?.payableAmount} ${topup.walletPayment?.asset}`,
        `Сеть: ${topup.walletPayment?.network}`,
        `Проверьте кошелек и подтвердите: /confirmtopup ${topup.id}`,
      ].join('\n'),
    )
  }

  response.json({ topup })
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
    if (topup.paymentMethod !== 'wallet') {
      await refreshTopupStatus(topup)
    }
  } catch (error) {
    console.error('CryptoBot top-up status check failed', error)
    response.status(502).json({ error: 'Payment status check failed' })
    return
  }

  response.json({ topup, balance: balances.get(telegramId) || 0 })
})

app.get('/api/topups/:topupId/payment', (request, response) => {
  const topupId = request.params.topupId?.trim()
  const topup = topups.find((item) => item.id === topupId)

  if (!topup) {
    response.status(404).json({ error: 'Payment not found' })
    return
  }

  response.json({
    id: topup.id,
    status: topup.status,
    amount: topup.amount,
    walletPayment: topup.walletPayment,
    walletPayments: walletPayOptions,
    cryptoPayAvailable: Boolean(cryptoPayToken),
    createdAt: topup.createdAt,
  })
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
  registerActivationKey(order.accessKey, telegramId, order.price, 'balance_order')
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

  function formatBotOrderDate(value, locale) {
    const date = new Date(value)

    if (Number.isNaN(date.getTime())) {
      return ''
    }

    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  function formatBotOrderPrice(price) {
    return `$${Number(price || 0).toFixed(2).replace(/\.00$/, '')}`
  }

  function formatBotOrders(userOrders, { locale, title, emptyText, dateLabel, priceLabel, codeLabel }) {
    if (!userOrders.length) {
      return `${title}\n\n${emptyText}`
    }

    const orderLines = userOrders.slice(0, 10).map((order, index) => {
      const lines = [
        `${index + 1}. ${order.productTitle || order.productId || 'Order'}`,
        `${priceLabel}: ${formatBotOrderPrice(order.price)}`,
      ]
      const orderDate = formatBotOrderDate(order.createdAt, locale)

      if (orderDate) {
        lines.push(`${dateLabel}: ${orderDate}`)
      }

      if (order.accessKey) {
        lines.push(`${codeLabel}: ${order.accessKey}`)
      }

      return lines.join('\n')
    })

    return [title, '', ...orderLines].join('\n\n')
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
      orders: (userOrders) => formatBotOrders(userOrders, {
        locale: 'ru-RU',
        title: '🧾 Мои покупки',
        emptyText: 'Пока что у вас нет заказов. Откройте каталог, чтобы его сделать.',
        dateLabel: 'Дата',
        priceLabel: 'Сумма',
        codeLabel: 'Код получения',
      }),
      promotions: [
        '🎁 Акции',
        '',
        'В честь открытия OmniKey Store 2 аккаунта Pro стоят $18 вместо двух по $20.',
        '',
        'Акция уже отмечена в карточках Claude Pro Duo и Cursor Pro Duo в каталоге.',
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
      orders: (userOrders) => formatBotOrders(userOrders, {
        locale: 'en-US',
        title: '🧾 My purchases',
        emptyText: 'You do not have any orders yet. Open the catalog to place one.',
        dateLabel: 'Date',
        priceLabel: 'Amount',
        codeLabel: 'Access code',
      }),
      promotions: [
        '🎁 Promotions',
        '',
        'Opening offer: 2 Pro accounts cost $18 instead of two at $20 each.',
        '',
        'The deal is already marked on Claude Pro Duo and Cursor Pro Duo in the catalog.',
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
      orders: (userOrders) => formatBotOrders(userOrders, {
        locale: 'zh-CN',
        title: '🧾 我的购买',
        emptyText: '你目前还没有订单。打开目录即可下单。',
        dateLabel: '日期',
        priceLabel: '金额',
        codeLabel: '领取码',
      }),
      promotions: [
        '🎁 优惠活动',
        '',
        '开业优惠：2 个 Pro 账号只需 $18，而不是两个各 $20。',
        '',
        '该优惠已在目录中的 Claude Pro Duo 和 Cursor Pro Duo 商品卡片中标注。',
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

  bot.command('confirmtopup', async (context) => {
    if (String(context.from.id) !== adminChatId) {
      await context.reply('Команда доступна только администратору.')
      return
    }

    const [, topupId] = context.message.text.trim().split(/\s+/)

    await refreshStore()

    const topup = topups.find((item) => item.id === topupId)

    if (!topup) {
      await context.reply('Пополнение не найдено. Использование: /confirmtopup <topup_id>')
      return
    }

    if (topup.status === 'paid') {
      await context.reply(`Пополнение ${topup.id} уже подтверждено.`)
      return
    }

    await creditTopup(topup)
    await context.reply(`Пополнение ${topup.id} подтверждено. Баланс зачислен.`)
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

    const telegramId = String(context.from?.id || '').trim()
    const userOrders = orders.filter((order) => String(order.telegramUser?.id || '').trim() === telegramId)

    await context.reply(botText[currentLanguage(context)].orders(userOrders))
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
  startKeepAlive()
})
