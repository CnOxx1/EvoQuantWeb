export default function CrudTable({ columns, data, onEdit, onDelete, onAdd, addLabel = 'Add New' }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{onAdd ? 'Records' : ''}</h2>
        {onAdd && (
          <button
            onClick={onAdd}
            className="px-4 py-2 text-sm bg-black text-white dark:bg-white dark:text-black rounded hover:opacity-80 transition-opacity"
          >
            {addLabel}
          </button>
        )}
      </div>
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-800 rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              {columns.map(col => (
                <th key={col.key} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-8 text-center text-gray-400">
                  No records found
                </td>
              </tr>
            ) : (
              data.map(row => (
                <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-gray-700 dark:text-gray-300 max-w-xs truncate">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right space-x-2">
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="text-xs text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="text-xs text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
