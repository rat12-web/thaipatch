import copy, importlib.util, json
from pathlib import Path

spec=importlib.util.spec_from_file_location('refresh',Path(__file__).with_name('refresh.py'))
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)
base={'id':'test','source':'Memory Card TH','url':'https://memorycardth.com/#/Test/0','platform':'GBA','sourceUpdatedAt':'2026-01-01','patchVersion':'v1','sourceAudit':{'state':'verified','evidence':'prior'},'cover':'https://example.com/cover.png'}
payload=json.dumps({'games':[{'name':'Test','platform':'GBA','patch_updated':'2026-02-01','version':'v2'}]})
def loader(url):
 if url==m.FEEDS['memory']:return payload
 raise TimeoutError('fixture offline')
cat=[copy.deepcopy(base)];report=m.refresh(cat,loader)
assert cat[0]['sourceUpdatedAt']=='2026-02-01' and cat[0]['patchVersion']=='v2'
assert cat[0]['url']==base['url'] and cat[0]['cover']==base['cover'] and cat[0]['sourceAudit']==base['sourceAudit']
assert report['feeds']['gayray']['state']=='failed_preserved'
assert cat[0]['sourceDateAudit']['uploadDateVerified'] is False
assert m.date_value('7 ก.ย. 2569')=='2026-09-07'
for raw in ['2026-02-31','2099-01-01','not a date']:
 try:m.date_value(raw)
 except (ValueError,KeyError):pass
 else:raise AssertionError(raw)
payload=json.dumps({'games':[{'name':'Test','platform':'PSP','patch_updated':'2026-03-01','version':'wrong edition'}]})
cat=[copy.deepcopy(base)];report=m.refresh(cat,loader)
assert cat[0]==base and report['newCandidates'][0]['state']=='pending_route_edition_review'
payload='{"games":[]}'
cat=[copy.deepcopy(base)];report=m.refresh(cat,loader);assert cat[0]==base and report['feeds']['memory']['state']=='failed_preserved'
assert m.parse('retro','id: "x", updated: "2026-01-01", version: "v2"; throw Error("never run")')[0]['id']=='x'
base=json.dumps([{'game':'Existing Game','platform':'GBA'},{'game':'Hidden Game','platform':'NES'}])
overlay=json.dumps({'rows':[{'id':'hidden-game','hidden':1},{'id':'existing-game','entry':{'game':'Existing Game','platform':'GBA','name':'v2'}},{'id':'new-game','entry':{'game':'New Game','platform':'PS1'}}]})
monster=m.parse_monster(base,overlay)
assert {row['id'] for row in monster}=={'existing-game','new-game'}
assert next(row for row in monster if row['id']=='existing-game')['name']=='v2'
assert m.match('monster',{'source':'Monster แปล','url':'https://monster-plae.pages.dev/?game=existing-game'},monster)['name']=='v2'
for broken in ['{}',json.dumps({'rows':[{'id':'wrong','entry':{'game':'New Game'}}]})]:
 try:m.parse_monster(base,broken)
 except ValueError:pass
 else:raise AssertionError('Unsafe Monster overlay accepted')
assert m.candidate_availability('memory',{'download':'/dl/patch.zip'})=='patch_listed'
assert m.candidate_availability('memory',{'download':''})=='not_listed_for_download'
assert m.candidate_availability('nonplae',{'isPublicVisible':True,'isEnabled':False})=='source_disabled'
assert m.candidate_availability('murphy',{'updated':'กำลังเตรียมข้อมูล'})=='release_unconfirmed'
assert m.parse('murphy',"        sh1: { updated: '9 กันยายน 2026', version: 'v1.1' },")[0]['id']=='sh1'
retrogame={'id':'dq5','patches':[{'date':'2026-08-24','version':'1.2','latest':True},{'date':'2026-08-16','version':'1.1'}]}
assert m.parse('retrogame',json.dumps({'games':[retrogame]}))[0]['id']=='dq5'
assert m.match('retrogame',{'source':'แปลไทยเกมเก่า','url':'https://retrogamethaisub.pages.dev/patch.html?game=dq5'},[retrogame])==retrogame
assert m.latest_retrogame_patch(retrogame)==('2026-08-24','1.2')
ambiguous=copy.deepcopy(retrogame);ambiguous['patches'].append({'date':'2026-08-25','version':'1.3','latest':True})
assert m.latest_retrogame_patch(ambiguous) is None
catalog_row={'id':'ext-test','source':'แปลไทยเกมเก่า','url':'https://retrogamethaisub.pages.dev/patch.html?game=dq5','sourceUpdatedAt':None,'sourceDateAudit':{'state':'missing','reason':'No source date'}}
def retrogame_loader(url):
 if url==m.FEEDS['retrogame']:return json.dumps({'games':[retrogame]})
 raise TimeoutError('fixture offline')
cat=[copy.deepcopy(catalog_row)];report=m.refresh(cat,retrogame_loader)
assert report['feeds']['retrogame']['matched']==1 and cat[0]['sourceUpdatedAt']=='2026-08-24'
assert 'reason' not in cat[0]['sourceDateAudit']
print('Updater: date validation, exact edition matching, failed-feed preservation, no remote execution PASS')

# A malformed later row must preserve the entire feed, including its review queue.
original=copy.deepcopy(catalog_row)
previous={'newCandidates':[{'feed':'retrogame','key':'pending-game','state':'pending_route_edition_review','lastSeenAt':'2026-01-01T00:00:00Z'}]}
def malformed_loader(url):
 if url==m.FEEDS['retrogame']:return json.dumps({'games':[retrogame,None]})
 raise TimeoutError('fixture offline')
cat=[copy.deepcopy(original)];report=m.refresh(cat,malformed_loader,previous)
assert cat==[original] and report['feeds']['retrogame']['state']=='failed_preserved'
assert report['newCandidates'][0]['key']=='pending-game'
assert report['newCandidates'][0]['lastSeenAt']=='2026-01-01T00:00:00Z'
assert report['newCandidates'][0]['sourceState']=='stale_feed_unavailable'
# Recovery replaces stale candidates with the source's current rows, not duplicates.
report=m.refresh([copy.deepcopy(original)],retrogame_loader,report)
assert report['feeds']['retrogame']['state']=='ok' and not report['newCandidates']
# Unhashable edition fields previously crashed after fetch and bypassed preservation.
bad=copy.deepcopy(retrogame);bad['patches'][0]['version']=[]
try:m.validate_rows('retrogame',[bad])
except ValueError:pass
else:raise AssertionError('Malformed edition version accepted')
for rows in [[None],[{'id':'x','title':[]}],[{'title':'missing key'}]]:
 try:m.validate_rows('gayray',rows)
 except ValueError:pass
 else:raise AssertionError('Changed row schema accepted')
coverage=m.refresh([{'source':'INorge Game Stream'}],lambda url: (_ for _ in ()).throw(TimeoutError()))['sourceCoverage']
assert coverage==[{'team':'INorge Game Stream','feed':None,'mode':'manual_no_public_adapter'}]
print('Updater: atomic malformed-feed rejection, stale candidate retention, recovery and source coverage PASS')

registry='window.REGISTRY = [\n  {\n    slug: "pokemon-ruby",\n    title: "Ruby Thai",\n    version: "v2.0",\n    platform: "GAME BOY ADVANCE",\n    enabled: true,\n    chains: { file: "never-download.bps" }\n  }\n]; throw Error("never execute");'
rows=m.parse('rommeaow',registry)
assert rows[0]['id']=='pokemon-ruby' and rows[0]['version']=='v2.0'
rom={'id':'rommeaow-028-02','source':'รอมเหมียว (ROMMEAOW)','platform':'GBA','url':'https://rommeaow.com/#patch','patchVersion':'v1.9','sourceUpdatedAt':None}
def rom_loader(url):
 if url==m.FEEDS['rommeaow']:return registry
 raise TimeoutError('fixture offline')
cat=[copy.deepcopy(rom)];report=m.refresh(cat,rom_loader)
assert cat[0]['patchVersion']=='v2.0' and cat[0]['sourceUpdatedAt'] is None and 'sourceDateAudit' not in cat[0]
assert cat[0]['url']==rom['url'] and report['changedRecords']==[rom['id']]
assert m.refresh(cat,rom_loader)['changedRecords']==[]
disabled=registry.replace('enabled: true','enabled: false')
def disabled_loader(url):
 if url==m.FEEDS['rommeaow']:return disabled
 raise TimeoutError('fixture offline')
cat=[copy.deepcopy(rom)];m.refresh(cat,disabled_loader);assert cat==[rom]
wrong=dict(rom,platform='NDS');assert m.match('rommeaow',wrong,rows) is None
try:m.parse('rommeaow',registry.replace('version: "v2.0"','version: remoteCode()'))
except ValueError:pass
else:raise AssertionError('Executable version expression accepted')
print('ROMMEAOW: exact GBA identity, version-only updates, disabled release and no execution PASS')

source90='const GAMES = [\n  {\n    id: "firered-th",\n    subtitle: "Pokemon FireRed Thai",\n    chips: ["GBA", "Thai"],\n  }\n]; throw Error("do not execute");'
rows=m.parse('90s',source90);assert rows==[{'id':'firered-th','title':'Pokemon FireRed Thai','platform':'GBA'}]
game90={'id':'test90','source':'90S Game','platform':'GBA','url':'https://90s-game.pitak2540.workers.dev/?game=firered-th#games:~:text=FireRed','sourceUpdatedAt':None}
assert m.match('90s',game90,rows)==rows[0]
assert m.match('90s',dict(game90,platform='GBC'),rows) is None
def source90_loader(url):
 if url==m.FEEDS['90s']:return source90
 raise TimeoutError('fixture offline')
cat=[copy.deepcopy(game90)];report=m.refresh(cat,source90_loader);assert cat==[game90] and report['feeds']['90s']['matched']==1
try:m.parse('90s',source90.replace('subtitle: "Pokemon FireRed Thai"','subtitle: execute()'))
except ValueError:pass
else:raise AssertionError('Executable title accepted')
print('90S: discovery-only, exact source key/platform, no route/date mutation or execution PASS')

review_path=Path(__file__).resolve().parents[1]/'evidence/2026-10-17/gayray-review.json'
review=json.loads(review_path.read_text(encoding='utf-8'))
catalog=json.loads((review_path.parents[2]/'catalog.json').read_text(encoding='utf-8'))
reviewed=[g for g in catalog if g.get('syncSource',{}).get('feed')=='gayray']
assert len(reviewed)==len(review['games'])==7
for game in reviewed:
 source=next(r for r in review['games'] if r['key']==game['syncSource']['key'])
 assert game['baseEdition']==source['baseEdition'] and game['url']==source['url']
 assert game['cover']==source['cover']['url'] and game['coverAlternatives']
 assert m.match('gayray',game,[{'id':source['key']}])=={'id':source['key']}
 assert game['sourceDateAudit']['uploadDateVerified'] is False
 assert game['platform']=={'FC':'NES','SFC':'SNES'}.get(source['platform'],source['platform'])
 assert game['coverAudit']['localAllowed'] is False
assert any('Aeon Genesis' in g['baseEdition'] and 'brkmnly' in g['baseEdition'] for g in reviewed)
print('Reviewed additions: seven source identities, edition prerequisites, platforms and remote cover evidence PASS')
