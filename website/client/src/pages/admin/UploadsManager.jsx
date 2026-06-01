import { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ProtectedRoute from '../../components/admin/ProtectedRoute';
import { uploadFile } from '../../api/endpoints';

function UploadsManagerContent() {
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setResult(null);
    try {
      const res = await uploadFile(file);
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Upload Files</h1>
      <div className="max-w-md p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded text-center">
        <input
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleUpload}
          disabled={uploading}
          className="text-sm text-gray-600 dark:text-gray-400"
        />
        <p className="text-xs text-gray-400 mt-3">Supports JPEG, PNG, GIF, WebP — Max 5MB</p>
        {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        {result && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded text-left">
            <p className="text-xs text-gray-500 mb-1">Uploaded:</p>
            <code className="text-xs text-gray-900 dark:text-white break-all">{result.url}</code>
          </div>
        )}
      </div>
    </div>
  );
}

export default function UploadsManager() {
  return <ProtectedRoute><AdminLayout><UploadsManagerContent /></AdminLayout></ProtectedRoute>;
}
