# แปลไทยบอกด้วย · romthai.app

Live: https://rat12-web.github.io/thaipatch/

Static Thai translation catalog, continued from v0.29. Light/dark modes, search, platform colors, series slides, direct creator links and a chooser for duplicate teams/editions. Compact console logos sit upper-right, creator identity lower-left. Audit/test labels are not displayed to visitors.

## Automatic refresh

GitHub Actions checks public metadata every six hours (23 minutes past 00/06/12/18 UTC), and can run manually. It refreshes patch update dates and versions for existing exact-matched games from Memory Card TH, Gayray, RetroSpective, Murphy-TH and NONPLAE. Failed feeds retain previous data. Dates are source-reported updates, not independently verified file upload times. New games are recorded in `.sync/report.json` for edition and actual-route review before publication. This is not automatic publication of every new game.

Facebook and sources without an implemented public adapter are not automatically synchronized. No login bypass, ROM/patch downloads, generated covers or new backend. Existing route and cover evidence remains separate from date freshness. Source-controlled routes can still fail to select an exact patch; see SOURCE_AUDIT.md.

`.sync/refresh.py --check` validates embedded/catalog agreement; `.sync/test_refresh.py` tests updater failure handling and exact matching. `.github/workflows/pages.yml` refreshes, validates, commits and explicitly deploys static files through GitHub Pages. Updater files/reports are not placed in the public Pages artifact. The first real manual refresh/deployment succeeded: https://github.com/rat12-web/thaipatch/actions/runs/38388029187 . All five feeds were readable and 36 existing records matched. The first timed invocation remains a future observation; GitHub may delay scheduled jobs.


## Develop or continue with another agent

Start with [AGENT_START.md](AGENT_START.md), [AGENTS.md](AGENTS.md), [WORK_TO_AGENT.md](WORK_TO_AGENT.md) and [TASKS.md](TASKS.md). The repository now contains source templates, a standalone Python builder, four portable Chromium QA suites, an offline browser smoke test, updater tests and public audit/handoff records. No originating ChatGPT login, old ZIP or Windows workspace path is needed for the current build.

```sh
npm ci
npx playwright install chromium
python tools/build.py
python tools/build.py --check
python .sync/test_refresh.py
python .sync/refresh.py --check
npm test
npm start
```

Python 3.10+ and Node.js 22/24/26 are required. Windows can use `py` instead of `python`; npm scripts require `python` on PATH. `npm run qa:full` runs real external source/image checks and needs network access. See AGENT_START.md for Linux browser dependencies and live-site checks.

Edit src/ for behavior/UI, catalog.json for records, teams.json/platforms.json for identity/theme registries. Rebuild generated root app/index/styles after edits. User-provided brand images remain in assets/; audit hash identity lives in audits/brand-hashes.json. Existing public source/cover/team/date/90S audits are in audits/, preserved QA reports in evidence/previous/ and current blockers in SOURCE_PATCH_BLOCKERS.md. Historical evidence is not a fresh validation claim.

The six-hour updater still changes known exact-matched dates/versions only; new games need route/edition review. GitHub Actions checks the generated build, updater and portable browser smoke before publishing an explicit static artifact. Source, dependencies, docs and audit reports are excluded from the Pages artifact. Dependency downloads are development/CI tools; the public site itself remains static.
