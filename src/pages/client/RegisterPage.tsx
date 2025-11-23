import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../features/auth/slices/authSlice";
import { authApi } from "../../api/auth/authApi";
import { storeTokens } from "../../utils/tokenUtils";
import { getErrorMessage } from "../../types/errors";
import type { RegisterData } from "../../features/auth/types";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.fullName.trim()) {
      setError("Veuillez entrer votre prénom");
      return;
    }

    if (!formData.email.trim()) {
      setError("Veuillez entrer votre adresse e-mail");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Veuillez entrer votre numéro de téléphone");
      return;
    }

    if (formData.password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      dispatch(registerStart());

      const registerData: RegisterData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phoneNumber: formData.phone.trim(),
        password: formData.password,
        role: "client"
      };

      const response = await authApi.register(registerData);

      storeTokens(response.token, response.refreshToken, response.expiresIn);

      // const user: User = {
      //   id: response.user.id,
      //   email: response.user.email,
      //   name: response.user.name,
      //   phone: response.user.phone,
      //   avatar: response.user.avatar,
      //   createdAt: response.user.createdAt,
      //   updatedAt: response.user.updatedAt,
      // };

      dispatch(registerSuccess(response.user));
      navigate("/login");
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      dispatch(registerFailure(errorMessage));
      setError(errorMessage);
    } finally {
      setLoading(false);
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
        <h2 className="auth-title">Créer un compte</h2>
        <p className="auth-subtitle">Rejoignez-nous et commencez à réserver vos</p>
        <p className="auth-subtitle">matchs de sport préférés</p>
      </div>

      <div className="auth-card container-sm">
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <div className="form-error">{error}</div>}

          <div className="form-group">
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="form-input"
              placeholder="Entrez votre nom complet"
            />
          </div>

          <div className="form-group">
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Entrez votre e-mail"
            />
          </div>

          <div className="form-group">
            <div className="phone-input">
              <div className="phone-prefix">+212</div>
              <input
                id="phone"
                name="phone"
                type="text"
                required
                value={formData.phone}
                onChange={handleChange}
                className="form-input phone-number"
                placeholder="Entrez votre numéro"
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="form-group password-input">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={handleChange}
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

          {/* Confirmation mot de passe */}
          <div className="form-group password-input">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Confirmez votre mot de passe"
            />
            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              aria-label="Afficher ou masquer la confirmation du mot de passe"
            >
              {showConfirmPassword ? EyeOffIcon : EyeIcon}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
          >
            {loading ? "Création du compte..." : "Créer un compte"}
          </button>

          <div className="auth-links">
            <div className="auth-divider">
              <span>ou</span>
            </div>

            <Link to="/login" className="auth-link-btn">
              Se connecter à un compte existant
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
