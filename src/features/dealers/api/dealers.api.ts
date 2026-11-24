import { api } from '@/shared/api/client'
import type { Paginated, Resource } from '@/shared/api/types'
import { toQueryString } from '@/shared/lib/query-string'
import type { Dealer, DealerFilterOptions, DealerFilters, DealerPayload } from '../model/types'

export const dealersApi = {
  list: (filters: DealerFilters = {}) => api<Paginated<Dealer>>(`/dealers${toQueryString(filters)}`),

  get: (id: number) => api<Resource<Dealer>>(`/dealers/${id}`).then((r) => r.data),

  create: (payload: DealerPayload) =>
    api<Resource<Dealer>>('/dealers', { method: 'POST', body: payload }).then((r) => r.data),

  update: (id: number, payload: DealerPayload) =>
    api<Resource<Dealer>>(`/dealers/${id}`, { method: 'PUT', body: payload }).then((r) => r.data),

  remove: (id: number) => api<void>(`/dealers/${id}`, { method: 'DELETE' }),

  filterOptions: () => api<Resource<DealerFilterOptions>>('/filters/dealers').then((r) => r.data),
}
