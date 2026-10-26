import axios from 'axios'
import { mockFor, mockAnswer } from '../utils/mockData'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: 60000,
})
const wait = (ms) => new Promise((r) => setTimeout(r, ms))

// Calls the backend; if it fails, falls back to sample data (demo: true)
export async function runModule(mod, values, file) {
    try {
        const form = new FormData()
        if (file) form.append('file', file)
        Object.entries(values).forEach(([k, v]) => v && form.append(k, v))
        const { data } = await api.post(mod.endpoint, form)
        return { data, demo: false }
    } catch {
        await wait(1500)
        return { data: mockFor(mod.id), demo: true }
    }
}

export async function askKnowledge(question) {
    try {
        const { data } = await api.post('/api/knowledge/ask', { question })
        return data.answer
    } catch {
        await wait(1000)
        return mockAnswer(question)
    }
}