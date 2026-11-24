import {useEffect, useRef, type ReactNode} from 'react'

interface ModalProps {
    open: boolean
    title: string
    onClose: () => void
    children: ReactNode
}

export function Modal({open, title, onClose, children}: ModalProps) {
    const ref = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        const dialog = ref.current
        if (!dialog) return
        if (open && !dialog.open) {
            dialog.showModal()
            // showModal() moves focus to the first focusable element (the ✕ button);
            // put it into the first form field instead, so typing + Enter submits the form.
            dialog.querySelector<HTMLElement>('input, select, textarea')?.focus()
        }
        if (!open && dialog.open) dialog.close()
    }, [open])

    return (
        <dialog
            ref={ref}
            onCancel={(e) => {
                e.preventDefault()
                onClose()
            }}
            onClick={(e) => {
                if (e.target === ref.current) onClose()
            }}
            className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-xl bg-white p-0 shadow-xl backdrop:bg-slate-900/40"
        >
            {open && (
                <div className="p-6">
                    <div className="mb-5 flex items-start justify-between gap-4">
                        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close"
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        >
                            ✕
                        </button>
                    </div>
                    {children}
                </div>
            )}
        </dialog>
    )
}
