import { useState } from 'react'
import './App.css'

const products = [
  {
    id: 'claude-pro',
    brand: 'Claude',
    plan: 'Pro',
    price: 12,
  },
  {
    id: 'claude-max',
    brand: 'Claude',
    plan: 'Max',
    price: 75,
  },
  {
    id: 'perplexity-pro',
    brand: 'Perplexity',
    plan: 'Pro',
    price: 12,
  },
  {
    id: 'cursor-pro',
    brand: 'Cursor',
    plan: 'Pro',
    price: 10,
  },
  {
    id: 'cursor-ultra',
    brand: 'Cursor',
    plan: 'Ultra',
    price: 24,
  },
  {
    id: 'midjourney-basic',
    brand: 'Midjourney',
    plan: 'Basic',
    price: 10,
  },
  {
    id: 'runway-standard',
    brand: 'Runway',
    plan: 'Standard',
    price: 15,
  },
  {
    id: 'elevenlabs-starter',
    brand: 'ElevenLabs',
    plan: 'Starter',
    price: 5,
  },
  {
    id: 'notion-ai',
    brand: 'Notion AI',
    plan: 'Plus',
    price: 10,
  },
  {
    id: 'poe-subscription',
    brand: 'Poe',
    plan: 'Subscription',
    price: 20,
  },
]

const defaultApiBase = 'http://localhost:3001'
const sellerUsername = 'metifrysell'
const languages = ['ru', 'en', 'zh']

const translations = {
  ru: {
    languageLabel: 'RU',
    eyebrow: 'Telegram Mini App',
    title: 'OmniKey: подписки на нейросервисы',
    hero: `Выбирайте нужный AI-сервис, оставляйте контакт и пишите продавцу @${sellerUsername} для покупки.`,
    selectPlan: 'Выбрать тариф',
    orderTitle: 'Ваш заказ',
    name: 'Имя',
    namePlaceholder: 'Как к вам обращаться',
    telegramPlaceholder: '@username или ссылка',
    contact: 'Контакт',
    contactPlaceholder: 'Telegram, WhatsApp или номер',
    buyButton: 'Написать для покупки',
    hint: `Для покупки напишите продавцу: @${sellerUsername}.`,
    success: `Заявка отправлена. Для покупки напишите @${sellerUsername}.`,
    error: 'Не удалось отправить заявку. Проверь backend и попробуй снова.',
    productText: {
      'claude-pro': ['Хит старта', 'Быстрый старт для повседневной работы, учебы и текста.'],
      'claude-max': ['Премиум', 'Максимальный тариф для активной ежедневной нагрузки.'],
      'perplexity-pro': ['Ресерч', 'Поиск, ресерч и быстрые ответы с источниками.'],
      'cursor-pro': ['Выгодно', 'Удобный вариант для старта и регулярной разработки.'],
      'cursor-ultra': ['Расширенный', 'Расширенный вариант для тех, кому нужен запас по лимитам.'],
      'midjourney-basic': ['Креатив', 'Генерация изображений для контента, дизайна и идей.'],
      'runway-standard': ['Видео', 'AI-видео, монтаж и генерация коротких роликов.'],
      'elevenlabs-starter': ['Голос', 'Озвучка, голоса и генерация речи для проектов.'],
      'notion-ai': ['Работа', 'AI-помощник для заметок, документов и рабочих баз.'],
      'poe-subscription': ['Мульти AI', 'Доступ к разным AI-моделям в одном интерфейсе.'],
    },
  },
  en: {
    languageLabel: 'EN',
    eyebrow: 'Telegram Mini App',
    title: 'OmniKey: AI service subscriptions',
    hero: `Pick an AI service, leave your contact, and message @${sellerUsername} to buy.`,
    selectPlan: 'Select plan',
    orderTitle: 'Your order',
    name: 'Name',
    namePlaceholder: 'How should we call you',
    telegramPlaceholder: '@username or link',
    contact: 'Contact',
    contactPlaceholder: 'Telegram, WhatsApp or phone',
    buyButton: 'Message to buy',
    hint: `To buy, message the seller: @${sellerUsername}.`,
    success: `Request sent. To buy, message @${sellerUsername}.`,
    error: 'Could not send the request. Check backend and try again.',
    productText: {
      'claude-pro': ['Starter hit', 'Fast start for daily work, study and writing.'],
      'claude-max': ['Premium', 'Maximum plan for heavy daily usage.'],
      'perplexity-pro': ['Research', 'Search, research and quick answers with sources.'],
      'cursor-pro': ['Value', 'Convenient option for regular development work.'],
      'cursor-ultra': ['Extended', 'More limits for active coding sessions.'],
      'midjourney-basic': ['Creative', 'Image generation for content, design and ideas.'],
      'runway-standard': ['Video', 'AI video tools, editing and short clip generation.'],
      'elevenlabs-starter': ['Voice', 'Voiceover, voices and speech generation for projects.'],
      'notion-ai': ['Work', 'AI assistant for notes, docs and workspaces.'],
      'poe-subscription': ['Multi AI', 'Access multiple AI models in one interface.'],
    },
  },
  zh: {
    languageLabel: '中文',
    eyebrow: 'Telegram Mini App',
    title: 'OmniKey：AI 服务订阅',
    hero: `选择需要的 AI 服务，留下联系方式，并联系 @${sellerUsername} 购买。`,
    selectPlan: '选择套餐',
    orderTitle: '你的订单',
    name: '姓名',
    namePlaceholder: '如何称呼你',
    telegramPlaceholder: '@用户名或链接',
    contact: '联系方式',
    contactPlaceholder: 'Telegram、WhatsApp 或电话',
    buyButton: '联系购买',
    hint: `购买请联系卖家：@${sellerUsername}。`,
    success: `请求已发送。购买请联系 @${sellerUsername}。`,
    error: '请求发送失败。请检查后端并重试。',
    productText: {
      'claude-pro': ['入门热门', '适合日常工作、学习和写作的快速入门。'],
      'claude-max': ['高级', '适合高频日常使用的最高套餐。'],
      'perplexity-pro': ['研究', '带来源的搜索、研究和快速回答。'],
      'cursor-pro': ['划算', '适合日常开发的便捷选择。'],
      'cursor-ultra': ['扩展', '为活跃编程提供更多额度。'],
      'midjourney-basic': ['创意', '用于内容、设计和灵感的图片生成。'],
      'runway-standard': ['视频', 'AI 视频、剪辑和短片生成工具。'],
      'elevenlabs-starter': ['语音', '为项目生成配音、声音和语音。'],
      'notion-ai': ['办公', '用于笔记、文档和工作区的 AI 助手。'],
      'poe-subscription': ['多 AI', '在一个界面访问多种 AI 模型。'],
    },
  },
}

function formatPrice(price) {
  return `$${price}`
}

function buildMessage(product, customer) {
  return [
    'Новый заказ',
    `${product.brand} ${product.plan}`,
    `Цена: ${formatPrice(product.price)}`,
    `Имя: ${customer.name || 'Не указано'}`,
    `Telegram: ${customer.telegram || 'Не указан'}`,
    `Контакт: ${customer.contact || 'Не указан'}`,
  ].join('\n')
}

function openTelegramLink(url) {
  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(url)
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}

function openSellerChat(product, customer) {
  const configured = import.meta.env.VITE_SELLER_URL?.trim() || `https://t.me/${sellerUsername}`
  const target = new URL(configured)
  target.searchParams.set('text', buildMessage(product, customer))
  openTelegramLink(target.toString())
}

function currentTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null
}

function ProductCard({ product, onSelect, active, text, selectPlan }) {
  const [badge, description] = text.productText[product.id]

  return (
    <button
      type="button"
      className={`product-card${active ? ' active' : ''}`}
      onClick={() => onSelect(product)}
    >
      <span className="product-badge">{badge}</span>
      <div className="product-topline">
        <span className="product-brand">{product.brand}</span>
        <span className="product-plan">{product.plan}</span>
      </div>
      <strong className="product-price">{formatPrice(product.price)}</strong>
      <p className="product-description">{description}</p>
      <span className="product-action">{selectPlan}</span>
    </button>
  )
}

function OrderForm({ product, customer, onChange, onPay, text }) {
  return (
    <section className="order-panel">
      <div className="order-head">
        <div>
          <p className="eyebrow">{text.orderTitle}</p>
          <h2>{product.brand} {product.plan}</h2>
        </div>
        <strong>{formatPrice(product.price)}</strong>
      </div>

      <label>
        <span>{text.name}</span>
        <input
          value={customer.name}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder={text.namePlaceholder}
        />
      </label>

      <label>
        <span>Telegram</span>
        <input
          value={customer.telegram}
          onChange={(event) => onChange('telegram', event.target.value)}
          placeholder={text.telegramPlaceholder}
        />
      </label>

      <label>
        <span>{text.contact}</span>
        <input
          value={customer.contact}
          onChange={(event) => onChange('contact', event.target.value)}
          placeholder={text.contactPlaceholder}
        />
      </label>

      <button type="button" className="pay-button" onClick={onPay}>
        {text.buyButton}
      </button>

      <p className="hint">
        {text.hint}
      </p>
    </section>
  )
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [customer, setCustomer] = useState({
    name: '',
    telegram: '',
    contact: '',
  })
  const [statusText, setStatusText] = useState('')
  const [language, setLanguage] = useState('ru')
  const text = translations[language]

  const handleChange = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  const handlePay = () => {
    const apiBase = import.meta.env.VITE_API_BASE_URL?.trim() || defaultApiBase

    fetch(`${apiBase}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: selectedProduct.id,
        customer,
        telegramUser: currentTelegramUser(),
      }),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Order request failed')
        }
        return response.json()
      })
      .then(() => {
        setStatusText(text.success)
        openSellerChat(selectedProduct, customer)
      })
      .catch(() => {
        setStatusText(text.error)
      })
  }

  return (
    <main className="page-shell">
      <button
        type="button"
        className="language-toggle"
        onClick={() => setLanguage((current) => languages[(languages.indexOf(current) + 1) % languages.length])}
      >
        {text.languageLabel}
      </button>

      <section className="hero-block">
        <p className="eyebrow">{text.eyebrow}</p>
        <h1>{text.title}</h1>
        <p className="hero-copy">{text.hero}</p>
      </section>

      <section className="catalog-layout">
        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
              active={selectedProduct.id === product.id}
              text={text}
              selectPlan={text.selectPlan}
            />
          ))}
        </div>

        <OrderForm
          product={selectedProduct}
          customer={customer}
          onChange={handleChange}
          onPay={handlePay}
          text={text}
        />
      </section>

      {statusText ? <p className="status-banner">{statusText}</p> : null}
    </main>
  )
}

export default App
