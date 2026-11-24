import type {ReactNode} from 'react'
import {Button} from './Button'
import {Modal} from './Modal'

interface ConfirmDialogProps {
    open: boolean
    title: string
    message: ReactNode
    confirmLabel?: string
    isPending?: boolean
    error?: string | null
    onConfirm: () => void
    onClose: () => void
}

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Delete',
    isPending,
    error,
    onConfirm,
    onClose,
}: ConfirmDialogProps) {
    return (
        <Modal open={open} title={title} onClose={onClose}>
            <div className="text-sm text-slate-600">{message}</div>
            {error && <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
            <div className="mt-6 flex justify-end gap-2">
                <Button variant="secondary" onClick={onClose} disabled={isPending}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm} disabled={isPending}>
                    {isPending ? 'Deleting…' : confirmLabel}
                </Button>
            </div>
        </Modal>
    )
}
