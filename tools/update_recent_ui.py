#!/usr/bin/env python3
"""Update renderRecentUpdates in src/catalog-behavior.js and CSS in src/romthai-theme.css."""
import sys

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

# 1. Update src/catalog-behavior.js
with open('src/catalog-behavior.js', 'r', encoding='utf-8') as f:
    text = f.read()

old_snippet = """function renderRecentUpdates(){
 const track=$('recentUpdatesTrack');
 if(!track)return;
 const recent=[...catalog].filter(g=>g.sourceUpdatedAt||g.sourceUploadedAt||g.date).sort((a,b)=>sourceOrderKey(b)-sourceOrderKey(a)).slice(0,5);
 if(!recent.length){track.innerHTML='<span class="empty-update">ไม่มีรายการอัปเดตล่าสุด</span>';return;}
 track.innerHTML=recent.map(g=>{
  const val=g.sourceUpdatedAt||g.sourceUploadedAt||g.date;
  const d=new Date(verifiedSourceStamp(g)||Date.parse(val));
  const team=g.translatorName||g.source||'';
  const ver=g.patchVersion||g.version||'';
  let changeText=g.patchChanges||(ver?`เวอร์ชัน ${ver}`:'อัปเดตแพตช์');
  if(!g.patchChanges){
   if(g.description&&g.description.includes('แปลทั้งเกม'))changeText=`แพตช์ ${ver||'สมบูรณ์'} (แปลทั้งเกม)`;
   else if(g.description&&g.description.includes('แปลบทพูด'))changeText=`แพตช์ ${ver||'ใหม่'} (เนื้อเรื่อง)`;
  }
  const dateStr=new Intl.DateTimeFormat('th-TH',{day:'numeric',month:'short',timeZone:'Asia/Bangkok'}).format(d);
  const timeNote=g.sourceDateAudit?.rawValue&&g.sourceDateAudit.rawValue.includes(':')?g.sourceDateAudit.rawValue.split(' ')[1]+' น.':'';
  const whenLabel=`${dateStr}${timeNote?' '+timeNote:''}`;
  return `<a class="recent-update-card" href="${safe(sourceUrl(g))}" target="_blank" rel="noopener noreferrer" title="${safe(g.title)} - ${safe(team)}"><span class="update-card-badge">${safe(whenLabel)}</span><div class="update-card-content"><div class="update-card-title"><strong>${safe(g.title)}</strong><span class="update-pf-tag">${safe(g.platform)}</span></div><div class="update-card-meta"><span class="update-team-name">${safe(team)}</span><span class="meta-dot">·</span><span class="update-change">${safe(changeText)}</span></div></div><span class="update-card-arrow" aria-hidden="true">↗</span></a>`;
 }).join('');
}"""

new_snippet = """function renderRecentUpdates(){
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

# Normalize CRLF
text_norm = text.replace('\r\n', '\n')
old_snippet_norm = old_snippet.replace('\r\n', '\n')
assert old_snippet_norm in text_norm, "Old snippet not found in src/catalog-behavior.js"
text_norm = text_norm.replace(old_snippet_norm, new_snippet.replace('\r\n', '\n'))
with open('src/catalog-behavior.js', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text_norm.replace('\n', '\r\n'))

print("Updated src/catalog-behavior.js successfully!")

# 2. Update src/romthai-theme.css
with open('src/romthai-theme.css', 'r', encoding='utf-8') as f:
    css = f.read()

old_css = """.update-card-title{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--txt);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.update-card-title strong{overflow:hidden;text-overflow:ellipsis}
.update-pf-tag{font:800 10px/1 ui-monospace,monospace;color:var(--sub);background:var(--surface);border:1px solid var(--line);padding:2px 5px;border-radius:3px;flex:none}
.update-card-meta{display:flex;align-items:center;gap:4px;font-size:11px;color:var(--sub);margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.update-team-name{font-weight:700;color:var(--txt);flex:none}
.update-change{color:var(--sub);overflow:hidden;text-overflow:ellipsis}
.update-card-arrow{color:var(--mint);font-size:14px;flex:none}"""

new_css = """.update-card-title{display:flex;align-items:center;flex-wrap:wrap;gap:6px;font-size:13px;color:var(--txt);line-height:1.35}
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
.update-card-arrow{color:var(--mint);font-size:14px;flex:none}"""

css_norm = css.replace('\r\n', '\n')
old_css_norm = old_css.replace('\r\n', '\n')
assert old_css_norm in css_norm, "Old CSS snippet not found in src/romthai-theme.css"
css_norm = css_norm.replace(old_css_norm, new_css.replace('\r\n', '\n'))
with open('src/romthai-theme.css', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(css_norm.replace('\n', '\r\n'))

print("Updated src/romthai-theme.css successfully!")
