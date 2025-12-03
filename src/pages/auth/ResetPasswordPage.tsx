import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authApi } from "../../api/auth/authApi";
import { usePageAnimation } from "../../shared/hooks/usePageAnimation";

const ResetPasswordPage: React.FC = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // For animation
  const { getStepClass } = usePageAnimation({
    steps: 3,
    delay: 50,
    initialDelay: 100,
  });

  // Password validation function
  const validatePassword = (password: string) => {
    const requirements = [
      {
        id: 1,
        text: "Au moins 8 caractères",
        met: password.length >= 8,
      },
      {
        id: 2,
        text: "Contient une majuscule",
        met: /[A-Z]/.test(password),
      },
      {
        id: 3,
        text: "Contient une minuscule",
        met: /[a-z]/.test(password),
      },
      {
        id: 4,
        text: "Contient un chiffre",
        met: /\d/.test(password),
      },
      {
        id: 5,
        text: "Contient un caractère spécial",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ];

    const isPasswordValid = requirements.every((req) => req.met);
    const metCount = requirements.filter((req) => req.met).length;
    const totalCount = requirements.length;

    return {
      requirements,
      isPasswordValid,
      metCount,
      totalCount,
      strength: metCount / totalCount,
    };
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Lien de réinitialisation invalide ou expiré");
      return;
    }

    if (!validatePassword(formData.password).isPasswordValid) {
      setError(
        "Le mot de passe ne respecte pas toutes les exigences de sécurité"
      );
      return;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword({
        email,
        token,
        newpassword: formData.password,
      });
      setSuccess(true);
    } catch (error: unknown) {
      let errorMessage = "Erreur lors de la réinitialisation du mot de passe";

      interface ApiError {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      }

      const errorObj = error as ApiError;

      if (errorObj.response?.data?.message) {
        errorMessage = errorObj.response.data.message;
      } else if (errorObj.message) {
        errorMessage = errorObj.message;
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBackToLogin = (): void => {
    navigate("/login");
  };

  // SVG Icons
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

  const SuccessIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--color-primary)"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );

  return (
    <div className="auth-page">
      <div className={`auth-card container-sm ${getStepClass(1)}`}>
        {!success ? (
          <>
            <div className={`auth-header ${getStepClass(2)}`}>
              <h2 className="auth-title">Réinitialiser le mot de passe</h2>
              <p className="auth-subtitle">
                Créez votre nouveau mot de passe sécurisé
              </p>
            </div>
            <form
              className={`auth-form ${getStepClass(3)}`}
              onSubmit={handleSubmit}
            >
              {error && <div className="form-error">{error}</div>}

              {!token && (
                <div className="form-error">
                  Lien de réinitialisation invalide ou expiré. Veuillez demander
                  un nouveau lien.
                </div>
              )}

              {/* Nouveau mot de passe */}
              <div className="form-group password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Nouveau mot de passe"
                  disabled={!token}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Afficher ou masquer le mot de passe"
                  disabled={!token}
                >
                  {showPassword ? EyeOffIcon : EyeIcon}
                </button>
              </div>

              {/* Password Requirements Checklist */}
              {formData.password &&
                !validatePassword(formData.password).isPasswordValid && (
                  <div className="password-feedback">
                    <div className="strength-meter">
                      <div
                        className="strength-bar"
                        style={{
                          width: `${
                            (validatePassword(formData.password).metCount /
                              validatePassword(formData.password).totalCount) *
                            100
                          }%`,
                          backgroundColor: validatePassword(formData.password)
                            .isPasswordValid
                            ? "#c1f11d"
                            : "#f59e0b",
                        }}
                      />
                    </div>
                    <div className="password-hints">
                      {validatePassword(formData.password).requirements.map(
                        (req) => (
                          <span
                            key={req.id}
                            className={`password-hint ${
                              req.met ? "met" : "unmet"
                            }`}
                          >
                            <span
                              className={`status-circle ${
                                req.met ? "met" : "unmet"
                              }`}
                            ></span>
                            {req.text}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                )}

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
                  placeholder="Confirmer le nouveau mot de passe"
                  disabled={!token}
                />
                <button
                  type="button"
                  className="eye-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label="Afficher ou masquer la confirmation du mot de passe"
                  disabled={!token}
                >
                  {showConfirmPassword ? EyeOffIcon : EyeIcon}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !token}
                className="btn btn-primary btn-full"
              >
                {loading
                  ? "Réinitialisation..."
                  : "Réinitialiser le mot de passe"}
              </button>

              <div className="auth-links">
                <Link to="/login" className="auth-link-text">
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className="success-message">
            <div className="success-icon-large">{SuccessIcon}</div>
            <h3 className="success-title">Mot de passe réinitialisé !</h3>
            <p className="success-text">
              Votre mot de passe a été réinitialisé avec succès.
            </p>
            <p className="success-note">
              Vous pouvez maintenant vous connecter avec votre nouveau mot de
              passe.
            </p>
            <div className="success-actions">
              <button
                onClick={handleBackToLogin}
                className="btn btn-primary"
                type="button"
              >
                Se connecter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
