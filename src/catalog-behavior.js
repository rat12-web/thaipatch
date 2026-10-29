function allGames(){return catalog}
function seriesOf(g){return g.series||'เกมอื่น ๆ'}
function seriesPopularity(g){const n=SERIES_RANK.indexOf(seriesOf(g));return n<0?999:n}
function qs(){document.title='แปลไทยบอกด้วย · romthai.app — คลังเกมแปลไทย'}
function matchesFilters(g){
 const tokens=normalizeSearch(state.query).split(' ').filter(Boolean);
 return tokens.every(t=>normalizeSearch([g.title,g.translatorName,g.source,g.platform,g.genre,seriesOf(g),g.patchChanges||'',g.patchVersion||''].join(' ')).includes(t))&&(!state.platform||g.platform===state.platform)&&(!state.series||seriesOf(g)===state.series)&&(!state.team||(g.translatorName||g.source)===state.team)&&(!state.genre||g.genre===state.genre)&&(!state.art||g.artStyle===state.art);
}
function verifiedSourceStamp(g){
 const a=g.sourceDateAudit;if(!a||!['verified_source_reported','verified_file_upload'].includes(a.state))return 0;
 if(a.kind==='patch_uploaded'&&a.uploadDateVerified!==true)return 0;
 const value=a.kind==='patch_uploaded'?g.sourceUploadedAt:a.kind==='patch_updated'?g.sourceUpdatedAt:null;
 if(!value||value!==a.value||!/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?$/.test(value))return 0;
 const stamp=Date.parse(value);if(!Number.isFinite(stamp)||stamp<=0||stamp>Date.now())return 0;
 const day=value.slice(0,10);if(new Date(Date.parse(day+'T00:00:00Z')).toISOString().slice(0,10)!==day)return 0;
 return stamp;
}
function newestSourceVariant(g){return (g.variants||[g]).filter(matchesFilters).reduce((best,row)=>verifiedSourceStamp(row)>(best?verifiedSourceStamp(best):0)?row:best,null)}
function sourceOrderKey(g){const row=newestSourceVariant(g);return row?verifiedSourceStamp(row):0}
function sourceDateHtml(g){const row=newestSourceVariant(g);if(!row)return '';const value=row.sourceDateAudit.value,date=new Intl.DateTimeFormat('th-TH',{dateStyle:'medium',timeZone:'Asia/Bangkok'}).format(new Date(verifiedSourceStamp(row)));return `<span class="source-date" data-source-date="${safe(value)}" title="${safe(row.translatorName||row.source)} · ${safe(row.sourceDateAudit.kind==='patch_uploaded'?'วันอัปโหลดที่ต้นทาง':'วันที่ต้นทางระบุว่าอัปเดตแพตช์')}">${row.sourceDateAudit.kind==='patch_uploaded'?'อัปโหลด':'อัปเดต'}${g.grouped?'ล่าสุดในกลุ่ม':''} <time datetime="${safe(value)}">${safe(date)}</time></span>`}
function filtered(){
 const groups=groupGameEntries(allGames()).filter(g=>(g.variants||[g]).some(matchesFilters));
 if(state.sort==='alpha')groups.sort((a,b)=>a.title.localeCompare(b.title,'th'));
 else if(state.sort==='series')groups.sort((a,b)=>seriesPopularity(a)-seriesPopularity(b)||a.title.localeCompare(b.title));
 else if(state.sort==='added')groups.sort((a,b)=>(b.catalogAddedAt||'').localeCompare(a.catalogAddedAt||'')||a.title.localeCompare(b.title));
 else if(state.sort==='playtime')groups.sort((a,b)=>(a.playTimeHours||999)-(b.playTimeHours||999)||a.title.localeCompare(b.title,'th'));
 else if(state.sort==='playtime_desc')groups.sort((a,b)=>(b.playTimeHours||0)-(a.playTimeHours||0)||a.title.localeCompare(b.title,'th'));
 else groups.sort((a,b)=>sourceOrderKey(b)-sourceOrderKey(a)||a.title.localeCompare(b.title,'th'));
 return groups;
}
function patchNoteHtml(g){
 const row=newestSourceVariant(g)||g;
 const ver=(row.patchVersion||row.version||'').trim();
 const cat=row.patchCategory||(ver&&!/^v?1\.0(\.0)?$/i.test(ver)?'fix_update':'full_release');
 const badge=cat==='fix_update'?`🔧 แพตช์แก้ไข ${ver}`.trim():cat==='partial_beta'?`🧪 แพตช์บางส่วน ${ver}`.trim():`✨ แพตช์แปลครบ ${ver}`.trim();
 const detail=row.patchChanges||'ดูรายละเอียดการแปลที่เว็บไซต์ต้นทาง';
 return `<div class="card-patch-info" data-patch-cat="${safe(cat)}"><span class="patch-cat-badge">${safe(badge)}</span><span class="patch-change-text" title="${safe(detail)}">${safe(detail)}</span></div>`;
}
function card(g){
 const team=g.grouped?`${g.variants.length} ฉบับ · ${g.teamCount} ทีมแปล`:(g.translatorName||g.source);
 const action=g.grouped?'เลือกทีม / ฉบับ':'ดูแพตช์';
 const playTimeTag=g.playTimeHours?`<span class="meta-dot">·</span><span class="card-playtime" title="เวลาเล่นเนื้อเรื่องหลักโดยประมาณ">⏱️ ~${g.playTimeHours} ชม.</span>`:'';
 const body=`<span class="platform-stripe" aria-hidden="true"></span>${imageHtml(g)}<div class="card-info"><h3 class="card-name">${safe(g.title)}</h3><div class="card-meta"><span>${safe(g.genre||'เกมแปลไทย')}</span>${playTimeTag}</div>${patchNoteHtml(g)}${sourceDateHtml(g)}<p class="catalog-card-team">${safe(team)}</p><span class="catalog-card-action">${action}<span aria-hidden="true">↗</span></span></div>`;
 const attrs=`style="${coverVars(g)}" data-platform="${safe(g.platform)}"`;
 return g.grouped?`<button type="button" class="gcard group-card" ${attrs} data-group-open="${safe(g.groupKey)}">${body}</button>`:`<a class="gcard" ${attrs} data-source-direct="${safe(g.id)}" href="${safe(sourceUrl(g))}" target="_blank" rel="noopener noreferrer" title="${safe(g.title)}">${body}</a>`;
}
function renderLibrary(){const list=filtered();$('resultText').textContent=`พบ ${list.length} เกม · ${catalog.length} รายการแพตช์ในคลัง`;$('cards').innerHTML=list.slice(0,state.limit).map(card).join('')||'<div class="empty">ไม่พบเกมที่ตรงกับคำค้น ลองเปลี่ยนคำค้นหาหรือล้างตัวกรอง</div>';$('moreBtn').classList.toggle('hide',state.limit>=list.length)}
function metrics(){$('metricGames').textContent=groupGameEntries(catalog).length;$('metricPatches').textContent=catalog.length;$('metricTeams').textContent=new Set(catalog.map(g=>g.translatorName||g.source)).size;$('metricPlatforms').textContent=new Set(catalog.map(g=>g.platform)).size}
function renderRecentUpdates(){
 const track=$('recentUpdatesTrack');
 if(!track)return;
 const recent=[...catalog].filter(g=>g.sourceUpdatedAt||g.sourceUploadedAt||g.date).sort((a,b)=>sourceOrderKey(b)-sourceOrderKey(a)).slice(0,8);
 if(!recent.length){track.innerHTML='<span class="empty-update">ไม่มีรายการอัปเดตล่าสุด</span>';return;}
 track.innerHTML=recent.map(g=>{
  const val=g.sourceUpdatedAt||g.sourceUploadedAt||g.date;
  const d=new Date(verifiedSourceStamp(g)||Date.parse(val));
  const team=g.translatorName||g.source||'';
  const ver=g.patchVersion||g.version||'';
  const isFix=g.patchCategory==='fix_update'||(g.patchChanges&&g.patchChanges.includes('แก้ไข'));
  const actionText=isFix?'อัปเดตแก้ไขเกม':'อัปเดตเกม';
  let changeText=g.patchChanges||(ver?`เวอร์ชัน ${ver}`:'อัปเดตแพตช์');
  if(!g.patchChanges){
   if(g.description&&g.description.includes('แปลทั้งเกม'))changeText=`แปลสมบูรณ์ทั้งเกม ${ver||''}`.trim();
   else if(g.description&&g.description.includes('แปลบทพูด'))changeText=`แปลเนื้อเรื่องและบทสนทนา ${ver||''}`.trim();
  }
  const dateStr='วันที่ '+new Intl.DateTimeFormat('th-TH',{day:'numeric',month:'short',timeZone:'Asia/Bangkok'}).format(d);
  const timeNote=g.sourceDateAudit?.rawValue&&g.sourceDateAudit.rawValue.includes(':')?g.sourceDateAudit.rawValue.split(' ')[1]+' น.':'';
  const whenLabel=`${dateStr}${timeNote?' '+timeNote:''}`;
  return `<a class="recent-update-card" href="${safe(sourceUrl(g))}" target="_blank" rel="noopener noreferrer" title="${safe(g.title)} - ${safe(team)}"><span class="update-card-badge">${safe(whenLabel)}</span><div class="update-card-content"><div class="update-card-title"><span class="update-team-name">${safe(team)}</span><span class="update-action-tag ${isFix?'tag-fix':'tag-update'}">${safe(actionText)}</span><strong>${safe(g.title)}</strong><span class="update-pf-tag">${safe(g.platform)}</span></div><div class="update-card-meta"><span class="update-change-icon">${isFix?'🔧':'✨'}</span><span class="update-change" title="${safe(changeText)}">${safe(changeText)}</span></div></div><span class="update-card-arrow" aria-hidden="true">↗</span></a>`;
 }).join('');
}
function renderAll(){filtersUI();$('teamSelect').innerHTML='<option value="">ทุกทีมแปล</option>'+[...new Set(catalog.map(g=>g.translatorName||g.source))].sort((a,b)=>a.localeCompare(b,'th')).map(t=>`<option value="${safe(t)}">${safe(t)}</option>`).join('');$('teamSelect').value=state.team;renderLibrary();renderFeatured();renderRecentUpdates();metrics()}
function sourceNote(g){if(g.sourceLocation?.method==='patch_lab')return 'เข้าหน้า Patch Lab โดยตรง ต้นทางตรวจเกมจากไฟล์ ROM ของคุณ หรือเลือกเกมในช่องค้นหา';if(g.sourceLocation?.method==='text_fragment')return 'เปิดตรงตำแหน่ง '+g.title+' ที่ต้นทาง กดปกเกมเพื่อเปิดรายละเอียด/แพตช์';if(g.sourceAudit?.state==='failed_selection'||g.sourceAudit?.state==='default_match_inconclusive')return 'เมื่อถึงเว็บไซต์ 90S Game ให้เลือก '+g.title+' ในช่องเกมก่อนดำเนินการต่อ';if(g.sourceAudit?.state==='directory_only')return 'ลิงก์เปิดคลังของทีมแปล กรุณาเลือกเกมนี้ที่เว็บไซต์ต้นทาง';if(g.sourceAudit?.state==='inferred')return 'ยังไม่ยืนยันหน้าเกมเฉพาะ หากเปิดแล้วไม่ตรงเกม ให้ค้นหาชื่อเกมที่เว็บไซต์ต้นทาง';return ''}
function groupPicker(key){const variants=catalog.filter(g=>gameGroupKey(g)===key);if(!variants.length)return;
 const name=canonicalTitle(variants[0]);const items=variants.map(g=>{const team=g.translatorName||g.source,url=sourceUrl(g),art=assetUrl(g.coverCandidateUrl||g.cover||'',g),logo=teamLogoUrl(g),note='';return `<a class="variant-link" href="${safe(url)}" target="_blank" rel="noopener noreferrer"><span class="variant-media">${art?`<img src="${safe(art)}" alt="ปก ${safe(g.title)}" loading="lazy">`:''}</span><span class="variant-copy"><span class="variant-source">${logo?`<img class="variant-logo" src="${safe(logo)}" alt="" loading="lazy">`:''}<b>${safe(team)}</b></span><span class="variant-name">${safe(g.title)} · ${safe(g.platform)}</span><small class="variant-version">${safe((g.baseEdition?'ฐาน '+g.baseEdition+' · ':'')+'แพตช์ '+(g.patchVersion||g.version||'ดูที่ต้นทาง'))}</small>${g.patchChanges?`<small class="variant-changes">${safe(g.patchChanges)}</small>`:''}${note?`<small class="team-route">${safe(note)}</small>`:''}</span><span class="variant-arrow" aria-hidden="true">↗</span></a>`}).join('');
 modal(name,`<div class="team-choice-head"><p>เลือกทีมแปลหรือฉบับที่ต้องการ แต่ละตัวเลือกจะเปิดเว็บไซต์เจ้าของผลงานในแท็บใหม่</p></div><div class="team-choice-list">${items}</div>`);
}
function reset(){Object.assign(state,{query:'',platform:'',genre:'',art:'',series:'',team:'',sort:'recent',limit:24});$('searchGlobal').value='';$('searchMain').value='';$('sortSelect').value='recent';renderAll()}
function events(){
 document.addEventListener('click',e=>{const group=e.target.closest('[data-group-open]');if(group){groupPicker(group.dataset.groupOpen)}});
 document.addEventListener('keydown',e=>{if(!$('modalVeil').classList.contains('show'))return;if(e.key==='Escape'){closeModal();return}if(e.key==='Tab'){const els=[...$('modalVeil').querySelectorAll('button,a[href]')].filter(x=>x.getClientRects().length),first=els[0],last=els.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}});
 $('modalClose').onclick=closeModal;$('modalVeil').onclick=e=>{if(e.target===$('modalVeil'))closeModal()};
 for(const id of ['searchGlobal','searchMain'])$(id).oninput=e=>{state.query=e.target.value;state.limit=24;$('searchGlobal').value=state.query;$('searchMain').value=state.query;renderLibrary()};$('searchGlobal').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();$('library').scrollIntoView({behavior:'smooth',block:'start'});$('searchMain').focus({preventScroll:true})}};
 for(const key of ['platform','series','team','genre','art','sort'])$(key+'Select').onchange=e=>{state[key]=e.target.value;state.limit=24;renderLibrary()};$('moreBtn').onclick=()=>{state.limit+=24;renderLibrary()};$('resetFilters').onclick=reset;
 document.addEventListener('load',e=>{if(e.target instanceof HTMLImageElement)mediaLoaded(e.target)},true);
 document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement)mediaFailed(e.target)},true);
 document.querySelectorAll('img').forEach(image=>{if(image.complete&&image.naturalWidth>0)mediaLoaded(image)});
}
function init(){renderAll();events();setupFeatured();qs()}
init();
