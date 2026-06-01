import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { getAllSettings, updateSettings } from '../../api/endpoints';

function SettingsManagerContent() {
  const [rows, setRows] = useState([]);
  const [edits, setEdits] = useState({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getAllSettings().then(r => {
      setRows(r.data);
      const map = {};
      r.data.forEach(row => { map[row.key] = row.value; });
      setEdits(map);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    await updateSettings(edits);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
        <button onClick={handleSave} className="px-4 py-2 bg-black text-white dark:bg-white dark:text-black text-sm rounded">
          {saved ? 'Saved!' : 'Save All'}
        </button>
      </div>
      <div className="space-y-4 max-w-2xl">
        {Object.entries(edits).map(([key, value]) => (
          <div key={key}>
            <label className="block text-xs text-gray-500 mb-1">{key}</label>
            <input
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
              value={value}
              onChange={e => setEdits(prev => ({ ...prev, [key]: e.target.value }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsManager() {
  return <ProtectedRoute><AdminLayout><SettingsManagerContent /></AdminLayout></ProtectedRoute>;
}
