import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useAppSelector((state) => state.auth);

  // Add loading state
  if (loading) {
    return <div>Loading...</div>; 
  }

  // Debug logging
  console.log("RoleBasedRoute - User:", user);
  console.log("RoleBasedRoute - User role:", user?.role);
  console.log("RoleBasedRoute - Allowed roles:", allowedRoles);

  if (!user || !allowedRoles.includes(user.role)) {
    console.log("Access denied - Redirecting to unauthorized");
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
