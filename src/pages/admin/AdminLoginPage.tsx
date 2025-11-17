import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../../features/auth/slices/authSlice";
import { authApi } from "../../api/auth/authApi";
import { storeTokens } from "../../utils/tokenUtils";
import { getErrorMessage } from "../../types/errors";

const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { loading = false, error = null } =
    useAppSelector((state) => state.auth) || {};

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      dispatch(loginFailure("Veuillez remplir tous les champs"));
      return;
    }

    try {
      dispatch(loginStart());

      const response = await authApi.adminLogin(email, password);

      if (response.user.role !== "super_admin") {
        dispatch(loginFailure("Accès réservé aux administrateurs"));
        return;
      }

      storeTokens(response.token, response.refreshToken, response.expiresIn);
      dispatch(loginSuccess(response.user));
      navigate("/admin/dashboard");
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      dispatch(loginFailure(errorMessage));
    }
  };

  // SVG des icônes (show/hide)
  const EyeIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOffIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 19C5 19 1 12 1 12a20.92 20.92 0 0 1 4.22-5.29M9.9 4.24A10.94 10.94 0 0 1 12 5c7 0 11 7 11 7a20.92 20.92 0 0 1-3.33 4.72M1 1l22 22" />
    </svg>
  );

  return (
    <div className="auth-page">
      <div className="auth-header">
        <h2 className="auth-title">Connexion Administrateur</h2>
        <p className="auth-subtitle">
          Accédez au panneau d'administration pour
        </p>
        <p className="auth-subtitle">gérer l'ensemble de la plateforme</p>
      </div>

      <div className="auth-card container-sm">
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="admin@plateforme.com"
            />
          </div>

          <div className="form-group password-input">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input password-input"
              placeholder="Votre mot de passe administrateur"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Afficher ou masquer le mot de passe"
            >
              {showPassword ? EyeOffIcon : EyeIcon}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
          >
            {loading ? "Connexion..." : "Accéder à l'administration"}
          </button>

          <div className="auth-links">
            <Link to="/forgot-password" className="auth-link">
              Mot de passe oublié ?
            </Link>
          </div>

          {/* <div className="auth-links">
            <div className="auth-divider">
              <span>Autres connexions</span>
            </div>

            <div className="auth-link-group-cards">
              <div className="auth-card-link">
                <Link to="/center/login" className="auth-link-card">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                    </svg>
                  </div>
                  <div className="card-content">
                    <h4>Espace Centre</h4>
                    <p>Gérez vos stades et réservations</p>
                  </div>
                  <div className="card-arrow">→</div>
                </Link>
              </div>

              <div className="auth-card-link">
                <Link to="/login" className="auth-link-card">
                  <div className="card-icon">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="card-content">
                    <h4>Espace Client</h4>
                    <p>Réservez vos matchs en ligne</p>
                  </div>
                  <div className="card-arrow">→</div>
                </Link>
              </div>
            </div>
          </div> */}
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
