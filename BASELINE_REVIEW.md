# M0 baseline review — before application edits

2026-10-12, Asia/Bangkok. Original archive SHA-256: 24cbb3f56564fbbade4c84281b699700c094611b53deda949aa606306d3dc49c.

41/41 manifest hashes match. Original: 129 patch records, 127 displayed games, two duplicate groups. Desktop 1440×900 and mobile 390×844: no uncaught JavaScript errors or horizontal document overflow. Original screenshots and audit files are preserved under baseline/.

Actual defects: IPS accepts missing EOF; direct-link verification is partly inferred from URL shapes; 90S chooser labels claim automatic selection for 17 untested routes; team chooser lacks focus containment/restoration; filtered groups can lose sibling variants; generated fallback covers contradict the requested image policy; service-worker registration references a missing sw.js. DQ V JP goes to an unselected patch station, RetroSpective Emerald to a directory.

Fresh source QA: 18 90S slugs exist as actual options, but 17 fresh visits select the wrong default game. The first game's selected value merely coincides with the default and is inconclusive. FireRed failed again after an 8-second wait. Original prior verification is retained as history, not current proof. DQ V JP/EN replacement URLs selected the correct observed options. RetroSpective exposes #game/<id>; verify its observed Emerald ID before replacing the directory link.

Work: migrate the existing data, repair bounded IPS/navigation/grouping/accessibility failures, preserve series/filter/UI behavior, collect desktop/mobile and checksum evidence, package locally. Chat: resolve unknown image reuse rights, missing logos and ambiguous baseline edition/platform records from exported evidence. No broad repeated survey.

Risks: external 90S behavior cannot be repaired in this project; source pages can change; inherited audits may not prove redistribution rights; title matching must not merge distinct hacks/editions; local user records are untrusted.

Acceptance: preserve all 129 IDs and supported features; keep explicit platform/base edition/patch version/team identity; team choices retain all siblings and use observed source routes; separate observed slug, selected-game proof, and inferred/directory states; no generated replacement cover or unauthorized local image; reject malformed IPS and independently verify output CRC32/SHA-256; Playwright Desktop/Mobile passes; all unresolved external, rights, and source blockers remain explicit. Full acceptance gates remain in CHECKPOINT.md. No deployment or production-ready claim until blocking gates are cleared.
