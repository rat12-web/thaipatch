# Public source synchronization

Status as of 2026-10-17. This catalog links to creators' pages; it does not
download ROMs or publish patch binaries. `.sync/refresh.py` reads public
metadata only and never executes source JavaScript.

| Feed | Current rows | Exact catalog matches | New source rows pending review | Synced fields |
| --- | ---: | ---: | ---: | --- |
| Memory Card TH | 162 | 20 | 142 | Patch update date and version |
| Gayray | 15 | 8 | 7 | Patch update date and version |
| NONPLAE | 188 | 1 | 187 | Patch update date and version |
| RetroSpective | 7 | 6 | 1 | Patch update date and version |
| Murphy-TH | 10 | 1 | 9 | Patch update date and version when present |
| Monster แปล | 117 | 24 | 93 | Discovery only; base JSON plus live overlay |
| แปลไทยเกมเก่า | 10 | 10 | 0 | Explicit latest patch date and version |
| **Total source rows** | **509** | **70** | **439** | Counts are source rows, not unique games |

The Murphy feed uses its current canonical domain. The Monster adapter merges
the public base and overlay records, including hidden and replaced entries,
without evaluating the site's JavaScript. If either endpoint fails or the
overlay schema changes, the feed fails closed and prior catalog data remains.
The แปลไทยเกมเก่า adapter requires all explicitly latest variants of one game
to agree on date and version before updating its one catalog record.

`.sync/report.json` is the candidate queue. `sourceAvailability` summarizes
what a source advertises; it does not verify that a specific patch works or
that a URL selects the correct game. Current queue: 147 `patch_listed`, 289
`site_listed`, 2 `not_listed_for_download`, and 1 `release_unconfirmed`.
Candidates can repeat the same game across teams or editions. No candidate
becomes a public card automatically.

## Review gate for a new card

1. Confirm the exact game, platform, source edition, and translating team.
   Compare against existing stable IDs and duplicate groups.
2. Open the creator route in a fresh browser and verify that it selects this
   game and leads to the actual public patch flow. An HTTP 200 or a plausible
   URL alone is insufficient.
3. Confirm the creator currently exposes the patch. Preserve disabled, hidden,
   beta, and unreleased distinctions. Do not link directly to ROM archives.
4. Inspect the cover source, exact-game identity, rendering, and rights state.
   Do not copy third-party artwork into this repository without permission.
5. Add the card to `catalog.json` with a stable ID and evidence, rebuild with
   `python tools/build.py`, run affected browser QA, and record the result.

Sources already represented by static catalog cards but without automatic
adapters include 90S Game, Happy2you.net, ROMMEAOW, น้องจ๋าแปลที,
แปลไปเล่นไป, หนีงานมาแปล, แมแปว,
แมวดำ แปลเกมส์, INorge Game Stream and Facebook-only sources. Inspect each
source for a stable public feed before adding an adapter; do not scrape login
walls or infer release dates from page/server timestamps. `SOURCE_PATCH_BLOCKERS.md`
tracks source-side exact Patch navigation limitations separately.
