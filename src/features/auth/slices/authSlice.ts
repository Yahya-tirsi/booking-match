import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '../types'

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // Login actions
        loginStart: (state) => {
            state.loading = true
            state.error = null
        },
        loginSuccess: (state, action: PayloadAction<{ token: string }>) => {
            state.loading = false
            state.token = action.payload.token
            state.error = null
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },

        // Register actions
        registerStart: (state) => {
            state.loading = true
            state.error = null
        },
        registerSuccess: (state, action: PayloadAction<User>) => {
            state.loading = false
            state.user = action.payload
            state.error = null
        },
        registerFailure: (state, action: PayloadAction<string>) => {
            state.loading = false
            state.error = action.payload
        },

        // Set user (après login ou refresh)
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload
        },

        // Set token (pour mettre à jour le token)
        setToken: (state, action: PayloadAction<string>) => {
            state.token = action.payload
        },

        // Logout action
        logout: (state) => {
            state.user = null
            state.token = null
            state.error = null
        },

        // Clear errors
        clearError: (state) => {
            state.error = null
        },

        // Check authentication status (for page refresh)
        checkAuth: (state) => {
            state.loading = true
        },

        authChecked: (state) => {
            state.loading = false
        }
    },
})

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    registerStart,
    registerSuccess,
    registerFailure,
    setUser,
    setToken,
    logout,
    clearError,
    checkAuth,
    authChecked,
} = authSlice.actions

export default authSlice.reducer