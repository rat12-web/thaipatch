const $=id=>document.getElementById(id);
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl=u=>{try{const x=new URL(u);return x.protocol==='https:'&&!x.username&&!x.password?x.href:''}catch{return ''}};
const SERIES_RANK=["Pokémon","The Legend of Zelda", "Final Fantasy", "Resident Evil", "Dragon Quest", "Dragon Ball", "Onimusha", "Digimon", "Captain Tsubasa", "Persona", "Gundam", "Yu Yu Hakusho", "Dokapon", "Super Robot Wars", "Tales of", "Fire Emblem", "Monster Hunter", "Silent Hill", "Castlevania", "Metal Gear Solid", "Metroid", "Luminous Arc", "God of War", "Harvest Moon", "Shin Megami Tensei"];
const TEAM_THEME={
 'Memory Card TH':{main:'#eaf3ff',strong:'#4d87ff'},
 'แปลไทยเกมเก่า':{main:'#f4ebff',strong:'#8a58ff'},
 'ThaiPatch Studio':{main:'#eafff7',strong:'#28b48d'},
 'Nexus Mods':{main:'#effffb',strong:'#35b89a'},
 'Monster แปล':{main:'#fff2e8',strong:'#f08a3e'},
 'NONPLAE':{main:'#ffeef3',strong:'#ff5d8f'},
 'Nonplae':{main:'#ffeef3',strong:'#ff5d8f'},
 'Murphy-TH':{main:'#eef5ff',strong:'#6f93ff'},
 'Murphy TH':{main:'#eef5ff',strong:'#6f93ff'},
 'แมแปว':{main:'#fff6e8',strong:'#e1a632'},
 'Maepaew':{main:'#fff6e8',strong:'#e1a632'},
 'Thai FanSub':{main:'#eaf6ff',strong:'#2aa4dd'},
 'น้า_auns555':{main:'#fff0ea',strong:'#f26c3c'},
 'แปลไปเล่นไป':{main:'#edf8ff',strong:'#3d96db'},
 'แมวดำ แปลเกมส์':{main:'#f1f1f1',strong:'#444444'},
 'INorge Game Stream':{main:'#eefaf6',strong:'#29a77e'},
 'น้องจ๋าแปลที':{main:'#fff1ef',strong:'#cf5368'},
 'หนีงานมาแปล':{main:'#fff5df',strong:'#c48b39'},
 'Happy2you.net':{main:'#e9f9ff',strong:'#388db9'},
 'เกเรแปลไทย':{main:'#eafaff',strong:'#1d9cae'},
 '90S Game':{main:'#fff1e3',strong:'#ef7c34'},
 'รอมเหมียว (ROMMEAOW)':{main:'#ffedf6',strong:'#ed5f9b'},
 'RetroSpective':{main:'#efe9ff',strong:'#7556d8'}
};
const NEUTRAL_GROUP_ART={
  "Dragon Quest V|NDS":"https://thumbnails.libretro.com/Nintendo%20-%20Nintendo%20DS/Named_Boxarts/Dragon%20Quest%20V%20-%20Tenkuu%20no%20Hanayome%20%28Japan%29.png",
  "Pokémon Emerald|GBA":"https://thumbnails.libretro.com/Nintendo%20-%20Game%20Boy%20Advance/Named_Boxarts/Pokemon%20-%20Emerald%20Version%20%28USA%2C%20Europe%29.png",
  "Final Fantasy Tactics A2: Grimoire of the Rift|NDS":"https://thumbnails.libretro.com/Nintendo%20-%20Nintendo%20DS/Named_Boxarts/Final%20Fantasy%20Tactics%20A2%20-%20Grimoire%20of%20the%20Rift%20%28USA%29%20%28En%2CFr%2CEs%29.png",
  "Super Robot Taisen: Original Generation|GBA":"https://thumbnails.libretro.com/Nintendo%20-%20Game%20Boy%20Advance/Named_Boxarts/Super%20Robot%20Taisen%20-%20Original%20Generation%20%28USA%29.png",
  "Pokémon Crystal|GBC":"https://thumbnails.libretro.com/Nintendo%20-%20Game%20Boy%20Color/Named_Boxarts/Pokemon%20-%20Crystal%20Version%20%28USA%2C%20Europe%29%20%28Rev%201%29.png"
};
let catalog=GAME_CATALOG;let modalReturnFocus=null;let state={query:'',platform:'',genre:'',art:'',series:'',team:'',sort:'recent',lane:'new',limit:24};
function teamTheme(name){
  if(TEAM_THEME[name]) return TEAM_THEME[name];
  let h=0; const s=String(name||'Translator'); for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
  const hue=h%360, hue2=(hue+28)%360;
  return {main:`hsl(${hue} 88% 95%)`, strong:`hsl(${hue2} 70% 48%)`};
}
function assetUrl(u,g){return safeUrl(u)}
function sourceUrl(g){return safeUrl(g.url)||''}
function canonicalTitle(g){return g.canonicalTitle||g.title;}
function gameGroupKey(g){return (g.canonicalGameId||g.id)+'|'+g.platform;}
function groupGameEntries(items){
 const map=new Map();
 for(const g of items){const key=gameGroupKey(g);if(!map.has(key))map.set(key,[]);map.get(key).push(g)}
 return [...map.entries()].map(([key,list])=>{
   if(list.length===1)return list[0];
   const defaultItem=list[0];
   const official=NEUTRAL_GROUP_ART[canonicalTitle(defaultItem)+'|'+defaultItem.platform]||defaultItem.coverCandidateUrl||defaultItem.cover||(list.find(x=>x.cover)?.cover)||'';
   return {...defaultItem,id:'group:'+key,title:canonicalTitle(defaultItem),grouped:true,neutralCover:official,cover:official,coverLocal:'',coverCandidateUrl:official,groupKey:key,variants:list,teamCount:new Set(list.map(x=>x.translatorName||x.source||x.publisher)).size,source:'',translatorName:'',publisher:'',coverSource:'official_cover_for_neutral_group'};
 });
}
function normalizeSearch(s){return String(s||'').normalize('NFKC').toLocaleLowerCase('th').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
function filtersUI(){let items=allGames();const opts=(key,empty)=>`<option value="">${empty}</option>`+[...new Set(items.map(g=>g[key]).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'th')).map(v=>`<option value="${safe(v)}">${safe(v)}</option>`).join('');$('genreSelect').innerHTML=opts('genre','ทุกแนวเกม');$('platformSelect').innerHTML=opts('platform','ทุกเครื่องเล่น');$('artSelect').innerHTML=opts('artStyle','ทุกแนวภาพ');$('seriesSelect').innerHTML='<option value="">ทุกซีรีส์</option>'+[...new Set(items.map(seriesOf))].sort((a,b)=>seriesPopularity({series:a})-seriesPopularity({series:b})||a.localeCompare(b)).map(v=>`<option value="${safe(v)}">${safe(v)}</option>`).join('');$('genreSelect').value=state.genre||'';$('platformSelect').value=state.platform||'';$('artSelect').value=state.art||'';$('seriesSelect').value=state.series||'';}
function getSeriesSlides(){
 const groups=new Map();
 groupGameEntries(allGames()).filter(g=>g.platform!=='DEMO').forEach(g=>{
  const k=seriesOf(g);if(!k||k==='เกมอื่น ๆ')return;
  if(!groups.has(k))groups.set(k,[]);
  groups.get(k).push(g)
 });
 return [...groups.entries()].filter(([name,list])=>list.length>=2).sort((a,b)=>b[1].length-a[1].length||seriesPopularity({series:a[0]})-seriesPopularity({series:b[0]})||a[0].localeCompare(b[0],'en')).slice(0,14)
}
function renderFeatured(){
 const el=document.getElementById('featuredTrack');if(!el)return;
 const list=getSeriesSlides();
 const hues=['#5881fc','#c38afd','#65a7fb','#e78a53','#b993e9','#d86b9d','#63c6b0','#f0be61','#82aafa','#bd85fb','#6ab1c9','#cf7766','#93aee0','#d0a5c8'];
 el.innerHTML=list.map(([name,games],i)=>{
  const ordered=[...games].sort((a,b)=>Number(!!(b.coverLocal||b.coverCandidateUrl||b.cover))-Number(!!(a.coverLocal||a.coverCandidateUrl||a.cover))||a.title.localeCompare(b.title));
  const arts=ordered.filter(g=>g.coverLocal||g.coverCandidateUrl||g.cover).slice(0,3);
  const collage=arts.map((g,n)=>`<img class="series-cover series-cover-${n+1}" src="${safe(assetUrl(g.coverLocal||g.coverCandidateUrl||g.cover,g))}" alt="" loading="lazy" aria-hidden="true">`).join('');
  const back=arts[0]?`<img class="series-blur" loading="lazy" alt="" aria-hidden="true" src="${safe(assetUrl(arts[0].coverLocal||arts[0].coverCandidateUrl||arts[0].cover,arts[0]))}">`:'';
  const mark=({"The Legend of Zelda":'Z',"Final Fantasy":'FF',"Resident Evil":'RE',"Pokémon":'PK',"Dragon Quest":'DQ',"Dragon Ball":'DB',"Onimusha":'ON',"Digimon":'DG',"Persona":'P',"Gundam":'G'})[name]||name.split(/\s+/).slice(0,2).map(n=>n[0]||'').join('').toUpperCase();
  const platforms=[...new Set(games.map(g=>g.platform))].slice(0,4).join(' · ');
  return `<button type="button" class="featured-item series-slide" style="--series-hue:${hues[i%hues.length]}" data-series-slide="${safe(name)}" aria-label="แสดงเกมในซีรีส์ ${safe(name)} จำนวน ${games.length} รายการ"><span class="featured-glow"></span>${back}<span class="series-letter" aria-hidden="true">${safe(mark)}</span><span class="series-collage" aria-hidden="true">${collage}</span><span class="series-slide-body"><span class="featured-rank">SERIES ${String(i+1).padStart(2,'0')}</span><span class="series-count">${games.length} เกมในคลัง</span><span class="series-title">${safe(name)}</span><span class="series-platforms">${safe(platforms)}</span><span class="series-open">สำรวจซีรีส์นี้ <span aria-hidden="true">↗</span></span></span></button>`
 }).join('');
 updateFeaturedDots();
}
function updateFeaturedDots(){const track=document.getElementById('featuredTrack'),dotbox=document.getElementById('featuredDots');if(!track||!dotbox)return;const els=[...track.querySelectorAll('.featured-item')];if(!els.length){dotbox.innerHTML='';return;}const cur=Math.max(0,Math.min(els.length-1,els.reduce((best,el,i)=>Math.abs(el.offsetLeft-track.scrollLeft)<Math.abs(els[best].offsetLeft-track.scrollLeft)?i:best,0)));dotbox.innerHTML=els.map((_,i)=>`<button type="button" class="featured-dot ${i===cur?'active':''}" data-featured-index="${i}" aria-label="ไปซีรีส์ที่ ${i+1}" aria-current="${i===cur?'true':'false'}"></button>`).join('');}
function featuredMove(delta){const track=document.getElementById('featuredTrack');if(!track)return;const cards=[...track.querySelectorAll('.featured-item')];if(!cards.length)return;const pos=cards.reduce((best,el,i)=>Math.abs(el.offsetLeft-track.scrollLeft)<Math.abs(cards[best].offsetLeft-track.scrollLeft)?i:best,0);const next=Math.max(0,Math.min(cards.length-1,pos+delta));track.scrollTo({left:cards[next].offsetLeft,behavior:'smooth'});}
function setupFeatured(){const track=document.getElementById('featuredTrack');if(!track)return;track.addEventListener('click',e=>{const tile=e.target.closest('[data-series-slide]');if(!tile)return;const s=tile.getAttribute('data-series-slide');if(!s)return;state.query='';state.genre='';state.platform='';state.art='';state.series=s;state.lane='new';state.sort='recent';state.team='';$('teamSelect').value='';state.limit=32;qs('explore');$('searchMain').value='';$('searchGlobal').value='';$('sortSelect').value='recent';filtersUI();renderLibrary();document.getElementById('library').scrollIntoView({behavior:'smooth',block:'start'});});document.getElementById('featuredPrev').addEventListener('click',()=>featuredMove(-1));document.getElementById('featuredNext').addEventListener('click',()=>featuredMove(1));document.getElementById('featuredDots').addEventListener('click',e=>{const dot=e.target.closest('[data-featured-index]');if(!dot)return;const els=track.querySelectorAll('.featured-item'),i=Number(dot.getAttribute('data-featured-index'));if(els[i])track.scrollTo({left:els[i].offsetLeft,behavior:'smooth'});});let raf=0;track.addEventListener('scroll',()=>{cancelAnimationFrame(raf);raf=requestAnimationFrame(updateFeaturedDots)},{passive:true});}
function toast(msg){$('toast').textContent=msg;$('toast').classList.remove('hide');clearTimeout(toast._t);toast._t=setTimeout(()=>$('toast').classList.add('hide'),3300)}
function modal(title,html){modalReturnFocus=document.activeElement;$('modalTitle').textContent=title;$('modalBody').innerHTML=html;$('modalVeil').classList.add('show');document.body.style.overflow='hidden';$('modalClose').focus()}
function closeModal(){$('modalVeil').classList.remove('show');document.body.style.overflow='';if(modalReturnFocus?.isConnected)modalReturnFocus.focus()}
function findGame(id){return allGames().find(x=>x.id===id)}
function fallbackCopy(text){const el=document.createElement('textarea');el.value=text;el.style.position='fixed';el.style.left='-9999px';document.body.appendChild(el);el.focus();el.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}el.remove();toast(ok?'คัดลอกชื่อเกมแล้ว: '+text:'ชื่อเกมสำหรับค้นหา: '+text)}
