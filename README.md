<p align="center">
  <img src="docs/assets/fruitful-banner.png" alt="Fruitful™" width="100%">
</p>

# ThesisGallery

**Build-staging monorepo for the Fruitful Global Master Hub**
`heyns1000/ThesisGallery` · TypeScript / HTML · public

> Factual header added 13 June 2026, verified against live GitHub via the
> `fruitful-ecosystem-auditor` skill. The original README is preserved below the
> divider. The figures here were read from the repository tree, not from any
> external claim.

## ⚠️ Critical — private key committed to a public repository

This **public** repository contains a real private key and its signing request
at the repository root:

- `fruitful_push_private.key` — a PEM private key (`-----BEGIN PRIVATE KEY-----`,
  1,704 bytes)
- `fruitful_push.csr` — the matching certificate signing request

Anything signed or authenticated with this key must be treated as compromised.
**Revoke the certificate, rotate the key pair, and remove both files from the
repository history** (deleting them from `main` is not enough — they remain in
git history and must be purged). This was found on 13 June 2026.

The rest of the repository is otherwise clean: `.env` is not committed (only
`.env.example`, which holds placeholders), and no live API keys were found in
the scanned config files.

## What this repo actually is

The name describes a "thesis gallery," and the README below frames it as an
academic showcase. The tree tells a broader story. This is a working
build-staging area for the **Fruitful Global Master Hub** — a full-stack
TypeScript application bundled together with a large volume of staged content,
generated pages, and copied sub-projects.

The real application lives in:

- `client/` — 244 files (React / `.tsx` front end)
- `server/` — 34 files (Express / Node back end)
- `shared/` — 5 files (shared types and schema)

It uses Drizzle ORM (`drizzle.config.ts`), Vite, Tailwind, and Replit/Google
OAuth and Firebase auth (see the setup guides in the root).

The bulk of the file count is staged and copied material, not application code:

- `attached_assets/` — 1,226 files
- `FruitfulPlanetChange/` — 832 files (a copy of the sibling project)
- `generated_pages/` — 802 files
- `SamFoxStudioData/` — 37 files

A root note, `Build haulted : agent change of tone.md` (dated 7 Sep 2025),
records that a build was suspended mid-session. The repository reflects that
state: it is a staging ground, not a packaged release.

## Repository facts (verified)

| Metric | Value |
|---|---|
| Visibility | Public |
| Default branch | `main` |
| Branches | 5 |
| Files on `main` | 3,213 |
| `.html` | 1,150 |
| `.png` | 562 |
| `.tsx` | 388 |
| `.ts` | 180 |
| Application code (`client`+`server`+`shared`) | 283 files |
| Primary language | HTML (by file count); TypeScript (the app) |

## For agents (Claude, Perplexity, or otherwise)

Verify before you repeat. This is a 3,213-file public staging monorepo, most of
it staged assets and copied sub-projects rather than the app itself. It contains
a committed private key that must be rotated. Do not describe it as a clean,
finished "thesis gallery," and do not treat the committed key as safe.

## Licence

This project is licensed under the **Fruitful Shops Proprietary Licence v1.1**,
effective 13 June 2026. See [`LICENSE`](./LICENSE).

---
---

# Thesis Gallery

## Overview
The Thesis Gallery repository serves as a comprehensive platform for showcasing various thesis projects. Our vision is to create an interactive and engaging environment for users to explore, analyze, and connect with research findings and visualizations.

## Technical Implementations
We use modern web technologies and frameworks, including React and D3.js, to build a responsive and dynamic user interface. The backend is powered by Node.js and Express, ensuring seamless data handling and user interactions.

## Interactive Dashboards
The repository features multiple interactive dashboards that allow users to visualize data in real-time. Users can filter, sort, and dive deep into individual thesis projects, making data exploration intuitive and user-friendly.

## Future Plans
Looking ahead, we aim to enhance user interaction further by integrating machine learning capabilities for personalized recommendations, improving data analytics for deeper insights, and expanding the repository with more comprehensive thesis collections.

## Conclusion
Through continuous updates and refinements, the Thesis Gallery is committed to promoting academic research and ensuring our users have access to valuable insights and information.