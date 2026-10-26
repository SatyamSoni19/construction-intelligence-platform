import { NavLink, Outlet, Link } from 'react-router-dom'
import { LayoutDashboard, Building } from 'lucide-react'
import { modules, knowledge } from '../utils/modules'

const links = [{ path: '/', title: 'Dashboard', icon: LayoutDashboard }, ...modules, knowledge]

const linkClass = ({ isActive }) =>
    `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition whitespace-nowrap ${isActive ? 'bg-amber-500 text-slate-900' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`

export default function Layout() {
    return (
        <div className="min-h-screen lg:flex">
            <aside className="bg-slate-900 lg:fixed lg:inset-y-0 lg:w-64 lg:flex lg:flex-col">
                <Link to="/" className="flex items-center gap-3 px-5 py-5 text-white">
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-500 text-slate-900"><Building size={20} /></span>
                    <span className="leading-tight">
                        <span className="block text-sm font-bold">ConstructAI</span>
                        <span className="block text-xs text-slate-400">Intelligence Platform</span>
                    </span>
                </Link>
                <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0">
                    {links.map(({ path, title, icon: Icon }) => (
                        <NavLink key={path} to={path} end={path === '/'} className={linkClass}>
                            <Icon size={18} /> {title}
                        </NavLink>
                    ))}
                </nav>
                <p className="mt-auto hidden px-5 py-4 text-xs text-slate-500 lg:block">Multimodal AI for construction</p>
            </aside>
            <main className="flex-1 lg:ml-64">
                <div className="mx-auto max-w-6xl p-5 sm:p-8"><Outlet /></div>
            </main>
        </div>
    )
}