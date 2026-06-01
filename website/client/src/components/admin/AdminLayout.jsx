import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ADMIN_PATH } from '../../utils/constants';

const navItems = [
  { path: ADMIN_PATH, label: 'Dashboard', exact: true },
  { path: `${ADMIN_PATH}/pages`, label: 'Pages' },
  { path: `${ADMIN_PATH}/links`, label: 'Links' },
  { path: `${ADMIN_PATH}/founders`, label: 'Founders' },
  { path: `${ADMIN_PATH}/partners`, label: 'Partners' },
  { path: `${ADMIN_PATH}/translations`, label: 'Translations' },
  { path: `${ADMIN_PATH}/settings`, label: 'Settings' },
  { path: `${ADMIN_PATH}/uploads`, label: 'Uploads' },
  { path: `${ADMIN_PATH}/contacts`, label: 'Contacts' },
];

export default function AdminLayout({ children }) {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <aside className="w-56 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <span className="text-lg font-bold text-gray-900 dark:text-white">evo quant</span>
          <span className="block text-xs text-gray-400 mt-1">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const active = item.exact
              ? location.pathname === item.path
              : location.pathname.startsWith(item.path) && item.path !== ADMIN_PATH;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 text-sm rounded transition-colors ${
                  active
                    ? 'bg-black text-white dark:bg-white dark:text-black font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={logout}
            className="w-full px-3 py-2 text-sm text-left text-gray-500 hover:text-red-500 transition-colors rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Logout
          </button>
          <a href="/" target="_blank" className="block px-3 py-2 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
            View Site
          </a>
        </div>
      </aside>
      <main className="flex-1 p-6 overflow-y-auto bg-white dark:bg-gray-950">
        {children}
      </main>
    </div>
  );
}
