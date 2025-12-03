import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAppDispatch } from "../../app/hooks";
import {
  registerStart,
  registerSuccess,
  registerFailure,
} from "../../features/auth/slices/authSlice";
import { authApi } from "../../api/auth/authApi";
import { storeToken } from "../../utils/tokenUtils";
// import { getErrorMessage } from "../../types/errors";
import type { RegisterData } from "../../features/auth/types";
import { usePageAnimation } from "../../shared/hooks/usePageAnimation";

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
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // For animation
  const { getStepClass } = usePageAnimation({
    steps: 3,
    delay: 50,
    initialDelay: 100,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailError("");
    setPhoneError("");
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

    const phoneRegex = /^(06|07)\d{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError(
        "Le numéro doit commencer par 06 ou 07 et contenir 10 chiffres"
      );
      return false;
    }

    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères");
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
        role: "client",
      };

      const response = await authApi.register(registerData);

      storeToken(response.token);

      dispatch(registerSuccess(response.user));
      navigate("/login");
    } catch (error: unknown) {
      let errorMessage = "Erreur lors de l'inscription";
      let emailSpecificError = "";

      const errorObj = error as {
        response?: {
          data?: {
            DuplicateEmail?: string[];
            DuplicateUserName?: string[];
            message?: string;
          };
        };
      };

      if (
        errorObj.response?.data?.DuplicateEmail?.[0]?.includes(
          "is already taken"
        )
      ) {
        emailSpecificError = "Cet email est déjà utilisé par un autre compte";
        errorMessage = "Cet email est déjà utilisé par un autre compte";
      } else if (errorObj.response?.data?.message) {
        errorMessage = errorObj.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      setEmailError(emailSpecificError);
      dispatch(registerFailure(errorMessage));
    } finally {
      setLoading(false);
    }
  };

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
      <div className={`auth-header ${getStepClass(1)}`}>
        <h2 className="auth-title">Créer un compte</h2>
        <p className="auth-subtitle">
          Rejoignez-nous et commencez à réserver vos
        </p>
        <p className="auth-subtitle">matchs de sport préférés</p>
      </div>

      <div className={`auth-card container-sm ${getStepClass(2)}`}>
        <form
          className={`auth-form ${getStepClass(3)}`}
          onSubmit={handleSubmit}
        >
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
              className={`form-input ${emailError ? "form-input-error" : ""}`}
              placeholder="Entrez votre e-mail"
            />
            {emailError && (
              <div
                className="field-error"
                style={{ fontSize: "15px", color: "red", textAlign: "left" }}
              >
                {emailError}
              </div>
            )}
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
                className={`form-input phone-number ${
                  phoneError ? "form-input-error" : ""
                }`}
                placeholder="Entrez votre numéro"
              />
            </div>
            {phoneError && (
              <div
                className="field-error"
                style={{ fontSize: "15px", color: "red", textAlign: "left" }}
              >
                {phoneError}
              </div>
            )}
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
          {/* Simple password strength indicator */}
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
                        className={`password-hint ${req.met ? "met" : "unmet"}`}
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
