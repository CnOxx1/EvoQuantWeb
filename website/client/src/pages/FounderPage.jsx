import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getFounders } from '../api/endpoints';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function FounderPage() {
  const { t, i18n } = useTranslation();
  const [founders, setFounders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFounders()
      .then(res => setFounders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getSocialIcon = (key) => {
    switch (key) {
      case 'github': return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
      );
      default: return null;
    }
  };

  return (
    <div>
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-center border-b border-[var(--border-color)]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('nav.founder')}</h1>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {loading ? (
          <LoadingSpinner />
        ) : founders.length === 0 ? (
          <p className="text-center text-[var(--text-muted)] py-12">
            {i18n.language === 'zh' ? '暫無創始人信息' : 'No founder information yet'}
          </p>
        ) : (
          founders.map(founder => {
            const socialLinks = typeof founder.social_links === 'string'
              ? JSON.parse(founder.social_links || '{}')
              : (founder.social_links || {});
            return (
              <div key={founder.id} className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                {/* Photo */}
                <div className="w-48 h-48 rounded-full overflow-hidden border border-[var(--border-color)] flex-shrink-0 bg-[var(--bg-secondary)]">
                  {founder.photo_url ? (
                    <img
                      src={founder.photo_url}
                      alt={i18n.language === 'zh' ? founder.name_zh : founder.name_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--text-muted)] text-sm">
                      Photo
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold mb-2">
                    {i18n.language === 'zh' ? founder.name_zh : founder.name_en}
                  </h2>
                  <p className="text-[var(--text-muted)] text-sm tracking-wide mb-4">
                    {i18n.language === 'zh' ? founder.title_zh : founder.title_en}
                  </p>
                  <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-lg mb-4">
                    {i18n.language === 'zh' ? founder.bio_zh : founder.bio_en}
                  </p>
                  {founder.email && (
                    <a href={`mailto:${founder.email}`} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                      {founder.email}
                    </a>
                  )}
                  {Object.keys(socialLinks).length > 0 && (
                    <div className="flex gap-4 mt-4 justify-center md:justify-start">
                      {Object.entries(socialLinks).map(([key, url]) => (
                        <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                          {getSocialIcon(key)}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </section>
    </div>
  );
}
