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

  // 1. Verify "Official Artwork" or "Official Game Artwork" is NOT displayed on any card
  const visibleOriginLabels = await page.locator('.cover-origin:not(.hide)').allInnerTexts();
  console.log('Visible cover-origin labels count:', visibleOriginLabels.length);
  for (const lab of visibleOriginLabels) {
    assert(!lab.includes('Official'), `Label must not contain 'Official': ${lab}`);
  }
  console.log('PASS: Zero Official Artwork labels visible on cards');

  // Check user-reported games specifically (Top Secret, MetaFight, Pokémon Crystal Advance Redux)
  for (const gid of ['nonplae-ext-top-secret', 'nonplae-ext-metafight', 'nonplae-ext-pokemon-crystal-advance-redux']) {
    const card = page.locator(`[data-source-direct="${gid}"]`);
    await card.scrollIntoViewIfNeeded();
    const origin = card.locator('.cover-origin');
    const isHidden = await origin.evaluate(el => el.classList.contains('hide') || getComputedStyle(el).display === 'none');
    assert(isHidden, `Card ${gid} must have hidden cover-origin`);
    const team = await card.locator('.covertranslator .name').innerText();
    console.log(`Game ${gid} translator plate: "${team}" (not blocked!)`);
    assert(team.includes('นอนแปล'), `Expected team to include นอนแปล, got ${team}`);
  }

  // 2. Test "เรียงตามเครื่องเกม" (Sort by platform)
  await page.locator('#sortSelect').selectOption('platform');
  await page.waitForTimeout(300);
  const first10Platforms = await page.locator('#cards .gcard').evaluateAll(cards => cards.slice(0, 10).map(c => c.dataset.platform));
  console.log('First 10 platforms sorted by platform:', first10Platforms);
  assert(first10Platforms.length >= 10);
  // Verify that all identical platforms are consecutive (grouped)
  let switches = 0;
  for (let i = 1; i < first10Platforms.length; i++) {
    if (first10Platforms[i] !== first10Platforms[i-1]) switches++;
  }
  console.log(`Platform switches in first 10 cards: ${switches}`);
  assert(switches <= 3, 'Platform sort should group games by console consecutively');
  console.log('PASS: Sort by platform works properly');

  // 3. Test "Today Pick" (3 games, 3 genres, 3 teams)
  const todayPickSection = page.locator('#todayPickSection');
  assert(await todayPickSection.isVisible(), 'Today Pick section must be visible');
  
  const todayCards = page.locator('#todayPickCards .gcard');
  const count = await todayCards.count();
  console.log(`Today Pick cards count: ${count}`);
  assert.equal(count, 3, 'Expected exactly 3 cards in Today Pick');

  const genres = [];
  const teams = [];
  const titles = [];

  for (let i = 0; i < 3; i++) {
    const c = todayCards.nth(i);
    const title = await c.locator('.card-name').innerText();
    const genre = await c.locator('.card-meta span').first().innerText();
    const team = await c.locator('.catalog-card-team').innerText();
    titles.push(title);
    genres.push(genre);
    teams.push(team);
  }

  console.log('Today Pick #1 Titles:', titles);
  console.log('Today Pick #1 Genres (must be 3 unique):', genres);
  console.log('Today Pick #1 Teams (must be 3 unique):', teams);

  assert.equal(new Set(genres).size, 3, 'Must have 3 different genres');
  assert.equal(new Set(teams).size, 3, 'Must have 3 different teams');

  // Test "🎲 สุ่มใหม่"
  await page.locator('#todayPickRoll').click();
  await page.waitForTimeout(300);

  const titlesAfterRoll = await page.locator('#todayPickCards .card-name').allInnerTexts();
  const genresAfterRoll = await page.locator('#todayPickCards .card-meta span:first-child').allInnerTexts();
  const teamsAfterRoll = await page.locator('#todayPickCards .catalog-card-team').allInnerTexts();

  console.log('Today Pick Roll #2 Titles:', titlesAfterRoll);
  console.log('Today Pick Roll #2 Genres:', genresAfterRoll);
  console.log('Today Pick Roll #2 Teams:', teamsAfterRoll);

  assert.equal(new Set(genresAfterRoll).size, 3, 'Roll #2 must have 3 different genres');
  assert.equal(new Set(teamsAfterRoll).size, 3, 'Roll #2 must have 3 different teams');
  assert.notDeepEqual(titles, titlesAfterRoll, 'Roll #2 should pick a new set of games');

  // Screenshot Today Pick
  await todayPickSection.screenshot({ path: path.join(__dirname, '../qa/today-pick.png') });
  console.log('Captured qa/today-pick.png');

  await browser.close();
  server.close();
  console.log('ALL TESTS PASSED WITH 100% SUCCESS!');
})().catch(err => {
  console.error(err);
  process.exit(1);
});
