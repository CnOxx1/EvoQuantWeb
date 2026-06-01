import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { getContacts, markContactRead } from '../../api/endpoints';

function ContactsManagerContent() {
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  const load = (p = 1) => {
    getContacts(p).then(r => {
      setSubmissions(r.data.submissions);
      setTotal(r.data.total);
    }).catch(() => {});
  };

  useEffect(() => { load(page); }, [page]);

  const handleRead = async (id) => {
    await markContactRead(id);
    load(page);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Contact Submissions ({total})</h1>

      {selected ? (
        <div>
          <button onClick={() => { setSelected(null); load(page); }} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 mb-4 block">&larr; Back to list</button>
          <div className="space-y-4 max-w-2xl p-6 border border-gray-200 dark:border-gray-800 rounded">
            <div>
              <label className="text-xs text-gray-400">Name</label>
              <p className="text-sm text-gray-900 dark:text-white">{selected.name}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400">Email</label>
              <p className="text-sm text-gray-900 dark:text-white">{selected.email}</p>
            </div>
            {selected.company && (
              <div>
                <label className="text-xs text-gray-400">Company</label>
                <p className="text-sm text-gray-900 dark:text-white">{selected.company}</p>
              </div>
            )}
            <div>
              <label className="text-xs text-gray-400">Message</label>
              <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">{selected.message}</p>
            </div>
            <div>
              <label className="text-xs text-gray-400">Date</label>
              <p className="text-sm text-gray-500">{selected.created_at}</p>
            </div>
            {!selected.is_read && (
              <button onClick={() => handleRead(selected.id)} className="px-3 py-1 text-xs bg-black text-white dark:bg-white dark:text-black rounded">
                Mark as Read
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {submissions.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 cursor-pointer" onClick={() => setSelected(s)}>
                    <td className="px-4 py-3 text-gray-900 dark:text-white">{s.name}</td>
                    <td className="px-4 py-3 text-gray-500">{s.email}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{s.created_at}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded ${s.is_read ? 'bg-gray-100 dark:bg-gray-800 text-gray-500' : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'}`}>
                        {s.is_read ? 'Read' : 'New'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {total > 20 && (
            <div className="flex gap-2 mt-4 justify-center">
              {page > 1 && <button onClick={() => setPage(p => p - 1)} className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded">Prev</button>}
              {submissions.length === 20 && <button onClick={() => setPage(p => p + 1)} className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-700 rounded">Next</button>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function ContactsManager() {
  return <ProtectedRoute><AdminLayout><ContactsManagerContent /></AdminLayout></ProtectedRoute>;
}
