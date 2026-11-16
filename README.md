# CareerAI Platform - Intelligent Career Recommendation & Skill Guidance System

CareerAI is a production-ready, full-stack AI-powered career recommendation platform built with **React (TypeScript)**, **Express (Node.js)**, **Tailwind CSS**, **Chart.js / Recharts**, and **Google Gemini 3.6 Flash**.

The platform provides end-to-end guidance for students and professionals—from initial career quiz assessment and interactive roadmaps to ATS resume review, skill gap analysis, mock interview preparation, course/job recommendations, and real-time administrative analytics.

---

## 🚀 Key Modules & System Capabilities

1. **Module 1: Authentication & User Accounts (`/login`, `/register`, `/forgot-password`)**
   - JWT token-based authentication with bcrypt password hashing.
   - User profile management with target career goals and skill inventory.
   - Demo credentials available out-of-the-box (`admin@example.com` / `admin123`).

2. **Module 2: Student Dashboard (`/`)**
   - Central command center displaying career match score gauge, active roadmap progress, upcoming interview drills, and recommended jobs.

3. **Module 3: AI Career Assessment Quiz (`/assessment`)**
   - Multi-step interactive quiz collecting user interests, technical skills, and salary expectations.
   - Real-time Gemini 3.6 Flash recommendation engine with automatic fallback handling.

4. **Module 4: Dynamic Career Roadmaps (`/roadmap`)**
   - Phase-by-phase learning paths with estimated durations, key milestone checklists, and downloadable PDF roadmap export (`jsPDF`).

5. **Module 5: AI Resume Reviewer (`/resume`)**
   - Instant ATS score calculation, keyword gap detection, formatting checks, and exportable PDF analysis report.

6. **Module 6: Skill Gap Analysis (`/skill-gap`)**
   - Visual comparison between user skill profile and market demand benchmarks.

7. **Module 7: Market Insights & Salary Radar (`/market`)**
   - Live industry compensation trends, regional demand metrics, and top hiring companies.

8. **Module 8: Interactive Mock Interview Prep (`/interview`)**
   - AI-driven technical & behavioral interview questions with real-time answer scoring and STAR framework feedback.

9. **Module 9: Course Recommendations (`/courses`)**
   - Personalized course catalog mapped directly to missing skill gaps across top providers (Coursera, Udemy, edX).

10. **Module 10: AI Job Match Engine (`/jobs`)**
    - High-match job vacancy listings with one-click bookmarking and direct application portals.

11. **Module 11: User Feedback & Rating System (`/feedback`)**
    - Star-rating submission engine and feedback review wall.

12. **Module 12: Admin Management Panel (`/admin`)**
    - Comprehensive management interface for user accounts, career database schemas, course catalog updates, and feedback moderation.

13. **Module 13: System Analytics & Intelligence (`/analytics`)**
    - Chart.js powered data visualizers including user growth lines, career choice doughnuts, popular skills radar, and rating polar histograms.

14. **Module 14: Real-time Notification System (`React-Toastify`)**
    - Instant notification triggers for success, error, AI recommendation ready, resume analyzed, and new course additions.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Chart.js (`react-chartjs-2`), Recharts, Framer Motion, React Toastify, jsPDF.
- **Backend**: Node.js, Express, TypeScript, tsx, esbuild, JWT Authentication, In-Memory DB Store (MongoDB / SQL compatible architecture).
- **AI Integration**: `@google/genai` TypeScript SDK (Gemini 3.6 Flash model with rate-limit resilient fallback logic).

---

## 📦 Installation & Setup Guide

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Quickstart Development Setup

```bash
# Clone repository
git clone <repository-url>
cd career-ai-platform

# Install dependencies
npm install

# Start development server (Runs Express backend + Vite frontend on port 3000)
npm run dev
```

The application will be accessible at `http://localhost:3000`.

---

## 🔒 Environment Variables

Copy `.env.example` to `.env` and set your configuration variables:

```env
# Server Port (Default: 3000)
PORT=3000

# Google Gemini API Key (Server-side execution only)
GEMINI_API_KEY=your_gemini_api_key_here

# JWT Secret for Authentication
JWT_SECRET=super_secret_jwt_key_career_ai_2026
```

---

## 🛠️ Available NPM Scripts

- `npm run dev`: Boots Express backend with live Vite HMR on port 3000.
- `npm run build`: Bundles Vite frontend client and compiles TypeScript `server.ts` into CommonJS `dist/server.cjs` with `esbuild`.
- `npm run start`: Runs production server using `node dist/server.cjs`.
- `npm run lint`: Validates TypeScript type compliance (`tsc --noEmit`).

---

## 📄 License
MIT License. Built for production deployment and seamless scale.
