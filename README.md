# ResumeAI 🚀

An AI-powered resume builder and analytics platform built with **React**, **Express**, and **Django** — powered by **Google Gemini AI**.

Build ATS-optimized resumes, generate tailored cover letters, analyze your resume's ATS score, compare against job descriptions, prepare for interviews, and more — all from one platform.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏗️ **Resume Builder** | Multi-section form with live preview, 20+ templates, custom color palettes, and PDF download |
| 🤖 **AI Field Enhancer** | 1-click AI polish for summaries, bullet points, and skill suggestions via Gemini AI |
| 📊 **ATS Score Analyzer** | Upload PDF/DOCX or use a saved resume for deep ATS compatibility scoring and keyword gap analysis |
| 📋 **Job Description Matcher** | Compare your resume side-by-side against any JD to discover missing keywords and boost match % |
| ✉️ **Cover Letter Studio** | AI-generated 4-paragraph cover letters with tone selection, live preview, and template matching |
| 🎯 **1-Click JD Tailor** | Auto-rewrite resume bullets and summary to align with a target job description |
| 🎤 **Interview Prep** | Generate STAR-method interview questions tailored to your resume and target role |
| 📁 **Resume History** | Full analysis history with ATS scores for all past sessions |
| 📤 **Resume Upload** | Upload existing PDF or DOCX resumes to your account |
| 🎨 **20+ Templates** | Designer resume and cover letter templates with custom color palettes |

---

## 🏛️ Architecture

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│     React Frontend      │────▶│    Express Gateway       │────▶│     Django Backend       │
│   (Vite + Tailwind)     │     │  (Validation + Proxy)    │     │  (Auth + DB + Gemini AI) │
│     Port: 5173          │     │     Port: 3000           │     │     Port: 8000           │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

- **React (Vite + Tailwind CSS 3)** — Frontend SPA with React Router 6
- **Express** — API Gateway: input validation (Zod), rate limiting, file upload handling (Multer), and proxying to Django
- **Django 6 + Django REST Framework** — Core backend: JWT authentication, resume/cover letter CRUD, AI orchestration
- **Google Gemini AI** — Powers all AI features: resume generation, field enhancement, ATS analysis, cover letter generation, JD tailoring, and interview prep
- **SQLite** — Database (easily swappable to PostgreSQL for production)

---

## 🚀 Getting Started

Start all three services in separate terminals. **Start Django first**, then Express, then React.

### 1. Django Backend (`ai_service/`)

```bash
cd ai_service

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env — add your GEMINI_API_KEY and Django SECRET_KEY

# Run database migrations
python manage.py migrate

# Start the server
python manage.py runserver 8000
```

### 2. Express Gateway (`server/`)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 3. React Frontend (`client/`)

```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Environment Variables

Each service has its own `.env.example`. Copy it to `.env` and fill in your values.

### `ai_service/.env`

```env
SECRET_KEY=your-django-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

# Google Gemini AI — get your key at https://aistudio.google.com/
GEMINI_API_KEY=your-gemini-api-key-here

# Express gateway origin (for CORS)
CORS_ALLOWED_ORIGIN=http://localhost:3000
```

### `server/.env`

```env
PORT=3000
DJANGO_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:5173
```

### `client/.env`

```env
VITE_API_URL=http://localhost:3000
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS 3, React Router 6, Lucide React |
| **API Gateway** | Express 4, Zod (validation), Multer (file uploads), Express Rate Limit, Helmet |
| **Backend** | Django 6, Django REST Framework, SimpleJWT |
| **AI** | Google Gemini AI (`google-genai`) |
| **Database** | SQLite (default) |
| **HTTP Client** | Axios (frontend & gateway) |

---

## 📁 Project Structure

```
ResumeAI/
├── client/               # React frontend (Vite)
│   └── src/
│       ├── api/          # Axios API client functions
│       ├── components/   # Reusable UI components
│       ├── contexts/     # Auth & Theme context providers
│       ├── pages/        # Route-level page components
│       ├── templates/    # Resume template registry
│       └── utils/        # PDF export utilities
├── server/               # Express API gateway
│   └── src/
│       ├── middleware/   # Auth, rate limiting, file upload
│       ├── proxy/        # Django proxy forwarder
│       ├── routes/       # Route handlers (auth, resumes, analysis, etc.)
│       └── validators/   # Zod input schemas
└── ai_service/           # Django backend
    ├── users/            # JWT auth: signup, login, refresh, logout
    ├── resumes/          # Resume CRUD, file upload, AI generation
    ├── analysis/         # ATS scoring, JD comparison, history
    └── cover_letters/    # Cover letter CRUD and AI generation
```

---

## 🔒 Authentication Flow

1. User signs up / logs in via React → Express validates input → Django issues JWT tokens
2. `accessToken` and `refreshToken` are stored in `localStorage`
3. Axios request interceptor attaches `Authorization: Bearer <token>` to every request
4. Axios response interceptor automatically refreshes expired tokens using the refresh token
5. On refresh failure, tokens are cleared and the user is redirected to `/login`

---

## 📝 API Endpoints (Express Gateway)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT tokens |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `POST` | `/api/auth/logout` | Invalidate refresh token |
| `GET` | `/api/auth/me` | Get current user profile |
| `GET` | `/api/resumes` | List all resumes |
| `POST` | `/api/resumes` | Create a new resume |
| `GET` | `/api/resumes/:id` | Get a specific resume |
| `PUT` | `/api/resumes/:id` | Update a resume |
| `DELETE` | `/api/resumes/:id` | Delete a resume |
| `POST` | `/api/resumes/upload` | Upload PDF/DOCX resume file |
| `POST` | `/api/resumes/enhance-field` | AI-enhance a specific field |
| `POST` | `/api/analysis/analyze` | Run full ATS analysis |
| `POST` | `/api/analysis/compare-jd` | Compare resume vs job description |
| `GET` | `/api/analysis/history` | Get past analysis history |
| `GET` | `/api/cover-letters` | List cover letters |
| `POST` | `/api/cover-letters` | Create a cover letter |
| `POST` | `/api/cover-letters/generate` | AI-generate a cover letter |
| `POST` | `/api/tailor/generate` | 1-click JD tailor a resume |
| `POST` | `/api/interview/generate` | Generate interview prep questions |

---

## 📄 License

MIT © ResumeAI
