import { CheckCircle2 } from 'lucide-react'

const tones = {
    green: 'bg-emerald-100 text-emerald-700', amber: 'bg-amber-100 text-amber-700',
    orange: 'bg-orange-100 text-orange-700', red: 'bg-red-100 text-red-700', slate: 'bg-slate-100 text-slate-700',
}
const toneOf = (v) => ({
    low: 'green', none: 'green', monitor: 'green', medium: 'amber', within_month: 'amber',
    high: 'orange', within_week: 'orange', critical: 'red', immediate: 'red',
}[String(v).toLowerCase()] || 'slate')

const label = (k) => k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
const isScalar = (v) => v === null || ['string', 'number', 'boolean'].includes(typeof v)
const fmt = (k, v) => {
    if (v === null) return '—'
    if (typeof v === 'boolean') return v ? 'Yes' : 'No'
    if (k === 'confidence' && typeof v === 'number') return `${Math.round(v * 100)}%`
    return String(v).replace(/_/g, ' ')
}

function ObjectCard({ obj }) {
    const title = obj.name || obj.phase || obj.hazard || obj.title
    return (
        <div className="rounded-lg border border-slate-200 p-3">
            {title && <p className="mb-1 text-sm font-semibold">{title}</p>}
            <dl className="space-y-1 text-sm">
                {Object.entries(obj).filter(([, v]) => v !== title).map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                        <dt className="shrink-0 text-slate-500">{label(k)}:</dt>
                        <dd className="text-slate-800">
                            {Array.isArray(v) ? v.join(', ') : (
                                ['severity', 'urgency'].includes(k)
                                    ? <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${tones[toneOf(v)]}`}>{fmt(k, v)}</span>
                                    : fmt(k, v)
                            )}
                        </dd>
                    </div>
                ))}
            </dl>
        </div>
    )
}

export default function ResultView({ data }) {
    const { summary, ...rest } = data
    const entries = Object.entries(rest)
    const tiles = entries.filter(([, v]) => isScalar(v) && (typeof v !== 'string' || v.length <= 28))
    const texts = entries.filter(([, v]) => typeof v === 'string' && v.length > 28)
    const lists = entries.filter(([, v]) => Array.isArray(v))

    return (
        <div className="space-y-4">
            {summary && (
                <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50 p-4 text-sm leading-relaxed text-slate-800">
                    {summary}
                </div>
            )}

            {tiles.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {tiles.map(([k, v]) => (
                        <div key={k} className="rounded-xl border border-slate-200 bg-white p-3">
                            <p className="text-xs text-slate-500">{label(k)}</p>
                            <span className={`mt-1 inline-block rounded-md px-2 py-0.5 text-sm font-semibold capitalize ${['severity', 'urgency', 'overall_risk', 'risk_level'].includes(k) ? tones[toneOf(v)] : 'text-slate-900'
                                }`}>
                                {fmt(k, v)}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            {texts.map(([k, v]) => (
                <div key={k} className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="mb-1 text-sm font-semibold">{label(k)}</h4>
                    <p className="text-sm text-slate-600">{v}</p>
                </div>
            ))}

            {lists.map(([k, arr]) => (
                <div key={k} className="rounded-xl border border-slate-200 bg-white p-4">
                    <h4 className="mb-2 text-sm font-semibold">{label(k)}</h4>
                    {typeof arr[0] === 'object' ? (
                        <div className="grid gap-2 sm:grid-cols-2">{arr.map((o, i) => <ObjectCard key={i} obj={o} />)}</div>
                    ) : (
                        <ul className="space-y-1.5">
                            {arr.map((item, i) => (
                                <li key={i} className="flex gap-2 text-sm text-slate-600">
                                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-amber-500" /> {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            ))}
        </div>
    )
}