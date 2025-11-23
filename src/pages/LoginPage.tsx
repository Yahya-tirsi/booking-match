import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../features/auth/slices/authSlice";
import { authApi } from "../api/auth/authApi";
import { storeTokens } from "../utils/tokenUtils";
import { getErrorMessage } from "../types/errors";
import { jwtDecode } from "jwt-decode";
import type { DecodedToken } from "../features/auth/types";
// import type { User } from "../features/auth/types";

const LoginPage: React.FC = () => {
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

      const response = await authApi.login({
        email,
        password,
      });

      storeTokens(response.token, response.refreshToken, response.expiresIn);

      const decodedToken: DecodedToken = jwtDecode(response.token);

      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

      switch (userRole) {
        case "Client":
          navigate("/booking");
          break;
        case "Center_owner":
          navigate("/center/dashboard");
          break;
        case "Owner":
          navigate("/owner/dashboard");
          break;
        default:
          navigate("/booking");
      }

      dispatch(loginSuccess(response.user));
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
        <h2 className="auth-title">Content de vous revoir,</h2>
        <p className="auth-subtitle">
          Nous sommes heureux de vous voir ici à nouveau. Entrez votre
        </p>
        <p className="auth-subtitle">adresse e-mail et mot de passe</p>
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
              placeholder="Entrez votre e-mail"
            />
          </div>

          <div className="form-group password-input">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Entrez votre mot de passe"
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
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          <div className="auth-links">
            <Link to="/forgot-password" className="auth-link">
              Mot de passe oublié ?
            </Link>

            <div className="auth-divider">
              <span>ou</span>
            </div>

            <Link to="/register" className="auth-link-btn">
              Créer un compte
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
