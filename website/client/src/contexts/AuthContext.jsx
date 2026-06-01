import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => sessionStorage.getItem('evo-admin-token') || null);

  const loginFn = useCallback((newToken) => {
    sessionStorage.setItem('evo-admin-token', newToken);
    setToken(newToken);
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('evo-admin-token');
    setToken(null);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login: loginFn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
