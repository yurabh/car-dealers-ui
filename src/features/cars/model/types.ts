import type {Dealer} from '@/features/dealers/model/types'
import type {Manufacturer} from '@/features/manufacturers/model/types'
import type {SortDirection} from '@/shared/api/types'

export const CAR_SIZES = ['mini', 'compact', 'midsize', 'fullsize', 'suv'] as const
export const CAR_COLORS = ['black', 'white', 'silver', 'gray', 'red', 'blue', 'green', 'yellow'] as const
export const CAR_FUELS = ['petrol', 'diesel', 'electric', 'hybrid', 'gas'] as const

export type CarSize = (typeof CAR_SIZES)[number]
export type CarColor = (typeof CAR_COLORS)[number]
export type CarFuel = (typeof CAR_FUELS)[number]

export interface Car {
    id: number
    manufacturer_id: number
    dealer_id: number
    model: string
    size: CarSize
    color: CarColor
    fuel: CarFuel
    manufacturer?: Manufacturer
    dealer?: Dealer
    created_at: string
    updated_at: string
}

export type CarSortField = 'id' | 'model' | 'size' | 'color' | 'fuel' | 'created_at'

export interface CarFilters {
    manufacturer_id?: number[]
    dealer_id?: number[]
    size?: CarSize[]
    color?: CarColor[]
    fuel?: CarFuel[]
    search?: string
    sort?: CarSortField
    direction?: SortDirection
    page?: number
    per_page?: number
}

export interface CarPayload {
    manufacturer_id: number
    dealer_id: number
    model: string
    size: CarSize
    color: CarColor
    fuel: CarFuel
}

export interface CarFilterOptions {
    manufacturers: Pick<Manufacturer, 'id' | 'name'>[]
    dealers: Pick<Dealer, 'id' | 'name'>[]
    sizes: CarSize[]
    colors: CarColor[]
    fuels: CarFuel[]
}
