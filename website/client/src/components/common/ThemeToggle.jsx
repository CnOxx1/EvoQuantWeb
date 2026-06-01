import { useTheme } from '../../contexts/ThemeContext';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
      title={theme === 'dark' ? '亮色模式' : '暗色模式'}
    >
      {theme === 'dark' ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
    </button>
  );
}
