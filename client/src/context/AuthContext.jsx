import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('taskflow_user') || 'null'));
  const [loading, setLoading] = useState(true);
  useEffect(() => { const token = localStorage.getItem('taskflow_token'); if (!token) return setLoading(false); api.get('/auth/me').then(({ data }) => setUser(data.user)).catch(() => { localStorage.removeItem('taskflow_token'); localStorage.removeItem('taskflow_user'); setUser(null); }).finally(() => setLoading(false)); }, []);
  const login = (data) => { localStorage.setItem('taskflow_token', data.token); localStorage.setItem('taskflow_user', JSON.stringify(data.user)); setUser(data.user); };
  const logout = () => { localStorage.removeItem('taskflow_token'); localStorage.removeItem('taskflow_user'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>{children}</AuthContext.Provider>;
}
