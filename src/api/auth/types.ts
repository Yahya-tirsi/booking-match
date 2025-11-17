export interface LoginCredentials {
    email: string
    password: string
}

export interface RegisterData {
    name: string
    email: string
    password: string
    phone: string
}

export interface User {
    id: string
    email: string
    name: string
    phone: string
    avatar?: string
    createdAt?: string
    updatedAt?: string
}

export interface AuthResponse {
    user: User
    token: string
    refreshToken: string
    expiresIn?: number // Token expiration time in seconds
}

export interface RefreshTokenResponse {
    token: string
    refreshToken: string
    expiresIn?: number
}

export interface TokenData {
    token: string
    expiresAt: number // Timestamp when token expires
}