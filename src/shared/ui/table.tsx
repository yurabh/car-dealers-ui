import type {ReactNode} from 'react'
import type {Paginated, SortDirection} from '@/shared/api/types'
import {cx} from '@/shared/lib/cx'
import {Button} from './Button'

export function Th({children, align = 'left'}: { children?: ReactNode; align?: 'left' | 'right' }) {
    return <th className={cx('px-4 py-3 font-medium', align === 'right' && 'text-right')}>{children}</th>
}

export function Td({children, align = 'left', className}: {
    children?: ReactNode;
    align?: 'left' | 'right';
    className?: string
}) {
    return <td className={cx('px-4 py-3', align === 'right' && 'text-right tabular-nums', className)}>{children}</td>
}

export function SortableTh<F extends string>({
                                                 label,
                                                 field,
                                                 sort,
                                                 direction,
                                                 onSort,
                                                 align = 'left',
                                             }: {
    label: string
    field: F
    sort?: string
    direction?: SortDirection
    onSort: (field: F, direction: SortDirection) => void
    align?: 'left' | 'right'
}) {
    const active = sort === field
    const next: SortDirection = active && direction === 'asc' ? 'desc' : 'asc'

    return (
        <th className={cx('px-4 py-3 font-medium', align === 'right' && 'text-right')}>
            <button
                type="button"
                onClick={() => onSort(field, next)}
                className={cx('inline-flex items-center gap-1 uppercase hover:text-slate-900', active && 'text-slate-900')}
            >
                {label}
                <span aria-hidden className="text-[10px]">
                    {active ? (direction === 'asc' ? '▲' : '▼') : '↕'}
                </span>
            </button>
        </th>
    )
}

export function Pagination({meta, onPageChange}: {
    meta: Paginated<unknown>['meta'];
    onPageChange: (page: number) => void
}) {
    if (meta.total === 0) return null

    return (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
            <span>
                {meta.from}–{meta.to} of {meta.total}
            </span>
            <div className="flex items-center gap-2">
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={meta.current_page <= 1}
                    onClick={() => onPageChange(meta.current_page - 1)}
                >
                    ← Prev
                </Button>
                <span>
                    Page {meta.current_page} of {meta.last_page}
                </span>
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={meta.current_page >= meta.last_page}
                    onClick={() => onPageChange(meta.current_page + 1)}
                >
                    Next →
                </Button>
            </div>
        </div>
    )
}
