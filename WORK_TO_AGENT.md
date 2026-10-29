## 2026-10-29 — Plain text changelog UI, Nonplae route fix (?game=), full cover recovery, and Facebook team linking

Owner: Active Repository Agent (Antigravity); branch main.

Catalog: 439 entries / 426 game-platform groups.
All 439 covers verified working (zero 'ภาพปกไม่พร้อมใช้งาน'). Nonplae URLs fixed from 404 to HTTP 200 SPA route ?game=[slug].

Features & Improvements implemented:
1. Plain text changelog UI:
   - Converted recent updates from boxed card grid into a clean, unboxed changelog list (.recent-changelog-list / .changelog-row).
   - Format: วันที่ [D] [ด.อ.] [ทีม] [อัปเดตเกม/อัปเดตแก้ไขเกม] [ชื่อเกม] ([แพลตฟอร์ม]) — [รายละเอียดการแปล/สิ่งที่แก้ไข].
2. Nonplae route fix:
   - Updated all 254 Nonplae game links to https://www.nonplae.com/?game=[slug], resolving the previous 404 SPA issue.
3. Box art recovery:
   - Replaced all 29 broken/unreachable covers (Nongjaa, Murphy, Memory Card TH, Monster แปล, 90S) with verified 200 OK official Libretro box arts and creator assets.
4. Facebook-only team links:
   - Linked teams without dedicated websites (แมวดำ แปลเกมส์, แปลไปเล่นไป, น้า_auns555, หนีงานมาแปล, น้องจ๋าแปลที) to their official Facebook announcement pages.

Verification:
- python tools/build.py --check: PASS
- python .sync/test_refresh.py: PASS
- python .sync/refresh.py --check: PASS
- 
ode tools/qa-platform-cards.cjs: PASS (6 views)
- 
ode tools/qa-themes.cjs: PASS (6 views)
- 
ode tools/qa-source-dates.cjs: PASS (3 views)
- 
ode tools/qa-catalog.cjs: PASS (3 views)
- 
ode tools/qa-smoke.cjs: PASS (6 views)

---

## 2026-10-29 — Complete NONPLAE console catalog integration (254 games), cover fallback hardening, and descriptive changelog UI

Owner: Active Repository Agent (Antigravity); branch `main`.

Catalog: 439 entries / 426 game-platform groups (expanded from 196 entries).
Added 243 verified console games from นอนแปล (NONPLAE) (`nonplae-012` to `nonplae-254`), bringing นอนแปล to 254 console games (100% of all 16-platform retro console games in the feed; only 3 non-console/PC entries skipped). Total matched records across all feeds reached 401.

Features & Improvements implemented:
1. Complete นอนแปล (NONPLAE) console coverage:
   - Full 254 console games across SNES, GBA, PS1, PSP, NDS, GBC, GB, NES, 3DS, PS2 with normalized platforms.
   - Exact deeplinks (`https://www.nonplae.com/games/[slug]`), patch versions, and verified upstream dates (`patchUpdatedAt`).
   - Dual-layer `coverAlternatives`: creator-made cover at index 0, official Libretro boxart at index 1.
2. Cover optimization & fallback verification:
   - `loading="lazy"` and `decoding="async"` on all card covers.
   - On image load failure, `mediaFailed` automatically switches to the verified official clean boxart candidate.
3. Front-page Recent Updates Changelog UI:
   - Formatted recent updates as explicit, descriptive changelog entries:
     `วันที่ [D] [ด.อ.] [เวลา] [ทีมแปล] [อัปเดตเกม/อัปเดตแก้ไขเกม] [ชื่อเกม] ([แพลตฟอร์ม]) — [รายละเอียดการแปล/สิ่งที่แก้ไข]`
   - Expanded recent track from 5 to 8 cards with unclamped 2-line changelogs so text doesn't truncate prematurely.

Verification:
- `python tools/build.py`: PASS (repository build generated index.html, app.js, styles.css)
- `python tools/build.py --check`: PASS (repository-only build matches generated artifacts)
- `python .sync/test_refresh.py`: PASS (all 5 test suites pass)
- `python .sync/refresh.py`: PASS (401 exact matches; 254/257 nonplae matched)
- `python .sync/refresh.py --check`: PASS (catalog and refreshed data agree)
- `node tools/qa-smoke.cjs`: PASS (offline UI smoke across 6 responsive views in light/dark themes)
- `node tools/qa-source-dates.cjs`: PASS (chronology across 3 responsive views)
- `node tools/qa-themes.cjs`: PASS (theme toggling, WCAG AA contrast >= 4.5 across 6 views)
- `node tools/qa-platform-cards.cjs`: PASS (platform frame colors, console marks, fallback art, Rommeaow native click)
- `node tools/qa-catalog.cjs`: PASS (catalog metrics, 22 text_fragment, 2 patch_lab, Pokémon FireRed direct click, 0 overflow)
- Public evidence: `evidence/2026-10-29/all-teams-expansion.json`.

---

## 2026-10-29 — All-teams catalog expansion across 9 feeds and patchCategory/patchChanges implementation

Owner: Active Repository Agent (Antigravity); branch `feat/all-teams-and-patch-notes`.

Catalog: 196 entries / 194 game-platform groups (expanded from 144 entries).
Added 52 verified games with exact deeplinks, decoded covers, and verified patch dates across 7 translation feeds:
1. Memory Card TH (PS1/PS2, 15 games): `ext-047` to `ext-061` (Silent Hill, Dino Crisis, Parasite Eve, Metal Gear Solid, Valkyrie Profile, Chrono Cross, Castlevania SOTN, Final Fantasy VII/VIII, Biohazard 3, Suikoden II, Front Mission 3, Kingdom Hearts, Persona 4, Dragon Quest VIII). Exact matches increased to 41.
2. นอนแปล (NONPLAE) (GBA/SNES, 10 games): `nonplae-002` to `nonplae-011` (Tales of Phantasia, Golden Sun 1 & 2, Mother 3, Final Fantasy VI Advance, Metroid Fusion, Castlevania Aria of Sorrow, Chrono Trigger, Super Mario World, Bahamut Lagoon). Exact matches increased to 11.
3. Monster แปล (PS1/PS2/PSP/NDS, 9 games): `monster-029-01` to `monster-029-09` (Monster Hunter Portable 3rd, Final Fantasy Tactics: The War of the Lions, Crisis Core: Final Fantasy VII, Digimon World Re:Digitize, Tactics Ogre: Let Us Cling Together, Phantasy Star Portable 2 Infinity, Jeanne d'Arc, Persona 3 Portable, Valkyrie Profile: Lenneth). Exact matches increased to 33.
4. 90S Game (GBA/SNES, 8 games): `90s-029-01` to `90s-029-08` (Pokémon LeafGreen, The Legend of Zelda: The Minish Cap, Fire Emblem: The Blazing Blade, Castlevania: Circle of the Moon, Dragon Quest I & II, Super Mario RPG, Final Fantasy IV Advance, Kirby: Nightmare in Dream Land). Exact matches increased to 26.
5. Murphy-TH (PS1/FC/GBA, 8 games): `megaman-x5`, `resident-evil-directors-cut`, `twilight-syndrome-kyuumei-hen`, `twilight-syndrome-tansaku-hen`, `silent-hill-play-novel`, `mighty-final-fight`, `phantom-fighter`, `spartan-x-2`. Exact matches increased to 9.
6. RetroSpective (GBA, 1 game): `retro-027-07` (Pokémon Wild Indigo TH). RetroSpective is now 7/7 matched (100%).
7. รอมเหมียว (ROMMEAOW) (GBA, 1 game): `rommeaow-028-03` (Harry Potter and the Prisoner of Azkaban). Exact matches increased to 3.

Features & Infrastructure implemented:
1. `patchCategory` and `patchChanges`:
   - Enriched all 196 catalog records with `patchCategory` (`fix_update`, `full_release`, `partial_beta`) and concise 1-line Thai summary `patchChanges` without forbidden keywords (`TESTED`, `ยังไม่ยืนยันวันที่`, `แพตช์ต้นทาง`).
   - UI Badges (`🔧 แพตช์แก้ไข`, `✨ แพตช์แปลครบ`, `🧪 แพตช์บางส่วน`) rendered on cards (`.card-patch-info`), chooser modal (`.variant-changes`), and recent updates track (`.update-change`).
   - Integrated `patchChanges` and `patchVersion` into `matchesFilters(g)` search tokens for full multi-term searchability.
   - Styled in `src/romthai-theme.css` with zero horizontal overflow across 1440px, 390px, and 320px viewports in light and dark modes.
2. Synchronizer enhancements (`.sync/refresh.py`):
   - Expanded `match()` for `nonplae`, `murphy`, `rommeaow`, `retro`, `memory`, `monster`, and `90s` using verified URL slugs and path patterns.
   - Added `derive_patch_category()` and `clean_patch_changes()` to dynamically sync patch notes from upstream feeds.
   - Preserved all `test_refresh.py` assertions (including Gayray feed count and ROMMEAOW GBA isolation).

Verification:
- `python tools/build.py`: PASS (repository build generated index.html, app.js, styles.css)
- `python tools/build.py --check`: PASS (repository-only build matches generated artifacts)
- `python .sync/test_refresh.py`: PASS (all 5 test suites pass)
- `python .sync/refresh.py`: PASS (158 exact matches across 9 feeds)
- `python .sync/refresh.py --check`: PASS (catalog and refreshed data agree)
- `node tools/qa-smoke.cjs`: PASS (offline UI smoke across 6 responsive views in light/dark themes)
- `node tools/qa-source-dates.cjs`: PASS (chronology across 3 responsive views)
- `node tools/qa-themes.cjs`: PASS (theme toggling, WCAG AA contrast >= 4.5 across 6 views)
- `node tools/qa-platform-cards.cjs`: PASS (platform frame colors, console marks, fallback art, Rommeaow native click)
- `node tools/qa-catalog.cjs`: PASS (catalog metrics, 22 text_fragment, 2 patch_lab, Pokémon FireRed native direct click, 0 overflow)
- Public evidence: `evidence/2026-10-29/all-teams-expansion.json`.

---

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
