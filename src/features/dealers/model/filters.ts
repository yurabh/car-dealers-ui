import {readNumber, readNumbers, readString, readStrings} from '@/shared/lib/useUrlFilters'
import type {DealerFilters, DealerSortField} from './types'

const SORT_FIELDS: readonly DealerSortField[] = ['id', 'name', 'city', 'country', 'cars_amount', 'employees_count', 'created_at']

/** URL -> DealerFilters. */
export function parseDealerFilters(params: URLSearchParams): DealerFilters {
    const direction = readString(params, 'direction')

    return {
        manufacturer_id: readNumbers(params, 'manufacturer_id'),
        country: readStrings(params, 'country'),
        city: readStrings(params, 'city'),
        cars_amount_min: readNumber(params, 'cars_amount_min'),
        cars_amount_max: readNumber(params, 'cars_amount_max'),
        employees_min: readNumber(params, 'employees_min'),
        employees_max: readNumber(params, 'employees_max'),
        search: readString(params, 'search'),
        sort: readStrings(params, 'sort', SORT_FIELDS)[0],
        direction: direction === 'asc' || direction === 'desc' ? direction : undefined,
        page: readNumber(params, 'page'),
    }
}
