import {useState} from 'react'
import {plural} from '@/shared/lib/plural'
import {useClampPage} from '@/shared/lib/useClampPage'
import {countActive, useUrlFilters} from '@/shared/lib/useUrlFilters'
import {Button} from '@/shared/ui/Button'
import {ConfirmDialog} from '@/shared/ui/ConfirmDialog'
import {Modal} from '@/shared/ui/Modal'
import {PageHeader} from '@/shared/ui/PageHeader'
import {QueryState} from '@/shared/ui/QueryState'
import {Pagination} from '@/shared/ui/table'
import {useDealers, useDeleteDealer} from '../api/dealers.queries'
import {DealerFilters} from '../components/DealerFilters'
import {DealerForm} from '../components/DealerForm'
import {DealersTable} from '../components/DealersTable'
import {parseDealerFilters} from '../model/filters'
import type {Dealer} from '../model/types'

export function DealersPage() {
    const {filters, update, reset} = useUrlFilters(parseDealerFilters)
    const {data, isPending, isFetching, isPlaceholderData, error} = useDealers(filters)
    const deleteDealer = useDeleteDealer()

    const [editing, setEditing] = useState<Dealer | 'new' | null>(null)
    const [deleting, setDeleting] = useState<Dealer | null>(null)

    useClampPage(data?.meta, update)

    const activeFilters = countActive(filters)

    const confirmDelete = () => {
        if (!deleting) return
        deleteDealer.mutate(deleting.id, {onSuccess: () => setDeleting(null)})
    }

    return (
        <>
            <PageHeader
                title="All dealers"
                subtitle={
                    data && (
                        <>
                            {plural(data.meta.total, 'dealer')}
                            {isFetching && <span className="ml-2 text-slate-400">В· updatingвЂ¦</span>}
                        </>
                    )
                }
                actions={<Button onClick={() => setEditing('new')}>+ Add dealer</Button>}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
                <aside className="h-fit rounded-lg border border-slate-200 bg-white px-4 lg:sticky lg:top-4">
                    <div className="flex items-center justify-between border-b border-slate-100 py-3">
                        <span className="text-sm font-semibold text-slate-900">
                            Filters {activeFilters > 0 && <span className="text-slate-500">({activeFilters})</span>}
                        </span>
                        {activeFilters > 0 && (
                            <Button variant="ghost" size="sm" onClick={reset}>
                                Reset
                            </Button>
                        )}
                    </div>
                    <DealerFilters filters={filters} onChange={update}/>
                </aside>

                <section className={isPlaceholderData ? 'min-w-0 opacity-60 transition-opacity' : 'min-w-0 transition-opacity'}>
                    <QueryState
                        isPending={isPending}
                        error={error}
                        isEmpty={data?.data.length === 0}
                        emptyText="No dealers match the selected filters"
                    >
                        {data && (
                            <>
                                <DealersTable
                                    dealers={data.data}
                                    sort={filters.sort}
                                    direction={filters.direction}
                                    onSort={(sort, direction) => update({sort, direction})}
                                    onEdit={setEditing}
                                    onDelete={(dealer) => {
                                        deleteDealer.reset()
                                        setDeleting(dealer)
                                    }}
                                />
                                <Pagination meta={data.meta} onPageChange={(page) => update({page})}/>
                            </>
                        )}
                    </QueryState>
                </section>
            </div>

            <Modal
                open={editing !== null}
                title={editing === 'new' ? 'Add dealer' : 'Edit dealer'}
                onClose={() => setEditing(null)}
            >
                <DealerForm
                    dealer={editing && editing !== 'new' ? editing : undefined}
                    onDone={() => setEditing(null)}
                    onCancel={() => setEditing(null)}
                />
            </Modal>

            <ConfirmDialog
                open={deleting !== null}
                title="Delete dealer"
                message={
                    <>
                        Delete <b>{deleting?.name}</b>?
                        {!!deleting?.cars_amount && <> Its {plural(deleting.cars_amount, 'car')} will be deleted too.</>}
                    </>
                }
                isPending={deleteDealer.isPending}
                error={deleteDealer.error?.message}
                onConfirm={confirmDelete}
                onClose={() => setDeleting(null)}
            />
        </>
    )
}
