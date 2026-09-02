# SCRUM-8 Mutual NDA Creator Design

## Goal

Create a browser-based Next.js prototype that lets a user enter key Mutual Non-Disclosure Agreement details, see those details populated into a readable agreement preview, and download the completed agreement locally.

## Scope

### In scope

- A standalone Next.js application in `frontend/`.
- TypeScript, App Router, ESLint, and Tailwind CSS.
- A single Mutual NDA creation flow.
- Form fields for the agreement and both parties.
- Client-side form state and live preview updates.
- Client-side Markdown download.
- Common Paper source attribution and CC BY 4.0 notice.
- Responsive, keyboard-accessible presentation suitable for a first-time user.
- Automated checks plus a browser smoke test for the principal user journey.

### Out of scope

- Backend APIs, persistence, authentication, or user accounts.
- AI generation or legal advice.
- DOCX or PDF export.
- Electronic signatures.
- Multiple agreement types or a general template engine.
- Editing the legal meaning of the Common Paper source text.

## User experience

The page presents a clear two-part workspace:

1. **Agreement details form** — the user enters or confirms the information needed for the Cover Page.
2. **Live agreement preview** — the completed Cover Page and Standard Terms are rendered as readable document content.

The form should have sensible defaults for the effective date, purpose, one-year MNDA term, and one-year confidentiality term. Required fields must be visibly marked and validated before download. Validation messages should identify the field that needs attention without losing any entered values.

The preview should update as the user types or changes an option. Empty values should be represented with an obvious placeholder in the preview rather than silently disappearing. The download action should produce a `.md` file locally in the browser, with a stable filename such as `mutual-nda-<party-1>-<party-2>.md` after safe filename normalization.

The UI must state that the output is a draft requiring appropriate human/legal review. The Common Paper attribution and CC BY 4.0 link must remain visible in the preview and be included in the downloaded document.

## Agreement data model

Use a typed object as the single source of truth for form state and rendering:

```ts
type Party = {
  name: string
  title: string
  company: string
  noticeAddress: string
}

type MutualNdaFormData = {
  purpose: string
  effectiveDate: string
  mndaTerm: 'one-year' | 'until-terminated'
  confidentialityTerm: 'one-year' | 'perpetuity'
  governingLaw: string
  jurisdiction: string
  partyOne: Party
  partyTwo: Party
}
```

Keep source agreement text and field interpolation separate from UI components. The renderer should receive `MutualNdaFormData` and return the completed Markdown/document model. It must not mutate the source template or silently omit standard terms.

## Component boundaries

- `frontend/src/app/layout.tsx` — root HTML shell, metadata, and global styles import.
- `frontend/src/app/page.tsx` — page composition and initial server-rendered shell.
- `frontend/src/components/mutual-nda-creator.tsx` — client-side orchestration of form state, validation, preview, and download.
- `frontend/src/components/mutual-nda-form.tsx` — labeled inputs and validation display.
- `frontend/src/components/mutual-nda-preview.tsx` — document preview and attribution.
- `frontend/src/data/mutual-nda.ts` — typed defaults, field metadata, source agreement content, and rendering function.
- `frontend/src/lib/download.ts` — browser-only Blob/download helper and safe filename normalization.
- `frontend/src/app/globals.css` — visual system, responsive layout, form controls, document styling, and print-friendly rules.
- `frontend/tests/` — focused tests for rendering, validation, filename normalization, and download behavior where practical.

The form and preview should be independently understandable: the form owns input controls and validation messages; the preview owns document presentation; the data module owns agreement content and interpolation; the download helper owns browser file creation.

## Data flow

```text
defaults
  ↓
form input → typed MutualNdaFormData → validation
                              ↘
                       rendered agreement
                              ↘
                     local Markdown download
```

The application is intentionally local-only for this prototype. No user-entered agreement information should leave the browser or be sent to an API.

## Technical approach

Use the current `create-next-app` recommended setup: TypeScript, ESLint, Tailwind CSS, App Router, and Turbopack for development. The application should use React client components only where interactive state is needed; static layout and metadata can remain server-rendered.

Use standard Web APIs for download: create a `Blob` from the rendered Markdown, create an object URL, trigger an `<a download>` action, and revoke the object URL afterward. This avoids introducing a server endpoint for a local-only operation.

Use semantic HTML elements, explicit labels, fieldset/legend groupings for party and term options, visible focus states, sufficient color contrast, and a layout that remains usable on narrow screens. Do not rely on color alone for validation or legal-review warnings.

## Error handling and safeguards

- Block download when required fields are empty or invalid.
- Keep form values intact when validation fails.
- Show a clear, non-technical validation message beside the relevant field.
- Disable or guard download while a download is being triggered to prevent duplicate clicks.
- Normalize party names before using them in a filename; fall back to `mutual-nda-draft.md` when names are empty.
- Escape or safely render user-entered values so they cannot inject UI markup.
- Preserve the original Common Paper attribution, source reference, and license statement.
- Label the output as a draft and direct users to human/legal review.

## Verification strategy

The implementation must be verified at three levels:

1. **Unit/component checks** — defaults, validation, agreement interpolation, and filename normalization.
2. **Static/project checks** — ESLint, TypeScript validation, and `next build`.
3. **Browser smoke test** — load the page, enter representative party and agreement details, confirm the preview contains those values, and trigger the download action.

The success criteria are:

- `frontend/` installs and builds independently from the repository root.
- The initial page explains the Mutual NDA workflow and shows the form.
- A completed form produces a preview containing the entered values in the expected agreement fields.
- Invalid required input prevents download and explains what must be corrected.
- A valid form triggers a local Markdown download containing the completed Cover Page, Standard Terms, attribution, and license notice.
- The application is usable with keyboard navigation and at mobile widths.

## Future extension points

The typed data model and separated renderer are intentionally small foundations for later phases. Future work may add other agreement types, saved drafts, backend persistence, DOCX/PDF export, or guided/AI-assisted drafting. Those capabilities should consume the same kind of explicit document model rather than coupling directly to form components.
