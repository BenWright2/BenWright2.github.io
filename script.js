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