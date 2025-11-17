import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";
import LoginPage from "../pages/client/LoginPage";
import RegisterPage from "../pages/client/RegisterPage";
import CenterLoginPage from "../pages/center/CenterLoginPage";
import AdminLoginPage from "../pages/admin/AdminLoginPage";

// Pages temporaires - à remplacer plus tard
const ClientBooking = () => <div>Espace Client - Réservations</div>;
const CenterDashboard = () => <div>Tableau de Bord Centre</div>;
const AdminDashboard = () => <div>Panneau Administrateur</div>;

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/center/login" element={<CenterLoginPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* Routes protégées - Client */}
      <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["client"]}>
              <ClientBooking />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Routes protégées - Centre */}
      <Route
        path="/center/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["center_owner"]}>
              <CenterDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Routes protégées - Admin */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["super_admin"]}>
              <AdminDashboard />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Redirection par défaut */}
      <Route path="/" element={<Navigate to="/booking" />} />
    </Routes>
  );
};
