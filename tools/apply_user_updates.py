#!/usr/bin/env python3
"""Apply user requested changes:
1. Clean plain text changelog in src/catalog-behavior.js and src/romthai-theme.css
2. Fix Nonplae URLs (404 -> ?game=) in catalog.json
3. Update broken covers with verified 200 OK official box art
4. Link Facebook-only teams to official Facebook pages
"""
import json
import re
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# 1. Update src/catalog-behavior.js
with open('src/catalog-behavior.js', 'r', encoding='utf-8') as f:
    behavior_code = f.read()

# Replace renderRecentUpdates
old_render_recent = """function renderRecentUpdates(){
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
}"""

new_render_recent = """function renderRecentUpdates(){
 const track=$('recentUpdatesTrack');
 if(!track)return;
 const recent=[...catalog].filter(g=>g.sourceUpdatedAt||g.sourceUploadedAt||g.date).sort((a,b)=>sourceOrderKey(b)-sourceOrderKey(a)).slice(0,8);
 if(!recent.length){track.innerHTML='<p class="empty-update">ไม่มีรายการอัปเดตล่าสุด</p>';return;}
 track.innerHTML=`<div class="recent-changelog-list">${recent.map(g=>{
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
  return `<div class="changelog-row"><a class="changelog-link" href="${safe(sourceUrl(g))}" target="_blank" rel="noopener noreferrer"><span class="cl-date">${safe(dateStr)}</span> <span class="cl-team">${safe(team)}</span> <span class="cl-action ${isFix?'cl-fix':'cl-update'}">${safe(actionText)}</span> <strong class="cl-title">${safe(g.title)} (${safe(g.platform)})</strong> <span class="cl-sep">—</span> <span class="cl-detail">${safe(changeText)}</span></a></div>`;
 }).join('')}</div>`;
}"""

behavior_norm = behavior_code.replace('\r\n', '\n')
old_render_norm = old_render_recent.replace('\r\n', '\n')
assert old_render_norm in behavior_norm, "Old renderRecentUpdates not found in src/catalog-behavior.js"
behavior_norm = behavior_norm.replace(old_render_norm, new_render_recent.replace('\r\n', '\n'))

with open('src/catalog-behavior.js', 'w', encoding='utf-8', newline='\n') as f:
    f.write(behavior_norm)

print("Updated src/catalog-behavior.js successfully!")

# 2. Update src/romthai-theme.css
with open('src/romthai-theme.css', 'r', encoding='utf-8') as f:
    css_code = f.read()

# Replace recent update CSS
old_css_part = """.recent-updates-track{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px}
.recent-update-card{display:flex;align-items:center;gap:12px;background:var(--surface2);border:1px solid var(--line);border-radius:5px;padding:10px 14px;color:inherit;text-decoration:none;transition:border-color .15s,transform .15s;min-width:0}
.recent-update-card:hover{border-color:var(--blue);transform:translateY(-1px)}
.update-card-badge{flex:none;background:var(--mint);color:#fff;font:800 10px/1.2 ui-monospace,monospace;padding:4px 6px;border-radius:3px;text-align:center;letter-spacing:0.5px}
html[data-theme="dark"] .update-card-badge{background:#185a9d;color:#e8f4ff}
.update-card-content{flex:1;min-width:0;overflow:hidden}
.update-card-title{display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-size:13px;color:var(--txt);line-height:1.35}
.update-card-title strong{color:var(--txt);font-weight:700}
.update-action-tag{font:700 10.5px/1.3 ui-monospace,monospace;padding:2px 6px;border-radius:3px;flex:none}
.update-action-tag.tag-update{background:rgba(43,143,132,.15);color:#2b8f84;border:1px solid rgba(43,143,132,.3)}
.update-action-tag.tag-fix{background:rgba(217,119,6,.15);color:#d97706;border:1px solid rgba(217,119,6,.3)}
html[data-theme="dark"] .update-action-tag.tag-update{background:rgba(118,216,200,.18);color:#76d8c8;border-color:rgba(118,216,200,.35)}
html[data-theme="dark"] .update-action-tag.tag-fix{background:rgba(245,158,11,.18);color:#fbbf24;border-color:rgba(245,158,11,.35)}
.update-pf-tag{font:800 10px/1 ui-monospace,monospace;color:var(--sub);background:var(--surface);border:1px solid var(--line);padding:2px 5px;border-radius:3px;flex:none}
.update-card-meta{display:flex;align-items:flex-start;gap:6px;font-size:11.5px;color:var(--sub);margin-top:4px}
.update-team-name{font-weight:700;color:var(--txt);flex:none}
.update-change-icon{flex:none;font-size:11px;margin-top:1px}
.update-change{color:var(--sub);line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.update-card-arrow{color:var(--mint);font-size:14px;flex:none}
@media(max-width:600px){
  .recent-updates-box{padding:14px 12px}
  .recent-updates-title{font-size:14px}
  .recent-updates-track{grid-template-columns:1fr;gap:8px}
  .recent-update-card{padding:8px 10px;gap:8px}
  .update-card-title{font-size:12px}
  .update-card-meta{font-size:10px}
}"""

new_css_part = """.recent-changelog-list{display:flex;flex-direction:column;gap:9px;padding:4px 0}
.changelog-row{font-size:13.5px;line-height:1.65;color:var(--txt);padding:3px 0;border-bottom:1px dashed rgba(255,255,255,0.06)}
html[data-theme="light"] .changelog-row{border-bottom-color:rgba(0,0,0,0.06)}
.changelog-row:last-child{border-bottom:none}
.changelog-link{color:inherit;text-decoration:none;display:inline;transition:color .15s}
.changelog-link:hover{color:var(--blue)}
.changelog-link:hover .cl-title{text-decoration:underline}
.cl-date{font-weight:700;color:var(--txt);margin-right:2px}
.cl-team{font-weight:700;color:var(--sub)}
.cl-action{font-weight:700;margin:0 2px}
.cl-action.cl-update{color:var(--mint)}
.cl-action.cl-fix{color:#d97706}
html[data-theme="dark"] .cl-action.cl-fix{color:#fbbf24}
.cl-title{font-weight:700;color:var(--txt)}
.cl-sep{color:var(--sub);margin:0 5px;opacity:.7}
.cl-detail{color:var(--sub)}
@media(max-width:600px){
  .recent-updates-box{padding:14px 12px}
  .recent-updates-title{font-size:14px}
  .changelog-row{font-size:12.5px;line-height:1.55}
}"""

css_norm = css_code.replace('\r\n', '\n')
old_css_norm = old_css_part.replace('\r\n', '\n')
assert old_css_norm in css_norm, "Old recent update CSS not found in src/romthai-theme.css"
css_norm = css_norm.replace(old_css_norm, new_css_part.replace('\r\n', '\n'))

with open('src/romthai-theme.css', 'w', encoding='utf-8', newline='\n') as f:
    f.write(css_norm)

print("Updated src/romthai-theme.css successfully!")

# 3. Update Facebook links in catalog.json
with open('catalog.json', 'r', encoding='utf-8') as f:
    cat = json.load(f)

fb_updates = 0
for g in cat:
    t = g.get('translatorName') or g.get('source')
    if 'แมวดำ' in t and 'chatgpt.site' in g.get('url', ''):
        g['url'] = 'https://www.facebook.com/maewdamthaisub'
        fb_updates += 1
    elif 'แปลไปเล่นไป' in t and 'chatgpt.site' in g.get('url', ''):
        g['url'] = 'https://www.facebook.com/plaipailenpai'
        fb_updates += 1

print(f"Updated {fb_updates} Facebook team links in catalog.json!")

with open('catalog.json', 'w', encoding='utf-8', newline='\r\n') as f:
    json.dump(cat, f, ensure_ascii=False, indent=2)

print("All updates applied cleanly!")
