// Exercise the actual journey effect without depending on video decode speed.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const props = {};
const style = {setProperty(key, value) {props[key] = value;}};
const stage = {style:{},offsetHeight:900,inert:false};
let y=0, now=0, id=0, cleanup;
const rafs=new Map();
const journey=Object.assign(new EventTarget(),{style,dataset:{crowProgress:'0'},offsetHeight:900,
  firstElementChild:stage,getBoundingClientRect:()=>({top:-y})});
const sky={style,dataset:{}};
const win=Object.assign(new EventTarget(),{scrollY:0,innerHeight:900});
const doc=Object.assign(new EventTarget(),{hidden:false,documentElement:{scrollHeight:6000}});
let sunsetTop=3000;
doc.getElementById=id=>id==='home-trust' ? trust : ({getBoundingClientRect:()=>({top:sunsetTop-y})});
const motion=Object.assign(new EventTarget(),{matches:false});
const trustProps={};
const trust={style:{setProperty(key,value){trustProps[key]=value;}}};
const refs=[journey,sky];
const compiled=ts.transpileModule(fs.readFileSync('src/components/WindowJourney.tsx','utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020}
}).outputText;
const env={exports:{},require(name){
  if(name==='react')return {useRef:()=>({current:refs.shift()}),useEffect:fn=>{cleanup=fn();}};
  if(name==='react/jsx-runtime')return {jsx:()=>null,jsxs:()=>null};
  return {default:{}};
},window:win,document:doc,performance:{now:()=>now},matchMedia:()=>motion,
  addEventListener:win.addEventListener.bind(win),removeEventListener:win.removeEventListener.bind(win),
  requestAnimationFrame:fn=>{rafs.set(++id,fn);return id;},cancelAnimationFrame:key=>rafs.delete(key),
  IntersectionObserver:class{observe(target){assert.equal(target,stage);}disconnect(){}}};
vm.runInNewContext(compiled,env);env.exports.WindowJourney();
function tick(n=1){for(let i=0;i<n;i++){now+=16.67;const batch=[...rafs.values()];rafs.clear();batch.forEach(fn=>fn());}}
function scroll(value){y=value;win.scrollY=value;win.dispatchEvent(new Event('scroll'));}
function crow(value){journey.dataset.crowProgress=String(value);journey.dispatchEvent(new Event('crow-progress'));}
assert.equal(props['--window-cloud-opacity'],'1');
scroll(2000);tick(20);
assert.ok(Number(props['--scene-opacity'])>.99,'fast scroll must retain complete scene until crow catches up');
assert.equal(trustProps['--trust-title'],'0','trust heading must wait for the decoded crow exit');
crow(.85);tick(30);
assert.equal(props['--window-cloud-opacity'],'1','clouds must remain during the retreat handoff');
assert.ok(Number(trustProps['--trust-title'])*(1-Number(props['--scene-opacity']))>.2,
  'trust heading must be visible during the final retreat, not after an empty frame');
for(let i=18;i<=20;i++){crow(i/20);tick(4);}
tick(100);
assert.equal(stage.style.visibility,'hidden','completed journey releases the full viewport');
assert.ok(Number(props['--zoom'])>7,'window aperture must fully cover viewport before handoff');
assert.equal(stage.inert,true);
assert.equal(trustProps['--trust-title'],'1');
assert.equal(trustProps['--trust-logos'],'1');
scroll(0);crow(0);tick(100);
assert.equal(stage.style.visibility,'visible');
assert.ok(Number(props['--zoom'])<1.01,'reverse returns to initial window');
assert.ok(Number(props['--window-cloud-opacity'])>.99);
assert.equal(trustProps['--trust-title'],'0','reverse hides trust content behind the window');
scroll(2000);tick(300);
assert.equal(stage.style.visibility,'hidden','stalled media must not trap the page behind the cabin');
motion.matches=true;motion.dispatchEvent(new Event('change'));tick(100);
assert.equal(stage.style.visibility,'visible');assert.equal(stage.inert,false);
assert.equal(trustProps['--trust-title'],'1','reduced motion keeps original content readable');
scroll(2100);tick(100);
assert.equal(props['--sky-top'],'rgb(67 143 204)','sky stays blue before the module enters');
scroll(2820);tick(100);
assert.equal(props['--sky-bottom'],'rgb(237 204 174)','sunset is established as the module heading reaches the upper viewport');
sunsetTop=4000;win.dispatchEvent(new Event('resize'));tick(100);
assert.equal(props['--sky-top'],'rgb(67 143 204)','reflow must move sunset with the module');
cleanup();assert.equal(rafs.size,0);
console.log('PASS: fast scroll gate, full aperture handoff, reverse, clouds, stalled decode fallback, reduced motion, cleanup');
