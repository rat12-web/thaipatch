# Agent handoff: แปลไทยบอกด้วย · romthai.app

## 2026-10-17 — Multi-source sync continuation

Implementation commit: `5edcb32cb1be44464199069305b69b7cbb5e130b` on `main`.
Seven public feeds were readable in the local real refresh: 509 source rows,
70 exact existing catalog matches, 439 new source rows queued in
`.sync/report.json`. Murphy now uses its canonical domain; Monster แปล's
base JSON and live overlay are merged for discovery; แปลไทยเกมเก่า's
explicit latest patch dates and versions update 10 existing cards. Public
card count remains 128. See `docs/SYNC_SOURCES.md` for feed counts and the
review gate. Candidate counts are source rows, not unique games.

Checks passed: updater fixture tests, live refresh from all seven feeds,
embedded catalog/build checks, offline browser smoke (6 views), date-order
browser QA (3 views), and `git diff --check`. Real navigation/artwork for
the 439 candidates was NOT RUN. No new candidate is published automatically.
Next action: verify actual creator routes, game/edition/team and artwork for
a bounded candidate batch, then add only reviewed cards. Continue adapters
for stable public feeds from the remaining teams. Facebook needs authorized
public access; do not bypass login. No ROMs or patch binaries were fetched.

Live: https://rat12-web.github.io/thaipatch/
Commit: 6c53fa3dff1eda61de8a3f5e862f28e4a5d9ddfd
Status: UI deployed; prior real local/online Chromium Desktop/Mobile/320px QA passed in both themes. Repository-independent continuation milestone passed; see CHECKPOINT.md and evidence/portability/. Full source/rights audit remains partial.

Latest: platform logos use integrated, tinted compact upper-right corner panels; creator logos are lower-left. Sixteen platform frames retain their own color on hover/focus; GBA is purple. Eight creator identity images are available, nine still use names. Thirty-five cover replacements include all thirteen previously empty records. No catalog art is copied locally.

Default sort: latest verified source patch date; newest matching sibling in groups; unknown dates last. 38 verified source-reported update dates, 0 verified uploads and 90 unconfirmed dates. Update/upload labels stay separate; imports/server time/catalog edits are excluded. The pending optional policy question used the stated update-date fallback. GitHub Actions refreshes known exact-matched dates/versions from five sources every six hours; new candidates require route/edition review. Facebook and other sources without adapters are not synchronized. The next agent can obtain missing upload/date evidence; do not guess timestamps.

ROMMEAOW's two links now enter its actual Patch Lab. Source detects the user's ROM or permits manual selection; URL preselection is not claimed. Remaining 22 known exact-Patch blockers: 18 90S, three Murphy, Maewdam DQ III. 90S still selects the wrong default from ?game=...#patch. Keep the measured correct-game card links. SOURCE_PATCH_BLOCKERS.md provides an owner-side integration proposal, NOT APPLIED. Facebook's one post is still login limited.

Data: catalog.json, audits/source-date-audit.csv, audits/source-audit.csv, audits/cover-audit.csv, teams.json, audits/team-audit.csv, platforms.json and audits/deeplinks-90s.csv. Reuse stable IDs and existing evidence. The next agent can handle missing dates, identities, rights, source-owner coordination, versions and wording. Owner visual acceptance remains pending. romthai.app is the brand; actual site URL is unchanged.

NEXT_ACTION_OWNER: ACTIVE_REPOSITORY_AGENT


## Repository independence milestone — 2026-10-13

The current source has been extracted into src/ and tools/build.py builds exclusively from this checkout. Root catalog.json/teams.json/platforms.json are canonical; the old baseline HTML and Windows workspace paths are unnecessary. Four original browser QA suites are portable under tools/; npm test adds an explicitly offline smoke check. Read AGENT_START.md and AGENTS.md for setup and working rules. Public audit CSVs and prior successful QA projections are in audits/ and evidence/previous/. BASELINE_REVIEW.md preserves the original ZIP hash/history without publishing old ROM/patcher code or raw reference caches.

Agent conversation history is replaced by these checked-in decisions and tasks, not transferred automatically to another product. Individual agent products remain untested. Clean isolated build/check and fresh dependency install passed. All four real browser suites and the offline smoke passed from the isolated copy (3/6/6/3/6 views). No vendor agent application was invoked. Linux bundled-Chromium CI and Pages deployment passed at https://github.com/rat12-web/thaipatch/actions/runs/38393194631; live commit matched 407ba41c0f867c6b9a12cc2dd38e0db87596ddf8. Fresh GitHub clone regeneration also passed. NEXT ACTION: choose a TASKS.md batch; no further originating Chat work is required. Next data priorities are listed in TASKS.md.
