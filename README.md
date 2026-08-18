# CATALOGUE

**CATALOGUE** is an AI-powered language learning platform inspired by gamified, habit-building applications like Duolingo. Guided by **Kleo**, your AI cat companion, CATALOGUE helps users master languages (Korean, Japanese, English) through interactive lessons, stroke tracing, spaced-repetition flashcards, and real-time voice translation.

---

## Features

-  **Kleo AI Companion**: An interactive cat mascot that provides real-time tutoring, grammar tips, customizable wardrobe, and mood reactions.
-  **Interactive Skill Tree & Lessons**: Unit-based learning paths for letters, foundational vocabulary, short phrases, and script tracing.
-  **SM-2 Spaced Repetition (SRS)**: Flashcard review system with interval scheduling (`Again`, `Hard`, `Good`, `Easy`).
-  **Voice & Text Translator**: Real-time translation with phonetic breakdown and instant flashcard saving.
-  **Express & Convex Backends**: Full E2E support with in-memory fallbacks, JWT authentication, and Convex state sync.

---

##  Tech Stack

- **Frontend**: React 19, Vite, TypeScript, TailwindCSS v4, Framer Motion, Lucide Icons, Canvas Confetti
- **Backend / DB**: Node.js, Express, Prisma (SQLite), Convex
- **Monitoring & Error Tracking**: Sentry React Integration

---

##  Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/CATalogue.git
   cd CATalogue
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```

5. **(Optional) Run Express API Server**:
   ```bash
   node server/server.js
   ```

---

##  Scripts

- `npm run dev`: Starts Vite local development server.
- `npm run build`: Typechecks with `tsc` and builds production assets with Vite.
- `npm run preview`: Previews the production build locally.

---


