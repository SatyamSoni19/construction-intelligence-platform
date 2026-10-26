const mocks = {
    cracks: {
        summary: 'A diagonal crack is visible running from the window corner, consistent with differential settlement or stress concentration.',
        crack_detected: true, crack_type: 'diagonal', severity: 'medium', confidence: 0.86,
        estimated_width_mm: 2.5, urgency: 'within_month', requires_professional_inspection: true,
        location_description: 'Upper corner of the masonry wall, extending diagonally downward.',
        probable_causes: ['Differential foundation settlement', 'Stress concentration at opening corners', 'Thermal movement'],
        risk_assessment: 'Not an immediate collapse risk, but the crack may widen if the cause is not addressed.',
        recommended_actions: ['Mark the crack ends with dates and monitor for 4 weeks', 'Install a crack gauge', 'Get a structural engineer to inspect', 'Seal with epoxy only after the cause is resolved'],
    },
    safety: {
        summary: 'Several PPE and edge-protection violations were detected on the active work area.',
        overall_risk: 'high', hazards_detected: 3, compliance_score: 62,
        hazards: [
            { hazard: 'Worker without helmet', severity: 'high', recommendation: 'Enforce mandatory helmet use at the entry gate' },
            { hazard: 'Unprotected slab edge', severity: 'critical', recommendation: 'Install guardrails and toe boards immediately' },
            { hazard: 'Loose material on walkway', severity: 'medium', recommendation: 'Clear and designate a storage area' },
        ],
        recommended_actions: ['Hold a toolbox talk before the next shift', 'Assign a safety officer per floor', 'Re-inspect within 24 hours'],
    },
    valuation: {
        summary: 'Estimated value is based on location, area, property age and current local market trends.',
        estimated_value: '₹82L – ₹95L', price_per_sqft: '₹6,800', confidence: 0.78, market_trend: 'rising',
        key_factors: ['Prime location with good connectivity', 'Moderate property age (5 years)', 'Rising demand in the micro-market'],
        risks: ['Upcoming supply in the area may soften prices', 'Condition not verified without an inspection'],
    },
    planner: {
        summary: 'A phased plan for a G+1 residential building with estimated cost and duration.',
        total_duration: '12 months', estimated_cost: '₹48L – ₹55L', contingency: '10%',
        phases: [
            { phase: 'Site preparation & foundation', duration: '2 months', tasks: ['Soil testing', 'Excavation', 'Footing and plinth beam'] },
            { phase: 'Structure', duration: '4 months', tasks: ['Columns and beams', 'Slab casting', 'Curing'] },
            { phase: 'Masonry & services', duration: '3 months', tasks: ['Brickwork', 'Plumbing and electrical conduits', 'Plastering'] },
            { phase: 'Finishing', duration: '3 months', tasks: ['Flooring', 'Painting', 'Fixtures and handover'] },
        ],
        materials: ['Cement (OPC 43/53)', 'TMT steel bars', 'Bricks / AAC blocks', 'River or M-sand', 'Aggregates'],
        risks: ['Monsoon delays', 'Material price fluctuation'],
    },
    assistant: {
        summary: 'Progress is mostly on track, with minor labour shortage issues.',
        progress: 'On track', completion_today: '78%',
        checklist: ['Verify column reinforcement before pour', 'Record concrete cube samples', 'Check scaffolding stability', 'Update the material stock register'],
        issues: ['2 workers absent', 'Cement delivery delayed by half a day'],
        tomorrow_plan: ['Strip formwork on block A', 'Start curing of the poured columns', 'Confirm cement delivery'],
    },
    weather: {
        summary: 'Conditions are suitable for most work, but plan concrete pours for the morning.',
        temperature: '31°C', rain_chance: '20%', wind: '12 km/h', suitable_for_concrete_pouring: true, risk_level: 'low',
        advisory: ['Pour concrete before noon to avoid the afternoon heat', 'Keep tarpaulins ready in case of light showers', 'Start curing immediately after finishing'],
        precautions: ['Hydrate workers regularly', 'Secure loose sheets and scaffolding netting'],
    },
}

export const mockFor = (id) => mocks[id]

export const mockAnswer = (q) =>
    `Here's a general answer to “${q}”:\n\nFor most structural concrete, keep it continuously moist for at least 7 days (10–14 days for blended cements). Follow IS 456 for minimum cover, cement content and curing requirements, and confirm the exact values with your structural engineer for your specific project.`