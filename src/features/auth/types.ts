export interface LoginCredentials {
    email: string
    password: string
    role?: 'client' | 'center_owner' | 'super_admin'
}

export interface RegisterData {
    firstName: string
    lastName: string
    email: string
    password: string
    phone: string
}

export interface User {
    id: string
    email: string
    name: string
    phone: string
    role: 'client' | 'center_owner' | 'super_admin'
    avatar?: string
    createdAt?: string
    updatedAt?: string
}

export interface AuthResponse {
    user: User
    token: string
    refreshToken: string
    expiresIn: number
}

export interface RefreshTokenResponse {
    token: string
    refreshToken: string
    expiresIn?: number
}