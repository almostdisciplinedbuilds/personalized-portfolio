import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Line, PerspectiveCamera, Stars } from '@react-three/drei'
import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import openingBeats from './assets/music/opening_beats.mp3'
import devpostHackathons from './data/devpostHackathons.json'
import { getHackathonSignature, mapDevpostHackathons } from './lib/devpostHackathons'

const GITHUB_USER = 'almostdisciplinedbuilds'
const RESUME_URL = '/resume/Lakshmi_Swathi_Kantheti.pdf'
const LINKEDIN_URL = 'https://www.linkedin.com/in/lakshmi-swathi-03/'
const INTRO_SECONDS = 12

const roles = {
  bigGuy: {
    label: 'The Big Guy',
    code: 'REC',
    subtitle: 'Recruiter mode: fit, proof, impact, and trust signals first.',
    sortBy: 'stars',
    accent: '#22c55e',
  },
  codeBlooded: {
    label: 'Code Blooded',
    code: 'DEV',
    subtitle: 'Architecture, commits, experiments, and clean chaos control.',
    sortBy: 'updated',
    accent: '#38bdf8',
  },
  stalkerPro: {
    label: 'Professional Stalker',
    code: 'AUD',
    subtitle: 'Everything public, organized like evidence on a terminal.',
    sortBy: 'name',
    accent: '#f59e0b',
  },
  vibeCommittee: {
    label: 'Vibe Check Committee',
    code: 'VIBE',
    subtitle: 'Taste, tempo, collaboration energy, and the human signal.',
    sortBy: 'mix',
    accent: '#ef4444',
  },
}

const taxonomy = [
  { key: 'ai-agent', label: 'AI Agents', match: ['ai-agent', 'agent', 'agents'] },
  { key: 'ai-governance', label: 'AI Governance', match: ['ai-governance', 'governance'] },
  { key: 'ai-automation', label: 'AI Automations', match: ['ai-automation', 'automation', 'automations'] },
  { key: 'ai-enrichment', label: 'AI Enrichments', match: ['ai-enrichment', 'enrichment', 'enrichments'] },
  { key: 'security', label: 'Security Engineering', match: ['security', 'sast', 'waf'] },
  { key: 'legal-tech', label: 'Lawyers / Legal Use Cases', match: ['legal-tech', 'legal', 'lawyers'] },
  { key: 'trading', label: 'Trading / Market Tools', match: ['trading', 'tradingview', 'market'] },
  { key: 'portfolio', label: 'Portfolio Systems', match: ['portfolio'] },
]

const fallbackProjects = [
  {
    id: 'fallback-vantage',
    name: 'vantage-ai-security-validation',
    html_url: 'https://github.com/almostdisciplinedbuilds',
    stargazers_count: 18,
    language: 'Python',
    description: 'Agentic security validation, reachability analysis, synthesis, and remediation workflow.',
    updated_at: '2026-04-12T09:30:00Z',
    forks_count: 3,
    topics: ['ai-agent', 'security', 'ai-automation'],
  },
  {
    id: 'fallback-governance',
    name: 'ai-governance-ledger',
    html_url: 'https://github.com/almostdisciplinedbuilds',
    stargazers_count: 12,
    language: 'JavaScript',
    description: 'Governance-style controls for tracking AI usage, risk, prompts, and approvals.',
    updated_at: '2026-03-18T14:10:00Z',
    forks_count: 2,
    topics: ['ai-governance', 'ai-enrichment'],
  },
  {
    id: 'fallback-legal',
    name: 'legal-ai-enrichment-lab',
    html_url: 'https://github.com/almostdisciplinedbuilds',
    stargazers_count: 9,
    language: 'React',
    description: 'A concept lab for legal research enrichment, document triage, and AI-assisted workflows.',
    updated_at: '2026-02-27T18:45:00Z',
    forks_count: 1,
    topics: ['legal-tech', 'ai-enrichment'],
  },
  {
    id: 'fallback-portfolio',
    name: 'trading-terminal-portfolio',
    html_url: 'https://github.com/almostdisciplinedbuilds',
    stargazers_count: 15,
    language: 'React',
    description: 'Personalized recruiter profile with TradingView-style project holdings.',
    updated_at: '2026-04-28T10:45:00Z',
    forks_count: 2,
    topics: ['portfolio', 'trading'],
  },
]

const marketTape = [
  'NAME PREVIEW LIVE',
  'THE BIG GUY VIEW READY',
  'AI STUDIO BUILDING',
  'GITHUB HOLDINGS SYNCED',
  'PORTFOLIO SENTIMENT: BULLISH',
]

const journeyItems = [
  {
    phase: 'Foundation Candle',
    period: '2015 - 2019',
    title: 'B.Tech in Electronics and Communication Engineering',
    place: 'K L University',
    skills: ['Electronics', 'Problem solving', 'Engineering fundamentals'],
    summary: 'Graduated with 8.8 CGPA and built the base discipline for systems thinking.',
    signal: 'Base capital formed',
  },
  {
    phase: 'First Market Entry',
    period: '2019 - 2021',
    title: 'Systems Engineer',
    place: 'Infosys',
    skills: ['Java SE8', 'Spring Boot', 'Microservices', 'MongoDB', 'Kafka', 'RabbitMQ'],
    summary: 'Built ecommerce features, support flows, and client-facing delivery muscles.',
    signal: 'Execution under pressure',
  },
  {
    phase: 'Scale Position',
    period: '2021 - Present',
    title: 'Full Stack Application Developer',
    place: 'IBM',
    skills: ['Angular 17', 'Spring Boot', 'DB2', 'IBM Cloud', 'BIRT'],
    summary: 'Modernized legacy systems into web platforms and reduced processing from hours to minutes.',
    signal: 'Legacy to modern migration',
  },
  {
    phase: 'Security Breakout',
    period: '2024 - Present',
    title: 'Senior Software Engineer',
    place: 'Oracle',
    skills: ['WAF4SaaS', 'Oracle Cloud', 'Pegasys', 'Oracle DB', 'Policy workflows'],
    summary: 'Built cloud security controller workflows, product demos, and SRE-facing operational improvements.',
    signal: 'Security platform ownership',
  },
  {
    phase: 'AI Momentum',
    period: '2026 - Present',
    title: 'AI Security Validation and Orchestration',
    place: 'Vantage-AI / Tines / OpenSearch',
    skills: ['Agentic AI', 'Tines', 'OpenSearch', 'BugDB/Jira', 'AI governance'],
    summary: 'Designing agentic security validation, finding synthesis, automated triage, and AI remediation flows.',
    signal: 'Future-facing edge',
  },
]

const skillsByCategory = [
  {
    category: 'Application Engineering',
    skills: ['Core Java', 'Spring Boot', 'Microservices', 'Apache Camel', 'Maven', 'JUnit'],
  },
  {
    category: 'AI + Automation',
    skills: ['Generative AI', 'Tines automation', 'Python', 'OpenSearch', 'BugDB/Jira', 'AI agents'],
  },
  {
    category: 'Frontend + Experience',
    skills: ['Angular 17', 'React', 'HTML5', 'CSS', 'Three.js', 'Trading terminal UI'],
  },
  {
    category: 'Data + Cloud',
    skills: ['Oracle DB', 'DB2', 'MongoDB', 'SQL', 'Oracle Cloud', 'IBM Cloud Object Storage'],
  },
  {
    category: 'Delivery Signals',
    skills: ['Agile', 'Git', 'Jenkins', 'Mentoring', 'Client interaction', 'Fast learning'],
  },
]

const certifications = [
  {
    title: 'IBM Certified Technical Advocate - Cloud V4',
    issuer: 'IBM',
    period: 'Issued 11/2023',
    summary: 'Cloud certification validating platform fluency and technical advocacy.',
  },
]

const awards = [
  {
    title: 'Rockstar Gold Award - Team 2025',
    issuer: 'Oracle',
    period: '2025',
    summary: 'Recognized for technical innovation and team leadership in SaaS Security Engineering.',
  },
  {
    title: 'INSTA Award - Top Performer H1 FY21',
    issuer: 'Infosys',
    period: '03/2021',
    summary: 'Awarded for hard work, commitment, ownership, and quality delivery.',
  },
  {
    title: 'RISE Award - Rookie of the Quarter H2 FY21',
    issuer: 'Infosys',
    period: '06/2021',
    summary: 'Recognized in the Rookie of the Quarter category.',
  },
  {
    title: 'INSTA Award - Top Performer H2 FY21',
    issuer: 'Infosys',
    period: '07/2021',
    summary: 'Recognized for contributions, taking up challenges, and fast learning.',
  },
]

const hackathonFallbacks = [
  {
    title: 'IBM Knowledge Management and Hackathons',
    period: 'IBM',
    summary: 'Participated in knowledge-management activities and internal hackathon culture.',
    tags: ['IBM', 'knowledge sharing', 'innovation'],
  },
  {
    title: 'YL Knockathons and Launches',
    period: 'Infosys / Young Living',
    summary: 'Participated in launch-driven engineering cycles and high-pressure delivery events.',
    tags: ['launches', 'delivery', 'ecommerce'],
  },
  {
    title: 'Next Hackathon Slot',
    period: 'Upcoming',
    summary: 'Reserved for future hackathons and build challenges as they are added.',
    tags: ['placeholder', 'future builds'],
  },
]

const cachedDevpostHackathons = mapDevpostHackathons(devpostHackathons.hackathons)
const cachedHackathons = cachedDevpostHackathons.length ? cachedDevpostHackathons : hackathonFallbacks

const aiStudioCards = [
  {
    title: 'AI Agents',
    subtitle: 'Reasoning to action',
    summary: 'Autonomous agents for security report reading, code tracing, validation, and fix preparation.',
    tags: ['ai-agent', 'codex', 'validation'],
  },
  {
    title: 'AI Governance',
    subtitle: 'Control plane',
    summary: 'A growing lane for audit trails, prompt governance, risk checks, approvals, and accountability.',
    tags: ['ai-governance', 'risk', 'audit'],
  },
  {
    title: 'AI Automations',
    subtitle: 'SOAR workflows',
    summary: 'Automated triage and ticket creation enriched with severity, metadata, and remediation guidance.',
    tags: ['ai-automation', 'tines', 'jira'],
  },
  {
    title: 'AI Enrichments',
    subtitle: 'Domain expansion',
    summary: 'Future enrichment lanes for lawyers, security teams, operations, and knowledge-heavy workflows.',
    tags: ['ai-enrichment', 'legal-tech', 'ops'],
  },
]

const personalSignals = [
  {
    title: 'Basketball',
    subtitle: 'Court discipline',
    summary: 'Fast decisions, spacing, stamina, and team rhythm. The same instincts show up in engineering delivery.',
    tags: ['sport', 'teamwork', 'pace'],
  },
  {
    title: 'Gym',
    subtitle: 'Consistency system',
    summary: 'Training as a repeatable operating system: steady reps, measurable progress, and mental reset.',
    tags: ['fitness', 'discipline', 'routine'],
  },
  {
    title: 'Music',
    subtitle: 'Creative engine',
    summary: 'Sound is part of the portfolio identity, and future builds will include music apps and generated music tools.',
    tags: ['music', 'creative tech', 'sound-led UX'],
  },
]

const musicLab = [
  {
    title: 'Generated Music Apps',
    subtitle: 'Future builds',
    summary: 'A lane for tools that generate, remix, classify, or visualize music with AI.',
    tags: ['music-ai', 'generation', 'apps'],
  },
  {
    title: 'Sound-Led UX',
    subtitle: 'Portfolio identity',
    summary: 'Audio stays intentional and user-triggered, giving the site a cinematic feel without becoming noise.',
    tags: ['ux', 'audio', 'interaction'],
  },
  {
    title: 'Music Taste Archive',
    subtitle: 'Personal signal',
    summary: 'A future section for favorite tracks, playlists, experiments, and the music behind the work.',
    tags: ['playlists', 'taste', 'archive'],
  },
]

const sectionCards = [
  { id: 'journey', title: 'Journey', subtitle: 'Recent-first career roadmap with trading-style milestones', category: 'Career Signal' },
  { id: 'skills', title: 'Skills', subtitle: 'Categorized tech stack and delivery signals', category: 'Tech Signal' },
  { id: 'ai', title: 'AI Studio', subtitle: 'Agents, governance, automations, enrichments', category: 'AI Signal' },
  { id: 'projects', title: 'Projects', subtitle: 'GitHub holdings grouped by topic', category: 'Build Signal' },
  { id: 'certifications', title: 'Certifications', subtitle: 'Credential cards and learning signals', category: 'Trust Signal' },
  { id: 'awards', title: 'Awards', subtitle: 'Recognition from Oracle and Infosys', category: 'Impact Signal' },
  { id: 'hackathons', title: 'Hackathons', subtitle: 'Innovation events and launch pressure', category: 'Challenge Signal' },
  { id: 'personal', title: 'Personal Signal', subtitle: 'Basketball, gym, and off-screen discipline', category: 'Human Signal' },
  { id: 'music', title: 'Music Lab', subtitle: 'Music apps, generated music, and sound-led UX', category: 'Creative Signal' },
]

const topPickIds = ['journey', 'skills', 'ai', 'projects']
const continueIds = ['certifications', 'awards', 'hackathons', 'personal', 'music']

const roleSectionVisibility = {
  bigGuy: [...topPickIds, ...continueIds],
  codeBlooded: ['projects', 'skills', 'ai', 'journey', 'certifications', 'hackathons'],
  stalkerPro: ['journey', 'projects', 'certifications', 'awards', 'hackathons'],
  vibeCommittee: ['personal', 'music', 'journey', 'hackathons', 'projects'],
}

function playAudio(src, muted) {
  if (muted) return
  const audio = new Audio(src)
  audio.currentTime = 0
  audio.volume = 0.72
  audio.play().catch(() => {
    // User gesture policies can still block audio in some browser states.
  })
  window.setTimeout(() => {
    audio.pause()
    audio.currentTime = 0
  }, INTRO_SECONDS * 1000)
}

function normalizeTopic(topic) {
  return topic.toLowerCase().trim()
}

function formatRepoName(name) {
  return name.replaceAll('-', ' ').replaceAll('_', ' ')
}

function normalizeRepo(repo) {
  return {
    id: repo.id,
    title: formatRepoName(repo.name),
    name: repo.name,
    html_url: repo.html_url,
    stargazers_count: repo.stargazers_count || 0,
    language: repo.language || 'Code',
    description: repo.description || 'No description yet. Topic pending, signal forming.',
    updated_at: repo.updated_at || new Date().toISOString(),
    forks_count: repo.forks_count || 0,
    topics: (repo.topics || []).map(normalizeTopic),
  }
}

function findCategory(repo) {
  const topics = repo.topics || []
  return taxonomy.find((category) => category.match.some((topic) => topics.includes(topic)))
}

function candleHeight(index) {
  const wave = Math.sin(index * 1.4) * 0.8 + Math.cos(index * 0.55) * 0.55
  return Math.max(0.55, 1.4 + wave)
}

function CandleField() {
  const groupRef = useRef()
  const linePoints = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => [
        index * 0.54 - 4.6,
        Math.sin(index * 0.65) * 0.45 + Math.cos(index * 0.28) * 0.28 + 0.65,
        -1.4,
      ]),
    []
  )

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.22) * 0.12
    groupRef.current.position.y = Math.sin(clock.elapsedTime * 0.5) * 0.08
  })

  return (
    <group ref={groupRef} position={[0, -0.25, 0]} rotation={[-0.2, 0.35, 0]}>
      <gridHelper args={[12, 24, '#1f2937', '#111827']} position={[0, -1.35, 0]} />
      <Line points={linePoints} color="#22c55e" lineWidth={2.4} />
      {Array.from({ length: 18 }, (_, index) => {
        const height = candleHeight(index)
        const isGreen = index % 4 !== 1
        const x = index * 0.54 - 4.6
        const y = height / 2 - 1.2
        const color = isGreen ? '#22c55e' : '#ef4444'

        return (
          <group key={x} position={[x, 0, Math.sin(index) * 0.45]}>
            <mesh position={[0, y, 0]}>
              <boxGeometry args={[0.18, height, 0.18]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.28}
                roughness={0.42}
                metalness={0.15}
              />
            </mesh>
            <mesh position={[0, y, 0]}>
              <boxGeometry args={[0.035, height + 0.75, 0.035]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.18} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

function MarketScene() {
  return (
    <Canvas className="market-canvas" dpr={[1, 1.7]}>
      <PerspectiveCamera makeDefault position={[0, 1.3, 7]} fov={48} />
      <ambientLight intensity={0.75} />
      <pointLight position={[4, 4, 4]} intensity={2.2} color="#86efac" />
      <pointLight position={[-3, 2, 3]} intensity={1.1} color="#fbbf24" />
      <Stars radius={28} depth={18} count={900} factor={2.2} saturation={0} fade speed={0.7} />
      <Float speed={1.45} rotationIntensity={0.16} floatIntensity={0.4}>
        <CandleField />
      </Float>
    </Canvas>
  )
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 4.8v14.4L19 12 7 4.8Z" />
    </svg>
  )
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 10h2v8h-2v-8Zm1-4.2a1.35 1.35 0 1 0 0 2.7 1.35 1.35 0 0 0 0-2.7Z" />
      <path
        fillRule="evenodd"
        d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function NamePreview({ expanded, muted, onToggleSound, onEnter }) {
  return (
    <section className={expanded ? 'name-preview expanding' : 'name-preview'}>
      <button className="sound-toggle" onClick={onToggleSound}>
        {muted ? 'Sound Off' : 'Sound On'}
      </button>
      <div className="ticker-strip">
        {[...marketTape, ...marketTape].map((item, index) => (
          <span key={`${item}-${index}`}>{item}</span>
        ))}
      </div>
      <button className="name-button" onClick={onEnter}>
        <span>Portfolio opens on click</span>
        <strong>Lakshmi Swathi Kantheti</strong>
      </button>
    </section>
  )
}

function RolePicker({ onSelect }) {
  return (
    <section className="role-screen">
      <div className="screen-heading">
        <p className="eyebrow">Who is reviewing?</p>
        <h1>Choose Profile</h1>
      </div>
      <div className="profiles-grid">
        {Object.entries(roles).map(([key, mode]) => (
          <button
            key={key}
            className="profile-tile"
            style={{ '--tile-accent': mode.accent }}
            onClick={() => onSelect(key)}
          >
            <span>{mode.code}</span>
            <strong>{mode.label}</strong>
            <small>{mode.subtitle}</small>
          </button>
        ))}
      </div>
    </section>
  )
}

function RecruiterHero({ role, muted, onToggleSound, onSwitchRole }) {
  return (
    <header className="profile-hero">
      <MarketScene />
      <nav className="top-nav">
        <button className="brand-button" onClick={onSwitchRole}>
          LAKSHMI SWATHI
        </button>
        <div className="nav-right">
          <a href={RESUME_URL} target="_blank" rel="noreferrer">Resume</a>
          <a href={LINKEDIN_URL} target="_blank" rel="noreferrer">LinkedIn</a>
          <button className="switch-profile" onClick={onSwitchRole}>Switch Profile</button>
          <button className="switch-profile" onClick={onToggleSound}>{muted ? 'Sound Off' : 'Sound On'}</button>
        </div>
      </nav>
      <div className="hero-copy-block">
        <p className="eyebrow">{role.label} / recruiter profile</p>
        <h2>Lakshmi Swathi Kantheti</h2>
        <p>
          Full Stack Application Developer and Senior Software Engineer building cloud security,
          AI automation, and product-grade systems with a trading-roadmap mindset.
        </p>
        <div className="hero-buttons">
          <a className="play-button" href={RESUME_URL} target="_blank" rel="noreferrer">
            <PlayIcon />
            <span>Resume</span>
          </a>
          <a className="info-button" href={LINKEDIN_URL} target="_blank" rel="noreferrer">
            <InfoIcon />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </header>
  )
}

function SectionCard({ card, onOpen }) {
  return (
    <button className="section-card" onClick={() => onOpen(card.id)}>
      <span>{card.category}</span>
      <strong>{card.title}</strong>
      <small>{card.subtitle}</small>
    </button>
  )
}

function SectionRow({ title, subtitle, cards, onOpen }) {
  return (
    <section className="content-row">
      <div className="row-heading">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
        <span>{cards.length} sections</span>
      </div>
      <div className="row-scroll">
        {cards.map((card) => (
          <SectionCard key={card.id} card={card} onOpen={onOpen} />
        ))}
      </div>
    </section>
  )
}

function ProfileHome({ roleKey, onOpenSection }) {
  const visibleSections = roleSectionVisibility[roleKey] || roleSectionVisibility.bigGuy
  const getVisibleCards = (ids) =>
    ids
      .filter((id) => visibleSections.includes(id))
      .map((id) => sectionCards.find((card) => card.id === id))
      .filter(Boolean)

  const topCards = getVisibleCards(topPickIds)
  const continueCards = getVisibleCards(continueIds)

  return (
    <main className="profile-content">
      {topCards.length > 0 && (
        <SectionRow
          title="Recruiter Signal Desk"
          subtitle="The fastest path to fit, proof, and current momentum."
          cards={topCards}
          onOpen={onOpenSection}
        />
      )}
      {continueCards.length > 0 && (
        <SectionRow
          title="Proof Library"
          subtitle="Credentials, recognition, challenge work, and the personal signals behind the work."
          cards={continueCards}
          onOpen={onOpenSection}
        />
      )}
    </main>
  )
}

function DetailCard({ item }) {
  return (
    <article className="detail-card">
      {item.image && <img src={item.image} alt="" />}
      <p>{item.phase || item.subtitle || item.period || item.issuer || item.category}</p>
      <h3>{item.title}</h3>
      {item.place && <strong>{item.place}</strong>}
      {item.issuer && <strong>{item.issuer}</strong>}
      {item.source && <strong>{item.source}</strong>}
      {item.signal && <strong>{item.signal}</strong>}
      <span>{item.summary}</span>
      {item.skills && (
        <div className="tag-cloud">
          {item.skills.map((skill) => <em key={skill}>{skill}</em>)}
        </div>
      )}
      {item.tags && (
        <div className="tag-cloud">
          {item.tags.map((tag) => <em key={tag}>{tag}</em>)}
        </div>
      )}
      {item.href && <a href={item.href} target="_blank" rel="noreferrer">Open Hackathon</a>}
    </article>
  )
}

function JourneyView() {
  const recentFirstJourney = [...journeyItems].reverse()

  return (
    <div className="journey-roadmap" aria-label="Recent first career roadmap">
      {recentFirstJourney.map((item, index) => (
        <article
          key={`${item.phase}-${item.period}`}
          className={`roadmap-stop ${index % 2 === 0 ? 'left' : 'right'}`}
          style={{ '--step-index': index }}
        >
          <div className="road-marker">
            <span>{String(journeyItems.length - index).padStart(2, '0')}</span>
          </div>
          <div className="roadmap-card">
            <span>{item.period}</span>
            <h3>{item.phase}</h3>
            <p className="card-eyebrow">{item.title}</p>
            <h4>{item.place}</h4>
            <p>{item.summary}</p>
            <strong>{item.signal}</strong>
            <div className="tag-cloud">
              {item.skills.map((skill) => <em key={skill}>{skill}</em>)}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}

function SkillsView() {
  return (
    <div className="skills-board">
      {skillsByCategory.map((group) => (
        <article key={group.category} className="detail-card">
          <p>Capability cluster</p>
          <h3>{group.category}</h3>
          <div className="tag-cloud">
            {group.skills.map((skill) => <em key={skill}>{skill}</em>)}
          </div>
        </article>
      ))}
    </div>
  )
}

function ProjectView({ repos, loading, error }) {
  const grouped = useMemo(() => {
    const groups = taxonomy.map((category) => ({
      ...category,
      repos: repos.filter((repo) => findCategory(repo)?.key === category.key),
    }))
    const categorized = new Set(groups.flatMap((group) => group.repos.map((repo) => repo.id)))
    return [
      ...groups.filter((group) => group.repos.length),
      { key: 'general', label: 'General Builds', repos: repos.filter((repo) => !categorized.has(repo.id)) },
    ].filter((group) => group.repos.length)
  }, [repos])

  return (
    <>
      {error && <p className="error">{error}</p>}
      {loading && <p className="error">Syncing GitHub holdings...</p>}
      <div className="project-groups">
        {grouped.map((group) => (
          <section key={group.key}>
            <h3>{group.label}</h3>
            <div className="detail-grid">
              {group.repos.map((repo) => (
                <article key={repo.id} className="detail-card">
                  <p>{repo.language} / Stars {repo.stargazers_count}</p>
                  <h3>{repo.title}</h3>
                  <span>{repo.description}</span>
                  <div className="tag-cloud">
                    {(repo.topics.length ? repo.topics : ['topic pending']).slice(0, 4).map((topic) => (
                      <em key={topic}>{topic}</em>
                    ))}
                  </div>
                  <a href={repo.html_url} target="_blank" rel="noreferrer">Open Repo</a>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  )
}

function SectionView({ sectionId, repos, loading, error, hackathonState, onBack }) {
  const section = sectionCards.find((card) => card.id === sectionId)
  const title = section?.title || 'Section'
  const subtitle = section?.subtitle || 'Focused view'

  const renderBody = () => {
    if (sectionId === 'journey') return <JourneyView />
    if (sectionId === 'skills') return <SkillsView />
    if (sectionId === 'projects') return <ProjectView repos={repos} loading={loading} error={error} />
    if (sectionId === 'ai') return <div className="detail-grid">{aiStudioCards.map((item) => <DetailCard key={item.title} item={item} />)}</div>
    if (sectionId === 'certifications') return <div className="detail-grid">{certifications.map((item) => <DetailCard key={item.title} item={item} />)}</div>
    if (sectionId === 'awards') return <div className="detail-grid">{awards.map((item) => <DetailCard key={item.title} item={item} />)}</div>
    if (sectionId === 'hackathons') {
      return (
        <>
          <p className="sync-note">
            {hackathonState.status}
            {hackathonState.syncedAt ? ` Last checked ${new Date(hackathonState.syncedAt).toLocaleString('en-IN')}.` : ''}
          </p>
          <div className="detail-grid">{hackathonState.items.map((item) => <DetailCard key={item.title} item={item} />)}</div>
        </>
      )
    }
    if (sectionId === 'personal') return <div className="detail-grid">{personalSignals.map((item) => <DetailCard key={item.title} item={item} />)}</div>
    if (sectionId === 'music') return <div className="detail-grid music-grid">{musicLab.map((item) => <DetailCard key={item.title} item={item} />)}</div>
    return null
  }

  return (
    <main className="section-view">
      <button className="back-button" onClick={onBack}>Back to profile</button>
      <div className="section-title">
        <p className="eyebrow">Dedicated view</p>
        <h2>{title}</h2>
        <span>{subtitle}</span>
      </div>
      {renderBody()}
    </main>
  )
}

function sortRepos(repos, role) {
  const list = [...repos]
  if (role.sortBy === 'stars') return list.sort((a, b) => b.stargazers_count - a.stargazers_count)
  if (role.sortBy === 'updated') return list.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  if (role.sortBy === 'name') return list.sort((a, b) => a.name.localeCompare(b.name))
  return list.sort((a, b) => b.forks_count + b.stargazers_count - (a.forks_count + a.stargazers_count))
}

function App() {
  const [stage, setStage] = useState('name')
  const [nameExpanded, setNameExpanded] = useState(false)
  const [role, setRole] = useState('bigGuy')
  const [activeSection, setActiveSection] = useState('')
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [muted, setMuted] = useState(false)
  const [hackathonState, setHackathonState] = useState({
    items: cachedHackathons,
    syncedAt: devpostHackathons.syncedAt,
    status: cachedDevpostHackathons.length
      ? 'Showing cached Devpost entries while checking for live updates.'
      : 'Showing fallback hackathon cards while checking for live updates.',
  })

  useEffect(() => {
    const loadRepos = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`)
        if (!res.ok) throw new Error('GitHub sync failed')
        const data = await res.json()
        const filtered = data.filter((repo) => !repo.fork && !repo.archived).map(normalizeRepo)

        if (!filtered.length) {
          setError('GitHub returned an empty tape, so fallback holdings are live.')
          setRepos(fallbackProjects.map(normalizeRepo))
          return
        }

        setRepos(filtered)
      } catch {
        setError('Live GitHub sync is unavailable, so fallback holdings are live.')
        setRepos(fallbackProjects.map(normalizeRepo))
      } finally {
        setLoading(false)
      }
    }

    loadRepos()
  }, [])

  useEffect(() => {
    if (activeSection !== 'hackathons') return undefined

    let cancelled = false

    const refreshHackathons = async () => {
      setHackathonState((current) => ({
        ...current,
        status: 'Checking Devpost live against the cached challenge tape.',
      }))

      try {
        const res = await fetch('/api/devpost-hackathons')
        if (!res.ok) throw new Error('Devpost live refresh unavailable')

        const payload = await res.json()
        const liveHackathons = mapDevpostHackathons(payload.hackathons)
        if (!liveHackathons.length) throw new Error('Devpost live refresh returned no entries')

        const cachedSignature = getHackathonSignature(cachedHackathons)
        const liveSignature = getHackathonSignature(liveHackathons)

        if (cancelled) return

        setHackathonState({
          items: liveHackathons,
          syncedAt: payload.syncedAt || new Date().toISOString(),
          status:
            liveSignature === cachedSignature
              ? 'Live Devpost check matches the cached entries.'
              : 'New Devpost challenge entries loaded from the live check.',
        })
      } catch {
        if (cancelled) return

        setHackathonState({
          items: cachedHackathons,
          syncedAt: devpostHackathons.syncedAt,
          status: cachedDevpostHackathons.length
            ? 'Live Devpost check is unavailable, so cached entries are active.'
            : 'Live Devpost check is unavailable, so fallback entries are active.',
        })
      }
    }

    refreshHackathons()

    return () => {
      cancelled = true
    }
  }, [activeSection])

  const activeRole = roles[role]
  const sortedRepos = useMemo(() => sortRepos(repos, activeRole), [activeRole, repos])

  const openRoles = () => {
    playAudio(openingBeats, muted)
    setNameExpanded(true)
    window.setTimeout(() => setStage('profiles'), 850)
  }

  const selectRole = (nextRole) => {
    setRole(nextRole)
    setActiveSection('')
    setStage('profile')
  }

  return (
    <div className="app-shell" style={{ '--role-accent': activeRole.accent }}>
      {stage === 'name' && (
        <NamePreview
          expanded={nameExpanded}
          muted={muted}
          onToggleSound={() => setMuted((value) => !value)}
          onEnter={openRoles}
        />
      )}
      {stage === 'profiles' && <RolePicker onSelect={selectRole} />}
      {stage === 'profile' && (
        <>
          <RecruiterHero
            role={activeRole}
            muted={muted}
            onToggleSound={() => setMuted((value) => !value)}
            onSwitchRole={() => setStage('profiles')}
          />
          {activeSection ? (
            <SectionView
              sectionId={activeSection}
              repos={sortedRepos}
              loading={loading}
              error={error}
              hackathonState={hackathonState}
              onBack={() => setActiveSection('')}
            />
          ) : (
            <ProfileHome roleKey={role} onOpenSection={setActiveSection} />
          )}
        </>
      )}
    </div>
  )
}

export default App
