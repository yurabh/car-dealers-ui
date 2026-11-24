import {api} from '@/shared/api/client'
import type {Paginated, Resource} from '@/shared/api/types'
import {toQueryString} from '@/shared/lib/query-string'
import type {Manufacturer, ManufacturerFilters, ManufacturerPayload} from '../model/types'

export const manufacturersApi = {
    list: (filters: ManufacturerFilters = {}) =>
        api<Paginated<Manufacturer>>(`/manufacturers${toQueryString(filters)}`),

    get: (id: number) => api<Resource<Manufacturer>>(`/manufacturers/${id}`).then((r) => r.data),

    create: (payload: ManufacturerPayload) =>
        api<Resource<Manufacturer>>('/manufacturers', {method: 'POST', body: payload}).then((r) => r.data),

    update: (id: number, payload: ManufacturerPayload) =>
        api<Resource<Manufacturer>>(`/manufacturers/${id}`, {method: 'PUT', body: payload}).then((r) => r.data),

    remove: (id: number) => api<void>(`/manufacturers/${id}`, {method: 'DELETE'}),
}
