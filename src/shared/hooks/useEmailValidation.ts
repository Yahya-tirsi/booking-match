import { useState } from "react";
import { authApi } from "../../api/auth/authApi";

interface UseEmailValidationReturn {
    checkEmailExists: (email: string) => Promise<boolean>;
    checkingEmail: boolean;
    emailError: string;
    setEmailError: (error: string) => void;
    clearEmailError: () => void;
}

export const useEmailValidation = (): UseEmailValidationReturn => {
    const [checkingEmail, setCheckingEmail] = useState<boolean>(false);
    const [emailError, setEmailError] = useState<string>("");

    const checkEmailExists = async (email: string): Promise<boolean> => {
        if (!email.trim()) return false;

        try {
            setCheckingEmail(true);
            const response = await authApi.checkEmailExists({ email });
            return response.exists;
        } catch (error) {
            console.error("Error checking email:", error);
            return false;
        } finally {
            setCheckingEmail(false);
        }
    };

    const clearEmailError = (): void => {
        setEmailError("");
    };

    return {
        checkEmailExists,
        checkingEmail,
        emailError,
        setEmailError,
        clearEmailError,
    };
};