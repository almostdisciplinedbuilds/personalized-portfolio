# Lakshmi Swathi Kantheti Portfolio

A personalized cinematic portfolio with TradingView-style energy underneath. The first phase focuses on recruiter storytelling, live project holdings, AI/security work, hackathons, music identity, and a roadmap-style career journey.

## Core Idea

This portfolio has two main experience pillars:

- **Cinematic profile flow**: name-first entry, profile selection, hero view, and curated content rails.
- **TradingView energy**: dark market-terminal visual language, ticker strips, signal labels, holdings, momentum, and roadmap-style career movement.

## Current Experience

- Name-first cinematic launch screen with a user-triggered 12-second audio intro.
- Role picker with profiles for recruiters, developers, public-audit viewers, and vibe/personality viewers.
- Recruiter-focused profile hero with resume and LinkedIn actions.
- 3D market hero built with Three.js and React Three Fiber.
- Dedicated sections for Journey, Skills, AI Studio, Projects, Certifications, Awards, Hackathons, Personal Signal, and Music Lab.
- Recent-first career roadmap from current AI/security work back through Oracle, IBM, Infosys, and college.
- GitHub projects fetched live from `almostdisciplinedbuilds`, grouped by repo topics when available.
- Devpost hackathons synced from `https://devpost.com/swathikanthetiwork/challenges` with cached fallback data.
- Static fallback cards when GitHub or Devpost live data is unavailable.

## Live Data

### GitHub Projects

The app fetches public repositories from:

```txt
almostdisciplinedbuilds
```

Repo topics are normalized into portfolio categories:

- `ai-agent` -> AI Agents
- `ai-governance` -> AI Governance
- `ai-automation` -> AI Automations
- `ai-enrichment` -> AI Enrichments
- `security` -> Security Engineering
- `legal-tech` -> Lawyers / Legal Use Cases
- `trading` -> Trading / Market Tools
- `portfolio` -> Portfolio Systems

### Devpost Hackathons

Hackathons are cached in:

```txt
src/data/devpostHackathons.json
```

Refresh the cache with:

```bash
npm run sync:hackathons
```

The app also includes `/api/devpost-hackathons` for serverless-capable hosts. When the Hackathons section opens, the portfolio tries to refresh live Devpost data and falls back to the cached JSON if the live check is unavailable.

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run sync:hackathons
```

## Deployment Notes

This is a Vite React app.

- Static hosts such as GitHub Pages can serve the portfolio and cached Devpost/GitHub fallback experience.
- Serverless hosts such as Vercel can also run `api/devpost-hackathons.js` for click-time Devpost refresh.
- Resume PDF is served from `public/resume/Lakshmi_Swathi_Kantheti.pdf`.

## Phase Roadmap

- Phase 1: Personalized portfolio shell, recruiter profile, 3D trading hero, GitHub holdings, Devpost hackathons, resume/skills/journey sections.
- Phase 2: Make each role profile feel meaningfully different instead of reusing the same section order.
- Phase 3: Expand AI Studio with AI agents, governance, automations, enrichments, legal-tech flows, and music-generation apps.
- Phase 4: Add richer motion, sound design, project category metadata, and deploy polish.
