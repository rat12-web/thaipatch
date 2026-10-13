# Start or resume with any coding agent

Open/clone https://github.com/rat12-web/thaipatch and use the repository root as the working directory. The agent must have filesystem, shell and Git access. Publishing requires your existing GitHub authorization; this repository does not contain credentials. No vendor SDK, cross-chat connection or ChatGPT login is required by the project.

Paste this task into Claude Code, Antigravity, ZCode, T3 Code, Hermes Agent or another capable agent:

> Continue this existing romthai.app project. First read AGENTS.md, README.md, WORK_TO_AGENT.md, TASKS.md and CHECKPOINT.md, then inspect git status/log. Preserve the current catalog and audited links. Follow repository-local build and QA commands. Work on the next selected TASKS.md item, record actual evidence and remaining blockers, update the handoff files, and commit/push to the existing repository when authorized. Do not depend on the originating ChatGPT conversation or recreate the project. Do not claim source routes verified from URL shape alone.

## Clean setup

Install Python 3.10+ and Node.js 22/24/26. On Windows, use `py` in place of `python` if needed, or set up a Python executable on PATH. The repository's npm scripts assume `python` exists.

```sh
git clone https://github.com/rat12-web/thaipatch.git
cd thaipatch
npm ci
npx playwright install chromium
python tools/build.py --check
python .sync/test_refresh.py
python .sync/refresh.py --check
npm test
npm start
```

Linux CI uses `npx playwright install --with-deps chromium`. Browser setup follows the [official Playwright installation guide](https://playwright.dev/docs/intro). An installed Chromium can be selected through PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH; no host-specific path is committed in executable scripts.

`npm test` is the deterministic offline UI/security smoke test: it intentionally blocks remote images and does not certify artwork or creator routes. `npm run qa:full` runs the four preserved real Chromium suites, including fresh native source clicks and remote logo/image decoding; it needs network access. To test the deployed site, set THAIPATCH_LIVE_URL to https://rat12-web.github.io/thaipatch/ before running it. Reports/screenshots go to ignored qa/; copy concise relevant results to evidence/ for a handoff.

## Shared state and continuity

Git is the shared state, not an agent's private chat memory. Every next agent reads the same decisions, pending tasks and evidence. Agent-specific chat sessions and hidden memories are not automatically imported; the checked-in summary replaces the project context required for continuation. Full old ZIPs/transcripts/raw browser caches are unnecessary for the current build and remain outside the public repository.

Several agents can use separate branches/worktrees, but one writer owns each branch. Pull/fetch before publishing because the scheduled updater may commit metadata while you work. Preserve both changes if a merge is needed. The Pages workflow builds/checks and publishes only explicit static assets, excluding source, reports and handoff documents from the public site.

Changing agents does not automatically start work in the next application. Open the checkout and submit the resume task above. Individual agent products and their authentication integrations have not been tested here; repository independence is tested with a clean isolated checkout and Linux GitHub CI.
