import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm font-bold tracking-wider text-[var(--text-primary)]">
            evo quant
          </span>
          <p className="text-xs text-[var(--text-muted)]">
            {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
