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
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.locator('#cards .gcard').first().waitFor();
  await page.locator('#wishlistSection').waitFor();

  // 1. Verify Token Buttons (Top-Left & Bottom-Left)
  console.log('Testing Token buttons...');
  const tipTop = page.locator('#tipTokenTop');
  assert(await tipTop.isVisible(), '#tipTokenTop must be visible in header');
  assert.match(await tipTop.innerText(), /เลี้ยง Token/, '#tipTokenTop should contain "เลี้ยง Token"');

  const tipBottom = page.locator('#tipTokenBottom');
  assert(await tipBottom.isVisible(), '#tipTokenBottom must be visible on screen');
  assert.match(await tipBottom.innerText(), /เลี้ยง Token/, '#tipTokenBottom should contain "เลี้ยง Token"');

  // Test clicking bottom token button
  await tipBottom.click();
  await page.locator('#modalVeil.show').waitFor();
  const modalTitle = await page.locator('#modalTitle').innerText();
  console.log('Token modal title:', modalTitle);
  assert.equal(modalTitle, 'เลี้ยง Token สนับสนุนเว็บ', 'Modal title should match');

  // Click send token button
  await page.locator('#sendOneTokenBtn').click();
  const thanksNotice = page.locator('#tokenThanksNotice');
  assert(await thanksNotice.isVisible(), 'Thanks notice should show after sending token');
  const userTokenCount = await page.locator('#userTokenDisplay').innerText();
  console.log('User tokens sent:', userTokenCount);
  assert.equal(userTokenCount, '1');

  // Close modal
  await page.locator('#modalClose').click();
  await page.waitForTimeout(200);

  // 2. Verify Wishlist Poll Section (10 untranslated games)
  console.log('Testing Wishlist Poll Section...');
  const wishlistCards = page.locator('#wishlistGrid .wishlist-card');
  const count = await wishlistCards.count();
  console.log(`Wishlist poll cards count: ${count}`);
  assert.equal(count, 10, 'Expected exactly 10 untranslated games in poll');

  // Check titles
  const titles = await page.locator('#wishlistGrid .wishlist-card-title').allInnerTexts();
  console.log('Wishlist 10 Titles:', titles);
  assert(titles.some(t => t.includes('Ocarina of Time')), 'Must include The Legend of Zelda: Ocarina of Time');
  assert(titles.some(t => t.includes("Majora's Mask")), 'Must include The Legend of Zelda: Majora\'s Mask');
  assert(titles.some(t => t.includes('Super Mario 64')), 'Must include Super Mario 64');
  assert(titles.some(t => t.includes('Super Metroid')), 'Must include Super Metroid');
  assert(titles.some(t => t.includes('Metal Gear Solid 3')), 'Must include Metal Gear Solid 3');
  assert(titles.some(t => t.includes('Kingdom Hearts II')), 'Must include Kingdom Hearts II');
  assert(titles.some(t => t.includes('Grandia')), 'Must include Grandia');
  assert(titles.some(t => t.includes('Banjo-Kazooie')), 'Must include Banjo-Kazooie');
  assert(titles.some(t => t.includes('Paper Mario')), 'Must include Paper Mario');
  assert(titles.some(t => t.includes('Dragon Quest VII')), 'Must include Dragon Quest VII');

  // 3. Test Interactive Voting
  console.log('Testing Voting interaction...');
  const zeldaCard = page.locator('.wishlist-card[data-wishlist-id="wishlist-01-zelda-oot"]');
  const voteBtn = zeldaCard.locator('[data-wishlist-vote="wishlist-01-zelda-oot"]');
  const initialVotesText = await zeldaCard.locator('.wishlist-votes-count span').first().innerText();
  console.log('Zelda OoT initial vote count text:', initialVotesText);

  // Cast vote
  await voteBtn.click();
  await page.waitForTimeout(100);
  assert(await voteBtn.evaluate(el => el.classList.contains('voted')), 'Vote button should have .voted class');
  assert.match(await voteBtn.innerText(), /โหวตแล้ว/, 'Vote button text should be "✓ โหวตแล้ว"');

  const afterVoteText = await zeldaCard.locator('.wishlist-votes-count span').first().innerText();
  console.log('Zelda OoT after vote text:', afterVoteText);
  assert.notEqual(initialVotesText, afterVoteText, 'Vote count should increase');

  // Reload page to verify persistence in localStorage
  await page.reload({ waitUntil: 'domcontentloaded' });
  await page.locator('#wishlistGrid .wishlist-card').first().waitFor();
  const reloadedZeldaBtn = page.locator('.wishlist-card[data-wishlist-id="wishlist-01-zelda-oot"] [data-wishlist-vote]');
  assert(await reloadedZeldaBtn.evaluate(el => el.classList.contains('voted')), 'Vote should persist after reload');

  // Untoggle vote
  await reloadedZeldaBtn.click();
  await page.waitForTimeout(100);
  assert(!await reloadedZeldaBtn.evaluate(el => el.classList.contains('voted')), 'Vote should be untoggled');

  // Screenshot Wishlist Section
  fs.mkdirSync(path.join(root, 'qa'), { recursive: true });
  await page.locator('#wishlistSection').screenshot({ path: path.join(root, 'qa/wishlist-poll-10-games.png') });
  console.log('Captured qa/wishlist-poll-10-games.png');

  // 4. Responsive Smoke Check (No Horizontal Overflow)
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
  console.log('ALL WISHLIST & TOKEN TESTS PASSED WITH 100% SUCCESS!');
  process.exit(0);
})().catch(err => {
  console.error(err);
  process.exit(1);
});
