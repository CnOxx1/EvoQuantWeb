const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });
const { getDb } = require('../config/db');

const db = getDb();

console.log('Seeding database...');

// Admin user (password: admin123 — change in production!)
const passwordHash = bcrypt.hashSync('admin123', 12);
db.prepare('INSERT OR IGNORE INTO admin_users (username, password_hash) VALUES (?, ?)').run('admin', passwordHash);

// Pages
const pages = [
  { slug: 'home', title_zh: '首页', title_en: 'Home', meta_zh: 'evo quant - AI市场分析的加密货币数据世界模型基础设施', meta_en: 'evo quant - Cryptocurrency Data World Model Infrastructure for AI-Based Market Analysis' },
  { slug: 'product', title_zh: '产品介绍', title_en: 'Product', meta_zh: '了解evo quant的八大证据带、数据管线与质量治理体系', meta_en: 'Explore the 8 evidence bands, data pipeline and quality governance of evo quant' },
  { slug: 'links', title_zh: '友情链接', title_en: 'Links', meta_zh: 'evo quant 友情链接与资源', meta_en: 'evo quant friendly links and resources' },
  { slug: 'contact', title_zh: '联系我们', title_en: 'Contact', meta_zh: '联系evo quant团队', meta_en: 'Contact the evo quant team' },
  { slug: 'founder', title_zh: '创始人简介', title_en: 'Founder', meta_zh: '了解evo quant的创始人团队', meta_en: 'Meet the founders of evo quant' },
  { slug: 'partners', title_zh: '合作伙伴', title_en: 'Partners', meta_zh: 'evo quant的合作伙伴', meta_en: 'evo quant partners' },
];

const insertPage = db.prepare('INSERT OR IGNORE INTO pages (slug, title_zh, title_en, meta_description_zh, meta_description_en) VALUES (?, ?, ?, ?, ?)');
for (const p of pages) {
  insertPage.run(p.slug, p.title_zh, p.title_en, p.meta_zh, p.meta_en);
}

// Get page IDs
const pageMap = {};
for (const p of pages) {
  const row = db.prepare('SELECT id FROM pages WHERE slug = ?').get(p.slug);
  if (row) pageMap[p.slug] = row.id;
}

// Home page sections
const homeSections = [
  { page_id: pageMap.home, section_key: 'hero', sort_order: 1, content_zh: '<h1>从"模型优先"到<br/>"世界模型优先"</h1><p>面向AI市场分析的加密货币数据世界模型基础设施</p>', content_en: '<h1>From "Model-First"<br/>to "World-Model-First"</h1><p>Cryptocurrency Data World Model Infrastructure for AI-Based Market Analysis</p>' },
  { page_id: pageMap.home, section_key: 'overview', sort_order: 2, content_zh: '<h2>核心命题</h2><p>多数AI交易系统失败，并非因为模型不够聪明，而是因为喂给模型的市场世界观过于单薄。</p><p>evo quant 不直接替AI下单，而是先把真实市场编译成一个<strong>够宽、够稳、够诚实</strong>的世界模型。</p>', content_en: '<h2>Core Thesis</h2><p>Most AI trading systems fail not because the model is not smart enough, but because the market worldview fed into the model is too thin.</p><p>evo quant does not trade for AI — it first compiles the real market into a <strong>broad, stable, and honest</strong> world model.</p>' },
  { page_id: pageMap.home, section_key: 'features', sort_order: 3, content_zh: '<h2>八大证据带</h2><ul><li>市场微观结构</li><li>衍生品拥挤度</li><li>跨交易所执行</li><li>链上资本流</li><li>供给压力</li><li>宏观背景</li><li>新闻与事件</li><li>注意力与开发者活跃度</li></ul>', content_en: '<h2>8 Evidence Bands</h2><ul><li>Market Microstructure</li><li>Derivatives Structure</li><li>Cross-Exchange Execution</li><li>On-Chain Capital Flow</li><li>Tokenomics Supply Pressure</li><li>Macro Regime</li><li>News &amp; Events</li><li>Attention &amp; Builder Activity</li></ul>' },
];

const insertSection = db.prepare('INSERT OR IGNORE INTO page_sections (page_id, section_key, sort_order, content_zh, content_en) VALUES (?, ?, ?, ?, ?)');
for (const s of homeSections) {
  insertSection.run(s.page_id, s.section_key, s.sort_order, s.content_zh, s.content_en);
}

// Product page sections
const productSections = [
  { page_id: pageMap.product, section_key: 'product_header', sort_order: 0, content_zh: '<h2>产品介绍</h2><p>一个面向AI的加密市场数据世界模型基础设施</p>', content_en: '<h2>Product</h2><p>A cryptocurrency data world model infrastructure for AI-based market analysis</p>' },
  { page_id: pageMap.product, section_key: 'architecture', sort_order: 1, content_zh: '<h2>系统架构</h2><p>真实世界 → 数据层采集与标准化 → 数据库与latest_*快照 → 逻辑层重组 → AI分析</p><p>该项目在AI交易栈中的位置更接近"市场现实的操作系统层"而非"策略层"。</p>', content_en: '<h2>System Architecture</h2><p>Real World → Data Layer Acquisition &amp; Standardization → Database &amp; latest_* Snapshots → Logic Layer Reassembly → AI Analysis</p><p>The project sits closer to the "operating system layer of market reality" than the "strategy layer" in the AI trading stack.</p>' },
  { page_id: pageMap.product, section_key: 'modules', sort_order: 2, content_zh: '<h2>模块化观测系统</h2><p>8个自动启动常驻数据模块 + 3个逻辑聚合模块，覆盖交易所、宏观、新闻、链上、供给、期权、替代数据与聚合层。</p>', content_en: '<h2>Modular Observation System</h2><p>8 auto-start persistent data modules + 3 logic aggregation modules, covering exchange, macro, news, on-chain, tokenomics, options, alternative data and aggregation layers.</p>' },
  { page_id: pageMap.product, section_key: 'quality', sort_order: 3, content_zh: '<h2>质量治理</h2><p>三层语义：health_status（健康运行）、quality_flag（ok/partial/fallback/stale/unknown）、is_ready_for_ai（门控）</p><p>AI真正消费的是通过质量门控的数据，而非所有落库数据的并集。</p>', content_en: '<h2>Quality Governance</h2><p>Three semantic layers: health_status, quality_flag (ok/partial/fallback/stale/unknown), is_ready_for_ai (gating)</p><p>AI only consumes data that has passed quality gating, not the union of all stored data.</p>' },
  { page_id: pageMap.product, section_key: 'specs', sort_order: 4, content_zh: '<h2>技术规模</h2><ul><li>SQLite应用表 42张</li><li>技术指标输出列 181个</li><li>市场上下文增强列 21个</li><li>跨所执行状态列 90个</li><li>宏观因子 15个 / 链上因子 17个</li><li>Tokenomics因子 12个 / 期权因子 55个</li><li>替代因子 28个</li><li>默认交易对: BTC/USDT, ETH/USDT, SOL/USDT, SUI/USDT</li></ul>', content_en: '<h2>Technical Scale</h2><ul><li>42 SQLite application tables</li><li>181 technical indicator columns</li><li>21 market context columns</li><li>90 cross-exchange execution columns</li><li>15 macro factors / 17 on-chain factors</li><li>12 tokenomics factors / 55 options factors</li><li>28 alternative factors</li><li>Default pairs: BTC/USDT, ETH/USDT, SOL/USDT, SUI/USDT</li></ul>' },
];

for (const s of productSections) {
  insertSection.run(s.page_id, s.section_key, s.sort_order, s.content_zh, s.content_en);
}

// Founder
db.prepare(
  `INSERT OR IGNORE INTO founders (id, name_zh, name_en, title_zh, title_en, bio_zh, bio_en, photo_url, email, social_links, sort_order)
   VALUES (1, '李国聪', 'Li Guocong', '创始人 / Founder', 'Founder', '研究方向为AI市场分析、量化数据基础设施与金融统计建模。', 'Research focuses on AI market analysis, quantitative data infrastructure, and financial statistical modeling.', '/uploads/founders/li.jpg', 'lmu151638@gmail.com', '{"github":"https://github.com/CnOxx1"}', 0)`
).run();

// Default settings
const settings = [
  ['site_title_zh', 'evo quant'],
  ['site_title_en', 'evo quant'],
  ['site_subtitle_zh', '面向AI市场分析的加密货币数据世界模型基础设施'],
  ['site_subtitle_en', 'Cryptocurrency Data World Model Infrastructure for AI-Based Market Analysis'],
  ['theme_mode', 'dark'],
  ['contact_email', 'lmu151638@gmail.com'],
  ['footer_text_zh', '© 2026 evo quant. 保留所有权利.'],
  ['footer_text_en', '© 2026 evo quant. All rights reserved.'],
];

const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
for (const [key, value] of settings) {
  insertSetting.run(key, value);
}

// Sample translations
const translations = [
  ['zh', 'nav.home', '首页'],
  ['zh', 'nav.product', '产品介绍'],
  ['zh', 'nav.links', '友情链接'],
  ['zh', 'nav.contact', '联系我们'],
  ['zh', 'nav.founder', '创始人简介'],
  ['zh', 'nav.partners', '合作伙伴'],
  ['zh', 'home.hero.cta', '了解更多'],
  ['zh', 'home.overview.title', '核心命题'],
  ['zh', 'contact.form.name', '姓名'],
  ['zh', 'contact.form.email', '邮箱'],
  ['zh', 'contact.form.company', '公司'],
  ['zh', 'contact.form.message', '留言'],
  ['zh', 'contact.form.submit', '发送'],
  ['zh', 'contact.success', '消息已发送，感谢您的联系！'],
  ['en', 'nav.home', 'Home'],
  ['en', 'nav.product', 'Product'],
  ['en', 'nav.links', 'Links'],
  ['en', 'nav.contact', 'Contact'],
  ['en', 'nav.founder', 'Founder'],
  ['en', 'nav.partners', 'Partners'],
  ['en', 'home.hero.cta', 'Learn More'],
  ['en', 'home.overview.title', 'Core Thesis'],
  ['en', 'contact.form.name', 'Name'],
  ['en', 'contact.form.email', 'Email'],
  ['en', 'contact.form.company', 'Company'],
  ['en', 'contact.form.message', 'Message'],
  ['en', 'contact.form.submit', 'Send'],
  ['en', 'contact.success', 'Message sent. Thank you for reaching out!'],
];

const insertTranslation = db.prepare('INSERT OR IGNORE INTO translations (lang, key, value) VALUES (?, ?, ?)');
for (const [lang, key, value] of translations) {
  insertTranslation.run(lang, key, value);
}

console.log('Seed complete!');
console.log('Admin login: admin / admin123');
console.log('Admin path: /eqwahXxcihIhMfcK');
process.exit(0);
