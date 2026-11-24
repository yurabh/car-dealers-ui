import type {FieldValues, Path, UseFormSetError} from 'react-hook-form'
import {ApiError} from '@/shared/api/client'

/**
 * Puts Laravel 422 errors under the matching form fields.
 * Returns a general message for non-validation errors (to show above the form), or null.
 */
export function applyApiErrors<T extends FieldValues>(error: unknown, setError: UseFormSetError<T>): string | null {
    if (error instanceof ApiError && error.isValidation) {
        for (const [field, messages] of Object.entries(error.errors)) {
            setError(field as Path<T>, {type: 'server', message: messages[0]})
        }
        return null
    }

    return error instanceof Error ? error.message : 'Something went wrong'
}
