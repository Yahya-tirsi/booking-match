export interface ApiError {
    message: string
    status?: number
    code?: string
    details?: string[]
}

export interface AxiosErrorResponse {
    response?: {
        data?: {
            message?: string
            error?: string
            details?: string[]
        }
        status?: number
    }
    message: string
}

// Type guard for Axios errors
export function isAxiosError(error: unknown): error is AxiosErrorResponse {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error
    )
}

// Type guard for API errors
export function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as ApiError).message === 'string'
    )
}

// Utility function to extract error message
export function getErrorMessage(error: unknown): string {
    if (isAxiosError(error)) {
        return error.response?.data?.message || error.response?.data?.error || error.message
    }

    if (isApiError(error)) {
        return error.message
    }

    if (typeof error === 'string') {
        return error
    }

    return 'An unexpected error occurred'
}