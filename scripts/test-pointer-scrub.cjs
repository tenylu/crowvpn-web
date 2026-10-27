// Run: node scripts/test-pointer-scrub.cjs
// Exercise the real component effect with deterministic media/visibility mocks.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');

class Target extends EventTarget {}
const root = new Target();
root.dataset = {};
root.clientWidth = 400;
root.getBoundingClientRect = () => ({ left: 100, width: root.clientWidth });
root.setPointerCapture = () => {};
root.hasPointerCapture = () => false;
const video = new Target();
Object.assign(video, { duration: NaN, readyState: 0, seeking: false, pause() {} });
const seeks = [];
let time = 0;
Object.defineProperty(video, 'currentTime', { get: () => time, set(value) { time = value; video.seeking = true; seeks.push(['exact', value]); } });
video.fastSeek = value => { time = value; video.seeking = true; seeks.push(['fast', value]); };
let observer;
let disconnected = false;
let cleanup;
const rafs = new Map();
let id = 0;
let now = 0;
const doc = new Target();
doc.hidden = false;
const win = new Target();
const motion = new Target();
motion.matches = false;
const refs = [root, video];
const code = ts.transpileModule(fs.readFileSync('src/components/PointerScrubVideo.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
}).outputText;
const context = {
  exports: {},
  require(name) {
    if (name === 'react') return { useRef: () => ({ current: refs.shift() }), useEffect: effect => { cleanup = effect(); } };
    if (name === 'react/jsx-runtime') return { jsx: () => null, jsxs: () => null };
    return { default: {} };
  },
  matchMedia: () => motion,
  requestAnimationFrame: fn => { rafs.set(++id, fn); return id; },
  cancelAnimationFrame: key => rafs.delete(key),
  IntersectionObserver: class { constructor(fn) { observer = fn; } observe() {} disconnect() { disconnected = true; } },
  HTMLMediaElement: { HAVE_METADATA: 1, HAVE_CURRENT_DATA: 2 },
  document: doc, window: win,
};
vm.runInNewContext(code, context);
context.exports.PointerScrubVideo({ src: 'crow.mp4', poster: 'crow.jpg' });
const emit = (target, type, props = {}) => target.dispatchEvent(Object.assign(new Event(type), props));
const point = x => emit(root, 'pointermove', { clientX: x, pointerId: 1, isPrimary: true, pointerType: 'mouse' });
const frame = () => { const batch = [...rafs.values()]; rafs.clear(); now += 1000 / 60; batch.forEach(fn => fn(now)); };
const decoded = () => { video.seeking = false; video.readyState = 2; emit(video, 'seeked'); };
const settle = () => { for (let i = 0; i < 180 && (rafs.size || video.seeking); i++) { if (video.seeking) decoded(); frame(); } };

observer([{ isIntersecting: true }]);
point(500); frame();
assert.equal(seeks.length, 0, 'invalid duration must not seek');
video.duration = 4; emit(video, 'loadedmetadata'); frame();
assert.equal(seeks[0][1], .02, 'warm first frame before timeline');
const count = seeks.length;
point(100); point(500);
assert.equal(seeks.length, count, 'pointermove must not seek');
frame();
assert.equal(seeks.length, count, 'busy decoder must not receive a seek');
decoded(); settle();
assert.ok(seeks.some(([kind]) => kind === 'fast'), 'use fastSeek during motion');
assert.equal(seeks.at(-1)[0], 'exact', 'settle with exact seek');
assert.ok(Math.abs(time - (4 - 1 / 30)) < .001, 'right edge maps to last playable frame');
assert.equal(rafs.size, 0, 'settled loop must sleep');
root.clientWidth = 0; point(100); frame();
assert.ok(time > 3.9, 'zero-width container must not remap input');
root.clientWidth = 400;
observer([{ isIntersecting: false }]);
point(100); frame();
assert.equal(rafs.size, 0, 'offscreen must detach input and stop animation');
observer([{ isIntersecting: true }]);
delete video.fastSeek;
point(100); settle();
assert.ok(Math.abs(time - .02) < .001, 'currentTime fallback supports reverse scrubbing');
assert.equal(root.dataset.ready, 'true');
emit(video, 'error');
assert.equal(root.dataset.ready, 'false', 'decode error restores poster');
cleanup();
assert.ok(disconnected, 'unmount disconnects observer');
assert.equal(rafs.size, 0);
console.log('PASS: metadata, warm-up, decode backpressure, lerp, exact settle, reverse fallback, zero width, offscreen, poster fallback, cleanup');
