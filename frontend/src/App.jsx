import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ModulePage from './pages/ModulePage'
import Chat from './pages/Chat'
import { modules, knowledge } from './utils/modules'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        {modules.map((m) => (
          <Route key={m.id} path={m.path} element={<ModulePage key={m.id} mod={m} />} />
        ))}
        <Route path={knowledge.path} element={<Chat />} />
      </Route>
    </Routes>
  )
}