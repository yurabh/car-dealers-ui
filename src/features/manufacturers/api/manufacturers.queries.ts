import {keepPreviousData, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import type {ManufacturerFilters, ManufacturerPayload} from '../model/types'
import {manufacturersApi} from './manufacturers.api'

export const manufacturerKeys = {
    all: ['manufacturers'] as const,
    list: (filters: ManufacturerFilters) => [...manufacturerKeys.all, 'list', filters] as const,
    detail: (id: number) => [...manufacturerKeys.all, 'detail', id] as const,
}

export function useManufacturers(filters: ManufacturerFilters = {}) {
    return useQuery({
        queryKey: manufacturerKeys.list(filters),
        queryFn: () => manufacturersApi.list(filters),
        placeholderData: keepPreviousData,
    })
}

export function useManufacturer(id: number) {
    return useQuery({
        queryKey: manufacturerKeys.detail(id),
        queryFn: () => manufacturersApi.get(id),
    })
}

/** Manufacturers affect dealer/car lists and filter options, so refresh everything. */
function useInvalidateAll() {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries()
}

export function useCreateManufacturer() {
    const invalidate = useInvalidateAll()
    return useMutation({
        mutationFn: (payload: ManufacturerPayload) => manufacturersApi.create(payload),
        onSuccess: invalidate,
    })
}

export function useUpdateManufacturer() {
    const invalidate = useInvalidateAll()
    return useMutation({
        mutationFn: ({id, payload}: {id: number; payload: ManufacturerPayload}) => manufacturersApi.update(id, payload),
        onSuccess: invalidate,
    })
}

export function useDeleteManufacturer() {
    const invalidate = useInvalidateAll()
    return useMutation({
        mutationFn: (id: number) => manufacturersApi.remove(id),
        // onSettled: refresh even if it failed (e.g. 404 - already deleted elsewhere)
        onSettled: invalidate,
    })
}
