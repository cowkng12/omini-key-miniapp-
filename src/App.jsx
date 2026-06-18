import { useRef, useState } from 'react'
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
      'claude-pro': ['Готовый аккаунт', 'Готовый аккаунт Claude Pro для повседневной работы, учебы и текста.'],
      'chatgpt-plus-ready': ['Готовый аккаунт', 'ChatGPT Plus на готовом аккаунте для быстрых задач и общения.'],
      'chatgpt-go': ['Готовый аккаунт', 'Готовый аккаунт ChatGPT Go для большего количества сообщений и файлов.'],
      'chatgpt-plus-shared': ['Готовый аккаунт', 'Готовый аккаунт ChatGPT Plus для повседневных задач.'],
      'chatgpt-plus': ['Готовый аккаунт', 'Готовый аккаунт ChatGPT Plus для работы, учебы, изображений и ресерча.'],
      'chatgpt-business-seat': ['Готовый аккаунт', 'Готовый аккаунт ChatGPT Business для работы, команды и приватности.'],
      'grok-x-premium': ['Готовый аккаунт', 'Готовый аккаунт Grok через X Premium для быстрых задач.'],
      'grok-x-premium-plus': ['Готовый аккаунт', 'Готовый аккаунт Grok через X Premium+ с большим запасом лимитов.'],
      'supergrok': ['Готовый аккаунт', 'Готовый аккаунт SuperGrok с расширенными возможностями.'],
      'supergrok-heavy': ['Готовый аккаунт', 'Готовый аккаунт SuperGrok Heavy для самых высоких лимитов.'],
      'claude-pro-duo': ['2 аккаунта', 'Два готовых аккаунта Claude Pro по спеццене.'],
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
      'cursor-pro-duo': ['2 аккаунта', 'Два готовых аккаунта Cursor Pro по спеццене.'],
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
      'claude-pro': ['Ready account', 'Ready Claude Pro account for daily work, study and writing.'],
      'chatgpt-plus-ready': ['Ready account', 'ChatGPT Plus on a ready account for quick tasks and conversations.'],
      'chatgpt-go': ['Ready account', 'Ready ChatGPT Go account for more messages and file uploads.'],
      'chatgpt-plus-shared': ['Ready account', 'Ready ChatGPT Plus account for everyday tasks.'],
      'chatgpt-plus': ['Ready account', 'Ready ChatGPT Plus account for work, study, images and research.'],
      'chatgpt-business-seat': ['Ready account', 'Ready ChatGPT Business account for work, teams and privacy.'],
      'grok-x-premium': ['Ready account', 'Ready Grok account through X Premium for quick tasks.'],
      'grok-x-premium-plus': ['Ready account', 'Ready Grok account through X Premium+ with higher limits.'],
      'supergrok': ['Ready account', 'Ready SuperGrok account with expanded capabilities.'],
      'supergrok-heavy': ['Ready account', 'Ready SuperGrok Heavy account for the highest limits.'],
      'claude-pro-duo': ['2 accounts', 'Two ready Claude Pro accounts at a special price.'],
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
      'cursor-pro-duo': ['2 accounts', 'Two ready Cursor Pro accounts at a special price.'],
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
      'claude-pro': ['现成账号', '现成 Claude Pro 账号，适合日常工作、学习和写作。'],
      'chatgpt-plus-ready': ['现成账号', '现成 ChatGPT Plus 账号，适合快速任务和聊天。'],
      'chatgpt-go': ['现成账号', '现成 ChatGPT Go 账号，适合更多消息和文件上传。'],
      'chatgpt-plus-shared': ['现成账号', '现成 ChatGPT Plus 账号，适合日常任务。'],
      'chatgpt-plus': ['现成账号', '现成 ChatGPT Plus 账号，适合工作、学习、图片和研究。'],
      'chatgpt-business-seat': ['现成账号', '现成 ChatGPT Business 账号，适合工作、团队和隐私需求。'],
      'grok-x-premium': ['现成账号', '现成 Grok 账号，通过 X Premium 使用。'],
      'grok-x-premium-plus': ['现成账号', '现成 Grok 账号，通过 X Premium+ 获得更高额度。'],
      'supergrok': ['现成账号', '现成 SuperGrok 账号，提供扩展功能。'],
      'supergrok-heavy': ['现成账号', '现成 SuperGrok Heavy 账号，适合最高额度需求。'],
      'claude-pro-duo': ['2 个账号', '两个现成 Claude Pro 账号，价格更划算。'],
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
      'cursor-pro-duo': ['2 个账号', '两个现成 Cursor Pro 账号，价格更优惠。'],
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
      .then(({ paymentUrl }) => {
        if (paymentUrl) {
          openTelegramLink(paymentUrl)
        }

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
