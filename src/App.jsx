import { useState } from 'react'
import './App.css'

const products = [
  {
    id: 'claude-pro',
    brand: 'Claude',
    plan: 'Pro',
    price: 12,
    description: 'Быстрый старт для повседневной работы, учебы и текста.',
    badge: 'Хит старта',
  },
  {
    id: 'claude-max',
    brand: 'Claude',
    plan: 'Max',
    price: 75,
    description: 'Максимальный тариф для активной ежедневной нагрузки.',
    badge: 'Премиум',
  },
  {
    id: 'perplexity-pro',
    brand: 'Perplexity',
    plan: 'Pro',
    price: 12,
    description: 'Поиск, ресерч и быстрые ответы с источниками.',
    badge: 'Ресерч',
  },
  {
    id: 'cursor-pro',
    brand: 'Cursor',
    plan: 'Pro',
    price: 10,
    description: 'Удобный вариант для старта и регулярной разработки.',
    badge: 'Выгодно',
  },
  {
    id: 'cursor-ultra',
    brand: 'Cursor',
    plan: 'Ultra',
    price: 24,
    description: 'Расширенный вариант для тех, кому нужен запас по лимитам.',
    badge: 'Расширенный',
  },
  {
    id: 'midjourney-basic',
    brand: 'Midjourney',
    plan: 'Basic',
    price: 10,
    description: 'Генерация изображений для контента, дизайна и идей.',
    badge: 'Креатив',
  },
  {
    id: 'runway-standard',
    brand: 'Runway',
    plan: 'Standard',
    price: 15,
    description: 'AI-видео, монтаж и генерация коротких роликов.',
    badge: 'Видео',
  },
  {
    id: 'elevenlabs-starter',
    brand: 'ElevenLabs',
    plan: 'Starter',
    price: 5,
    description: 'Озвучка, голоса и генерация речи для проектов.',
    badge: 'Голос',
  },
  {
    id: 'notion-ai',
    brand: 'Notion AI',
    plan: 'Plus',
    price: 10,
    description: 'AI-помощник для заметок, документов и рабочих баз.',
    badge: 'Работа',
  },
  {
    id: 'poe-subscription',
    brand: 'Poe',
    plan: 'Subscription',
    price: 20,
    description: 'Доступ к разным AI-моделям в одном интерфейсе.',
    badge: 'Мульти AI',
  },
]

const defaultApiBase = 'http://localhost:3001'
const sellerUsername = 'metifrysell'

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

function ProductCard({ product, onSelect, active }) {
  return (
    <button
      type="button"
      className={`product-card${active ? ' active' : ''}`}
      onClick={() => onSelect(product)}
    >
      <span className="product-badge">{product.badge}</span>
      <div className="product-topline">
        <span className="product-brand">{product.brand}</span>
        <span className="product-plan">{product.plan}</span>
      </div>
      <strong className="product-price">{formatPrice(product.price)}</strong>
      <p className="product-description">{product.description}</p>
      <span className="product-action">Выбрать тариф</span>
    </button>
  )
}

function OrderForm({ product, customer, onChange, onPay }) {
  return (
    <section className="order-panel">
      <div className="order-head">
        <div>
          <p className="eyebrow">Ваш заказ</p>
          <h2>{product.brand} {product.plan}</h2>
        </div>
        <strong>{formatPrice(product.price)}</strong>
      </div>

      <label>
        <span>Имя</span>
        <input
          value={customer.name}
          onChange={(event) => onChange('name', event.target.value)}
          placeholder="Как к вам обращаться"
        />
      </label>

      <label>
        <span>Telegram</span>
        <input
          value={customer.telegram}
          onChange={(event) => onChange('telegram', event.target.value)}
          placeholder="@username или ссылка"
        />
      </label>

      <label>
        <span>Контакт</span>
        <input
          value={customer.contact}
          onChange={(event) => onChange('contact', event.target.value)}
          placeholder="Telegram, WhatsApp или номер"
        />
      </label>

      <button type="button" className="pay-button" onClick={onPay}>
        Написать для покупки
      </button>

      <p className="hint">
        Для покупки напишите продавцу: @{sellerUsername}.
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
        setStatusText(`Заявка отправлена. Для покупки напишите @${sellerUsername}.`)
        openSellerChat(selectedProduct, customer)
      })
      .catch(() => {
        setStatusText('Не удалось отправить заявку. Проверь backend и попробуй снова.')
      })
  }

  return (
    <main className="page-shell">
      <section className="hero-block">
        <p className="eyebrow">Telegram Mini App</p>
        <h1>OmniKey: подписки на нейросервисы</h1>
        <p className="hero-copy">
          Выбирайте нужный AI-сервис, оставляйте контакт и пишите продавцу @{sellerUsername} для покупки.
        </p>
      </section>

      <section className="catalog-layout">
        <div className="catalog-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={setSelectedProduct}
              active={selectedProduct.id === product.id}
            />
          ))}
        </div>

        <OrderForm
          product={selectedProduct}
          customer={customer}
          onChange={handleChange}
          onPay={handlePay}
        />
      </section>

      {statusText ? <p className="status-banner">{statusText}</p> : null}
    </main>
  )
}

export default App
