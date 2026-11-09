import { Navigate } from 'react-router-dom';
import { useGame } from '@/context/GameContext';

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user } = useGame();
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.is_admin) return <Navigate to="/" replace />;
  return children;
}