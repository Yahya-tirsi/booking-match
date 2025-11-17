export interface ApiError {
    message: string
    status?: number
    code?: string
    details?: string[]
}

export interface PaginationParams {
    page?: number
    limit?: number
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
    data: T[]
    total: number
    page: number
    limit: number
    totalPages: number
}

export interface SelectOption {
    value: string
    label: string
    disabled?: boolean
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

// Type guard for Axios-like errors
export function isAxiosError(error: unknown): error is {
    response?: {
        data?: {
            message?: string
            details?: string[]
        }
        status?: number
    }
} {
    return (
        typeof error === 'object' &&
        error !== null &&
        'response' in error
    )
}