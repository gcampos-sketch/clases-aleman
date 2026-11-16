import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ProgressSync, canonical } from '../src/lib/progress-sync.ts';

function storage(initial) {
  const map = new Map(initial ? [['deutschA1', JSON.stringify(initial)]] : []);
  return {getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};
}
function backend() {
  let row=null, version=0, online=true;
  const clone=v=>JSON.parse(JSON.stringify(v));
  return {
    get row(){return clone(row)}, set online(v){online=v},
    store:{
      async read(){if(!online)throw Error('offline');return clone(row)},
      async write(data, revision){
        if(!online)throw Error('offline');
        if((row?.updated_at??null)!==revision)return null;
        row={data:clone(data),updated_at:`server-${++version}`};return clone(row);
      },
    },
  };
}
function client(db, local=storage(), userId='test-user') {
  let reloads=0;
  const sync=new ProgressSync({userId,store:db.store,storage:local,onStatus:()=>{},onRemote:()=>reloads++});
  return {sync,local,get reloads(){return reloads}};
}
const change=(c,data)=>{c.local.setItem('deutschA1',JSON.stringify(data));c.sync.markDirty()};

test('first login uploads existing guest progress without another exercise',async()=>{
  const db=backend(),a=client(db,storage({xp:30,completedLessons:['one']}));
  await a.sync.initialize();assert.equal(a.sync.status,'pending');
  assert.equal(await a.sync.sync(),true);assert.equal(db.row.data.xp,30);
  assert.equal(a.sync.base.revision,'server-1');assert.equal(a.sync.status,'saved');
});
test('a second computer restores progress and refreshes an already open game',async()=>{
  const db=backend(),a=client(db,storage({xp:30}));await a.sync.sync();
  const b=client(db);await b.sync.initialize();assert.equal(b.sync.local().xp,30);
  change(a,{xp:50});await a.sync.sync();await b.sync.sync();
  assert.equal(b.sync.local().xp,50);assert.equal(b.reloads,2);
});
test('offline changes survive closing and reopening the same computer',async()=>{
  const db=backend(),a=client(db,storage({xp:10}));await a.sync.sync();
  db.online=false;change(a,{xp:20});assert.equal(await a.sync.sync(),false);
  assert.equal(a.sync.status,'error');assert.equal(a.sync.local().xp,20);
  db.online=true;const reopened=client(db,a.local);await reopened.sync.initialize();
  assert.equal(reopened.sync.local().xp,20);await reopened.sync.sync();assert.equal(db.row.data.xp,20);
});
test('concurrent edits preserve both versions until an explicit choice',async()=>{
  const db=backend(),a=client(db,storage({xp:10}));await a.sync.sync();
  const b=client(db);await b.sync.initialize();
  change(a,{xp:20});await a.sync.sync();change(b,{xp:30});
  assert.equal(await b.sync.sync(),false);assert.equal(b.sync.status,'conflict');
  assert.equal(db.row.data.xp,20);assert.equal(b.sync.local().xp,30);
  await b.sync.resolve('remote');assert.equal(b.sync.local().xp,20);
  assert.equal(JSON.parse(b.local.getItem('deutschA1:backup:test-user')).xp,30);
});
test('compare-and-set rejection never claims that changes were saved',async()=>{
  const db=backend(),a=client(db,storage({xp:10}));await a.sync.sync();
  change(a,{xp:40});a.sync.store={...db.store,write:async()=>null};
  assert.equal(await a.sync.sync(),false);assert.equal(a.sync.status,'pending');
  assert.equal(db.row.data.xp,10);assert.equal(a.sync.local().xp,40);
});
test('switching accounts never uploads the previous account progress',async()=>{
  const db=backend(),a=client(db,storage({xp:77}));await a.sync.sync();
  const otherDb=backend(),b=client(otherDb,a.local,'another-user');
  await b.sync.sync();assert.deepEqual(b.sync.local(),{});assert.equal(otherDb.row,null);
  assert.equal(JSON.parse(b.local.getItem('deutschA1:backup:test-user')).xp,77);
});
test('database JSON key ordering does not create false conflicts',()=>{
  assert.equal(canonical({b:2,a:{z:3,x:1}}),canonical({a:{x:1,z:3},b:2}));
});


test('first login preserves practiced guest progress when the account already has other progress',async()=>{
  const db=backend(),a=client(db,storage({xp:10}));await a.sync.sync();
  const b=client(db,storage({xp:25}));await b.sync.initialize();
  assert.equal(b.sync.status,'conflict');assert.equal(b.sync.local().xp,25);
  const reopened=client(db,b.local);await reopened.sync.initialize();
  assert.equal(reopened.sync.status,'conflict');assert.equal(db.row.data.xp,10);
});
