import {zodResolver} from '@hookform/resolvers/zod'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {applyApiErrors} from '@/shared/lib/form-errors'
import {Button} from '@/shared/ui/Button'
import {Field, Input, Select} from '@/shared/ui/form'
import {useCarFilterOptions, useCreateCar, useUpdateCar} from '../api/cars.queries'
import {CAR_COLORS, CAR_FUELS, CAR_SIZES, type Car} from '../model/types'

const schema = z.object({
    model: z.string().trim().min(1, 'Model is required').max(255),
    manufacturer_id: z.number({error: 'Select a manufacturer'}),
    dealer_id: z.number({error: 'Select a dealer'}),
    size: z.enum(CAR_SIZES, {error: 'Select a size'}),
    color: z.enum(CAR_COLORS, {error: 'Select a color'}),
    fuel: z.enum(CAR_FUELS, {error: 'Select a fuel type'}),
})

type CarFormValues = z.infer<typeof schema>

const toId = (v: unknown) => (v === '' || v === null || v === undefined ? undefined : Number(v))
const toOptional = (v: unknown) => (v === '' ? undefined : v)

interface CarFormProps {
    car?: Car
    onDone: () => void
    onCancel: () => void
}

export function CarForm({car, onDone, onCancel}: CarFormProps) {
    const {data: options} = useCarFilterOptions()
    const createCar = useCreateCar()
    const updateCar = useUpdateCar()
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<CarFormValues>({
        resolver: zodResolver(schema),
        defaultValues: car
            ? {
                  model: car.model,
                  manufacturer_id: car.manufacturer_id,
                  dealer_id: car.dealer_id,
                  size: car.size,
                  color: car.color,
                  fuel: car.fuel,
              }
            : {model: ''},
    })

    const onSubmit = handleSubmit(async (values) => {
        setFormError(null)
        try {
            if (car) await updateCar.mutateAsync({id: car.id, payload: values})
            else await createCar.mutateAsync(values)
            onDone()
        } catch (error) {
            setFormError(applyApiErrors(error, setError))
        }
    })

    const enumOptions = (values: readonly string[]) => values.map((v) => ({value: v, label: v[0].toUpperCase() + v.slice(1)}))

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
            {formError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}

            <Field label="Model" htmlFor="car-model" error={errors.model?.message}>
                <Input id="car-model" autoFocus invalid={!!errors.model} {...register('model')} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Manufacturer" htmlFor="car-manufacturer" error={errors.manufacturer_id?.message}>
                    <Select
                        id="car-manufacturer"
                        invalid={!!errors.manufacturer_id}
                        options={(options?.manufacturers ?? []).map((m) => ({value: m.id, label: m.name}))}
                        {...register('manufacturer_id', {setValueAs: toId})}
                    />
                </Field>
                <Field label="Dealer" htmlFor="car-dealer" error={errors.dealer_id?.message}>
                    <Select
                        id="car-dealer"
                        invalid={!!errors.dealer_id}
                        options={(options?.dealers ?? []).map((d) => ({value: d.id, label: d.name}))}
                        {...register('dealer_id', {setValueAs: toId})}
                    />
                </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Size" htmlFor="car-size" error={errors.size?.message}>
                    <Select id="car-size" invalid={!!errors.size} options={enumOptions(CAR_SIZES)} {...register('size', {setValueAs: toOptional})} />
                </Field>
                <Field label="Color" htmlFor="car-color" error={errors.color?.message}>
                    <Select id="car-color" invalid={!!errors.color} options={enumOptions(CAR_COLORS)} {...register('color', {setValueAs: toOptional})} />
                </Field>
                <Field label="Fuel" htmlFor="car-fuel" error={errors.fuel?.message}>
                    <Select id="car-fuel" invalid={!!errors.fuel} options={enumOptions(CAR_FUELS)} {...register('fuel', {setValueAs: toOptional})} />
                </Field>
            </div>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : car ? 'Save changes' : 'Create car'}
                </Button>
            </div>
        </form>
    )
}
