import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// ProtectedRoute Wrapper: Blocks unauthorized access
const ProtectedRoute = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Verifica se existe usuário E se o metadata dele define o papel como 'admin' ou se é o e-mail do dono
  const isAdmin = user?.app_metadata?.role === 'admin' || user?.email === 'vitormgdl22@gmail.com';

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    // Se logado mas não é admin, bloqueia (pode redirecionar para Home ou página de erro)
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
