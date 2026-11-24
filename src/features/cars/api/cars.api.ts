import {api} from '@/shared/api/client'
import type {Paginated, Resource} from '@/shared/api/types'
import {toQueryString} from '@/shared/lib/query-string'
import type {Car, CarFilterOptions, CarFilters, CarPayload} from '../model/types'

export const carsApi = {
    list: (filters: CarFilters = {}) => api<Paginated<Car>>(`/cars${toQueryString(filters)}`),

    get: (id: number) => api<Resource<Car>>(`/cars/${id}`).then((r) => r.data),

    create: (payload: CarPayload) => api<Resource<Car>>('/cars', {method: 'POST', body: payload}).then((r) => r.data),

    update: (id: number, payload: CarPayload) =>
        api<Resource<Car>>(`/cars/${id}`, {method: 'PUT', body: payload}).then((r) => r.data),

    remove: (id: number) => api<void>(`/cars/${id}`, {method: 'DELETE'}),

    filterOptions: () => api<Resource<CarFilterOptions>>('/filters/cars').then((r) => r.data),
}
