import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import { ADMIN_PATH } from './utils/constants';

// Public pages
import MainPage from './pages/MainPage';
import LinksPage from './pages/LinksPage';

// Admin - lazy loaded for code splitting
const AdminLoginPage = lazy(() => import('./pages/admin/LoginPage'));
const AdminDashboard = lazy(() => import('./pages/admin/DashboardPage'));
const AdminPagesManager = lazy(() => import('./pages/admin/PagesManager'));
const AdminLinksManager = lazy(() => import('./pages/admin/LinksManager'));
const AdminFoundersManager = lazy(() => import('./pages/admin/FoundersManager'));
const AdminPartnersManager = lazy(() => import('./pages/admin/PartnersManager'));
const AdminTranslationsManager = lazy(() => import('./pages/admin/TranslationsManager'));
const AdminSettingsManager = lazy(() => import('./pages/admin/SettingsManager'));
const AdminUploadsManager = lazy(() => import('./pages/admin/UploadsManager'));
const AdminContacts = lazy(() => import('./pages/admin/ContactsManager'));

function AdminFallback() {
  return <LoadingSpinner />;
}

export default function App() {
  return (
    <Routes>
      {/* Public — single scroll page */}
      <Route element={<Layout />}>
        <Route path="/" element={<MainPage />} />
        <Route path="/links" element={<LinksPage />} />
      </Route>

      {/* Admin */}
      <Route path={`${ADMIN_PATH}/login`} element={<Suspense fallback={<AdminFallback />}><AdminLoginPage /></Suspense>} />
      <Route path={ADMIN_PATH} element={<Suspense fallback={<AdminFallback />}><AdminDashboard /></Suspense>} />
      <Route path={`${ADMIN_PATH}/pages`} element={<Suspense fallback={<AdminFallback />}><AdminPagesManager /></Suspense>} />
      <Route path={`${ADMIN_PATH}/links`} element={<Suspense fallback={<AdminFallback />}><AdminLinksManager /></Suspense>} />
      <Route path={`${ADMIN_PATH}/founders`} element={<Suspense fallback={<AdminFallback />}><AdminFoundersManager /></Suspense>} />
      <Route path={`${ADMIN_PATH}/partners`} element={<Suspense fallback={<AdminFallback />}><AdminPartnersManager /></Suspense>} />
      <Route path={`${ADMIN_PATH}/translations`} element={<Suspense fallback={<AdminFallback />}><AdminTranslationsManager /></Suspense>} />
      <Route path={`${ADMIN_PATH}/settings`} element={<Suspense fallback={<AdminFallback />}><AdminSettingsManager /></Suspense>} />
      <Route path={`${ADMIN_PATH}/uploads`} element={<Suspense fallback={<AdminFallback />}><AdminUploadsManager /></Suspense>} />
      <Route path={`${ADMIN_PATH}/contacts`} element={<Suspense fallback={<AdminFallback />}><AdminContacts /></Suspense>} />

      {/* 404 */}
      <Route path="*" element={
        <div className="min-h-screen flex items-center justify-center bg-black text-white">
          <div className="text-center">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <p className="text-gray-400">Page not found</p>
          </div>
        </div>
      } />
    </Routes>
  );
}
