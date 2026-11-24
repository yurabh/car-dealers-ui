import {useCallback, useEffect, useMemo, useRef} from 'react'
import {useSearchParams} from 'react-router'

type UrlValue = string | number | undefined | null | (string | number)[]

export function useUrlFilters<T>(parse: (params: URLSearchParams) => T) {
    const [params, setParams] = useSearchParams()

    const filters = useMemo(() => parse(params), [params, parse])

    // setSearchParams(fn) receives the params of the last *render*, not of the previous call,
    // so two quick updates (e.g. two debounced inputs) would overwrite each other.
    // Keep the latest URL we asked for and build every update on top of it.
    const latest = useRef(params)
    useEffect(() => {
        latest.current = params
    }, [params])

    /** Patch some keys; any filter change resets pagination to page 1. */
    const update = useCallback(
        (patch: Partial<T>) => {
            const next = new URLSearchParams(latest.current)

            for (const [key, value] of Object.entries(patch) as [string, UrlValue][]) {
                next.delete(key)
                if (Array.isArray(value)) {
                    value.forEach((v) => next.append(key, String(v)))
                } else if (value !== undefined && value !== null && value !== '') {
                    next.set(key, String(value))
                }
            }

            if (!('page' in patch)) next.delete('page')

            latest.current = next
            setParams(next, {replace: true})
        },
        [setParams],
    )

    const reset = useCallback(() => {
        latest.current = new URLSearchParams()
        setParams(latest.current, {replace: true})
    }, [setParams])

    return {filters, update, reset}
}

export function readStrings<T extends string>(params: URLSearchParams, key: string, allowed?: readonly T[]): T[] {
    const values = params.getAll(key) as T[]
    return allowed ? values.filter((v) => allowed.includes(v)) : values
}

export function readNumbers(params: URLSearchParams, key: string): number[] {
    return params
        .getAll(key)
        .map(Number)
        .filter((n) => Number.isInteger(n))
}

export function readNumber(params: URLSearchParams, key: string): number | undefined {
    const raw = params.get(key)
    if (raw === null || raw === '') return undefined
    const n = Number(raw)
    return Number.isFinite(n) ? n : undefined
}

export function readString(params: URLSearchParams, key: string): string | undefined {
    return params.get(key) || undefined
}

export function countActive(filters: object, ignore: string[] = ['sort', 'direction', 'page', 'per_page']): number {
    return Object.entries(filters).filter(([key, value]) => {
        if (ignore.includes(key)) return false
        if (Array.isArray(value)) return value.length > 0
        return value !== undefined && value !== null && value !== ''
    }).length
}
