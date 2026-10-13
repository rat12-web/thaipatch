const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert/strict'),crypto=require('crypto');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..'),site=root,qa=path.join(root,'qa/romthai');fs.mkdirSync(qa,{recursive:true});fs.mkdirSync(qa,{recursive:true});
function contrast(a,b){
  const lum=c=>{assert(/^(rgb|color\(srgb)/.test(c),'unsupported computed color '+c);const rgb=c.match(/[\d.]+/g).slice(0,3).map(Number).map(v=>{if(!c.startsWith('color(srgb'))v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722};
  const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);
}
(async()=>{
const live=process.env.THAIPATCH_LIVE_URL;
const server=live?null:http.createServer((q,r)=>{const rel=decodeURIComponent(q.url.split('?')[0]).replace(/^\/thaipatch\/?/,'').replace(/^\//,'')||'index.html',file=path.resolve(site,rel);if(!file.startsWith(site+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){r.writeHead(404);r.end();return}const mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.jpg':'image/jpeg','.html':'text/html'};r.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');r.end(fs.readFileSync(file))}).listen(0,'127.0.0.1');if(server)await new Promise(r=>server.once('listening',r));
const url=live||`http://127.0.0.1:${server.address().port}/thaipatch/`;
const browser=await chromium.launch({...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH?{executablePath:process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH}:{}),headless:true});
const report={url,live:!!live,runAt:new Date().toISOString(),browser:browser.version(),views:[],behaviors:[],brandAssets:[],pass:false};
try{
const assetContext=await browser.newContext();
for(const name of ['brand-banner.jpg','brand-logo.jpg']){
  const source=fs.readFileSync(path.join(site,'assets',name));const manifest=JSON.parse(fs.readFileSync(path.join(root,'audits','brand-hashes.json'),'utf8'));assert.equal(crypto.createHash('sha256').update(source).digest('hex'),manifest[name]);
  const response=await assetContext.request.get(new URL('assets/'+name,url).href);assert.equal(response.status(),200);assert(response.headers()['content-type'].startsWith('image/jpeg'));assert((await response.body()).equals(source));
  report.brandAssets.push({name,bytes:source.length,sha256:crypto.createHash('sha256').update(source).digest('hex'),unchanged:true,servedBytesVerified:true});
}
await assetContext.close();
for(const theme of ['light','dark'])for(const [view,width,height] of [['desktop',1440,1000],['mobile',390,844],['small-mobile',320,740]]){
  const context=await browser.newContext({viewport:{width,height},colorScheme:theme,isMobile:width<500,hasTouch:width<500}),p=await context.newPage(),errors=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error'&&/Content Security Policy/.test(m.text()))errors.push(m.text())});
  assert.equal((await p.goto(url,{waitUntil:'domcontentloaded'})).status(),200);await p.locator('#cards .gcard').first().waitFor();
  assert.equal(await p.evaluate(()=>document.documentElement.dataset.theme),theme);assert((await p.title()).includes('แปลไทยบอกด้วย · romthai.app'));
  assert.equal(await p.locator('h1').innerText(),'แปลไทยบอกด้วย');assert.equal(await p.locator('#themeToggle').getAttribute('aria-pressed'),String(theme==='dark'));
  for(const selector of ['.brand-icon','.brand-banner img']){await p.locator(selector).evaluate(e=>e.decode());assert((await p.locator(selector).evaluate(e=>e.naturalWidth))>0);}
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const prefix=`${live?'live-':''}${theme}-${view}`;await p.screenshot({path:path.join(qa,`${prefix}.png`)});
  await p.locator('#library').evaluate(e=>window.scrollTo({top:e.offsetTop-110,behavior:'instant'}));await p.screenshot({path:path.join(qa,`${prefix}-library.png`)});
  const samples=await p.evaluate(()=>{
    const result=[];for(const selector of ['.hero-copy p','.card-name','.card-meta','.source-date','.catalog-card-team','.catalog-card-action']){
      const e=document.querySelector(selector);if(!e)continue;let parent=e,bg;while(parent){bg=getComputedStyle(parent).backgroundColor;if(bg!=='rgba(0, 0, 0, 0)')break;parent=parent.parentElement}result.push({selector,foreground:getComputedStyle(e).color,background:bg});
    }return result;
  });
  for(const s of samples){s.ratio=contrast(s.foreground,s.background);assert(s.ratio>=4.5,`${theme} ${s.selector}: contrast ${s.ratio}`);}
  await p.locator('#searchMain').fill('Pokémon Emerald');await p.locator('[data-group-open]').click();assert.equal(await p.locator('.variant-link').count(),2);
  for(const selector of ['.variant-name','.variant-version']){
    const colors=await p.locator(selector).first().evaluate(e=>{let b=e;while(getComputedStyle(b).backgroundColor==='rgba(0, 0, 0, 0)')b=b.parentElement;return {foreground:getComputedStyle(e).color,background:getComputedStyle(b).backgroundColor}});const ratio=contrast(colors.foreground,colors.background);assert(ratio>=4.5,`${theme} ${selector}: contrast ${ratio}`);samples.push({selector,...colors,ratio});
  }
  await p.screenshot({path:path.join(qa,`${prefix}-chooser.png`)});await p.keyboard.press('Escape');
  const other=theme==='dark'?'light':'dark';await p.locator('#themeToggle').click();assert.equal(await p.evaluate(()=>document.documentElement.dataset.theme),other);
  await p.reload({waitUntil:'domcontentloaded'});assert.equal(await p.evaluate(()=>document.documentElement.dataset.theme),other);
  assert.deepEqual(await p.evaluate(()=>Object.keys(localStorage)),['romthai.theme']);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
  report.views.push({theme,view,width,height,pass:true,toggleAndReload:true,contrast:samples,errors});await context.close();
}
// An unset preference follows the OS; explicit preference survives an OS change.
const context=await browser.newContext({colorScheme:'light'}),p=await context.newPage();await p.goto(url,{waitUntil:'domcontentloaded'});
await p.emulateMedia({colorScheme:'dark'});await p.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
await p.locator('#themeToggle').click();await p.emulateMedia({colorScheme:'light'});await p.emulateMedia({colorScheme:'dark'});assert.equal(await p.evaluate(()=>document.documentElement.dataset.theme),'light');
await p.evaluate(()=>localStorage.setItem('romthai.theme','invalid'));await p.reload({waitUntil:'domcontentloaded'});assert.equal(await p.evaluate(()=>document.documentElement.dataset.theme),'dark');
await p.evaluate(()=>localStorage.setItem('romthai.theme','light'));await p.reload({waitUntil:'domcontentloaded'});const p2=await context.newPage();await p2.goto(url,{waitUntil:'domcontentloaded'});await p.locator('#themeToggle').click();await p2.waitForFunction(()=>document.documentElement.dataset.theme==='dark');
report.behaviors.push('system preference changes','explicit preference takes priority','invalid value falls back to system','cross-tab synchronization');await context.close();
// Storage denial must leave both theme selection and the catalog usable.
const denied=await browser.newContext({colorScheme:'dark'});await denied.addInitScript(()=>{Storage.prototype.getItem=Storage.prototype.setItem=function(){throw new DOMException('Denied','SecurityError')}});const d=await denied.newPage(),errors=[];d.on('pageerror',e=>errors.push(e.message));await d.goto(url,{waitUntil:'domcontentloaded'});assert.equal(await d.evaluate(()=>document.documentElement.dataset.theme),'dark');await d.locator('#themeToggle').click();assert.equal(await d.evaluate(()=>document.documentElement.dataset.theme),'light');await d.locator('#searchMain').fill('FireRed');assert.equal(await d.locator('#cards a[data-source-direct="90s-028-07"]').count(),1);assert.deepEqual(errors,[]);await denied.close();report.behaviors.push('storage denied: toggle and catalog work');
report.pass=true;
}catch(e){report.error=e.stack;console.error(e);process.exitCode=1}finally{fs.writeFileSync(path.join(qa,live?'live-themes.json':'themes.json'),JSON.stringify(report,null,2));await browser.close();if(server)server.close();console.log(JSON.stringify({pass:report.pass,views:report.views.length,behaviors:report.behaviors,error:report.error},null,2));}
})().catch(e=>{console.error(e);process.exitCode=1});
