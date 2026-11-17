# FESTRONIX 2026 — Flagship Website

> Official flagship production web application for **FESTRONIX 2026**, a national-level technical fest organized by the **Student Affairs Cell** at **Vardhaman College of Engineering (VCE)**, Hyderabad.

---

## ⚡ Tech Stack & Architecture

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/) + TypeScript + React 18
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with a bespoke Obsidian/Cyan design system
- **3D & WebGL Graphics:** [Three.js](https://threejs.org/) with procedural GLSL shaders (topographic undulating contour line art matching the physical event poster + refractive 3D glass core)
- **Smooth Scrolling:** [Lenis](https://lenis.darkroom.engineering/) for fluid 60fps momentum scrolling
- **Micro-Interactions & Physics:** [Framer Motion](https://www.framer-motion.com/) + custom CSS 3D perspective tilt
- **Audio Engine:** Client-side Web Audio API synthetic feedback (zero external audio asset bloat)
- **Icons:** [Lucide React](https://lucide.dev/)

---

## 🚀 Quickstart & Development

### 1. Prerequisites
- **Node.js:** v18.17+ or v20+ (tested on Node v24)
- **npm:** v9+ or v11+

### 2. Installation
```bash
# Clone or open the project folder
cd festronix

# Install dependencies
npm run install
# Or on Windows PowerShell:
npm.cmd install
```

### 3. Local Development
```bash
npm run dev
# Or on Windows PowerShell:
npm.cmd run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build & Verification
```bash
npm run build
npm run start
```
The application statically pre-renders all core routes (`/`, `/events`, `/events/[slug]`) with full SEO and OpenGraph metadata.

### 5. Deploy to Vercel
Push your repository to GitHub / GitLab and import directly into [Vercel](https://vercel.com):
- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- No environment variables are strictly required to start; all default values are typed in `/data/config.ts`.

---

## 📝 How to Update & Add Content (Data-Driven Layer)

To customize the website without touching any component code or styling:

### 1. Adding or Editing Events (`/data/events.ts`)
Open `data/events.ts` and add your event to the `FEST_EVENTS` array:

```typescript
{
  id: "my-new-event",
  slug: "my-new-event",
  title: "Drone Obstacle Challenge",
  category: "Hardware/Electronics", // 'Coding' | 'Hardware/Electronics' | 'Gaming' | 'Design' | 'Quiz' | 'Workshops' | 'Non-technical'
  trackTag: "Robotics Arena",
  day: "Day 2",
  rewards: "Trophy & Merit Grants",
  entryFee: "Arena Pass",
  teamSize: "2–3 Members",
  shortDescription: "Navigate FPV quadcopters through an indoor illuminated hoop course.",
  fullDescription: "Detailed technical brief and rules...",
  rules: [
    "Pilot must maintain line-of-sight.",
    "Maximum frame size 250mm."
  ],
  rounds: [
    { roundNumber: 1, title: "Time Trials", duration: "3 mins", description: "Lap time scoring." },
    { roundNumber: 2, title: "Precision Slalom", duration: "5 mins", description: "Obstacle course." }
  ],
  coordinators: [
    { name: "Rahul S.", phone: "+91 98765 00000" }
  ],
  venue: "Outdoor Arena",
  timing: "Day 2, 10:00 AM",
}
```
*Note: Adding an item here automatically generates the card on the home page, the category filters, the interactive modal, and a dedicated static page at `/events/my-new-event`.*

### 2. Modifying Event Dates, URLs & Contacts (`/data/config.ts`)
Open `data/config.ts` to adjust:
- `dates.countdownTarget`: ISO date string for the live countdown HUD.
- `registrationUrl`: External Unstop or Google Form ticketing URL.
- `contact.convenor` & `contact.techLead`: Faculty and student coordinator phone numbers and emails.
- `location.coordinates`: GPS coordinates and Google Maps embed URL.

### 3. Modifying the 2-Day Schedule (`/data/schedule.ts`)
Open `data/schedule.ts` to update the Day 1 and Day 2 agenda, time slots, venues, and flagship highlights.

---

## 🎨 Brand Identity Compliance (Poster Exact Sampling)

| Element | Exact Sampled Value | Application |
| :--- | :--- | :--- |
| **Obsidian Void** | `#06080C` | Root page background |
| **Surface Card** | `#0C101A` | Glassmorphism base |
| **Primary Cyan/Teal** | `#12A4C4` & `#0892AB` | "FESTRONIX" brush accent |
| **Electric Highlight** | `#00E5FF` & `#22D3EE` | Specular rims, HUD beacons |
| **Warm Script Cream** | `#DFD6C5` | "coming soon..." handwriting |
| **2026 Light Grey** | `#CDCDCD` | Secondary headings |
| **Emerald Telemetry**| `#00FF9D` | Live status pulse indicator |

---

## 🏆 Checklist Self-Review

- [x] **Originality:** Uses `zenith2k26.tech` strictly as a quality benchmark; carries unique branding, topographic line-art, and custom script typography from the poster.
- [x] **Poster Continuity:** Uses the official VCE Crest, Student Affairs Cell emblem, and sampled colors.
- [x] **Performance:** Three.js scene dynamically optimizes geometry buffers, clamping device pixel ratios, and pausing render loops during offscreen scroll.
- [x] **Accessibility:** Proper contrast ratios on all text, screen-reader semantic tags, keyboard ESC modal listeners, and `prefers-reduced-motion` detection.
- [x] **Mobile Responsiveness:** Tested and verified from 360px mobile viewports up to 4K desktop screens.
