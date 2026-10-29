# Remaining work

Current 2026-10-29 result: 144 cards / 142 groups,
nine sources / 106 exact matches (Gayray 18/18 matched, Memory Card TH 26/182 matched);
added Playtime sort option and front-page recent updates banner.
Evidence recorded in evidence/2026-10-29/reviewed-additions.json.

The earlier snapshot below is historical.

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
