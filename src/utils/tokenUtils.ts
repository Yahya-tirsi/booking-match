export interface StoredTokens {
    authToken: string
    refreshToken: string
    expiresAt: number
}

/**
 * Store tokens securely in localStorage
 */
export const storeTokens = (authToken: string, refreshToken: string, expiresIn?: number): void => {
    // Calculate expiration time (default 15 minutes if not provided)
    const expiresInMs = (expiresIn || 15 * 60) * 1000 // Convert to milliseconds, default 15 minutes
    const expiresAt = Date.now() + expiresInMs

    localStorage.setItem('authToken', authToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('tokenExpiresAt', expiresAt.toString())
}

/**
 * Get stored tokens
 */
export const getStoredTokens = (): StoredTokens | null => {
    const authToken = localStorage.getItem('authToken')
    const refreshToken = localStorage.getItem('refreshToken')
    const expiresAt = localStorage.getItem('tokenExpiresAt')

    if (!authToken || !refreshToken || !expiresAt) {
        return null
    }

    return {
        authToken,
        refreshToken,
        expiresAt: parseInt(expiresAt, 10)
    }
}

/**
 * Check if access token is expired or about to expire (within 5 minutes)
 */
export const isTokenExpiredOrExpiring = (): boolean => {
    const expiresAt = localStorage.getItem('tokenExpiresAt')
    if (!expiresAt) return true

    const expirationTime = parseInt(expiresAt, 10)
    const currentTime = Date.now()
    const fiveMinutes = 5 * 60 * 1000

    // Consider token expired if it's within 5 minutes of expiration
    return currentTime >= (expirationTime - fiveMinutes)
}

/**
 * Clear all tokens from storage
 */
export const clearTokens = (): void => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('tokenExpiresAt')
}

/**
 * Check if user is authenticated (has valid tokens)
 */
export const isAuthenticated = (): boolean => {
    const tokens = getStoredTokens()
    if (!tokens) return false

    return !isTokenExpiredOrExpiring()
}

/**
 * Get the remaining time until token expiration (in milliseconds)
 */
export const getTokenTimeRemaining = (): number => {
    const expiresAt = localStorage.getItem('tokenExpiresAt')
    if (!expiresAt) return 0

    const expirationTime = parseInt(expiresAt, 10)
    const currentTime = Date.now()

    return Math.max(0, expirationTime - currentTime)
}