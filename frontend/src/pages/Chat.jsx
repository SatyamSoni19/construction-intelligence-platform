import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2 } from 'lucide-react'
import { askKnowledge } from '../api/client'

const suggestions = ['How long should concrete be cured?', 'What is the M20 mix ratio?', 'Difference between OPC and PPC cement?']

export default function Chat() {
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! Ask me anything about construction codes, materials or methods.' },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const endRef = useRef(null)

    useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

    const send = async (text) => {
        const q = (text ?? input).trim()
        if (!q || loading) return
        setMessages((m) => [...m, { role: 'user', text: q }])
        setInput('')
        setLoading(true)
        const answer = await askKnowledge(q)
        setMessages((m) => [...m, { role: 'bot', text: answer }])
        setLoading(false)
    }

    return (
        <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
                <h1 className="text-lg font-bold text-slate-900">Construction Knowledge Chatbot</h1>
                <p className="text-xs text-slate-500">Codes, materials, methods and best practices</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto p-4">
                {messages.map((m, i) => (
                    <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-white ${m.role === 'user' ? 'bg-slate-700' : 'bg-violet-500'}`}>
                            {m.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </span>
                        <p className={`max-w-[80%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-sm ${m.role === 'user' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-800'
                            }`}>{m.text}</p>
                    </div>
                ))}
                {loading && <p className="flex items-center gap-2 text-sm text-slate-400"><Loader2 size={14} className="animate-spin" /> Thinking...</p>}
                <div ref={endRef} />
            </div>

            <div className="border-t border-slate-200 p-4">
                {messages.length === 1 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                        {suggestions.map((s) => (
                            <button key={s} onClick={() => send(s)}
                                className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-600 hover:border-amber-500 hover:text-amber-600">{s}</button>
                        ))}
                    </div>
                )}
                <div className="flex gap-2">
                    <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()}
                        placeholder="Ask a construction question..."
                        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200" />
                    <button onClick={() => send()} className="rounded-lg bg-amber-500 px-4 text-slate-900 hover:bg-amber-400"><Send size={18} /></button>
                </div>
            </div>
        </div>
    )
}