import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import CrudTable from '../../components/admin/CrudTable';
import { getAllFounders, createFounder, updateFounder, deleteFounder } from '../../api/endpoints';

const empty = { name_zh: '', name_en: '', title_zh: '', title_en: '', bio_zh: '', bio_en: '', photo_url: '', email: '', social_links: '{}', sort_order: 0, is_active: 1 };

function FoundersManagerContent() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const load = () => getAllFounders().then(r => setItems(r.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (editItem.id) await updateFounder(editItem.id, editItem);
    else await createFounder(editItem);
    setEditItem(null); load();
  };

  const handleDelete = async (row) => { if (confirm('Delete?')) { await deleteFounder(row.id); load(); } };

  if (editItem) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{editItem.id ? 'Edit Founder' : 'New Founder'}</h1>
        <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-gray-500 mb-1">Name (ZH)</label><input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.name_zh} onChange={e => setEditItem({...editItem, name_zh: e.target.value})} required /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Name (EN)</label><input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.name_en} onChange={e => setEditItem({...editItem, name_en: e.target.value})} required /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Title (ZH)</label><input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.title_zh} onChange={e => setEditItem({...editItem, title_zh: e.target.value})} required /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Title (EN)</label><input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.title_en} onChange={e => setEditItem({...editItem, title_en: e.target.value})} required /></div>
          </div>
          <div><label className="block text-xs text-gray-500 mb-1">Bio (ZH)</label><textarea rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.bio_zh || ''} onChange={e => setEditItem({...editItem, bio_zh: e.target.value})} /></div>
          <div><label className="block text-xs text-gray-500 mb-1">Bio (EN)</label><textarea rows={3} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.bio_en || ''} onChange={e => setEditItem({...editItem, bio_en: e.target.value})} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs text-gray-500 mb-1">Photo URL</label><input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.photo_url || ''} onChange={e => setEditItem({...editItem, photo_url: e.target.value})} /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Email</label><input type="email" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white" value={editItem.email || ''} onChange={e => setEditItem({...editItem, email: e.target.value})} /></div>
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
    { key: 'title_zh', label: 'Title' },
    { key: 'email', label: 'Email' },
    { key: 'is_active', label: 'Active', render: r => r.is_active ? 'Yes' : 'No' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Founders</h1>
      <CrudTable columns={columns} data={items} onEdit={setEditItem} onDelete={handleDelete} onAdd={() => setEditItem({...empty})} addLabel="Add Founder" />
    </div>
  );
}

export default function FoundersManager() {
  return <ProtectedRoute><AdminLayout><FoundersManagerContent /></AdminLayout></ProtectedRoute>;
}
