import type {ReactNode} from 'react'

interface QueryStateProps {
    isPending: boolean
    error: Error | null
    isEmpty?: boolean
    emptyText?: string
    children: ReactNode
}

export function QueryState({isPending, error, isEmpty, emptyText = 'Nothing found', children}: QueryStateProps) {
    if (isPending) return <p className="py-10 text-center text-sm text-slate-500">Loading…</p>
    if (error) return <p className="py-10 text-center text-sm text-red-600">Failed to load: {error.message}</p>
    if (isEmpty) return <p className="py-10 text-center text-sm text-slate-500">{emptyText}</p>
    return <>{children}</>
}
