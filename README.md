# แปลไทยบอกด้วย · romthai.app

A static Thai translation game catalog, continued from ThaiPatch v0.29 and its v0.30 audits. The current brand is แปลไทยบอกด้วย (romthai.app).

Live: https://rat12-web.github.io/thaipatch/. romthai.app is the English brand; a custom domain is not configured.

The pixel-game UI uses the two original brand images supplied by the user. Dark and light modes follow the system preference on first visit; the header button saves an explicit choice under the sole localStorage key `romthai.theme`. Search and the catalog still work if storage is blocked.

128 translation/patch entries are grouped into 126 games. Click a single-team game card to open the original source immediately in a new tab. Multiple-team/edition games keep a chooser; clicking a choice opens the source directly. Search, platform/series/team/genre filters and series slides remain.

This deployment contains only the catalog. Voting, translation services, personal releases, ROM creation, IPS processing and sample ROM files are removed. There is no backend, account system, upload form or simulated popularity/download count. Browser storage holds only a theme preference.

## Data and images

catalog.json is the published catalog snapshot; app.js embeds the same snapshot so the site needs no runtime data API. Stable original IDs and team credits are preserved. The omitted record is the synthetic local IPS demo.

The route correction verified 63 game permalink/selection routes and 24 targeted source-card links, plus the single-game Rudra source. All previous directory-only entries now have game-specific routes or measured source-card targeting. Sources without a URL selection handler use a native scroll-to-text link: it opens the actual creator site at the named card, without a ThaiPatch detail page or a proxy. This does not select the source's patch dropdown. The 18 90S links retain observed slugs and target the exact Thai game card instead of opening an incorrectly selected patch station. URI punctuation is percent encoded and fresh visits are checked. Source-card targeting depends on browser support and source rendering; Chrome is tested. The Facebook creator post still requires login, so fresh post contents cannot be certified.

Game covers and team logos are referenced remotely from the existing creator/official-art audit. Unavailable images fall back to text. Missing or questionable logos use team names. The two files in assets/ are the user's supplied banner and logo, copied without editing under the user's instruction to apply that brand. No third-party game or team artwork is mirrored. Reuse permissions remain separate from source identity; this repository does not assert ownership of third-party artwork.

## Hosting

GitHub Pages serves the main branch from `/`, with `.nojekyll`. All stylesheet/script references are relative so the site works under `/thaipatch/`. No build or server runtime is needed.

## Validation

Playwright/Chromium covers desktop 1440×1000, mobile 390×844 and small mobile 320×740 in both color modes. Tests include text contrast, brand asset decoding and unchanged hashes, switching/reloading, system preferences, blocked storage and cross-tab sync. Catalog regression covers search, combined filters, pagination, 14 series slides, duplicate-team/edition links, keyboard focus, removed functionality, unavailable-image fallback, unsafe URL rejection and a real direct click reaching the source game card. The source workspace contains reproducible build/QA scripts and evidence. Online verification is recorded there after deployment; see SOURCE_AUDIT.md for catalog limitations.
