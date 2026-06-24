import { useEffect, useState } from 'react'
import './App.css'

const products = [
  {
    id: 'chatgpt-plus-ready',
    group: 'ChatGPT',
    brand: 'ChatGPT',
    plan: 'Plus Ready Account',
    price: 1.5,
  },
  {
    id: 'chatgpt-go',
    group: 'ChatGPT',
    brand: 'ChatGPT',
    plan: 'Go',
    price: 2.5,
  },
  {
    id: 'chatgpt-pro-ready',
    group: 'ChatGPT',
    brand: 'ChatGPT',
    plan: 'Pro Ready Account',
    price: 60,
  },
  {
    id: 'chatgpt-business-seat',
    group: 'ChatGPT',
    brand: 'ChatGPT',
    plan: 'Business Seat',
    price: 15,
  },
  {
    id: 'grok-x-premium',
    group: 'Grok',
    brand: 'Grok',
    plan: 'X Premium',
    price: 4,
  },
  {
    id: 'grok-x-premium-plus',
    group: 'Grok',
    brand: 'Grok',
    plan: 'X Premium+',
    price: 20,
  },
  {
    id: 'supergrok',
    group: 'Grok',
    brand: 'Grok',
    plan: 'SuperGrok',
    price: 15,
  },
  {
    id: 'supergrok-heavy',
    group: 'Grok',
    brand: 'Grok',
    plan: 'SuperGrok Heavy',
    price: 150,
  },
  {
    id: 'claude-pro',
    group: 'Claude',
    brand: 'Claude',
    plan: 'Pro',
    price: 10,
  },
  {
    id: 'claude-pro-duo',
    group: 'Claude',
    brand: 'Claude',
    plan: '2 Accounts Pro',
    price: 18,
  },
  {
    id: 'claude-max',
    group: 'Claude',
    brand: 'Claude',
    plan: 'Max',
    price: 50,
  },
  {
    id: 'perplexity-pro',
    group: 'Perplexity',
    brand: 'Perplexity',
    plan: 'Pro',
    price: 10,
  },
  {
    id: 'gemini-pro',
    group: 'Gemini',
    brand: 'Gemini',
    plan: 'Pro',
    price: 5,
  },
  {
    id: 'gemini-advanced',
    group: 'Gemini',
    brand: 'Gemini',
    plan: 'Advanced',
    price: 10,
  },
  {
    id: 'gemini-ultra',
    group: 'Gemini',
    brand: 'Gemini',
    plan: 'Ultra',
    price: 15,
  },
  {
    id: 'gemini-workspace-business',
    group: 'Gemini',
    brand: 'Gemini',
    plan: 'Workspace Business',
    price: 10,
  },
  {
    id: 'gemini-workspace-enterprise',
    group: 'Gemini',
    brand: 'Gemini',
    plan: 'Workspace Enterprise',
    price: 15,
  },
  {
    id: 'gemini-api-pack',
    group: 'Gemini',
    brand: 'Gemini',
    plan: 'API Pack',
    price: 5,
  },
  {
    id: 'copilot-pro',
    group: 'Copilot',
    brand: 'Microsoft Copilot',
    plan: 'Pro',
    price: 10,
  },
  {
    id: 'cursor-pro',
    group: 'Cursor',
    brand: 'Cursor',
    plan: 'Pro',
    price: 10,
  },
  {
    id: 'cursor-pro-duo',
    group: 'Cursor',
    brand: 'Cursor',
    plan: '2 Accounts Pro',
    price: 18,
  },
  {
    id: 'cursor-ultra',
    group: 'Cursor',
    brand: 'Cursor',
    plan: 'Ultra',
    price: 100,
  },
  {
    id: 'midjourney-basic',
    group: 'Midjourney',
    brand: 'Midjourney',
    plan: 'Basic',
    price: 5,
  },
  {
    id: 'runway-standard',
    group: 'Runway',
    brand: 'Runway',
    plan: 'Standard',
    price: 7.5,
  },
  {
    id: 'suno-pro',
    group: 'Suno',
    brand: 'Suno',
    plan: 'Pro',
    price: 5,
  },
  {
    id: 'kling-ai',
    group: 'Kling',
    brand: 'Kling',
    plan: 'AI',
    price: 5,
  },
  {
    id: 'leonardo-ai',
    group: 'Leonardo AI',
    brand: 'Leonardo AI',
    plan: 'Pro',
    price: 6,
  },
  {
    id: 'elevenlabs-starter',
    group: 'ElevenLabs',
    brand: 'ElevenLabs',
    plan: 'Starter',
    price: 2.5,
  },
  {
    id: 'canva-pro',
    group: 'Canva',
    brand: 'Canva',
    plan: 'Pro',
    price: 7.5,
  },
  {
    id: 'notion-ai',
    group: 'Notion AI',
    brand: 'Notion AI',
    plan: 'Plus',
    price: 5,
  },
  {
    id: 'poe-subscription',
    group: 'Poe',
    brand: 'Poe',
    plan: 'Subscription',
    price: 10,
  },
  {
    id: 'kimi-k2',
    group: 'Kimi',
    brand: 'Kimi',
    plan: 'K2 Access',
    price: 5,
  },
  {
    id: 'kimi-pro',
    group: 'Kimi',
    brand: 'Kimi',
    plan: 'Pro Account',
    price: 8,
  },
  {
    id: 'kimi-api-pack',
    group: 'Kimi',
    brand: 'Kimi',
    plan: 'API Pack',
    price: 5,
  },
  { id: 'you-pro', group: 'Search', brand: 'You.com', plan: 'Pro', price: 7 },
  { id: 'phind-pro', group: 'Search', brand: 'Phind', plan: 'Pro', price: 8 },
  { id: 'consensus-premium', group: 'Search', brand: 'Consensus', plan: 'Premium', price: 8 },
  { id: 'elicit-plus', group: 'Search', brand: 'Elicit', plan: 'Plus', price: 8 },
  { id: 'windsurf-pro', group: 'Coding', brand: 'Windsurf', plan: 'Pro', price: 10 },
  { id: 'replit-core', group: 'Coding', brand: 'Replit', plan: 'Core', price: 10 },
  { id: 'codeium-pro', group: 'Coding', brand: 'Codeium', plan: 'Pro', price: 8 },
  { id: 'lovable-pro', group: 'Coding', brand: 'Lovable', plan: 'Pro', price: 12 },
  { id: 'adobe-firefly', group: 'Image', brand: 'Adobe Firefly', plan: 'Credits', price: 8 },
  { id: 'ideogram-plus', group: 'Image', brand: 'Ideogram', plan: 'Plus', price: 8 },
  { id: 'freepik-ai', group: 'Image', brand: 'Freepik AI', plan: 'Premium', price: 7 },
  { id: 'krea-ai', group: 'Image', brand: 'Krea AI', plan: 'Pro', price: 8 },
  { id: 'pika-pro', group: 'Video', brand: 'Pika', plan: 'Pro', price: 10 },
  { id: 'hailuo-ai', group: 'Video', brand: 'Hailuo AI', plan: 'Credits', price: 8 },
  { id: 'luma-dream-machine', group: 'Video', brand: 'Luma', plan: 'Dream Machine', price: 10 },
  { id: 'veo-access', group: 'Video', brand: 'Veo', plan: 'Access', price: 12 },
  { id: 'udio-pro', group: 'Voice', brand: 'Udio', plan: 'Pro', price: 7 },
  { id: 'murf-ai', group: 'Voice', brand: 'Murf AI', plan: 'Pro', price: 7 },
  { id: 'speechify-premium', group: 'Voice', brand: 'Speechify', plan: 'Premium', price: 8 },
  { id: 'playht-pro', group: 'Voice', brand: 'PlayHT', plan: 'Pro', price: 8 },
  { id: 'grammarly-pro', group: 'Productivity', brand: 'Grammarly', plan: 'Pro', price: 7 },
  { id: 'quillbot-premium', group: 'Productivity', brand: 'QuillBot', plan: 'Premium', price: 6 },
  { id: 'gamma-pro', group: 'Productivity', brand: 'Gamma', plan: 'Pro', price: 8 },
  { id: 'openrouter-credits', group: 'API', brand: 'OpenRouter', plan: 'Credits', price: 5 },
]

const sellerUsername = 'metifrysell'
const defaultApiBase = 'http://localhost:3001'
const languages = ['ru', 'en', 'zh']
const productGroups = ['Все', 'ChatGPT', 'Grok', 'Claude', 'Cursor', 'Kimi', 'Search', 'Coding', 'Image', 'Video', 'Voice', 'Productivity', 'API', 'Perplexity', 'Gemini', 'Copilot', 'Midjourney', 'Runway', 'Suno', 'Kling', 'Leonardo AI', 'ElevenLabs', 'Canva', 'Notion AI', 'Poe']
const topupAmounts = [1, 1.5, ...Array.from({ length: 20 }, (_, index) => (index + 1) * 5)]
const productAvatars = {
  ChatGPT: { src: 'https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128', fallback: 'GPT' },
  Grok: { src: 'https://www.google.com/s2/favicons?domain=x.com&sz=128', fallback: 'X' },
  Claude: { src: 'https://www.google.com/s2/favicons?domain=claude.ai&sz=128', fallback: 'CL' },
  Cursor: { src: 'https://www.google.com/s2/favicons?domain=cursor.com&sz=128', fallback: 'CR' },
  Perplexity: { src: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128', fallback: 'PX' },
  Gemini: { src: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128', fallback: 'GM' },
  Copilot: { src: 'https://www.google.com/s2/favicons?domain=copilot.microsoft.com&sz=128', fallback: 'CP' },
  Midjourney: { src: 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=128', fallback: 'MJ' },
  Runway: { src: 'https://www.google.com/s2/favicons?domain=runwayml.com&sz=128', fallback: 'RW' },
  Suno: { src: 'https://www.google.com/s2/favicons?domain=suno.com&sz=128', fallback: 'SN' },
  Kling: { src: 'https://www.google.com/s2/favicons?domain=klingai.com&sz=128', fallback: 'KG' },
  'Leonardo AI': { src: 'https://www.google.com/s2/favicons?domain=leonardo.ai&sz=128', fallback: 'LD' },
  ElevenLabs: { src: 'https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128', fallback: 'EL' },
  Canva: { src: 'https://www.google.com/s2/favicons?domain=canva.com&sz=128', fallback: 'CV' },
  'Notion AI': { src: 'https://www.google.com/s2/favicons?domain=notion.so&sz=128', fallback: 'NT' },
  Poe: { src: 'https://www.google.com/s2/favicons?domain=poe.com&sz=128', fallback: 'PO' },
  Kimi: { src: 'https://www.google.com/s2/favicons?domain=kimi.moonshot.cn&sz=128', fallback: 'KM' },
  Search: { src: 'https://www.google.com/s2/favicons?domain=you.com&sz=128', fallback: 'SE' },
  Coding: { src: 'https://www.google.com/s2/favicons?domain=windsurf.com&sz=128', fallback: 'CD' },
  Image: { src: 'https://www.google.com/s2/favicons?domain=firefly.adobe.com&sz=128', fallback: 'IM' },
  Video: { src: 'https://www.google.com/s2/favicons?domain=pika.art&sz=128', fallback: 'VD' },
  Voice: { src: 'https://www.google.com/s2/favicons?domain=udio.com&sz=128', fallback: 'VO' },
  Productivity: { src: 'https://www.google.com/s2/favicons?domain=grammarly.com&sz=128', fallback: 'PR' },
  API: { src: 'https://www.google.com/s2/favicons?domain=openrouter.ai&sz=128', fallback: 'API' },
}

const promoBonuses = {
  SUBS200: 25,
  OMNI20: 20,
  KIMI15: 15,
  START10: 10,
}

const translations = {
  ru: {
    languageLabel: 'RU',
    eyebrow: 'OmniKey',
    title: 'OmniKey: подписки на нейросервисы',
    hero: 'Выберите товар и подайте заявку на покупку.',
    selectPlan: 'Выбрать тариф',
    guarantee: 'Полная гарантия и возможность замены товара при возникновении проблем.',
    promos: {
      'claude-pro-duo': 'Промо-лот: 2 аккаунта Pro — $18',
      'cursor-pro-duo': 'Промо-лот: 2 аккаунта Pro — $18',
    },
    orderTitle: 'Ваш заказ',
    name: 'Имя',
    namePlaceholder: 'Как к вам обращаться',
    telegramPlaceholder: '@username или ссылка',
    buyButton: 'Подать заявку на покупку',
    hint: `Для покупки отпишите продавцу: @${sellerUsername}.`,
    success: 'Заявка отправлена. В течение 5 минут с вами свяжется менеджер, ожидайте.',
    error: 'Не удалось отправить заявку. Проверь backend и попробуй снова.',
    allGroup: 'Все',
    tabs: { catalog: 'Каталог', orders: 'Заказы' },
    ordersTitle: 'Мои покупки',
    ordersText: 'Пока вы не совершили ни одной покупки.',
    balanceTitle: 'Баланс',
    balanceText: 'Пока что вы не пополняли баланс.',
    topUpTitle: 'Пополнить баланс',
    topUpHint: 'Выберите сумму пополнения баланса.',
    promoCodeLabel: 'Промокод на скидку',
    topUpButton: 'Оплатить',
    walletTopUpButton: 'Оплата на кошелек',
    walletMethod: 'Криптокошелек',
    walletPaidButton: 'Я оплатил',
    walletPayReview: 'Заявка отправлена. Мы проверим транзакцию и зачислим баланс.',
    walletNotConfigured: 'Оплата на кошелек пока не настроена.',
    walletNetwork: 'Сеть оплаты',
    confirmPurchase: ({ product, price }) => `Подтвердить покупку ${product} за $${price}?`,
    topUpSuccess: 'Успешно, в течении 10-и минут вам напишет менеджер, чтобы выдать товар. Ожидайте.',
    topUpError: 'Не удалось создать ссылку на оплату. Попробуйте позже.',
    telegramUserRequired: 'Откройте приложение через кнопку бота в Telegram и попробуйте снова.',
    paymentTitle: 'К оплате',
    paymentMethods: 'Способы оплаты',
    cryptoBotMethod: 'Crypto Bot',
    payBalanceButton: 'Оплатить с баланса',
    balanceMethod: 'Баланс',
    balancePaymentSuccess: 'Заказ оплачен с баланса. Данные отправлены вам в бот.',
    balancePaymentError: 'Не удалось оплатить с баланса. Проверьте баланс и попробуйте позже.',
    productPaymentError: 'Не удалось создать оплату товара. Попробуйте позже.',
    productText: {
      'claude-pro': ['Готовый аккаунт', 'Готовый аккаунт Claude Pro для повседневной работы, учебы и текста.'],
      'chatgpt-plus-ready': ['Готовый аккаунт', 'ChatGPT Plus на готовом аккаунте для быстрых задач и общения.'],
      'chatgpt-go': ['Готовый аккаунт', 'Готовый аккаунт ChatGPT Go для большего количества сообщений и файлов.'],
      'chatgpt-pro-ready': ['Готовый аккаунт', 'Готовый аккаунт ChatGPT Pro для максимальных лимитов и интенсивной работы.'],
      'chatgpt-business-seat': ['Готовый аккаунт', 'Готовый аккаунт ChatGPT Business для работы, команды и приватности.'],
      'grok-x-premium': ['Готовый аккаунт', 'Готовый аккаунт Grok через X Premium для быстрых задач.'],
      'grok-x-premium-plus': ['Готовый аккаунт', 'Готовый аккаунт Grok через X Premium+ с большим запасом лимитов.'],
      'supergrok': ['Готовый аккаунт', 'Готовый аккаунт SuperGrok с расширенными возможностями.'],
      'supergrok-heavy': ['Готовый аккаунт', 'Готовый аккаунт SuperGrok Heavy для самых высоких лимитов.'],
      'claude-pro-duo': ['2 аккаунта Pro', 'Два готовых аккаунта Claude Pro по спеццене.'],
      'claude-max': ['Готовый аккаунт', 'Готовый аккаунт Claude Max для активной ежедневной нагрузки.'],
      'perplexity-pro': ['Готовый аккаунт', 'Готовый аккаунт Perplexity Pro для ресерча и быстрых ответов с источниками.'],
      'gemini-pro': ['Готовый аккаунт', 'Готовый аккаунт Gemini Pro для текстов, учебы и быстрых задач.'],
      'gemini-advanced': ['Готовый аккаунт', 'Готовый аккаунт Gemini Advanced для текста, анализа, учебы и идей.'],
      'gemini-ultra': ['Готовый аккаунт', 'Готовый аккаунт Gemini Ultra для сложных задач, анализа и креатива.'],
      'gemini-workspace-business': ['Готовый аккаунт', 'Готовый аккаунт Gemini Workspace для Gmail, Docs, Sheets и Google.'],
      'gemini-workspace-enterprise': ['Готовый аккаунт', 'Готовый аккаунт Gemini Workspace Enterprise для команд и бизнеса.'],
      'gemini-api-pack': ['Готовый доступ', 'Готовый доступ Gemini API для тестов, интеграций и разработки.'],
      'copilot-pro': ['Готовый аккаунт', 'Готовый аккаунт Copilot Pro для документов, работы и AI-помощника.'],
      'cursor-pro': ['Готовый аккаунт', 'Готовый аккаунт Cursor Pro для регулярной разработки.'],
      'cursor-pro-duo': ['2 аккаунта Pro', 'Два готовых аккаунта Cursor Pro по спеццене.'],
      'cursor-ultra': ['Готовый аккаунт', 'Готовый аккаунт Cursor Ultra для большего запаса лимитов.'],
      'midjourney-basic': ['Готовый аккаунт', 'Готовый аккаунт Midjourney для генерации изображений и дизайна.'],
      'runway-standard': ['Готовый аккаунт', 'Готовый аккаунт Runway для AI-видео, монтажа и коротких роликов.'],
      'suno-pro': ['Готовый аккаунт', 'Готовый аккаунт Suno Pro для песен, битов и музыкальных идей.'],
      'kling-ai': ['Готовый аккаунт', 'Готовый аккаунт Kling AI для генерации и оживления видео.'],
      'leonardo-ai': ['Готовый аккаунт', 'Готовый аккаунт Leonardo AI для артов, визуалов и дизайна.'],
      'elevenlabs-starter': ['Готовый аккаунт', 'Готовый аккаунт ElevenLabs для озвучки, голосов и речи.'],
      'canva-pro': ['Готовый аккаунт', 'Готовый аккаунт Canva Pro для шаблонов, презентаций и дизайна.'],
      'notion-ai': ['Готовый аккаунт', 'Готовый аккаунт Notion AI для заметок, документов и рабочих баз.'],
      'poe-subscription': ['Готовый аккаунт', 'Готовый аккаунт Poe для доступа к разным AI-моделям.'],
      'kimi-k2': ['Готовый доступ', 'Готовый доступ Kimi K2 для длинного контекста, текста и ресерча.'],
      'kimi-pro': ['Готовый аккаунт', 'Готовый аккаунт Kimi Pro для ежедневной работы и анализа.'],
      'kimi-api-pack': ['Готовый доступ', 'Готовый доступ Kimi API для тестов, ботов и интеграций.'],
      'you-pro': ['AI-поиск', 'You.com Pro для поиска, ответов с источниками и ресерча.'],
      'phind-pro': ['AI-поиск', 'Phind Pro для технических вопросов, кода и документации.'],
      'consensus-premium': ['AI-поиск', 'Consensus Premium для научных источников и исследований.'],
      'elicit-plus': ['AI-поиск', 'Elicit Plus для анализа статей и академического ресерча.'],
      'windsurf-pro': ['AI-кодинг', 'Windsurf Pro для разработки, автодополнения и агентских задач.'],
      'replit-core': ['AI-кодинг', 'Replit Core для облачной разработки и быстрых прототипов.'],
      'codeium-pro': ['AI-кодинг', 'Codeium Pro для автодополнения и помощи в IDE.'],
      'lovable-pro': ['AI-кодинг', 'Lovable Pro для быстрого создания веб-приложений.'],
      'adobe-firefly': ['AI-дизайн', 'Adobe Firefly для генерации изображений и дизайна.'],
      'ideogram-plus': ['AI-дизайн', 'Ideogram Plus для постеров, логотипов и текста на изображениях.'],
      'freepik-ai': ['AI-дизайн', 'Freepik AI для шаблонов, картинок и маркетинговых материалов.'],
      'krea-ai': ['AI-дизайн', 'Krea AI для визуалов, апскейла и генерации изображений.'],
      'pika-pro': ['AI-видео', 'Pika Pro для генерации и оживления видео.'],
      'hailuo-ai': ['AI-видео', 'Hailuo AI для коротких роликов и видео-идей.'],
      'luma-dream-machine': ['AI-видео', 'Luma Dream Machine для кинематографичных AI-видео.'],
      'veo-access': ['AI-видео', 'Veo Access для генерации видео по текстовым промптам.'],
      'udio-pro': ['AI-аудио', 'Udio Pro для генерации песен и музыкальных идей.'],
      'murf-ai': ['AI-аудио', 'Murf AI для озвучки, дикторов и презентаций.'],
      'speechify-premium': ['AI-аудио', 'Speechify Premium для чтения текстов голосом.'],
      'playht-pro': ['AI-аудио', 'PlayHT Pro для реалистичной AI-озвучки.'],
      'grammarly-pro': ['Продуктивность', 'Grammarly Pro для английских текстов, писем и правок.'],
      'quillbot-premium': ['Продуктивность', 'QuillBot Premium для перефразирования и улучшения текста.'],
      'gamma-pro': ['Продуктивность', 'Gamma Pro для презентаций и лендингов на AI.'],
      'openrouter-credits': ['API-доступ', 'OpenRouter Credits для доступа к разным AI-моделям через API.'],
    },
  },
  en: {
    languageLabel: 'EN',
    eyebrow: 'OmniKey',
    title: 'OmniKey: AI service subscriptions',
    hero: 'Choose a product and submit a purchase request.',
    selectPlan: 'Select plan',
    guarantee: 'Full guarantee and replacement if any issues arise.',
    promos: {
      'claude-pro-duo': 'Promo lot: 2 Accounts Pro — $18',
      'cursor-pro-duo': 'Promo lot: 2 Accounts Pro — $18',
    },
    orderTitle: 'Your order',
    name: 'Name',
    namePlaceholder: 'How should we call you',
    telegramPlaceholder: '@username or link',
    buyButton: 'Submit purchase request',
    hint: `To buy, message the seller: @${sellerUsername}.`,
    success: 'Request sent. A manager will contact you within 5 minutes, please wait.',
    error: 'Could not send the request. Check backend and try again.',
    allGroup: 'All',
    tabs: { catalog: 'Catalog', orders: 'Orders' },
    ordersTitle: 'My purchases',
    ordersText: 'You have not made any purchases yet.',
    balanceTitle: 'Balance',
    balanceText: 'You have not topped up your balance yet.',
    topUpTitle: 'Top up balance',
    topUpHint: 'Choose a balance top-up amount.',
    promoCodeLabel: 'Discount promo code',
    topUpButton: 'Pay',
    walletTopUpButton: 'Wallet payment',
    walletMethod: 'Crypto wallet',
    walletPaidButton: 'I paid',
    walletPayReview: 'Request sent. We will verify the transaction and credit your balance.',
    walletNotConfigured: 'Wallet payments are not configured yet.',
    walletNetwork: 'Payment network',
    confirmPurchase: ({ product, price }) => `Confirm purchase of ${product} for $${price}?`,
    topUpSuccess: 'Success. A manager will message you within 10 minutes to deliver the product. Please wait.',
    topUpError: 'Could not create a payment link. Try again later.',
    telegramUserRequired: 'Open the app through the bot button in Telegram and try again.',
    paymentTitle: 'To pay',
    paymentMethods: 'Payment methods',
    cryptoBotMethod: 'Crypto Bot',
    payBalanceButton: 'Pay from balance',
    balanceMethod: 'Balance',
    balancePaymentSuccess: 'Order paid from balance. Access details were sent to you in the bot.',
    balancePaymentError: 'Could not pay from balance. Check your balance and try later.',
    productPaymentError: 'Could not create product payment. Try again later.',
    productText: {
      'claude-pro': ['Ready account', 'Ready Claude Pro account for daily work, study and writing.'],
      'chatgpt-plus-ready': ['Ready account', 'ChatGPT Plus on a ready account for quick tasks and conversations.'],
      'chatgpt-go': ['Ready account', 'Ready ChatGPT Go account for more messages and file uploads.'],
      'chatgpt-pro-ready': ['Ready account', 'Ready ChatGPT Pro account for maximum limits and intensive work.'],
      'chatgpt-business-seat': ['Ready account', 'Ready ChatGPT Business account for work, teams and privacy.'],
      'grok-x-premium': ['Ready account', 'Ready Grok account through X Premium for quick tasks.'],
      'grok-x-premium-plus': ['Ready account', 'Ready Grok account through X Premium+ with higher limits.'],
      'supergrok': ['Ready account', 'Ready SuperGrok account with expanded capabilities.'],
      'supergrok-heavy': ['Ready account', 'Ready SuperGrok Heavy account for the highest limits.'],
      'claude-pro-duo': ['2 Accounts Pro', 'Two ready Claude Pro accounts at a special price.'],
      'claude-max': ['Ready account', 'Ready Claude Max account for heavy daily usage.'],
      'perplexity-pro': ['Ready account', 'Ready Perplexity Pro account for research and answers with sources.'],
      'gemini-pro': ['Ready account', 'Ready Gemini Pro account for writing, study and quick tasks.'],
      'gemini-advanced': ['Ready account', 'Ready Gemini Advanced account for writing, analysis, study and ideas.'],
      'gemini-ultra': ['Ready account', 'Ready Gemini Ultra account for complex tasks, analysis and creative work.'],
      'gemini-workspace-business': ['Ready account', 'Ready Gemini Workspace account for Gmail, Docs, Sheets and Google.'],
      'gemini-workspace-enterprise': ['Ready account', 'Ready Gemini Workspace Enterprise account for teams and business.'],
      'gemini-api-pack': ['Ready access', 'Ready Gemini API access for tests, integrations and development.'],
      'copilot-pro': ['Ready account', 'Ready Copilot Pro account for documents, work and AI assistance.'],
      'cursor-pro': ['Ready account', 'Ready Cursor Pro account for regular development work.'],
      'cursor-pro-duo': ['2 Accounts Pro', 'Two ready Cursor Pro accounts at a special price.'],
      'cursor-ultra': ['Ready account', 'Ready Cursor Ultra account with more limits.'],
      'midjourney-basic': ['Ready account', 'Ready Midjourney account for image generation and design.'],
      'runway-standard': ['Ready account', 'Ready Runway account for AI video, editing and short clips.'],
      'suno-pro': ['Ready account', 'Ready Suno Pro account for songs, beats and music ideas.'],
      'kling-ai': ['Ready account', 'Ready Kling AI account for video generation and animation.'],
      'leonardo-ai': ['Ready account', 'Ready Leonardo AI account for art, visuals and design.'],
      'elevenlabs-starter': ['Ready account', 'Ready ElevenLabs account for voiceover, voices and speech.'],
      'canva-pro': ['Ready account', 'Ready Canva Pro account for templates, presentations and design.'],
      'notion-ai': ['Ready account', 'Ready Notion AI account for notes, docs and workspaces.'],
      'poe-subscription': ['Ready account', 'Ready Poe account for access to multiple AI models.'],
      'kimi-k2': ['Ready access', 'Ready Kimi K2 access for long context, writing and research.'],
      'kimi-pro': ['Ready account', 'Ready Kimi Pro account for daily work and analysis.'],
      'kimi-api-pack': ['Ready access', 'Ready Kimi API access for tests, bots and integrations.'],
      'you-pro': ['AI search', 'You.com Pro for search, sourced answers and research.'],
      'phind-pro': ['AI search', 'Phind Pro for technical questions, code and docs.'],
      'consensus-premium': ['AI search', 'Consensus Premium for scientific sources and studies.'],
      'elicit-plus': ['AI search', 'Elicit Plus for papers, summaries and academic research.'],
      'windsurf-pro': ['AI coding', 'Windsurf Pro for development, autocomplete and agent tasks.'],
      'replit-core': ['AI coding', 'Replit Core for cloud development and quick prototypes.'],
      'codeium-pro': ['AI coding', 'Codeium Pro for IDE autocomplete and coding help.'],
      'lovable-pro': ['AI coding', 'Lovable Pro for building web apps quickly.'],
      'adobe-firefly': ['AI design', 'Adobe Firefly for image generation and design.'],
      'ideogram-plus': ['AI design', 'Ideogram Plus for posters, logos and text in images.'],
      'freepik-ai': ['AI design', 'Freepik AI for templates, images and marketing assets.'],
      'krea-ai': ['AI design', 'Krea AI for visuals, upscaling and image generation.'],
      'pika-pro': ['AI video', 'Pika Pro for generating and animating video.'],
      'hailuo-ai': ['AI video', 'Hailuo AI for short clips and video ideas.'],
      'luma-dream-machine': ['AI video', 'Luma Dream Machine for cinematic AI videos.'],
      'veo-access': ['AI video', 'Veo Access for text-to-video generation.'],
      'udio-pro': ['AI audio', 'Udio Pro for songs and music ideas.'],
      'murf-ai': ['AI audio', 'Murf AI for voiceovers, narrators and presentations.'],
      'speechify-premium': ['AI audio', 'Speechify Premium for text-to-speech reading.'],
      'playht-pro': ['AI audio', 'PlayHT Pro for realistic AI voiceovers.'],
      'grammarly-pro': ['Productivity', 'Grammarly Pro for English writing, emails and edits.'],
      'quillbot-premium': ['Productivity', 'QuillBot Premium for paraphrasing and improving text.'],
      'gamma-pro': ['Productivity', 'Gamma Pro for AI presentations and landing pages.'],
      'openrouter-credits': ['API access', 'OpenRouter Credits for using multiple AI models via API.'],
    },
  },
  zh: {
    languageLabel: '中文',
    eyebrow: 'OmniKey',
    title: 'OmniKey：AI 服务订阅',
    hero: '选择商品并提交购买申请。',
    selectPlan: '选择套餐',
    guarantee: '提供完整保障，如遇问题可更换商品。',
    promos: {
      'claude-pro-duo': '优惠商品：2 个 Pro 账号 — $18',
      'cursor-pro-duo': '优惠商品：2 个 Pro 账号 — $18',
    },
    orderTitle: '你的订单',
    name: '姓名',
    namePlaceholder: '如何称呼你',
    telegramPlaceholder: '@用户名或链接',
    buyButton: '提交购买申请',
    hint: `购买请联系卖家：@${sellerUsername}。`,
    success: '申请已提交。经理将在 5 分钟内联系你，请稍候。',
    error: '请求发送失败。请检查后端并重试。',
    allGroup: '全部',
    tabs: { catalog: '目录', orders: '订单' },
    ordersTitle: '我的购买',
    ordersText: '你还没有任何购买记录。',
    balanceTitle: '余额',
    balanceText: '你还没有充值余额。',
    topUpTitle: '充值余额',
    topUpHint: '选择余额充值金额。',
    promoCodeLabel: '折扣优惠码',
    topUpButton: '支付',
    walletTopUpButton: '钱包支付',
    walletMethod: '加密钱包',
    walletPaidButton: '我已付款',
    walletPayReview: '请求已发送。我们会检查交易并充值余额。',
    walletNotConfigured: '钱包支付尚未配置。',
    walletNetwork: '支付网络',
    confirmPurchase: ({ product, price }) => `确认以 $${price} 购买 ${product}？`,
    topUpSuccess: '支付成功。经理会在 10 分钟内联系你并发放商品，请稍候。',
    topUpError: '无法创建付款链接。请稍后再试。',
    telegramUserRequired: '请通过 Telegram 机器人的按钮打开应用后重试。',
    paymentTitle: '应付金额',
    paymentMethods: '支付方式',
    cryptoBotMethod: 'Crypto Bot',
    payBalanceButton: '用余额支付',
    balanceMethod: '余额',
    balancePaymentSuccess: '订单已用余额支付。访问数据已通过机器人发送给你。',
    balancePaymentError: '无法用余额支付。请检查余额后稍后再试。',
    productPaymentError: '无法创建商品付款。请稍后再试。',
    productText: {
      'claude-pro': ['现成账号', '现成 Claude Pro 账号，适合日常工作、学习和写作。'],
      'chatgpt-plus-ready': ['现成账号', '现成 ChatGPT Plus 账号，适合快速任务和聊天。'],
      'chatgpt-go': ['现成账号', '现成 ChatGPT Go 账号，适合更多消息和文件上传。'],
      'chatgpt-pro-ready': ['现成账号', '现成 ChatGPT Pro 账号，适合最高额度和高强度使用。'],
      'chatgpt-business-seat': ['现成账号', '现成 ChatGPT Business 账号，适合工作、团队和隐私需求。'],
      'grok-x-premium': ['现成账号', '现成 Grok 账号，通过 X Premium 使用。'],
      'grok-x-premium-plus': ['现成账号', '现成 Grok 账号，通过 X Premium+ 获得更高额度。'],
      'supergrok': ['现成账号', '现成 SuperGrok 账号，提供扩展功能。'],
      'supergrok-heavy': ['现成账号', '现成 SuperGrok Heavy 账号，适合最高额度需求。'],
      'claude-pro-duo': ['2 个 Pro 账号', '两个现成 Claude Pro 账号，价格更划算。'],
      'claude-max': ['现成账号', '现成 Claude Max 账号，适合高频日常使用。'],
      'perplexity-pro': ['现成账号', '现成 Perplexity Pro 账号，适合研究和带来源回答。'],
      'gemini-pro': ['现成账号', '现成 Gemini Pro 账号，适合写作、学习和快速任务。'],
      'gemini-advanced': ['现成账号', '现成 Gemini Advanced 账号，适合写作、分析、学习和想法。'],
      'gemini-ultra': ['现成账号', '现成 Gemini Ultra 账号，适合复杂任务、分析和创意工作。'],
      'gemini-workspace-business': ['现成账号', '现成 Gemini Workspace 账号，适合 Gmail、Docs、Sheets 和 Google。'],
      'gemini-workspace-enterprise': ['现成账号', '现成 Gemini Workspace Enterprise 账号，适合团队和业务。'],
      'gemini-api-pack': ['现成访问', '现成 Gemini API 访问，适合测试、集成和开发。'],
      'copilot-pro': ['现成账号', '现成 Copilot Pro 账号，适合文档、工作和 AI 辅助。'],
      'cursor-pro': ['现成账号', '现成 Cursor Pro 账号，适合日常开发。'],
      'cursor-pro-duo': ['2 个 Pro 账号', '两个现成 Cursor Pro 账号，价格更优惠。'],
      'cursor-ultra': ['现成账号', '现成 Cursor Ultra 账号，提供更多额度。'],
      'midjourney-basic': ['现成账号', '现成 Midjourney 账号，适合图片生成和设计。'],
      'runway-standard': ['现成账号', '现成 Runway 账号，适合 AI 视频、剪辑和短片。'],
      'suno-pro': ['现成账号', '现成 Suno Pro 账号，适合歌曲、节拍和音乐灵感。'],
      'kling-ai': ['现成账号', '现成 Kling AI 账号，适合视频生成和动画。'],
      'leonardo-ai': ['现成账号', '现成 Leonardo AI 账号，适合艺术、视觉和设计。'],
      'elevenlabs-starter': ['现成账号', '现成 ElevenLabs 账号，适合配音、声音和语音。'],
      'canva-pro': ['现成账号', '现成 Canva Pro 账号，适合模板、演示和设计。'],
      'notion-ai': ['现成账号', '现成 Notion AI 账号，适合笔记、文档和工作区。'],
      'poe-subscription': ['现成账号', '现成 Poe 账号，可访问多种 AI 模型。'],
      'kimi-k2': ['现成访问', '现成 Kimi K2 访问，适合长上下文、写作和研究。'],
      'kimi-pro': ['现成账号', '现成 Kimi Pro 账号，适合日常工作和分析。'],
      'kimi-api-pack': ['现成访问', '现成 Kimi API 访问，适合测试、机器人和集成。'],
      'you-pro': ['AI 搜索', 'You.com Pro，适合搜索、带来源回答和研究。'],
      'phind-pro': ['AI 搜索', 'Phind Pro，适合技术问题、代码和文档。'],
      'consensus-premium': ['AI 搜索', 'Consensus Premium，适合科学资料和论文研究。'],
      'elicit-plus': ['AI 搜索', 'Elicit Plus，适合论文分析和学术研究。'],
      'windsurf-pro': ['AI 编程', 'Windsurf Pro，适合开发、补全和代理任务。'],
      'replit-core': ['AI 编程', 'Replit Core，适合云端开发和快速原型。'],
      'codeium-pro': ['AI 编程', 'Codeium Pro，适合 IDE 补全和代码辅助。'],
      'lovable-pro': ['AI 编程', 'Lovable Pro，适合快速构建网页应用。'],
      'adobe-firefly': ['AI 设计', 'Adobe Firefly，适合图片生成和设计。'],
      'ideogram-plus': ['AI 设计', 'Ideogram Plus，适合海报、Logo 和图片文字。'],
      'freepik-ai': ['AI 设计', 'Freepik AI，适合模板、图片和营销素材。'],
      'krea-ai': ['AI 设计', 'Krea AI，适合视觉、放大和图片生成。'],
      'pika-pro': ['AI 视频', 'Pika Pro，适合生成和动画视频。'],
      'hailuo-ai': ['AI 视频', 'Hailuo AI，适合短视频和创意视频。'],
      'luma-dream-machine': ['AI 视频', 'Luma Dream Machine，适合电影感 AI 视频。'],
      'veo-access': ['AI 视频', 'Veo Access，适合文本生成视频。'],
      'udio-pro': ['AI 音频', 'Udio Pro，适合歌曲和音乐创意。'],
      'murf-ai': ['AI 音频', 'Murf AI，适合配音、旁白和演示。'],
      'speechify-premium': ['AI 音频', 'Speechify Premium，适合文本转语音朗读。'],
      'playht-pro': ['AI 音频', 'PlayHT Pro，适合真实感 AI 配音。'],
      'grammarly-pro': ['效率工具', 'Grammarly Pro，适合英文写作、邮件和修改。'],
      'quillbot-premium': ['效率工具', 'QuillBot Premium，适合改写和优化文本。'],
      'gamma-pro': ['效率工具', 'Gamma Pro，适合 AI 演示文稿和落地页。'],
      'openrouter-credits': ['API 访问', 'OpenRouter Credits，可通过 API 使用多种 AI 模型。'],
    },
  },
}

const activationTranslations = {
  ru: {
    eyebrow: 'Активация доступа',
    title: 'Введите ключ из Telegram',
    copy: 'После оплаты бот отправляет уникальный ключ. Активируйте его здесь, чтобы получить данные аккаунта.',
    label: 'Ключ активации',
    empty: 'Введите ключ активации.',
    failed: 'Не удалось активировать ключ.',
    success: 'Ключ активирован. Данные аккаунта готовы.',
    missing: 'Ключ не найден. Проверьте ввод и попробуйте снова.',
    loading: 'Проверяем...',
    submit: 'Активировать',
    steps: ['Проверка ключа', 'Подготовка доступа', 'Данные аккаунта'],
    email: 'Почта',
    password: 'Пароль',
    loginCode: 'Код входа',
    loginCodeHint: 'Если ChatGPT попросит код подтверждения, используйте этот 6-значный код.',
  },
  en: {
    eyebrow: 'Access activation',
    title: 'Enter your Telegram key',
    copy: 'After payment, the bot sends a unique key. Activate it here to receive your account details.',
    label: 'Activation key',
    empty: 'Enter your activation key.',
    failed: 'Could not activate the key.',
    success: 'Key activated. Account details are ready.',
    missing: 'Key not found. Check the code and try again.',
    loading: 'Checking...',
    submit: 'Activate',
    steps: ['Key check', 'Access preparation', 'Account details'],
    email: 'Email',
    password: 'Password',
    loginCode: 'Login code',
    loginCodeHint: 'If ChatGPT asks for a verification code, use this 6-digit code.',
  },
  zh: {
    eyebrow: '访问激活',
    title: '输入 Telegram 密钥',
    copy: '付款后，机器人会发送唯一密钥。请在此激活以获取账号信息。',
    label: '激活密钥',
    empty: '请输入激活密钥。',
    failed: '无法激活密钥。',
    success: '密钥已激活。账号信息已准备好。',
    missing: '未找到密钥。请检查后重试。',
    loading: '检查中...',
    submit: '激活',
    steps: ['检查密钥', '准备访问', '账号信息'],
    email: '邮箱',
    password: '密码',
    loginCode: '登录验证码',
    loginCodeHint: '如果 ChatGPT 要求验证码，请使用此 6 位随机代码。',
  },
}

const paymentTranslations = {
  ru: {
    eyebrow: 'Страница оплаты',
    title: 'Оплата заявки',
    missing: 'Платеж не найден.',
    unavailable: 'Платеж не найден или уже недоступен.',
    amount: 'К оплате',
    cryptoError: 'Не удалось создать оплату CryptoBot.',
    walletError: 'Не удалось выбрать кошелек.',
    copied: 'Адрес скопирован.',
    review: 'Заявка отправлена. Мы проверим транзакцию и зачислим баланс.',
    reviewError: 'Не удалось отправить заявку. Попробуйте позже.',
    network: 'Сеть',
    address: 'Адрес кошелька',
    back: 'Назад к выбору способа оплаты',
    copy: 'Скопировать адрес',
    paid: 'Я оплатил',
    warning: 'Отправляйте средства только в указанной сети. После перевода нажмите "Я оплатил".',
    qrAlt: 'QR-код адреса кошелька',
  },
  en: {
    eyebrow: 'Payment page',
    title: 'Payment request',
    missing: 'Payment not found.',
    unavailable: 'Payment not found or no longer available.',
    amount: 'Amount due',
    cryptoError: 'Could not create CryptoBot payment.',
    walletError: 'Could not select wallet.',
    copied: 'Address copied.',
    review: 'Request sent. We will verify the transaction and credit your balance.',
    reviewError: 'Could not send the request. Try again later.',
    network: 'Network',
    address: 'Wallet address',
    back: 'Back to payment methods',
    copy: 'Copy address',
    paid: 'I paid',
    warning: 'Send funds only through the selected network. After the transfer, press "I paid".',
    qrAlt: 'Wallet address QR code',
  },
  zh: {
    eyebrow: '付款页面',
    title: '付款请求',
    missing: '未找到付款。',
    unavailable: '未找到付款或已不可用。',
    amount: '应付金额',
    cryptoError: '无法创建 CryptoBot 付款。',
    walletError: '无法选择钱包。',
    copied: '地址已复制。',
    review: '请求已发送。我们会检查交易并充值余额。',
    reviewError: '无法发送请求。请稍后重试。',
    network: '网络',
    address: '钱包地址',
    back: '返回付款方式',
    copy: '复制地址',
    paid: '我已付款',
    warning: '请仅通过所选网络转账。转账后点击“我已付款”。',
    qrAlt: '钱包地址二维码',
  },
}

function formatPrice(price) {
  return `$${price}`
}

function formatOrderDate(value) {
  if (!value) {
    return ''
  }

  return new Date(value).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function currentTelegramUser() {
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user

  if (user?.id) {
    return user
  }

  const initData = window.Telegram?.WebApp?.initData || ''
  const encodedUser = new URLSearchParams(initData).get('user')

  if (encodedUser) {
    try {
      return JSON.parse(encodedUser)
    } catch {
      return null
    }
  }

  const fallbackTelegramId = new URLSearchParams(window.location.search).get('tgid')

  if (/^\d+$/.test(fallbackTelegramId || '')) {
    return { id: Number(fallbackTelegramId) }
  }

  return null
}

function currentTelegramInitData() {
  return window.Telegram?.WebApp?.initData || ''
}

function ActivationPage() {
  const [language, setLanguage] = useState('en')
  const [key, setKey] = useState('')
  const [credentials, setCredentials] = useState(null)
  const [status, setStatus] = useState('')
  const [activeStep, setActiveStep] = useState(1)
  const [showSteps, setShowSteps] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const text = activationTranslations[language]

  const handleActivate = (event) => {
    event.preventDefault()
    const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || ''
    const normalizedKey = key.trim().toUpperCase()

    if (!normalizedKey) {
      setStatus(text.empty)
      return
    }

    setIsLoading(true)
    setStatus('')
    setCredentials(null)
    setActiveStep(1)
    setShowSteps(true)

    fetch(`${apiBase}/api/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key: normalizedKey }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.error || text.failed)
        }

        return data
      })
      .then((data) => {
        setActiveStep(2)

        setTimeout(() => {
          setActiveStep(3)

          setTimeout(() => {
            setCredentials(data)
            setStatus(text.success)
            setIsLoading(false)
          }, 650)
        }, 650)
      })
      .catch(() => {
        setActiveStep(1)
        setStatus(text.missing)
        setIsLoading(false)
      })
  }

  return (
    <main className="activation-page">
      <button
        type="button"
        className="language-toggle page-language-toggle"
        onClick={() => setLanguage((current) => languages[(languages.indexOf(current) + 1) % languages.length])}
      >
        {translations[language].languageLabel}
      </button>
      <section className="activation-card">
        <div className="activation-logo">OmniKey</div>
        <p className="activation-eyebrow">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <p className="activation-copy">
          {text.copy}
        </p>

        {showSteps ? (
          <div className="activation-steps" aria-label="Activation steps">
            {text.steps.map((step, index) => {
              const stepNumber = index + 1
              const isComplete = credentials && stepNumber < 3
              const isActive = activeStep === stepNumber || (credentials && stepNumber === 3)

              return (
                <div className={`activation-step${isActive ? ' active' : ''}${isComplete ? ' complete' : ''}`} key={step}>
                  <span>{stepNumber}</span>
                  <strong>{step}</strong>
                </div>
              )
            })}
          </div>
        ) : null}

        <form className="activation-form" onSubmit={handleActivate}>
          <label htmlFor="activation-key">{text.label}</label>
          <input
            id="activation-key"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            placeholder="XXXX-XXXX-XXXX-XXXX"
            autoComplete="off"
          />
          <button type="submit" disabled={isLoading}>{isLoading ? text.loading : text.submit}</button>
        </form>

        {status ? <p className="activation-status">{status}</p> : null}

        {credentials ? (
          <div className="activation-result">
            <span>{text.email}</span>
            <strong>{credentials.email}</strong>
            <span>{text.password}</span>
            <strong>{credentials.password}</strong>
            <span>{text.loginCode}</span>
            <strong className="login-code">{credentials.loginCode}</strong>
            <p>{text.loginCodeHint}</p>
          </div>
        ) : null}
      </section>
    </main>
  )
}

function WalletPaymentPage() {
  const [language, setLanguage] = useState('en')
  const [payment, setPayment] = useState(null)
  const [status, setStatus] = useState('')
  const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || ''
  const topupId = window.location.pathname.split('/').filter(Boolean)[1]
  const text = paymentTranslations[language]
  const visibleStatus = status || (!topupId ? text.missing : '')

  useEffect(() => {
    if (!topupId) {
      return
    }

    fetch(`${apiBase}/api/topups/${topupId}/payment`)
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.error || 'Payment not found')
        }

        return data
      })
      .then((data) => {
        setPayment(data)
        setStatus('')
      })
      .catch(() => {
        setStatus(text.unavailable)
      })
  }, [apiBase, text.unavailable, topupId])

  const copyAddress = () => {
    if (!payment?.walletPayment?.address) {
      return
    }

    navigator.clipboard?.writeText(payment.walletPayment.address)
    setStatus(text.copied)
  }

  const chooseCryptoBot = () => {
    if (!topupId) {
      return
    }

    setStatus('')

    fetch(`${apiBase}/api/topups/${topupId}/crypto`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.error || text.cryptoError)
        }

        return data
      })
      .then(({ topup, paymentUrl }) => {
        setPayment((currentPayment) => ({
          ...currentPayment,
          ...topup,
          walletPayments: currentPayment?.walletPayments || topup.walletPayments,
          cryptoPayAvailable: currentPayment?.cryptoPayAvailable ?? topup.cryptoPayAvailable,
        }))

        if (paymentUrl) {
          window.location.href = paymentUrl
        }
      })
      .catch((error) => {
        setStatus(error.message)
      })
  }

  const chooseWallet = (networkId) => {
    if (!topupId) {
      return
    }

    setStatus('')

    fetch(`${apiBase}/api/topups/${topupId}/wallet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ networkId }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.error || text.walletError)
        }

        return data
      })
      .then(({ topup }) => {
        setPayment((currentPayment) => ({
          ...currentPayment,
          ...topup,
          walletPayments: currentPayment?.walletPayments || topup.walletPayments,
          cryptoPayAvailable: currentPayment?.cryptoPayAvailable ?? topup.cryptoPayAvailable,
        }))
      })
      .catch((error) => {
        setStatus(error.message)
      })
  }

  const returnToMethods = () => {
    setPayment((currentPayment) => currentPayment ? {
      ...currentPayment,
      walletPayment: null,
      status: 'payment_method_pending',
    } : currentPayment)
    setStatus('')
  }

  const markPaid = () => {
    if (!topupId) {
      return
    }

    fetch(`${apiBase}/api/topups/${topupId}/paid`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Wallet paid request failed')
        }
        return response.json()
      })
      .then(({ topup }) => {
        setPayment((currentPayment) => ({
          ...currentPayment,
          ...topup,
          walletPayments: currentPayment?.walletPayments || topup.walletPayments,
          cryptoPayAvailable: currentPayment?.cryptoPayAvailable ?? topup.cryptoPayAvailable,
        }))
        setStatus(text.review)
      })
      .catch(() => {
        setStatus(text.reviewError)
      })
  }

  const qrData = payment?.walletPayment?.address ? encodeURIComponent(payment.walletPayment.address) : ''

  return (
    <main className="wallet-pay-page">
      <button
        type="button"
        className="language-toggle page-language-toggle"
        onClick={() => setLanguage((current) => languages[(languages.indexOf(current) + 1) % languages.length])}
      >
        {translations[language].languageLabel}
      </button>
      <section className="wallet-pay-card">
        <div className="activation-logo">OmniKey</div>
        <p className="activation-eyebrow">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        {payment ? (
          <>
            <div className="wallet-pay-details">
              <span>{text.amount}</span>
              <strong>{payment.walletPayment ? `${payment.walletPayment.payableAmount} ${payment.walletPayment.asset}` : formatPrice(payment.payableAmount || payment.amount)}</strong>
              {!payment.walletPayment ? (
                <div className="wallet-pay-methods">
                  {payment.cryptoPayAvailable ? <button type="button" onClick={chooseCryptoBot}>{translations[language].cryptoBotMethod}</button> : null}
                  {payment.walletPayments?.map((walletOption) => (
                    <button key={walletOption.id} type="button" onClick={() => chooseWallet(walletOption.id)}>
                      {walletOption.label}
                    </button>
                  ))}
                </div>
              ) : null}
              {qrData ? (
                <img
                  className="wallet-pay-qr"
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${qrData}`}
                  alt={text.qrAlt}
                />
              ) : null}
              {payment.walletPayment ? (
                <>
                  <span>{text.network}</span>
                  <strong>{payment.walletPayment.network}</strong>
                  <span>{text.address}</span>
                  <code>{payment.walletPayment.address}</code>
                </>
              ) : null}
            </div>
            {payment.walletPayment ? (
              <>
                <button type="button" className="wallet-pay-back-button" onClick={returnToMethods}>{text.back}</button>
                <button type="button" onClick={copyAddress}>{text.copy}</button>
                <button type="button" className="wallet-pay-paid-button" onClick={markPaid}>{text.paid}</button>
                <p className="activation-copy">{text.warning}</p>
              </>
            ) : null}
          </>
        ) : null}
        {visibleStatus ? <p className="activation-status">{visibleStatus}</p> : null}
      </section>
    </main>
  )
}

function ProductCard({ product, onSelect, active, text }) {
  const [badge, description] = text.productText[product.id]
  const promo = text.promos?.[product.id]
  const avatar = productAvatars[product.group] || { src: '', fallback: product.brand.slice(0, 2).toUpperCase() }

  return (
    <button
      type="button"
      className={`product-card${active ? ' active' : ''}`}
      onClick={() => onSelect(product)}
    >
      <span className="product-icon" aria-hidden="true">
        {avatar.src ? <img src={avatar.src} alt="" loading="lazy" /> : null}
        <span>{avatar.fallback}</span>
      </span>
      <div className="product-main">
        <span className="product-badge">{badge}</span>
        <div className="product-topline">
          <span className="product-brand">{product.brand}</span>
          <span className="product-plan">{product.plan}</span>
        </div>
        {promo ? <p className="product-promo">{promo}</p> : null}
        <p className="product-description">{description}</p>
        <p className="product-guarantee">{text.guarantee}</p>
      </div>
      <strong className="product-price">{formatPrice(product.price)}</strong>
      <span className="product-action">{text.selectPlan}</span>
    </button>
  )
}

function StoreApp() {
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [language, setLanguage] = useState('en')
  const [activeTab, setActiveTab] = useState('catalog')
  const [activeGroup, setActiveGroup] = useState('Все')
  const [selectedTopUpAmount, setSelectedTopUpAmount] = useState(topupAmounts[0])
  const [promoCode, setPromoCode] = useState('')
  const [isPromoApplied, setIsPromoApplied] = useState(false)
  const [topUpStatus, setTopUpStatus] = useState('')
  const [productPaymentStatus, setProductPaymentStatus] = useState('')
  const [isProductPaymentOpen, setIsProductPaymentOpen] = useState(false)
  const [isTopUpPanelOpen, setIsTopUpPanelOpen] = useState(false)
  const [balance, setBalance] = useState(0)
  const [orders, setOrders] = useState([])
  const text = translations[language]
  const promoBonus = promoBonuses[promoCode.trim().toUpperCase()] || 0
  const topUpPayableAmount = Number((selectedTopUpAmount * (1 - promoBonus / 100)).toFixed(2))
  const visibleProducts = activeGroup === 'Все'
    ? products
    : products.filter((product) => product.group === activeGroup)

  useEffect(() => {
    window.Telegram?.WebApp?.ready?.()
    window.Telegram?.WebApp?.expand?.()
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', isTopUpPanelOpen)

    return () => {
      document.body.classList.remove('modal-open')
    }
  }, [isTopUpPanelOpen])

  useEffect(() => {
    const telegramId = currentTelegramUser()?.id

    if (!telegramId) {
      return
    }

    const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || defaultApiBase

    fetch(`${apiBase}/api/balance/${telegramId}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Balance request failed')
        }
        return response.json()
      })
      .then(({ balance: userBalance = 0 }) => {
        setBalance(Number(userBalance) || 0)
      })
      .catch(() => {
        setBalance(0)
      })

    fetch(`${apiBase}/api/orders?telegramId=${encodeURIComponent(telegramId)}`)
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Orders request failed')
        }
        return response.json()
      })
      .then(({ orders: userOrders = [] }) => {
        setOrders(Array.isArray(userOrders) ? userOrders : [])
      })
      .catch(() => {
        setOrders([])
      })
  }, [])

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    setProductPaymentStatus('')
    setIsProductPaymentOpen(true)
  }

  const handleBalancePayment = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || defaultApiBase

    if (!window.confirm(text.confirmPurchase({ product: selectedProduct.brand, price: selectedProduct.price }))) {
      return
    }

    setProductPaymentStatus('')

    fetch(`${apiBase}/api/orders/balance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: selectedProduct.id,
        telegramUser: currentTelegramUser(),
        telegramInitData: currentTelegramInitData(),
        language,
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Balance payment request failed')
        }
        return response.json()
      })
      .then(({ balance: updatedBalance = 0, order }) => {
        setBalance(Number(updatedBalance) || 0)
        if (order) {
          setOrders((current) => [order, ...current])
        }
        setProductPaymentStatus(text.balancePaymentSuccess)
      })
      .catch(() => {
        setProductPaymentStatus(text.balancePaymentError)
      })
  }

  const handleWalletTopUp = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || defaultApiBase
    const normalizedPromoCode = promoCode.trim().toUpperCase()

    if (normalizedPromoCode && !isPromoApplied) {
      setIsPromoApplied(true)
      setTopUpStatus('')
      return
    }

    setTopUpStatus('')

    fetch(`${apiBase}/api/topups/paypage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: selectedTopUpAmount,
        telegramUser: currentTelegramUser(),
        telegramInitData: currentTelegramInitData(),
        language,
        promoCode: isPromoApplied ? normalizedPromoCode : '',
      }),
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}))

        if (!response.ok) {
          throw new Error(data.error || 'Wallet top-up request failed')
        }

        return data
      })
      .then(({ paymentPageUrl, topup }) => {
        const url = paymentPageUrl || `/pay/${topup.id}`

        if (window.Telegram?.WebApp?.openLink) {
          window.Telegram.WebApp.openLink(url)
          return
        }

        window.location.href = url
      })
      .catch((error) => {
        setTopUpStatus(error.message === 'Open the app through Telegram to top up balance' ? text.telegramUserRequired : error.message)
      })
  }

  return (
    <main className="page-shell">
      <section className="hero-block">
        <div>
          <p className="eyebrow">{text.eyebrow}</p>
          <h1>{text.title}</h1>
          <p className="hero-copy">{text.hero}</p>
        </div>
        <div className="hero-controls">
          <button
            type="button"
            className="language-toggle store-language-toggle"
            onClick={() => setLanguage((current) => languages[(languages.indexOf(current) + 1) % languages.length])}
          >
            {text.languageLabel}
          </button>
          <button
            type="button"
            className="balance-pill"
            onClick={() => setIsTopUpPanelOpen(true)}
          >
            <span>{formatPrice(balance)}</span>
            <strong>+</strong>
          </button>
        </div>
      </section>

      {activeTab === 'catalog' ? (
        <>
          <div className="group-tabs-shell">
            <nav className="group-tabs" aria-label="AI service groups">
              {productGroups.map((group) => (
                <button
                  key={group}
                  type="button"
                  className={`group-tab${activeGroup === group ? ' active' : ''}`}
                  onClick={() => setActiveGroup(group)}
                >
                  {group === 'Все' ? text.allGroup : group}
                </button>
              ))}
            </nav>
          </div>

          <section className="catalog-layout">
            <div className="catalog-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleProductSelect}
                  active={selectedProduct.id === product.id}
                  text={text}
                />
              ))}
            </div>
          </section>

          {isProductPaymentOpen ? (
            <div
              className="product-payment-overlay"
              role="presentation"
              onClick={() => setIsProductPaymentOpen(false)}
            >
              <section
                className="product-payment-panel"
                role="dialog"
                aria-modal="true"
                aria-label={text.paymentTitle}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="product-payment-close"
                  aria-label="Close"
                  onClick={() => setIsProductPaymentOpen(false)}
                >
                  ×
                </button>
                <div>
                  <span>{text.paymentTitle}</span>
                  <strong>{formatPrice(selectedProduct.price)}</strong>
                </div>
                <div>
                  <span>{text.paymentMethods}</span>
                  <strong className="product-payment-method">
                    {text.balanceMethod}
                    <span>{formatPrice(balance)}</span>
                  </strong>
                </div>
                <button type="button" className="product-balance-button" onClick={handleBalancePayment}>
                  {text.payBalanceButton}
                </button>
                {productPaymentStatus ? <p className="product-payment-status">{productPaymentStatus}</p> : null}
              </section>
            </div>
          ) : null}
        </>
      ) : (
        <section className="empty-panel">
          <p className="eyebrow">OmniKey</p>
          <h2>{text.ordersTitle}</h2>
          {orders.length ? (
            <div className="orders-list">
              {orders.map((order) => (
                <article className="order-card" key={order.id}>
                  <div>
                    <strong>{order.productTitle}</strong>
                    <span>{formatOrderDate(order.createdAt)}</span>
                  </div>
                  <span>{formatPrice(order.price)}</span>
                </article>
              ))}
            </div>
          ) : (
            <p>{text.ordersText}</p>
          )}
        </section>
      )}

      {isTopUpPanelOpen ? (
        <div
          className="product-payment-overlay"
          role="presentation"
          onClick={() => setIsTopUpPanelOpen(false)}
        >
          <section
            className="topup-panel topup-modal-panel"
            role="dialog"
            aria-modal="true"
            aria-label={text.topUpTitle}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="product-payment-close"
              aria-label="Close"
              onClick={() => setIsTopUpPanelOpen(false)}
            >
              ×
            </button>
            <h3>{text.topUpTitle}</h3>
            <p>{text.topUpHint}</p>
            <div className="topup-grid">
              {topupAmounts.map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className={selectedTopUpAmount === amount ? 'active' : ''}
                  onClick={() => {
                    setSelectedTopUpAmount(amount)
                    setIsPromoApplied(false)
                    setTopUpStatus('')
                  }}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <label className="promo-code-field">
              <span>{text.promoCodeLabel}</span>
              <input
                value={promoCode}
                onChange={(event) => {
                  setPromoCode(event.target.value.toUpperCase())
                  setIsPromoApplied(false)
                  setTopUpStatus('')
                }}
                autoComplete="off"
              />
              {isPromoApplied && promoBonus ? <strong>-{promoBonus}% скидка. К оплате: {formatPrice(topUpPayableAmount)}</strong> : null}
            </label>
            <button type="button" className="topup-pay-button" onClick={handleWalletTopUp}>
              {text.topUpButton} {formatPrice(isPromoApplied && promoBonus ? topUpPayableAmount : selectedTopUpAmount)}
            </button>
            {topUpStatus ? <p className="topup-status">{topUpStatus}</p> : null}
          </section>
        </div>
      ) : null}

      <nav className="bottom-tabs" aria-label="Mini app tabs">
        {Object.entries(text.tabs).map(([tab, label]) => (
          <button
            key={tab}
            type="button"
            className={activeTab === tab ? 'active' : ''}
            onClick={() => setActiveTab(tab)}
          >
            {label}
          </button>
        ))}
      </nav>
    </main>
  )
}

function App() {
  useEffect(() => {
    document.title = 'OminiKey'
  }, [])

  if (window.location.pathname === '/activate') {
    return <ActivationPage />
  }

  if (window.location.pathname.startsWith('/pay/')) {
    return <WalletPaymentPage />
  }

  return <StoreApp />
}

export default App
