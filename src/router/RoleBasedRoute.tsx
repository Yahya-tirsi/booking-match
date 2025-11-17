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
  const { user } = useAppSelector((state) => state.auth);

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};
