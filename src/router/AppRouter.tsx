import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleBasedRoute } from "./RoleBasedRoute";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/client/RegisterPage";
import BookingPage from "../pages/client/BookingPage";
import OwnerDashboardPage from "../pages/admin/OwnerDashboardPage";
import ForgotPasswordPage from "../pages/auth/ForgotPassword";
import ResetPasswordPage from "../pages/auth/ResetPasswordPage";

// Pages temporaires
const CenterDashboard = () => <div>Tableau de Bord Centre</div>;

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Routes publiques */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Routes protégées - Client */}
      {/* <Route
        path="/booking"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["Client"]}>
              <ClientBooking />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      /> */}

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

      {/* Routes protégées - Owner */}

      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["Owner"]}>
              <OwnerDashboardPage />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      />

      {/* Redirection par défaut */}
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
};
