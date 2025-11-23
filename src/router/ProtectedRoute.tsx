import React from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../app/hooks";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>; 
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};
