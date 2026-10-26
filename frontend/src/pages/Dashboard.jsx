import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { modules, knowledge } from '../utils/modules'

export default function Dashboard() {
    return (
        <div>
            <section className="mb-8 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-700 p-8 text-white sm:p-10">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400">AI-Powered</p>
                <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">Multimodal Construction Intelligence Platform</h1>
                <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                    Upload a site photo, enter project data or ask a question. Get structured, actionable insights for
                    safety, quality, planning and valuation.
                </p>
                <Link to="/cracks"
                    className="mt-6 inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-900 hover:bg-amber-400">
                    Get started <ArrowRight size={16} />
                </Link>
            </section>

            <h2 className="mb-4 text-lg font-semibold text-slate-900">Modules</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[...modules, knowledge].map(({ id, path, title, desc, icon: Icon, color }) => (
                    <Link key={id} to={path}
                        className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                        <span className={`mb-3 grid h-11 w-11 place-items-center rounded-xl text-white ${color}`}><Icon size={22} /></span>
                        <h3 className="font-semibold text-slate-900">{title}</h3>
                        <p className="mt-1 text-sm text-slate-500">{desc}</p>
                        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-600 group-hover:gap-2">
                            Open <ArrowRight size={14} />
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}