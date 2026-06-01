import { useTranslation } from 'react-i18next';
import { usePageContent } from '../hooks/usePageContent';
import ContentBlock from '../components/common/ContentBlock';
import LoadingSpinner from '../components/common/LoadingSpinner';

const statCards = [
  { zh: 'SQLite 应用表', en: 'SQLite Tables', value: '42' },
  { zh: '技术指标列', en: 'Indicator Columns', value: '181' },
  { zh: '市场上下文列', en: 'Context Columns', value: '21' },
  { zh: '跨所执行列', en: 'Exchange Columns', value: '90' },
  { zh: '宏观因子', en: 'Macro Factors', value: '15' },
  { zh: '链上因子', en: 'On-Chain Factors', value: '17' },
  { zh: '期权因子', en: 'Options Factors', value: '55' },
  { zh: '替代因子', en: 'Alt. Factors', value: '28' },
];

export default function ProductPage() {
  const { t, i18n } = useTranslation();
  const { data: page, loading } = usePageContent('product');

  if (loading) return <LoadingSpinner />;

  const sections = page?.sections || [];

  return (
    <div>
      {/* Page Header */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-center border-b border-[var(--border-color)]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('product.title')}</h1>
        <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
          {i18n.language === 'zh'
            ? '一个面向AI的加密市场数据世界模型基础设施'
            : 'A cryptocurrency data world model infrastructure for AI-based market analysis'}
        </p>
      </section>

      {/* Dynamic sections from DB */}
      {sections.map((section) => (
        <section key={section.section_key} className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-b border-[var(--border-color)] last:border-b-0">
          <ContentBlock contentZh={section.content_zh} contentEn={section.content_en} />
        </section>
      ))}

      {/* Stats Grid */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {statCards.map((stat) => (
            <div key={stat.zh} className="p-8 border border-[var(--border-color)] text-center hover:bg-[var(--bg-secondary)] transition-colors">
              <div className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] mb-2">{stat.value}</div>
              <div className="text-xs text-[var(--text-muted)] tracking-wide">
                {i18n.language === 'zh' ? stat.zh : stat.en}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
