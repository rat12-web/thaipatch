# Source audit summary

## 2026-10-13 platform/card and Patch update

The latest request removes the upper-left platform overlay, moves real console logos outside the cover, adds platform frames, displays available creator logos/profile images and fills missing covers. Eight working team identity images are published in teams.json. The inherited NeeNganMaPlae SVG fails to decode and remains a candidate rather than a fabricated replacement. Nine teams still have no usable confirmed identity image. Sixteen console logos are checked; Genesis uses the exact SEGA console logo from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Sega_genesis_logo.svg). Original logo colors are retained.

Cached creator manifests are reused for cover selection, with targeted follow-up only on failed/unresolved images. Thirty-five primary images changed; thirteen empty covers are filled; all 128 records have an actually decoded exact-game candidate. Eighty-five use creator/team-hosted images, the rest use game art from the existing audit/archive. Related base-game alternatives are marked as such. Art identity/decoding does not establish republication rights; no catalog artwork is copied locally. Cover, team and platform provenance is preserved in public JSON and the continuation workspace's audit CSVs.

ROMMEAOW's two entries now open its visible #patch Lab directly, confirmed by a native catalog click. Game identification happens at the source using the user's own ROM or manual selection. Twenty-two exact-Patch links remain blocked by source-side URL support: 18 90S, three Murphy, and Maewdam DQ III. A fresh ?game=firered-th#patch visit still selected the wrong game on 90S; its current code has no query handler. Murphy uses a click-only Patch flow; Maewdam's previous measured game-card route remains unchanged. An owner-side integration proposal is recorded in SOURCE_PATCH_BLOCKERS.md in the continuation workspace, NOT applied to another team's site. No local ROM patcher, proxy or cross-origin controller is added.

Evidence: qa/upgrade/discovery.json, asset-decode.json, failure-followup.json, cards.json and live-cards.json. The historical route survey below is retained as history; current source-card count is 22, with two verified Patch Lab routes.

Baseline: provided ThaiPatch_WORK_READY_v0.29 archive; all 41 archive manifest entries verified before continuation. Current catalog omits only the synthetic IPS demo: 128 patch records, 126 grouped games.

Fresh critical-page evidence from 2026-10-12:

- DQ V JP: `patch.html?game=dq5-jp` selected `dq5-jp`.
- DQ V EN: `patch.html?game=dq5` selected `dq5`.
- RetroSpective Emerald: `#game/pekeemerald` opened the visible Pokémon Emerald TH modal.
- Memory Card TH Metal Gear Solid: fresh patch station identified the game and USA Rev 1 Disc 1/2 baseline.
- 90S Game: all 18 catalog option slugs observed. 17 fresh visits selected the wrong default game; the first game's matching default is inconclusive. FireRed also failed selection after an additional 8-second wait. Preserve the original query URLs but show manual-selection guidance, with no claim that all links automatically select the game.

## Direct-source correction

On 2026-10-12 the user rejected the intermediate ThaiPatch detail step and unresolved directory links. Single-team cards are now native source anchors; only multi-team/edition games show a chooser.

Fresh source work verified 63 game permalink/selected-title routes across Memory Card TH, Monster, the old-game translation team, Maepaew, NONPLAE, RetroSpective and Initial D's actual `/games/18` page. The dedicated Rudra site is verified separately. Existing confirmed source audits are preserved.

24 sources without a working game URL handler are targeted at their actual named source cards: 18 90S, three Murphy, two ROMMEAOW and Dragon Quest III at Maewdam. Native text fragments/observed anchors replace directory links; the title's actual viewport position is recorded from fresh Chromium visits. This targets the creator's card rather than automatically selecting a patch. Full-title punctuation must be encoded, especially hyphens and exclamation marks. No cross-origin script injection, copied creator website, backend proxy, or bookmarklet is used.

Facebook's creator share-post URL remains unchanged from the original audit. The fresh anonymous visit reached a Facebook login page; post contents were not verified without login. Owner artwork permissions remain distinct from route verification.

Evidence is retained in the continuation workspace under qa/routes/verified-routes.json, targeted-routes.json, retry-routes.json and route-changes.csv. catalog.json records the actual method, evidence and checked date in sourceLocation/sourceAudit. Earlier 90S automatic-selection results above are historical; current links target source game cards.

Source/identity audits already confirmed were reused. Inferred and directory routes remain labeled; no repeated whole-catalog web survey. Original sourceAudit metadata, prior verification and image source/rights states remain in catalog.json. Some evidence paths refer to the private/local continuation workspace, not files published here.

Remote covers and logos are not mirrored. Known source imagery can change or stop loading; the UI falls back to text. Attribution is distinct from permission to republish a copy. Remaining data/rights/logo decisions are preserved in the continuation workspace's CHECKPOINT.md and WORK_TO_CHAT.md.
