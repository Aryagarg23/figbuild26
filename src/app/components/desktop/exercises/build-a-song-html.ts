/**
 * Raw HTML for the Build-a-Song music creator exercise.
 * Loaded as srcDoc in an <iframe> so scripts execute natively.
 * Source: /src/imports/build-a-song.html
 */
export const BUILD_A_SONG_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Build a song</title>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
:root { --accent-blue:#3b7cf5; --accent-red:#c83242; }
* { margin:0; padding:0; box-sizing:border-box; }
body {
  width:100vw; height:100vh; overflow:hidden;
  background:#05050e; font-family:'DM Sans',sans-serif; cursor:default;
}
body::before {
  content:''; position:fixed; inset:0; z-index:100; pointer-events:none;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.065'/%3E%3C/svg%3E");
  opacity:.45;
}
#label-left,#label-right {
  position:fixed; top:28px; z-index:50;
  font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:14px;
  letter-spacing:.05em; color:rgba(200,200,220,0.30); pointer-events:none;
}
#label-left{left:32px;} #label-right{right:32px;}
canvas { position:fixed; inset:0; }
#pixelCanvas  { z-index:1; pointer-events:none; }
#topoCanvas   { z-index:2; pointer-events:none; }
#centerCanvas { z-index:3; pointer-events:none; }
#rippleCanvas { z-index:4; pointer-events:none; }
#orbLayer     { position:fixed; inset:0; z-index:10; pointer-events:none; }

.grad-orb {
  position:absolute; border-radius:50%; cursor:grab; pointer-events:all;
  transform:translate(-50%,-50%);
  display:flex; align-items:center; justify-content:center;
  font-family:'Space Grotesk',sans-serif; font-weight:600; font-size:12px;
  color:rgba(255,255,255,.92); letter-spacing:.06em;
  text-shadow:0 1px 3px rgba(80,70,100,.35);
  border:1.5px solid rgba(79,142,247,0);
  transition:opacity .4s ease, transform .15s ease;
  user-select:none; will-change:transform;
}
.grad-orb:active { cursor:grabbing; }
.grad-orb.hovered { animation:strokeGrow .55s ease-in forwards; }
.grad-orb.pressed {
  border-color:var(--accent-blue) !important;
  box-shadow:0 0 0 3px var(--accent-blue),0 0 24px rgba(79,142,247,.4) !important;
  animation:none !important;
}
.grad-orb.playing {
  border-color:rgba(79,142,247,.35);
  box-shadow:0 0 12px rgba(79,142,247,.18);
  animation:none;
}
.grad-orb span { position:relative; z-index:3; }
@keyframes strokeGrow {
  0%   { border-color:rgba(79,142,247,0);  box-shadow:0 0 0 0 rgba(79,142,247,0); }
  100% { border-color:rgba(79,142,247,1);  box-shadow:0 0 0 3px rgba(79,142,247,.35),0 0 20px rgba(79,142,247,.3); }
}
/* Distinct orb colours */
.orb-top    { background:radial-gradient(circle at 45% 42%,rgba(170,110,235,.92),rgba(140,80,220,.88) 60%,rgba(110,55,190,.85)); box-shadow:0 2px 14px rgba(140,80,220,.25),inset 0 1px 0 rgba(255,255,255,.25); }
.orb-bottom { background:radial-gradient(circle at 45% 42%,rgba(80,225,145,.92),rgba(50,200,120,.88) 60%,rgba(35,170,95,.85)); box-shadow:0 2px 14px rgba(50,200,120,.25),inset 0 1px 0 rgba(255,255,255,.25); }
.orb-left   { background:radial-gradient(circle at 45% 42%,rgba(240,80,80,.92),rgba(220,50,50,.88) 60%,rgba(185,35,35,.85)); box-shadow:0 2px 14px rgba(220,50,50,.25),inset 0 1px 0 rgba(255,255,255,.25); }
.orb-right  { background:radial-gradient(circle at 45% 42%,rgba(250,210,80,.92),rgba(240,190,50,.88) 60%,rgba(210,160,30,.85)); box-shadow:0 2px 14px rgba(240,190,50,.25),inset 0 1px 0 rgba(255,255,255,.25); }
.orb-kick   { background:radial-gradient(circle at 45% 42%,rgba(255,140,60,.92),rgba(255,110,30,.88) 60%,rgba(220,85,15,.85)); box-shadow:0 2px 14px rgba(255,110,30,.25),inset 0 1px 0 rgba(255,255,255,.25); }
.orb-hat    { background:radial-gradient(circle at 45% 42%,rgba(80,225,250,.92),rgba(50,210,240,.88) 60%,rgba(30,180,210,.85)); box-shadow:0 2px 14px rgba(50,210,240,.25),inset 0 1px 0 rgba(255,255,255,.25); }
.dot {
  position:absolute; border-radius:50%; transform:translate(-50%,-50%);
  pointer-events:none; background:rgba(180,180,210,.18);
  border:1px solid rgba(200,200,240,.15);
}
</style>
</head>
<body>
<div id="label-left">Drag to play</div>
<div id="label-right">\u2195 Volume \u00b7 \u2194 Speed \u00b7 Center = intensity</div>
<canvas id="pixelCanvas"></canvas>
<canvas id="topoCanvas"></canvas>
<canvas id="centerCanvas"></canvas>
<canvas id="rippleCanvas"></canvas>
<div id="orbLayer"></div>
<script>
// ═══════════════════════════════════════════════════
//  CANVAS
// ═══════════════════════════════════════════════════
const pixelCv  = document.getElementById('pixelCanvas');
const topoCv   = document.getElementById('topoCanvas');
const centerCv = document.getElementById('centerCanvas');
const rippleCv = document.getElementById('rippleCanvas');
const pCtx  = pixelCv.getContext('2d');
const tCtx  = topoCv.getContext('2d');
const cCtx  = centerCv.getContext('2d');
const rCtx  = rippleCv.getContext('2d');
const orbLayer = document.getElementById('orbLayer');
let W, H;

// ═══════════════════════════════════════════════════
//  WEB AUDIO — melodic, harmonically tuned, looping
// ═══════════════════════════════════════════════════
let audioCtx = null;
function ensureAudio() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

let analyserNode = null;
let analyserFreqData = null;
let analyserTimeData = null;

function getAnalyser() {
  if (!analyserNode) {
    ensureAudio();
    analyserNode = audioCtx.createAnalyser();
    analyserNode.fftSize = 512;
    analyserNode.smoothingTimeConstant = 0.82;
    analyserFreqData = new Uint8Array(analyserNode.frequencyBinCount);
    analyserTimeData = new Uint8Array(analyserNode.frequencyBinCount);
    const comp = audioCtx.createDynamicsCompressor();
    comp.threshold.value = -10; comp.knee.value = 8;
    comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.25;
    analyserNode.connect(comp);
    comp.connect(audioCtx.destination);
  }
  return analyserNode;
}

const masterGains = {};

// Pentatonic scale in A minor: A3 C4 D4 E4 G4 A4 C5 D5 E5 G5
// Frequencies: 220, 261.6, 293.7, 329.6, 392, 440, 523.2, 587.3, 659.3, 784
const PENTA = [220, 261.6, 293.7, 329.6, 392, 440, 523.2, 587.3, 659.3, 784];

// Each orb: harmonically related BPMs (all divide/multiply of 120)
// left=120 bass, top=160 mid-chord, bottom=180 melody, right=240 hi-rhythm
// Patterns: array of { freq, duration (in beats), velocity }
const audioConfigs = {
  left: {   // 120 BPM — deep bass pulse (triangle for overtones)
    bpm: 120,
    pattern: [
      { freq: 110,   dur: 1.0, vel: 1.0  },  // A2 root
      { freq: 110,   dur: 0.5, vel: 0.7  },
      { freq: 146.8, dur: 0.5, vel: 0.9  },  // D3
    ],
    type: 'triangle', gain: 0.75, attack: 0.006, decay: 0.70,
    filterFreq: 900, filterType: 'lowpass',
  },
  top: {    // 160 BPM — mid warm chord stabs
    bpm: 160,
    pattern: [
      { freq: 220,   dur: 0.75, vel: 1.0  },  // A3
      { freq: 293.7, dur: 0.75, vel: 0.85 },  // D4
      { freq: 329.6, dur: 0.5,  vel: 0.7  },  // E4
    ],
    type: 'triangle', gain: 0.25, attack: 0.025, decay: 0.35,
    filterFreq: 900, filterType: 'lowpass',
    chord: [1, 1.25, 1.5],  // stacked intervals for warmth
  },
  bottom: { // 180 BPM — melodic arpeggio
    bpm: 180,
    pattern: [
      { freq: 440,   dur: 0.33, vel: 1.0  },  // A4
      { freq: 523.2, dur: 0.33, vel: 0.9  },  // C5
      { freq: 587.3, dur: 0.33, vel: 0.8  },  // D5
      { freq: 659.3, dur: 0.33, vel: 0.85 },  // E5
      { freq: 523.2, dur: 0.33, vel: 0.7  },  // C5
      { freq: 440,   dur: 0.67, vel: 0.9  },  // A4 long
    ],
    type: 'sine', gain: 0.35, attack: 0.008, decay: 0.22,
    filterFreq: 2800, filterType: 'lowpass',
  },
  right: {  // 240 BPM — bright hi-rhythm sparkle
    bpm: 240,
    pattern: [
      { freq: 880,  dur: 0.25, vel: 1.0  },  // A5
      { freq: 0,    dur: 0.25, vel: 0    },  // rest
      { freq: 784,  dur: 0.25, vel: 0.8  },  // G5
      { freq: 880,  dur: 0.25, vel: 0.9  },  // A5
    ],
    type: 'sine', gain: 0.38, attack: 0.003, decay: 0.12,
    filterFreq: 5000, filterType: 'bandpass',
  },
  kick: {   // 120 BPM — punchy kick drum (sine sweep)
    bpm: 120,
    pattern: [
      { freq: 160, dur: 1.0, vel: 1.0, sweepTo: 35 },
      { freq: 150, dur: 0.5, vel: 0.7, sweepTo: 35 },
      { freq: 160, dur: 0.5, vel: 0.85, sweepTo: 38 },
    ],
    type: 'sine', gain: 0.75, attack: 0.002, decay: 0.28,
    filterFreq: 400, filterType: 'lowpass',
  },
  hat: {    // 240 BPM — metallic hi-hat
    bpm: 240,
    pattern: [
      { freq: 8000, dur: 0.25, vel: 1.0 },
      { freq: 0,    dur: 0.25, vel: 0   },
      { freq: 8500, dur: 0.25, vel: 0.65 },
      { freq: 8000, dur: 0.125, vel: 0.9 },
      { freq: 0,    dur: 0.125, vel: 0   },
    ],
    type: 'square', gain: 0.065, attack: 0.001, decay: 0.038,
    filterFreq: 7000, filterType: 'highpass',
    chord: [1, 1.022, 0.978, 1.041],
  },
};

function getMasterGain(orbId) {
  if (!masterGains[orbId]) {
    ensureAudio();
    const g = audioCtx.createGain();
    g.gain.value = 0;
    g.connect(getAnalyser());
    masterGains[orbId] = g;
  }
  return masterGains[orbId];
}

function schedulePattern(orbId, patternStartTime, bpmOverride) {
  ensureAudio();
  const cfg = audioConfigs[orbId];
  if (!cfg) return 0;
  const beatSec = 60 / (bpmOverride || cfg.bpm);
  const master = getMasterGain(orbId);
  let offset = 0;
  for (const step of cfg.pattern) {
    if (step.vel > 0 && step.freq > 0) {
      const startT  = patternStartTime + offset * beatSec;
      const freqs   = cfg.chord ? cfg.chord.map(m => step.freq * m) : [step.freq];
      freqs.forEach(freq => {
        const osc  = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        const filt = audioCtx.createBiquadFilter();
        filt.type = cfg.filterType || 'lowpass';
        filt.frequency.value = cfg.filterFreq || 2000;
        osc.type = cfg.type;
        osc.frequency.value = freq;
        if (step.sweepTo) {
          osc.frequency.setValueAtTime(freq, startT);
          osc.frequency.exponentialRampToValueAtTime(Math.max(1, step.sweepTo), startT + cfg.decay * 0.85);
        }
        osc.connect(filt); filt.connect(gain); gain.connect(master);
        const peakGain = cfg.gain * step.vel;
        gain.gain.setValueAtTime(0, startT);
        gain.gain.linearRampToValueAtTime(peakGain, startT + cfg.attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, startT + cfg.decay);
        osc.start(startT);
        osc.stop(startT + cfg.decay + 0.05);
        // Disconnect nodes once done to free audio graph resources
        osc.onended = () => { osc.disconnect(); gain.disconnect(); filt.disconnect(); };
      });
    }
    offset += step.dur;
  }
  return offset * beatSec; // total pattern duration in seconds
}

// Position -> audio parameter mapping (non-linear: central area covers most range)
// Attempt a sigmoid curve centered at 0.5, steepened so 0.25-0.75 spans ~80% of range
function sigmoidMap(t, k) {
  // t in [0,1], k controls steepness (higher = steeper in center)
  // Returns [0,1] with most change concentrated around t=0.5
  const s = 1 / (1 + Math.exp(-k * (t - 0.5)));
  const s0 = 1 / (1 + Math.exp(-k * -0.5));  // value at t=0
  const s1 = 1 / (1 + Math.exp(-k *  0.5));  // value at t=1
  return (s - s0) / (s1 - s0);  // normalize to [0,1]
}

function getOrbDistFromCenter(orb) {
  const dx = orb.x - 0.5, dy = orb.y - 0.5;
  return Math.min(1, Math.sqrt(dx * dx + dy * dy) / 0.55);
}

function getOrbBPM(orb) {
  // X axis only: left=slow, right=fast
  // Steep sigmoid (k=12): edges are flat, center has most of the BPM range
  const x = Math.max(0, Math.min(1, orb.x));
  const xMapped = sigmoidMap(x, 12);
  return orb.bpm * (0.08 + xMapped * 2.4);  // 0.08x-2.48x (e.g. 120bpm -> ~10-298)
}

function getOrbVolume(orb) {
  // Y axis only: top=loud, bottom=quiet
  const y = Math.max(0.02, Math.min(0.98, orb.y));
  const yMapped = sigmoidMap(1 - y, 6);  // top=loud
  return 0.10 + yMapped * 0.90;
}

// Dynamic per-orb audio loop — fixed-interval scheduler
const orbAudioState = {};
const SCHEDULE_AHEAD  = 0.35;  // seconds to schedule ahead
const SCHEDULE_INTERVAL = 90;  // ms between scheduler ticks

function startOrbAudio(orbId) {
  if (orbAudioState[orbId]?.playing) return;
  ensureAudio();
  const state = {
    playing: true,
    nextStart: audioCtx.currentTime + 0.06,
    intervalId: null,
    lastBPM: 0,
  };
  orbAudioState[orbId] = state;

  function tick() {
    if (!state.playing || !audioCtx) return;
    const orb = orbs.find(o => o.id === orbId);
    if (!orb) return;
    const now = audioCtx.currentTime;
    const dynBPM = getOrbBPM(orb);

    // BPM changed significantly — resync to avoid overlap with old schedule
    if (state.lastBPM > 0 && Math.abs(dynBPM - state.lastBPM) / state.lastBPM > 0.25) {
      // Jump nextStart to slightly in the future so old notes finish naturally
      state.nextStart = Math.max(state.nextStart, now + 0.08);
    }
    state.lastBPM = dynBPM;

    // If we fell behind (tab was backgrounded, etc.), catch up
    if (state.nextStart < now - 0.15) {
      state.nextStart = now + 0.05;
    }

    // Schedule ahead up to SCHEDULE_AHEAD seconds
    const horizon = now + SCHEDULE_AHEAD;
    let safety = 0;
    while (state.nextStart < horizon && safety < 8) {
      const dur = schedulePattern(orbId, state.nextStart, dynBPM);
      if (dur <= 0) break;  // safety
      state.nextStart += dur;
      safety++;
    }
  }

  tick();
  state.intervalId = setInterval(tick, SCHEDULE_INTERVAL);
}

function stopOrbAudio(orbId) {
  const state = orbAudioState[orbId];
  if (!state) return;
  state.playing = false;
  if (state.intervalId) clearInterval(state.intervalId);
  // Fade out the master gain
  const mg = masterGains[orbId];
  if (mg && audioCtx) {
    mg.gain.setTargetAtTime(0, audioCtx.currentTime, 0.08);
  }
  delete orbAudioState[orbId];
}

function updateAllOrbAudio() {
  for (const orb of orbs) {
    const state = orbAudioState[orb.id];
    if (!state?.playing) continue;
    const vol = getOrbVolume(orb);
    const mg = masterGains[orb.id];
    if (mg && audioCtx) mg.gain.setTargetAtTime(vol, audioCtx.currentTime, 0.08);
  }
}

// ═══════════════════════════════════════════════════
//  ORB DATA
// ═══════════════════════════════════════════════════
const ORB_DEFS = [
  { id:'top',    cls:'orb-top',    label:'160',  bpm:160, sx:.50, sy:.28, size:68, color:[140,80,220] },
  { id:'bottom', cls:'orb-bottom', label:'180',  bpm:180, sx:.50, sy:.72, size:64, color:[50,200,120] },
  { id:'left',   cls:'orb-left',   label:'120', bpm:120, sx:.25, sy:.50, size:64, color:[220,50,50] },
  { id:'right',  cls:'orb-right',  label:'240',   bpm:240, sx:.75, sy:.50, size:64, color:[240,190,50] },
  { id:'kick',   cls:'orb-kick',   label:'120', bpm:120, sx:.32, sy:.32, size:62, color:[255,110,30] },
  { id:'hat',    cls:'orb-hat',    label:'240',  bpm:240, sx:.68, sy:.32, size:58, color:[50,210,240] },
];
const orbs = ORB_DEFS.map(d=>({...d, x:d.sx, y:d.sy, origX:d.sx, origY:d.sy, el:null, active:true, pressed:false, playing:false, vx:0, vy:0}));
const center = { x:.50, y:.50, size:130 };

// ═══════════════════════════════════════════════════
//  DOTS — denser grid for harder navigation
// ═══════════════════════════════════════════════════
const DOTS_RAW = [
  // original ring
  [.24,.28],[.36,.24],[.50,.22],[.64,.24],[.76,.28],
  [.19,.40],[.30,.38],[.42,.36],[.58,.36],[.70,.38],[.81,.40],
  [.19,.60],[.30,.62],[.42,.64],[.58,.64],[.70,.62],[.81,.60],
  [.24,.72],[.36,.76],[.50,.78],[.64,.76],[.76,.72],
  // inner ring — creates tighter obstacle maze
  [.38,.33],[.50,.31],[.62,.33],
  [.33,.45],[.44,.43],[.56,.43],[.67,.45],
  [.33,.55],[.44,.57],[.56,.57],[.67,.55],
  [.38,.67],[.50,.69],[.62,.67],
  // diagonal fills
  [.27,.35],[.73,.35],[.27,.65],[.73,.65],
  [.40,.26],[.60,.26],[.40,.74],[.60,.74],
  // extra scatter
  [.22,.50],[.78,.50],[.50,.16],[.50,.84],
  [.35,.30],[.65,.30],[.35,.70],[.65,.70],
];
const dots = DOTS_RAW.map(([fx,fy])=>({ fx, fy, size:5+Math.random()*6, el:null }));

// ═══════════════════════════════════════════════════
//  BEAT TRACKER — visual pulses per orb position
// ═══════════════════════════════════════════════════
const orbBeats = {};

function updateOrbBeats(now) {
  for (const orb of orbs) {
    if (!orbAudioState[orb.id]?.playing) continue;
    if (!orbBeats[orb.id]) {
      orbBeats[orb.id] = { nextBeat: now, pulseIntensity: 0, pulseBorn: 0,
        pulseDuration: Math.max(160, 380 - orb.bpm * 0.7) };
    }
    const ob = orbBeats[orb.id];
    const dynBPM = getOrbBPM(orb);
    const intervalMs = 60000 / dynBPM;
    if (now >= ob.nextBeat) {
      ob.nextBeat = now + intervalMs;
      ob.pulseIntensity = 1.0;
      ob.pulseBorn = now;
    }
    if (ob.pulseIntensity > 0) {
      const age = (now - ob.pulseBorn) / ob.pulseDuration;
      ob.pulseIntensity = age >= 1 ? 0 : Math.pow(1 - age, 1.8);
    }
  }
}

function getOrbFieldValue(orb) {
  if (!fieldGrid) return 0.65;
  const gc = Math.max(0, Math.min(gridCols-1, Math.round(orb.x * W / STEP)));
  const gr = Math.max(0, Math.min(gridRows-1, Math.round(orb.y * H / STEP)));
  return getGrid(gr, gc);
}

// ═══════════════════════════════════════════════════
//  CENTER VISUALIZER — audio-reactive
// ═══════════════════════════════════════════════════
function drawVisualizer(now) {
  cCtx.clearRect(0, 0, W, H);
  const cx = center.x * W, cy = center.y * H;
  const R = center.size * 0.5;

  // Gather audio data
  let avgAmp = 0, bassE = 0, midE = 0, hiE = 0;
  const hasAudio = analyserNode && analyserFreqData;
  if (hasAudio) {
    analyserNode.getByteFrequencyData(analyserFreqData);
    const bins = analyserFreqData.length;
    let sum = 0;
    for (let i = 0; i < bins; i++) sum += analyserFreqData[i];
    avgAmp = sum / bins / 255;
    const midBin = Math.floor(bins * 0.25), hiBin = Math.floor(bins * 0.6);
    let bS = 0, mS = 0, hS = 0;
    for (let i = 0; i < midBin; i++) bS += analyserFreqData[i];
    for (let i = midBin; i < hiBin; i++) mS += analyserFreqData[i];
    for (let i = hiBin; i < bins; i++) hS += analyserFreqData[i];
    bassE = bS / midBin / 255;
    midE  = mS / (hiBin - midBin) / 255;
    hiE   = hS / (bins - hiBin) / 255;
  }

  cCtx.save();
  cCtx.beginPath();
  cCtx.arc(cx, cy, R, 0, Math.PI * 2);
  cCtx.clip();

  // Deep navy void base
  const baseG = cCtx.createRadialGradient(cx, cy, 0, cx, cy, R);
  baseG.addColorStop(0, 'rgba(12,14,38,1)');
  baseG.addColorStop(0.5, 'rgba(8,10,28,1)');
  baseG.addColorStop(1, 'rgba(4,4,15,1)');
  cCtx.fillStyle = baseG;
  cCtx.fillRect(cx - R, cy - R, R * 2, R * 2);

  // Crimson-blue plasma blobs — the "moon pool"
  const t2 = performance.now() * 0.0005;
  const ampScale = 1 + avgAmp * 0.9;
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2 + t2 * (i % 2 === 0 ? 0.8 : -0.55);
    const br = R * (0.22 + 0.2 * Math.sin(t2 * 1.1 + i * 0.7)) * ampScale;
    const bx = cx + Math.cos(a) * R * 0.3;
    const by = cy + Math.sin(a) * R * 0.3;
    const g = cCtx.createRadialGradient(bx, by, 0, bx, by, br);
    const kind = i % 3;
    if (kind === 0) {
      const ca = 0.25 + bassE * 0.45;
      g.addColorStop(0, 'rgba(200,40,55,' + ca.toFixed(2) + ')');
      g.addColorStop(0.55, 'rgba(130,20,35,' + (ca * 0.35).toFixed(2) + ')');
      g.addColorStop(1, 'rgba(60,8,15,0)');
    } else if (kind === 1) {
      const ca = 0.25 + midE * 0.4;
      g.addColorStop(0, 'rgba(35,70,200,' + ca.toFixed(2) + ')');
      g.addColorStop(0.55, 'rgba(20,40,130,' + (ca * 0.35).toFixed(2) + ')');
      g.addColorStop(1, 'rgba(8,18,60,0)');
    } else {
      const ca = 0.18 + hiE * 0.3;
      g.addColorStop(0, 'rgba(110,30,140,' + ca.toFixed(2) + ')');
      g.addColorStop(0.55, 'rgba(60,15,80,' + (ca * 0.3).toFixed(2) + ')');
      g.addColorStop(1, 'rgba(25,6,40,0)');
    }
    cCtx.fillStyle = g;
    cCtx.beginPath();
    cCtx.arc(bx, by, br, 0, Math.PI * 2);
    cCtx.fill();
  }

  // Reactive orb-colored blobs
  const bandMap = { left: bassE, kick: bassE, top: midE, bottom: midE, right: hiE, hat: hiE };
  orbs.forEach((orb, idx) => {
    if (!orbAudioState[orb.id]?.playing) return;
    const [cr, cg, cb] = orb.color;
    const energy = bandMap[orb.id] || avgAmp;
    const vol = getOrbVolume(orb);
    const phase = now * 0.0008 + idx * Math.PI * 0.33;
    const blobR = R * (0.18 + energy * 0.45) * (0.4 + vol * 0.6);
    const dist = R * 0.22 * (1 + energy * 0.4);
    const bx = cx + Math.cos(phase) * dist;
    const by = cy + Math.sin(phase) * dist;
    const g = cCtx.createRadialGradient(bx, by, 0, bx, by, blobR);
    const a1 = (0.35 + energy * 0.5) * vol;
    const a2 = (0.08 + energy * 0.12) * vol;
    g.addColorStop(0, 'rgba(' + cr + ',' + cg + ',' + cb + ',' + a1.toFixed(2) + ')');
    g.addColorStop(0.5, 'rgba(' + cr + ',' + cg + ',' + cb + ',' + a2.toFixed(2) + ')');
    g.addColorStop(1, 'rgba(' + cr + ',' + cg + ',' + cb + ',0)');
    cCtx.fillStyle = g;
    cCtx.beginPath();
    cCtx.arc(bx, by, blobR, 0, Math.PI * 2);
    cCtx.fill();
  });

  // Static/grain noise — red-blue pixels scattered inside circle
  const noiseCount = 250 + Math.floor(avgAmp * 350);
  for (let i = 0; i < noiseCount; i++) {
    const na = Math.random() * Math.PI * 2;
    const nd = Math.sqrt(Math.random()) * R;
    const nx = cx + Math.cos(na) * nd;
    const ny = cy + Math.sin(na) * nd;
    const ns = 0.5 + Math.random() * 1.8;
    const rnd = Math.random();
    if (rnd > 0.65) {
      cCtx.fillStyle = 'rgba(200,45,55,' + (0.03 + Math.random() * 0.12).toFixed(2) + ')';
    } else if (rnd > 0.25) {
      cCtx.fillStyle = 'rgba(35,70,200,' + (0.03 + Math.random() * 0.1).toFixed(2) + ')';
    } else {
      cCtx.fillStyle = 'rgba(180,180,200,' + (0.015 + Math.random() * 0.05).toFixed(2) + ')';
    }
    cCtx.fillRect(nx, ny, ns, ns);
  }

  cCtx.restore();

  // Circular waveform ring — violet
  if (hasAudio) {
    analyserNode.getByteTimeDomainData(analyserTimeData);
    const bins = analyserTimeData.length;
    cCtx.beginPath();
    for (let i = 0; i <= bins; i++) {
      const angle = (i / bins) * Math.PI * 2 - Math.PI / 2;
      const amp = (analyserTimeData[i % bins] - 128) / 128;
      const r = R + 6 + amp * 20 * (0.5 + avgAmp);
      const wx = cx + Math.cos(angle) * r;
      const wy = cy + Math.sin(angle) * r;
      if (i === 0) cCtx.moveTo(wx, wy); else cCtx.lineTo(wx, wy);
    }
    cCtx.closePath();
    const waveAlpha = (0.18 + avgAmp * 0.5).toFixed(2);
    cCtx.strokeStyle = 'rgba(140,50,180,' + waveAlpha + ')';
    cCtx.lineWidth = 1.5;
    cCtx.shadowBlur = 16;
    cCtx.shadowColor = 'rgba(120,40,160,' + (avgAmp * 0.45).toFixed(2) + ')';
    cCtx.stroke();
    cCtx.shadowBlur = 0;
  }

  // Outer glow — dual crimson + blue halos
  const glowAlpha = 0.08 + avgAmp * 0.25;
  cCtx.beginPath();
  cCtx.arc(cx, cy, R + 4, 0, Math.PI * 2);
  cCtx.strokeStyle = 'rgba(200,45,60,' + glowAlpha.toFixed(2) + ')';
  cCtx.lineWidth = 2.5;
  cCtx.shadowBlur = 22;
  cCtx.shadowColor = 'rgba(200,40,55,' + (glowAlpha * 0.4).toFixed(2) + ')';
  cCtx.stroke();
  cCtx.shadowBlur = 0;

  cCtx.beginPath();
  cCtx.arc(cx, cy, R + 2, 0, Math.PI * 2);
  cCtx.strokeStyle = 'rgba(40,70,200,' + (glowAlpha * 0.7).toFixed(2) + ')';
  cCtx.lineWidth = 1.5;
  cCtx.shadowBlur = 18;
  cCtx.shadowColor = 'rgba(35,60,180,' + (glowAlpha * 0.35).toFixed(2) + ')';
  cCtx.stroke();
  cCtx.shadowBlur = 0;

  // Rim
  cCtx.beginPath();
  cCtx.arc(cx, cy, R, 0, Math.PI * 2);
  cCtx.strokeStyle = 'rgba(200,200,220,.12)';
  cCtx.lineWidth = 0.7;
  cCtx.stroke();
}

// ═══════════════════════════════════════════════════
//  FIELD + GRID
// ═══════════════════════════════════════════════════
const STEP = 12;
let gridCols=0, gridRows=0, fieldGrid=null;

function allocGrid() {
  gridCols = Math.ceil(W/STEP)+2;
  gridRows = Math.ceil(H/STEP)+2;
  fieldGrid = new Float32Array(gridCols*gridRows);
}

function noise(x,y,t) {
  return (
    Math.sin(x*2.2+t*.6)*Math.cos(y*1.8+t*.5)*.50+
    Math.sin(x*4.1-t*.35+y*2.0)*.25+
    Math.sin(x*8.3+y*6.2+t*1.0)*.125+
    Math.cos(x*3.1-y*4.5+t*.25)*.0625
  );
}

let dotWX=[], dotWY=[];

function computeField(t) {
  const ox=[],oy=[],or2=[];
  for(let i=0;i<orbs.length;i++){ox[i]=orbs[i].x*W;oy[i]=orbs[i].y*H;or2[i]=orbs[i].size*1.8;}
  const cx=center.x*W, cy=center.y*H, cr=center.size*1.6;
  const nx5=5/W, ny5=5/H;
  for(let r=0;r<gridRows;r++){
    const py=r*STEP, base=r*gridCols;
    for(let c=0;c<gridCols;c++){
      const px=c*STEP; let val=0;
      for(let i=0;i<orbs.length;i++){
        if(!orbs[i].active)continue;
        const dx=px-ox[i],dy=py-oy[i],dist=Math.sqrt(dx*dx+dy*dy);
        val+=Math.exp(-dist/(or2[i]*.82));
        const inv=dist<.001?0:1/dist;
        val+=(dy*inv*dx*inv*5*.065)*Math.max(0,1-dist/(or2[i]*2.6));
      }
      {const dx=px-cx,dy=py-cy;val+=Math.exp(-Math.sqrt(dx*dx+dy*dy)/(cr*.75))*.65;}
      for(let i=0;i<dots.length;i++){
        const dx=px-dotWX[i],dy=py-dotWY[i],dist=Math.sqrt(dx*dx+dy*dy);
        val+=Math.exp(-dist/(dots[i].size*2))*.16*(dist%12<6?1:-1);
      }
      val+=noise(px*nx5,py*ny5,t)*.09;
      fieldGrid[base+c]=val;
    }
  }
}
function getGrid(r,c){return fieldGrid[r*gridCols+c];}

// ═══════════════════════════════════════════════════
//  MARCHING SQUARES — smooth bezier chains
// ═══════════════════════════════════════════════════
function collectSegments(threshold) {
  const segs=[];
  for(let r=0;r<gridRows-1;r++){
    for(let c=0;c<gridCols-1;c++){
      const x=c*STEP,y=r*STEP;
      const tl=getGrid(r,c),tr=getGrid(r,c+1),br=getGrid(r+1,c+1),bl=getGrid(r+1,c);
      const idx=(tl>threshold?8:0)|(tr>threshold?4:0)|(br>threshold?2:0)|(bl>threshold?1:0);
      if(idx===0||idx===15)continue;
      const d=threshold;
      const tA=(tl===tr)?.5:(d-tl)/(tr-tl);
      const rA=(tr===br)?.5:(d-tr)/(br-tr);
      const bA=(bl===br)?.5:(d-bl)/(br-bl);
      const lA=(tl===bl)?.5:(d-tl)/(bl-tl);
      const T=[x+tA*STEP,y],R=[x+STEP,y+rA*STEP],B=[x+bA*STEP,y+STEP],L=[x,y+lA*STEP];
      switch(idx){
        case 1:segs.push(L[0],L[1],B[0],B[1]);break;case 2:segs.push(B[0],B[1],R[0],R[1]);break;
        case 3:segs.push(L[0],L[1],R[0],R[1]);break;case 4:segs.push(T[0],T[1],R[0],R[1]);break;
        case 5:segs.push(T[0],T[1],L[0],L[1],B[0],B[1],R[0],R[1]);break; // two segs inline
        case 6:segs.push(T[0],T[1],B[0],B[1]);break;case 7:segs.push(T[0],T[1],L[0],L[1]);break;
        case 8:segs.push(T[0],T[1],L[0],L[1]);break;case 9:segs.push(T[0],T[1],B[0],B[1]);break;
        case 10:segs.push(T[0],T[1],R[0],R[1],B[0],B[1],L[0],L[1]);break;
        case 11:segs.push(T[0],T[1],R[0],R[1]);break;case 12:segs.push(L[0],L[1],R[0],R[1]);break;
        case 13:segs.push(B[0],B[1],R[0],R[1]);break;case 14:segs.push(L[0],L[1],B[0],B[1]);break;
      }
    }
  }
  return segs;
}

function drawSmoothedContour(ctx,threshold,overrideStyle) {
  const segs=collectSegments(threshold);
  if(!segs.length)return;
  const EPS=STEP*.6, n=segs.length/4;
  const used=new Uint8Array(n);
  const chains=[];
  for(let s=0;s<n;s++){
    if(used[s])continue;
    used[s]=1;
    const ch=[segs[s*4],segs[s*4+1],segs[s*4+2],segs[s*4+3]];
    let ext=true;
    while(ext){
      ext=false;
      const ex=ch[ch.length-2],ey=ch[ch.length-1];
      for(let j=0;j<n;j++){
        if(used[j])continue;
        const ax=segs[j*4],ay=segs[j*4+1],bx=segs[j*4+2],by=segs[j*4+3];
        if(Math.abs(ax-ex)<EPS&&Math.abs(ay-ey)<EPS){ch.push(bx,by);used[j]=1;ext=true;break;}
        if(Math.abs(bx-ex)<EPS&&Math.abs(by-ey)<EPS){ch.push(ax,ay);used[j]=1;ext=true;break;}
      }
      if(!ext){
        const sx=ch[0],sy=ch[1];
        for(let j=0;j<n;j++){
          if(used[j])continue;
          const ax=segs[j*4],ay=segs[j*4+1],bx=segs[j*4+2],by=segs[j*4+3];
          if(Math.abs(bx-sx)<EPS&&Math.abs(by-sy)<EPS){ch.unshift(ax,ay);used[j]=1;ext=true;break;}
          if(Math.abs(ax-sx)<EPS&&Math.abs(ay-sy)<EPS){ch.unshift(bx,by);used[j]=1;ext=true;break;}
        }
      }
    }
    chains.push(ch);
  }
  ctx.beginPath();
  for(const ch of chains){
    const pts=ch.length/2;
    if(pts<2)continue;
    ctx.moveTo(ch[0],ch[1]);
    if(pts===2){ctx.lineTo(ch[2],ch[3]);}
    else{
      for(let i=0;i<pts-1;i++){
        const i0=Math.max(0,i-1),i2=i+1,i3=Math.min(pts-1,i+2);
        const cp1x=ch[i*2]+(ch[i2*2]-ch[i0*2])/6;
        const cp1y=ch[i*2+1]+(ch[i2*2+1]-ch[i0*2+1])/6;
        const cp2x=ch[i2*2]-(ch[i3*2]-ch[i*2])/6;
        const cp2y=ch[i2*2+1]-(ch[i3*2+1]-ch[i*2+1])/6;
        ctx.bezierCurveTo(cp1x,cp1y,cp2x,cp2y,ch[i2*2],ch[i2*2+1]);
      }
    }
  }
  ctx.stroke();
}

// ═══════════════════════════════════════════════════
//  BLOB PATH
// ═══════════════════════════════════════════════════
const BLOB_N=64;
const blobPts=new Float32Array(BLOB_N*2);
function updateBlobPath(t){
  const cx=W*.50,cy=H*.50,rx=W*.40,ry=H*.37;
  for(let i=0;i<BLOB_N;i++){
    const a=(i/BLOB_N)*Math.PI*2;
    const w=1+Math.sin(a*3+t*.45)*.052+Math.cos(a*2-t*.38)*.038+Math.sin(a*5+t*.7)*.018;
    blobPts[i*2]=cx+Math.cos(a)*rx*w; blobPts[i*2+1]=cy+Math.sin(a)*ry*w;
  }
}
function traceBlobSmooth(ctx){
  ctx.beginPath();
  const N=BLOB_N;
  ctx.moveTo((blobPts[0]+blobPts[(N-1)*2])*.5,(blobPts[1]+blobPts[(N-1)*2+1])*.5);
  for(let i=0;i<N;i++){
    const nx2=(i+1)%N;
    ctx.quadraticCurveTo(blobPts[i*2],blobPts[i*2+1],(blobPts[i*2]+blobPts[nx2*2])*.5,(blobPts[i*2+1]+blobPts[nx2*2+1])*.5);
  }
  ctx.closePath();
}

// ═══════════════════════════════════════════════════
//  LEVEL COLOURS + PULSE
// ═══════════════════════════════════════════════════
const LEVELS=28;
const levelColors=new Array(LEVELS);
const levelWidths=new Float32Array(LEVELS);
const levelAlphas=new Float32Array(LEVELS);
const levelThresh=new Float32Array(LEVELS);
let gradientAngle=0;

function precomputeLevels(){
  for(let i=0;i<LEVELS;i++){
    const f=i/LEVELS;
    levelThresh[i]=.025+f*1.15;
    levelAlphas[i]=.14+f*.44;
    levelWidths[i]=.4+f*.95;
  }
}
precomputeLevels();

function updateLevelColors(){
  for(let i=0;i<LEVELS;i++){
    const f=i/LEVELS,a=f*Math.PI*3+gradientAngle;
    const r=80+130*Math.max(0,Math.cos(a))|0,g=12+28*Math.cos(a+1.8)|0,b=90+120*Math.max(0,Math.cos(a+Math.PI*0.9))|0;
    levelColors[i]='rgba('+r+','+g+','+b+','+levelAlphas[i].toFixed(2)+')';
  }
}



// ═══════════════════════════════════════════════════
//  RIPPLES
// ═══════════════════════════════════════════════════
const ripples=[];
function spawnRipple(x,y,color){
  ripples.push({x,y,color,born:performance.now(),duration:1500,maxR:Math.hypot(W,H)*.7,waves:3,alpha:.55});
}
function drawRipples(now){
  rCtx.clearRect(0,0,W,H);
  for(let i=ripples.length-1;i>=0;i--){
    const rp=ripples[i],elapsed=now-rp.born;
    if(elapsed>rp.duration){ripples.splice(i,1);continue;}
    const t=elapsed/rp.duration;
    const [cr,cg,cb]=rp.color;
    for(let w=0;w<rp.waves;w++){
      const wt=Math.max(0,t-w*.18);if(wt<=0)continue;
      rCtx.beginPath();rCtx.arc(rp.x,rp.y,wt*rp.maxR*.55,0,Math.PI*2);
      rCtx.strokeStyle='rgba('+cr+','+cg+','+cb+','+((1-wt)*rp.alpha*.5).toFixed(3)+')';
      rCtx.lineWidth=1.5*(1-wt);rCtx.stroke();
    }
  }
}

// ═══════════════════════════════════════════════════
//  PIXELS
// ═══════════════════════════════════════════════════
const pixels=[];
function buildPixels(){
  pixels.length=0;
  const count=Math.min(Math.floor(W*H/4500),420);
  for(let i=0;i<count;i++){
    const rnd=Math.random();
    let cR,cG,cB;
    if(rnd>.6){cR=200;cG=42;cB=58;}       // crimson
    else if(rnd>.2){cR=38;cG=72;cB=200;}   // blue
    else{cR=110;cG=35;cB=155;}              // violet
    pixels.push({x:Math.random()*W,y:Math.random()*H,size:1+Math.random()*1.8,
      baseAlpha:.05+Math.random()*.35,colorR:cR,colorG:cG,colorB:cB,
      phase:Math.random()*Math.PI*2,speed:.2+Math.random()*.6});
  }
}
function drawPixels(t){
  pCtx.clearRect(0,0,W,H);
  for(const p of pixels){
    const a=p.baseAlpha*(0.55+0.45*Math.sin(t*p.speed+p.phase));
    pCtx.fillStyle='rgba('+p.colorR+','+p.colorG+','+p.colorB+','+a.toFixed(3)+')';
    pCtx.fillRect(p.x,p.y,p.size,p.size);
  }
}

// ═══════════════════════════════════════════════════
//  DOM BUILD
// ═══════════════════════════════════════════════════
function buildDOM(){
  orbLayer.innerHTML='';
  // Note: centre circle is drawn on centerCanvas, no DOM element needed
  orbs.forEach((o,i)=>{
    if(!o.active)return;
    const el=document.createElement('div');
    el.className='grad-orb '+o.cls;
    el.innerHTML='<span>'+o.label+'</span>';
    el.style.cssText='width:'+o.size+'px;height:'+o.size+'px;left:'+o.x*W+'px;top:'+o.y*H+'px;';
    orbLayer.appendChild(el); o.el=el;
    setupOrbEvents(o,i);
  });
  dots.forEach(d=>{
    const el=document.createElement('div');
    el.className='dot';
    el.style.cssText='width:'+d.size+'px;height:'+d.size+'px;left:'+d.fx*W+'px;top:'+d.fy*H+'px;';
    orbLayer.appendChild(el); d.el=el;
  });
}

// ═══════════════════════════════════════════════════
//  DRAG
// ═══════════════════════════════════════════════════
let dragging=null,dragOff={x:0,y:0},lastMoveTime=0;

function setupOrbEvents(orb,idx){
  const el=orb.el;
  el.addEventListener('mousedown',e=>{
    ensureAudio();
    dragging=orb; dragOff.x=e.clientX-orb.x*W; dragOff.y=e.clientY-orb.y*H;
    orb.pressed=true; el.classList.remove('hovered'); el.classList.add('pressed');
    spawnRipple(orb.x*W,orb.y*H,orb.color);
    if (!orb.playing) {
      orb.playing = true;
      startOrbAudio(orb.id);
    }
    e.preventDefault();
  });
  el.addEventListener('mouseenter',()=>{ if(!orb.pressed)el.classList.add('hovered'); });
  el.addEventListener('mouseleave',()=>{ el.classList.remove('hovered'); });
}

window.addEventListener('mousemove',e=>{
  if(!dragging||!dragging.active)return;
  const now=performance.now();
  const newX=(e.clientX-dragOff.x)/W, newY=(e.clientY-dragOff.y)/H;
  const dtM=Math.max(1,now-lastMoveTime)/1000;
  dragging.vx=(newX-dragging.x)/dtM;
  dragging.vy=(newY-dragging.y)/dtM;
  lastMoveTime=now;
  dragging.x=newX; dragging.y=newY;
  dragging.el.style.left=(dragging.x*W)+'px';
  dragging.el.style.top=(dragging.y*H)+'px';
});

window.addEventListener('mouseup',()=>{
  if(!dragging)return;
  const o=dragging; dragging=null;
  o.pressed=false;
  if(o.el){
    o.el.classList.remove('pressed','hovered');
    if(o.playing) o.el.classList.add('playing');
  }
});

// Simple physics: momentum, friction, edge bounce, soft-body deformation
function updatePhysics(dt){
  const FRICTION=3.0, BOUNCE=-0.4;
  for(const orb of orbs){
    if(orb===dragging)continue;
    const speed=Math.sqrt(orb.vx*orb.vx+orb.vy*orb.vy);
    if(speed<0.005){orb.vx=0;orb.vy=0;}
    if(orb.vx===0&&orb.vy===0){
      if(orb.el)orb.el.style.transform='translate(-50%,-50%)';
      continue;
    }
    orb.vx*=Math.exp(-FRICTION*dt);
    orb.vy*=Math.exp(-FRICTION*dt);
    orb.x+=orb.vx*dt;
    orb.y+=orb.vy*dt;
    if(orb.x<0.02){orb.x=0.02;orb.vx*=BOUNCE;}
    if(orb.x>0.98){orb.x=0.98;orb.vx*=BOUNCE;}
    if(orb.y<0.02){orb.y=0.02;orb.vy*=BOUNCE;}
    if(orb.y>0.98){orb.y=0.98;orb.vy*=BOUNCE;}
    if(orb.el){
      orb.el.style.left=(orb.x*W)+'px';
      orb.el.style.top=(orb.y*H)+'px';
    }
  }
  for(const orb of orbs){
    if(!orb.el)continue;
    const spd=Math.sqrt(orb.vx*orb.vx+orb.vy*orb.vy);
    const squish=Math.min(0.22,spd*0.12);
    if(squish>0.01){
      const ang=Math.atan2(orb.vy,orb.vx)*180/Math.PI;
      const sx=1+squish,sy=1-squish*0.5;
      orb.el.style.transform='translate(-50%,-50%) rotate('+ang+'deg) scale('+sx.toFixed(3)+','+sy.toFixed(3)+') rotate('+-ang+'deg)';
    } else if(orb!==dragging){
      orb.el.style.transform='translate(-50%,-50%)';
    }
  }
}

function resize(){
  W=pixelCv.width=topoCv.width=centerCv.width=rippleCv.width=window.innerWidth;
  H=pixelCv.height=topoCv.height=centerCv.height=rippleCv.height=window.innerHeight;
  dotWX=dots.map(d=>d.fx*W); dotWY=dots.map(d=>d.fy*H);
  allocGrid(); buildDOM(); buildPixels();
}
resize();
window.addEventListener('resize',resize);

// ═══════════════════════════════════════════════════
//  MAIN LOOP
// ═══════════════════════════════════════════════════
let t=0,last=0,pixFrame=0;

function draw(now){
  const dt=Math.min((now-last)/1000,.05); last=now; t+=dt;
  updatePhysics(dt);

  // Drive gradient angle from combined playing orb BPMs
  let totalBPM = 0;
  for (const orb of orbs) {
    if (orbAudioState[orb.id]?.playing) totalBPM += getOrbBPM(orb);
  }
  if (totalBPM > 0) gradientAngle += (totalBPM / 60) * Math.PI * 2 * 0.04 * dt;

  updateOrbBeats(now);
  updateAllOrbAudio();

  computeField(t);
  updateLevelColors();
  updateBlobPath(t);

  // -- Topo --
  tCtx.clearRect(0,0,W,H);
  traceBlobSmooth(tCtx);
  const fg=tCtx.createRadialGradient(W*.5,H*.42,0,W*.5,H*.5,Math.max(W,H)*.52);
  fg.addColorStop(0,'rgba(10,12,35,0.97)');fg.addColorStop(.5,'rgba(6,8,24,0.98)');fg.addColorStop(1,'rgba(3,3,14,0.99)');
  tCtx.fillStyle=fg;tCtx.fill();
  tCtx.strokeStyle='rgba(60,40,120,0.12)';tCtx.lineWidth=1;tCtx.stroke();

  tCtx.save();
  traceBlobSmooth(tCtx);tCtx.clip();tCtx.shadowBlur=0;
  tCtx.lineCap='round';tCtx.lineJoin='round';

  // -- Base topo levels --
  for(let i=0;i<LEVELS;i++){
    tCtx.strokeStyle=levelColors[i];
    tCtx.lineWidth=levelWidths[i];
    tCtx.shadowBlur=0;
    drawSmoothedContour(tCtx,levelThresh[i]);
  }

  // -- Per-orb colored topo rings that pulse on beat --
  const ORB_RING_OFFSETS = [-0.06, -0.035, -0.015, 0.005, 0.025, 0.048];
  for (const orb of orbs) {
    const ob = orbBeats[orb.id];
    if (!ob) continue;
    const fieldVal = getOrbFieldValue(orb);
    const [cr,cg,cb] = orb.color;
    const pi = ob.pulseIntensity;
    const vol = getOrbVolume(orb);

    ORB_RING_OFFSETS.forEach((offset, ri) => {
      const threshold = fieldVal + offset;
      if (threshold < 0.01 || threshold > 1.5) return;

      const ringFade = 1 - ri * 0.14;
      const baseAlpha = 0.08 + ri * 0.03;
      const baseWidth = 0.5 + ri * 0.12;

      if (pi > 0) {
        const flare = pi * ringFade * Math.max(0.3, vol);
        tCtx.strokeStyle = 'rgba('+cr+','+cg+','+cb+','+(baseAlpha + flare * 0.65).toFixed(2)+')';
        tCtx.lineWidth   = baseWidth * (1 + flare * 3);
        tCtx.shadowBlur  = flare * 16;
        tCtx.shadowColor = 'rgba('+cr+','+cg+','+cb+','+(flare * 0.6).toFixed(2)+')';
      } else {
        tCtx.strokeStyle = 'rgba('+cr+','+cg+','+cb+','+(baseAlpha * 0.35 * vol).toFixed(2)+')';
        tCtx.lineWidth   = baseWidth * 0.55;
        tCtx.shadowBlur  = 0;
      }
      drawSmoothedContour(tCtx, threshold);
    });
    tCtx.shadowBlur = 0;
  }

  // -- Soft glow pass on inner rings --
  tCtx.shadowBlur=5;tCtx.shadowColor='rgba(140,45,180,0.18)';
  for(let i=LEVELS-6;i<LEVELS;i++){
    tCtx.strokeStyle=levelColors[i];tCtx.lineWidth=levelWidths[i]*1.05;
    drawSmoothedContour(tCtx,levelThresh[i]);
  }
  tCtx.shadowBlur=0;tCtx.restore();

  // -- Centre visualizer --
  drawVisualizer(now);

  // -- Ripples --
  drawRipples(now);

  // -- Pixels every 3 frames --
  pixFrame++;if(pixFrame%3===0)drawPixels(t);

  requestAnimationFrame(draw);
}
requestAnimationFrame(draw);
</script>
</body>
</html>`;