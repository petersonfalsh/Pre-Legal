# Pre-Legal Project Status

Last updated: 2 September 2026  
Current branch: `main`  
Latest completed work: SCRUM-7 — Common Paper template dataset

## 1. What this project is trying to become

Pre-Legal is intended to become a platform for drafting common legal agreements. The long-term experience should help a user choose an appropriate agreement, answer questions about the deal, and produce a useful first draft that can be reviewed and edited by qualified people.

The project is still at the foundation stage. It does not yet have a working web application, backend, database, authentication system, document-generation pipeline, or AI drafting workflow. The most important completed step so far is making a legally licensed source collection available for the future system to use.

> **Important:** The templates are starting material, not legal advice. Any generated or modified agreement will need appropriate human and legal review before use.

## 2. Project phases so far

| Phase | Purpose | Result | Status |
| --- | --- | --- | --- |
| Phase 0 — Repository foundation | Establish the project repository and basic licensing/documentation. | Git repository created with a project README and repository license. | Complete |
| Phase 1 — Initial project direction | Record the intended technology direction and keep the repository ready for application work. | Repository housekeeping was added for Python/FastAPI and Node.js/Next.js development artifacts. | Complete |
| Phase 2 — Project status checkpoint | Make the early state of the project visible to contributors. | README explains that the project is in progress. | Complete |
| Phase 3 — SCRUM-7: source dataset | Collect reusable agreement templates that the future drafting system can present, classify, and modify. | 12 Common Paper Markdown documents, `catalog.json`, and a CC BY 4.0 notice were added and merged into `main`. | Complete |

### Why SCRUM-7 matters

The future application needs a dependable set of source documents before it can offer meaningful drafting workflows. SCRUM-7 supplies that initial content layer:

1. The Markdown files preserve the agreement text in a format that is easy for software and people to inspect.
2. `catalog.json` gives the application a small machine-readable index of document names, descriptions, filenames, sources, and licenses.
3. The license notice records that the curated templates come from Common Paper under CC BY 4.0.
4. The source URLs in the catalog make it possible to trace each local copy back to the originating repository and commit.

## 3. What is currently in the repository

```text
Pre-Legal/
├── README.md                 # Short project description and high-level status
├── LICENSE                   # License for this repository's own material
├── .gitignore                # Python, Node.js, local tooling, and worktree exclusions
├── catalog.json              # Metadata index for the curated legal templates
├── status.md                 # This contributor-facing project status guide
└── templates/
    ├── LICENSE.txt           # CC BY 4.0 notice for the curated template collection
    └── *.md                  # 12 Common Paper agreement documents
```

The 12 documents currently cover:

- Mutual Non-Disclosure Agreement cover page
- Mutual Non-Disclosure Agreement
- Cloud Service Agreement
- Design Partner Agreement
- Service Level Agreement
- Professional Services Agreement
- Data Processing Agreement
- Software License Agreement
- Partnership Agreement
- Business Associate Agreement
- Pilot Agreement
- AI Addendum

## 4. How the catalog and templates relate

Each object in `catalog.json` describes one Markdown file in `templates/`. The `filename` value is the link between metadata and document content.

For example:

```json
{
  "name": "Data Processing Agreement",
  "description": "Common Paper Data Processing Agreement.",
  "filename": "data-processing-agreement.md",
  "source": "https://github.com/CommonPaper/DPA/blob/<commit>/DPA.md",
  "license": "CC BY 4.0"
}
```

When adding or replacing a template, update both sides:

1. Put the Markdown document in `templates/`.
2. Add one catalog object with a unique `filename`.
3. Include the source repository URL and the source commit whenever possible.
4. Confirm the source license permits the intended use.
5. Check that every catalog filename exists and that every template Markdown file is cataloged.

## 5. Licensing and content safety

The Common Paper documents are identified as CC BY 4.0 in their source repositories and in this project’s catalog. Attribution must be retained when the documents are copied, adapted, or redistributed. Do not silently remove source references or present the templates as documents authored by Pre-Legal.

Before adding material from another source, verify its license independently. Different providers may use different licenses, and a license that works for one template does not automatically apply to another.

The agreements may contain legal assumptions, defined terms, jurisdictions, and formatting intended for Common Paper’s use cases. Future application code should treat them as source content and should not make claims that a generated draft is complete, correct, or suitable for a particular jurisdiction without review.

## 6. Recommended next phases

The phases below are a suggested path from the current dataset to a usable product. They are planned work, not completed work.

### Phase 4 — Template normalization and domain model

Build a small data model around the current files. Identify agreement type, sections, parties, variables, optional clauses, and dependencies such as a cover page plus standard terms. Keep the original Markdown intact and store derived metadata separately so the source documents remain auditable.

**Exit criteria:** the application can list templates, explain what each is for, and identify the information required to start a draft.

### Phase 5 — Backend and document service

Create the backend service, likely using the Python/FastAPI direction already anticipated by the repository housekeeping. Add endpoints for listing templates, retrieving a template, starting a draft, saving draft answers, and exporting a draft for review.

**Exit criteria:** a client can create and retrieve a draft through a documented API, with validation and clear error responses.

### Phase 6 — Drafting and modification workflow

Add the rules or AI-assisted workflow that maps user answers to template variables and optional sections. Keep the original source, user answers, generated output, and revision history distinct. Add safeguards against losing clauses or changing meaning without making the change visible.

**Exit criteria:** a user can answer a small set of questions and receive a clearly marked draft with a record of the inputs and changes.

### Phase 7 — Web interface

Build the Next.js-facing experience: template discovery, template details, guided questions, draft editing, source/attribution display, and export. Design for a novice user who may not understand legal document structure.

**Exit criteria:** a new user can select a template, understand what it is for, complete the guided flow, and review the resulting draft.

### Phase 8 — Quality, security, and release readiness

Add automated tests, Markdown/catalog validation, accessibility checks, authentication and authorization, secrets management, audit logging, and deployment documentation. Review privacy implications before sending user-provided information to any external model or service.

**Exit criteria:** the system has repeatable checks, documented operating procedures, and an explicit human-review boundary.

## 7. How a new contributor should continue

Start with the repository state and the source data:

```powershell
git switch main
git pull --ff-only
Get-Content .\README.md
Get-Content .\status.md
Get-Content .\catalog.json
Get-ChildItem .\templates -File
```

Then choose one focused next task. A good first implementation task would be a read-only template catalog endpoint or a command that validates `catalog.json` against `templates/`. Avoid building drafting logic before the template/domain model is understood.

For each change:

1. Create a focused branch, for example `feat/template-catalog-api`.
2. Read the relevant source templates and catalog entries before designing the change.
3. Add tests before production code for application behavior.
4. Preserve attribution and avoid changing legal text unless the change is explicitly part of the task.
5. Run the relevant tests and validation checks.
6. Describe assumptions, limitations, and human-review requirements in the pull request.

## 8. Immediate recommended backlog

1. Add a catalog/template consistency validator.
2. Define the first backend data model for templates and drafts.
3. Add an API endpoint that lists the catalog entries.
4. Add tests for catalog loading, missing files, malformed JSON, and duplicate filenames.
5. Decide how drafts, user data, and generated documents will be stored and protected.
6. Build one complete vertical slice for a single agreement before generalizing to all templates.

## Phase 4 — SCRUM-8: Mutual NDA creator (current feature branch)

SCRUM-8 turns the source-data foundation from SCRUM-7 into the first usable product workflow. A novice can open the standalone Next.js application in `frontend/`, enter the purpose, dates, terms, governing law, jurisdiction, and both parties’ details, then see those values reflected in a cover-page preview.

The app also exposes the Common Paper standard terms for review and supports local Markdown, DOCX, and PDF downloads. Exports retain Common Paper attribution and the CC BY 4.0 notice. There is intentionally no backend, account system, AI drafting, signature workflow, or cloud persistence in this phase; the app is a local prototype and generated documents still require qualified human review.

To continue after this phase:

```powershell
cd frontend
npm install
npm run dev
```

Then visit `http://localhost:3000`. The next product step should be to extract the agreement model into a tested template service/API, while keeping the source Markdown and attribution auditable.

## 9. Definition of project progress

The project should be considered meaningfully progressing when a contributor can trace a user action through the complete system:

```text
choose agreement → answer guided questions → generate a draft → review changes → export
```

SCRUM-7 completed the source-data foundation for the first step. The next milestone is not collecting more documents; it is turning the existing catalog and templates into a tested, inspectable application workflow.
