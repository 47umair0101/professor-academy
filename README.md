# Professor Academy

> **Production-Grade, Multi-Platform Learning Management System (LMS) and Academic Portal**  
> Tailored for the Pakistani academic landscape (`PKR`), backed by 100% free-first scalable infrastructure.

---

## 🏛️ Architectural Overview

- **Monorepo:** Turborepo + `pnpm` workspaces
- **Web App:** Next.js 15 (App Router, TypeScript, Tailwind CSS, Lucide Icons)
- **Mobile App:** React Native (Expo SDK + Expo Router + NativeWind)
- **Backend & Database:** Supabase (PostgreSQL, Auth, Storage, Realtime)
- **AI Engine:** Google Gemini AI (`@google/genai` — `gemini-2.5-flash` for OCR, tutoring & grading, `gemini-2.5-flash-image` for lesson diagrams)
- **Rich Text Editor:** Tiptap (Headless rich article builder with AI co-pilot)
- **Media Delivery:** YouTube Unlisted Embeds (100% Free Unlimited Video) + Cloudflare R2 / Supabase Storage
- **Transactional Communication:** Resend API + Nodemailer (Gmail/SMTP fallback) + Expo Push Alerts
- **Certificates:** In-memory PDF Certificate generation (`pdf-lib`)

---

## 🎨 Design System Philosophy (Anti-"Vibe-Coded")

Professor Academy embodies the prestigious, timeless aesthetic of high-tier academic institutions:
- **Academic Navy (`#1A2451` / `#111838`):** Authoritative, reliable, clean.
- **Heritage Gold (`#C59B27`):** Academic excellence, honors, certificate seals, active highlights.
- **Warm Cream Canvas (`#FAF9F6`):** Paper-like, high-contrast, fatigue-free long-form reading.
- **Structural White Cards (`#FFFFFF`):** Framed with crisp $1\text{px}$ `#E5E3DC` borders.
- **Typography:** `Poppins` (Bold & Semibold Headings), `Inter` (Legible Body UI), and `JetBrains Mono` (Timers, PKR Pricing, Transaction IDs).

---

## 📂 Monorepo Structure

```text
├── apps/
│   ├── web/               # Next.js 15 App Router web application
│   └── mobile/            # React Native Expo mobile application
├── packages/
│   ├── shared/            # Shared TypeScript types, Zod validation, color tokens, constants
│   └── config/            # Shared Tailwind, ESLint, TypeScript configs
├── PROGRESS.md            # Live module-by-module execution tracker
├── prd.md                 # Product Requirements Document (V2.0)
└── turbo.json             # Turborepo task pipeline configuration
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js `20.x` or later (tested on Node v24.x)
- `pnpm` (`npm install -g pnpm`)

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Server
```bash
# Start all workspace apps
pnpm dev

# Or start Web specifically
pnpm --filter web dev
```

### 4. Interactive Design System Showcase
Open [http://localhost:3000/design-preview](http://localhost:3000/design-preview) to preview all UI components, color tokens, typography scales, and academic widgets.
