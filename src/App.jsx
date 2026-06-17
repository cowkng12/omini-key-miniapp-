import { useRef, useState } from 'react'
import './App.css'

const products = [
  {
    id: 'claude-pro',
    group: 'Claude',
    brand: 'Claude',
    plan: 'Pro',
    price: 12,
  },
  {
    id: 'claude-max',
    group: 'Claude',
    brand: 'Claude',
    plan: 'Max',
    price: 75,
  },
  {
    id: 'perplexity-pro',
    group: 'Perplexity',
    brand: 'Perplexity',
    plan: 'Pro',
    price: 12,
  },
  {
    id: 'cursor-pro',
    group: 'Cursor',
    brand: 'Cursor',
    plan: 'Pro',
    price: 10,
  },
  {
    id: 'cursor-ultra',
    group: 'Cursor',
    brand: 'Cursor',
    plan: 'Ultra',
    price: 24,
  },
  {
    id: 'midjourney-basic',
    group: 'Midjourney',
    brand: 'Midjourney',
    plan: 'Basic',
    price: 10,
  },
  {
    id: 'runway-standard',
    group: 'Runway',
    brand: 'Runway',
    plan: 'Standard',
    price: 15,
  },
  {
    id: 'elevenlabs-starter',
    group: 'ElevenLabs',
    brand: 'ElevenLabs',
    plan: 'Starter',
    price: 5,
  },
  {
    id: 'notion-ai',
    group: 'Notion AI',
    brand: 'Notion AI',
    plan: 'Plus',
    price: 10,
  },
  {
    id: 'poe-subscription',
    group: 'Poe',
    brand: 'Poe',
    plan: 'Subscription',
    price: 20,
  },
]

const defaultApiBase = 'http://localhost:3001'
const sellerUsername = 'metifrysell'
const languages = ['ru', 'en', 'zh']
const productGroups = ['Все', 'Claude', 'Cursor', 'Perplexity', 'Midjourney', 'Runway', 'ElevenLabs', 'Notion AI', 'Poe']

const translations = {
  ru: {
    languageLabel: 'RU',
    eyebrow: 'Telegram Mini App',
    title: 'OmniKey: подписки на нейросервисы',
    hero: `Выберите товар и подайте заявку на покупку. Для оформления напишите @${sellerUsername}.`,
    selectPlan: 'Выбрать тариф',
    guarantee: 'Полная гарантия и возможность замены товара при возникновении проблем.',
    orderTitle: 'Ваш заказ',
    name: 'Имя',
    namePlaceholder: 'Как к вам обращаться',
    telegramPlaceholder: '@username или ссылка',
    orderHint: `Для заказа напишите продавцу: @${sellerUsername}.`,
    buyButton: 'Подать заявку на покупку',
    hint: `Для покупки отпишите продавцу: @${sellerUsername}.`,
    success: 'Заявка отправлена. В течение 5 минут с вами свяжется менеджер, ожидайте.',
    error: 'Не удалось отправить заявку. Проверь backend и попробуй снова.',
    allGroup: 'Все',
    tabs: { catalog: 'Каталог', orders: 'Заказы', balance: 'Баланс' },
    ordersTitle: 'Мои покупки',
    ordersText: 'История покупок скоро появится. По текущим заказам пишите продавцу.',
    balanceTitle: 'Баланс',
    balanceText: 'Баланс и бонусы появятся в следующем обновлении.',
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
    hero: `Choose a product and submit a purchase request. To order, message @${sellerUsername}.`,
    selectPlan: 'Select plan',
    guarantee: 'Full guarantee and replacement if any issues arise.',
    orderTitle: 'Your order',
    name: 'Name',
    namePlaceholder: 'How should we call you',
    telegramPlaceholder: '@username or link',
    orderHint: `To order, message the seller: @${sellerUsername}.`,
    buyButton: 'Submit purchase request',
    hint: `To buy, message the seller: @${sellerUsername}.`,
    success: 'Request sent. A manager will contact you within 5 minutes, please wait.',
    error: 'Could not send the request. Check backend and try again.',
    allGroup: 'All',
    tabs: { catalog: 'Catalog', orders: 'Orders', balance: 'Balance' },
    ordersTitle: 'My purchases',
    ordersText: 'Purchase history is coming soon. For current orders, message the seller.',
    balanceTitle: 'Balance',
    balanceText: 'Balance and bonuses will appear in the next update.',
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
    hero: `选择商品并提交购买申请。下单请联系 @${sellerUsername}。`,
    selectPlan: '选择套餐',
    guarantee: '提供完整保障，如遇问题可更换商品。',
    orderTitle: '你的订单',
    name: '姓名',
    namePlaceholder: '如何称呼你',
    telegramPlaceholder: '@用户名或链接',
    orderHint: `下单请联系卖家：@${sellerUsername}。`,
    buyButton: '提交购买申请',
    hint: `购买请联系卖家：@${sellerUsername}。`,
    success: '申请已提交。经理将在 5 分钟内联系你，请稍候。',
    error: '请求发送失败。请检查后端并重试。',
    allGroup: '全部',
    tabs: { catalog: '目录', orders: '订单', balance: '余额' },
    ordersTitle: '我的购买',
    ordersText: '购买记录即将上线。如需查询当前订单，请联系卖家。',
    balanceTitle: '余额',
    balanceText: '余额和奖励将在下一次更新中上线。',
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
      <p className="product-guarantee">{text.guarantee}</p>
      <span className="product-action">{selectPlan}</span>
    </button>
  )
}

function OrderForm({ product, customer, onChange, onPay, text, actionRef }) {
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

      <button type="button" className="pay-button" onClick={onPay} ref={actionRef}>
        {text.buyButton}
      </button>

      <p className="hint">
        {text.orderHint}
      </p>
    </section>
  )
}

function App() {
  const [selectedProduct, setSelectedProduct] = useState(products[0])
  const [customer, setCustomer] = useState({
    name: '',
    telegram: '',
  })
  const [statusText, setStatusText] = useState('')
  const [language, setLanguage] = useState('ru')
  const [activeTab, setActiveTab] = useState('catalog')
  const [activeGroup, setActiveGroup] = useState('Все')
  const orderActionRef = useRef(null)
  const text = translations[language]
  const visibleProducts = activeGroup === 'Все'
    ? products
    : products.filter((product) => product.group === activeGroup)

  const handleChange = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }))
  }

  const handleProductSelect = (product) => {
    setSelectedProduct(product)
    window.setTimeout(() => {
      orderActionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
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

      {activeTab === 'catalog' ? (
        <>
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

          <section className="catalog-layout">
            <div className="catalog-grid">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={handleProductSelect}
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
              actionRef={orderActionRef}
            />
          </section>
        </>
      ) : (
        <section className="empty-panel">
          <p className="eyebrow">OmniKey</p>
          <h2>{activeTab === 'orders' ? text.ordersTitle : text.balanceTitle}</h2>
          <p>{activeTab === 'orders' ? text.ordersText : text.balanceText}</p>
        </section>
      )}

      {statusText ? <p className="status-banner">{statusText}</p> : null}

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

export default App
