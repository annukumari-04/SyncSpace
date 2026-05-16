import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const MemberRoute = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) return <Navigate to="/login" replace />;
  
  return children;
};
