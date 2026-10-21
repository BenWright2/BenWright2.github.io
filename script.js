const menu=document.querySelector('.menu'),
      links=document.querySelector('.links');

menu.addEventListener('click',()=>links.classList.toggle('open'));

document.querySelectorAll('.links a').forEach(a=>
    a.addEventListener('click',()=>links.classList.remove('open'))
);

document.getElementById('year').textContent=new Date().getFullYear();

// Gentle scroll-linked image drift.
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

        if(el.classList.contains('parallax-lock')){
            shift=Math.min(shift,0);
        }

        el.style.transform=`translate3d(0,${shift.toFixed(1)}px,0)`;
    }

    ticking=false;
}

window.addEventListener('scroll',()=>{
    if(!ticking){
        requestAnimationFrame(updateParallax);
        ticking=true;
    }
},{passive:true});

window.addEventListener('resize',updateParallax);
updateParallax();

// Seamless auto-scrolling photo strips.
const marqueeTracks=[...document.querySelectorAll('.marquee-track')];
const marqueeSpeedFactor=reduce?0.6:1;

function buildMarquee(){
    for(const track of marqueeTracks){
        const original=track.querySelector('.marquee-set:not(.clone)');
        if(!original)continue;

        track.querySelectorAll('.marquee-set.clone').forEach(c=>c.remove());

        const w=original.offsetWidth;
        if(!w)continue;

        const speed=Number(track.dataset.speed||40)*marqueeSpeedFactor;
        const copies=Math.ceil(window.innerWidth/w)+1;

        for(let i=0;i<copies;i++){
            const c=original.cloneNode(true);
            c.classList.add('clone');
            c.setAttribute('aria-hidden','true');
            c.querySelectorAll('img').forEach(img=>img.alt='');
            track.appendChild(c);
        }

        track.style.setProperty('--shift',(-w)+'px');
        track.style.setProperty('--dur',(w/speed).toFixed(1)+'s');
    }
}

buildMarquee();

window.addEventListener('load',buildMarquee);

let lastW=window.innerWidth,marqueeTimer;

window.addEventListener('resize',()=>{
    if(window.innerWidth===lastW)return;

    lastW=window.innerWidth;
    clearTimeout(marqueeTimer);
    marqueeTimer=setTimeout(buildMarquee,200);
});

// Falling petals: scattered through the sections below "About",
// drifting down and swaying as you scroll.
const petalImages=['petal1.png','petal2.png'];
const petalSections={'.statement':4,'.story':6,'.locations':5,'.contact':3};
const petalScale=window.innerWidth<700?.7:1;
const petals=[];
let seed=7;
const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;

for(const [selector,count] of Object.entries(petalSections)){
    const sec=document.querySelector(selector);
    if(!sec)continue;

    for(let i=0;i<count;i++){
        const el=document.createElement('img');
        el.className='petal';
        el.alt='';
        el.setAttribute('aria-hidden','true');
        el.src=petalImages[Math.floor(rnd()*petalImages.length)];
        el.style.width=((26+rnd()*34)*petalScale).toFixed(0)+'px';
        el.style.left=(4+rnd()*90).toFixed(1)+'%';
        el.style.top=(4+rnd()*86).toFixed(1)+'%';
        sec.appendChild(el);

        petals.push({
            el,sec,
            speed:.05+rnd()*.14,
            rot:rnd()*360,
            spin:(rnd()-.5)*.12,
            ph:rnd()*6,
            amp:8+rnd()*14
        });
    }
}

let petalTicking=false;

function updatePetals(){
    const vh=window.innerHeight;

    for(const p of petals){
        const r=p.sec.getBoundingClientRect();
        if(r.bottom < -150 || r.top > vh+150) continue;

        const center=r.top+r.height/2-vh/2;
        const y=-center*p.speed;
        const x=Math.sin(window.scrollY/130+p.ph)*p.amp;
        const rot=p.rot+window.scrollY*p.spin*3+Math.sin(window.scrollY/160+p.ph)*18;

        p.el.style.transform=`translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${rot.toFixed(1)}deg)`;
    }

    petalTicking=false;
}

if(reduce){
    // Still petals, no motion.
    for(const p of petals) p.el.style.transform=`rotate(${p.rot.toFixed(0)}deg)`;
}else{
    window.addEventListener('scroll',()=>{
        if(!petalTicking){
            requestAnimationFrame(updatePetals);
            petalTicking=true;
        }
    },{passive:true});

    window.addEventListener('resize',updatePetals);
    updatePetals();
}