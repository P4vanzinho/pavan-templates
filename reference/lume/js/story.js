import {photos} from './content.js';

const imageIntervalMs=3000;

export function initStorySlideshow(){
  const story=document.querySelector('[data-story-slideshow]');
  if(!story)return()=>{};
  const shots=[...story.querySelectorAll('[data-story-shot]')];
  const count=story.querySelector('[data-story-count]');
  const label=story.querySelector('[data-story-label]');
  const progress=story.querySelector('.story-progress span');
  const toggle=story.querySelector('[data-story-toggle]');
  const prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  let active=0;
  let paused=prefersReduced;
  let visible=false;
  let timer=null;
  let progressAnimation=null;

  const show=index=>{
    const previous=active;
    active=index%shots.length;
    shots.forEach((shot,i)=>{
      shot.classList.toggle('is-active',i===active);
      shot.classList.toggle('is-previous',i===previous&&i!==active);
      shot.setAttribute('aria-hidden',String(i!==active));
    });
    count.textContent=`${String(active+1).padStart(2,'0')} / ${String(shots.length).padStart(2,'0')}`;
    label.textContent=photos[shots[active].dataset.storyKey].label;
  };
  const stop=()=>{
    clearTimeout(timer);
    timer=null;
    progressAnimation?.cancel();
    progressAnimation=null;
    progress.style.transform='scaleX(0)';
  };
  const play=()=>{
    stop();
    if(paused||!visible||document.hidden||shots.length<2)return;
    if(!prefersReduced){
      progressAnimation=progress.animate([{transform:'scaleX(0)'},{transform:'scaleX(1)'}],{duration:imageIntervalMs,easing:'linear',fill:'forwards'});
    }
    timer=setTimeout(()=>{show(active+1);play();},imageIntervalMs);
  };
  const updateToggle=()=>{
    const text=paused?'Reproduzir sequência':'Pausar sequência';
    toggle.setAttribute('aria-label',text);
    toggle.title=text;
    toggle.classList.toggle('is-paused',paused);
  };
  const onToggle=()=>{paused=!paused;updateToggle();play();};
  const onVisibility=()=>play();
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    const nextVisible=entries[0].isIntersecting&&entries[0].intersectionRatio>=.25;
    if(visible!==nextVisible){visible=nextVisible;play();}
  },{threshold:[0,.25]}):null;
  show(0);
  updateToggle();
  toggle.addEventListener('click',onToggle);
  document.addEventListener('visibilitychange',onVisibility);
  if(observer)observer.observe(story);
  else{visible=true;play();}

  return()=>{
    stop();
    observer?.disconnect();
    toggle.removeEventListener('click',onToggle);
    document.removeEventListener('visibilitychange',onVisibility);
  };
}
