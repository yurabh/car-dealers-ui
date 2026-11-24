import type {SortDirection} from '@/shared/api/types'
import {Button} from '@/shared/ui/Button'
import {SortableTh, Td, Th} from '@/shared/ui/table'
import type {Car, CarSortField} from '../model/types'
import {ColorDot} from './ColorDot'

interface CarsTableProps {
    cars: Car[]
    sort?: CarSortField
    direction?: SortDirection
    onSort: (sort: CarSortField, direction: SortDirection) => void
    onEdit: (car: Car) => void
    onDelete: (car: Car) => void
}

export function CarsTable({cars, sort, direction, onSort, onEdit, onDelete}: CarsTableProps) {
    const sortProps = {sort, direction, onSort}

    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                    <SortableTh label="Model" field="model" {...sortProps} />
                    <Th>Manufacturer</Th>
                    <Th>Dealer</Th>
                    <SortableTh label="Size" field="size" {...sortProps} />
                    <SortableTh label="Color" field="color" {...sortProps} />
                    <SortableTh label="Fuel" field="fuel" {...sortProps} />
                    <Th align="right">Actions</Th>
                </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                {cars.map((car) => (
                    <tr key={car.id} className="hover:bg-slate-50/60">
                        <Td className="font-medium text-slate-900">{car.model}</Td>
                        <Td>{car.manufacturer?.name}</Td>
                        <Td>{car.dealer?.name}</Td>
                        <Td className="capitalize">{car.size}</Td>
                        <Td>
                                <span className="inline-flex items-center gap-1.5 capitalize">
                                    <ColorDot color={car.color}/>
                                    {car.color}
                                </span>
                        </Td>
                        <Td className="capitalize">{car.fuel}</Td>
                        <Td align="right">
                            <div className="flex justify-end gap-1">
                                <Button variant="ghost" size="sm" onClick={() => onEdit(car)}>
                                    Edit
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-600"
                                        onClick={() => onDelete(car)}>
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
