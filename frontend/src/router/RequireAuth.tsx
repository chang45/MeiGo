import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROLE_HOME, type Role } from '../types/auth';
import { useAuthStore } from '../store/auth';

interface RequireAuthProps {
  roles?: Role[];
}

export function RequireAuth({ roles }: RequireAuthProps) {
  const user = useAuthStore((state) => state.user);
  const location = useLocation();

  if (!user) {
    const redirect = `${location.pathname}${location.search}`;
    return <Navigate to={`/login?redirect=${encodeURIComponent(redirect)}`} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
}

export function GuestOnly() {
  const user = useAuthStore((state) => state.user);

  if (user) {
    return <Navigate to={ROLE_HOME[user.role]} replace />;
  }

  return <Outlet />;
}
