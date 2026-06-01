import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import CrudTable from '../../components/admin/CrudTable';
import { getAllLinks, createLink, updateLink, deleteLink } from '../../api/endpoints';

const emptyLink = { category_zh: '', category_en: '', title_zh: '', title_en: '', url: '', description_zh: '', description_en: '', sort_order: 0, is_active: 1 };

function LinksManagerContent() {
  const [links, setLinks] = useState([]);
  const [editItem, setEditItem] = useState(null);

  const load = () => getAllLinks().then(r => setLinks(r.data)).catch(() => {});

  useEffect(() => { load(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (editItem.id) {
      await updateLink(editItem.id, editItem);
    } else {
      await createLink(editItem);
    }
    setEditItem(null);
    load();
  };

  const handleDelete = async (row) => {
    if (confirm('Delete this link?')) {
      await deleteLink(row.id);
      load();
    }
  };

  if (editItem) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{editItem.id ? 'Edit Link' : 'New Link'}</h1>
        <form onSubmit={handleSave} className="space-y-4 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category (ZH)</label>
              <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                value={editItem.category_zh} onChange={e => setEditItem({...editItem, category_zh: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Category (EN)</label>
              <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                value={editItem.category_en} onChange={e => setEditItem({...editItem, category_en: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Title (ZH)</label>
              <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                value={editItem.title_zh} onChange={e => setEditItem({...editItem, title_zh: e.target.value})} required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Title (EN)</label>
              <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                value={editItem.title_en} onChange={e => setEditItem({...editItem, title_en: e.target.value})} required />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">URL</label>
            <input type="url" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              value={editItem.url} onChange={e => setEditItem({...editItem, url: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Description (ZH)</label>
              <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                value={editItem.description_zh || ''} onChange={e => setEditItem({...editItem, description_zh: e.target.value})} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Description (EN)</label>
              <input className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                value={editItem.description_en || ''} onChange={e => setEditItem({...editItem, description_en: e.target.value})} />
            </div>
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
    { key: 'category_zh', label: 'Category' },
    { key: 'title_zh', label: 'Title' },
    { key: 'url', label: 'URL', render: r => <span className="text-xs truncate max-w-[200px] block">{r.url}</span> },
    { key: 'is_active', label: 'Active', render: r => r.is_active ? 'Yes' : 'No' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Manage Links</h1>
      <CrudTable columns={columns} data={links} onEdit={setEditItem} onDelete={handleDelete}
        onAdd={() => setEditItem({...emptyLink})} addLabel="Add Link" />
    </div>
  );
}

export default function LinksManager() {
  return <ProtectedRoute><AdminLayout><LinksManagerContent /></AdminLayout></ProtectedRoute>;
}
