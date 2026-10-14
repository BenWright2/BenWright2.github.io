const menu=document.querySelector('.menu'),links=document.querySelector('.links');
menu.addEventListener('click',()=>links.classList.toggle('open'));
document.querySelectorAll('.links a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
document.getElementById('year').textContent=new Date().getFullYear();
// Gentle scroll-linked image drift. CSS transforms only; disabled for reduced-motion users.
const layers=[...document.querySelectorAll('.parallax')];
// "Inner" parallax: the frame stays put, only the image drifts inside it (no gaps possible).
const inner=[...document.querySelectorAll('.parallax-inner')];
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
    const shift=-center*speed;
    el.style.transform=`translate3d(0,${shift.toFixed(1)}px,0)`;
  }
  for(const el of inner){
    const r=el.getBoundingClientRect();
    if(r.bottom < -100 || r.top > vh+100) continue;
    const scale=Number(el.dataset.scale||1.4);
    const buffer=r.height*(scale-1)/2;                 // max travel before an edge could show
    // 0 when the frame enters at the bottom of the screen, 1 when it leaves at the top
    const p=Math.max(0,Math.min(1,(vh-r.top)/(vh+r.height)));
    const shift=(p-.5)*2*buffer;                       // spreads full travel across the whole scroll
    el.querySelector('img').style.transform=`translate3d(0,${shift.toFixed(1)}px,0) scale(${scale})`;
  }
  ticking=false;
}
window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateParallax);ticking=true;}},{passive:true});
window.addEventListener('resize',updateParallax);updateParallax();