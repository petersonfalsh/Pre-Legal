# SCRUM-8 Dependency Issue: Investigation and Resolution

## What this document explains

SCRUM-8 is the Mutual NDA Creator frontend. The application itself is a Next.js app in:

```text
Pre-Legal/frontend/
```

Before the application could be tested, installing its JavaScript dependencies repeatedly failed. This document explains what happened, why the commands looked confusing, how the problem was fixed, and how to avoid the same problem in future work.

## The original issue

The first installation attempts produced errors such as:

```text
npm error Invalid Version:
npm error Missing: @emnapi/runtime@1.11.3 from lock file
npm error Missing: @emnapi/core@1.11.3 from lock file
npm error EPERM: operation not permitted
```

The visible failure changed from attempt to attempt, but there were two related causes:

1. The npm cache used by the machine was not writable. npm could not create its temporary cache directory under:

   ```text
   C:\Users\DELL\AppData\Local\npm-cache\_cacache\tmp
   ```

   This caused `EPERM`, which means the operating system refused the file operation.

2. Earlier interrupted npm repair attempts left the SCRUM-8 `package-lock.json` inconsistent. It contained an optional dependency entry with an empty version and did not contain all packages required by the dependency graph, including the `@emnapi` packages.

   `npm ci` is intentionally strict. It will not guess or repair a lockfile. It stops when `package.json` and `package-lock.json` do not describe exactly the same dependency tree.

The worktree was not the root cause. The problem followed the damaged lockfile and the machine's npm cache configuration.

## What Superpowers was doing

Superpowers was following an isolated development workflow. It created a feature worktree, scaffolded the Next.js application there, and tried to install and repair dependencies inside that worktree.

That isolation is normally useful: unfinished work does not pollute the main branch, and a feature can be reviewed before it is merged. However, the worker encountered the npm failures while attempting several repairs. Once the lockfile and cache state had become unreliable, repeating install commands could not safely produce a trustworthy dependency tree.

The worker correctly stopped rather than claiming that the feature was complete. The limitation was that the investigation focused on repeated npm repair attempts before fully separating these questions:

- Is the package manifest valid?
- Is the lockfile structurally valid and synchronized?
- Can npm write to its cache directory?
- Is the failure caused by the worktree, the shell, or npm itself?

Without answering those separately, each failed repair risked producing another partial installation and another misleading error.

## Why `npm ci` was being used

`npm ci` means “clean install.” It is used when a project already has a lockfile and we want npm to install exactly what the lockfile specifies.

It is stricter than `npm install`:

- `npm install` may update or regenerate `package-lock.json`.
- `npm ci` refuses to update the lockfile.
- `npm ci` deletes and recreates `node_modules`.
- `npm ci` fails immediately if `package.json` and `package-lock.json` are out of sync.

That strictness is useful for repeatable builds, but it exposed the damaged lockfile instead of silently repairing it.

The correct repair sequence was therefore:

1. Inspect the lockfile.
2. Regenerate the lockfile with `npm install --package-lock-only`.
3. Run a clean `npm ci` to prove that the regenerated lockfile works.

## Why `npm.cmd` was being used

On Windows, PowerShell may resolve `npm` to `npm.ps1`. If script execution is disabled, PowerShell reports that the script cannot be loaded.

`npm.cmd` invokes the Windows command shim directly and bypasses that PowerShell script-policy issue.

This was a shell issue, not a Next.js issue and not a worktree issue.

In Git Bash, plain npm works:

```bash
npm install
npm run dev
```

In PowerShell, `npm.cmd` may be needed on this machine:

```powershell
npm.cmd install
npm.cmd run dev
```

## What a Git worktree is

A Git worktree is another working directory connected to the same Git repository. Each worktree can have its own checked-out branch while sharing the repository's Git history.

For example, the SCRUM-8 feature was initially isolated at:

```text
Pre-Legal/.worktrees/scrum-8-mutual-nda-creator/
```

The main checkout remained on `main`, while the worktree used:

```text
feat/scrum-8-mutual-nda-creator
```

The purpose of the worktree is safety and parallel development. It is not a container, virtual machine, or separate npm environment. npm still uses the same operating system, Node.js installation, network, permissions, and usually the same user cache unless configured otherwise.

Therefore:

```text
worktree ≠ cause of the npm failure
```

The worktree did create ambiguity for a beginner because the app was not located in the main checkout's visible `frontend` directory, and Git would not allow the same branch to be checked out simultaneously in both locations.

## How the problem was solved

### Step 1: Inspect the actual locations

The feature worktree contained the implementation, while the root checkout initially did not contain a usable `frontend` directory.

The first important distinction was:

```text
implementation source: .worktrees/scrum-8-mutual-nda-creator/frontend/
testing location:      Pre-Legal/frontend/
```

### Step 2: Reproduce the failure

Running a clean install reproduced the cache problem:

```text
EPERM: operation not permitted, mkdir C:\Users\DELL\AppData\Local\npm-cache\_cacache\tmp
```

Running with a writable task-local cache then exposed the lockfile problem:

```text
Invalid Version:
```

This proved that the cache permission error and the lockfile corruption were separate problems.

### Step 3: Inspect the lockfile

The lockfile contained this malformed optional entry:

```json
"node_modules/@img/sharp-wasm32/node_modules/@emnapi/runtime": {
  "optional": true
}
```

It had no `version` field. The lockfile also omitted packages required by the optional dependency graph.

### Step 4: Regenerate the lockfile

The lockfile was regenerated from the valid `package.json`:

```bash
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
```

This restored the missing dependency metadata and removed the malformed lockfile state.

### Step 5: Perform a clean installation

The repaired dependency tree was tested with:

```bash
npm ci --ignore-scripts --no-audit --no-fund
```

It installed the dependency tree successfully.

### Step 6: Make the app easy to test

The tracked frontend files from the feature branch were copied into the root project at:

```text
Pre-Legal/frontend/
```

The old generated `node_modules`, `.next`, and lockfiles were removed from the testing copy. The empty parent-level lockfile was also removed because it made Next.js infer the parent directory as a workspace root.

The root frontend was then installed from Git Bash using plain npm:

```bash
cd ~/Desktop/BUILD_N_SHIP/Pre-Legal/frontend
npm install
```

### Step 7: Verify the application

These commands passed from the root `frontend` directory:

```bash
npm run lint
npm run build
npm run dev
```

The development server started at `http://localhost:3000` and returned HTTP 200.

## How to test SCRUM-8 now

From Git Bash:

```bash
cd ~/Desktop/BUILD_N_SHIP/Pre-Legal/frontend
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

Then verify:

1. Enter a purpose, effective date, governing law, and jurisdiction.
2. Enter names, titles, companies, and notice addresses for both parties.
3. Confirm the preview updates as values change.
4. Open the Standard Terms tab.
5. Download the Markdown, DOCX, and PDF versions.
6. Open each downloaded file and confirm that the entered values and Common Paper attribution are present.

## What should be done differently next time

The first troubleshooting pass should establish a clean diagnostic baseline before attempting repairs:

```bash
node --version
npm --version
pwd
test -f package.json && echo package.json-present
test -f package-lock.json && echo package-lock-present
npm install --package-lock-only --ignore-scripts --no-audit --no-fund
npm ci --ignore-scripts --no-audit --no-fund
```

If npm reports a cache permission error, configure a writable project-local cache immediately:

```bash
npm config set cache "$PWD/.npm-cache"
```

Then distinguish lockfile repair from dependency installation:

```bash
npm install --package-lock-only
npm ci
```

An agent should not repeatedly run `npm install --force`, offline repair commands, or partial package installs without checking whether they are making the lockfile worse. After each repair, it should validate the lockfile with a clean `npm ci`.

For a future isolated feature, the agent should also tell the user exactly where the app lives:

```text
You are working in .worktrees/<feature>/frontend.
To test it, cd into that directory.
```

If the user wants the app directly under the main project, the agent should either merge the feature branch into `main` or make a clearly identified root copy. It should not leave two silently different frontend copies.

## The practical lesson

The application was not blocked by Next.js or by Git worktrees. It was blocked by a corrupted npm lockfile combined with an unwritable npm cache, then made confusing by testing from different locations and shells.

The reliable pattern is:

```text
one frontend directory
→ one package.json
→ one synchronized package-lock.json
→ writable npm cache
→ clean npm ci
→ lint/build/dev verification
```

The implementation is now available at `Pre-Legal/frontend/`, where a beginner can run `npm install` and `npm run dev` directly.
