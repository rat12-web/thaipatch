const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.jpg':'image/jpeg'};
function start(port=0){
 const server=http.createServer((request,response)=>{
  let rel;try{rel=decodeURIComponent(new URL(request.url,'http://localhost').pathname).replace(/^\/thaipatch\/?/,'').replace(/^\//,'')||'index.html'}catch{response.writeHead(400);response.end();return}
  // Serve only deployable files; local source, Git and environment files are excluded.
  const allowed=['index.html','app.js','styles.css','theme-init.js','theme-controls.js','catalog.json','teams.json','platforms.json'];
  const file=path.resolve(root,rel);
  if(!file.startsWith(root+path.sep)||(!allowed.includes(rel)&&!/^assets\/[\w.-]+\.jpg$/.test(rel))||!fs.existsSync(file)){response.writeHead(404);response.end();return}
  response.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');response.end(fs.readFileSync(file));
 });server.listen(port,'127.0.0.1');return server;
}
module.exports={start};
if(require.main===module){const server=start(Number(process.env.PORT||4173));server.on('listening',()=>console.log('Catalog: http://127.0.0.1:'+server.address().port+'/'));}
