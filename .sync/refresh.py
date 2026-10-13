"""Refresh public patch metadata without executing upstream JS or guessing routes."""
import argparse, datetime as dt, json, re, sys, urllib.request
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parents[1]
FEEDS = {
 'memory': 'https://memorycardth.com/dl/_patch/site.json',
 'gayray': 'https://gayray.pages.dev/games.json',
 'nonplae': 'https://www.nonplae.com/api/patch-games',
 'retro': 'https://retrospective-patch-library.vercel.app/data/games.js',
 'murphy': 'https://murphy-th.vercel.app/',
}
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
 if name in ('memory','gayray','nonplae'):
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
 else: return None
 if len(hits)!=1: return None
 return hits[0]

def refresh(cat,loader=fetch):
 now=dt.datetime.now(dt.timezone.utc).isoformat();report={'checkedAt':now,'automaticRefresh':True,'feeds':{},'changedRecords':[],'newCandidates':[],'facebook':'unavailable_without_authorized_API','newGamePublication':'requires exact route and edition review'}
 for name,url in FEEDS.items():
  try: rows=parse(name,loader(url))
  except Exception as exc:
   report['feeds'][name]={'state':'failed_preserved','reason':type(exc).__name__+': '+str(exc)[:160]};continue
  matched=set();updated=0
  for g in cat:
   row=match(name,g,rows)
   if row is None:continue
   matched.add(id(row))
   field={'memory':'patch_updated','gayray':'updated','retro':'updated','murphy':'updated','nonplae':'patchUpdatedAt'}[name]
   raw=row.get(field)
   if not raw:continue
   try:value=date_value(raw)
   except (ValueError,KeyError):continue
   if not value:continue
   version=row.get('versionTag' if name=='nonplae' else 'version')
   audit=dict(g.get('sourceDateAudit',{}),state='verified_source_reported',kind='patch_updated',value=value,rawValue=raw,precision='timestamp' if 'T' in value else 'day',source=url,field=field,uploadDateVerified=False,sourceVersion=version)
   changed=g.get('sourceUpdatedAt')!=value or (isinstance(version,str) and version!=g.get('patchVersion'))
   if changed:
    audit['checkedAt']=now;audit['evidence']='.sync/report.json';g.update(sourceUpdatedAt=value,sourceDateAudit=audit)
    if isinstance(version,str) and len(version)<=200:g.update(version=version,patchVersion=version)
    report['changedRecords'].append(g['id']);updated+=1
  for r in rows:
   if id(r) not in matched:report['newCandidates'].append({'feed':name,'source':url,'key':r.get('id') or r.get('slug') or r.get('name'),'title':r.get('title') or r.get('titleEn') or r.get('name'),'platform':r.get('platform') or r.get('platformTag'),'state':'pending_route_edition_review'})
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
 report=refresh(cat)
 assert any(r['state']=='ok' for r in report['feeds'].values()),'All feeds unavailable; keep prior deployment'
 embedded=json.dumps(cat,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')
 app=app[:match_embed.start(1)]+embedded+app[match_embed.end(1):]
 (ROOT/'catalog.json').write_text(json.dumps(cat,ensure_ascii=False,indent=2),encoding='utf-8')
 (ROOT/'app.js').write_text(app,encoding='utf-8')
 (ROOT/'.sync/report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
 print(json.dumps({k:v for k,v in report.items() if k!='newCandidates'},ensure_ascii=True))

if __name__=='__main__':main()
