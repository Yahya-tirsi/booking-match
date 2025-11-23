export interface LoginCredentials {
    email: string
    password: string
}

export interface DecodedToken {
    aud: string;
    exp: number;
    iss: string;
    name: string;
    sub: string;
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
}

export interface RegisterData {
    fullName: string
    email: string
    password: string
    phoneNumber: string
    role: string
}

export interface User {
    id: string
    email: string
    name: string
    phone: string
    role: 'client' | 'center_owner' | 'owner'
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