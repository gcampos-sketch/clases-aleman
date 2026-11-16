import {versionLearningAssets} from './version-learning-assets.mjs';
import {readFileSync,writeFileSync,mkdirSync,rmSync} from 'node:fs';
const html=readFileSync('dist-static/static.html','utf8');
writeFileSync('dist-static/index.html',html);
rmSync('dist-static/static.html');
// Physical entry pages let direct links and refresh work on a plain CDN.
for(const route of ['auth','palabras-en-aleman','numeros-en-aleman','abecedario-aleman','declinaciones-aleman']) {
 mkdirSync(`dist-static/${route}`,{recursive:true});writeFileSync(`dist-static/${route}/index.html`,html);
}
writeFileSync('dist-static/lernspiel/runtime-config.js','window.DEUTSCH_RUNTIME={browserAudioOnly:true};');

versionLearningAssets('dist-static');
