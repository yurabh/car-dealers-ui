import {readNumber, readNumbers, readString, readStrings} from '@/shared/lib/useUrlFilters'
import {CAR_COLORS, CAR_FUELS, CAR_SIZES, type CarFilters, type CarSortField} from './types'

const SORT_FIELDS: readonly CarSortField[] = ['id', 'model', 'size', 'color', 'fuel', 'created_at']

/** URL -> CarFilters. Unknown enum values in the URL are dropped instead of causing a 422. */
export function parseCarFilters(params: URLSearchParams): CarFilters {
    const direction = readString(params, 'direction')

    return {
        manufacturer_id: readNumbers(params, 'manufacturer_id'),
        dealer_id: readNumbers(params, 'dealer_id'),
        size: readStrings(params, 'size', CAR_SIZES),
        color: readStrings(params, 'color', CAR_COLORS),
        fuel: readStrings(params, 'fuel', CAR_FUELS),
        search: readString(params, 'search'),
        sort: readStrings(params, 'sort', SORT_FIELDS)[0],
        direction: direction === 'asc' || direction === 'desc' ? direction : undefined,
        page: readNumber(params, 'page'),
    }
}
