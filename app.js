const CITIES={
  berlin:{preview:'assets/berlin-preview.png',region:{fr:'BERLIN',en:'BERLIN'},title:{fr:'OVW4 Berlin',en:'OVW4 Berlin'},summary:{fr:'Map Berlin modifiée avec rails ouverts et parcours de pièces optimisé.',en:'Modified Berlin map with open rails and optimized coin routes.'},options:[
    {url:'maps/full-open/index.html?mode=training',badge:{fr:'FULL OUVERT',en:'FULL OPEN'},title:{fr:'Full Ouvert',en:'Full Open'},sub:{fr:'Rails ouverts avec pièces',en:'Open rails with coins'}},
    {url:'maps/full-barriers/index.html?mode=training',badge:{fr:'BARRIÈRES',en:'BARRIERS'},title:{fr:'Barrières',en:'Full Barriers'},sub:{fr:'Barrières roll sur toutes les lignes',en:'Roll barriers on all lanes'}},
    {url:'maps/full-closed/index.html?mode=training',badge:{fr:'FERMÉ',en:'FULL CLOSED'},title:{fr:'Full Fermé',en:'Full Closed'},sub:{fr:'Barrières jump fermées',en:'Closed jump barriers'}}
  ]},
  monaco:{preview:'assets/monaco-preview.png',region:{fr:'MONACO',en:'MONACO'},title:{fr:'OVW4 Monaco',en:'OVW4 Monaco'},summary:{fr:'Map Monaco modifiée avec circuit optimisé pour le training.',en:'Modified Monaco map with optimized training circuit.'},options:[
    {url:'maps/monaco-full-open/index.html?mode=training',badge:{fr:'FULL OUVERT',en:'FULL OPEN'},title:{fr:'Full Ouvert',en:'Full Open'},sub:{fr:'Circuit ouvert avec pièces',en:'Open circuit with coins'}},
    {url:'maps/monaco-full-barriers/index.html?mode=training',badge:{fr:'BARRIÈRES',en:'BARRIERS'},title:{fr:'Barrières',en:'Full Barriers'},sub:{fr:'Barrières roll sur toutes les lignes',en:'Roll barriers on all lanes'}},
    {url:'maps/monaco-full-closed/index.html?mode=training',badge:{fr:'FERMÉ',en:'FULL CLOSED'},title:{fr:'Full Fermé',en:'Full Closed'},sub:{fr:'Barrières jump fermées',en:'Closed jump barriers'}}
  ]},
  sanfrancisco:{preview:'assets/sanfrancisco-preview.png',region:{fr:'SAN FRANCISCO',en:'SAN FRANCISCO'},title:{fr:'OVW4 San Francisco',en:'OVW4 San Francisco'},summary:{fr:'Map San Francisco avec ses célèbres tramways et le Golden Gate.',en:'San Francisco map featuring famous trams and the Golden Gate.'},options:[
    {url:'maps/sf-full-open/index.html?mode=training',badge:{fr:'FULL OUVERT',en:'FULL OPEN'},title:{fr:'Full Ouvert',en:'Full Open'},sub:{fr:'Rails ouverts avec pièces',en:'Open rails with coins'}},
    {url:'maps/sf-full-barriers/index.html?mode=training',badge:{fr:'BARRIÈRES',en:'BARRIERS'},title:{fr:'Barrières',en:'Full Barriers'},sub:{fr:'Barrières roll sur toutes les lignes',en:'Roll barriers on all lanes'}},
    {url:'maps/sf-full-closed/index.html?mode=training',badge:{fr:'FERMÉ',en:'FULL CLOSED'},title:{fr:'Full Fermé',en:'Full Closed'},sub:{fr:'Barrières jump fermées',en:'Closed jump barriers'}}
  ]}
};

let lang=localStorage.getItem('ovw4_lang')||'fr';
let city='berlin', optIdx=0, selOpen=false;
let resOn=localStorage.getItem('ovw4_res_on')==='true';
let resW=parseInt(localStorage.getItem('ovw4_res_w')||'608');
let resH=parseInt(localStorage.getItem('ovw4_res_h')||'1080');
let strOn=localStorage.getItem('ovw4_str')==='true';
let strVal=parseInt(localStorage.getItem('ovw4_str_val')||'0');

const t=o=>o[lang]||o.fr;

// ── STARS ──
function stars(id){
  const c=document.getElementById(id);if(!c)return;
  const x=c.getContext('2d');let s=[];
  const resize=()=>{c.width=innerWidth;c.height=innerHeight;s=Array.from({length:200},()=>({x:Math.random()*c.width,y:Math.random()*c.height,r:Math.random()*1.4+.3,a:Math.random()*Math.PI*2,sp:Math.random()*.005+.002}));};
  const draw=()=>{x.clearRect(0,0,c.width,c.height);s.forEach(p=>{p.a+=p.sp;const al=(Math.sin(p.a)+1)/2*.75+.1;x.beginPath();x.arc(p.x,p.y,p.r,0,Math.PI*2);x.fillStyle=`rgba(210,190,255,${al})`;x.fill();});requestAnimationFrame(draw);};
  resize();draw();addEventListener('resize',resize);
}

// ── RENDER ──
function renderCity(){
  const d=CITIES[city];
  document.getElementById('preview').src=d.preview;
  document.getElementById('region').textContent=t(d.region);
  document.getElementById('cityTitle').textContent=t(d.title);
  document.getElementById('summary').textContent=t(d.summary);
  document.getElementById('fieldLabel').textContent=lang==='fr'?'TYPE DE VERSION':'VERSION TYPE';
  document.getElementById('playLabel').textContent=lang==='fr'?'JOUER':'PLAY';
  document.getElementById('settingsTitle').textContent=lang==='fr'?'Paramètres':'Settings';
  document.getElementById('tabRes').textContent=lang==='fr'?'Résolution':'Resolution';
  document.getElementById('resLabel').textContent=lang==='fr'?'Résolution personnalisée':'Custom resolution';
  document.getElementById('resHint').textContent=lang==='fr'?'Appuie sur F11 pour le plein écran.':'Press F11 for full-screen.';
  document.getElementById('stretchLabel').textContent=lang==='fr'?'Intensité':'Intensity';
  document.getElementById('stretchHint').textContent=lang==='fr'?'Étire le jeu horizontalement. Désactive la résolution personnalisée.':'Stretches the game horizontally. Disables custom resolution.';
  document.getElementById('resReset').textContent=lang==='fr'?'Réinitialiser':'Reset';
  document.getElementById('stretchReset').textContent=lang==='fr'?'Réinitialiser':'Reset';
  renderOpts(); updateSel();
}

function renderOpts(){
  const opts=CITIES[city].options;
  document.getElementById('optPanel').innerHTML=opts.map((o,i)=>`
    <button class="option${i===optIdx?' is-selected':''}" data-i="${i}" role="option">
      <span class="radio-dot"></span>
      <span><strong>${t(o.title)}</strong><small>${t(o.sub)}</small></span>
    </button>`).join('');
  document.querySelectorAll('.option').forEach(b=>b.addEventListener('click',()=>{
    optIdx=+b.dataset.i; renderOpts(); updateSel(); closeSel();
  }));
}

function updateSel(){
  const o=CITIES[city].options[optIdx];
  document.getElementById('badge').textContent=t(o.badge);
  document.getElementById('selTitle').textContent=t(o.title);
  document.getElementById('selSub').textContent=t(o.sub);
}

const openSel=()=>{selOpen=true;document.getElementById('sel').dataset.open='true';document.getElementById('selBtn').setAttribute('aria-expanded','true');};
const closeSel=()=>{selOpen=false;document.getElementById('sel').dataset.open='false';document.getElementById('selBtn').setAttribute('aria-expanded','false');};

// ── PLAY — ouvre directement la map ──
function play(){
  const o=CITIES[city].options[optIdx];
  const url=new URL(o.url, location.href).href;
  window.open(url,'_blank');
}

// ── SETTINGS ──
function saveS(){localStorage.setItem('ovw4_res_on',resOn);localStorage.setItem('ovw4_res_w',resW);localStorage.setItem('ovw4_res_h',resH);localStorage.setItem('ovw4_str',strOn);localStorage.setItem('ovw4_str_val',strVal);}
function syncUI(){
  document.getElementById('resToggle').setAttribute('aria-pressed',resOn);
  document.getElementById('resW').value=resW;document.getElementById('resH').value=resH;
  document.getElementById('resFields').style.opacity=resOn?'1':'.4';
  document.getElementById('resFields').style.pointerEvents=resOn?'all':'none';
  document.getElementById('stretchToggle').setAttribute('aria-pressed',strOn);
  document.getElementById('stretchSlider').value=strVal;
  document.getElementById('stretchValDisplay').textContent=strVal+'%';
  document.getElementById('stretchBody').classList.toggle('on',strOn);
}
const openSettings=()=>{document.getElementById('settingsOverlay').removeAttribute('hidden');syncUI();};
const closeSettings=()=>document.getElementById('settingsOverlay').setAttribute('hidden','');

// ── INTRO ──
let done=false;
function skipIntro(){
  if(done)return; done=true;
  document.getElementById('intro').classList.add('fade-out');
  document.getElementById('shell').removeAttribute('inert');
  setTimeout(()=>document.getElementById('intro')?.remove(),900);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded',()=>{
  stars('introStars'); stars('bgStars');

  // Son + auto skip après 5s
  const audio=document.getElementById('audio');
  const tryPlay=()=>{ audio.play().catch(()=>{}); };
  document.addEventListener('click',tryPlay,{once:true});
  tryPlay();
  setTimeout(()=>{if(!done)skipIntro();},5000);
  document.getElementById('intro').addEventListener('click',skipIntro);

  // Langue
  document.getElementById('langBtn').addEventListener('click',()=>{
    lang=lang==='fr'?'en':'fr';
    localStorage.setItem('ovw4_lang',lang);
    document.getElementById('langBtn').textContent=lang.toUpperCase();
    renderCity();
  });

  // City tabs
  document.querySelectorAll('.city-tab').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.city-tab').forEach(x=>x.classList.remove('is-selected'));
    b.classList.add('is-selected'); city=b.dataset.city; optIdx=0; closeSel(); renderCity();
  }));

  // Selector
  document.getElementById('selBtn').addEventListener('click',e=>{e.stopPropagation();selOpen?closeSel():openSel();});
  document.addEventListener('click',e=>{if(!document.getElementById('sel').contains(e.target))closeSel();});

  // Play
  document.getElementById('playBtn').addEventListener('click',play);

  // Settings
  document.getElementById('settingsBtn').addEventListener('click',openSettings);
  document.getElementById('settingsClose').addEventListener('click',closeSettings);
  document.getElementById('settingsOverlay').addEventListener('click',e=>{if(e.target===document.getElementById('settingsOverlay'))closeSettings();});

  // Tabs settings
  document.querySelectorAll('.stab').forEach(b=>b.addEventListener('click',()=>{
    document.querySelectorAll('.stab').forEach(x=>x.classList.remove('is-active')); b.classList.add('is-active');
    document.getElementById('panelRes').hidden=b.dataset.tab!=='res';
    document.getElementById('panelStretch').hidden=b.dataset.tab!=='stretch';
  }));

  // Resolution
  document.getElementById('resToggle').addEventListener('click',()=>{resOn=!resOn;if(resOn)strOn=false;saveS();syncUI();});
  document.getElementById('resW').addEventListener('input',e=>{resW=+e.target.value||608;saveS();});
  document.getElementById('resH').addEventListener('input',e=>{resH=+e.target.value||1080;saveS();});
  document.querySelectorAll('.res-presets button').forEach(b=>b.addEventListener('click',()=>{resW=+b.dataset.w;resH=+b.dataset.h;resOn=true;strOn=false;saveS();syncUI();}));
  document.getElementById('resReset').addEventListener('click',()=>{resOn=false;resW=608;resH=1080;saveS();syncUI();});

  // Stretch
  document.getElementById('stretchToggle').addEventListener('click',()=>{strOn=!strOn;if(strOn)resOn=false;saveS();syncUI();});
  document.getElementById('stretchSlider').addEventListener('input',e=>{strVal=+e.target.value;document.getElementById('stretchValDisplay').textContent=strVal+'%';saveS();});
  document.getElementById('stretchReset').addEventListener('click',()=>{strOn=false;strVal=0;saveS();syncUI();});

  // Escape
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSettings();closeSel();}});

  renderCity();
});
