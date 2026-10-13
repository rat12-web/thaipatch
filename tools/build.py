"""Build using only this repository. catalog.json/teams.json/platforms.json are canonical."""
import argparse,json,sys
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def read(name):return (ROOT/name).read_text(encoding='utf-8')
def data(name):return json.loads(read(name))
def constant(name,value):return 'const '+name+'='+json.dumps(value,ensure_ascii=False,separators=(',',':')).replace('<','\\u003c')+';\n'
def outputs():
 catalog=data('catalog.json');assert catalog and len({g['id'] for g in catalog})==len(catalog)
 code=constant('TEAM_REGISTRY',data('teams.json'))+constant('PLATFORM_REGISTRY',data('platforms.json'))+constant('GAME_CATALOG',catalog)
 code+=read('src/core.js')+read('src/catalog-media.js')+'\n'+read('src/catalog-behavior.js')
 css=read('src/base.css')+'\n'+read('src/catalog-style.css')+'\n'+read('src/romthai-theme.css')
 html=read('src/head.html')+'<body>'+read('src/catalog-body.html')+'<script src="./app.js" defer></script><script src="./theme-controls.js" defer></script></body></html>'
 assert not any(s in code for s in ['applyIps','executePatch','defaultVotes','patchB64','data-patch-game'])
 assert not any(s in html for s in ['#vote','#mine','Patch Station','type="file"'])
 return {'app.js':code,'styles.css':css,'index.html':html,'theme-init.js':read('src/theme-init.js'),'theme-controls.js':read('src/theme-controls.js')}
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--check',action='store_true');args=parser.parse_args()
 stale=[]
 for name,value in outputs().items():
  if args.check:
   if not (ROOT/name).exists() or read(name)!=value:stale.append(name)
  else:(ROOT/name).write_text(value,encoding='utf-8')
 if stale:print('Stale generated files: '+', '.join(stale)+'; run python tools/build.py',file=sys.stderr);return 1
 print('Repository-only build '+('matches committed artifacts' if args.check else 'completed'));return 0
if __name__=='__main__':sys.exit(main())
