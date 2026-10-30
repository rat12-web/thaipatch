const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const assert = require('assert');

(async () => {
  const root = path.resolve(__dirname, '..');
  const server = http.createServer((req, res) => {
    let filePath = path.join(root, req.url.replace(/^\/thaipatch\//, '').split('?')[0]);
    if (filePath.endsWith('/') || filePath.endsWith('\\')) filePath = path.join(filePath, 'index.html');
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(root, 'index.html');
    }
    const ext = path.extname(filePath);
    const contentType = {
      '.html': 'text/html; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.json': 'application/json; charset=utf-8',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml'
    }[ext] || 'text/plain';

    res.writeHead(200, { 'Content-Type': contentType });
    res.end(fs.readFileSync(filePath));
  }).listen(0, '127.0.0.1');

  await new Promise(r => server.once('listening', r));
  const url = `http://127.0.0.1:${server.address().port}/thaipatch/`;

  const browser = await chromium.launch({
    ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } : {}),
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });

  // 1. Verify "Official Artwork" or "Official Game Artwork" is NOT displayed on any card
  const visibleOriginLabels = await page.locator('.cover-origin:not(.hide)').allInnerTexts();
  console.log('Visible cover-origin labels count:', visibleOriginLabels.length);
  for (const lab of visibleOriginLabels) {
    assert(!lab.includes('Official'), `Label must not contain 'Official': ${lab}`);
  }
  console.log('PASS: Zero Official Artwork labels visible on cards');

  // Verify Nonplae cards show translator plate clearly without any cover-origin blocking
  const nonplaeCards = ['nonplae-ext-top-secret', 'nonplae-ext-metafight', 'nonplae-ext-pokemon-crystal-advance-redux'];
  for (const id of nonplaeCards) {
    const cardEl = page.locator(`[data-game-id="${id}"]`);
    if (await cardEl.count() > 0) {
      const plate = cardEl.locator('.covertranslator');
      assert(await plate.isVisible(), `Translator plate for ${id} must be visible`);
      const origin = cardEl.locator('.cover-origin');
      const originVisible = await origin.isVisible().catch(() => false);
      assert(!originVisible, `cover-origin for ${id} should be hidden`);
      console.log(`Game ${id} translator plate: "${(await plate.innerText()).trim()}" (not blocked!)`);
    }
  }

  // 2. Test "ตามเครื่องเกม" (Sort by Platform)
  await page.locator('#sortSelect').selectOption('platform');
  await page.waitForTimeout(300);

  const first10Platforms = await page.locator('#cards .gcard .game-badge-platform').allInnerTexts();
  console.log('First 10 platforms sorted by platform:', first10Platforms.slice(0, 10));
  let switches = 0;
  for (let i = 1; i < first10Platforms.length; i++) {
    if (first10Platforms[i] !== first10Platforms[i-1]) switches++;
  }
  console.log(`Platform switches in first 10 cards: ${switches}`);
  assert(switches <= 3, 'Platform sort should group games by console consecutively');
  console.log('PASS: Sort by platform works properly');

  // 3. Test "Today Pick" (4 games, no re-roll button, diverse genres & teams)
  const todayPickSection = page.locator('#todayPickSection');
  assert(await todayPickSection.isVisible(), 'Today Pick section must be visible');
  
  // Verify NO roll button exists
  const rollBtnCount = await page.locator('#todayPickRoll').count();
  console.log(`Today Pick roll button count: ${rollBtnCount}`);
  assert.equal(rollBtnCount, 0, 'No re-roll button should exist in Today Pick');
  console.log('PASS: No re-roll button present as requested');

  // Verify exactly 4 cards
  const todayCards = page.locator('#todayPickCards .gcard');
  const count = await todayCards.count();
  console.log(`Today Pick cards count: ${count}`);
  assert.equal(count, 4, 'Expected exactly 4 cards in Today Pick');

  const genres = [];
  const teams = [];
  const titles = [];

  for (let i = 0; i < 4; i++) {
    const c = todayCards.nth(i);
    const title = await c.locator('.card-name').innerText();
    const genre = await c.locator('.card-meta span').first().innerText();
    const team = await c.locator('.catalog-card-team').innerText();
    titles.push(title);
    genres.push(genre);
    teams.push(team);
  }

  console.log('Today Pick 4 Titles:', titles);
  console.log('Today Pick 4 Genres:', genres);
  console.log('Today Pick 4 Teams:', teams);

  assert.equal(new Set(genres).size, 4, 'Must have 4 different genres');
  assert.equal(new Set(teams).size, 4, 'Must have 4 different teams');
  console.log('PASS: 4 games with 4 unique genres and 4 unique teams');

  // Screenshot Today Pick
  await todayPickSection.screenshot({ path: path.join(__dirname, '../qa/today-pick-4-games.png') });
  console.log('Captured qa/today-pick-4-games.png');

  // Responsive smoke checks across viewports
  for (const width of [1440, 1024, 600, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(100);
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const innerWidth = await page.evaluate(() => window.innerWidth);
    assert(scrollWidth <= innerWidth, `Horizontal scroll overflow detected at width ${width}: scrollWidth=${scrollWidth}, innerWidth=${innerWidth}`);
    console.log(`PASS: Responsive width ${width}px (no horizontal overflow)`);
  }

  await browser.close();
  server.close();
  console.log('ALL TESTS PASSED WITH 100% SUCCESS!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
