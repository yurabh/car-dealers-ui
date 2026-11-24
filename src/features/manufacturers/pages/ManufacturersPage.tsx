import {useState} from 'react'
import {plural} from '@/shared/lib/plural'
import {useClampPage} from '@/shared/lib/useClampPage'
import {useUrlFilters} from '@/shared/lib/useUrlFilters'
import {Button} from '@/shared/ui/Button'
import {ConfirmDialog} from '@/shared/ui/ConfirmDialog'
import {DebouncedInput} from '@/shared/ui/filters'
import {Modal} from '@/shared/ui/Modal'
import {PageHeader} from '@/shared/ui/PageHeader'
import {QueryState} from '@/shared/ui/QueryState'
import {Pagination, Td, Th} from '@/shared/ui/table'
import {useDeleteManufacturer, useManufacturers} from '../api/manufacturers.queries'
import {ManufacturerForm} from '../components/ManufacturerForm'
import {parseManufacturerFilters} from '../model/filters'
import type {Manufacturer} from '../model/types'

export function ManufacturersPage() {
    const {filters, update} = useUrlFilters(parseManufacturerFilters)
    const {data, isPending, isFetching, isPlaceholderData, error} = useManufacturers(filters)
    const deleteManufacturer = useDeleteManufacturer()

    useClampPage(data?.meta, update)

    const [editing, setEditing] = useState<Manufacturer | 'new' | null>(null)
    const [deleting, setDeleting] = useState<Manufacturer | null>(null)

    const confirmDelete = () => {
        if (!deleting) return
        deleteManufacturer.mutate(deleting.id, {onSuccess: () => setDeleting(null)})
    }

    return (
        <>
            <PageHeader
                title="Manufacturers"
                subtitle={
                    data && (
                        <>
                            {plural(data.meta.total, 'manufacturer')}
                            {isFetching && <span className="ml-2 text-slate-400">· updating…</span>}
                        </>
                    )
                }
                actions={<Button onClick={() => setEditing('new')}>+ Add manufacturer</Button>}
            />

            <div className="mb-4 max-w-xs">
                <DebouncedInput
                    type="search"
                    placeholder="Search by name…"
                    value={filters.search ?? ''}
                    onChange={(search) => update({search})}
                />
            </div>

            <section className={isPlaceholderData ? 'opacity-60 transition-opacity' : 'transition-opacity'}>
                <QueryState isPending={isPending} error={error} isEmpty={data?.data.length === 0} emptyText="No manufacturers found">
                    {data && (
                        <>
                            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                        <tr>
                                            <Th>Name</Th>
                                            <Th align="right">Dealers</Th>
                                            <Th align="right">Cars</Th>
                                            <Th align="right">Actions</Th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {data.data.map((manufacturer) => (
                                            <tr key={manufacturer.id} className="hover:bg-slate-50/60">
                                                <Td className="font-medium text-slate-900">{manufacturer.name}</Td>
                                                <Td align="right">{manufacturer.dealers_count}</Td>
                                                <Td align="right">{manufacturer.cars_count}</Td>
                                                <Td align="right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="sm" onClick={() => setEditing(manufacturer)}>
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600"
                                                            onClick={() => {
                                                                deleteManufacturer.reset()
                                                                setDeleting(manufacturer)
                                                            }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </div>
                                                </Td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination meta={data.meta} onPageChange={(page) => update({page})} />
                        </>
                    )}
                </QueryState>
            </section>

            <Modal
                open={editing !== null}
                title={editing === 'new' ? 'Add manufacturer' : 'Edit manufacturer'}
                onClose={() => setEditing(null)}
            >
                <ManufacturerForm
                    manufacturer={editing && editing !== 'new' ? editing : undefined}
                    onDone={() => setEditing(null)}
                    onCancel={() => setEditing(null)}
                />
            </Modal>

            <ConfirmDialog
                open={deleting !== null}
                title="Delete manufacturer"
                message={
                    <>
                        Delete <b>{deleting?.name}</b>?
                        {!!(deleting?.dealers_count || deleting?.cars_count) && (
                            <>
                                {' '}
                                Its {plural(deleting.dealers_count ?? 0, 'dealer')} and{' '}
                                {plural(deleting.cars_count ?? 0, 'car')} (including cars at other dealers) will be
                                deleted too.
                            </>
                        )}
                    </>
                }
                isPending={deleteManufacturer.isPending}
                error={deleteManufacturer.error?.message}
                onConfirm={confirmDelete}
                onClose={() => setDeleting(null)}
            />
        </>
    )
}
