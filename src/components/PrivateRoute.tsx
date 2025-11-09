import { Navigate } from 'react-router-dom';
import { useAppSelector } from '@/store/hooks';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'admin';
}

export const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
  const { isAuthenticated, user } = useAppSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/services" replace />;
  }

  return <>{children}</>;
};
