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
