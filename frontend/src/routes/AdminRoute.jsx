import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AdminRoute = ({ children }) => {
  const { user, token } = useAuth();
  
  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== 'Admin') return <Navigate to="/member/dashboard" replace />;
  
  return children;
};
