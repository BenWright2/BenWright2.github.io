const menu=document.querySelector('.menu'),links=document.querySelector('.links');
menu.addEventListener('click',()=>links.classList.toggle('open'));
document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();
// Gentle scroll-linked image drift. CSS transforms only; disabled for reduced-motion users.
const layers=[...document.querySelectorAll('.parallax')];
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let ticking=false;
function updateParallax(){
  if(reduce)return;
  const vh=window.innerHeight;
  for(const el of layers){
    const r=el.getBoundingClientRect();
    if(r.bottom < -100 || r.top > vh+100) continue;
    const speed=Number(el.dataset.speed||.12);
    const center=(r.top+r.height/2-vh/2);
    let shift=-center*speed;
    // .parallax-lock: the whole frame drifts, but never moves down from its resting spot,
    // so it stays attached to its section edge / stops just above its caption (no gap, no overlap).
    if(el.classList.contains('parallax-lock')) shift=Math.min(shift,0);
    el.style.transform=`translate3d(0,${shift.toFixed(1)}px,0)`;
  }
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateParallax);ticking=true;}},{passive:true});
window.addEventListener('resize',updateParallax);updateParallax();

// Seamless auto-scrolling photo strip.
// Clones the photo set enough times to always fill the screen, then slides the track
// left by exactly one set's width, so the loop restarts invisibly.
const marqueeTrack=document.querySelector('.marquee-track');
const marqueeSpeed=40; // pixels per second — raise for faster, lower for slower
function buildMarquee(){
  if(!marqueeTrack||reduce)return;
  const original=marqueeTrack.querySelector('.marquee-set:not(.clone)');
  if(!original)return;
  marqueeTrack.querySelectorAll('.marquee-set.clone').forEach(c=>c.remove());
  const w=original.offsetWidth;
  if(!w)return;
  const copies=Math.ceil(window.innerWidth/w)+1;
  for(let i=0;i<copies;i++){
    const c=original.cloneNode(true);
    c.classList.add('clone');
    c.setAttribute('aria-hidden','true');
    c.querySelectorAll('img').forEach(img=>img.alt='');
    marqueeTrack.appendChild(c);
  }
  marqueeTrack.style.setProperty('--shift',w+'px');
  marqueeTrack.style.setProperty('--dur',(w/marqueeSpeed).toFixed(1)+'s');
}
buildMarquee();
let marqueeTimer;
window.addEventListener('resize',()=>{clearTimeout(marqueeTimer);marqueeTimer=setTimeout(buildMarquee,200);});