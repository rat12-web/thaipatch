# แปลไทยบอกด้วย · romthai.app

Live: https://rat12-web.github.io/thaipatch/

Static Thai translation catalog, continued from v0.29. Light/dark modes, search, platform colors, series slides, direct creator links and a chooser for duplicate teams/editions. Compact console logos sit upper-right, creator identity lower-left. Audit/test labels are not displayed to visitors.

## Automatic refresh

GitHub Actions checks public metadata every six hours (23 minutes past 00/06/12/18 UTC), and can run manually. It refreshes patch update dates and versions for existing exact-matched games from Memory Card TH, Gayray, RetroSpective, Murphy-TH and NONPLAE. Failed feeds retain previous data. Dates are source-reported updates, not independently verified file upload times. New games are recorded in `.sync/report.json` for edition and actual-route review before publication. This is not automatic publication of every new game.

Facebook and sources without an implemented public adapter are not automatically synchronized. No login bypass, ROM/patch downloads, generated covers or new backend. Existing route and cover evidence remains separate from date freshness. Source-controlled routes can still fail to select an exact patch; see SOURCE_AUDIT.md.

`.sync/refresh.py --check` validates embedded/catalog agreement; `.sync/test_refresh.py` tests updater failure handling and exact matching. `.github/workflows/pages.yml` refreshes, validates, commits and explicitly deploys static files through GitHub Pages. Updater files/reports are not placed in the public Pages artifact. The first real manual refresh/deployment succeeded: https://github.com/rat12-web/thaipatch/actions/runs/38388029187 . All five feeds were readable and 36 existing records matched. The first timed invocation remains a future observation; GitHub may delay scheduled jobs.
