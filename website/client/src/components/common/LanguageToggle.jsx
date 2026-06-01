import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LANGUAGES } from '../../utils/constants';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const current = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 border border-[var(--border-color)] rounded text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
      >
        <FiGlobe className="w-3 h-3" />
        <span className="hidden sm:inline">{current.label}</span>
        <FiChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-32 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded shadow-lg z-50 py-1">
          {LANGUAGES.map(lang => (
            <button
              key={lang.code}
              onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                i18n.language === lang.code
                  ? 'text-[var(--text-primary)] font-medium bg-[var(--bg-secondary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
