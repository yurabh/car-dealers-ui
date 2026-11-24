import {keepPreviousData, useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import type {CarFilters, CarPayload} from '../model/types'
import {carsApi} from './cars.api'

export const carKeys = {
    all: ['cars'] as const,
    list: (filters: CarFilters) => [...carKeys.all, 'list', filters] as const,
    detail: (id: number) => [...carKeys.all, 'detail', id] as const,
    filterOptions: () => [...carKeys.all, 'filter-options'] as const,
}

export function useCars(filters: CarFilters = {}) {
    return useQuery({
        queryKey: carKeys.list(filters),
        queryFn: () => carsApi.list(filters),
        placeholderData: keepPreviousData,
    })
}

export function useCar(id: number) {
    return useQuery({
        queryKey: carKeys.detail(id),
        queryFn: () => carsApi.get(id),
    })
}

export function useCarFilterOptions() {
    return useQuery({
        queryKey: carKeys.filterOptions(),
        queryFn: carsApi.filterOptions,
    })
}


function useInvalidateAll() {
    const queryClient = useQueryClient()
    return () => queryClient.invalidateQueries()
}

export function useCreateCar() {
    const invalidate = useInvalidateAll()
    return useMutation({
        mutationFn: (payload: CarPayload) => carsApi.create(payload),
        onSuccess: invalidate,
    })
}

export function useUpdateCar() {
    const invalidate = useInvalidateAll()
    return useMutation({
        mutationFn: ({id, payload}: {id: number; payload: CarPayload}) => carsApi.update(id, payload),
        onSuccess: invalidate,
    })
}

export function useDeleteCar() {
    const invalidate = useInvalidateAll()
    return useMutation({
        mutationFn: (id: number) => carsApi.remove(id),
        // onSettled: refresh even if it failed (e.g. 404 - already deleted elsewhere)
        onSettled: invalidate,
    })
}
