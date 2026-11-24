import {useEffect} from 'react'
import type {Paginated} from '@/shared/api/types'

/**
 * If the current page is past the last one (e.g. all rows of the last page were deleted,
 * or ?page=99 in the URL), jump to the last existing page instead of showing an empty list.
 * `update` must be stable (the one from useUrlFilters is).
 */
export function useClampPage(meta: Paginated<unknown>['meta'] | undefined, update: (patch: {page?: number}) => void) {
    useEffect(() => {
        if (meta && meta.total > 0 && meta.current_page > meta.last_page) {
            update({page: meta.last_page})
        }
    }, [meta, update])
}
