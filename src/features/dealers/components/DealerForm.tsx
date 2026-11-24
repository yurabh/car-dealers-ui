import {zodResolver} from '@hookform/resolvers/zod'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {applyApiErrors} from '@/shared/lib/form-errors'
import {Button} from '@/shared/ui/Button'
import {Field, Input, Select} from '@/shared/ui/form'
import {useCreateDealer, useDealerFilterOptions, useUpdateDealer} from '../api/dealers.queries'
import type {Dealer} from '../model/types'

const requiredText = (label: string) => z.string().trim().min(1, `${label} is required`).max(255)

const schema = z.object({
    manufacturer_id: z.number({error: 'Select a manufacturer'}),
    name: requiredText('Name'),
    city: requiredText('City'),
    country: requiredText('Country'),
    employees_count: z.number({error: 'Number of employees is required'}).int().min(0, 'Must be 0 or more'),
})

type DealerFormValues = z.infer<typeof schema>

const toId = (v: unknown) => (v === '' || v === null || v === undefined ? undefined : Number(v))

interface DealerFormProps {
    dealer?: Dealer
    onDone: () => void
    onCancel: () => void
}

export function DealerForm({dealer, onDone, onCancel}: DealerFormProps) {
    const {data: options} = useDealerFilterOptions()
    const createDealer = useCreateDealer()
    const updateDealer = useUpdateDealer()
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<DealerFormValues>({
        resolver: zodResolver(schema),
        defaultValues: dealer
            ? {
                manufacturer_id: dealer.manufacturer_id,
                name: dealer.name,
                city: dealer.city,
                country: dealer.country,
                employees_count: dealer.employees_count,
            }
            : {name: '', city: '', country: ''},
    })

    const onSubmit = handleSubmit(async (values) => {
        setFormError(null)
        try {
            if (dealer) await updateDealer.mutateAsync({id: dealer.id, payload: values})
            else await createDealer.mutateAsync(values)
            onDone()
        } catch (error) {
            setFormError(applyApiErrors(error, setError))
        }
    })

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
            {formError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}

            <Field label="Name" htmlFor="dealer-name" error={errors.name?.message}>
                <Input id="dealer-name" autoFocus invalid={!!errors.name} {...register('name')} />
            </Field>

            <Field label="Manufacturer" htmlFor="dealer-manufacturer" error={errors.manufacturer_id?.message}>
                <Select
                    id="dealer-manufacturer"
                    invalid={!!errors.manufacturer_id}
                    options={(options?.manufacturers ?? []).map((m) => ({value: m.id, label: m.name}))}
                    {...register('manufacturer_id', {setValueAs: toId})}
                />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="City" htmlFor="dealer-city" error={errors.city?.message}>
                    <Input id="dealer-city" invalid={!!errors.city} {...register('city')} />
                </Field>
                <Field label="Country" htmlFor="dealer-country" error={errors.country?.message}>
                    <Input id="dealer-country" invalid={!!errors.country} {...register('country')} />
                </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Number of employees" htmlFor="dealer-employees" error={errors.employees_count?.message}>
                    <Input
                        id="dealer-employees"
                        type="number"
                        min={0}
                        invalid={!!errors.employees_count}
                        {...register('employees_count', {valueAsNumber: true})}
                    />
                </Field>
                <div>
                    <span className="mb-1 block text-sm font-medium text-slate-700">Amount of cars</span>
                    <p className="rounded-md border border-dashed border-slate-300 px-3 py-2 text-sm text-slate-500">
                        {dealer ? dealer.cars_amount : 0} · calculated from the dealer's cars
                    </p>
                </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : dealer ? 'Save changes' : 'Create dealer'}
                </Button>
            </div>
        </form>
    )
}
