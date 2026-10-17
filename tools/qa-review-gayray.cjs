// Live metadata review only. No ROM submission or patch download.
const {chromium} = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'qa/gayray-review');
fs.mkdirSync(out, {recursive:true});

(async () => {
  const browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH
      ? {executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH} : {}),
    headless:true,
  });
  const report = {
    checkedAt:new Date().toISOString(), source:'https://gayray.pages.dev/', pass:false,
    scope:'Creator game/patch UI, source edition and decoded remote covers only; no patching, binary download or rights certification',
    games:[],
  };
  try {
    const queued = JSON.parse(fs.readFileSync(path.join(root, '.sync/report.json'), 'utf8'))
      .newCandidates.filter(g => g.feed === 'gayray');
    const reviewed = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'))
      .filter(g => g.syncSource?.feed === 'gayray')
      .map(g => ({key:g.syncSource.key, title:g.title}));
    const candidates = [...new Map([...queued, ...reviewed].map(g => [g.key, g])).values()];
    assert(candidates.length > 0, 'No Gayray candidates or previously reviewed records');
    for (const candidate of candidates) {
      const context = await browser.newContext({
        viewport:{width:1000, height:1000}, acceptDownloads:false,
      });
      try {
        await context.route(/\.(bps|ips|ups|xdelta|delta|zip|7z|gba|gbc|gb|sfc|smc|nes|nds|iso|bin)(\?|$)/i,
          request => request.abort());
        const page = await context.newPage();
        await page.goto(report.source, {waitUntil:'domcontentloaded'});
        // The search listener is registered after the asynchronous source feed loads.
        await page.locator('#grid [data-apply]').first().waitFor();
        await page.locator('#search').fill(candidate.title);
        const card = page.locator(`[data-apply="${candidate.key}"]`);
        await card.waitFor();
        await card.click();
        await page.locator('#modal-patch').waitFor({state:'visible'});
        assert.equal(new URL(page.url()).hash, '#game=' + candidate.key);
        const game = await page.evaluate(id =>
          JSON.parse(JSON.stringify(GAMES.find(g => g.id === id))), candidate.key);
        assert.equal(await page.locator('#pm-title-en').innerText(), game.titleEn);
        assert((await page.locator('#pm-spec').innerText()).includes(game.source.label));
        assert(await page.locator('#pm-apply').isDisabled());
        assert(game.patch || game.patchOptions);
        await page.locator('#pm-cover').evaluate(async image => {
          await image.decode();
          if (!image.naturalWidth) throw Error('Cover decode failed');
        });
        const cover = await page.locator('#pm-cover').evaluate(image => ({
          url:image.currentSrc, width:image.naturalWidth, height:image.naturalHeight,
        }));
        await page.screenshot({path:path.join(out, game.id + '.png')});
        const clickedUrl = page.url();
        await page.close();
        const fresh = await context.newPage();
        await fresh.goto(clickedUrl, {waitUntil:'domcontentloaded'});
        await fresh.locator('#modal-patch').waitFor({state:'visible'});
        assert.equal(await fresh.locator('#pm-title-en').innerText(), game.titleEn);
        report.games.push({
          key:game.id, title:game.titleEn, titleTh:game.titleTh, platform:game.platform,
          version:game.version, updated:game.updated, baseEdition:game.source.label,
          sourceIdentity:game.source, warning:game.warning || null, description:game.blurb,
          patchReference:game.patch || null, url:clickedUrl, cover,
          nativeClick:true, freshDeepLink:true, patchUi:true, pass:true,
        });
        console.log(game.id + ' PASS');
      } finally {
        await context.close();
      }
    }
    report.pass = true;
  } finally {
    fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(report, null, 2));
    await browser.close();
  }
  console.log(JSON.stringify({pass:report.pass, games:report.games.length}));
})().catch(error => { console.error(error); process.exit(1); });
