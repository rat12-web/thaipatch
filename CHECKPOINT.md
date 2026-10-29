## 2026-10-29 — Playtime sort, front-page recent updates and reviewed catalog additions

Owner: Active Repository Agent (Antigravity); branch `task/playtime-catalog-updates`.

Catalog: 144 entries / 142 game-platform groups (expanded from 135 entries).
Added 9 verified games with exact deeplinks, decoded covers, and verified patch dates:
1. เกเรแปลไทย (SFC/SNES, 3 games): `gayray-sync-treasure-hunter-g-sfc` (Treasure Hunter G), `gayray-sync-zero-4-champ-rr-z-sfc` (Zero 4 Champ RR-Z), `gayray-sync-bushi-seiryuuden-sfc` (Bushi Seiryuuden - Futari no Yuusha). เกเรแปลไทย is now 18/18 matched (100%).
2. Memory Card TH (PS1/PS2, 6 games): `ext-041` (Kamen Rider: Seigi no Keifu), `ext-042` (Mega Man Legends), `ext-043` (Chocobo Racing), `ext-044` (Tenchu: Stealth Assassins), `ext-045` (Wild Arms 2), `ext-046` (God of War). Memory Card TH exact matches increased from 20 to 26.

Features implemented:
1. Sort by Play Time: added `playtime` (เวลาเล่น สั้นไปยาว) and `playtime_desc` (เวลาเล่น ยาวไปสั้น) in `#sortSelect`. Added `playTimeHours` across all catalog entries derived from HowLongToBeat Main Story retro game averages, and rendered playtime tag (`⏱️ ~X ชม.`) in game card metadata.
2. Front-page Recent Updates: added `#recentUpdatesSection` and dynamic `renderRecentUpdates()` showing recent updates from yesterday and this week (e.g. Bushi Seiryuuden, Zero 4 Champ RR-Z, Kamen Rider Seigi no Keifu, Onimusha 2, Final Fantasy IX), displaying game title, console platform, translator team, update/patch details, and timestamp. Fully responsive for 1440px, 390px, and 320px viewports.

Verification:
- `python tools/build.py --check`: PASS (repository-only build matches generated artifacts)
- `python .sync/test_refresh.py`: PASS (updater fixtures and exact match validation)
- `python .sync/refresh.py --check`: PASS (catalog and embedded data agree)
- `python .sync/refresh.py`: PASS (all 9 feeds ok; Gayray 18/18 matched, Memory Card TH 26/182 matched)
- `npm test`: PASS (offline UI smoke across 6 responsive views in light/dark themes)
- Evidence recorded in `evidence/2026-10-29/reviewed-additions.json`.

---

## 2026-10-17 — Correct repository, reviewed additions and nine-source sync

Owner: Codex; repository rat12-web/thaipatch; branch codex/complete-catalog-sync.
This is the aggregation catalog requested by the owner. thai-rom-cloud is
separate personal translation work; Gecko Offline and thai-rom-cloud were
not changed. Implementation SHA: 8b9c7a1; PR #1 https://github.com/rat12-web/thaipatch/pull/1.
Later documentation-only commits do not change the tested catalog/app.

Catalog: 135 entries / 133 game-platform groups. Added seven verified Gayray
records, all with prefix gayray-sync-: dokapon-monster-hunter-usa,
knight-gundam-monogatari-fc, jojo-no-kimyou-na-bouken-sfc,
rockman-and-forte-sfc, akumajou-special-boku-dracula-kun-fc,
torneko-no-daibouken-sfc and yoshis-island-sfc. Gayray is now 15/15 matched.
Base editions distinguish the English translation prerequisites of JoJo and
Rockman & Forte; stable IDs of existing records and their source links stay intact.

Added ROMMEAOW version-only and 90S discovery-only adapters. Live refresh:
9/9 sources readable, 566 source rows, 97 exact matches, 469 pending source
rows (not unique games). No guessed dates or new unreviewed routes. Source
coverage lists 9 automatic / 8 manual teams. Failed feeds now retain pending
candidates marked stale; malformed feeds are rejected before changes.

Evidence: evidence/2026-10-17/gayray-review.json and docs/SYNC_SOURCES.md.
Seven source checks PASS: native clicks, fresh direct game URLs, correct
source ROM identity and decoded covers. No ROM/patch bytes or file uploads.
Updater/build checks PASS; offline smoke 6/6, chronology 3/3, catalog 3/3,
themes 6/6 PASS. Platform/cover suite 6/6 PASS (all 16 platform logos on desktop,
creator-logo/error/fallback behavior and native ROMMEAOW Patch Lab click).
Final summary: evidence/2026-10-17/validation.json. Added read-only PR CI
for build/updater/data/offline-smoke checks before integration. Initial platform run correctly failed on missing
coverAlternatives in new records; fixed metadata and rebuilt before retest.

An early review test filled search before async source loading registered its
listener: one case passed, next timed out. Added a real grid-ready wait;
all seven then passed. One PowerShell quoting attempt failed before mutation;
used a saved script. A raw urllib request without the updater User-Agent got
403; existing public-metadata fetch and real Chrome both succeeded. No bypass.

Limits: 469 candidate rows and eight manual teams remain; complete all-source
acceptance is not claimed. Public metadata does not certify patch application,
ROM emulation or cover licensing. Existing 22 exact-Patch source-side blockers
remain. หนีงานมาแปล's discovered projects feed has duplicate conflicting IDs;
its own validator rejects them, so no guessed merge/adapter was enabled.
Earlier seven-feed scheduled run 39003522358 succeeded; new deployment must
be checked separately. No new domain, backend or translation engine.

Next exact start: inspect .sync/report.json sourceCoverage and patch_listed
candidates; review Memory Card TH's pending records in bounded batches,
then add only confirmed game/platform/edition/source/artwork records. Resolve
หนีงานมาแปล's authoritative duplicate/overlay behavior before adding an adapter.
See docs/SYNC_SOURCES.md for remaining discovery evidence and review gates.

---

Historical checkpoints below retain the counts measured at those revisions.

# Repository-independent continuation checkpoint

## 2026-10-17 sync checkpoint

The seven-feed sync implementation is at commit
`5edcb32cb1be44464199069305b69b7cbb5e130b`. A real local refresh read
all seven feeds (509 rows), exact-matched 70 existing records and queued 439
unreviewed source rows. Ten existing แปลไทยเกมเก่า records gained explicit
source-reported latest patch date/version metadata. The public card count is
still 128; no newly discovered game was automatically published.

PASS: `.sync/test_refresh.py`, live `.sync/refresh.py`, `--check`,
`tools/build.py --check`, six offline Chrome smoke views and three Chrome
date-order views. The date QA now derives expected verified counts from the
catalog, so future legitimate source updates do not break a fixed-count
assertion. `docs/SYNC_SOURCES.md` records coverage and review requirements.
NOT RUN: fresh route, edition, cover and rights checks for the candidate
queue; remaining teams' feed adapter discovery. These gates still block a
claim that all Thai patch games are published or verified.

Date: 2026-10-13. Status: isolated repository build, portable browser checks, Linux CI and Pages deployment PASS. Complete source/rights acceptance remains PARTIAL.

Site: https://rat12-web.github.io/thaipatch/
Repository: https://github.com/rat12-web/thaipatch
Original published UI/reference commit: 6c53fa3dff1eda61de8a3f5e862f28e4a5d9ddfd
Repository independence validated code commit: 407ba41c0f867c6b9a12cc2dd38e0db87596ddf8
Current milestone commit: identify through git log (the checkpoint is committed with the changes).

## Result

- Reused the deployed implementation; extracted current core into src/core.js and retained existing templates and CSS. tools/build.py uses only this checkout, canonical catalog.json/teams.json/platforms.json and user brand assets. No old ZIP, baseline HTML, ChatGPT session or Windows workspace path is required.
- Added AGENTS.md, AGENT_START.md, CLAUDE.md pointer, WORK_TO_AGENT.md and TASKS.md for shared instructions, accepted decisions and pending work. Private conversations/hidden agent memories are not transferred; the checked-in project summary enables continuation.
- All four original catalog/theme/platform/date QA suites now use npm Playwright and optional PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH. Added offline browser smoke and local static server. package-lock.json pins dependencies. CI installs bundled Chromium on Linux, checks generated build, updater tests and offline smoke before publishing.
- Public audit CSVs and selected source/route/decoder evidence are retained under audits/ and evidence/. audits/PROVENANCE_INDEX.json maps historical workspace paths to preserved public projections or explicit omissions. Raw remote JS/manifests, response bodies, original patcher/ROM archives, synced project files and private caches are excluded.
- UI/data behavior preserved: 128 entries / 126 groups; 14 series slides; source navigation/duplicate chooser; compact console upper-right, creator lower-left; GBA purple and platform colors; light/dark modes; no TESTED/route-status labels. No catalog ROM patcher/votes/uploads/backend.
- Existing six-hour metadata updater preserved: five feeds, 36 current exact matches; new games need route/edition review; Facebook remains manual. Real manual server refresh/deploy previously passed at https://github.com/rat12-web/thaipatch/actions/runs/38388029187 . First timed invocation not yet observed.

## Verification

An isolated copy excluded .git, node_modules, qa and all workspace baseline/tools. Fresh npm ci and repository-only build/check passed. Updater failure/edition/date tests passed. The preserved browser suites passed using installed Chrome via the documented environment override: catalog 3 views, themes 6, platforms 6, source chronology 3. Offline smoke passed 6 views; external image requests were deliberately aborted, so it is not artwork/source-route certification. Reports: evidence/portability/*.json.

Public text scan found no credential signatures or hardcoded executable paths in src/tools. This is a targeted publication check, not a comprehensive security audit. Third-party artwork stays remote; local assets are only the user's supplied brand images. Individual Claude Code/Antigravity/ZCode/T3/Hermes integrations were NOT RUN.

Linux bundled-Chromium installation, repository build check, updater tests, offline browser smoke and Pages deploy passed: https://github.com/rat12-web/thaipatch/actions/runs/38393194631. The live deployment.json matched the validated code commit. A fresh GitHub clone rebuilt all five generated files exactly (normalized text) after deleting them; no workspace source was present. Evidence: evidence/portability/linux-ci.json, live-deployment.json and summary.json. Later documentation-only commits do not change this validated implementation; identify current HEAD through Git.

## Remaining blockers / next action

22 known source-side exact-Patch blockers, nine creator identity images/rights, 90 unconfirmed dates and zero verified file-upload timestamps remain. See TASKS.md and SOURCE_PATCH_BLOCKERS.md. New source candidates remain pending actual route and edition checks.

NEXT_ACTION_OWNER: ACTIVE_REPOSITORY_AGENT. Read AGENT_START.md and choose the next TASKS.md batch; keep checkpoint, evidence and Git commits as shared state.
