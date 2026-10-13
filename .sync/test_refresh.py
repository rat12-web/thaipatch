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
print('Updater: date validation, exact edition matching, failed-feed preservation, no remote execution PASS')
