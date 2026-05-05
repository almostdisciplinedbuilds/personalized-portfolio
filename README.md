# Lakshmi Swathi Kantheti Portfolio

A cinematic React portfolio for Lakshmi Swathi Kantheti, built with Vite, React, Three.js, and a dark market-terminal visual style. The site presents career experience, technical skills, AI/security work, projects, awards, certifications, hackathons, and personal creative signals in an interactive profile-based experience.

## Overview

The portfolio opens with a name-first entry screen, then lets visitors choose a viewing profile. Each profile keeps the same visual identity while showing a curated set of modules for that audience.

- **The Big Guy**: full portfolio view.
- **Code Blooded**: projects, skills, AI work, journey, certifications, and hackathons.
- **Professional Stalker**: journey, projects, certifications, awards, and hackathons.
- **Vibe Check Committee**: personal signal, music, journey, hackathons, and projects.

## Features

- Cinematic launch screen with optional audio.
- Profile picker with role-based module visibility.
- Three.js hero scene using React Three Fiber.
- Career journey roadmap covering education, Infosys, IBM, Oracle, and current AI/security work.
- Skills grouped by engineering, AI/automation, frontend, data/cloud, and delivery signals.
- GitHub project feed grouped by normalized repository topics.
- Devpost hackathon data with cached fallback support.
- Certifications, awards, personal signal, and music lab sections.
- Responsive layout with mobile-specific roadmap adjustments.

## Tech Stack

- React 18
- Vite
- Three.js
- React Three Fiber
- React Three Drei
- ESLint
- Vercel-compatible serverless API route

## Project Structure

```txt
api/
  devpost-hackathons.js
public/
  resume/
src/
  assets/
  data/
  lib/
  App.jsx
  App.css
  main.jsx
scripts/
  sync-devpost-hackathons.mjs
```

## Live Data

### GitHub Projects

The app fetches public repositories from the GitHub user:

```txt
almostdisciplinedbuilds
```

Repository topics are normalized into portfolio categories such as AI agents, AI governance, automation, security engineering, legal-tech, trading tools, and portfolio systems.

### Devpost Hackathons

Hackathon data is cached in:

```txt
src/data/devpostHackathons.json
```

Refresh the local cache with:

```bash
npm run sync:hackathons
```

The `api/devpost-hackathons.js` route supports live refreshes on serverless hosts such as Vercel. If live refresh is unavailable, the app uses the cached JSON data.

## Getting Started

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev
```

Lint:

```bash
npm run lint
```

Build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment

This is a Vite React app and can be deployed to Vercel or any static hosting provider. Vercel is recommended if the Devpost serverless refresh route should be available.

The resume PDF is served from:

```txt
public/resume/Lakshmi_Swathi_Kantheti.pdf
```
