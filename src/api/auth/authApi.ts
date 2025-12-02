import { api } from '../base/apiClient'
import type { LoginCredentials, RegisterData, AuthResponse } from '../../features/auth/types'
import type { ResetPasswordRequest, ResetPasswordResponse } from '../../types/common';
// import { encryptionService } from '../../utils/encryption';

export const authApi = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const encryptedCredentials = {
            email: credentials.email,
            password: credentials.password, // En clair pour l'instant
            // encryptedPassword: encryptionService.encryptPassword(credentials.password)
        };
        const response = await api.post<AuthResponse>('/auth/login', encryptedCredentials)
        return response.data
    },

    register: async (userData: RegisterData): Promise<AuthResponse> => {
        // const encryptedCredentials = {
        //     ...userData,
        //     password: encryptionService.encryptPassword(userData.password)
        // };
        const response = await api.post<AuthResponse>('/auth/register', userData)
        return response.data
    },

    checkEmailExists: async (data: { email: string }): Promise<{ exists: boolean }> => {
        const response = await api.get<{ exists: boolean }>(
            `/auth/check-email/${data.email}`
        );
        return response.data;
    },

    forgotPassword: async (email: string): Promise<{ message: string; success: boolean }> => {
        const response = await api.post<{ message: string; success: boolean }>('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (data: ResetPasswordRequest): Promise<ResetPasswordResponse> => {
        const response = await api.post<ResetPasswordResponse>('/auth/reset-password', data);
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/auth/logout')
        localStorage.removeItem('authToken')
    },
}