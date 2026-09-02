# Pre-Legal Project Status

Last updated: 2 September 2026  
Current branch: `main`  
Latest completed work: **SCRUM-8 — Mutual NDA Creator**

## Current status

SCRUM-8 is complete. The feature branch was merged into `main`, pushed to GitHub, and Jira issue SCRUM-8 is marked **Done**.

The working application is in `frontend/`. It is a standalone Next.js prototype for completing a Mutual Non-Disclosure Agreement, reviewing the cover page and standard terms, and downloading Markdown, DOCX, or PDF files.

Verified commands:

- `npm install`
- `npm run lint`
- `npm run build`
- `npm run dev` with `http://localhost:3000` returning HTTP 200

Run it locally:

```bash
cd frontend
npm install
npm run dev
```

> **Important:** Generated agreements are starting drafts, not legal advice. They require human and legal review before use.

## Project goal

Pre-Legal is intended to become a platform for drafting common legal agreements. The long-term experience should help a user choose an agreement, answer guided questions, produce a useful first draft, review changes, and export it with qualified human oversight.

The project now has the first complete local workflow for one agreement type. It does not yet have a backend, database, authentication, cloud persistence, signatures, or AI drafting.

## Project phases

| Phase | Purpose | Result | Status |
| --- | --- | --- | --- |
| Phase 0 — Repository foundation | Establish the repository and basic licensing/documentation. | Git repository, README, and license. | Complete |
| Phase 1 — Initial project direction | Record the technology direction and prepare for application work. | Python/FastAPI and Node.js/Next.js housekeeping. | Complete |
| Phase 2 — Status checkpoint | Make the project state visible to contributors. | README and contributor-facing status documentation. | Complete |
| Phase 3 — SCRUM-7: source dataset | Collect reusable agreement templates. | 12 Common Paper Markdown documents, `catalog.json`, and CC BY 4.0 notice. | Complete |
| Phase 4 — SCRUM-8: Mutual NDA creator | Turn one source template into a drafting and export workflow. | Next.js app in `frontend/` with form inputs, live preview, standard terms, and Markdown/DOCX/PDF export. | Complete |

## Why the completed phases matter

SCRUM-7 created the auditable source-data foundation. The Markdown templates preserve agreement text, `catalog.json` indexes the documents, and license/source references preserve Common Paper attribution under CC BY 4.0.

SCRUM-8 made that foundation usable. Users can enter the purpose, effective date, MNDA term, confidentiality term, governing law, jurisdiction, and both parties’ details. The preview updates as they type, and the standard terms remain available for review before export.

## Repository map

```text
Pre-Legal/
├── README.md                 # Project description
├── LICENSE                   # Project-owned material license
├── catalog.json              # Curated template index
├── status.md                 # This project status guide
├── issue_debugged.md         # npm/debugging incident report
├── frontend/                 # Standalone Next.js Mutual NDA Creator
└── templates/                # Common Paper Markdown sources
```

`frontend/` is the canonical location for testing SCRUM-8. It has its own `package.json` and `package-lock.json`. Generated `node_modules`, `.next`, and `.npm-cache` directories are ignored by Git.

## How a new contributor should continue

```bash
git switch main
git pull --ff-only
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. Complete both parties’ details, inspect the preview and Standard Terms tab, and download all three supported formats.

In PowerShell, `npm.cmd` may be needed if script execution policy blocks `npm.ps1`. In Git Bash, plain `npm` should work.

## Recommended next phases

### Phase 5 — Template normalization and domain model

Define a reusable model for agreement type, sections, parties, variables, optional clauses, and dependencies such as a cover page plus standard terms. Keep original Markdown separate from derived metadata so the source remains auditable.

### Phase 6 — Backend and document service

Create endpoints for listing templates, retrieving a template, starting a draft, saving answers, and exporting a draft with validation and clear errors.

### Phase 7 — Drafting and modification workflow

Map user answers to template variables and optional sections while keeping original source, inputs, generated output, and revision history distinct.

### Phase 8 — Quality, security, and release readiness

Add automated tests, catalog/template validation, accessibility checks, authentication, authorization, secrets management, audit logging, privacy review, and deployment documentation.

## Definition of meaningful progress

```text
choose agreement → answer guided questions → generate a draft → review changes → export
```

SCRUM-7 supplied the source-data foundation. SCRUM-8 delivered the first local draft-and-export workflow. The next milestone is a tested, reusable service for the wider template catalog.
