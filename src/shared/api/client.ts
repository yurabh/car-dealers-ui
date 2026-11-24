import {FetchError, ofetch, type FetchOptions} from 'ofetch'
import {env} from '@/shared/config/env'
import type {ValidationErrors} from './types'

export class ApiError extends Error {
    readonly status: number
    readonly errors: ValidationErrors

    constructor(status: number, message: string, errors: ValidationErrors = {}) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.errors = errors
    }

    get isValidation(): boolean {
        return this.status === 422
    }
}

const fetcher = ofetch.create({
    baseURL: env.apiUrl,
    headers: {Accept: 'application/json'},
})

/** Human-readable text instead of Laravel's technical messages (422 keeps the server text). */
function friendlyMessage(status: number): string | null {
    // 0 = network error; 502/503/504 = proxy/gateway can't reach the backend
    if ([0, 502, 503, 504].includes(status)) return 'Cannot reach the server. Check that the backend is running.'
    if (status === 404) return 'This record no longer exists — it may have been deleted already.'
    if (status >= 500) return 'Server error. Please try again.'
    return null
}

export async function api<T>(url: string, options: FetchOptions<'json'> = {}): Promise<T> {
    try {
        return await fetcher<T>(url, options)
    } catch (error) {
        if (error instanceof FetchError) {
            const status = error.statusCode ?? 0
            const body = error.data as { message?: string; errors?: ValidationErrors } | undefined
            throw new ApiError(status, friendlyMessage(status) ?? body?.message ?? error.message, body?.errors)
        }
        throw error
    }
}
