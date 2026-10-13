const {spawnSync}=require('node:child_process'),path=require('node:path');
for(const file of ['qa-source-dates.cjs','qa-catalog.cjs','qa-themes.cjs','qa-platform-cards.cjs']){
 const result=spawnSync(process.execPath,[path.join(__dirname,file)],{stdio:'inherit'});
 if(result.status!==0)process.exit(result.status||1);
}
