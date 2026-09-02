# SCRUM-8 Mutual NDA Creator Implementation Plan

> For agentic workers: REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox syntax for tracking.

Goal: Build a standalone Next.js prototype in frontend/ that collects Mutual NDA details, previews the completed agreement, and downloads equivalent Markdown, DOCX, and PDF files locally.

Architecture: Use a typed MutualNdaFormData model as the boundary between the interactive form and a shared agreement renderer. The renderer produces a canonical agreement representation consumed by Markdown, DOCX, PDF, and preview adapters, while browser-only download helpers keep user data local and avoid a backend.

Tech Stack: Next.js App Router, React, TypeScript, ESLint, Tailwind CSS, docx, @react-pdf/renderer, Vitest, React Testing Library, and Playwright.

Spec: docs/superpowers/specs/2026-09-02-scrum-8-mutual-nda-creator-design.md

## Global Constraints

- Create the application in frontend/.
- Use TypeScript, ESLint, Tailwind CSS, App Router, and Turbopack-compatible Next.js defaults.
- Require Node.js 20.9 or newer.
- Keep all form data and exports in the browser; do not add a backend or persistence.
- Preserve the Common Paper Mutual NDA Cover Page, Standard Terms, attribution, source reference, and CC BY 4.0 notice.
- Keep Markdown, DOCX, PDF, and preview content generated from the same completed agreement model.
- Label output as a draft requiring appropriate human/legal review.
- Do not add authentication, AI generation, electronic signatures, or multiple agreement types.

---

### Task 1: Scaffold the frontend application

Files:
- Create: frontend/package.json
- Create: frontend/tsconfig.json
- Create: frontend/next.config.ts
- Create: frontend/eslint.config.mjs
- Create: frontend/postcss.config.mjs
- Create: frontend/src/app/layout.tsx
- Create: frontend/src/app/page.tsx
- Create: frontend/src/app/globals.css
- Create: frontend/vitest.config.ts
- Create: frontend/playwright.config.ts

- [ ] Step 1: Confirm the runtime

Run:

~~~powershell
node --version
npm --version
~~~

Expected: Node.js is at least 20.9, and npm is available.

- [ ] Step 2: Generate the application shell

From the repository root, run:

~~~powershell
npx create-next-app@latest frontend --ts --eslint --tailwind --app --src-dir --use-npm --import-alias "@/*" --yes
~~~

If the CLI has changed flags, use the equivalent interactive choices: TypeScript, ESLint, Tailwind CSS, src/ directory, App Router, and the default import alias.

- [ ] Step 3: Add export and test dependencies

Run from frontend/:

~~~powershell
npm install docx @react-pdf/renderer
npm install --save-dev vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @playwright/test
npx playwright install chromium
~~~

- [ ] Step 4: Add deterministic scripts

Set these scripts in frontend/package.json:

~~~json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
~~~

- [ ] Step 5: Run the empty scaffold checks

~~~powershell
npm run lint
npm run build
~~~

Expected: both commands exit with code 0 before feature code is added.

- [ ] Step 6: Commit

~~~powershell
git add frontend
git commit -m "feat: scaffold Next.js frontend"
~~~

### Task 2: Create the shared Mutual NDA model and renderer

Files:
- Create: frontend/src/data/mutual-nda.ts
- Create: frontend/src/lib/agreement.ts
- Create: frontend/src/lib/agreement.test.ts

Interfaces:
- Produce Party, MutualNdaFormData, AgreementSection, defaultMutualNdaFormData, validateMutualNdaFormData, renderMutualNda, and formatAgreementFilename.
- renderMutualNda(data: MutualNdaFormData): AgreementDocument returns ordered Cover Page and Standard Terms sections plus attribution.

- [ ] Step 1: Write failing model and renderer tests

Add tests for default terms, valid and invalid required fields, interpolation of both party companies, preservation of Standard Terms, preservation of CC BY 4.0, and filename normalization. Include a test for empty party names falling back to mutual-nda-draft.

- [ ] Step 2: Run the focused tests and verify RED

~~~powershell
npm test -- agreement.test.ts
~~~

Expected: tests fail because the model and renderer do not yet exist.

- [ ] Step 3: Implement the minimum typed model

Copy the agreement source content from templates/mutual-nda-coverpage.md and templates/mutual-nda.md into structured source constants. Implement the exact fields from the spec, defaults, required-field validation, and a renderer that interpolates values without dropping the Standard Terms or attribution.

- [ ] Step 4: Run the focused tests and verify GREEN

~~~powershell
npm test -- agreement.test.ts
~~~

Expected: all model, validation, interpolation, attribution, and filename tests pass.

- [ ] Step 5: Commit

~~~powershell
git add frontend/src/data/mutual-nda.ts frontend/src/lib/agreement.ts frontend/src/lib/agreement.test.ts
git commit -m "feat: add Mutual NDA document model"
~~~

### Task 3: Build the form, live preview, and accessibility baseline

Files:
- Create: frontend/src/components/mutual-nda-form.tsx
- Create: frontend/src/components/mutual-nda-preview.tsx
- Create: frontend/src/components/mutual-nda-creator.tsx
- Modify: frontend/src/app/page.tsx
- Modify: frontend/src/app/layout.tsx
- Modify: frontend/src/app/globals.css
- Create: frontend/src/components/mutual-nda-creator.test.tsx

- [ ] Step 1: Write failing component tests

Test that the page renders the heading and required labels, defaults are visible, changing a party company updates the preview, and an empty required field shows an inline error.

- [ ] Step 2: Run the focused tests and verify RED

~~~powershell
npm test -- mutual-nda-creator.test.tsx
~~~

Expected: tests fail because the creator components are not implemented.

- [ ] Step 3: Implement the form and preview

Use a client component for state and event handling. Group fields into Agreement Details, Party 1, and Party 2 fieldsets. Render the canonical agreement sections in a styled document panel. Mark the result as a draft and keep the source/license notice visible.

- [ ] Step 4: Add responsive and keyboard-accessible styling

Use semantic labels, legends, visible focus styles, aria-invalid and aria-describedby for invalid fields, and a single-column layout below the mobile breakpoint. Do not use color alone to communicate errors or warnings.

- [ ] Step 5: Run focused tests and lint

~~~powershell
npm test -- mutual-nda-creator.test.tsx
npm run lint
~~~

Expected: tests and lint pass without warnings.

- [ ] Step 6: Commit

~~~powershell
git add frontend/src/app frontend/src/components
git commit -m "feat: add Mutual NDA creator form and preview"
~~~

### Task 4: Add Markdown export

Files:
- Create: frontend/src/lib/export-markdown.ts
- Modify: frontend/src/components/mutual-nda-creator.tsx
- Create: frontend/src/lib/export-markdown.test.ts

- [ ] Step 1: Write failing export tests

Test that the Markdown exporter returns the rendered Cover Page, Standard Terms, entered party values, attribution, and a .md filename.

- [ ] Step 2: Run tests and verify RED

~~~powershell
npm test -- export-markdown.test.ts
~~~

Expected: the test fails because the exporter does not exist.

- [ ] Step 3: Implement the exporter

Serialize the canonical AgreementDocument to Markdown and pass it to the shared browser download helper. Disable or guard the export action while generation is in progress and prevent export when validation returns errors.

- [ ] Step 4: Run tests and verify GREEN

~~~powershell
npm test -- export-markdown.test.ts
~~~

Expected: all Markdown content and filename assertions pass.

- [ ] Step 5: Commit

~~~powershell
git add frontend/src/lib/export-markdown.ts frontend/src/lib/export-markdown.test.ts frontend/src/components/mutual-nda-creator.tsx
git commit -m "feat: add Markdown agreement export"
~~~

### Task 5: Add DOCX export and structural verification

Files:
- Create: frontend/src/lib/export-docx.ts
- Create: frontend/src/lib/export-docx.test.ts
- Modify: frontend/src/components/mutual-nda-creator.tsx
- Create: frontend/scripts/inspect-docx.mjs

- [ ] Step 1: Write failing DOCX tests

Test that a valid agreement produces a non-empty DOCX Blob with the expected .docx filename and that the generated package contains the entered party values, agreement headings, attribution, and license URL.

- [ ] Step 2: Run tests and verify RED

~~~powershell
npm test -- export-docx.test.ts
~~~

Expected: the test fails because DOCX export does not exist.

- [ ] Step 3: Implement the DOCX exporter

Use the docx package to create a readable document with a title, heading hierarchy, paragraphs, the party information table, and a footer or final paragraph containing the Common Paper attribution and CC BY 4.0 link. Generate the file in the browser and return a Blob for the shared download helper.

- [ ] Step 4: Run tests and verify GREEN

~~~powershell
npm test -- export-docx.test.ts
~~~

Expected: the DOCX content and filename checks pass.

- [ ] Step 5: Add structural inspection

Implement inspect-docx.mjs to unzip word/document.xml and assert that the expected party values, Standard Terms heading, attribution, and license URL occur in the document XML.

- [ ] Step 6: Render and inspect DOCX output

Use the document render workflow to convert a representative generated DOCX to page PNGs. Inspect every page for clipping, overlap, missing glyphs, broken tables, and unreadable spacing. Correct the DOCX builder and repeat the render if any defect appears.

- [ ] Step 7: Commit

~~~powershell
git add frontend/src/lib/export-docx.ts frontend/src/lib/export-docx.test.ts frontend/scripts/inspect-docx.mjs frontend/src/components/mutual-nda-creator.tsx
git commit -m "feat: add DOCX agreement export"
~~~

### Task 6: Add PDF export and visual verification

Files:
- Create: frontend/src/lib/export-pdf.tsx
- Create: frontend/src/lib/export-pdf.test.tsx
- Modify: frontend/src/components/mutual-nda-creator.tsx
- Create: frontend/scripts/inspect-pdf.mjs

- [ ] Step 1: Write failing PDF tests

Test that a valid agreement renders to a non-empty PDF Blob with a .pdf filename and that the generated PDF contains the entered party values, agreement headings, attribution, and CC BY 4.0 link when text is extracted.

- [ ] Step 2: Run tests and verify RED

~~~powershell
npm test -- export-pdf.test.tsx
~~~

Expected: the test fails because PDF export does not exist.

- [ ] Step 3: Implement the PDF document

Create a browser-compatible PDF document component from the same AgreementDocument sections used by the preview and DOCX exporter. Use readable page margins, typography, heading styles, paragraph spacing, and a party information table. Return a Blob and use the shared download helper.

- [ ] Step 4: Run tests and verify GREEN

~~~powershell
npm test -- export-pdf.test.tsx
~~~

Expected: the PDF content and filename checks pass.

- [ ] Step 5: Add structural and visual checks

Implement inspect-pdf.mjs with pdfinfo and text extraction checks for page count, expected values, attribution, and license URL. Render the generated PDF to PNGs with Poppler and inspect every page at 100% for clipping, overlap, missing glyphs, and unreadable layout.

- [ ] Step 6: Commit

~~~powershell
git add frontend/src/lib/export-pdf.tsx frontend/src/lib/export-pdf.test.tsx frontend/scripts/inspect-pdf.mjs frontend/src/components/mutual-nda-creator.tsx
git commit -m "feat: add PDF agreement export"
~~~

### Task 7: Complete browser smoke testing

Files:
- Modify: frontend/playwright.config.ts
- Create: frontend/tests/mutual-nda-creator.spec.ts

- [ ] Step 1: Write the end-to-end test

Cover this journey:

~~~text
open / → locate form → fill party/company and governing-law fields
→ confirm preview contains entered values
→ click Markdown export and observe download
→ click DOCX export and observe download
→ click PDF export and observe download
→ clear a required field → confirm export is blocked and an error is shown
~~~

- [ ] Step 2: Run the browser test

~~~powershell
npm run test:e2e
~~~

Expected: Chromium completes the journey with three downloads and one blocked invalid submission.

- [ ] Step 3: Run the complete static suite

~~~powershell
npm test
npm run lint
npm run build
~~~

Expected: all tests pass, lint exits 0, and the production build exits 0.

- [ ] Step 4: Commit

~~~powershell
git add frontend/playwright.config.ts frontend/tests/mutual-nda-creator.spec.ts
git commit -m "test: cover Mutual NDA creator journey"
~~~

### Task 8: Update project status and prepare the pull request

Files:
- Modify: status.md

- [ ] Step 1: Update the phase history

Add Phase 4 — SCRUM-8 to status.md, stating that the frontend prototype now supports Mutual NDA data entry, live preview, and local Markdown/DOCX/PDF export. Mark backend, persistence, AI assistance, signatures, and broader agreement support as future work.

- [ ] Step 2: Add contributor instructions

Document the commands for starting the frontend:

~~~powershell
cd frontend
npm install
npm run dev
~~~

Also document the required Node.js version, test commands, and the fact that exported agreements remain drafts requiring human/legal review.

- [ ] Step 3: Verify the final diff

~~~powershell
git status --short
git diff --check
git log --oneline --decorate -8
~~~

Expected: no whitespace errors, the branch contains only SCRUM-8 implementation and status documentation, and all verification commands from Task 7 remain green.

- [ ] Step 4: Commit

~~~powershell
git add status.md
git commit -m "docs: record SCRUM-8 frontend milestone"
~~~

- [ ] Step 5: Push and raise the PR

~~~powershell
git push -u origin feat/scrum-8-mutual-nda-creator
~~~

Open a PR into main titled feat: add Mutual NDA creator frontend. Include the completed user journey, export formats, license/attribution handling, exact verification commands, and a link to SCRUM-8.
