"""Refresh public patch metadata without executing upstream JS or guessing routes."""
import argparse, datetime as dt, json, re, sys, urllib.request
from pathlib import Path
from urllib.parse import parse_qs, unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
FEEDS = {
 'memory': 'https://memorycardth.com/dl/_patch/site.json',
 'gayray': 'https://gayray.pages.dev/games.json',
 'nonplae': 'https://www.nonplae.com/api/patch-games',
 'retro': 'https://retrospective-patch-library.vercel.app/data/games.js',
 'murphy': 'https://murphy-th.com/',
 'monster': 'https://monster-plae.pages.dev/patches/patches.json',
 'retrogame': 'https://retrogamethaisub.pages.dev/games.json',
 'rommeaow': 'https://rommeaow.com/js/registry.js',
 '90s': 'https://90s-game.pitak2540.workers.dev/',
}
FEED_TEAMS = {
 'memory':'Memory Card TH', 'gayray':'เกเรแปลไทย',
 'nonplae':'นอนแปล (NONPLAE)', 'retro':'RetroSpective',
 'murphy':'Murphy-TH', 'monster':'Monster แปล', 'retrogame':'แปลไทยเกมเก่า',
 'rommeaow':'รอมเหมียว (ROMMEAOW)', '90s':'90S Game',
}
MONSTER_OVERLAY = 'https://monster-plae.pages.dev/api/catalog'
MONTHS = {'มกราคม':1,'กุมภาพันธ์':2,'มีนาคม':3,'เมษายน':4,'พฤษภาคม':5,'มิถุนายน':6,'กรกฎาคม':7,'สิงหาคม':8,'กันยายน':9,'ตุลาคม':10,'พฤศจิกายน':11,'ธันวาคม':12,'มค':1,'กพ':2,'มีค':3,'เมย':4,'พค':5,'มิย':6,'กค':7,'สค':8,'กย':9,'ตค':10,'พย':11,'ธค':12}

def date_value(raw):
 if not isinstance(raw,str): return None
 if re.fullmatch(r'\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2}))?',raw):
  value=dt.datetime.fromisoformat(raw.replace('Z','+00:00'))
  if value.date() > dt.datetime.now(dt.timezone(dt.timedelta(hours=7))).date(): raise ValueError('future date')
  return raw
 m=re.fullmatch(r'(\d{1,2})\s+(\S+)\s+(\d{4})',raw.replace('.',''))
 if not m: raise ValueError('unknown date format')
 year=int(m[3]);year=year-543 if year>=2400 else year
 return date_value(dt.date(year,MONTHS[m[2]],int(m[1])).isoformat())

def fetch(url):
 request=urllib.request.Request(url,headers={'User-Agent':'romthai.app-public-metadata/1.0','Accept':'application/json,text/javascript,text/html'})
 with urllib.request.urlopen(request,timeout=30) as response:
  if urlparse(response.url).hostname != urlparse(url).hostname: raise ValueError('unexpected redirect host')
  data=response.read(4_000_001)
  if len(data)>4_000_000: raise ValueError('response too large')
  return data.decode('utf-8-sig')

def parse(name,text):
 if name=='90s':
  block=re.search(r'const GAMES = \[\n(.*?)\n\];',text.replace('\r',''),re.S)
  if not block: raise ValueError('90S game registry changed')
  text=block[1];starts=list(re.finditer(r'^    id: ("(?:\\.|[^"\\])*")\s*,',text,re.M));rows=[]
  for i,start in enumerate(starts):
   section=text[start.end():starts[i+1].start() if i+1<len(starts) else len(text)]
   title=re.search(r'^    subtitle: ("(?:\\.|[^"\\])*")\s*,',section,re.M)
   platform=re.search(r'^    chips: \[("(?:\\.|[^"\\])*")\s*,',section,re.M)
   if not title or not platform: raise ValueError('90S title/platform changed')
   rows.append({'id':json.loads(start[1]),'title':json.loads(title[1]),'platform':json.loads(platform[1])})
  if not rows or len({r['id'] for r in rows})!=len(rows): raise ValueError('90S game keys changed')
  return rows
 if name=='rommeaow':
  # Top-level quoted scalars only. Nested patch chains and code are never evaluated.
  text=text.replace('\r','')
  if not re.search(r'window\.REGISTRY\s*=\s*\[',text): raise ValueError('registry assignment missing')
  starts=list(re.finditer(r'^    slug: ("(?:\\.|[^"\\])*")\s*,',text,re.M));rows=[]
  for i,start in enumerate(starts):
   section=text[start.end():starts[i+1].start() if i+1<len(starts) else len(text)]
   row={'id':json.loads(start[1])}
   for key in ('title','version','platform'):
    field=re.search(r'^    '+key+r': ("(?:\\.|[^"\\])*")\s*,',section,re.M)
    if not field: raise ValueError('registry scalar missing: '+key)
    row[key]=json.loads(field[1])
   enabled=re.search(r'^    enabled: (true|false)\s*,',section,re.M)
   if not enabled: raise ValueError('registry enabled missing')
   row['enabled']=enabled[1]=='true';rows.append(row)
  if not rows: raise ValueError('registry schema changed')
  return rows
 if name in ('memory','gayray','nonplae','retrogame'):
  rows=json.loads(text)['games']
  if not isinstance(rows,list) or not rows or len(rows)>2000: raise ValueError('feed schema changed')
  return rows
 # Read quoted scalar fields only; never eval source scripts.
 pattern = r'\bid:\s*[\"\']([^\"\']+)[\"\']' if name=='retro' else r'^[ \t]{8,20}(?:[\"\']([^\"\']+)[\"\']|([\w-]+)):\s*\{'
 matches=list(re.finditer(pattern,text,re.M));rows=[]
 for i,m in enumerate(matches):
  section=text[m.end():matches[i+1].start() if i+1<len(matches) else len(text)]
  row={'id':next(v for v in m.groups() if v)}
  for key in ('title','platform','updated','version'):
   field=re.search(r'\b'+key+r':\s*([\"\'])([^\n]*?)\1',section)
   if field: row[key]=field[2]
  if row.get('updated'): rows.append(row)
 if not rows: raise ValueError('source schema changed')
 return rows

def monster_id(row):
 value=row.get('game') or row.get('name')
 if not isinstance(value,str): raise ValueError('monster game title missing')
 return re.sub(r'[^a-z0-9]+','-',value.lower()).strip('-') or 'mod'

def parse_monster(base_text,overlay_text):
 """Mirror the public site's base/overlay selection without executing its JS."""
 base=json.loads(base_text);overlay=json.loads(overlay_text)
 if not isinstance(base,list) or not 1<=len(base)<=2000: raise ValueError('monster base schema changed')
 if not isinstance(overlay,dict) or not isinstance(overlay.get('rows'),list) or overlay.get('error'): raise ValueError('monster overlay unavailable')
 if len(overlay['rows'])>2000: raise ValueError('monster overlay too large')
 entries={monster_id(row):row for row in base if isinstance(row,dict)}
 for change in overlay['rows']:
  if not isinstance(change,dict) or not isinstance(change.get('id'),str): raise ValueError('monster overlay schema changed')
  key=change['id']
  if change.get('hidden'): entries.pop(key,None)
  elif isinstance(change.get('entry'),dict):
   if monster_id(change['entry'])!=key: raise ValueError('monster overlay id mismatch')
   entries[key]=change['entry']
 return [dict(row,id=key) for key,row in entries.items()]

def candidate_availability(name,row):
 """Describe source claims, never certify a game route or a patch artifact."""
 if name=='rommeaow': return 'site_listed' if row.get('enabled') is True else 'source_disabled'
 if name=='memory':
  return 'patch_listed' if isinstance(row.get('download'),str) and row['download'] else 'not_listed_for_download'
 if name=='gayray':
  return 'patch_listed' if row.get('patch') or row.get('patchOptions') else 'not_listed_for_download'
 if name=='nonplae':
  return 'site_listed' if row.get('isPublicVisible') is True and row.get('isEnabled') is True else 'source_disabled'
 if name=='murphy':
  try: return 'site_listed' if date_value(row.get('updated')) else 'release_unconfirmed'
  except (ValueError,KeyError): return 'release_unconfirmed'
 if name=='retrogame': return 'patch_listed' if latest_retrogame_patch(row) else 'release_unconfirmed'
 if name in ('retro','monster','90s'): return 'site_listed'
 raise ValueError('unknown feed')

def latest_retrogame_patch(row):
 patches=row.get('patches')
 if not isinstance(patches,list): return None
 latest=[p for p in patches if isinstance(p,dict) and p.get('latest') is True]
 values={(p.get('date'),p.get('version')) for p in latest}
 if len(values)!=1:return None  # Multiple editions must agree before a single catalog update.
 date,version=next(iter(values))
 return (date,version) if isinstance(date,str) and isinstance(version,str) else None

def match(name,g,rows):
 fragment=unquote(urlparse(g['url']).fragment)
 if name=='memory' and g['source']=='Memory Card TH':
  key=fragment.split('/')[1] if fragment.startswith('/') else fragment.removeprefix('game/');hits=[r for r in rows if r.get('name')==key and r.get('platform')==g['platform']]
 elif name=='gayray' and g['source']=='เกเรแปลไทย': hits=[r for r in rows if r.get('id')==fragment.removeprefix('game=')]
 elif name=='retro' and g['source']=='RetroSpective': hits=[r for r in rows if r.get('id')==fragment.removeprefix('game/')]
 elif name=='nonplae' and urlparse(g['url']).hostname=='www.nonplae.com':
  hits=[r for r in rows if r.get('slug')=='final-fantasy-tactics' and g['id']=='ext-039']
 elif name=='murphy' and g['source']=='Murphy-TH':
  key={'ext-040':'sh1','murphy-028-01':'rahmen','murphy-028-02':'saint-seiya-ougon-densetsu'}.get(g['id']);hits=[r for r in rows if r.get('id')==key]
 elif name=='monster' and g['source']=='Monster แปล':
  key=parse_qs(urlparse(g['url']).query).get('game',[None])[0];hits=[r for r in rows if r.get('id')==key]
 elif name=='90s' and g['source']=='90S Game':
  key=parse_qs(urlparse(g['url']).query).get('game',[None])[0];hits=[r for r in rows if r.get('id')==key and r.get('platform')==g.get('platform')]
 elif name=='rommeaow' and g['source']=='รอมเหมียว (ROMMEAOW)' and g.get('platform')=='GBA':
  key={'rommeaow-028-01':'pokemon-soulgold','rommeaow-028-02':'pokemon-ruby'}.get(g['id']);hits=[r for r in rows if r.get('id')==key and r.get('platform')=='GAME BOY ADVANCE']
 elif name=='retrogame' and g['source']=='แปลไทยเกมเก่า':
  key=parse_qs(urlparse(g['url']).query).get('game',[None])[0];hits=[r for r in rows if r.get('id')==key]
 else: return None
 if len(hits)!=1: return None
 return hits[0]

def validate_rows(name,rows):
 """Reject a changed feed before touching any catalog or review records."""
 if not isinstance(rows,list) or not 1<=len(rows)<=2000: raise ValueError('feed rows changed')
 key_field={'memory':'name','nonplae':'slug'}.get(name,'id')
 for row in rows:
  if not isinstance(row,dict): raise ValueError('feed row must be an object')
  if not isinstance(row.get(key_field),str) or not row[key_field].strip(): raise ValueError('feed key missing')
  for field in ('platform','platformTag','title','titleEn','game','name','version','versionTag'):
   if field in row and row[field] is not None and not isinstance(row[field],str): raise ValueError('feed scalar changed: '+field)
  if name=='retrogame':
   patches=row.get('patches',[])
   if not isinstance(patches,list) or any(not isinstance(p,dict) or any(p.get(k) is not None and not isinstance(p[k],str) for k in ('date','version')) for p in patches): raise ValueError('patch edition schema changed')
 return rows


def refresh(cat,loader=fetch,previous_report=None):
 previous_report=previous_report or {}
 now=dt.datetime.now(dt.timezone.utc).isoformat();report={'checkedAt':now,'automaticRefresh':True,'feeds':{},'changedRecords':[],'newCandidates':[],'facebook':'unavailable_without_authorized_API','newGamePublication':'requires exact route and edition review'}
 report['sourceCoverage']=[{'team':team,'feed':next((name for name,value in FEED_TEAMS.items() if value==team),None),'mode':'automatic_public_feed' if team in FEED_TEAMS.values() else 'manual_no_public_adapter'} for team in sorted({g['source'] for g in cat})]
 for name,url in FEEDS.items():
  try:
   rows=validate_rows(name,parse_monster(loader(url),loader(MONSTER_OVERLAY)) if name=='monster' else parse(name,loader(url)))
  except Exception as exc:
   retained=[dict(candidate,sourceState='stale_feed_unavailable') for candidate in previous_report.get('newCandidates',[]) if candidate.get('feed')==name]
   report['newCandidates'].extend(retained)
   report['feeds'][name]={'state':'failed_preserved','reason':type(exc).__name__+': '+str(exc)[:160],'retainedCandidates':len(retained)};continue
  matched=set();updated=0
  for g in cat:
   row=match(name,g,rows)
   if row is None:continue
   matched.add(id(row))
   if name=='rommeaow':
    version=row.get('version')
    if row.get('enabled') is True and isinstance(version,str) and 0<len(version)<=200:
     audit={'state':'verified_source_reported','value':version,'source':url,'field':'version','sourceKey':row['id']}
     prior=g.get('sourceVersionAudit',{})
     if g.get('patchVersion')!=version or any(prior.get(k)!=v for k,v in audit.items()):
      audit['checkedAt']=now;g.update(version=version,patchVersion=version,sourceVersionAudit=audit)
      report['changedRecords'].append(g['id']);updated+=1
    continue  # Explicit version only; this registry exposes no release dates.
   if name in ('monster','90s'):continue  # Discovery only; no structured patch dates/versions.
   field={'memory':'patch_updated','gayray':'updated','retro':'updated','murphy':'updated','nonplae':'patchUpdatedAt','retrogame':'patches[].date'}[name]
   latest=latest_retrogame_patch(row) if name=='retrogame' else None
   raw=latest[0] if latest else row.get(field)
   if not raw:continue
   try:value=date_value(raw)
   except (ValueError,KeyError):continue
   if not value:continue
   version=latest[1] if latest else row.get('versionTag' if name=='nonplae' else 'version')
   audit=dict(g.get('sourceDateAudit',{}),state='verified_source_reported',kind='patch_updated',value=value,rawValue=raw,precision='timestamp' if 'T' in value else 'day',source=url,field=field,uploadDateVerified=False,sourceVersion=version)
   audit.pop('reason',None)  # A former missing-date explanation must not survive verified source evidence.
   changed=g.get('sourceUpdatedAt')!=value or (isinstance(version,str) and version!=g.get('patchVersion'))
   if changed:
    audit['checkedAt']=now;audit['evidence']='.sync/report.json';g.update(sourceUpdatedAt=value,sourceDateAudit=audit)
    if isinstance(version,str) and len(version)<=200:g.update(version=version,patchVersion=version)
    report['changedRecords'].append(g['id']);updated+=1
  for r in rows:
   if id(r) not in matched:
    report['newCandidates'].append({'feed':name,'source':url,'key':r.get('id') or r.get('slug') or r.get('name'),'title':r.get('game') or r.get('title') or r.get('titleEn') or r.get('name'),'platform':r.get('platform') or r.get('platformTag'),'sourceAvailability':candidate_availability(name,r),'state':'pending_route_edition_review','sourceState':'current','lastSeenAt':now})
  report['feeds'][name]={'state':'ok','records':len(rows),'matched':len(matched),'updated':updated}
 return report

def main():
 args=argparse.ArgumentParser();args.add_argument('--check',action='store_true');opts=args.parse_args()
 cat=json.loads((ROOT/'catalog.json').read_text(encoding='utf-8'));app=(ROOT/'app.js').read_text(encoding='utf-8')
 match_embed=re.search(r'const GAME_CATALOG=(.*);\n',app)
 assert match_embed and json.loads(match_embed[1])==cat,'Embedded data mismatch'
 if opts.check:
  assert len({r['id'] for r in cat})==len(cat)
  assert all(urlparse(r['url']).scheme=='https' for r in cat)
  print('Catalog and embedded data agree');return
 previous_path=ROOT/'.sync/report.json'
 previous=json.loads(previous_path.read_text(encoding='utf-8')) if previous_path.exists() else None
 report=refresh(cat,previous_report=previous)
 assert any(r['state']=='ok' for r in report['feeds'].values()),'All feeds unavailable; keep prior deployment'
 embedded=json.dumps(cat,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
 app=app[:match_embed.start(1)]+embedded+app[match_embed.end(1):]
 (ROOT/'catalog.json').write_text(json.dumps(cat,ensure_ascii=False,indent=2),encoding='utf-8')
 (ROOT/'app.js').write_text(app,encoding='utf-8')
 (ROOT/'.sync/report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps({k:v for k,v in report.items() if k!='newCandidates'},ensure_ascii=True))

if __name__=='__main__':main()
