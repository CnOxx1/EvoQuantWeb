import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/endpoints';
import { ADMIN_PATH } from '../../utils/constants';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login(username, password);
      authLogin(res.data.token);
      navigate(ADMIN_PATH, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-sm p-8">
        <h1 className="text-2xl font-bold text-white mb-8 text-center tracking-wider">evo quant</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full px-4 py-3 bg-transparent border border-gray-700 text-white placeholder-gray-500 focus:border-gray-400 outline-none transition-colors text-sm"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 bg-transparent border border-gray-700 text-white placeholder-gray-500 focus:border-gray-400 outline-none transition-colors text-sm"
            />
          </div>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 border border-white text-white hover:bg-white hover:text-black transition-colors duration-300 text-sm tracking-widest uppercase disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
