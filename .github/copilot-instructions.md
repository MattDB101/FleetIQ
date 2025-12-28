# Copilot / AI Agent Instructions — FleetIQ

This file gives focused, actionable guidance for AI coding agents working on the FleetIQ codebase.

1) Project overview
- Single-page React app (React 17) built with Vite. Frontend source: `src/`.
- Firebase is used for backend data (Firestore) and Cloud Functions in `functions/`.
- Production build output lives in `build/` and `public/` contains static assets.

2) How to run & build
- Local dev (frontend): `npm run dev` or `npm start` (both run `vite`).
- Build (frontend): `npm run build` (produces `build/`).
- Functions (emulator): `cd functions && npm run serve` (uses Firebase emulators).
- Deploy functions: `cd functions && npm run deploy` (runs `firebase deploy --only functions`).

3) Key files & locations (quick reference)
- Frontend entry: `src/index.jsx` and `src/App.jsx`.
- Firebase config: `src/firebase/config.js`.
- Auth context: `src/context/AuthContext.jsx` (use this to find auth flows).
- Custom hooks: `src/hooks/` (note there are both `.js` and `.jsx` copies for many hooks).
- Page components: `src/pages/*` (many use CSS Modules, e.g. `PSV.module.css`).
- Cloud Functions: `functions/index.js` and `functions/lib/index.js`.

4) Important code patterns & conventions
- Custom hooks are central: `useCollection('collectionName')` is used to read Firestore collections.
  - Example: `useCollection('vehicles')` in `src/pages/quickAudit/quickAudit.jsx`.
  - Documents commonly contain fields like `registration` and `expiryDate` (Firestore Timestamp).
  - Code frequently converts timestamps with `expiryDate.toDate()` if present.
- UI libraries: the code mixes MUI v5 (`@mui/material`) and older `@material-ui/*` v4 imports. Do not auto-migrate imports — preserve versions and test UI after changes.
- Styling: pages use CSS Modules (`*.module.css`) while global styles live in `src/index.css`.
- Date libraries: multiple date libraries are present (`date-fns`, `dayjs`, `moment`). Match the existing file's choice when editing.

5) Editing notes & gotchas
- Duplicate files: several hooks and utilities have both `.js` and `.jsx` flavors in `src/hooks/` — search and update both when changing behavior.
- Tests: `npm test` runs `react-scripts test` (CRA runner) though the app is served with Vite. Be careful when adjusting test configs; run tests locally to validate.
- Firestore fields: code assumes certain collection names (`vehicles`, `cvrts`, `fireextinguishers`, `firstaidkits`, `psvs`, `tachocalibrations`, `taxes`). Use existing collection names when querying.
- Timestamps: always handle both Firestore `Timestamp` and JS `Date` objects (see `quickAudit.jsx` conversion pattern).

6) Example snippets to follow
- Find vehicles with registration and expiry handling:
  - `const { documents: vehicles } = useCollection('vehicles');`
  - `if (doc.expiryDate && doc.expiryDate.toDate) expiry = doc.expiryDate.toDate()`

7) When touching backend functions
- Look in `functions/` (separate `package.json`). Use `npm install` inside `functions/` before running emulators.
- Functions scripts: `serve` (emulator), `shell` (functions shell), `deploy` (firebase deploy). Node engine is set to 18.

8) Safety & review guidance
- Run the app locally after UI changes (`npm run dev`) and check console for MUI compatibility warnings.
- For Firestore-affecting changes, prefer testing against the emulator (`cd functions && npm run serve`) and local dev Firestore rules.

9) Questions for the owner
- Confirm preferred date library and whether you'd like a migration plan.
- Confirm whether the duplicate `.js`/`.jsx` hook files are intentionally both used or candidates for consolidation.

If anything here is unclear or you'd like more examples (e.g. common component patterns or a mapping of routes → pages), tell me which section to expand.
