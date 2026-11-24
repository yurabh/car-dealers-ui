import {useEffect, useRef, useState, type InputHTMLAttributes, type ReactNode} from 'react'
import {cx} from '@/shared/lib/cx'

export function FilterSection({
                                  title,
                                  onClear,
                                  children,
                              }: {
    title: string
    onClear?: () => void
    children: ReactNode
}) {
    return (
        <section className="border-b border-slate-100 py-4 last:border-0">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</h3>
                {onClear && (
                    <button type="button" onClick={onClear} className="text-xs text-slate-500 hover:text-slate-900">
                        Clear
                    </button>
                )}
            </div>
            {children}
        </section>
    )
}

interface Option<V> {
    value: V
    label: string
}

export function CheckboxList<V extends string | number>({
                                                            options,
                                                            selected,
                                                            onChange,
                                                            maxHeight = 'max-h-48',
                                                        }: {
    options: Option<V>[]
    selected: V[]
    onChange: (next: V[]) => void
    maxHeight?: string
}) {
    const toggle = (value: V) =>
        onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])

    if (options.length === 0) return <p className="text-xs text-slate-400">No options</p>

    return (
        <ul className={cx('space-y-1 overflow-y-auto pr-1', maxHeight)}>
            {options.map((o) => (
                <li key={o.value}>
                    <label
                        className="flex cursor-pointer items-center gap-2 rounded px-1 py-0.5 text-sm hover:bg-slate-50">
                        <input
                            type="checkbox"
                            checked={selected.includes(o.value)}
                            onChange={() => toggle(o.value)}
                            className="size-4 rounded border-slate-300 accent-slate-900"
                        />
                        <span className="truncate">{o.label}</span>
                    </label>
                </li>
            ))}
        </ul>
    )
}

export function ChipGroup<V extends string>({
                                                options,
                                                selected,
                                                onChange,
                                                renderLabel = (v) => v,
                                            }: {
    options: readonly V[]
    selected: V[]
    onChange: (next: V[]) => void
    renderLabel?: (value: V) => ReactNode
}) {
    const toggle = (value: V) =>
        onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value])

    return (
        <div className="flex flex-wrap gap-1.5">
            {options.map((value) => {
                const active = selected.includes(value)
                return (
                    <button
                        key={value}
                        type="button"
                        aria-pressed={active}
                        onClick={() => toggle(value)}
                        className={cx(
                            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium capitalize transition-colors',
                            active
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'border-slate-300 bg-white text-slate-600 hover:border-slate-400',
                        )}
                    >
                        {renderLabel(value)}
                    </button>
                )
            })}
        </div>
    )
}

export function DebouncedInput({
                                   value,
                                   onChange,
                                   delay = 300,
                                   className,
                                   ...props
                               }: {
    value: string
    onChange: (value: string) => void
    delay?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'>) {
    const [draft, setDraft] = useState(value)
    const [synced, setSynced] = useState(value)
    const onChangeRef = useRef(onChange)

    useEffect(() => {
        onChangeRef.current = onChange
    })

    if (value !== synced) {
        setSynced(value)
        setDraft(value)
    }

    useEffect(() => {
        if (draft === value) return
        const timer = setTimeout(() => onChangeRef.current(draft), delay)
        return () => clearTimeout(timer)
    }, [draft, value, delay])

    return (
        <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className={cx(
                'block w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm',
                'focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900/10',
                className,
            )}
            {...props}
        />
    )
}

/**
 * min / max pair for numeric ranges (cars amount, employees).
 * Each input reports only its own value: sending both could overwrite a value
 * the other input has just changed (both are debounced independently).
 */
export function RangeFilter({
                                min,
                                max,
                                placeholderMin,
                                placeholderMax,
                                onMinChange,
                                onMaxChange,
                            }: {
    min?: number
    max?: number
    placeholderMin?: string
    placeholderMax?: string
    onMinChange: (min: number | undefined) => void
    onMaxChange: (max: number | undefined) => void
}) {
    const toNumber = (v: string) => (v === '' ? undefined : Math.max(0, Math.trunc(Number(v))))

    return (
        <div className="flex items-center gap-2">
            <DebouncedInput
                type="number"
                min={0}
                inputMode="numeric"
                aria-label="Minimum"
                placeholder={placeholderMin ?? 'Min'}
                value={min?.toString() ?? ''}
                onChange={(v) => onMinChange(toNumber(v))}
            />
            <span className="text-slate-400">–</span>
            <DebouncedInput
                type="number"
                min={0}
                inputMode="numeric"
                aria-label="Maximum"
                placeholder={placeholderMax ?? 'Max'}
                value={max?.toString() ?? ''}
                onChange={(v) => onMaxChange(toNumber(v))}
            />
        </div>
    )
}
