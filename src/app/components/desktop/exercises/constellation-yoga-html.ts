export const CONSTELLATION_YOGA_HTML = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Constellation Yoga Animation</title>
<link href="https://fonts.googleapis.com/css2?family=Inria+Serif:wght@300;400;700&family=Inria+Sans:wght@300;400;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box}
html,body{width:100%;height:100%;overflow:hidden;background:#0a0f1e;font-family:'Inria Sans',sans-serif}

/* ── Animated background (cross-fading layers) ── */
.bg-layer{position:absolute;inset:0;opacity:0;animation:bgFade 20s ease-in-out infinite}
@keyframes bgFade{
  0%{opacity:0}
  8.33%{opacity:1}
  25%{opacity:1}
  33.33%{opacity:0}
  100%{opacity:0}
}
#noise{position:absolute;inset:0;opacity:.1;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}

/* ── Layout ── */
#root{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:16px}
.row{display:flex;align-items:stretch;position:relative}

/* ── Side panels ── */
.panel{flex:none;width:100px;height:650px;position:relative}
.panel-bg{position:absolute;inset:0;backdrop-filter:blur(4px);background:rgba(15,23,41,.4);border:1px solid rgba(255,255,255,.08);box-shadow:0 4px 16px rgba(0,0,0,.3)}
.panel-left .panel-bg{border-radius:24px 0 0 24px}
.panel-right .panel-bg{border-radius:0 24px 24px 0}
.panel-inner{position:absolute;inset:1px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(to bottom,rgba(15,23,41,.6),rgba(26,38,66,.6))}
.panel-left .panel-inner{border-radius:23px 0 0 23px;padding-right:16px}
.panel-right .panel-inner{border-radius:0 23px 23px 0;padding-left:16px}
.panel-divider{position:absolute;top:50%;left:0;right:0;height:1px;background:rgba(255,255,255,.1)}
.panel-label{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);padding:4px 8px;border-radius:8px;border:1px solid rgba(255,255,255,.1);background:rgba(15,23,41,.8);font-size:12px;color:rgba(255,255,255,.7);text-transform:uppercase;letter-spacing:.08em;white-space:nowrap}

/* ── Panel buttons ── */
.pbtn{position:absolute;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:4px;padding:12px 8px;background:none;border:none;cursor:pointer;transition:transform .15s}
.pbtn:hover{transform:translateX(-50%) scale(1.08)}
.pbtn:active{transform:translateX(-50%) scale(.94)}
.pbtn-label{font-family:'Inria Sans',sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:.06em;transition:color .3s}
.pbtn-circle{width:30px;height:30px;border-radius:50%;transition:opacity .3s,background .3s,box-shadow .3s}
.pbtn[disabled]{cursor:default}
.pbtn[disabled]:hover{transform:translateX(-50%)}
.chev path{transition:opacity .3s,filter .3s}

/* ── Center frame ── */
.center{position:relative;width:900px;height:650px;z-index:10;margin:0 -16px;flex:none}
.frame-border{position:absolute;inset:0;border-radius:24px;backdrop-filter:blur(4px);background:linear-gradient(135deg,rgba(96,165,250,.15),rgba(139,92,246,.12) 50%,rgba(74,222,128,.1));border:1px solid rgba(255,255,255,.1);box-shadow:0 8px 32px rgba(31,38,135,.37),inset 0 1px 2px rgba(255,255,255,.05)}
.frame-inner{position:absolute;inset:2px;border-radius:23px;overflow:hidden;background:linear-gradient(135deg,rgba(15,23,41,.95),rgba(26,38,66,.95) 50%,rgba(15,23,41,.95))}

/* ── Category bar ── */
#categories{position:absolute;top:24px;left:0;right:0;display:flex;justify-content:center;align-items:center;gap:48px;z-index:10;padding:0 32px;transition:opacity .5s,transform .5s}
#categories.hidden{opacity:0;transform:translateY(-10px);pointer-events:none}
.cat-btn{display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;transition:transform .15s}
.cat-btn:hover{transform:scale(1.08)}
.cat-btn:active{transform:scale(.94)}
.cat-shape{transition:opacity .3s,background .3s,box-shadow .3s}
.cat-shape.seated{width:36px;height:24px;border-radius:12px}
.cat-shape.standing{width:24px;height:36px;border-radius:12px}
.cat-shape.dynamic{width:28px;height:28px;border-radius:8px;transform:rotate(45deg)}
.cat-label{font-family:'Inria Sans',sans-serif;font-size:10px;text-transform:uppercase;letter-spacing:.06em;transition:color .3s}

/* ── Contour pattern ── */
.contours{position:absolute;inset:0;opacity:.1}

/* ── Star SVG ── */
#starfield{width:100%;height:100%;position:relative;padding:16px;display:flex;align-items:center;justify-content:center}
#starfield svg{width:100%;height:100%}

/* Star transitions */
.star-main{transition:cx 4s cubic-bezier(.4,0,.2,1),cy 4s cubic-bezier(.4,0,.2,1),opacity 1s,r .5s}
.star-halo{transition:cx 4s cubic-bezier(.4,0,.2,1),cy 4s cubic-bezier(.4,0,.2,1),opacity 1.2s 3s}
.star-ring{transition:cx 4s cubic-bezier(.4,0,.2,1),cy 4s cubic-bezier(.4,0,.2,1)}
.conn-line{transition:opacity 1.2s}

/* Pulse animation for rings */
@keyframes pulse{
  0%,100%{r:10;opacity:0}
  30%{opacity:.7}
  50%{r:17;opacity:0}
  80%{opacity:.7}
}
.ring-pulse{animation:pulse 3s ease-in-out infinite}

/* ── Pose name ── */
#pose-name{position:absolute;bottom:48px;left:50%;transform:translateX(-50%);font-family:'Inria Serif',serif;font-size:24px;color:rgba(255,255,255,.7);text-align:center;letter-spacing:.04em;white-space:nowrap;transition:opacity 1s,transform 1s;opacity:0;transform:translateX(-50%) translateY(20px)}
#pose-name.visible{opacity:1;transform:translateX(-50%) translateY(0)}
</style>
</head>
<body>

<div class="bg-layer" style="background:radial-gradient(ellipse at 20% 30%,#1e3a5f 0%,#0a0f1e 50%,#1a2e3f 100%);animation-delay:0s"></div>
<div class="bg-layer" style="background:radial-gradient(ellipse at 80% 70%,#2d1b4e 0%,#0a0f1e 50%,#1e3a5f 100%);animation-delay:-5s"></div>
<div class="bg-layer" style="background:radial-gradient(ellipse at 50% 50%,#1a3a3a 0%,#0a0f1e 50%,#2d1b4e 100%);animation-delay:-10s"></div>
<div class="bg-layer" style="background:radial-gradient(ellipse at 30% 80%,#1e3a5f 0%,#0a0f1e 50%,#1a3a3a 100%);animation-delay:-15s"></div>
<div id="noise"></div>

<div id="root">
  <div class="row">
    <!-- Left panel: Guide -->
    <div class="panel panel-left">
      <div class="panel-bg"></div>
      <div class="panel-inner">
        <div class="panel-divider"></div>
        <div class="panel-label">Guide</div>
        <button class="pbtn" id="btn-self" style="top:20%">
          <div class="pbtn-circle" id="circle-self"></div>
          <span class="pbtn-label" id="lbl-self">Self</span>
        </button>
        <button class="pbtn" id="btn-auto" style="bottom:20%">
          <svg width="40" height="40" fill="none" viewBox="0 0 40 40" stroke-linecap="round" stroke-linejoin="round">
            <path id="laptop-icon" d="M8 24 L8 14 C8 13 8.5 12 10 12 L30 12 C31.5 12 32 13 32 14 L32 24 M6 24 L34 24 C34.5 24 35 24.5 35 25 L35 26 C35 26.5 34.5 27 34 27 L6 27 C5.5 27 5 26.5 5 26 L5 25 C5 24.5 5.5 24 6 24" stroke-width="1.5"/>
          </svg>
          <span class="pbtn-label" id="lbl-auto">Auto</span>
        </button>
      </div>
    </div>

    <!-- Center -->
    <div class="center">
      <div class="frame-border"></div>
      <div class="frame-inner">
        <!-- Category filters (self-mode only) -->
        <div id="categories" class="hidden">
          <button class="cat-btn" data-cat="seated">
            <div class="cat-shape seated" id="cat-seated"></div>
            <span class="cat-label" id="catlbl-seated">Seated</span>
          </button>
          <button class="cat-btn" data-cat="standing">
            <div class="cat-shape standing" id="cat-standing"></div>
            <span class="cat-label" id="catlbl-standing">Standing</span>
          </button>
          <button class="cat-btn" data-cat="dynamic">
            <div class="cat-shape dynamic" id="cat-dynamic"></div>
            <span class="cat-label" id="catlbl-dynamic">Dynamic</span>
          </button>
        </div>

        <!-- Contour pattern -->
        <svg class="contours" width="100%" height="100%">
          <defs>
            <pattern id="contours-pat" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
              <path d="M50,100 Q75,80 100,100 T150,100" stroke="#6366f1" stroke-width="0.5" fill="none" opacity="0.3"/>
              <path d="M30,120 Q60,95 100,120 T170,120" stroke="#8b5cf6" stroke-width="0.5" fill="none" opacity="0.2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#contours-pat)"/>
        </svg>

        <!-- Star field -->
        <div id="starfield">
          <svg viewBox="0 0 1000 700" id="sky">
            <defs>
              <filter id="gp" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              <filter id="gw" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            </defs>
            <g id="connections"></g>
            <g id="stars"></g>
          </svg>
        </div>

        <div id="pose-name"></div>
      </div>
    </div>

    <!-- Right panel: Speed -->
    <div class="panel panel-right">
      <div class="panel-bg"></div>
      <div class="panel-inner">
        <div class="panel-divider"></div>
        <div class="panel-label">Speed</div>
        <button class="pbtn chev" id="btn-faster" style="top:30%">
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32" stroke-linecap="round" stroke-linejoin="round"><path d="M8 20 L16 12 L24 20" stroke="#fff" stroke-width="2.5" id="chev-up"/></svg>
        </button>
        <button class="pbtn chev" id="btn-slower" style="bottom:30%">
          <svg width="32" height="32" fill="none" viewBox="0 0 32 32" stroke-linecap="round" stroke-linejoin="round"><path d="M8 12 L16 20 L24 12" stroke="#fff" stroke-width="2.5" id="chev-down"/></svg>
        </button>
      </div>
    </div>
  </div>
</div>

<script>
/* ================================================================
   Constellation Yoga – pure vanilla JS, zero dependencies
   ================================================================ */

// ── Pose data ──
var TOTAL = 100;
var colorMap = {'#F946B2':'#ec4899','#C446F9':'#a855f7','#6D46F9':'#6366f1','#46B5F9':'#3b82f6','#8B5CF6':'#8b5cf6'};
function glowC(c){ return c ? (colorMap[c]||c) : '#ffffff'; }

function fillPts(key){
  var pts = key.map(function(p){return {x:p.x,y:p.y,color:p.color,isKey:p.isKey};});
  for(var i=key.length;i<TOTAL;i++) pts.push({x:.1+Math.random()*.8, y:.1+Math.random()*.8, isKey:false});
  return pts;
}

function buildPoses(){
  return [
    {name:'Warrior II',category:'standing',
     points:fillPts([
       {x:.5,y:.25,color:'#F946B2',isKey:true},{x:.5,y:.3,isKey:true},
       {x:.2,y:.4,color:'#6D46F9',isKey:true},{x:.33,y:.4,isKey:true},
       {x:.45,y:.38,isKey:true},{x:.55,y:.38,isKey:true},
       {x:.67,y:.4,isKey:true},{x:.8,y:.4,color:'#6D46F9',isKey:true},
       {x:.5,y:.42,isKey:true},{x:.46,y:.52,color:'#8B5CF6',isKey:true},
       {x:.54,y:.52,color:'#8B5CF6',isKey:true},{x:.4,y:.65,isKey:true},
       {x:.6,y:.65,isKey:true},{x:.35,y:.75,isKey:true},
       {x:.65,y:.75,isKey:true},{x:.32,y:.78,color:'#46B5F9',isKey:true},
       {x:.68,y:.78,color:'#46B5F9',isKey:true}]),
     connections:[[0,1],[1,4],[1,5],[2,3],[3,4],[5,6],[6,7],[4,8],[5,8],[8,9],[8,10],[9,10],[9,11],[11,13],[13,15],[10,12],[12,14],[14,16]]},

    {name:'Tree Pose',category:'standing',
     points:fillPts([
       {x:.5,y:.2,color:'#F946B2',isKey:true},{x:.5,y:.25,isKey:true},
       {x:.47,y:.32,color:'#6D46F9',isKey:true},{x:.53,y:.32,color:'#6D46F9',isKey:true},
       {x:.46,y:.38,isKey:true},{x:.54,y:.38,isKey:true},
       {x:.5,y:.42,isKey:true},{x:.48,y:.55,color:'#8B5CF6',isKey:true},
       {x:.52,y:.55,color:'#8B5CF6',isKey:true},{x:.5,y:.68,isKey:true},
       {x:.5,y:.78,isKey:true},{x:.5,y:.82,color:'#46B5F9',isKey:true},
       {x:.58,y:.6,isKey:true},{x:.56,y:.63,color:'#46B5F9',isKey:true}]),
     connections:[[0,1],[1,2],[1,3],[2,3],[2,4],[3,5],[4,6],[5,6],[6,7],[6,8],[7,8],[7,9],[8,9],[9,10],[10,11],[8,12],[12,13]]},

    {name:'Downward Dog',category:'dynamic',
     points:fillPts([
       {x:.5,y:.55,color:'#F946B2',isKey:true},{x:.5,y:.5,isKey:true},
       {x:.3,y:.7,color:'#6D46F9',isKey:true},{x:.35,y:.68,isKey:true},
       {x:.44,y:.52,isKey:true},{x:.56,y:.52,isKey:true},
       {x:.65,y:.68,isKey:true},{x:.7,y:.7,color:'#6D46F9',isKey:true},
       {x:.5,y:.45,isKey:true},{x:.47,y:.32,color:'#8B5CF6',isKey:true},
       {x:.53,y:.32,color:'#8B5CF6',isKey:true},{x:.43,y:.5,isKey:true},
       {x:.57,y:.5,isKey:true},{x:.38,y:.72,color:'#46B5F9',isKey:true},
       {x:.62,y:.72,color:'#46B5F9',isKey:true}]),
     connections:[[0,1],[1,4],[1,5],[1,8],[2,3],[3,4],[5,6],[6,7],[4,8],[5,8],[8,9],[8,10],[9,10],[9,11],[11,13],[10,12],[12,14]]},

    {name:'Mountain Pose',category:'standing',
     points:fillPts([
       {x:.5,y:.2,color:'#F946B2',isKey:true},{x:.5,y:.27,isKey:true},
       {x:.44,y:.35,isKey:true},{x:.56,y:.35,isKey:true},
       {x:.5,y:.38,isKey:true},{x:.42,y:.48,isKey:true},
       {x:.58,y:.48,isKey:true},{x:.4,y:.58,color:'#6D46F9',isKey:true},
       {x:.6,y:.58,color:'#6D46F9',isKey:true},{x:.46,y:.52,color:'#8B5CF6',isKey:true},
       {x:.54,y:.52,color:'#8B5CF6',isKey:true},{x:.47,y:.68,isKey:true},
       {x:.53,y:.68,isKey:true},{x:.47,y:.78,isKey:true},
       {x:.53,y:.78,isKey:true},{x:.47,y:.82,color:'#46B5F9',isKey:true},
       {x:.53,y:.82,color:'#46B5F9',isKey:true}]),
     connections:[[0,1],[1,2],[1,3],[2,4],[3,4],[2,5],[5,7],[3,6],[6,8],[4,9],[4,10],[9,10],[9,11],[11,13],[13,15],[10,12],[12,14],[14,16]]},

    {name:'Seated Side Stretch',category:'seated',
     points:fillPts([
       {x:.48,y:.22,color:'#F946B2',isKey:true},{x:.48,y:.28,isKey:true},
       {x:.48,y:.38,isKey:true},{x:.44,y:.48,color:'#8B5CF6',isKey:true},
       {x:.52,y:.48,color:'#8B5CF6',isKey:true},{x:.38,y:.65,isKey:true},
       {x:.54,y:.65,isKey:true},{x:.35,y:.75,color:'#46B5F9',isKey:true},
       {x:.58,y:.75,color:'#46B5F9',isKey:true},{x:.35,y:.55,color:'#6D46F9',isKey:true},
       {x:.62,y:.15,color:'#6D46F9',isKey:true},{x:.42,y:.35,isKey:true},
       {x:.54,y:.32,isKey:true},{x:.58,y:.25,isKey:true}]),
     connections:[[0,1],[1,2],[2,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9],[8,10],[9,11],[10,12],[11,13],[12,14],[13,15]]},

    {name:'Wide Seated Forward Fold',category:'seated',
     points:fillPts([
       {x:.5,y:.32,color:'#F946B2',isKey:true},{x:.5,y:.38,isKey:true},
       {x:.5,y:.48,isKey:true},{x:.48,y:.55,color:'#8B5CF6',isKey:true},
       {x:.52,y:.55,color:'#8B5CF6',isKey:true},{x:.2,y:.6,isKey:true},
       {x:.8,y:.6,isKey:true},{x:.12,y:.65,isKey:true},
       {x:.88,y:.65,isKey:true},{x:.08,y:.68,color:'#46B5F9',isKey:true},
       {x:.92,y:.68,color:'#46B5F9',isKey:true},{x:.42,y:.62,color:'#6D46F9',isKey:true},
       {x:.58,y:.62,color:'#6D46F9',isKey:true},{x:.45,y:.45,isKey:true},
       {x:.55,y:.45,isKey:true}]),
     connections:[[0,1],[1,2],[2,3],[2,4],[3,5],[4,6],[5,7],[6,8],[7,9],[8,10],[9,11],[10,12],[11,13],[12,14],[13,15],[14,16]]}
  ];
}

// ── State ──
var allPoses = buildPoses();
var guideMode = 'auto';
var speed = 'normal';
var selectedCats = {};
var poseIdx = 0;
var isRevealing = true;
var firstRun = true;
var revealTimer = null, transTimer = null, nextTimer = null;
var connRevealTimers = [];
var SPEEDS = {slow:13000, normal:9000, fast:5000};

function hasCat(c){ return selectedCats[c]===true; }
function filteredPoses(){
  if(guideMode==='auto') return allPoses;
  var any=false; for(var k in selectedCats) if(selectedCats[k]) any=true;
  if(!any) return allPoses;
  return allPoses.filter(function(p){return selectedCats[p.category];});
}
function currentPose(){ var fp=filteredPoses(); return fp[poseIdx%fp.length]; }

// ── Coordinate helper ──
function px(norm,dim){ return norm*(dim-100)+50; }

// ── SVG namespace helper ──
var NS='http://www.w3.org/2000/svg';
function svgEl(tag,attrs){
  var el=document.createElementNS(NS,tag);
  for(var k in attrs) el.setAttribute(k,attrs[k]);
  return el;
}

// ── Build star DOM once ──
var starsG = document.getElementById('stars');
var connsG = document.getElementById('connections');
var starEls = [];

var firstPose=allPoses[0];
for(var i=0;i<TOTAL;i++){
  var pt=firstPose.points[i];
  var cx=px(pt.x,1000), cy=px(pt.y,700);
  var col=pt.color?glowC(pt.color):'#ffffff';
  var isKey=!!pt.isKey;
  var hasCol=!!pt.color;

  var halo=svgEl('circle',{cx:cx,cy:cy,r:15,fill:col,filter:'url(#gw)',opacity:0});
  halo.classList.add('star-halo');
  starsG.appendChild(halo);

  var main=svgEl('circle',{cx:cx,cy:cy,r:isKey?4.5:2.5,fill:col,filter:hasCol?'url(#gp)':'url(#gw)',opacity:isKey?1:.5});
  main.classList.add('star-main');
  starsG.appendChild(main);

  var ring=svgEl('circle',{cx:cx,cy:cy,r:10,fill:'none',stroke:col,'stroke-width':2,filter:'url(#gp)',opacity:0});
  ring.classList.add('star-ring');
  starsG.appendChild(ring);

  starEls.push({main:main,halo:halo,ring:ring,hasColor:hasCol});
}

// ── Pre-create connection lines ──
var MAX_CONNS=20;
var connEls=[];
for(var i=0;i<MAX_CONNS;i++){
  var line=svgEl('line',{x1:0,y1:0,x2:0,y2:0,stroke:'#6366f1','stroke-width':1.5,filter:'url(#gp)',opacity:0});
  line.classList.add('conn-line');
  connsG.appendChild(line);
  connEls.push(line);
}

// ── Render current pose (move stars) ──
function renderPose(){
  var pose=currentPose();
  if(!pose) return;

  pose.points.forEach(function(pt,i){
    var el=starEls[i];
    var c=px(pt.x,1000), y=px(pt.y,700);
    var col=pt.color?glowC(pt.color):'#ffffff';
    var isKey=!!pt.isKey;
    var hasCol=!!pt.color;

    el.main.setAttribute('cx',c);
    el.main.setAttribute('cy',y);
    el.main.setAttribute('r',isKey?4.5:2.5);
    el.main.setAttribute('fill',col);
    el.main.setAttribute('filter',hasCol?'url(#gp)':'url(#gw)');
    el.main.setAttribute('opacity',isKey?1:0.5);

    el.halo.setAttribute('cx',c);
    el.halo.setAttribute('cy',y);
    el.halo.setAttribute('fill',col);
    el.halo.setAttribute('opacity',0);

    el.ring.setAttribute('cx',c);
    el.ring.setAttribute('cy',y);
    el.ring.setAttribute('stroke',col);
    el.ring.classList.remove('ring-pulse');
    el.ring.setAttribute('opacity',0);

    el.hasColor=hasCol;
  });

  // Hide connections
  connEls.forEach(function(l){l.setAttribute('opacity',0);});

  // Hide pose name
  document.getElementById('pose-name').classList.remove('visible');
}

function revealDetails(){
  var pose=currentPose();
  if(!pose) return;

  // Halos and rings for colored points
  pose.points.forEach(function(pt,i){
    var el=starEls[i];
    if(el.hasColor){
      el.halo.setAttribute('opacity',.25);
      el.ring.setAttribute('opacity',1);
      el.ring.classList.add('ring-pulse');
    }
  });

  // Connections with stagger
  connRevealTimers.forEach(clearTimeout);
  connRevealTimers=[];
  pose.connections.forEach(function(c,i){
    if(i>=MAX_CONNS) return;
    var p1=pose.points[c[0]], p2=pose.points[c[1]];
    var line=connEls[i];
    line.setAttribute('x1',px(p1.x,1000));
    line.setAttribute('y1',px(p1.y,700));
    line.setAttribute('x2',px(p2.x,1000));
    line.setAttribute('y2',px(p2.y,700));
    connRevealTimers.push(setTimeout(function(){line.setAttribute('opacity',.4);},i*80));
  });

  // Pose name
  var el=document.getElementById('pose-name');
  el.textContent='Slowly take a '+pose.name.toLowerCase();
  el.classList.add('visible');
}

// ── Transition cycle ──
function scheduleCycle(){
  clearTimeout(revealTimer);
  clearTimeout(transTimer);
  clearTimeout(nextTimer);
  connRevealTimers.forEach(clearTimeout);
  connRevealTimers=[];

  isRevealing=true;
  renderPose();

  // After stars finish moving, reveal details
  var revealDelay=firstRun?300:3500;
  firstRun=false;
  revealTimer=setTimeout(function(){
    isRevealing=false;
    revealDetails();
  },revealDelay);

  // After full duration, fade out and advance
  transTimer=setTimeout(function(){
    isRevealing=true;
    document.getElementById('pose-name').classList.remove('visible');
    connEls.forEach(function(l){l.setAttribute('opacity',0);});
    starEls.forEach(function(el){
      el.halo.setAttribute('opacity',0);
      el.ring.classList.remove('ring-pulse');
      el.ring.setAttribute('opacity',0);
    });

    nextTimer=setTimeout(function(){
      poseIdx=(poseIdx+1)%filteredPoses().length;
      scheduleCycle();
    },1000);
  },SPEEDS[speed]);
}

// ── UI updates ──
function updateGuideUI(){
  var selfOn=guideMode==='self';
  var cs=document.getElementById('circle-self');
  cs.style.opacity=selfOn?1:.4;
  cs.style.background=selfOn?'rgba(139,92,246,.4)':'rgba(255,255,255,.2)';
  cs.style.border='1.5px solid '+(selfOn?'#8b5cf6':'#fff');
  cs.style.boxShadow=selfOn?'0 0 12px rgba(139,92,246,.6)':'none';
  document.getElementById('lbl-self').style.color=selfOn?'rgba(255,255,255,.9)':'rgba(255,255,255,.4)';

  var autoOn=guideMode==='auto';
  var lp=document.getElementById('laptop-icon');
  lp.setAttribute('stroke',autoOn?'#8b5cf6':'#fff');
  lp.style.filter=autoOn?'drop-shadow(0 0 8px rgba(139,92,246,.8))':'none';
  lp.style.opacity=autoOn?1:.4;
  document.getElementById('lbl-auto').style.color=autoOn?'rgba(255,255,255,.9)':'rgba(255,255,255,.4)';

  document.getElementById('categories').classList.toggle('hidden',!selfOn);
}

function updateSpeedUI(){
  var up=document.getElementById('chev-up');
  var dn=document.getElementById('chev-down');
  up.setAttribute('opacity',speed==='fast'?.3:.7);
  up.style.filter=speed==='fast'?'none':'drop-shadow(0 0 4px rgba(255,255,255,.3))';
  dn.setAttribute('opacity',speed==='slow'?.3:.7);
  dn.style.filter=speed==='slow'?'none':'drop-shadow(0 0 4px rgba(255,255,255,.3))';
  document.getElementById('btn-faster').disabled=speed==='fast';
  document.getElementById('btn-slower').disabled=speed==='slow';
}

function updateCatUI(){
  ['seated','standing','dynamic'].forEach(function(cat){
    var on=hasCat(cat);
    var shape=document.getElementById('cat-'+cat);
    shape.style.opacity=on?1:.4;
    shape.style.background=on?'rgba(139,92,246,.4)':'rgba(255,255,255,.2)';
    shape.style.border='1.5px solid '+(on?'#8b5cf6':'#fff');
    shape.style.boxShadow=on?'0 0 12px rgba(139,92,246,.6)':'none';
    document.getElementById('catlbl-'+cat).style.color=on?'rgba(255,255,255,.9)':'rgba(255,255,255,.4)';
  });
}

// ── Event handlers ──
document.getElementById('btn-self').onclick=function(){
  guideMode='self'; poseIdx=0; updateGuideUI(); scheduleCycle();
};
document.getElementById('btn-auto').onclick=function(){
  guideMode='auto'; poseIdx=0; updateGuideUI(); scheduleCycle();
};
document.getElementById('btn-faster').onclick=function(){
  if(speed==='slow') speed='normal'; else if(speed==='normal') speed='fast';
  updateSpeedUI(); scheduleCycle();
};
document.getElementById('btn-slower').onclick=function(){
  if(speed==='fast') speed='normal'; else if(speed==='normal') speed='slow';
  updateSpeedUI(); scheduleCycle();
};
document.querySelectorAll('.cat-btn').forEach(function(btn){
  btn.onclick=function(){
    var cat=btn.getAttribute('data-cat');
    selectedCats[cat]=!selectedCats[cat];
    poseIdx=0; updateCatUI(); scheduleCycle();
  };
});

// ── Init ──
updateGuideUI();
updateSpeedUI();
updateCatUI();
scheduleCycle();
<\/script>
</body>
</html>

`;