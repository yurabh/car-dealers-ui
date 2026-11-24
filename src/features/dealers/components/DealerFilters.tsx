import {CheckboxList, DebouncedInput, FilterSection, RangeFilter} from '@/shared/ui/filters'
import {useDealerFilterOptions} from '../api/dealers.queries'
import type {DealerFilters as Filters} from '../model/types'

interface DealerFiltersProps {
    filters: Filters
    onChange: (patch: Partial<Filters>) => void
}

export function DealerFilters({filters, onChange}: DealerFiltersProps) {
    const {data: options} = useDealerFilterOptions()
    const selectedCountries = filters.country ?? []

    const cities = (options?.cities ?? []).filter(
        (c) => selectedCountries.length === 0 || selectedCountries.includes(c.country),
    )
    const cityOptions = [...new Set(cities.map((c) => c.city))].map((city) => ({value: city, label: city}))

    return (
        <div>
            <FilterSection title="Search">
                <DebouncedInput
                    type="search"
                    placeholder="Dealer name…"
                    value={filters.search ?? ''}
                    onChange={(search) => onChange({search})}
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

            <FilterSection title="Country"
                           onClear={selectedCountries.length ? () => onChange({country: []}) : undefined}>
                <CheckboxList
                    options={(options?.countries ?? []).map((c) => ({value: c, label: c}))}
                    selected={selectedCountries}
                    onChange={(country) => onChange({country})}
                />
            </FilterSection>

            <FilterSection title="City" onClear={filters.city?.length ? () => onChange({city: []}) : undefined}>
                <CheckboxList options={cityOptions} selected={filters.city ?? []}
                              onChange={(city) => onChange({city})}/>
            </FilterSection>

            <FilterSection
                title="Amount of cars"
                onClear={
                    filters.cars_amount_min !== undefined || filters.cars_amount_max !== undefined
                        ? () => onChange({cars_amount_min: undefined, cars_amount_max: undefined})
                        : undefined
                }
            >
                <RangeFilter
                    min={filters.cars_amount_min}
                    max={filters.cars_amount_max}
                    placeholderMin={options ? `Min ${options.cars_amount.min}` : 'Min'}
                    placeholderMax={options ? `Max ${options.cars_amount.max}` : 'Max'}
                    onMinChange={(cars_amount_min) => onChange({cars_amount_min})}
                    onMaxChange={(cars_amount_max) => onChange({cars_amount_max})}
                />
            </FilterSection>

            <FilterSection
                title="Employees"
                onClear={
                    filters.employees_min !== undefined || filters.employees_max !== undefined
                        ? () => onChange({employees_min: undefined, employees_max: undefined})
                        : undefined
                }
            >
                <RangeFilter
                    min={filters.employees_min}
                    max={filters.employees_max}
                    placeholderMin={options ? `Min ${options.employees_count.min}` : 'Min'}
                    placeholderMax={options ? `Max ${options.employees_count.max}` : 'Max'}
                    onMinChange={(employees_min) => onChange({employees_min})}
                    onMaxChange={(employees_max) => onChange({employees_max})}
                />
            </FilterSection>
        </div>
    )
}
