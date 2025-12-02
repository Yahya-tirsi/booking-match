import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:5001/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add access token and safe logging
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Safe logging - hide sensitive data
        if (config.data && import.meta.env.NODE_ENV === 'development') {
            const safeData = { ...config.data };

            // Masquer les mots de passe dans les logs
            const sensitiveFields = [
                'password',
                'confirmPassword',
                'currentPassword',
                'newPassword',
                'oldPassword'
            ];

            sensitiveFields.forEach(field => {
                if (safeData[field]) {
                    safeData[field] = '***HIDDEN***';
                }
            });

            console.log('📤 API Request:', {
                url: config.url,
                method: config.method,
                data: safeData,
                headers: {
                    ...config.headers,
                    Authorization: token ? 'Bearer ***' : undefined
                }
            });
        }

        return config;
    },
    (error) => {
        console.error('❌ Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors (NO token refresh logic)
api.interceptors.response.use(
    (response) => {
        // Log successful responses in development
        if (import.meta.env.NODE_ENV === 'development') {
            console.log('📥 API Response:', {
                url: response.config.url,
                status: response.status,
                data: response.data
            });
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Log error in development
        if (import.meta.env.NODE_ENV === 'development') {
            console.error('❌ API Error:', {
                url: originalRequest?.url,
                status: error.response?.status,
                message: error.message,
                response: error.response?.data
            });
        }

        // Handle 401 Unauthorized - Token expired or invalid
        if (error.response?.status === 401) {
            console.log('🔐 Token expired or invalid');

            // Clear the invalid token
            localStorage.removeItem('authToken');

            return Promise.reject({
                ...error,
                message: 'Session expired. Please login again.'
            });
        }

        // Handle 403 Forbidden - Insufficient permissions
        if (error.response?.status === 403) {
            return Promise.reject({
                ...error,
                message: 'You do not have permission to perform this action.'
            });
        }

        // Handle network errors
        if (!error.response) {
            console.error('🌐 Network error:', error.message);
            return Promise.reject({
                ...error,
                message: 'Network error. Please check your connection.'
            });
        }

        // For all other errors, return a user-friendly message if available
        const serverMessage = error.response?.data?.message ||
            error.response?.data?.title ||
            error.response?.data?.error;

        if (serverMessage) {
            return Promise.reject({
                ...error,
                message: serverMessage
            });
        }

        return Promise.reject(error);
    }
);

// Helper function to check if we have a valid token
export const hasValidToken = (): boolean => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;

    try {
        // Check JWT expiration if token has proper format
        if (token.split('.').length === 3) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.exp) {
                const now = Math.floor(Date.now() / 1000);
                return payload.exp > now;
            }
        }
        return true; 
    } catch {
        return false; 
    }
};