import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { usePageContent } from '../hooks/usePageContent';
import ContentBlock from '../components/common/ContentBlock';
import LoadingSpinner from '../components/common/LoadingSpinner';

const evidenceBands = [
  { key: 'microstructure', zh: '市場微觀結構', en: 'Market Microstructure' },
  { key: 'derivatives', zh: '衍生品擁擠度', en: 'Derivatives Structure' },
  { key: 'cross_exchange', zh: '跨交易所執行', en: 'Cross-Exchange Execution' },
  { key: 'onchain', zh: '鏈上資本流', en: 'On-Chain Capital Flow' },
  { key: 'tokenomics', zh: '供給壓力', en: 'Tokenomics Supply Pressure' },
  { key: 'macro', zh: '宏觀背景', en: 'Macro Regime' },
  { key: 'news', zh: '新聞與事件', en: 'News & Events' },
  { key: 'attention', zh: '注意力與開發者活躍度', en: 'Attention & Builder Activity' },
];

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { data: page, loading } = usePageContent('home');

  if (loading) return <LoadingSpinner />;

  const heroSection = page?.sections?.find(s => s.section_key === 'hero');
  const overviewSection = page?.sections?.find(s => s.section_key === 'overview');

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative min-h-screen flex items-center justify-center bg-black px-4">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-transparent opacity-50 pointer-events-none" />
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {heroSection ? (
            <ContentBlock contentZh={heroSection.content_zh} contentEn={heroSection.content_en} />
          ) : (
            <>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6">
                {t('home.hero.tagline')}
              </h1>
              <p className="text-lg md:text-xl text-[var(--text-secondary)] mb-10 max-w-2xl mx-auto">
                {t('home.hero.subtitle')}
              </p>
            </>
          )}
          <Link
            to="/product"
            className="inline-block px-8 py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 text-sm tracking-widest uppercase"
          >
            {t('home.hero.cta')}
          </Link>
        </div>
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {overviewSection ? (
          <ContentBlock contentZh={overviewSection.content_zh} contentEn={overviewSection.content_en} />
        ) : (
          <>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{t('home.overview.title')}</h2>
            <p className="text-lg text-[var(--text-secondary)] leading-relaxed text-center max-w-3xl mx-auto">
              {t('home.overview.content')}
            </p>
          </>
        )}
      </section>

      {/* Evidence Bands Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[var(--border-color)]">
        <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">{t('home.evidence.title')}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {evidenceBands.map((band, idx) => (
            <div
              key={band.key}
              className="group p-6 border border-[var(--border-color)] hover:border-[var(--text-muted)] transition-all duration-300 hover:bg-[var(--bg-secondary)]"
            >
              <span className="text-3xl font-light text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                {String(idx + 1).padStart(2, '0')}
              </span>
              <h3 className="mt-4 text-sm font-medium text-[var(--text-primary)]">
                {i18n.language === 'zh' ? band.zh : band.en}
              </h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
