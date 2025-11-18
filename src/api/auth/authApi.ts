import { apiClient } from '../base/apiClient'
import type { LoginCredentials, RegisterData, User, AuthResponse } from '../../features/auth/types'

export const authApi = {
    /**
     * Login user with email, password and role
     */
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials)
        return response.data
    },

    /**
     * Register new user
     */
    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const response = await apiClient.post<AuthResponse>('/auth/register', userData)
        return response.data
    },

    /**
     * Get current user profile
     */
    getCurrentUser: async (): Promise<User> => {
        const response = await apiClient.get<User>('/auth/me')
        return response.data
    },

    /**
     * Logout user
     */
    logout: async (): Promise<void> => {
        await apiClient.post('/auth/logout')
        localStorage.removeItem('authToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('tokenExpiresAt')
    },

    /**
     * Refresh access token
     */
    refreshToken: async (): Promise<{ token: string; refreshToken: string }> => {
        const refreshToken = localStorage.getItem('refreshToken')
        const response = await apiClient.post<{ token: string; refreshToken: string }>('/auth/refresh', {
            refreshToken,
        })
        return response.data
    },
}