import type {CarColor} from '../model/types'

export function ColorDot({color}: { color: CarColor }) {
    return <span aria-hidden className="inline-block size-3 rounded-full border border-slate-300"
                 style={{backgroundColor: color}}/>
}
