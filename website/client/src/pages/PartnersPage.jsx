import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getPartners } from '../api/endpoints';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function PartnersPage() {
  const { t, i18n } = useTranslation();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPartners()
      .then(res => setPartners(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-center border-b border-[var(--border-color)]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('nav.partners')}</h1>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        {loading ? (
          <LoadingSpinner />
        ) : partners.length === 0 ? (
          <p className="text-center text-[var(--text-muted)] py-12">
            {i18n.language === 'zh' ? '暫無合作夥伴' : 'No partners yet'}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {partners.map(partner => (
              <div key={partner.id} className="group flex flex-col items-center text-center p-6 border border-[var(--border-color)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-all">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url}
                    alt={i18n.language === 'zh' ? partner.name_zh : partner.name_en}
                    className="h-16 object-contain mb-4 grayscale group-hover:grayscale-0 transition-all"
                  />
                ) : (
                  <div className="w-16 h-16 border border-[var(--border-color)] flex items-center justify-center text-[var(--text-muted)] text-xs mb-4">
                    Logo
                  </div>
                )}
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                  {i18n.language === 'zh' ? partner.name_zh : partner.name_en}
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  {i18n.language === 'zh' ? partner.description_zh : partner.description_en}
                </p>
                {partner.url && (
                  <a
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-4"
                  >
                    {i18n.language === 'zh' ? '訪問網站' : 'Visit'}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
