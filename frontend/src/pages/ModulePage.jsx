import { useState } from 'react'
import toast from 'react-hot-toast'
import { Loader2, Sparkles, FlaskConical } from 'lucide-react'
import ImageUpload from '../components/ImageUpload'
import ResultView from '../components/ResultView'
import { runModule } from '../api/client'

const inputClass =
    'w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200'

export default function ModulePage({ mod }) {
    const [values, setValues] = useState(() =>
        Object.fromEntries(mod.fields.map((f) => [f.name, f.type === 'select' ? f.options[0] : '']))
    )
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState(null)
    const Icon = mod.icon

    const submit = async (e) => {
        e.preventDefault()
        if (mod.imageRequired && !file) return toast.error('Please upload an image first')
        setLoading(true)
        setResult(null)
        const res = await runModule(mod, values, file)
        setResult(res)
        setLoading(false)
        if (res.demo) toast('Backend unavailable, showing demo data', { icon: '🧪' })
    }

    return (
        <div>
            <div className="mb-6 flex items-center gap-4">
                <span className={`grid h-12 w-12 place-items-center rounded-xl text-white ${mod.color}`}><Icon size={24} /></span>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{mod.title}</h1>
                    <p className="text-sm text-slate-500">{mod.desc}</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-5">
                <form onSubmit={submit} className="space-y-4 self-start rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
                    {mod.image && <ImageUpload file={file} onChange={setFile} required={mod.imageRequired} />}
                    {mod.fields.map((f) => (
                        <div key={f.name}>
                            <label className="mb-1 block text-sm font-medium text-slate-700">{f.label}</label>
                            {f.type === 'textarea' ? (
                                <textarea rows={3} className={inputClass} placeholder={f.placeholder} value={values[f.name]}
                                    onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
                            ) : f.type === 'select' ? (
                                <select className={inputClass} value={values[f.name]}
                                    onChange={(e) => setValues({ ...values, [f.name]: e.target.value })}>
                                    {f.options.map((o) => <option key={o}>{o}</option>)}
                                </select>
                            ) : (
                                <input type={f.type} className={inputClass} placeholder={f.placeholder} value={values[f.name]}
                                    onChange={(e) => setValues({ ...values, [f.name]: e.target.value })} />
                            )}
                        </div>
                    ))}
                    <button disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:opacity-60">
                        {loading ? <><Loader2 size={16} className="animate-spin" /> Analyzing...</> : <><Sparkles size={16} /> Analyze</>}
                    </button>
                </form>

                <section className="lg:col-span-3">
                    {!result && !loading && (
                        <div className="grid h-full min-h-64 place-items-center rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-sm text-slate-400">
                            Your analysis will appear here
                        </div>
                    )}
                    {loading && (
                        <div className="space-y-3">
                            {[1, 2, 3].map((i) => <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-200" />)}
                        </div>
                    )}
                    {result && (
                        <>
                            {result.demo && (
                                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700">
                                    <FlaskConical size={14} /> Demo data
                                </div>
                            )}
                            <ResultView data={result.data} />
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}