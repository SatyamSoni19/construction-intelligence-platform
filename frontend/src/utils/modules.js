import { ScanSearch, HardHat, Building2, CalendarRange, ClipboardList, CloudSun, BookOpen } from 'lucide-react'

export const modules = [
    {
        id: 'cracks', path: '/cracks', title: 'Crack Detection', icon: ScanSearch, color: 'bg-rose-500',
        desc: 'Upload a wall, beam or slab photo to get crack type, severity and repair advice.',
        endpoint: '/api/cracks/analyze', image: true, imageRequired: true,
        fields: [{ name: 'notes', label: 'Notes (optional)', type: 'textarea', placeholder: 'e.g. Crack appeared after heavy rain' }],
    },
    {
        id: 'safety', path: '/safety', title: 'Site Safety', icon: HardHat, color: 'bg-amber-500',
        desc: 'Detect hazards like missing helmets or open edges from a site photo.',
        endpoint: '/api/safety/analyze', image: true, imageRequired: true,
        fields: [{ name: 'notes', label: 'Notes (optional)', type: 'textarea', placeholder: 'e.g. 3rd floor slab work' }],
    },
    {
        id: 'valuation', path: '/valuation', title: 'Real Estate Valuation', icon: Building2, color: 'bg-emerald-500',
        desc: 'Estimate a property value range with the key factors behind it.',
        endpoint: '/api/valuation/estimate', image: true, imageRequired: false,
        fields: [
            { name: 'location', label: 'Location', type: 'text', placeholder: 'e.g. Indore, Vijay Nagar' },
            { name: 'type', label: 'Property type', type: 'select', options: ['Apartment', 'Independent house', 'Villa', 'Plot', 'Commercial'] },
            { name: 'area', label: 'Area (sq ft)', type: 'number', placeholder: '1200' },
            { name: 'age', label: 'Age (years)', type: 'number', placeholder: '5' },
        ],
    },
    {
        id: 'planner', path: '/planner', title: 'Project Planner', icon: CalendarRange, color: 'bg-indigo-500',
        desc: 'Generate phases, tasks, materials and cost/time estimates for a project.',
        endpoint: '/api/planner/plan', image: false,
        fields: [
            { name: 'project_type', label: 'Project type', type: 'select', options: ['Residential building', 'Commercial complex', 'Road', 'Renovation', 'Warehouse'] },
            { name: 'size', label: 'Size (sq ft)', type: 'number', placeholder: '2400' },
            { name: 'budget', label: 'Budget (₹)', type: 'number', placeholder: '5000000' },
            { name: 'timeline', label: 'Timeline (months)', type: 'number', placeholder: '12' },
        ],
    },
    {
        id: 'assistant', path: '/assistant', title: 'Daily Site Assistant', icon: ClipboardList, color: 'bg-sky-500',
        desc: 'Turn today’s update (text and/or photo) into a checklist and progress summary.',
        endpoint: '/api/assistant/daily', image: true, imageRequired: false,
        fields: [{ name: 'update', label: 'Today’s update', type: 'textarea', placeholder: 'e.g. Columns poured on block B, 2 workers absent...' }],
    },
    {
        id: 'weather', path: '/weather', title: 'Weather Advisory', icon: CloudSun, color: 'bg-cyan-500',
        desc: 'Get weather-aware advice, like whether it’s safe to pour concrete today.',
        endpoint: '/api/weather/advisory', image: false,
        fields: [{ name: 'location', label: 'Site location', type: 'text', placeholder: 'e.g. Mumbai' }],
    },
]

export const knowledge = {
    id: 'knowledge', path: '/knowledge', title: 'Knowledge Chatbot', icon: BookOpen, color: 'bg-violet-500',
    desc: 'Ask about building codes, materials, curing times and construction methods.',
}