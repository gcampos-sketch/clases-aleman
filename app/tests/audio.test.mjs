import {test} from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';
const source=fs.readFileSync(new URL('../public/lernspiel/audio.js',import.meta.url),'utf8');
function setup(enabled=false) {
  const utterances=[],calls={pause:0,resume:0,cancel:0,play:0};
  const synth={getVoices:()=>[],speak:u=>utterances.push(u),cancel:()=>calls.cancel++,pause:()=>calls.pause++,resume:()=>calls.resume++};
  class Audio {
    pause(){} removeAttribute(){} load(){}
    play(){calls.play++;return this.playResult??Promise.resolve()}
  }
  const context=vm.createContext({Audio,SpeechSynthesisUtterance:class{constructor(text){this.text=text}},
    window:{speechSynthesis:synth},localStorage:{getItem:()=>null,setItem(){}},
    fetch:async()=>({ok:true,json:async()=>({enabled})}),getDeVoice:()=>({lang:'de-DE'}),
    document:{querySelectorAll:()=>[],getElementById:()=>null,createElement:()=>({setAttribute(){},style:{},remove(){}}),body:{appendChild(){}}},
    URLSearchParams,AbortController,setTimeout:()=>{},clearTimeout:()=>{},console});
  vm.runInContext(source+';globalThis.testTTS=TTS;',context);
  return {tts:context.testTTS,utterances,calls};
}
test('browser audio supports pause, resume and completion',async()=>{
  const {tts,utterances,calls}=setup();await tts.capabilities;let ended=0;
  tts.speak('Guten Tag',1,()=>ended++);assert.equal(utterances.length,1);
  assert.equal(utterances[0].lang,'de-DE');tts.pause();tts.resume();
  assert.equal(calls.pause,1);assert.equal(calls.resume,1);
  utterances[0].onend();assert.equal(ended,1);assert.equal(tts.playing,false);
});
test('browser fallback reads every phrase and completes a sequence once',async()=>{
  const {tts,utterances}=setup();await tts.capabilities;let ended=0;
  tts.speakSequence(['eins','zwei','drei'],1,()=>ended++);
  for(let i=0;i<3;i++)utterances[i].onend();
  assert.deepEqual(utterances.map(u=>u.text),['eins','zwei','drei']);assert.equal(ended,1);
});
test('stop cancels native speech and ignores late callbacks',async()=>{
  const {tts,utterances,calls}=setup();await tts.capabilities;
  tts.speakSequence(['eins','zwei'],1,()=>assert.fail('cancelled sequence completed'));
  const old=utterances[0];tts.stop();old.onend();
  assert.equal(utterances.length,1);assert.equal(tts.playing,false);assert.ok(calls.cancel>=2);
});
test('cloud media error plus rejected play only starts one fallback utterance',async()=>{
  const {tts,utterances}=setup(true);await tts.capabilities;
  let reject;tts.audio.playResult=new Promise((_,r)=>reject=r);
  const pending=tts.speakCloud('Hallo',1);tts.audio.onerror();reject(Error('media error'));await pending;
  assert.equal(utterances.length,1);
});
test('cloud speed is applied once, browser speed follows selected mode',async()=>{
  const {tts}=setup(true);await tts.capabilities;tts.setSpeed('lento');
  await tts.speakCloud('Hallo',1);assert.equal(tts.audio.playbackRate,1);
  assert.match(tts.audio.src,/rate=0.78/);
});
test('stopping before capability detection cannot start delayed audio',async()=>{
  const {tts,utterances}=setup();tts.speak('Hallo',1);tts.stop();await tts.capabilities;
  await Promise.resolve();assert.equal(utterances.length,0);
});

test('long browser passages are chunked, complete once and can be cancelled between chunks',async()=>{
 const {tts,utterances}=setup();await tts.capabilities;let ended=0;
 const text='Das ist ein langer deutscher Satz mit vielen Wörtern. '.repeat(15);
 tts.speak(text,1,()=>ended++);
 for(let i=0;i<utterances.length;i++) { assert.ok(utterances[i].text.length<=180); utterances[i].onend(); }
 assert.ok(utterances.length>1);assert.equal(ended,1);assert.equal(tts.playing,false);
 tts.speak(text);const last=utterances.at(-1);tts.stop();const count=utterances.length;last.onend();assert.equal(utterances.length,count);
});
test('completion callback starting another clip does not finish the new clip',async()=>{
 const {tts,utterances}=setup();await tts.capabilities;
 tts.speak('eins',1,()=>tts.speak('zwei'));utterances[0].onend();
 assert.equal(tts.playing,true);assert.equal(tts.current.text,'zwei');utterances[1].onend();assert.equal(tts.playing,false);
});

test('the explicit slow pronunciation button is slower than normal playback',async()=>{
 const {tts,utterances}=setup();await tts.capabilities;
 tts.speak('Hallo',0.6);assert.equal(utterances[0].rate,0.6);tts.speak('Hallo',0.85);assert.equal(utterances[1].rate,1);tts.speakSequence(['Guten Tag'],0.7);assert.equal(utterances[2].rate,0.7);
});
