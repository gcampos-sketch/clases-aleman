import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const source=resolve(fileURLToPath(new URL('../public/lernspiel/',import.meta.url)));
const hash=createHash('sha256');
for(const name of readdirSync(source).sort()) { hash.update(name);hash.update(readFileSync(join(source,name))); }
export const learningRevision=hash.digest('hex').slice(0,12);
export function versionLearningAssets(publicRoot) {
 const path=join(publicRoot,'lernspiel/index.html');
 const html=readFileSync(path,'utf8').replace(/(src|href)="([^"?]+\.(?:js|svg))([^"#]*)(#[^"]*)?"/g,(_all,attr,url,_query,anchor='')=>`${attr}="${url}?v=${learningRevision}${anchor}"`);
 writeFileSync(path,html);
}
if(process.argv[1] && resolve(process.argv[1])===fileURLToPath(import.meta.url)) versionLearningAssets(process.argv[2]||'.output/public');
