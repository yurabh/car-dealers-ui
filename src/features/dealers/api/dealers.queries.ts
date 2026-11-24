import {keepPreviousData, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import type {DealerFilters, DealerPayload} from '../model/types'
import {dealersApi} from './dealers.api'

export const dealerKeys = {
    all: ['dealers'] as const,
    list: (filters: DealerFilters) => [...dealerKeys.all, 'list', filters] as const,
    detail: (id: number) => [...dealerKeys.all, 'detail', id] as const,
    filterOptions: () => [...dealerKeys.all, 'filter-options'] as const,
}

/** keepPreviousData keeps the table on screen while a new filter combination loads (live filtering). */
export function useDealers(filters: DealerFilters = {}) {
    return useQuery({
        queryKey: dealerKeys.list(filters),
        queryFn: () => dealersApi.list(filters),
        placeholderData: keepPreviousData,
    })
}

export function useDealer(id: number) {
    return useQuery({
        queryKey: dealerKeys.detail(id),
        queryFn: () => dealersApi.get(id),
    })
}

export function useDealerFilterOptions() {
    return useQuery({
        queryKey: dealerKeys.filterOptions(),
        queryFn: dealersApi.filterOptions,
    })
}

/** Dealers affect car lists, manufacturer counts and filter options, so refresh everything. */
function useInvalidateAll() {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries()
}

export function useCreateDealer() {
    const invalidate = useInvalidateAll()
    return useMutation({
        mutationFn: (payload: DealerPayload) => dealersApi.create(payload),
        onSuccess: invalidate,
    })
}

export function useUpdateDealer() {
    const invalidate = useInvalidateAll()
    return useMutation({
        mutationFn: ({id, payload}: {id: number; payload: DealerPayload}) => dealersApi.update(id, payload),
        onSuccess: invalidate,
    })
}

export function useDeleteDealer() {
    const invalidate = useInvalidateAll()
    return useMutation({
        mutationFn: (id: number) => dealersApi.remove(id),
        // onSettled: refresh even if it failed (e.g. 404 - already deleted elsewhere)
        onSettled: invalidate,
    })
}
