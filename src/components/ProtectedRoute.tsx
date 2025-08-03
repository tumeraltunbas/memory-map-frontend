import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../stores/store';

interface ProtectedRouteProps {
   children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
   const isAuthenticated = useSelector(
      (state: RootState) => state.user.isAuthenticated
   );

   if (!isAuthenticated) {
      return <Navigate to="/" replace />;
   }

   return <>{children}</>;
};
