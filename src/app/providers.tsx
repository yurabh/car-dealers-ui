import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import {useState, type ReactNode} from 'react'
import {ApiError} from '@/shared/api/client'

function createQueryClient() {
    return new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 30_000,
                refetchOnWindowFocus: false,
                retry: (failureCount, error) =>
                    !(error instanceof ApiError && error.status >= 400 && error.status < 500) && failureCount < 2,
            },
        },
    })
}

export function Providers({children}: { children: ReactNode }) {
    const [queryClient] = useState(createQueryClient)

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
