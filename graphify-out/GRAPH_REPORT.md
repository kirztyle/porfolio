# Graph Report - portfolio  (2026-10-17)

## Corpus Check
- Corpus is ~14,640 words - fits in a single context window. You may not need a graph.

## Summary
- 310 nodes · 614 edges · 16 communities (14 shown, 2 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 10 edges (avg confidence: 0.83)
- Token cost: 92,928 input · 0 output

## Community Hubs (Navigation)
- Admin CRUD API Routes
- CV PDF and Carousel
- Admin Dashboard UI
- Runtime Dependencies
- Public Portfolio View
- Public Data API
- Agent Workflow Rules
- TypeScript Config
- Dev Toolchain
- Root Layout and Theme
- Status Meter Widget
- Next.js Starter Icons
- Logout Session Flow
- README Getting Started
- PostCSS Config

## God Nodes (most connected - your core abstractions)
1. `isAuthenticated()` - 36 edges
2. `createAdminClient()` - 35 edges
3. `next` - 31 edges
4. `compilerOptions` - 16 edges
5. `ResourceEditor()` - 15 edges
6. `react` - 15 edges
7. `PortfolioView()` - 13 edges
8. `getPortfolioData()` - 13 edges
9. `pick()` - 10 edges
10. `t()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `getPortfolioData()`  [EXTRACTED]
  app/admin/page.tsx → lib/data.ts
- `GET()` --calls--> `getCertificates()`  [EXTRACTED]
  app/api/certificates/route.ts → lib/data.ts
- `GET()` --calls--> `getPortfolioData()`  [EXTRACTED]
  app/api/cv/pdf/route.tsx → lib/data.ts
- `GET()` --calls--> `getEducation()`  [EXTRACTED]
  app/api/education/route.ts → lib/data.ts
- `GET()` --calls--> `getExperiences()`  [EXTRACTED]
  app/api/experiences/route.ts → lib/data.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Portfolio Claude subagent workflow (build, review, verify)** — _claude_agents_nextjs_builder_nextjs_builder, _claude_agents_ui_reviewer_ui_reviewer, _claude_agents_build_checker_build_checker [INFERRED 0.85]
- **Next.js starter footer link icons (Learn / Examples / nextjs.org)** — public_file_icon, public_window_icon, public_globe_icon [INFERRED 0.75]

## Communities (16 total, 2 thin omitted)

### Community 0 - "Admin CRUD API Routes"
Cohesion: 0.09
Nodes (44): dynamic, POST(), DELETE(), dynamic, PUT(), dynamic, POST(), DELETE() (+36 more)

### Community 1 - "CV PDF and Carousel"
Cohesion: 0.10
Nodes (30): dynamic, GET(), CVDocument(), L(), LABELS, styles, Chevron(), ImageCarousel() (+22 more)

### Community 2 - "Admin Dashboard UI"
Cohesion: 0.08
Nodes (19): LoginPage(), AdminPage(), dynamic, AdminDashboard(), TabKey, TABS, ImageGalleryField(), Field() (+11 more)

### Community 3 - "Runtime Dependencies"
Cohesion: 0.05
Nodes (36): eslintConfig, dependencies, jose, lucide-react, next, next-themes, react, react-dom (+28 more)

### Community 4 - "Public Portfolio View"
Cohesion: 0.12
Nodes (21): dynamic, Home(), ContactLink(), EmptyState(), LanguageToggle(), PortfolioView(), ThemeToggle(), Choice() (+13 more)

### Community 5 - "Public Data API"
Cohesion: 0.16
Nodes (20): GET(), GET(), GET(), dynamic, GET(), PUT(), GET(), GET() (+12 more)

### Community 6 - "Agent Workflow Rules"
Cohesion: 0.12
Nodes (10): build-checker agent, npm run build, npm run lint, nextjs-builder agent, Next.js 16 App Router + React 19 + Tailwind 4 + TypeScript stack, ui-reviewer agent, generate-agent-files.js (next dev), node_modules/next/dist/docs/ (+2 more)

### Community 7 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 8 - "Dev Toolchain"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 9 - "Root Layout and Theme"
Cohesion: 0.32
Nodes (5): inter, metadata, RootLayout(), ThemeProvider(), next-themes

### Community 10 - "Status Meter Widget"
Cohesion: 0.33
Nodes (4): CONFIG, Status, TIER_COLORS, TIERS

### Community 11 - "Next.js Starter Icons"
Cohesion: 0.33
Nodes (6): create-next-app Default Scaffold Assets, File Icon (document with lines, gray 16x16), Globe Icon (world/web, gray 16x16), Next.js Wordmark Logo, Vercel Triangle Logo (white), Browser Window Icon (gray 16x16)

### Community 12 - "Logout Session Flow"
Cohesion: 0.67
Nodes (3): dynamic, POST(), destroySession()

### Community 13 - "README Getting Started"
Cohesion: 0.67
Nodes (3): create-next-app bootstrap, Getting Started (npm run dev, localhost:3000), next/font with Geist font

## Knowledge Gaps
- **20 isolated node(s):** `@supabase/ssr`, `react-dom`, `@tailwindcss/postcss`, `@types/node`, `@types/react` (+15 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 137 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `Admin CRUD API Routes` to `CV PDF and Carousel`, `Admin Dashboard UI`, `Runtime Dependencies`, `Public Portfolio View`, `Public Data API`, `Root Layout and Theme`, `Logout Session Flow`?**
  _High betweenness centrality (0.301) - this node is a cross-community bridge._
- **What connects `@supabase/ssr`, `react-dom`, `@tailwindcss/postcss` to the rest of the system?**
  _20 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Admin CRUD API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.08778424114225278 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Admin Dashboard UI` to `CV PDF and Carousel`, `Runtime Dependencies`, `Public Portfolio View`, `Root Layout and Theme`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `CV PDF and Carousel` be split into smaller, more focused modules?**
  _Cohesion score 0.10220673635307782 - nodes in this community are weakly interconnected._
- **Should `Admin Dashboard UI` be split into smaller, more focused modules?**
  _Cohesion score 0.08097165991902834 - nodes in this community are weakly interconnected._
- **Should `Runtime Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.05398110661268556 - nodes in this community are weakly interconnected._