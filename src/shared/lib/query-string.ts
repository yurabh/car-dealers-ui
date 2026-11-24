type QueryValue = string | number | boolean | null | undefined

export function toQueryString(params: object = {}): string {
    const search = new URLSearchParams()

    for (const [key, value] of Object.entries(params) as [string, QueryValue | QueryValue[]][]) {
        if (Array.isArray(value)) {
            value
                .filter((v) => v !== null && v !== undefined && v !== '')
                .forEach((v) => search.append(`${key}[]`, String(v)))
        } else if (value !== null && value !== undefined && value !== '') {
            search.append(key, String(value))
        }
    }

    const query = search.toString()
    return query ? `?${query}` : ''
}
