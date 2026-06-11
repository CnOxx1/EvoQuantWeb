import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLinks } from '../api/endpoints';
import LoadingSpinner from '../components/common/LoadingSpinner';

export default function LinksPage() {
  const { t, i18n } = useTranslation();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getLinks()
      .then(res => setLinks(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Group by category
  const categories = {};
  links.forEach(link => {
    const cat = i18n.language === 'zh' ? link.category_zh : link.category_en;
    if (!categories[cat]) categories[cat] = [];
    categories[cat].push(link);
  });

  return (
    <div>
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-black text-center border-b border-[var(--border-color)]">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('nav.links')}</h1>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {loading ? (
          <LoadingSpinner />
        ) : Object.keys(categories).length === 0 ? (
          <p className="text-center text-[var(--text-muted)] py-12">
            {i18n.language === 'zh' ? '暫無連結' : 'No links yet'}
          </p>
        ) : (
          Object.entries(categories).map(([cat, catLinks]) => (
            <div key={cat} className="mb-16 last:mb-0">
              <h2 className="text-xl font-bold mb-8 pb-3 border-b border-[var(--border-color)]">{cat}</h2>
              <div className="grid gap-4 md:grid-cols-2">
                {catLinks.map(link => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-5 border border-[var(--border-color)] hover:border-[var(--text-muted)] hover:bg-[var(--bg-secondary)] transition-all group"
                  >
                    <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:underline mb-1">
                      {i18n.language === 'zh' ? link.title_zh : link.title_en}
                    </h3>
                    <p className="text-xs text-[var(--text-muted)]">
                      {i18n.language === 'zh' ? link.description_zh : link.description_en}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
