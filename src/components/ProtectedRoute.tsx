import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';

interface Props {
  children: React.ReactElement;
  requiredRole?: 'admin' | 'member';
}

const ProtectedRoute: React.FC<Props> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    console.log('🛡️ ProtectedRoute check:', {
      path: location.pathname,
      user: user ? { id: user.id, role: user.role, hasApiKey: !!user.api_key } : null,
      requiredRole,
      hasUser: !!user,
      roleMatch: user ? user.role === requiredRole : false,
      loading
    });
  }, [user, requiredRole, location.pathname, loading]);
  
  // Attendre la fin du chargement avant de rediriger
  if (loading) {
    console.log('⏳ Loading user data...');
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    console.log('❌ No user, redirecting to /login');
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    console.log(`❌ Role mismatch: user has "${user.role}", required "${requiredRole}", redirecting to /`);
    return <Navigate to="/" />;
  }
  
  console.log('✅ Access granted');
  return children;
};

export default ProtectedRoute;
