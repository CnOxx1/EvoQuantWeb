import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { getPages, getAllLinks, getAllFounders, getAllPartners, getContacts } from '../../api/endpoints';

function DashboardContent() {
  const [stats, setStats] = useState({ pages: 0, links: 0, founders: 0, partners: 0, contacts: 0 });

  useEffect(() => {
    Promise.all([
      getPages().then(r => r.data.length).catch(() => 0),
      getAllLinks().then(r => r.data.length).catch(() => 0),
      getAllFounders().then(r => r.data.length).catch(() => 0),
      getAllPartners().then(r => r.data.length).catch(() => 0),
      getContacts(1).then(r => r.data.total).catch(() => 0),
    ]).then(([pages, links, founders, partners, contacts]) => {
      setStats({ pages, links, founders, partners, contacts });
    });
  }, []);

  const statCards = [
    { label: 'Pages', value: stats.pages },
    { label: 'Links', value: stats.links },
    { label: 'Founders', value: stats.founders },
    { label: 'Partners', value: stats.partners },
    { label: 'Messages', value: stats.contacts },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map(s => (
          <div key={s.label} className="p-6 border border-gray-200 dark:border-gray-800 rounded text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{s.value}</div>
            <div className="text-xs text-gray-400 mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <DashboardContent />
      </AdminLayout>
    </ProtectedRoute>
  );
}
