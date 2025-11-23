// apiClient.ts
import axios from 'axios';
import { authApi } from '../auth/authApi';
import type { RefreshTokenResponse } from '../../features/auth/types';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Store the refresh token promise to prevent multiple simultaneous refresh attempts
let refreshTokenPromise: Promise<RefreshTokenResponse> | null = null;

// Request interceptor - add access token and safe logging
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Safe logging - hide sensitive data
        if (config.data) {
            const safeData = { ...config.data };

            if (safeData.password) safeData.password = '***HIDDEN***';
            if (safeData.confirmPassword) safeData.confirmPassword = '***HIDDEN***';
            if (safeData.currentPassword) safeData.currentPassword = '***HIDDEN***';
            if (safeData.newPassword) safeData.newPassword = '***HIDDEN***';
        } else {
            console.log(`${config.method?.toUpperCase()} ${config.url}`, config);
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle token refresh
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Use existing refresh promise if available to prevent multiple calls
                if (!refreshTokenPromise) {
                    refreshTokenPromise = authApi.refreshToken();
                }

                const { token, refreshToken } = await refreshTokenPromise;
                refreshTokenPromise = null;

                // Update tokens in localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('refreshToken', refreshToken);

                // Calculate and store token expiration time (default 15 minutes)
                const expiresIn = 15 * 60 * 1000; // 15 minutes in milliseconds
                const expiresAt = Date.now() + expiresIn;
                localStorage.setItem('tokenExpiresAt', expiresAt.toString());

                // Update the authorization header
                originalRequest.headers.Authorization = `Bearer ${token}`;

                // Retry the original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                refreshTokenPromise = null;
                // Refresh failed - logout user
                localStorage.removeItem('authToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('tokenExpiresAt');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);