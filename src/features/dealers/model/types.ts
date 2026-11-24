import type {Manufacturer} from '@/features/manufacturers/model/types'
import type {SortDirection} from '@/shared/api/types'

export interface Dealer {
    id: number
    manufacturer_id: number
    name: string
    city: string
    country: string
    cars_amount: number
    employees_count: number
    manufacturer?: Manufacturer
    created_at: string
    updated_at: string
}

export type DealerSortField = 'id' | 'name' | 'city' | 'country' | 'cars_amount' | 'employees_count' | 'created_at'

export interface DealerFilters {
    manufacturer_id?: number[]
    country?: string[]
    city?: string[]
    cars_amount_min?: number
    cars_amount_max?: number
    employees_min?: number
    employees_max?: number
    search?: string
    sort?: DealerSortField
    direction?: SortDirection
    page?: number
    per_page?: number
}

export interface DealerPayload {
    manufacturer_id: number
    name: string
    city: string
    country: string
    employees_count: number
}

export interface DealerFilterOptions {
    manufacturers: Pick<Manufacturer, 'id' | 'name'>[]
    countries: string[]
    cities: { city: string; country: string }[]
    cars_amount: { min: number; max: number }
    employees_count: { min: number; max: number }
}
