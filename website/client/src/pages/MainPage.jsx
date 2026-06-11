import { useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { usePageContent } from '../hooks/usePageContent';
import { submitContact } from '../api/endpoints';
import ContentBlock from '../components/common/ContentBlock';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ScrollReveal from '../components/common/ScrollReveal';
import AnimatedCounter from '../components/common/AnimatedCounter';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------
const evidenceBands = [
  { key: 'microstructure', zh: '市場微觀結構', ja: '市場微細構造', en: 'Market Microstructure', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { key: 'derivatives', zh: '衍生品擁擠度', ja: 'デリバティブ構造', en: 'Derivatives Structure', icon: 'M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z' },
  { key: 'cross_exchange', zh: '跨交易所執行', ja: 'クロス取引所執行', en: 'Cross-Exchange Execution', icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' },
  { key: 'onchain', zh: '鏈上資本流', ja: 'オンチェーン資本フロー', en: 'On-Chain Capital Flow', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  { key: 'tokenomics', zh: '供給壓力', ja: 'トークノミクス供給圧力', en: 'Tokenomics Supply Pressure', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { key: 'macro', zh: '宏觀背景', ja: 'マクロレジーム', en: 'Macro Regime', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064' },
  { key: 'news', zh: '新聞與事件', ja: 'ニュース＆イベント', en: 'News & Events', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
  { key: 'attention', zh: '注意力與開發者活躍度', ja: 'アテンション＆開発者活動', en: 'Attention & Builder Activity', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z' },
];

const statCards = [
  { zh: 'SQLite 應用表', ja: 'SQLiteテーブル', en: 'SQLite Tables', value: '42' },
  { zh: '技術指標列', ja: 'テクニカル指標列', en: 'Indicator Columns', value: '181' },
  { zh: '市場上下文列', ja: '市場コンテキスト列', en: 'Context Columns', value: '21' },
  { zh: '跨所執行列', ja: '取引所実行列', en: 'Exchange Columns', value: '90' },
  { zh: '宏觀因子', ja: 'マクロ因子', en: 'Macro Factors', value: '15' },
  { zh: '鏈上因子', ja: 'オンチェーン因子', en: 'On-Chain Factors', value: '17' },
  { zh: '期權因子', ja: 'オプション因子', en: 'Options Factors', value: '55' },
  { zh: '替代因子', ja: '代替因子', en: 'Alt. Factors', value: '28' },
];

// ---------------------------------------------------------------------------
// Floating particles decoration
// ---------------------------------------------------------------------------
function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-black/5"
          style={{
            width: `${40 + Math.random() * 80}px`,
            height: `${40 + Math.random() * 80}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Theoretical Framework — 从潜在市场状态到AI可见世界
// ---------------------------------------------------------------------------
function FrameworkSection() {
  const { t } = useTranslation();

  const pillars = ['pillar1', 'pillar2', 'pillar3', 'pillar4'];

  const visionItems = [
    { key: 'vision_1', icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 2a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z' },
    { key: 'vision_2', icon: 'M7 3a1 1 0 000 2h10a1 1 0 100-2H7zM4 7a1 1 0 011-1h14a1 1 0 110 2H5a1 1 0 01-1-1zm1 4a1 1 0 100 2h14a1 1 0 100-2H5zm-1 5a1 1 0 011-1h6a1 1 0 110 2H5a1 1 0 01-1-1zm9 0a1 1 0 011-1h4a1 1 0 110 2h-4a1 1 0 01-1-1z' },
    { key: 'vision_3', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
    { key: 'vision_4', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10-2a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z' },
  ];

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--border-color)] overflow-hidden">
      <FloatingParticles />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-secondary)]/50 to-[var(--bg-primary)]" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section header */}
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-3 tracking-tight">
            {t('home.framework.title')}
          </h2>
          <p className="text-center text-[var(--text-muted)] text-sm mb-6">
            {t('home.framework.subtitle')}
          </p>
          <p className="text-center text-[var(--text-secondary)] text-base max-w-3xl mx-auto mb-16 leading-relaxed">
            {t('home.framework.description')}
          </p>
        </ScrollReveal>

        {/* Pipeline flow */}
        <div className="relative mb-20">
          {/* Connecting line removed */}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-3">
            {pillars.map((key, idx) => (
              <ScrollReveal key={key} delay={idx * 150}>
                <div className="group relative p-6 md:p-8 text-center border border-[var(--border-color)] hover:border-[var(--text-muted)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  {/* Step number */}
                  <div className="w-10 h-10 mx-auto mb-4 rounded-full border border-[var(--border-color)] flex items-center justify-center group-hover:border-[var(--text-muted)] transition-colors duration-300">
                    <span className="text-sm font-light text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors duration-300">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                  </div>
                  {/* Arrow for mobile */}
                  {idx < 3 && (
                    <div className="md:hidden absolute -bottom-3 left-1/2 -translate-x-1/2 text-[var(--text-muted)]">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  )}
                  <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)] group-hover:tracking-wide transition-all">
                    {t(`home.framework.${key}_title`)}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {t(`home.framework.${key}_desc`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* Vision model sub-section */}
        <ScrollReveal>
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold mb-3">
              {t('home.framework.vision_title')}
            </h3>
            <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[var(--text-muted)] to-transparent mx-auto" />
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visionItems.map((item, idx) => (
            <ScrollReveal key={item.key} delay={idx * 120}>
              <div className="group flex flex-col items-center text-center p-6 border border-[var(--border-color)] hover:border-[var(--text-muted)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 mb-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors duration-500">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
                  </svg>
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)] group-hover:tracking-wide transition-all">
                  {t(`home.framework.${item.key}`)}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Section Divider (geometric wave)
// ---------------------------------------------------------------------------
function SectionDivider() {
  return (
    <div className="w-full overflow-hidden leading-[0]" aria-hidden="true">
      <svg className="w-full h-8" viewBox="0 0 1200 40" preserveAspectRatio="none">
        <path d="M0,20 C200,0 400,40 600,20 C800,0 1000,40 1200,20 L1200,0 L0,0 Z" fill="currentColor" className="text-white dark:text-black" />
        <path d="M0,15 C200,35 400,-5 600,15 C800,35 1000,-5 1200,15 L1200,0 L0,0 Z" fill="currentColor" className="text-white/60 dark:text-black/60" />
      </svg>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Hero section with parallax background
// ---------------------------------------------------------------------------
function HeroSection({ heroSection }) {
  const { t, i18n } = useTranslation();
  const containerRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setOffset({ x: x * 30, y: y * 30 });
  }, []);

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-black"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: 'url(/ims.webp)',
          filter: 'blur(10px)',
          transform: `scale(1.15) translate(${offset.x}px, ${offset.y}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* Decorative grid lines */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {heroSection && i18n.language !== 'ja' ? (
          <ContentBlock
            contentZh={heroSection.content_zh}
            contentEn={heroSection.content_en}
            contentJa={heroSection.content_ja}
            className="text-white [&_h1]:mb-3 [&_p]:mt-0 [&_p]:text-lg [&_p]:md:text-xl"
          />
        ) : (
          <>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-3 text-white">
              {t('home.hero.tagline')}
            </h1>
            <p className="text-lg md:text-xl text-white mb-10 max-w-2xl mx-auto">
              {t('home.hero.subtitle')}
            </p>
          </>
        )}

        {/* Animated scroll indicator line */}
        <div className="mb-8">
          <div className="w-px h-12 mx-auto bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
        </div>

        <a
          href="#product"
          className="group inline-flex items-center gap-2 px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-all duration-300 text-sm tracking-widest uppercase cursor-pointer"
        >
          {t('home.hero.cta')}
          <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Download section
// ---------------------------------------------------------------------------
function DownloadSection() {
  const { t } = useTranslation();

  return (
    <section id="download" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--border-color)] overflow-hidden">
      <FloatingParticles />
      <div className="relative max-w-4xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{t('download.title')}</h2>
          <p className="text-center text-[var(--text-muted)] text-sm mb-16">
            {t('download.subtitle')}
          </p>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <a
            href="/main_cn_core.pdf"
            download
            className="group flex items-center gap-6 p-6 sm:p-8 border border-[var(--border-color)] hover:border-[var(--text-muted)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
          >
            {/* Logo */}
            <div className="flex-shrink-0 w-16 h-16 rounded-full overflow-hidden border-2 border-[var(--border-color)] group-hover:border-[var(--text-muted)] transition-all duration-500">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:tracking-wide transition-all mb-1">
                {t('download.whitepaper')}
              </h3>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-2">
                {t('download.whitepaper_desc')}
              </p>
              <span className="text-xs text-[var(--text-muted)]">
                PDF · 597 KB
              </span>
            </div>

            {/* Download button */}
            <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border border-[var(--text-primary)] text-[var(--text-primary)] group-hover:bg-[var(--text-primary)] group-hover:text-[var(--bg-primary)] transition-all duration-300 text-xs tracking-widest uppercase">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {t('download.download_btn')}
            </div>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Contact form (separated so it can be reused)
// ---------------------------------------------------------------------------
function ContactSection() {
  const { t, i18n } = useTranslation();
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await submitContact({ ...form, lang: i18n.language });
      setStatus('success');
      setForm({ name: '', email: '', company: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-[var(--border-color)] overflow-hidden">
      <FloatingParticles />
      <div className="relative max-w-2xl mx-auto">
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{t('contact.title')}</h2>
          <p className="text-center text-[var(--text-muted)] text-sm mb-12">
            {i18n.language === 'zh' ? '如有任何問題或合作意向，歡迎聯繫我們' : 'For any questions or collaboration inquiries, feel free to reach out'}
          </p>
        </ScrollReveal>

        {status === 'success' ? (
          <ScrollReveal>
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg text-[var(--text-primary)]">{t('contact.form.success')}</p>
              <button
                onClick={() => setStatus('idle')}
                className="mt-6 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-4 transition-colors"
              >
                {i18n.language === 'zh' ? '發送另一條消息' : 'Send another message'}
              </button>
            </div>
          </ScrollReveal>
        ) : (
          <ScrollReveal>
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 border-2 border-[var(--border-color)] rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-500">
              <div className="space-y-5">
                {[
                  { name: 'name', label: t('contact.form.name'), type: 'text', required: true },
                  { name: 'email', label: t('contact.form.email'), type: 'email', required: true },
                  { name: 'company', label: t('contact.form.company'), type: 'text', required: false },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs text-[var(--text-muted)] mb-1.5 tracking-wide uppercase transition-colors"
                      style={{ color: focused === field.name ? 'var(--text-primary)' : undefined }}>
                      {field.label}
                    </label>
                    <input
                      type={field.type} name={field.name} required={field.required} value={form[field.name]} onChange={handleChange}
                      onFocus={() => setFocused(field.name)} onBlur={() => setFocused(null)}
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-300 text-sm"
                      style={{ borderColor: focused === field.name ? 'var(--text-primary)' : undefined }}
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-xs text-[var(--text-muted)] mb-1.5 tracking-wide uppercase transition-colors"
                    style={{ color: focused === 'message' ? 'var(--text-primary)' : undefined }}>
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    name="message" required rows={5} value={form.message} onChange={handleChange}
                    onFocus={() => setFocused('message')} onBlur={() => setFocused(null)}
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border-2 border-[var(--border-color)] rounded text-[var(--text-primary)] placeholder-[var(--text-muted)] outline-none transition-all duration-300 text-sm resize-none"
                    style={{ borderColor: focused === 'message' ? 'var(--text-primary)' : undefined }}
                  />
                </div>
              </div>

              {status === 'error' && (
                <p className="text-red-400 text-sm mt-4 animate-shake">{t('contact.form.error')}</p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="group w-full mt-6 py-3 border-2 border-[var(--text-primary)] text-[var(--text-primary)] hover:bg-[var(--text-primary)] hover:text-[var(--bg-primary)] transition-all duration-300 text-sm tracking-widest uppercase disabled:opacity-50 rounded flex items-center justify-center gap-2"
              >
                {status === 'sending' ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    {t('contact.form.submit')}
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </ScrollReveal>
        )}
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function MainPage() {
  const { t, i18n } = useTranslation();
  const { data: homePage, loading: homeLoading } = usePageContent('home');
  const { data: productPage, loading: prodLoading } = usePageContent('product');
  if (homeLoading || prodLoading) return <LoadingSpinner />;

  const heroSection = homePage?.sections?.find(s => s.section_key === 'hero');
  const overviewSection = homePage?.sections?.find(s => s.section_key === 'overview');
  const productSections = productPage?.sections || [];

  return (
    <div>
      {/* ================================================================= */}
      {/* SECTION 1 — HOME (hero + overview + evidence bands)               */}
      {/* ================================================================= */}
      <HeroSection heroSection={heroSection} />

      {/* Theoretical Framework */}
      <FrameworkSection />

      {/* Overview */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto overflow-hidden">
        <FloatingParticles />
        <ScrollReveal>
          {overviewSection ? (
            <ContentBlock
              contentZh={overviewSection.content_zh}
              contentEn={overviewSection.content_en}
              contentJa={overviewSection.content_ja}
              className="max-w-3xl mx-auto text-center [&_h2]:text-3xl [&_h2]:md:text-4xl [&_h2]:font-bold [&_h2]:mb-8 [&_p]:text-base [&_p]:md:text-lg [&_p]:text-[var(--text-secondary)] [&_p]:leading-relaxed [&_p]:mb-5"
            />
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{t('home.overview.title')}</h2>
              <p className="text-lg text-[var(--text-secondary)] leading-relaxed text-center max-w-3xl mx-auto whitespace-pre-line">
                {t('home.overview.content')}
              </p>
            </>
          )}
        </ScrollReveal>
        {/* Decorative line after overview */}
        <div className="mt-16 flex justify-center">
          <div className="w-24 h-px bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />
        </div>
      </section>

      {/* Evidence Bands */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-color)] overflow-hidden">
        <FloatingParticles />
        <ScrollReveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">{t('home.evidence.title')}</h2>
          <p className="text-center text-[var(--text-muted)] text-sm mb-16 max-w-xl mx-auto">
            {i18n.language === 'zh' ? '多維數據觀測體系，構建完整的市場世界觀' : i18n.language === 'ja' ? '多次元観測システムによる完全な市場世界観の構築' : 'Multi-dimensional observation system for a complete market worldview'}
          </p>
        </ScrollReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {evidenceBands.map((band, idx) => (
            <ScrollReveal key={band.key} delay={idx * 80}>
              <div className="group relative p-6 border border-[var(--border-color)] hover:border-[var(--text-muted)] transition-all duration-500 hover:-translate-y-1 hover:shadow-lg cursor-default">
                {/* Icon */}
                <div className="mb-4 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors duration-500">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={band.icon} />
                  </svg>
                </div>
                <span className="text-3xl font-light text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors duration-500">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-4 text-sm font-medium text-[var(--text-primary)] group-hover:translate-x-1 transition-transform duration-300">
                  {i18n.language === 'zh' ? band.zh : i18n.language === 'ja' ? band.ja : band.en}
                </h3>
                {/* Hover accent bar */}
                <div className="absolute bottom-0 left-0 h-0.5 bg-[var(--text-primary)] w-0 group-hover:w-full transition-all duration-500" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 2 — PRODUCT                                               */}
      {/* ================================================================= */}
      <SectionDivider />

      <section id="product" className="relative bg-white">
        <div className="py-16 px-4 sm:px-6 lg:px-8 text-center border-b border-gray-200">
          <ScrollReveal>
            {(() => {
              const headerSection = productSections.find(s => s.section_key === 'product_header');
              if (headerSection && i18n.language !== 'ja') {
                return <ContentBlock contentZh={headerSection.content_zh} contentEn={headerSection.content_en} contentJa={headerSection.content_ja} className="text-black [&_h2]:text-4xl [&_h2]:md:text-5xl [&_h2]:font-bold [&_h2]:mb-4 [&_p]:text-gray-600 [&_p]:max-w-2xl [&_p]:mx-auto [&_p]:text-lg" />;
              }
              return (
                <>
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-black">{t('product.title')}</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    {i18n.language === 'zh'
                      ? '一個面向AI的加密市場數據世界模型基礎設施'
                      : i18n.language === 'ja'
                      ? 'AI市場分析のための暗号資産データ・ワールドモデル基盤'
                      : 'A cryptocurrency data world model infrastructure for AI-based market analysis'}
                  </p>
                </>
              );
            })()}
          </ScrollReveal>
        </div>

        {productSections.filter(s => s.section_key !== 'product_header').map((section, idx) => (
          <section key={section.section_key}
            className={`py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-gray-200 last:border-b-0 ${idx % 2 === 0 ? '' : 'bg-gray-50'}`}>
            <ScrollReveal>
              <ContentBlock contentZh={section.content_zh} contentEn={section.content_en} contentJa={section.content_ja} className="text-black [&_h2]:text-black [&_h3]:text-black [&_p]:text-gray-700 [&_ul]:text-gray-700" />
            </ScrollReveal>
          </section>
        ))}

        {/* Stats Grid */}
        <div className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gray-50">
          <ScrollReveal>
            <h3 className="text-2xl md:text-3xl font-bold text-black text-center mb-4">
              {i18n.language === 'zh' ? '技術規模一覽' : i18n.language === 'ja' ? '技術規模概要' : 'Technical Scale at a Glance'}
            </h3>
            <p className="text-gray-500 text-center text-sm mb-16 max-w-xl mx-auto">
              {i18n.language === 'zh' ? '覆蓋多維度的數據基礎設施' : i18n.language === 'ja' ? '多角的なデータインフラストラクチャのカバレッジ' : 'Multi-dimensional data infrastructure coverage'}
            </p>
          </ScrollReveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {statCards.map((stat, idx) => (
              <ScrollReveal key={stat.zh} delay={idx * 100}>
                <div className="group relative p-8 bg-white border border-gray-200 text-center hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-default">
                  <div className="text-3xl md:text-4xl font-bold text-black mb-2 tracking-tight">
                    <AnimatedCounter value={stat.value} />
                  </div>
                  <div className="text-xs text-gray-500 tracking-wide group-hover:text-black transition-colors">
                    {i18n.language === 'zh' ? stat.zh : i18n.language === 'ja' ? stat.ja : stat.en}
                  </div>
                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[16px] border-r-[16px] border-t-gray-100 border-r-transparent group-hover:border-t-black transition-colors duration-300" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* SECTION 3 — DOWNLOAD                                              */}
      {/* ================================================================= */}
      <DownloadSection />

      {/* ================================================================= */}
      {/* SECTION 4 — CONTACT                                               */}
      {/* ================================================================= */}
      <ContactSection />
    </div>
  );
}
