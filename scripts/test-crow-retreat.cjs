// Execute the real React effect with deterministic media/RAF mocks.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
class Target extends EventTarget {}
const emit = (target, name) => target.dispatchEvent(new Event(name));
const rafs = new Map();
let id = 0, now = 0, scroll = 0, cleanup, observe, disconnected = false;
let paints = 0;
const ctx = {clearRect(){}, drawImage(){}, putImageData(){paints++;},
  getImageData(){return {data: new Uint8ClampedArray(4)};}};
const canvas = {getContext:()=>ctx};
const journey = Object.assign(new Target(), {dataset:{},offsetHeight:2000, firstElementChild:{offsetHeight:1000},
  getBoundingClientRect:()=>({top:-scroll})});
const root = {style:{},dataset:{},closest:()=>journey,querySelector:()=>null};
function media(duration) {
  const v = new Target(); let time=0;
  Object.assign(v,{duration,readyState:2,seeking:false,seeks:0,pause(){},play(){return Promise.resolve();}});
  Object.defineProperty(v,'currentTime',{get:()=>time,set(t){
    assert.ok(Number.isFinite(t)); time=t; v.seeking=true; v.seeks++;
  }});
  return v;
}
const intro=media(1.73), idle=media(11.3), takeoff=media(56/30);
const doc=new Target(), win=new Target(), motion=new Target();
doc.hidden=false; doc.createElement=()=>canvas;
win.clearTimeout=()=>{}; motion.matches=false;
const refs=[root,canvas,intro,idle,takeoff];
const compiled=ts.transpileModule(fs.readFileSync('src/components/FlyingCrow.tsx','utf8'),{
 compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}
}).outputText;
const env={exports:{},require(name){
 if(name==='react')return {useRef:()=>({current:refs.shift()}),useEffect:fn=>{cleanup=fn();}};
 if(name==='react/jsx-runtime')return {jsx:()=>null,jsxs:()=>null};
 return {default:{}};
},Event,window:win,document:doc,performance:{now:()=>now},matchMedia:()=>motion,
 requestAnimationFrame:fn=>{rafs.set(++id,fn);return id;},cancelAnimationFrame:key=>rafs.delete(key),
 IntersectionObserver:class{constructor(fn){observe=fn;}observe(){}disconnect(){disconnected=true;}}};
vm.runInNewContext(compiled,env); env.exports.FlyingCrow();
function tick(decode=true){
 if(decode)for(const v of [intro,idle,takeoff])if(v.seeking){v.seeking=false;emit(v,'seeked');}
 const batch=[...rafs.values()];rafs.clear();now+=1000/60;batch.forEach(fn=>fn());
}
function scrollTo(y){scroll=y;emit(win,'scroll');}
async function run(){
 observe([{isIntersecting:true}]);await Promise.resolve();
 emit(intro,'ended');await Promise.resolve();tick();
 takeoff.readyState=0;scrollTo(1800);tick();
 assert.equal(rafs.size,0,'loading must sleep until loadeddata');
 takeoff.readyState=2;emit(takeoff,'loadeddata');tick();
 const count=takeoff.seeks;for(let i=0;i<20;i++)tick(false);
 assert.equal(takeoff.seeks,count,'busy decoder must not get overlapping seeks');
 for(let i=0;i<240;i++)tick();
 assert.ok(paints>10,'scrubbing must paint intermediate decoded poses');
 assert.equal(rafs.size,0,'completed retreat must stop rendering');
 scrollTo(0);assert.equal(root.dataset.phase,'takeoff','reverse must not snap to idle');
 for(let i=0;i<240;i++)tick();await Promise.resolve();
 assert.equal(root.dataset.phase,'idle');assert.equal(idle.currentTime,0,'return starts quiet blink interval');
 scrollTo(250);for(let i=0;i<20;i++)tick();
 doc.hidden=true;emit(doc,'visibilitychange');assert.equal(rafs.size,0);
 doc.hidden=false;emit(doc,'visibilitychange');assert.ok(rafs.size>0);
 const pose=root.style.transform;emit(takeoff,'error');
 assert.equal(root.style.transform,pose,'media error must not teleport');assert.equal(rafs.size,0);
 cleanup();assert.ok(disconnected);assert.equal(rafs.size,0);
 console.log('PASS: loading sleep, decode backpressure, intermediate painting, reverse handoff, visibility, error pose, cleanup');
}
run().catch(e=>{console.error(e);process.exitCode=1;});
