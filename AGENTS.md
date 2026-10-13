# Repository working contract

Read README.md, WORK_TO_AGENT.md, TASKS.md and CHECKPOINT.md before editing. These files are the durable project context; the ChatGPT conversation is not required. Review current Git history and actual files if a checkpoint is older than HEAD.

- Continue the existing v0.29-derived catalog; do not recreate it. Brand: แปลไทยบอกด้วย / romthai.app. Actual hosting: rat12-web.github.io/thaipatch; custom DNS is not configured.
- Canonical inputs: src/, catalog.json, teams.json, platforms.json and assets/. Run `python tools/build.py` after edits. app.js, index.html, styles.css and root theme scripts are generated; do not edit them directly. The updater also projects canonical catalog changes into app.js.
- Latest accepted UI: compact console marks upper-right; creator identity lower-left; each console has its own frame color (GBA purple); light/dark modes. Do not restore TESTED/status/route-audit labels in visitor UI.
- Preserve stable IDs, platforms, editions, teams, source provenance, 14 series slides, search/filter, accessibility and responsive UI. Single-team cards open the actual creator/source directly. Duplicate/team/edition groups use the chooser.
- Default order: verified source-reported patch dates, unknown last. Never substitute import times, generic catalog edits or HTTP dates for file-upload evidence.
- GitHub Actions refreshes dates/versions from five implemented sources every six hours. New candidates require actual route, edition and artwork review. Facebook is not automatically synced. Failed feeds preserve prior data; never execute upstream scripts.
- Reuse public audits. Do not repeat a confirmed survey without a changed source, failing check or unresolved evidence. URL syntax/HTTP 200 alone never verifies exact game/patch selection.
- Existing 22 exact-Patch source-side blockers are documented in SOURCE_PATCH_BLOCKERS.md. Do not alter audited links to guessed `#patch` routes. Preserve verified/inferred/unresolved distinctions.
- Never add ROMs, BIOS, patch binaries, credentials, private caches/transcripts or unlicensed local third-party artwork. Local brand assets are the user's supplied originals. No generated replacement game/team/console art. Audit decoding is not rights permission.
- Catalog only: no votes, ROM/IPS creation, uploads, paid services or backend unless explicitly requested.
- Run build/check, updater tests and offline browser smoke for code changes. Run affected full browser checks when routes, covers, themes or responsive behavior change; these access real external sites. An offline PASS is not external route/asset evidence.
- Work on a separate branch/worktree if another agent is active. One writer per branch; do not run multiple refresh processes against one checkout. Fetch before committing to account for the scheduled bot.
- The owner authorized updates to this existing GitHub repository and Pages. Publishing elsewhere/account/domain changes need the owner's destination details. No requests to confirm routine authorized updates.
- Before handing off, update WORK_TO_AGENT.md, TASKS.md and CHECKPOINT.md with exact checks, commit/reference, unresolved blockers and the next concrete action. Commit code/context together. Do not claim complete production acceptance while route/art/date gates remain unresolved.

Files under evidence/previous and audits/ are historical evidence, not fresh validation. Keep previous results intact; put new evidence under evidence/ with a date. Workspace-only sources/ and baseline/ were intentionally not copied here; BASELINE_REVIEW.md records their provenance.
