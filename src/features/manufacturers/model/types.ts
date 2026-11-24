export interface Manufacturer {
    id: number
    name: string
    dealers_count?: number
    cars_count?: number
    created_at: string
    updated_at: string
}

export interface ManufacturerFilters {
    search?: string
    page?: number
    per_page?: number
}

export interface ManufacturerPayload {
    name: string
}
