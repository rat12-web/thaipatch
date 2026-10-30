function platformTheme(p){return PLATFORM_REGISTRY[p]||{main:'#76d8c8',strong:'#2b8f84',label:p,colors:['#76d8c8','#2b8f84']}}
function platformLogoUrl(p){return safeUrl(PLATFORM_REGISTRY[p]?.logo||'')}
function teamLogoUrl(team){const t=typeof team==='object'?TEAM_REGISTRY.find(t=>t.id===team.teamId):TEAM_REGISTRY.find(t=>t.team===team);return safeUrl(t?.url||'')}
function coverVars(g){const p=platformTheme(g.platform),t=teamTheme(g.translatorName||g.source),colors=p.colors;const stops=colors.map((c,i)=>`${c} ${i/colors.length*100}% ${(i+1)/colors.length*100}%`).join(',');return `--pf-main:${p.main};--pf-strong:${p.strong};--pf-stripe:linear-gradient(90deg,${stops});--team-main:${t.main};--team-strong:${t.strong};`}
function coverCandidates(g){
 if(g.grouped){const c=g.neutralCover||g.cover||g.coverCandidateUrl||(g.variants&&g.variants.find(v=>v.cover)?.cover);return c?[{url:safeUrl(c),kind:'official_game_art',label:''}]:[];}
 return (g.coverAlternatives?.length?g.coverAlternatives:[{url:g.coverCandidateUrl||g.cover||'',label:g.coverLabel||''}]).map(c=>typeof c==='string'?{url:safeUrl(c),label:''}:({...c,url:safeUrl(c.url)})).filter(c=>c.url);
}
function coverFallback(g){return `<div class="image-fallback"><span>${safe(g.title)}<br><small>ภาพปกไม่พร้อมใช้งาน</small></span></div>`}
function imageHtml(g,cls=''){
 const team=g.translatorName||g.source,logo=g.grouped?'':teamLogoUrl(g),list=coverCandidates(g),art=list[0]?.url||'';
 const images=art?`<img class="artback" aria-hidden="true" loading="lazy" src="${safe(art)}"><img class="realart" loading="lazy" decoding="async" src="${safe(art)}" alt="${safe(list[0]?.label||'ภาพปก '+g.title)}" data-cover-alt="ภาพปก ${safe(g.title)}" data-cover-options="${safe(JSON.stringify(list))}" data-cover-index="0">`:'';
 const badge=g.grouped?`<div class="translatorplate neutralteam"><span class="name">${safe(g.teamCount+' ทีมแปล · เลือกฉบับ')}</span></div>`:`<div class="translatorplate" title="${safe(team)}">${logo?`<img class="teamlogo" src="${safe(logo)}" decoding="async" alt="โลโก้หรือภาพโปรไฟล์ ${safe(team)}">`:''}<span class="name">${safe(team)}</span></div>`;
 return `<div class="${cls} cover" style="${coverVars(g)}">${coverFallback(g)}${images}<div class="wash"></div><div class="cover-console">${platformMark(g)}</div><div class="covertranslator">${badge}</div><span class="cover-origin ${list[0]?.label?'':'hide'}">${safe(list[0]?.label||'')}</span></div>`;
}
function platformMark(g){const p=platformTheme(g.platform),logo=platformLogoUrl(g.platform);return `<span class="console-mark" title="${safe(p.label)}">${logo?`<img class="console-logo" src="${safe(logo)}" loading="lazy" alt="${safe(p.label)}">`:''}<span class="console-name ${logo?'sr-only':''}">${safe(p.label)}</span></span>`}
function mediaLoaded(image){image.dataset.loaded='true';if(image.classList.contains('realart')){image.closest('.cover')?.classList.remove('missing-art');image.closest('.cover')?.classList.add('has-art')}}
function mediaFailed(image){
 if(image.classList.contains('realart')&&image.dataset.coverOptions){
  const options=JSON.parse(image.dataset.coverOptions),next=Number(image.dataset.coverIndex)+1,cover=image.closest('.cover');
  if(options[next]){
   image.dataset.coverIndex=String(next);delete image.dataset.loaded;cover.classList.remove('has-art');image.alt=options[next].label||image.dataset.coverAlt;image.src=options[next].url;
   const back=cover.querySelector('.artback');if(back){back.style.display='';back.src=options[next].url}
   const label=cover.querySelector('.cover-origin');label.textContent=options[next].label||'';label.classList.toggle('hide',!options[next].label);return;
  }
  image.style.display='none';cover.classList.remove('has-art');cover.classList.add('missing-art');const back=cover.querySelector('.artback');if(back)back.style.display='none';return;
 }
 if(image.closest('.featured-track'))image.remove();else image.style.display='none';
 if(image.matches('.console-logo'))image.parentElement.querySelector('.console-name')?.classList.remove('sr-only');
}
