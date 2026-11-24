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
import {useCars, useDeleteCar} from '../api/cars.queries'
import {CarFilters} from '../components/CarFilters'
import {CarForm} from '../components/CarForm'
import {CarsTable} from '../components/CarsTable'
import {parseCarFilters} from '../model/filters'
import type {Car} from '../model/types'

export function CarsPage() {
    const {filters, update, reset} = useUrlFilters(parseCarFilters)
    const {data, isPending, isFetching, isPlaceholderData, error} = useCars(filters)
    const deleteCar = useDeleteCar()

    const [editing, setEditing] = useState<Car | 'new' | null>(null)
    const [deleting, setDeleting] = useState<Car | null>(null)

    useClampPage(data?.meta, update)

    const activeFilters = countActive(filters)

    const confirmDelete = () => {
        if (!deleting) return
        deleteCar.mutate(deleting.id, {onSuccess: () => setDeleting(null)})
    }

    return (
        <>
            <PageHeader
                title="All cars"
                subtitle={
                    data && (
                        <>
                            {plural(data.meta.total, 'car')}
                            {isFetching && <span className="ml-2 text-slate-400">В· updatingвЂ¦</span>}
                        </>
                    )
                }
                actions={<Button onClick={() => setEditing('new')}>+ Add car</Button>}
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
                    <CarFilters filters={filters} onChange={update}/>
                </aside>

                <section className={isPlaceholderData ? 'min-w-0 opacity-60 transition-opacity' : 'min-w-0 transition-opacity'}>
                    <QueryState
                        isPending={isPending}
                        error={error}
                        isEmpty={data?.data.length === 0}
                        emptyText="No cars match the selected filters"
                    >
                        {data && (
                            <>
                                <CarsTable
                                    cars={data.data}
                                    sort={filters.sort}
                                    direction={filters.direction}
                                    onSort={(sort, direction) => update({sort, direction})}
                                    onEdit={setEditing}
                                    onDelete={(car) => {
                                        deleteCar.reset()
                                        setDeleting(car)
                                    }}
                                />
                                <Pagination meta={data.meta} onPageChange={(page) => update({page})}/>
                            </>
                        )}
                    </QueryState>
                </section>
            </div>

            <Modal open={editing !== null} title={editing === 'new' ? 'Add car' : 'Edit car'}
                   onClose={() => setEditing(null)}>
                <CarForm
                    car={editing && editing !== 'new' ? editing : undefined}
                    onDone={() => setEditing(null)}
                    onCancel={() => setEditing(null)}
                />
            </Modal>

            <ConfirmDialog
                open={deleting !== null}
                title="Delete car"
                message={
                    <>
                        Delete <b>{deleting?.model}</b>? The dealer's amount of cars will be updated.
                    </>
                }
                isPending={deleteCar.isPending}
                error={deleteCar.error?.message}
                onConfirm={confirmDelete}
                onClose={() => setDeleting(null)}
            />
        </>
    )
}
