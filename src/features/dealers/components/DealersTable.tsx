import type {SortDirection} from '@/shared/api/types'
import {Button} from '@/shared/ui/Button'
import {SortableTh, Td, Th} from '@/shared/ui/table'
import type {Dealer, DealerSortField} from '../model/types'

interface DealersTableProps {
    dealers: Dealer[]
    sort?: DealerSortField
    direction?: SortDirection
    onSort: (sort: DealerSortField, direction: SortDirection) => void
    onEdit: (dealer: Dealer) => void
    onDelete: (dealer: Dealer) => void
}

export function DealersTable({dealers, sort, direction, onSort, onEdit, onDelete}: DealersTableProps) {
    const sortProps = {sort, direction, onSort}

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                    <SortableTh label="Name" field="name" {...sortProps} />
                    <Th>Manufacturer</Th>
                    <SortableTh label="City" field="city" {...sortProps} />
                    <SortableTh label="Country" field="country" {...sortProps} />
                    <SortableTh label="Cars" field="cars_amount" align="right" {...sortProps} />
                    <SortableTh label="Employees" field="employees_count" align="right" {...sortProps} />
                    <Th align="right">Actions</Th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {dealers.map((dealer) => (
                    <tr key={dealer.id} className="hover:bg-slate-50/60">
                        <Td className="font-medium text-slate-900">{dealer.name}</Td>
                        <Td>{dealer.manufacturer?.name}</Td>
                        <Td>{dealer.city}</Td>
                        <Td>{dealer.country}</Td>
                        <Td align="right">{dealer.cars_amount}</Td>
                        <Td align="right">{dealer.employees_count}</Td>
                        <Td align="right">
                            <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={() => onEdit(dealer)}>
                                    Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600"
                                        onClick={() => onDelete(dealer)}>
                                    Delete
                                </Button>
                            </div>
                        </Td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}
