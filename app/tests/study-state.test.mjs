import {test} from 'node:test';import assert from 'node:assert/strict';
import fs from 'node:fs';import vm from 'node:vm';
const c=vm.createContext({Date,Math});vm.runInContext(fs.readFileSync('public/lernspiel/study-state.js','utf8')+';globalThis.study=StudyState',c);const study=c.study;
const round=()=>({started:true,total:1,correct:1,score:10,streak:1,cat:'Familia',mode:'quiz'});
test('legacy and partial cloud progress gets safe defaults without losing content',()=>{
 const d=study.normalize({xp:12,userName:'Ana',lessonNotes:{one:'apuntes'},activeDays:null});
 assert.equal(d.xp,12);assert.equal(d.userName,'Ana');assert.equal(d.lessonNotes.one,'apuntes');assert.equal(d.activeDays.length,0);assert.equal(d.totalAnswered,0);
});
test('one answer persists XP and accuracy before finishing the round',()=>{
 const d=study.normalize({}),s=round();study.persistRound(d,s,false,10);
 assert.equal(d.xp,10);assert.equal(d.totalAnswered,1);assert.equal(d.totalCorrect,1);
 assert.equal(d.totalSessions,0);assert.equal(d.sessions[0].completed,false);
 assert.equal(study.persistRound(d,s,false,11),false);assert.equal(d.xp,10);
});
test('finishing a round does not count previously saved answers twice',()=>{
 const d=study.normalize({}),s=round();study.persistRound(d,s,false,10);
 s.total=2;s.score=24;s.correct=2;s.streak=2;study.persistRound(d,s,false,20);study.persistRound(d,s,true,21);study.persistRound(d,s,true,22);
 assert.equal(d.xp,24);assert.equal(d.totalAnswered,2);assert.equal(d.totalSessions,1);assert.equal(d.sessions.length,1);assert.equal(d.sessions[0].completed,true);
});
test('wrong answers count as practice but earn no XP',()=>{
 const d=study.normalize({}),s={...round(),correct:0,score:0,streak:0};study.persistRound(d,s);
 assert.equal(d.totalAnswered,1);assert.equal(d.xp,0);assert.equal(d.sessions[0].pct,0);
});
test('summary counts each word once and includes words learned through memory',()=>{
 const d=study.normalize({learnedWords:['eins'],wordStats:{zwei:{correct:0,wrong:1}},completedLessons:['a']});
 const s=study.summary(d,{a:[{de:'eins'},{de:'zwei'}],b:[{de:'eins'}]},[{id:'a'},{id:'b'}]);
 assert.equal(s.words,2);assert.equal(s.practiced,2);assert.equal(s.completed,1);assert.equal(s.next.id,'b');assert.equal(s.lessonPercent,50);assert.equal(s.accuracy,null);
});
test('activity dates use the local calendar rather than UTC',()=>{
 const fake={getFullYear:()=>2026,getMonth:()=>10,getDate:()=>15,toISOString:()=> '2026-11-16T01:00:00Z'};
 assert.equal(study.dateKey(fake),'2026-11-15');
});
