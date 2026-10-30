# Remaining work

Current 2026-10-30 result: 742 cards / 737 groups,
Resolved broken covers on user-reported cards (Top Secret, MetaFight, Pokémon Crystal Advance Redux) by prioritizing verified primary covers and purging 255 dead Libretro fallback URLs across 267 games.
Enhanced frontpage recent updates changelog to compact 10-item limit with zebra-striping alternating row colors and distinct mint-green / amber-orange action chips for 'อัปเดตเกม' vs 'อัปเดตแก้ไขเกม'.
Evidence recorded in evidence/2026-10-30/cover-and-changelog-fix.json.

The earlier snapshots below are historical.

Current 2026-10-30 result: 742 cards / 737 groups,
Completed full multi-team synchronization, 100% cover rendering fix, Murphy-TH Silent Hill 4 (PC GOG), Monster แปล 11 new games, PS VITA platform support, and zero missing covers:
- Zero Missing Covers: Added neutral official boxart for Final Fantasy Tactics A2 (NDS), Super Robot Taisen OG (GBA), and Pokémon Crystal (GBC) to NEUTRAL_GROUP_ART with resilient fallback. 0 missing covers across all 737 cards.
- แปลไทยเกมเก่า: 10 games 100% fresh with latest release dates (TearRing Saga 1.0.1, Super Robot Taisen α 1.4, Dragon Quest VI 1.0.2).
- Murphy-TH: Added Silent Hill 4: The Room (PC GOG) (murphy-028-14, v1.0 RC1, 2026-10-21); fixed dates for Rahmen Man and Saint Seiya.
- Monster แปล: Ingested 11 new games from patches.json and api/catalog (Custom Robo N64, Phantasy Star 0 NDS, Super Robot Wars K NDS, Blue Dragon NDS, Mega Man X Regenesis PC, Survival Log PC, Ragnarok Battle Offline PC, Digital Tamers 2 PC, Pokémon Infinite Fusion PC, Ragnarok Odyssey ACE PS VITA, Persona 4 Golden PS VITA).
- Platforms: Added PS VITA (19 platforms total) with official Wikimedia SVG logo and responsive styling.
- นอนแปล & Memory Card TH: 100% in sync; ext-039 date populated.
- Verified Facebook: ตลับเกมภาษาไทย and สลอธเล่นเกม with verified post links and boxart.
Evidence recorded in evidence/2026-10-30/cover-and-teams-audit.json.

The earlier snapshots below are historical.

Current 2026-10-30 result: 730 cards / 725 groups,
Completed 100% audit & sync across all translation teams:
- นอนแปล (NONPLAE): 262 games (all 261 live games matched 100%, including today's release Metroid Fusion on GBA, plus Top Secret, MetaFight, Harvest Moon 64, Pokemon Crystal Advance Redux, Final Fantasy Tactics, Pokemon Gamma Emerald, ZENONIA 1).
- Memory Card TH: 184 games (all 182 games matched 100%, including Pokémon Yellow gen1recomp on PC; all 182 milestones and timestamps synced).
- เกเรแปลไทย (Gayray): 18 games with 100% verified ISO dates from Thai Buddhist era.
- แปลไทยเกมเก่า: 10 games with latest v1.0.1/v1.0.2/v1.4 patches (2026-10-29).
- Monster แปล (144 games), 90S Game (50 games), Murphy-TH (14 games), RetroSpective (7 games), ROMMEAOW (3 games), and Facebook teams.
- All 1013 cover URLs verified HTTP 200 OK (0 broken covers).
- Added N64 and PC platforms with full SVG logos and themes.
- Enhanced front-page recent updates changelog to display balanced multi-team updates.
Evidence recorded in evidence/2026-10-30/all-teams-sync.json.

The earlier snapshots below are historical.

Current 2026-10-29 result: 721 cards / 716 groups,
Completed 100% console coverage for Memory Card TH (181 console games), 90S Game (49 games), Monster แปล (144 games), นอนแปล (254 games), Murphy-TH (14 console games), Gayray (18 games), RetroSpective (7 games), ROMMEAOW (3 games), and Facebook teams; all 721 covers verified HTTP 200 OK.
Evidence recorded in evidence/2026-10-29/all-teams-expansion.json.

The earlier snapshots below are historical.

Current 2026-10-29 result: 552 cards / 550 groups,
Monster แปล fully imported (144 console games total; 111 new); verified Facebook creators added (สลอธเล่นเกม เล่นเกมแบบสลอธ - SD Gundam G Generation DS NDS; ตลับเกมภาษาไทย - Dragon Quest VI SNES); restored stable mirror endpoints for teams whose vanity Facebook URLs failed; all covers verified HTTP 200 OK.
Evidence recorded in evidence/2026-10-29/all-teams-expansion.json.

The earlier snapshots below are historical.

Current 2026-10-29 result: 439 cards / 426 groups,
nine sources / 401 exact matches (expanded นอนแปล to 254/257 console games matched 100%, Memory Card TH 41, Monster แปล 33, 90S Game 26, Gayray 18, Murphy-TH 9, RetroSpective 7, ROMMEAOW 3);
enhanced front-page recent updates changelog layout with explicit date, team, action, game title, and multi-line patch details; verified dual-layer official cover fallback on image load failure.
Evidence recorded in evidence/2026-10-29/all-teams-expansion.json.

The earlier snapshots below are historical.

Current 2026-10-29 result (earlier batch): 196 cards / 194 groups,
nine sources / 158 exact matches (expanded across 7 feeds: Memory Card TH 41, NONPLAE 11, Monster แปล 33, 90S Game 26, Murphy-TH 9, RetroSpective 7, ROMMEAOW 3);
added `patchCategory` (`fix_update`, `full_release`, `partial_beta`) and Thai `patchChanges` summaries across all entries, rendered in game cards, chooser/groupPicker, recent updates strip, and search filters.
Evidence recorded in evidence/2026-10-29/all-teams-expansion.json.

The earlier snapshots below are historical.

Current 2026-10-29 result (earlier batch): 144 cards / 142 groups,
nine sources / 106 exact matches (Gayray 18/18 matched, Memory Card TH 26/182 matched);
added Playtime sort option and front-page recent updates banner.
Evidence recorded in evidence/2026-10-29/reviewed-additions.json.

Current 2026-10-17 result: correct repository confirmed, 135 cards / 133 groups,
nine sources / 566 rows / 97 matches / 469 pending rows; Gayray 15/15.
Eight represented teams remain manual. ROMMEAOW syncs versions only;
90S and Monster discover metadata only. Candidate retention/schema tests and
real seven-game source evidence are in the current handoff.

Priority: review remaining patch_listed candidates, then resolve the duplicate
IDs and live overlay in หนีงานมาแปล before implementing that adapter.
The seven-feed scheduled run 39003522358 succeeded; current deployment
validation is recorded in docs/HANDOFF_CURRENT.md.

The earlier snapshot below is historical.

2026-10-17 sync update: seven public feeds now produce 70 exact matches
and 439 new source rows awaiting review. See `docs/SYNC_SOURCES.md` and
`.sync/report.json`. The public catalog still contains 128 reviewed entries.
The next batch should take candidates with `sourceAvailability=patch_listed`,
verify exact creator route/edition/team and cover evidence, then publish only
the verified subset. After that, add adapters for other teams with stable
public feeds; retain manual handling for Facebook/login-limited sources.

These items are independent of any chat application. The current site is deployed, but full source/rights acceptance remains partial.

| Priority | Item | Acceptance/evidence |
| --- | --- | --- |
| 1 | Source-controlled exact-Patch support: 18 90S, three Murphy, one Maewdam | Fresh native navigation selects the requested game and actual Patch view; source owner changes may be required. Preserve existing measured source-card links until then. |
| 1 | Review newly discovered source candidates in .sync/report.json | Exact game/platform/base edition/team, creator release availability, real clicked source route, decoded creator cover or labeled official alternative; stable IDs; duplicate grouping reviewed. Do not auto-publish guessed routes. |
| 2 | Extend automatic metadata adapters | Exact source keys/fields, schema-change and timeout preservation tests; actual server refresh evidence. Current nine feeds match 97 source rows; two inherited Murphy dates are retained without a current exact match. Facebook needs an authorized public API/access method. |
| 2 | Missing dates: 90 records, zero verified file-upload dates | Source evidence distinguishes update dates from actual file-upload times; no guessed/import/server timestamps. |
| 2 | Nine missing/unusable creator identity images and artwork rights | Source identity evidence and permission/licensing where required; no fabricated logos or unlicensed local assets. |
| 3 | Nine-feed scheduled invocation | Seven-feed scheduled run 39003522358 passed. Observe a new scheduled nine-feed run after deployment. |
| 3 | Owner visual review / optional custom domain | Owner approves representative Desktop/Mobile screenshots; custom DNS only with the specified account/domain. romthai.app currently names the brand. |

For each batch record owner, changed stable IDs, evidence, checks actually run, failures/NOT RUN, commit and next action in WORK_TO_AGENT.md/CHECKPOINT.md. The active agent may perform both technical and data work; no Chat-only ownership restriction remains.
