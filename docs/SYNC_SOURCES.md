# Public source synchronization

Current measurement: 2026-10-17. Correct project: rat12-web/thaipatch,
which aggregates other creators' Thai translation releases. thai-rom-cloud
is the owner's separate ROM translation workspace; nothing is imported from
or written to that repository. No Gecko Offline files are part of this work.

The catalog now has **135 records / 133 game-platform groups**. Seven Gayray
records were added only after native source clicks, fresh direct links,
base-ROM edition checks and decoded covers passed. Public evidence:
`evidence/2026-10-17/gayray-review.json`. Cover rights are still unconfirmed;
images remain remote and no ROM/patch bytes were fetched.

| Feed | Source rows | Exact catalog matches | Pending source rows | Synced fields |
| --- | ---: | ---: | ---: | --- |
| Memory Card TH | 163 | 20 | 143 | Patch update date/version |
| Gayray | 15 | 15 | 0 | Patch update date/version |
| NONPLAE | 190 | 1 | 189 | Patch update date/version |
| RetroSpective | 7 | 6 | 1 | Patch update date/version |
| Murphy-TH | 10 | 1 | 9 | Patch update date/version when present |
| Monster แปล | 118 | 24 | 94 | Discovery only: base JSON + live overlay |
| แปลไทยเกมเก่า | 10 | 10 | 0 | Explicit latest patch date/version |
| ROMMEAOW | 5 | 2 | 3 | Explicit version only; no release date inferred |
| 90S Game | 48 | 18 | 30 | Discovery only; no dates or routes changed |
| **Total** | **566** | **97** | **469** | Source rows, not unique games |

The 469 remaining rows include 141 `patch_listed`, 323 `site_listed`,
2 `not_listed_for_download`, 2 `source_disabled` and 1 `release_unconfirmed`.
These states describe source claims, not independently tested artifacts.
Gayray's current 15-game feed is fully represented in the catalog.

All nine adapters passed the live refresh. Every six hours Actions repeats
metadata refresh; failed feeds preserve both prior catalog values and their
candidate queue, marked `sourceState=stale_feed_unavailable`. `lastSeenAt`
remains the last successful observation. Successful feed recovery replaces
stale candidates with the current feed's unmatched rows. Schema validation
runs before catalog changes, so one malformed row cannot partly update that
feed. An all-feed outage leaves the previous report/deployment untouched.

`sourceCoverage` in `.sync/report.json` lists all 17 represented teams:
nine automatic adapters and eight teams still requiring manual review.
Monster and 90S only discover games; ROMMEAOW reads explicit versions;
these capabilities do not imply date synchronization. Dates are always
source-reported patch updates, never import times or file-upload claims.
ROMMEAOW is matched by reviewed GBA identities, preserving both existing
Patch Lab URLs. Pokémon SoulGold GBA is not the NDS edition.

## Remaining source discovery and blockers

Public roots for the remaining teams were inspected on 2026-10-17. No stable
JSON catalog was identified in that bounded root/script inspection for
Happy2you.net, น้องจ๋าแปลที, แมแปว, แมวดำ แปลเกมส์,
แปลไปเล่นไป or INorge Game Stream. This is not proof that no API exists.
น้า_auns555 remains a Facebook/manual source; no login bypass was attempted.

หนีงานมาแปล exposes `/data/projects.json`, discovered from
`/src/home.js` and `/src/data/projects.js`. The response repeats the ID
`pokemon-mystery-dungeon-explorers-of-sky` with conflicting development/ready
states. The creator's own validator rejects duplicate IDs; its homepage also
merges `/api/site-content`. No adapter is enabled until the authoritative
identity/overlay behavior is resolved. Do not choose a duplicate arbitrarily.

The prior source-side exact-Patch blockers remain in
`SOURCE_PATCH_BLOCKERS.md`. Adding discovery adapters does not fix creators'
route selection. The first schedule-triggered seven-feed refresh/deployment
was observed successful: Actions run **39003522358**, head
`2ee12fca90fb33e38ffcf37ea632679c49942914`. That run does not validate the
new nine-feed implementation; its deployment is recorded separately.

## Review gate for another card

1. Confirm exact game, platform, base edition and creator against stable IDs.
2. Click the actual creator card, then verify its direct URL in a fresh page
   selects the same game and exposes the public patch UI. HTTP 200 alone fails
   this gate. Disabled, beta and development states must remain distinct.
3. Decode and visually inspect exact-game artwork; document rights state and
   keep third-party images remote. No ROM archives or patch bytes are needed.
4. Add reviewed metadata to `catalog.json`, rebuild, run affected browser QA,
   then record evidence and Git reference. No automatic candidate publication.

Run `python .sync/test_refresh.py`, `python .sync/refresh.py --check`,
`python tools/build.py --check`, `npm test` and affected `npm run qa:full`.
`node tools/qa-review-gayray.cjs` repeats the seven reviewed source checks
(and any future Gayray candidates). It blocks binary requests and never
submits a file. Screenshots stay under ignored `qa/`.
