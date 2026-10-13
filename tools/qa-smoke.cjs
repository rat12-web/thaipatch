const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {start}=require('./serve.cjs');
(async()=>{
 const root=path.resolve(__dirname,'..'),server=start();await new Promise(r=>server.once('listening',r));
 const url='http://127.0.0.1:'+server.address().port+'/',browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{}),headless:true});
 const report={pass:false,mode:'offline UI smoke; external image requests aborted; no source-route or artwork verification',views:[]};
 try{
  assert.equal((await fetch(url+'.git/config')).status,404);assert.equal((await fetch(url+'.sync/report.json')).status,404);
  const source=JSON.parse(fs.readFileSync(path.join(root,'catalog.json'),'utf8'));
  for(const theme of ['light','dark'])for(const width of [1440,390,320]){
   const context=await browser.newContext({viewport:{width,height:900},colorScheme:theme});await context.route('https://**',r=>r.abort());
   const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.locator('#cards .gcard').first().waitFor();
   assert.equal(await page.evaluate(()=>catalog.length),source.length);assert.equal(await page.locator('#sortSelect').inputValue(),'recent');
   assert(await page.evaluate(()=>filtered().every((g,i,a)=>!i||sourceOrderKey(a[i-1])>=sourceOrderKey(g))));
   assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),theme);assert.equal(await page.locator('.coverstatus,.team-route').count(),0);
   assert(await page.locator('#cards .cover').first().evaluate(e=>{const cover=e.getBoundingClientRect(),team=e.querySelector('.covertranslator').getBoundingClientRect(),console=e.querySelector('.cover-console').getBoundingClientRect();return Math.abs(team.left-cover.left)<=3&&Math.abs(team.bottom-cover.bottom)<=3&&Math.abs(console.right-cover.right)<=3}));
   await page.locator('#searchMain').fill('Pokémon Emerald');await page.locator('[data-group-open]').click();assert.equal(await page.locator('.variant-link').count(),2);assert.equal(await page.locator('.team-route').count(),0);await page.keyboard.press('Escape');
   await page.locator('#resetFilters').click();await page.locator('#platformSelect').selectOption('GBA');assert(await page.evaluate(()=>filtered().every(g=>g.platform==='GBA')));
   await page.locator('#searchMain').fill('<img src=x onerror=alert(1)>');assert.equal(await page.locator('#cards .gcard').count(),0);await page.locator('#resetFilters').click();
   await page.locator('#themeToggle').click();const other=theme==='dark'?'light':'dark';await page.reload();assert.equal(await page.evaluate(()=>document.documentElement.dataset.theme),other);
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
   report.views.push({theme,width,pass:true});await context.close();
  }
  report.pass=true;
 }finally{
  fs.mkdirSync(path.join(root,'qa'),{recursive:true});fs.writeFileSync(path.join(root,'qa/smoke.json'),JSON.stringify(report,null,2));await browser.close();await new Promise(r=>server.close(r));
 }
 console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
