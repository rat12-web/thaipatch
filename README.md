# ThaiPatch

A static Thai translation game catalog, continued from ThaiPatch v0.29 and its v0.30 audits.

128 translation/patch entries are grouped into 126 games. Search by title or translator, filter by platform/series/team/genre, browse the preserved series slides, and select the team or edition before opening the original source in a new tab.

This deployment contains only the catalog. Voting, translation services, personal releases, ROM creation, IPS processing and sample ROM files are removed. There is no backend, account system, upload form, localStorage or simulated popularity/download count.

## Data and images

catalog.json is the published catalog snapshot; app.js embeds the same snapshot so the site needs no runtime data API. Stable original IDs and team credits are preserved. The omitted record is the synthetic local IPS demo.

The 18 90S Game slugs were observed, but fresh navigation did not prove query-based automatic selection. The site tells users to select the named game manually at the original source. Directory/inferred routes have explicit guidance. Successful rendering does not certify every source link or the patch itself.

Images are referenced remotely from the existing creator/official-art audit. No external images are copied into this repository. Unavailable images fall back to text. Missing or questionable logos use team names. Reuse permissions remain separate from source identity; this repository does not assert ownership of third-party artwork.

## Hosting

GitHub Pages serves the main branch from `/`, with `.nojekyll`. All stylesheet/script references are relative so the site works under `/thaipatch/`. No build or server runtime is needed.

## Validation

Playwright/Chromium covers desktop 1440×1000, mobile 390×844 and small mobile 320×740; search, combined filters, pagination, 14 series slides, duplicate-team/edition links, keyboard focus, removed functionality, unavailable-image fallback and unsafe URL rejection. The source workspace contains the reproducible build and QA scripts plus audit evidence. Online verification is recorded in that workspace after deployment; see SOURCE_AUDIT.md for catalog limitations.
