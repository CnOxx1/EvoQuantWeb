import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAV_ITEMS } from '../../utils/constants';
import LanguageToggle from '../common/LanguageToggle';
import ThemeToggle from '../common/ThemeToggle';

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  // Track which section is in view (on the main page only)
  useEffect(() => {
    if (location.pathname !== '/') return;
    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => document.getElementById(item.slug));
      let current = 'home';
      for (const section of sections) {
        if (section) {
          const top = section.getBoundingClientRect().top;
          if (top < window.innerHeight * 0.4) {
            current = section.id;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (e, item) => {
    e.preventDefault();
    setMenuOpen(false);

    // If not on main page, navigate to / then scroll
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation, then scroll
      setTimeout(() => {
        const el = document.getElementById(item.slug);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    const el = document.getElementById(item.slug);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-26">
          {/* Logo — scrolls to top */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              if (location.pathname !== '/') { navigate('/'); return; }
              document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <img src="/logo.png" alt="evo quant" className="h-26 w-auto group-hover:opacity-80 transition-opacity" />
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.slug}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`text-sm tracking-wide transition-colors hover:text-[var(--text-primary)] cursor-pointer ${
                  activeSection === item.slug && location.pathname === '/'
                    ? 'text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {t(item.i18nKey)}
              </a>
            ))}
          </nav>

          {/* Right toggles */}
          <div className="flex items-center gap-3">
            <LanguageToggle />
            <ThemeToggle />
            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-[var(--border-color)]">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.slug}
                href={item.href}
                onClick={(e) => handleNavClick(e, item)}
                className={`block py-3 text-sm tracking-wide cursor-pointer ${
                  activeSection === item.slug && location.pathname === '/'
                    ? 'text-[var(--text-primary)] font-medium'
                    : 'text-[var(--text-secondary)]'
                }`}
              >
                {t(item.i18nKey)}
              </a>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
