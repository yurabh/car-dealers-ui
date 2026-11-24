export interface Paginated<T> {
    data: T[]
    links: {
        first: string | null
        last: string | null
        prev: string | null
        next: string | null
    }
    meta: {
        current_page: number
        from: number | null
        last_page: number
        path: string
        per_page: number
        to: number | null
        total: number
    }
}

export interface Resource<T> {
    data: T
}

export type ValidationErrors = Record<string, string[]>

export type SortDirection = 'asc' | 'desc'
