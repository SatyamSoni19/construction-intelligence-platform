# Multimodal Construction Intelligence Platform

A full-stack AI-powered platform for construction industry insights. The backend is built with **FastAPI** (Python) and integrates **Anthropic Claude** (multimodal LLM) to analyse images and text, returning structured JSON responses for seven core use cases:

- **Site Safety** – hazard detection and PPE compliance analysis from site photos
- **Crack Detection** – structural crack classification and severity assessment
- **Real Estate Valuation** – AI-driven property value estimation from images and metadata
- **Project Planning** – schedule generation and resource planning assistance
- **Daily Site Assistant** – conversational Q&A for on-site personnel
- **Weather Advisory** – construction-activity recommendations based on weather data
- **Knowledge Chatbot** – domain-specific construction knowledge retrieval

The frontend is a **React + Vite** single-page application styled with **Tailwind CSS**, providing a modern dashboard to interact with each AI module.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Backend | FastAPI, Uvicorn, Pydantic v2 |
| AI | Anthropic Claude (claude-sonnet-5-5) |
| HTTP | Axios (frontend), HTTPX (backend) |

## Quick Start

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
# Copy .env.example to .env and add your ANTHROPIC_API_KEY
uvicorn app.main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` for the UI and `http://localhost:8000/health` to verify the API.
