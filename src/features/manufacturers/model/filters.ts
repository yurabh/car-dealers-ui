import {readNumber, readString} from '@/shared/lib/useUrlFilters'
import type {ManufacturerFilters} from './types'

export function parseManufacturerFilters(params: URLSearchParams): ManufacturerFilters {
    return {
        search: readString(params, 'search'),
        page: readNumber(params, 'page'),
    }
}
