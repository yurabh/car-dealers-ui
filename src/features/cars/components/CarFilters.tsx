import {CheckboxList, ChipGroup, DebouncedInput, FilterSection} from '@/shared/ui/filters'
import {useCarFilterOptions} from '../api/cars.queries'
import {CAR_COLORS, CAR_FUELS, CAR_SIZES, type CarFilters as Filters} from '../model/types'
import {ColorDot} from './ColorDot'

interface CarFiltersProps {
    filters: Filters
    onChange: (patch: Partial<Filters>) => void
}

export function CarFilters({filters, onChange}: CarFiltersProps) {
    const {data: options} = useCarFilterOptions()

    return (
        <div>
            <FilterSection title="Search">
                <DebouncedInput
                    type="search"
                    placeholder="Model…"
                    value={filters.search ?? ''}
                    onChange={(search) => onChange({search})}
                />
            </FilterSection>

            <FilterSection title="Fuel" onClear={filters.fuel?.length ? () => onChange({fuel: []}) : undefined}>
                <ChipGroup options={options?.fuels ?? CAR_FUELS} selected={filters.fuel ?? []}
                           onChange={(fuel) => onChange({fuel})}/>
            </FilterSection>

            <FilterSection title="Size" onClear={filters.size?.length ? () => onChange({size: []}) : undefined}>
                <ChipGroup options={options?.sizes ?? CAR_SIZES} selected={filters.size ?? []}
                           onChange={(size) => onChange({size})}/>
            </FilterSection>

            <FilterSection title="Color" onClear={filters.color?.length ? () => onChange({color: []}) : undefined}>
                <ChipGroup
                    options={options?.colors ?? CAR_COLORS}
                    selected={filters.color ?? []}
                    onChange={(color) => onChange({color})}
                    renderLabel={(color) => (
                        <>
                            <ColorDot color={color}/>
                            {color}
                        </>
                    )}
                />
            </FilterSection>

            <FilterSection
                title="Manufacturer"
                onClear={filters.manufacturer_id?.length ? () => onChange({manufacturer_id: []}) : undefined}
            >
                <CheckboxList
                    options={(options?.manufacturers ?? []).map((m) => ({value: m.id, label: m.name}))}
                    selected={filters.manufacturer_id ?? []}
                    onChange={(manufacturer_id) => onChange({manufacturer_id})}
                />
            </FilterSection>

            <FilterSection title="Dealer"
                           onClear={filters.dealer_id?.length ? () => onChange({dealer_id: []}) : undefined}>
                <CheckboxList
                    options={(options?.dealers ?? []).map((d) => ({value: d.id, label: d.name}))}
                    selected={filters.dealer_id ?? []}
                    onChange={(dealer_id) => onChange({dealer_id})}
                    maxHeight="max-h-56"
                />
            </FilterSection>
        </div>
    )
}
