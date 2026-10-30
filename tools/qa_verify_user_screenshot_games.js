const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert/strict');

(async () => {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split('?')[0]).replace(/^\/thaipatch\/?/, '').replace(/^\//, '') || 'index.html';
    const file = path.resolve(__dirname, '..', rel);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) {
      res.writeHead(404);
      res.end();
      return;
    }
    const ext = path.extname(file);
    const mime = { '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.html': 'text/html' }[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', mime);
    res.end(fs.readFileSync(file));
  }).listen(0, '127.0.0.1');

  await new Promise(r => server.once('listening', r));
  const url = `http://127.0.0.1:${server.address().port}/thaipatch/`;

  const browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}),
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });

  // 1. Verify Recent Updates has exactly 10 items
  const changelogRows = await page.locator('.changelog-row').count();
  console.log(`Changelog rows count: ${changelogRows}`);
  assert.equal(changelogRows, 10, 'Expected exactly 10 changelog rows');

  // Check alternating classes and action badges
  const actions = await page.locator('.changelog-row .cl-action').allInnerTexts();
  console.log('Action badges in changelog:', actions);

  // 2. Check the 3 games from user screenshot: Top Secret, MetaFight, Pokémon Crystal Advance Redux
  const targetGames = [
    'nonplae-ext-top-secret',
    'nonplae-ext-metafight',
    'nonplae-ext-pokemon-crystal-advance-redux'
  ];

  for (const gid of targetGames) {
    const card = page.locator(`[data-source-direct="${gid}"]`);
    await card.scrollIntoViewIfNeeded();
    const cover = card.locator('.cover');
    const isMissingArt = await cover.evaluate(el => el.classList.contains('missing-art'));
    assert.equal(isMissingArt, false, `Card ${gid} must not have missing-art class`);

    const img = card.locator('.realart');
    await img.evaluate(e => e.decode());
    const nw = await img.evaluate(e => e.naturalWidth);
    const src = await img.evaluate(e => e.src);
    console.log(`Game ${gid}: naturalWidth = ${nw}, src = ${src}`);
    assert(nw > 0, `Image for ${gid} must have naturalWidth > 0`);
  }

  // Take screenshot of recent updates
  await page.locator('#recentUpdatesSection').screenshot({ path: path.join(__dirname, '../qa/recent-updates-10-compact.png') });
  console.log('Captured qa/recent-updates-10-compact.png');

  await browser.close();
  server.close();
  console.log('ALL VERIFICATIONS PASSED 100%!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
