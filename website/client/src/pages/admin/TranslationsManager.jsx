import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { getAdminTranslations, updateTranslations } from '../../api/endpoints';

function TranslationsManagerContent() {
  const [lang, setLang] = useState('zh');
  const [rows, setRows] = useState([]);
  const [edits, setEdits] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAdminTranslations(lang).then(r => {
      setRows(r.data);
      const map = {};
      r.data.forEach(row => { map[row.key] = row.value; });
      setEdits(map);
    }).catch(() => {});
  }, [lang]);

  const handleSave = async () => {
    await updateTranslations(lang, edits);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAdd = () => {
    const key = prompt('Translation key (e.g., nav.about):');
    if (key) {
      setEdits(prev => ({ ...prev, [key]: '' }));
      setRows(prev => [...prev, { key, value: '' }]);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Translations</h1>
        <div className="flex items-center gap-3">
          <select value={lang} onChange={e => setLang(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
            <option value="zh">Chinese (zh)</option>
            <option value="en">English (en)</option>
            <option value="ja">Japanese (ja)</option>
          </select>
          <button onClick={handleAdd} className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-sm rounded text-gray-600 dark:text-gray-400">
            Add Key
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-sm rounded">
            {saved ? 'Saved!' : 'Save All'}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(edits).map(([key, value]) => (
          <div key={key} className="flex gap-4 items-start">
            <div className="w-56 pt-2">
              <code className="text-xs text-gray-500 break-all">{key}</code>
            </div>
            <input
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              value={value}
              onChange={e => setEdits(prev => ({ ...prev, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TranslationsManager() {
  return <ProtectedRoute><AdminLayout><TranslationsManagerContent /></AdminLayout></ProtectedRoute>;
}
