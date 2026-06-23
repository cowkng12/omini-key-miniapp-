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
  'kimi-k2': { title: 'Kimi K2 Access', price: 5 },
  'kimi-pro': { title: 'Kimi Pro Account', price: 8 },
  'kimi-api-pack': { title: 'Kimi API Pack', price: 5 },
  'you-pro': { title: 'You.com Pro', price: 7 },
  'phind-pro': { title: 'Phind Pro', price: 8 },
  'consensus-premium': { title: 'Consensus Premium', price: 8 },
  'elicit-plus': { title: 'Elicit Plus', price: 8 },
  'windsurf-pro': { title: 'Windsurf Pro', price: 10 },
  'replit-core': { title: 'Replit Core', price: 10 },
  'codeium-pro': { title: 'Codeium Pro', price: 8 },
  'lovable-pro': { title: 'Lovable Pro', price: 12 },
  'adobe-firefly': { title: 'Adobe Firefly', price: 8 },
  'ideogram-plus': { title: 'Ideogram Plus', price: 8 },
  'freepik-ai': { title: 'Freepik AI', price: 7 },
  'krea-ai': { title: 'Krea AI', price: 8 },
  'pika-pro': { title: 'Pika Pro', price: 10 },
  'hailuo-ai': { title: 'Hailuo AI', price: 8 },
  'luma-dream-machine': { title: 'Luma Dream Machine', price: 10 },
  'veo-access': { title: 'Veo Access', price: 12 },
  'udio-pro': { title: 'Udio Pro', price: 7 },
  'murf-ai': { title: 'Murf AI', price: 7 },
  'speechify-premium': { title: 'Speechify Premium', price: 8 },
  'playht-pro': { title: 'PlayHT Pro', price: 8 },
  'grammarly-pro': { title: 'Grammarly Pro', price: 7 },
  'quillbot-premium': { title: 'QuillBot Premium', price: 6 },
  'gamma-pro': { title: 'Gamma Pro', price: 8 },
  'openrouter-credits': { title: 'OpenRouter Credits', price: 5 },
}

const promoCodes = {
  OMNI50: { code: 'OMNI50', discountPercent: 50 },
  REF50: { code: 'REF50', discountPercent: 50, maxRedemptions: 50 },
  KIMI50: { code: 'KIMI50', discountPercent: 50 },
  OMNI20: { code: 'OMNI20', discountPercent: 20 },
  KIMI15: { code: 'KIMI15', discountPercent: 15 },
  START10: { code: 'START10', discountPercent: 10 },
}

const store = await loadStore()
const orders = store.orders
const topups = store.topups
const balances = new Map(Object.entries(store.balances))
const activations = store.activations
const refbotUsers = new Set(store.refbotUsers)
const promoRedemptions = store.promoRedemptions
const botUsers = store.botUsers
const referrals = store.referrals
const topupAmounts = [1, 1.5, ...Array.from({ length: 20 }, (_, index) => (index + 1) * 5)]
const issuedAccessKeys = new Set(Object.keys(activations))

function normalizeStore(rawStore = {}) {
  return {
    orders: Array.isArray(rawStore.orders) ? rawStore.orders : [],
    topups: Array.isArray(rawStore.topups) ? rawStore.topups : [],
    balances: rawStore.balances && typeof rawStore.balances === 'object' ? rawStore.balances : {},
    activations: rawStore.activations && typeof rawStore.activations === 'object' ? rawStore.activations : {},
    refbotUsers: Array.isArray(rawStore.refbotUsers) ? rawStore.refbotUsers : [],
    promoRedemptions: rawStore.promoRedemptions && typeof rawStore.promoRedemptions === 'object' ? rawStore.promoRedemptions : {},
    botUsers: rawStore.botUsers && typeof rawStore.botUsers === 'object' ? rawStore.botUsers : {},
    referrals: rawStore.referrals && typeof rawStore.referrals === 'object' ? rawStore.referrals : {},
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

    return { orders: [], topups: [], balances: {}, activations: {}, refbotUsers: [], promoRedemptions: {}, botUsers: {}, referrals: {} }
  }
}

async function saveStore() {
  const snapshot = { orders, topups, balances: Object.fromEntries(balances), activations, refbotUsers: Array.from(refbotUsers), promoRedemptions, botUsers, referrals }

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

  Object.keys(promoRedemptions).forEach((telegramId) => {
    delete promoRedemptions[telegramId]
  })
  Object.assign(promoRedemptions, freshStore.promoRedemptions)

  Object.keys(botUsers).forEach((telegramId) => {
    delete botUsers[telegramId]
  })
  Object.assign(botUsers, freshStore.botUsers)

  Object.keys(referrals).forEach((telegramId) => {
    delete referrals[telegramId]
  })
  Object.assign(referrals, freshStore.referrals)

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

function generateLoginCode() {
  return String(Math.floor(100000 + Math.random() * 900000))
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
      loginCode: generateLoginCode(),
    }
    activation.status = 'activated'
    activation.activatedAt = new Date().toISOString()
  }

  if (!activation.credentials.loginCode) {
    activation.credentials.loginCode = generateLoginCode()
  }

  return activation
}

const deliveryTexts = {
  ru: {
    purchaseTitle: 'Поздравляем с покупкой. Ваши данные для получения:',
    openSite: 'Зайдите на сайт',
    enterCode: 'Введите этот код',
    topupTitle: 'Оплата подтверждена. Ваш ключ для получения аккаунта:',
    activateOnSite: 'Активируйте ключ на сайте',
  },
  en: {
    purchaseTitle: 'Congratulations on your purchase. Your access details:',
    openSite: 'Open this website',
    enterCode: 'Enter this code',
    topupTitle: 'Payment confirmed. Your account access key:',
    activateOnSite: 'Activate the key on this website',
  },
  zh: {
    purchaseTitle: '恭喜购买成功。你的领取信息：',
    openSite: '打开网站',
    enterCode: '输入此代码',
    topupTitle: '付款已确认。你的账号领取密钥：',
    activateOnSite: '请在此网站激活密钥',
  },
}

function deliveryLanguage(language) {
  return deliveryTexts[language] ? language : 'ru'
}

function purchaseDeliveryMessage(accessKey, language = 'ru') {
  const text = deliveryTexts[deliveryLanguage(language)]

  return [
    text.purchaseTitle,
    '',
    `1. ${text.openSite}: ${activationSiteUrl}`,
    `2. ${text.enterCode}: ${accessKey}`,
  ].join('\n')
}

function accountDeliveryMessage(accessKey, language = 'ru') {
  const text = deliveryTexts[deliveryLanguage(language)]

  return [
    text.topupTitle,
    '',
    accessKey,
    '',
    `${text.activateOnSite}: ${activationSiteUrl}`,
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

function resolveTopupPromo({ promoCode, telegramId, amount }) {
  const normalizedCode = String(promoCode || '').trim().toUpperCase()

  if (!normalizedCode) {
    return null
  }

  const promo = promoCodes[normalizedCode]

  if (!promo) {
    throw new Error('Invalid promo code')
  }

  if (promoRedemptions[telegramId]?.includes(normalizedCode)) {
    throw new Error('Promo code has already been used')
  }

  if (promo.maxRedemptions && getPromoRedemptionCount(normalizedCode) >= promo.maxRedemptions) {
    throw new Error('Promo code activation limit reached')
  }

  const discountAmount = Number((amount * promo.discountPercent / 100).toFixed(2))
  const payableAmount = Number(Math.max(0.1, amount - discountAmount).toFixed(2))

  return {
    code: promo.code,
    discountPercent: promo.discountPercent,
    discountAmount,
    payableAmount,
  }
}

function getPromoRedemptionCount(promoCode) {
  return Object.values(promoRedemptions).filter((codes) => Array.isArray(codes) && codes.includes(promoCode)).length
}

function markPromoRedeemed(telegramId, promoCode) {
  if (!promoCode) {
    return
  }

  promoRedemptions[telegramId] = promoRedemptions[telegramId] || []

  if (!promoRedemptions[telegramId].includes(promoCode)) {
    promoRedemptions[telegramId].push(promoCode)
  }
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
  const creditedAmount = topup.amount
  const updatedBalance = Number((currentBalance + creditedAmount).toFixed(2))

  balances.set(telegramId, updatedBalance)
  topup.status = 'paid'
  topup.paidAt = new Date().toISOString()
  topup.creditedAmount = creditedAmount
  topup.balanceAfter = updatedBalance
  markPromoRedeemed(telegramId, topup.promo?.code)

  await saveStore()

  await bot?.telegram.sendMessage(
    telegramId,
    [`Баланс пополнен на $${creditedAmount}.`, `Текущий баланс: $${updatedBalance}.`].join('\n'),
  )

  if (bot && topup.amount >= accountDeliveryThreshold && refbotUsers.has(telegramId) && !topup.accountDataDelivered) {
    const activation = createActivation(telegramId, topup.amount)
    topup.activationKey = activation.key
    await bot.telegram.sendMessage(telegramId, accountDeliveryMessage(activation.key, topup.language))
    topup.accountDataDelivered = true
    await saveStore()
  }

  if (bot && adminChatId) {
    await bot.telegram.sendMessage(
      adminChatId,
      [
        'Баланс пополнен',
        `ID: ${topup.id}`,
        `Оплачено: $${topup.amount}`,
        `Зачислено: $${creditedAmount}`,
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
  const { amount, language, promoCode } = request.body ?? {}
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

  let promo = null

  try {
    promo = resolveTopupPromo({ promoCode, telegramId, amount: normalizedAmount })
  } catch (error) {
    response.status(400).json({ error: error.message })
    return
  }

  const topup = {
    id: `top_${Date.now()}`,
    amount: normalizedAmount,
    payableAmount: promo?.payableAmount || normalizedAmount,
    promo,
    status: cryptoPayToken ? 'payment_pending' : 'new',
    telegramUser,
    language: deliveryLanguage(language),
    createdAt: new Date().toISOString(),
  }

  try {
    const invoice = await createCryptoInvoice({
      id: topup.id,
      amount: topup.payableAmount,
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
  const { amount, networkId = 'ton', language, promoCode } = request.body ?? {}
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

  let promo = null

  try {
    promo = resolveTopupPromo({ promoCode, telegramId, amount: normalizedAmount })
  } catch (error) {
    response.status(400).json({ error: error.message })
    return
  }

  const uniquePart = (topups.filter((topup) => topup.status !== 'paid').length % 90) + 10
  const payableAmount = Number(((promo?.payableAmount || normalizedAmount) + uniquePart / 10000).toFixed(4))
  const topup = {
    id: `top_${Date.now()}`,
    amount: normalizedAmount,
    payableAmount,
    promo,
    status: 'wallet_pending',
    paymentMethod: 'wallet',
    telegramUser,
    language: deliveryLanguage(language),
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
  const { amount, language, promoCode } = request.body ?? {}
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

  let promo = null

  try {
    promo = resolveTopupPromo({ promoCode, telegramId, amount: normalizedAmount })
  } catch (error) {
    response.status(400).json({ error: error.message })
    return
  }

  const topup = {
    id: `top_${Date.now()}`,
    amount: normalizedAmount,
    payableAmount: promo?.payableAmount || normalizedAmount,
    promo,
    status: 'payment_method_pending',
    paymentMethod: 'paypage',
    telegramUser,
    language: deliveryLanguage(language),
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
      amount: topup.payableAmount || topup.amount,
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
  const payableAmount = Number(((topup.promo?.payableAmount || topup.amount) + uniquePart / 10000).toFixed(4))
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
    loginCode: activation.credentials.loginCode,
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
    payableAmount: topup.payableAmount || topup.amount,
    promo: topup.promo || null,
    walletPayment: topup.walletPayment,
    walletPayments: walletPayOptions,
    cryptoPayAvailable: Boolean(cryptoPayToken),
    createdAt: topup.createdAt,
  })
})

app.post('/api/orders/balance', async (request, response) => {
  const { productId, customer = {}, language } = request.body ?? {}
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
    language: deliveryLanguage(language),
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

  await bot?.telegram.sendMessage(telegramId, purchaseDeliveryMessage(order.accessKey, order.language))

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
  const pendingSupportUsers = new Set()

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
        '2. Пополните баланс на нужную вам сумму. Если есть промокод, введите его в окне пополнения.',
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
        'Kimi уже добавлен в каталог: Kimi K2, Kimi Pro и Kimi API Pack.',
      ].join('\n'),
      support: '🛠 Поддержка\n\nНапишите ваш вопрос или проблему следующим сообщением. Мы передадим обращение оператору.',
      supportReceived: 'Спасибо. Ваше обращение отправлено в поддержку.',
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
        '2. Top up your balance with the required amount. If you have a promo code, enter it in the top-up window.',
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
        'Kimi is now in the catalog: Kimi K2, Kimi Pro and Kimi API Pack.',
      ].join('\n'),
      support: '🛠 Support\n\nSend your question or problem in the next message. We will forward it to an operator.',
      supportReceived: 'Thank you. Your request has been sent to support.',
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
        '2. 按所需金额充值余额。如果有优惠码，请在充值窗口输入。',
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
        'Kimi 已加入目录：Kimi K2、Kimi Pro 和 Kimi API Pack。',
      ].join('\n'),
      support: '🛠 支持\n\n请在下一条消息中发送你的问题。我们会转交给客服。',
      supportReceived: '谢谢。你的请求已发送给支持团队。',
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

  function rememberBotUser(context, language = currentLanguage(context)) {
    if (!context.from?.id) {
      return
    }

    botUsers[String(context.from.id)] = {
      id: context.from.id,
      username: context.from.username || '',
      firstName: context.from.first_name || '',
      language,
      updatedAt: new Date().toISOString(),
    }
  }

  function promoBroadcastMessage(language) {
    const messages = {
      ru: [
        '🎁 Новые промокоды OmniKey',
        '',
        'OMNI50 - скидка 50% на оплату пополнения.',
        'REF50 - скидка 50% на оплату пополнения.',
        'KIMI50 - скидка 50% на оплату пополнения.',
        'OMNI20 - скидка 20% на оплату пополнения.',
        'KIMI15 - скидка 15% на оплату пополнения.',
        'START10 - скидка 10% на оплату пополнения.',
        '',
        'Открой каталог, нажми пополнение баланса и введи промокод в поле скидки.',
        '',
        'Также в каталоге появились Kimi K2, Kimi Pro и Kimi API Pack.',
      ],
      en: [
        '🎁 New OmniKey promo codes',
        '',
        'OMNI50 - 50% discount on top-up payment.',
        'REF50 - 50% discount on top-up payment.',
        'KIMI50 - 50% discount on top-up payment.',
        'OMNI20 - 20% discount on top-up payment.',
        'KIMI15 - 15% discount on top-up payment.',
        'START10 - 10% discount on top-up payment.',
        '',
        'Open the catalog, top up your balance and enter the promo code in the discount field.',
        '',
        'Kimi K2, Kimi Pro and Kimi API Pack are now in the catalog.',
      ],
      zh: [
        '🎁 OmniKey 新优惠码',
        '',
        'OMNI50 - 充值支付享 50% 折扣。',
        'REF50 - 充值支付享 50% 折扣。',
        'KIMI50 - 充值支付享 50% 折扣。',
        'OMNI20 - 充值支付享 20% 折扣。',
        'KIMI15 - 充值支付享 15% 折扣。',
        'START10 - 充值支付享 10% 折扣。',
        '',
        '打开目录，充值余额，并在折扣输入框中输入优惠码。',
        '',
        'Kimi K2、Kimi Pro 和 Kimi API Pack 已加入目录。',
      ],
    }

    return (messages[language] || messages.ru).join('\n')
  }

  function trackReferral(referrerId, referredUser) {
    const inviterId = String(referrerId || '').trim()
    const invitedId = String(referredUser?.id || '').trim()

    if (!inviterId || !invitedId || inviterId === invitedId) {
      return false
    }

    const alreadyInvited = Object.values(referrals).some((referral) => referral.invitedId === invitedId)

    if (alreadyInvited) {
      return false
    }

    referrals[`${inviterId}:${invitedId}`] = {
      referrerId: inviterId,
      invitedId,
      invitedUsername: referredUser.username || '',
      invitedFirstName: referredUser.first_name || '',
      createdAt: new Date().toISOString(),
    }

    return true
  }

  function referralStatsMessage() {
    const counts = Object.values(referrals).reduce((result, referral) => {
      result[referral.referrerId] = (result[referral.referrerId] || 0) + 1
      return result
    }, {})
    const leaders = Object.entries(counts)
      .sort((first, second) => second[1] - first[1])
      .slice(0, 20)

    if (!leaders.length) {
      return 'Рефералов в магазине пока нет.'
    }

    return [
      '📊 Рефералы магазина',
      '',
      ...leaders.map(([telegramId, count], index) => {
        const user = botUsers[telegramId]
        const name = user?.username ? `@${user.username}` : user?.firstName || telegramId
        return `${index + 1}. ${name} (${telegramId}) - ${count}`
      }),
    ].join('\n')
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
    rememberBotUser(context)

    if (context.startPayload?.startsWith('refbot_') && context.from?.id) {
      const referrerId = context.startPayload.slice('refbot_'.length)

      refbotUsers.add(String(context.from.id))
      trackReferral(referrerId, context.from)
      await saveStore()
    }

    await context.reply(
      'Выберите язык / Choose language / 选择语言',
      languageKeyboard,
    )
  })

  bot.command('shop', async (context) => {
    rememberBotUser(context)
    await saveStore()
    await sendMainMenuIfSubscribed(context, currentLanguage(context))
  })

  bot.command('myid', async (context) => {
    await context.reply(`Ваш Telegram ID: ${context.from.id}`)
  })

  bot.command('admin', async (context) => {
    if (String(context.from.id) !== adminChatId) {
      await context.reply('Команда доступна только администратору.')
      return
    }

    await context.reply([
      'Админ-команды OmniKey Store:',
      '',
      '/broadcastpromos - разослать промокоды всем пользователям бота',
      '/refstats - статистика, кто сколько людей пригласил',
      '/confirmtopup - подтвердить последнее неоплаченное пополнение',
      '/confirmtopup <topup_id> - подтвердить конкретное пополнение',
      '/setbalance <telegram_id> <amount> - установить баланс пользователю',
      '/myid - показать ваш Telegram ID',
    ].join('\n'))
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

    const topup = topupId
      ? topups.find((item) => item.id === topupId)
      : topups.find((item) => item.status !== 'paid')

    if (!topup) {
      await context.reply('Пополнение не найдено. Использование: /confirmtopup или /confirmtopup <topup_id>')
      return
    }

    if (topup.status === 'paid') {
      await context.reply(`Пополнение ${topup.id} уже подтверждено.`)
      return
    }

    await creditTopup(topup)
    await context.reply(`Пополнение ${topup.id} подтверждено. Баланс зачислен.`)
  })

  bot.command('broadcastpromos', async (context) => {
    if (String(context.from.id) !== adminChatId) {
      await context.reply('Команда доступна только администратору.')
      return
    }

    await refreshStore()

    const recipients = Object.values(botUsers)
    let sentCount = 0
    let failedCount = 0

    for (const recipient of recipients) {
      try {
        await bot.telegram.sendMessage(recipient.id, promoBroadcastMessage(recipient.language), mainKeyboard(recipient.language || 'ru'))
        sentCount += 1
      } catch (error) {
        failedCount += 1
        console.error('Promo broadcast failed', { telegramId: recipient.id, error: error?.message })
      }
    }

    await context.reply(`Рассылка промокодов завершена. Отправлено: ${sentCount}. Ошибок: ${failedCount}.`)
  })

  bot.command('refstats', async (context) => {
    if (String(context.from.id) !== adminChatId) {
      await context.reply('Команда доступна только администратору.')
      return
    }

    await refreshStore()
    await context.reply(referralStatsMessage())
  })

  bot.action('support', async (context) => {
    await safeAnswerCbQuery(context)
    pendingSupportUsers.add(context.from.id)
    await context.reply(botText[currentLanguage(context)].support)
  })

  bot.on('text', async (context, next) => {
    if (context.message.text.startsWith('/') || !pendingSupportUsers.has(context.from.id)) {
      return next()
    }

    pendingSupportUsers.delete(context.from.id)

    if (bot && adminChatId) {
      const from = context.from
      await bot.telegram.sendMessage(
        adminChatId,
        [
          'Новое обращение в поддержку OmniKey Store',
          `Пользователь: ${from.username ? `@${from.username}` : `${from.first_name || ''} ${from.last_name || ''}`.trim() || from.id}`,
          `ID: ${from.id}`,
          '',
          context.message.text,
        ].join('\n'),
      )
    }

    await context.reply(botText[currentLanguage(context)].supportReceived)
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
    rememberBotUser(context, language)
    await saveStore()
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
