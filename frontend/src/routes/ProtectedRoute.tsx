import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../api/auth";
import { getDashboardPathForRole } from "../context/AuthContext";

interface ProtectedRouteProps {
  roles?: UserRole[];
  children: ReactNode;
}

export const ProtectedRoute = ({ roles, children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-slate-500">
        Checking authentication...
      </div>
    );
  }

  if (!user) {
    //return <Navigate to="/login" replace />;
    return <Navigate to="/" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getDashboardPathForRole(user.role)} replace />;
  }
  // All good → render the protected children (e.g. DashboardLayout)
  return <>{children}</>;
  // return <Outlet />;
};

export default ProtectedRoute;
