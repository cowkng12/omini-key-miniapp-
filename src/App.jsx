import { useRef, useState } from 'react'
import './App.css'

const products = [
  {
    id: 'chatgpt-plus-ready',
    group: 'ChatGPT',
    brand: 'ChatGPT',
    plan: 'Plus Ready Account',
    price: 1.8,
  },
  {
    id: 'chatgpt-go',
    group: 'ChatGPT',
    brand: 'ChatGPT',
    plan: 'Go',
    price: 2.5,
  },
  {
    id: 'chatgpt-plus-shared',
    group: 'ChatGPT',
    brand: 'ChatGPT',
    plan: 'Plus Shared',
    price: 3,
  },
  {
    id: 'chatgpt-plus',
    group: 'ChatGPT',
    brand: 'ChatGPT',
    plan: 'Plus',
    price: 10,
  },
  {
    id: 'chatgpt-pro',
    group: 'ChatGPT',
    brand: 'ChatGPT',
    plan: 'Pro',
    price: 100,
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
    plan: '2 Accounts',
    price: 9,
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
    id: 'gemini-advanced',
    group: 'Gemini',
    brand: 'Gemini',
    plan: 'Advanced',
    price: 10,
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
    plan: '2 Accounts',
    price: 9,
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
]

const defaultApiBase = 'http://localhost:3001'
const sellerUsername = 'metifrysell'
const languages = ['ru', 'en', 'zh']
const productGroups = ['Все', 'ChatGPT', 'Grok', 'Claude', 'Cursor', 'Perplexity', 'Gemini', 'Copilot', 'Midjourney', 'Runway', 'Suno', 'Kling', 'Leonardo AI', 'ElevenLabs', 'Canva', 'Notion AI', 'Poe']

const translations = {
  ru: {
    languageLabel: 'RU',
    eyebrow: 'OmniKey',
    title: 'OmniKey: подписки на нейросервисы',
    hero: 'Выберите товар и подайте заявку на покупку.',
    selectPlan: 'Выбрать тариф',
    guarantee: 'Полная гарантия и возможность замены товара при возникновении проблем.',
    promos: {
      'claude-pro-duo': 'Промо-лот: 2 аккаунта — $9',
      'cursor-pro-duo': 'Промо-лот: 2 аккаунта — $9',
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
    tabs: { catalog: 'Каталог', orders: 'Заказы', balance: 'Баланс' },
    ordersTitle: 'Мои покупки',
    ordersText: 'История покупок скоро появится. По поданной заявке менеджер свяжется с вами в течение 5 минут.',
    balanceTitle: 'Баланс',
    balanceText: 'Баланс и бонусы появятся в следующем обновлении.',
    productText: {
      'claude-pro': ['Хит старта', 'Быстрый старт для повседневной работы, учебы и текста.'],
      'chatgpt-plus-ready': ['Готовый аккаунт', 'ChatGPT Plus на готовом аккаунте для быстрых задач и общения.'],
      'chatgpt-go': ['Go', 'Недорогой тариф ChatGPT для большего количества сообщений и файлов.'],
      'chatgpt-plus-shared': ['Plus доступ', 'Бюджетный доступ к ChatGPT Plus для повседневных задач.'],
      'chatgpt-plus': ['Plus', 'Полный ChatGPT Plus для работы, учебы, изображений и ресерча.'],
      'chatgpt-pro': ['Pro', 'Максимальный ChatGPT Pro для лимитов, deep research и сложных задач.'],
      'chatgpt-business-seat': ['Business', 'Место ChatGPT Business для работы, команды и приватности.'],
      'grok-x-premium': ['X Premium', 'Базовый платный доступ к Grok через подписку X Premium.'],
      'grok-x-premium-plus': ['X Premium+', 'Расширенный доступ к Grok через X Premium+ с большим запасом лимитов.'],
      'supergrok': ['SuperGrok', 'Отдельная подписка xAI для Grok с расширенными возможностями.'],
      'supergrok-heavy': ['Heavy', 'Максимальный тариф SuperGrok Heavy для самых высоких лимитов.'],
      'claude-pro-duo': ['2 аккаунта', 'Отдельный промо-лот на два аккаунта Claude Pro по спеццене.'],
      'claude-max': ['Премиум', 'Максимальный тариф для активной ежедневной нагрузки.'],
      'perplexity-pro': ['Ресерч', 'Поиск, ресерч и быстрые ответы с источниками.'],
      'gemini-advanced': ['Google AI', 'Gemini Advanced для текста, анализа, учебы и быстрых идей.'],
      'copilot-pro': ['Microsoft', 'Copilot Pro для документов, работы и повседневного AI-помощника.'],
      'cursor-pro': ['Выгодно', 'Удобный вариант для старта и регулярной разработки.'],
      'cursor-pro-duo': ['2 аккаунта', 'Отдельный промо-лот на два аккаунта Cursor Pro по спеццене.'],
      'cursor-ultra': ['Расширенный', 'Расширенный вариант для тех, кому нужен запас по лимитам.'],
      'midjourney-basic': ['Креатив', 'Генерация изображений для контента, дизайна и идей.'],
      'runway-standard': ['Видео', 'AI-видео, монтаж и генерация коротких роликов.'],
      'suno-pro': ['Музыка', 'Генерация песен, битов и музыкальных идей через AI.'],
      'kling-ai': ['Видео AI', 'Генерация и оживление видео для креатива и контента.'],
      'leonardo-ai': ['Изображения', 'AI-генерация артов, визуалов и дизайн-материалов.'],
      'elevenlabs-starter': ['Голос', 'Озвучка, голоса и генерация речи для проектов.'],
      'canva-pro': ['Дизайн', 'Canva Pro для шаблонов, презентаций и быстрого дизайна.'],
      'notion-ai': ['Работа', 'AI-помощник для заметок, документов и рабочих баз.'],
      'poe-subscription': ['Мульти AI', 'Доступ к разным AI-моделям в одном интерфейсе.'],
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
      'claude-pro-duo': 'Promo lot: 2 accounts — $9',
      'cursor-pro-duo': 'Promo lot: 2 accounts — $9',
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
    tabs: { catalog: 'Catalog', orders: 'Orders', balance: 'Balance' },
    ordersTitle: 'My purchases',
    ordersText: 'Purchase history is coming soon. A manager will contact you within 5 minutes regarding your request.',
    balanceTitle: 'Balance',
    balanceText: 'Balance and bonuses will appear in the next update.',
    productText: {
      'claude-pro': ['Starter hit', 'Fast start for daily work, study and writing.'],
      'chatgpt-plus-ready': ['Ready account', 'ChatGPT Plus on a ready account for quick tasks and conversations.'],
      'chatgpt-go': ['Go', 'Low-cost ChatGPT plan for more messages and file uploads.'],
      'chatgpt-plus-shared': ['Plus access', 'Budget ChatGPT Plus access for everyday tasks.'],
      'chatgpt-plus': ['Plus', 'Full ChatGPT Plus for work, study, images and research.'],
      'chatgpt-pro': ['Pro', 'Maximum ChatGPT Pro for limits, deep research and complex tasks.'],
      'chatgpt-business-seat': ['Business', 'ChatGPT Business seat for work, teams and privacy.'],
      'grok-x-premium': ['X Premium', 'Basic paid Grok access through an X Premium subscription.'],
      'grok-x-premium-plus': ['X Premium+', 'Extended Grok access through X Premium+ with higher limits.'],
      'supergrok': ['SuperGrok', 'Standalone xAI subscription for Grok with expanded capabilities.'],
      'supergrok-heavy': ['Heavy', 'Top SuperGrok Heavy plan for the highest limits.'],
      'claude-pro-duo': ['2 accounts', 'Separate promo lot for two Claude Pro accounts at a special price.'],
      'claude-max': ['Premium', 'Maximum plan for heavy daily usage.'],
      'perplexity-pro': ['Research', 'Search, research and quick answers with sources.'],
      'gemini-advanced': ['Google AI', 'Gemini Advanced for writing, analysis, study and ideas.'],
      'copilot-pro': ['Microsoft', 'Copilot Pro for documents, work and daily AI assistance.'],
      'cursor-pro': ['Value', 'Convenient option for regular development work.'],
      'cursor-pro-duo': ['2 accounts', 'Separate promo lot for two Cursor Pro accounts at a special price.'],
      'cursor-ultra': ['Extended', 'More limits for active coding sessions.'],
      'midjourney-basic': ['Creative', 'Image generation for content, design and ideas.'],
      'runway-standard': ['Video', 'AI video tools, editing and short clip generation.'],
      'suno-pro': ['Music', 'Generate songs, beats and music ideas with AI.'],
      'kling-ai': ['AI video', 'Generate and animate videos for creative content.'],
      'leonardo-ai': ['Images', 'AI generation for art, visuals and design assets.'],
      'elevenlabs-starter': ['Voice', 'Voiceover, voices and speech generation for projects.'],
      'canva-pro': ['Design', 'Canva Pro for templates, presentations and quick design.'],
      'notion-ai': ['Work', 'AI assistant for notes, docs and workspaces.'],
      'poe-subscription': ['Multi AI', 'Access multiple AI models in one interface.'],
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
      'claude-pro-duo': '优惠商品：2 个账号 — $9',
      'cursor-pro-duo': '优惠商品：2 个账号 — $9',
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
    tabs: { catalog: '目录', orders: '订单', balance: '余额' },
    ordersTitle: '我的购买',
    ordersText: '购买记录即将上线。提交申请后，经理会在 5 分钟内联系你。',
    balanceTitle: '余额',
    balanceText: '余额和奖励将在下一次更新中上线。',
    productText: {
      'claude-pro': ['入门热门', '适合日常工作、学习和写作的快速入门。'],
      'chatgpt-plus-ready': ['现成账号', '现成 ChatGPT Plus 账号，适合快速任务和聊天。'],
      'chatgpt-go': ['Go', '更低价的 ChatGPT 套餐，适合更多消息和文件上传。'],
      'chatgpt-plus-shared': ['Plus 访问', '适合日常任务的低价 ChatGPT Plus 访问。'],
      'chatgpt-plus': ['Plus', '完整 ChatGPT Plus，适合工作、学习、图片和研究。'],
      'chatgpt-pro': ['Pro', '最高级 ChatGPT Pro，适合高额度、深度研究和复杂任务。'],
      'chatgpt-business-seat': ['Business', 'ChatGPT Business 席位，适合工作、团队和隐私需求。'],
      'grok-x-premium': ['X Premium', '通过 X Premium 订阅获得基础 Grok 付费访问。'],
      'grok-x-premium-plus': ['X Premium+', '通过 X Premium+ 获得更高额度的 Grok 访问。'],
      'supergrok': ['SuperGrok', 'xAI 的独立 Grok 订阅，提供扩展功能。'],
      'supergrok-heavy': ['Heavy', '最高级 SuperGrok Heavy，适合最高额度需求。'],
      'claude-pro-duo': ['2 个账号', 'Claude Pro 双账号独立优惠商品，价格更划算。'],
      'claude-max': ['高级', '适合高频日常使用的最高套餐。'],
      'perplexity-pro': ['研究', '带来源的搜索、研究和快速回答。'],
      'gemini-advanced': ['Google AI', 'Gemini Advanced，适合写作、分析、学习和想法。'],
      'copilot-pro': ['Microsoft', 'Copilot Pro，适合文档、工作和日常 AI 辅助。'],
      'cursor-pro': ['划算', '适合日常开发的便捷选择。'],
      'cursor-pro-duo': ['2 个账号', 'Cursor Pro 双账号独立优惠商品，价格更优惠。'],
      'cursor-ultra': ['扩展', '为活跃编程提供更多额度。'],
      'midjourney-basic': ['创意', '用于内容、设计和灵感的图片生成。'],
      'runway-standard': ['视频', 'AI 视频、剪辑和短片生成工具。'],
      'suno-pro': ['音乐', '用 AI 生成歌曲、节拍和音乐灵感。'],
      'kling-ai': ['AI 视频', '为创意内容生成和制作动态视频。'],
      'leonardo-ai': ['图片', '用于艺术、视觉和设计素材的 AI 生成。'],
      'elevenlabs-starter': ['语音', '为项目生成配音、声音和语音。'],
      'canva-pro': ['设计', 'Canva Pro，适合模板、演示和快速设计。'],
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

function currentTelegramUser() {
  return window.Telegram?.WebApp?.initDataUnsafe?.user || null
}

function ProductCard({ product, onSelect, active, text, selectPlan }) {
  const [badge, description] = text.productText[product.id]
  const promo = text.promos?.[product.id]

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
      {promo ? <p className="product-promo">{promo}</p> : null}
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
