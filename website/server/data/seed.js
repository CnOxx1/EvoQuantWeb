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
  { slug: 'home', title_zh: '首頁', title_en: 'Home', meta_zh: 'evo quant - AI市場分析的加密貨幣數據世界模型基礎設施', meta_en: 'evo quant - Cryptocurrency Data World Model Infrastructure for AI-Based Market Analysis' },
  { slug: 'product', title_zh: '產品介紹', title_en: 'Product', meta_zh: '了解evo quant的八大證據帶、數據管線與品質治理體系', meta_en: 'Explore the 8 evidence bands, data pipeline and quality governance of evo quant' },
  { slug: 'links', title_zh: '友情連結', title_en: 'Links', meta_zh: 'evo quant 友情連結與資源', meta_en: 'evo quant friendly links and resources' },
  { slug: 'contact', title_zh: '聯繫我們', title_en: 'Contact', meta_zh: '聯繫evo quant團隊', meta_en: 'Contact the evo quant team' },
  { slug: 'founder', title_zh: '創始人簡介', title_en: 'Founder', meta_zh: '了解evo quant的創始人團隊', meta_en: 'Meet the founders of evo quant' },
  { slug: 'partners', title_zh: '合作夥伴', title_en: 'Partners', meta_zh: 'evo quant的合作夥伴', meta_en: 'evo quant partners' },
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
  { page_id: pageMap.home, section_key: 'hero', sort_order: 1, content_zh: '<h1>從"模型優先"<br/>到"世界模型優先"</h1><p>面向AI市場分析的加密貨幣數據世界模型基礎設施</p>', content_en: '<h1>From "Model-First"<br/>to "World-Model-First"</h1><p>Cryptocurrency Data World Model Infrastructure for AI-Based Market Analysis</p>', content_ja: '<h1>迅速確実、<br/>知能無双</h1><p>AI市場分析のための暗号資産データ・ワールドモデル基盤</p>' },
  { page_id: pageMap.home, section_key: 'overview', sort_order: 2, content_zh: '<h2>核心命題</h2><p>多數AI交易系統失敗，並非因為模型不夠聰明，而是因為餵給模型的市場世界觀過於單薄——僅依賴價格序列與技術指標的淺層表徵，無法捕捉市場的深層結構與多維信號。</p><p>Evo-Quant 不直接使用AI下單。我們先將真實市場編譯成一個<strong>夠寬、夠穩、夠誠實</strong>的世界模型，透過八大證據帶的系統化數據採集與三層品質治理，將高維、非線性的潛在市場狀態逐步轉化為AI可消費的結構化情報。</p><p>這不是又一個交易策略——這是為AI決策系統提供<strong>市場認知層</strong>的基礎設施。</p>', content_en: '<h2>Core Thesis</h2><p>Most AI trading systems fail not because the model is not smart enough, but because the market worldview fed into the model is too thin — relying solely on price series and technical indicators as shallow representations misses the deep structure and multi-dimensional signals of the market.</p><p>Evo-Quant does not directly use AI to place orders. We first compile the real market into a <strong>broad, stable, and honest</strong> world model. Through systematic data acquisition across eight evidence bands and a three-layer quality governance framework, we progressively transform high-dimensional, non-linear latent market states into structured intelligence consumable by AI.</p><p>This is not another trading strategy — it is the <strong>market cognition layer</strong> infrastructure for AI decision systems.</p>', content_ja: '<h2>核心命題</h2><p>多くのAI取引システムが失敗するのは、モデルが十分に賢くないからではなく、モデルに与えられる市場の世界観が薄すぎるからです——価格系列とテクニカル指標のみの浅い表現では、市場の深層構造と多次元シグナルを捉えることができません。</p><p>Evo-QuantはAIを直接使って注文するのではありません。まず現実の市場を<strong>広く、安定し、誠実な</strong>世界モデルにコンパイルします。8つの証拠バンドによる体系的なデータ収集と3層の品質ガバナンスを通じて、高次元で非線形な潜在的市場状態を、AIが消費可能な構造化インテリジェンスへと段階的に変換します。</p><p>これはもう一つの取引戦略ではなく、AI意思決定システムのための<strong>市場認知層</strong>インフラストラクチャです。</p>' },
  { page_id: pageMap.home, section_key: 'features', sort_order: 3, content_zh: '<h2>八大證據帶</h2><ul><li>市場微觀結構</li><li>衍生品擁擠度</li><li>跨交易所執行</li><li>鏈上資本流</li><li>供給壓力</li><li>宏觀背景</li><li>新聞與事件</li><li>注意力與開發者活躍度</li></ul>', content_en: '<h2>8 Evidence Bands</h2><ul><li>Market Microstructure</li><li>Derivatives Structure</li><li>Cross-Exchange Execution</li><li>On-Chain Capital Flow</li><li>Tokenomics Supply Pressure</li><li>Macro Regime</li><li>News &amp; Events</li><li>Attention &amp; Builder Activity</li></ul>', content_ja: '<h2>8つの証拠バンド</h2><ul><li>市場微細構造</li><li>デリバティブ構造</li><li>クロス取引所執行</li><li>オンチェーン資本フロー</li><li>トークノミクス供給圧力</li><li>マクロレジーム</li><li>ニュース＆イベント</li><li>アテンション＆開発者活動</li></ul>' },
];

const insertSection = db.prepare('INSERT OR IGNORE INTO page_sections (page_id, section_key, sort_order, content_zh, content_en, content_ja) VALUES (?, ?, ?, ?, ?, ?)');
for (const s of homeSections) {
  insertSection.run(s.page_id, s.section_key, s.sort_order, s.content_zh, s.content_en, s.content_ja);
}

// Product page sections
const productSections = [
  { page_id: pageMap.product, section_key: 'product_header', sort_order: 0, content_zh: '<h2>產品介紹</h2><p>把複雜的市場數據，變成AI能讀懂的世界模型</p>', content_en: '<h2>Product</h2><p>Turning complex market data into a world model that AI can understand</p>', content_ja: '<h2>製品紹介</h2><p>複雑な市場データを、AIが理解できる世界モデルに変換する</p>' },
  { page_id: pageMap.product, section_key: 'architecture', sort_order: 1, content_zh: '<h2>運作方式</h2><p>想像一條數據生產線：從市場上採集原始資訊 → 清洗、整理、標準化 → 儲存到資料庫中 → 按邏輯重新組織 → 最終輸出給AI使用。</p><p>我們的角色不是交易員，更像是為AI打造一副<strong>看清市場的眼鏡</strong>——沒有這層基礎，再聰明的模型也只能看到片面零散的價格數字。</p>', content_en: '<h2>How It Works</h2><p>Think of it as a data refinery: raw market information is collected → cleaned, standardized, and stored → reorganized into logical structures → delivered to AI for analysis.</p><p>We are not traders. We build the <strong>lens through which AI sees the market</strong> — without this foundation, even the smartest model only sees fragmented price numbers.</p>', content_ja: '<h2>仕組み</h2><p>データの精製所をイメージしてください：市場から生の情報を収集 → クレンジング・標準化して保存 → 論理的な構造に再編成 → AI分析へと出力します。</p><p>私たちはトレーダーではありません。AIが市場を見るための<strong>レンズ</strong>を提供しています——この基盤がなければ、どんなに賢いモデルも断片的な価格データしか見ることができません。</p>' },
  { page_id: pageMap.product, section_key: 'modules', sort_order: 2, content_zh: '<h2>我們追蹤什麼</h2><p>就像氣象站同時監測氣溫、濕度、風速、氣壓……我們從<strong>8個不同維度</strong>持續觀測加密市場：交易所買賣動態、衍生品市場情緒、鏈上資金流向、代幣供應變化、全球宏觀環境、新聞與事件、市場關注度與開發者活躍度。</p><p>這些數據由11個自動運行的程式模組24小時不間斷採集，確保沒有一個重要信號被遺漏。</p>', content_en: '<h2>What We Track</h2><p>Just as a weather station monitors temperature, humidity, wind speed, and pressure simultaneously, we observe the crypto market from <strong>8 distinct dimensions</strong>: exchange trading dynamics, derivatives market sentiment, on-chain capital flows, token supply changes, global macro conditions, news and events, market attention, and developer activity.</p><p>These data streams are collected 24/7 by 11 automated modules, ensuring no critical signal is missed.</p>', content_ja: '<h2>追跡しているもの</h2><p>気象台が気温・湿度・風速・気圧を同時に監視するように、私たちは<strong>8つの異なる次元</strong>から暗号資産市場を観測します：取引所の売買動向、デリバティブ市場のセンチメント、オンチェーンの資金フロー、トークン供給の変化、グローバルなマクロ環境、ニュースとイベント、市場の注目度、開発者の活動。</p><p>これらのデータは11の自動化モジュールによって24時間365日収集され、重要なシグナルを見逃しません。</p>' },
  { page_id: pageMap.product, section_key: 'quality', sort_order: 3, content_zh: '<h2>數據品質</h2><p>機器學習領域有一條鐵律：<strong>垃圾進，垃圾出</strong>。數據品質直接決定了AI分析結果的可靠性。</p><p>我們為每一條數據標註三層品質標籤：數據源是否正常運行？採集到的數據是否完整可信？是否達到AI可用的標準？只有通過全部三道門檻的數據，才會被送入AI分析環節。</p>', content_en: '<h2>Data Quality</h2><p>A fundamental rule in machine learning: <strong>garbage in, garbage out</strong>. The quality of data directly determines the reliability of AI analysis.</p><p>We label every piece of data with three quality markers: Is the data source running normally? Is the collected data complete and trustworthy? Does it meet the threshold for AI consumption? Only data that passes all three checks enters the AI pipeline.</p>', content_ja: '<h2>データ品質</h2><p>機械学習の鉄則：<strong>ゴミを入れれば、ゴミが出てくる</strong>。データの品質がAI分析の信頼性を直接左右します。</p><p>私たちはすべてのデータに3つの品質マーカーを付与します：データソースは正常に動作しているか？収集されたデータは完全で信頼できるか？AIが消費できる基準を満たしているか？この3つのチェックを通過したデータだけがAIパイプラインに送られます。</p>' },
  { page_id: pageMap.product, section_key: 'specs', sort_order: 4, content_zh: '<h2>當前覆蓋範圍</h2><ul><li>支援交易對：BTC/USDT、ETH/USDT、SOL/USDT、SUI/USDT</li><li>涵蓋維度：技術面、市場微結構、衍生品、鏈上數據、宏觀經濟、新聞情緒、開發者活躍度等</li><li>數據持續積累中，覆蓋範圍穩步擴展</li></ul>', content_en: '<h2>Current Coverage</h2><ul><li>Supported pairs: BTC/USDT, ETH/USDT, SOL/USDT, SUI/USDT</li><li>Dimensions covered: technicals, market microstructure, derivatives, on-chain data, macroeconomics, news sentiment, developer activity, and more</li><li>Data coverage expanding steadily over time</li></ul>', content_ja: '<h2>現在のカバレッジ</h2><ul><li>対応取引ペア：BTC/USDT、ETH/USDT、SOL/USDT、SUI/USDT</li><li>カバーする次元：テクニカル、市場微細構造、デリバティブ、オンチェーンデータ、マクロ経済、ニュースセンチメント、開発者活動など</li><li>データカバレッジは継続的に拡大中</li></ul>' },
];

for (const s of productSections) {
  insertSection.run(s.page_id, s.section_key, s.sort_order, s.content_zh, s.content_en, s.content_ja);
}

// Founders
const foundersData = [
  { id: 1, name_zh: '李國聰', name_en: 'Li Guocong', name_ja: '李國聰', title_zh: '創始人 / Founder', title_en: 'Founder', title_ja: '創設者 / Founder', bio_zh: '研究方向為AI市場分析、量化數據基礎設施與金融統計建模。', bio_en: 'Research focuses on AI market analysis, quantitative data infrastructure, and financial statistical modeling.', bio_ja: '研究はAI市場分析、量的データインフラストラクチャ、金融統計モデリングに焦点を当てています。', photo_url: '/uploads/founders/li.jpg', email: 'lmu151638@gmail.com', social_links: '{"github":"https://github.com/CnOxx1"}', sort_order: 0 },
  { id: 2, name_zh: '劉一雄', name_en: 'YIXION LIU', name_ja: '劉一雄', title_zh: '聯合創始人', title_en: 'Co-Founder', title_ja: '共同創設者', bio_zh: '專注於系統架構設計與分布式數據採集。', bio_en: 'Focused on system architecture design and distributed data acquisition.', bio_ja: 'システムアーキテクチャ設計と分散データ収集に注力。', photo_url: '/uploads/founders/liu.jpg', email: 'qqq414841@gmail.com', social_links: '{}', sort_order: 1 },
  { id: 3, name_zh: 'Ming', name_en: 'Ming', name_ja: 'Ming', title_zh: '核心開發者', title_en: 'Core Developer', title_ja: 'コア開発者', bio_zh: '量化策略研發與數據管線建設。', bio_en: 'Quantitative strategy R&D and data pipeline engineering.', bio_ja: '量的戦略の研究開発とデータパイプライン構築。', photo_url: '/uploads/founders/ming.jpg', email: '', social_links: '{}', sort_order: 2 },
];

const insertFounder = db.prepare(
  'INSERT OR IGNORE INTO founders (id, name_zh, name_en, name_ja, title_zh, title_en, title_ja, bio_zh, bio_en, bio_ja, photo_url, email, social_links, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
);
for (const f of foundersData) {
  insertFounder.run(f.id, f.name_zh, f.name_en, f.name_ja, f.title_zh, f.title_en, f.title_ja, f.bio_zh, f.bio_en, f.bio_ja, f.photo_url, f.email, f.social_links, f.sort_order);
}

// Partner
db.prepare(
  `INSERT OR IGNORE INTO partners (id, name_zh, name_en, name_ja, logo_url, url, description_zh, description_en, description_ja, sort_order)
   VALUES (1, '泡泡道', 'PAOPAODAO', '泡泡道', '/uploads/partners/paopaodao.jpg', 'https://paopaodao.com', '聚焦加密貨幣市場數據分析與研究。', 'Focused on cryptocurrency market data analysis and research.', '暗号資産市場のデータ分析と研究に特化。', 0)`
).run();

// Default settings
const settings = [
  ['site_title_zh', 'evo quant'],
  ['site_title_en', 'evo quant'],
  ['site_subtitle_zh', '面向AI市場分析的加密貨幣數據世界模型基礎設施'],
  ['site_subtitle_en', 'Cryptocurrency Data World Model Infrastructure for AI-Based Market Analysis'],
  ['theme_mode', 'light'],
  ['contact_email', 'lmu151638@gmail.com'],
  ['footer_text_zh', '© 2026 evo quant. 保留所有權利。'],
  ['footer_text_en', '© 2026 evo quant. All rights reserved.'],
];

const insertSetting = db.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)');
for (const [key, value] of settings) {
  insertSetting.run(key, value);
}

// Sample translations
const translations = [
  ['zh', 'nav.home', '首頁'],
  ['zh', 'nav.product', '產品介紹'],
  ['zh', 'nav.links', '友情連結'],
  ['zh', 'nav.contact', '聯繫我們'],
  ['zh', 'nav.founder', '創始人簡介'],
  ['zh', 'nav.partners', '合作夥伴'],
  ['zh', 'home.hero.cta', '了解更多'],
  ['zh', 'home.overview.title', '核心命題'],
  ['zh', 'contact.form.name', '姓名'],
  ['zh', 'contact.form.email', '郵箱'],
  ['zh', 'contact.form.company', '公司'],
  ['zh', 'contact.form.message', '留言'],
  ['zh', 'contact.form.submit', '發送'],
  ['zh', 'contact.success', '消息已發送，感謝您的聯繫！'],
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
