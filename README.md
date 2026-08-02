# ResumeAI

An AI-powered resume builder and analyzer built with **React**, **Express**, and **Django**.

## Architecture

- **React (Vite + Tailwind)** — Frontend UI on port 5173
- **Express** — API Gateway (validation, rate limiting, file uploads) on port 3000
- **Django** — Core Backend (auth, database, AI analysis) on port 8000

## Getting Started

### 1. Django Backend (ai_service/)

```bash
cd ai_service
python -m venv venv
venv\Scripts\activate          # Windows
pip install -r requirements.txt
cp .env.example .env           # Edit with your settings
python manage.py migrate
python manage.py runserver 8000
```

### 2. Express Gateway (server/)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 3. React Frontend (client/)

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Environment Variables

Each service has its own `.env.example` file. Copy it to `.env` and fill in your values:

- `ai_service/.env` — Django secret key, Anthropic API key
- `server/.env` — Django backend URL
- `client/.env` — Express API URL

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3, React Router 6 |
| API Gateway | Express, Zod, Multer, Express Rate Limit |
| Backend | Django 5, Django REST Framework, SimpleJWT |
| AI | Anthropic Claude API |
| Database | SQLite |
