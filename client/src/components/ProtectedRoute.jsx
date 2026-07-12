import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
export default function ProtectedRoute({ children, role }) { const { user, loading } = useAuth(); if (loading) return <div className="grid min-h-screen place-items-center text-indigo-600">Loading TaskFlow…</div>; if (!user) return <Navigate to="/login" replace />; if (role && user.role !== role) return <Navigate to={`/${user.role}`} replace />; return children; }
