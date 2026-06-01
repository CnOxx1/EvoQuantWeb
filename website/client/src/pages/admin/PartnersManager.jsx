import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import CrudTable from '../../components/admin/CrudTable';
import { getAllPartners, createPartner, updatePartner, deletePartner } from '../../api/endpoints';

const empty = { name_zh: '', name_en: '', logo_url: '', url: '', description_zh: '', description_en: '', sort_order: 0, is_active: 1 };

function PartnersManagerContent() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const load = () => getAllPartners().then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (editItem.id) await updatePartner(editItem.id, editItem);
    else await createPartner(editItem);
    setEditItem(null); load();
  };

  const handleDelete = async (row) => { if (confirm('Delete?')) { await deletePartner(row.id); load(); } };

  if (editItem) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{editItem.id ? 'Edit Partner' : 'New Partner'}</h1>
        <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-gray-500 mb-1">Name (ZH)</label><input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.name_zh} onChange={e => setEditItem({...editItem, name_zh: e.target.value})} required /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Name (EN)</label><input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.name_en} onChange={e => setEditItem({...editItem, name_en: e.target.value})} required /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-gray-500 mb-1">Logo URL</label><input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.logo_url || ''} onChange={e => setEditItem({...editItem, logo_url: e.target.value})} /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Website URL</label><input type="url" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.url || ''} onChange={e => setEditItem({...editItem, url: e.target.value})} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-gray-500 mb-1">Description (ZH)</label><input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.description_zh || ''} onChange={e => setEditItem({...editItem, description_zh: e.target.value})} /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Description (EN)</label><input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.description_en || ''} onChange={e => setEditItem({...editItem, description_en: e.target.value})} /></div>
          </div>
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-sm rounded">Save</button>
            <button type="button" onClick={() => setEditItem(null)} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm rounded text-gray-600 dark:text-gray-400">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  const columns = [
    { key: 'name_zh', label: 'Name' },
    { key: 'url', label: 'URL', render: r => r.url ? <span className="text-xs">{r.url}</span> : '-' },
    { key: 'is_active', label: 'Active', render: r => r.is_active ? 'Yes' : 'No' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Partners</h1>
      <CrudTable columns={columns} data={items} onEdit={setEditItem} onDelete={handleDelete} onAdd={() => setEditItem({...empty})} addLabel="Add Partner" />
    </div>
  );
}

export default function PartnersManager() {
  return <ProtectedRoute><AdminLayout><PartnersManagerContent /></AdminLayout></ProtectedRoute>;
}
