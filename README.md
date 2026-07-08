# Sinaptik Mentor Portal — Prototype

Web prototype for the Sinaptik mentor (instructor) portal. Built with React, TypeScript, Vite, and Tailwind CSS.

## Quick start

```bash
npm install
npm run dev
```

## Project structure

```
docs/                    # Product & technical documentation (English)
public/                  # Static assets (logo, etc.)
src/
  components/
    layout/              # App shell: sidebar, header, back button
    charts/              # Chart components
    ...                  # Shared UI components
  context/               # React context (app state, i18n, sidebar)
  data/                  # Mock data, catalogs, quiz payloads
  i18n/                  # EN / ID translations
  pages/
    mentor/              # All mentor portal pages
  types/                 # TypeScript interfaces
  utils/                 # Helpers (dashboard, navigation, etc.)
```

## Documentation

| File | Description |
|------|-------------|
| [docs/prototype-pages-spec.md](docs/prototype-pages-spec.md) | Page specs, Figma alignment, routes |
| [docs/backend-fe-contract.md](docs/backend-fe-contract.md) | Database schema, API map, mentor workflow |
| [docs/dashboard-formulas.md](docs/dashboard-formulas.md) | KPI and board calculation formulas |
| [docs/page-components.md](docs/page-components.md) | UI component breakdown per page |
| [docs/user-flow.md](docs/user-flow.md) | End-to-end user flows |

## Routes

| Path | Page |
|------|------|
| `/` | Dashboard |
| `/tasks` | Tasks (calendar + work queue) |
| `/learners` | Learner roster |
| `/learners/:learnerId` | Learner profile |
| `/notifications` | Inbox |
| `/programs` | Course catalog |
| `/marking/:submissionId` | Grading |
| `/review/:requestId` | Review escalation |
| `/chat`, `/chat/:learnerId` | Chat |

Legacy `/mentor/*` URLs redirect to the routes above.

## i18n

English (EN) and Bahasa Indonesia (ID) via the language switcher in the header.
