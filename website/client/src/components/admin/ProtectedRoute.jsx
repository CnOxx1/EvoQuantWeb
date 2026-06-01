import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ADMIN_PATH } from '../../utils/constants';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={`${ADMIN_PATH}/login`} replace />;
  }

  return children;
}
