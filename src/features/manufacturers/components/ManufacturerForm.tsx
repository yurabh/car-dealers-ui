import {zodResolver} from '@hookform/resolvers/zod'
import {useState} from 'react'
import {useForm} from 'react-hook-form'
import {z} from 'zod'
import {applyApiErrors} from '@/shared/lib/form-errors'
import {Button} from '@/shared/ui/Button'
import {Field, Input} from '@/shared/ui/form'
import {useCreateManufacturer, useUpdateManufacturer} from '../api/manufacturers.queries'
import type {Manufacturer} from '../model/types'

const schema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(255),
})

type ManufacturerFormValues = z.infer<typeof schema>

interface ManufacturerFormProps {
    manufacturer?: Manufacturer
    onDone: () => void
    onCancel: () => void
}

export function ManufacturerForm({manufacturer, onDone, onCancel}: ManufacturerFormProps) {
    const createManufacturer = useCreateManufacturer()
    const updateManufacturer = useUpdateManufacturer()
    const [formError, setFormError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isSubmitting},
    } = useForm<ManufacturerFormValues>({
        resolver: zodResolver(schema),
        defaultValues: {name: manufacturer?.name ?? ''},
    })

    const onSubmit = handleSubmit(async (values) => {
        setFormError(null)
        try {
            if (manufacturer) await updateManufacturer.mutateAsync({id: manufacturer.id, payload: values})
            else await createManufacturer.mutateAsync(values)
            onDone()
        } catch (error) {
            // e.g. 422 "The name has already been taken." shows under the field
            setFormError(applyApiErrors(error, setError))
        }
    })

    return (
        <form onSubmit={onSubmit} noValidate className="space-y-4">
            {formError && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{formError}</p>}

            <Field label="Name" htmlFor="manufacturer-name" error={errors.name?.message}>
                <Input id="manufacturer-name" autoFocus invalid={!!errors.name} {...register('name')} />
            </Field>

            <div className="flex justify-end gap-2 pt-2">
                <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving…' : manufacturer ? 'Save changes' : 'Create manufacturer'}
                </Button>
            </div>
        </form>
    )
}
