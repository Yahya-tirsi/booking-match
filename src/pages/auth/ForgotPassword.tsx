import React, { useState } from "react";
import { Link } from "react-router-dom";
import { authApi } from "../../api/auth/authApi";
import { useEmailValidation } from "../../shared/hooks/useEmailValidation";
import { usePageAnimation } from "../../shared/hooks/usePageAnimation";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const {
    checkEmailExists,
    checkingEmail,
    emailError,
    setEmailError,
    clearEmailError,
  } = useEmailValidation();

  // For animation
  const { getStepClass } = usePageAnimation({
    steps: 3,
    delay: 50,
    initialDelay: 100,
  });

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setEmailError("");
    setLoading(true);

    if (!email.trim()) {
      setError("Veuillez entrer votre adresse e-mail");
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Veuillez entrer une adresse e-mail valide");
      setLoading(false);
      return;
    }

    try {
      // Check if email exists before sending link
      const emailExists = await checkEmailExists(email);
      if (!emailExists) {
        setEmailError("Aucun compte trouvé avec cet email");
        setLoading(false);
        return;
      }

      // If email exists, send reset password link
      await authApi.forgotPassword(email);
      setSuccess(true);
    } catch (error: unknown) {
      let errorMessage = "Erreur lors de l'envoi du lien de réinitialisation";

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

  const handleRetry = (): void => {
    setSuccess(false);
    setEmail("");
    setError("");
    setEmailError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    clearEmailError();
    // Clear email error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  // SVG Icon for email
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
      <div className={`auth-card container-sm ${getStepClass(2)}`}>
        {!success ? (
          <>
            <div className={`auth-header ${getStepClass(1)}`}>
              <h2 className="auth-title">Mot de passe oublié</h2>
              <p className="auth-subtitle">
                Entrez votre adresse e-mail pour recevoir un lien de
                réinitialisation
              </p>
            </div>
            <form
              className={`auth-form ${getStepClass(3)}`}
              onSubmit={handleSubmit}
            >
              {error && <div className="form-error">{error}</div>}

              <div className="form-group">
                <div className="input-with-icon">
                  <div className="input-icon"></div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={handleEmailChange}
                    className={`form-input ${
                      emailError ? "form-input-error" : ""
                    }`}
                    placeholder="Entrez votre adresse e-mail"
                    disabled={loading || checkingEmail}
                  />
                </div>
                {emailError && <div className="field-error">{emailError}</div>}
              </div>

              <button
                type="submit"
                disabled={loading || checkingEmail}
                className="btn btn-primary btn-full"
              >
                {loading
                  ? "Envoi en cours..."
                  : checkingEmail
                  ? "Vérification..."
                  : "Envoyer le lien de réinitialisation"}
              </button>

              <div className="auth-links">
                <Link to="/login" className="auth-link-text">
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          </>
        ) : (
          <div className={`success-message`}>
            <div className="success-content">
              <div className="success-icon-large">{SuccessIcon}</div>
              <h3 className="success-title">E-mail envoyé avec succès !</h3>
              <p className="success-text">
                Nous avons envoyé un lien de réinitialisation à :
                <br />
                <strong className="email-highlight">{email}</strong>
              </p>
              <div className="success-instructions">
                <p>Pour réinitialiser votre mot de passe :</p>
                <ol className="instructions-list">
                  <li>Ouvrez votre boîte de réception</li>
                  <li>Cherchez l'e-mail de réinitialisation</li>
                  <li>Cliquez sur le lien dans l'e-mail</li>
                </ol>
              </div>
              <div className="success-warning">
                <strong>⏱️ Important : Ce lien expirera dans 10 minutes</strong>
              </div>
            </div>
            <div className="success-actions">
              <Link to="/login" className="btn btn-primary">
                Retour à la connexion
              </Link>
              <button
                onClick={handleRetry}
                className="btn btn-secondary"
                type="button"
              >
                Réessayer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
