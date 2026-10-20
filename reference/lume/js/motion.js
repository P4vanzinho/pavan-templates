import {image} from './content.js';
import {initStorySlideshow} from './story.js';
import Lenis from '../vendor/lenis-1.3.26.mjs';

export const reducedMotion=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
let smoothScroller=null;

export function initSmoothScroll(){
  if(smoothScroller||reducedMotion())return()=>{};
  smoothScroller=new Lenis({autoRaf:false,lerp:.085,smoothWheel:true,syncTouch:false,wheelMultiplier:.92});
  let frame=0;
  const raf=time=>{smoothScroller?.raf(time);frame=requestAnimationFrame(raf);};
  frame=requestAnimationFrame(raf);
  return()=>{cancelAnimationFrame(frame);smoothScroller?.destroy();smoothScroller=null;};
}

export function smoothScrollTo(target,{immediate=false}={}){
  if(smoothScroller){smoothScroller.scrollTo(target,{immediate,duration:immediate?0:1.05,lock:false});return;}
  if(typeof target==='number'){
    window.scrollTo({top:target,left:0,behavior:immediate||reducedMotion()?'instant':'smooth'});
    return;
  }
  target.scrollIntoView({block:'start',behavior:immediate||reducedMotion()?'instant':'smooth'});
}

function revealImages(){
  const elements=document.querySelectorAll('[data-reveal]');
  if(reducedMotion()||!('IntersectionObserver' in window)){
    elements.forEach(el=>el.classList.add('is-visible'));
    return()=>{};
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
    });
  },{rootMargin:'0px 0px -12% 0px',threshold:0});
  elements.forEach(el=>observer.observe(el));
  return()=>observer.disconnect();
}

function scrollEffects(){
  const parallax=[...document.querySelectorAll('[data-parallax]')];
  let frame=0;
  const positions=new WeakMap();
  const ease=0.085;
  const update=()=>{
    frame=0;
    const staticMotion=reducedMotion();
    parallax.forEach(el=>{
      const layer=el.querySelector('.image-layer');
      if(!layer)return;
      if(staticMotion){layer.style.transform='';positions.delete(layer);return;}
      const box=el.getBoundingClientRect();
      if(box.bottom<0||box.top>innerHeight)return;
      const progress=clamp((innerHeight-box.top)/(innerHeight+box.height));
      const target=(progress-.5)*box.height*.1;
      const current=positions.get(layer)??target;
      const next=current+(target-current)*ease;
      positions.set(layer,next);
      layer.style.transform=`translate3d(0,${next.toFixed(2)}px,0)`;
    });
    if(!staticMotion&&parallax.length)frame=requestAnimationFrame(update);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  update();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
}

function cinematicHero(){
  const hero=document.querySelector('[data-hero-intro]');
  if(!hero||reducedMotion())return()=>{};
  const canvas=hero.querySelector('.hero-canvas');
  const copy=hero.querySelector('.hero-copy');
  const orbit=[...hero.querySelectorAll('.hero-orbit-image')];
  let frame=0;
  const update=()=>{
    frame=0;
    const range=Math.max(1,hero.offsetHeight-innerHeight);
    const progress=clamp(-hero.getBoundingClientRect().top/range);
    const eased=progress*progress*(3-2*progress);
    const rotations=[-8,1,8];
    orbit.forEach((item,index)=>{
      const drift=(index===1?-1: index===0?-1.35:1.35)*eased*innerHeight*.28;
      const scale=1+eased*(index===1?.16:.3);
      const opacity=1-Math.max(0,eased-.55)*1.8;
      const x=index===1?' translateX(-50%)':'';
      item.style.transform=`translate3d(0,${drift.toFixed(2)}px,0)${x} rotate(${(rotations[index]+(index===1?eased*2:eased*(index===0?-5:5))).toFixed(2)}deg) scale(${scale.toFixed(3)})`;
      item.style.opacity=String(Math.max(.08,opacity));
    });
    copy.style.transform=`translate3d(0,${(-eased*innerHeight*.18).toFixed(2)}px,0) scale(${(1+eased*.05).toFixed(3)})`;
    copy.style.opacity=String(Math.max(.18,1-eased*1.2));
    if(progress<1)frame=requestAnimationFrame(update);
  };
  const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule);
  update();
  return()=>{cancelAnimationFrame(frame);window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);};
}

function carousels(){
  const cleanups=[];
  document.querySelectorAll('[data-carousel]').forEach(carousel=>{
    const track=carousel.querySelector('.carousel-track');
    const slides=[...track.children];
    const total=Number(carousel.dataset.carouselTotal)||slides.length;
    const counter=carousel.querySelector('.carousel-counter');
    let activeIndex=total;
    let frame=0;
    let normalizeTimer=0;
    let drag=null;
    let suppressClick=false;

    const centeredLeft=slide=>{
      const trackBox=track.getBoundingClientRect();
      const slideBox=slide.getBoundingClientRect();
      return track.scrollLeft+slideBox.left-trackBox.left-(track.clientWidth-slideBox.width)/2;
    };
    const centerSlide=(index,behavior='smooth')=>{
      const slide=slides[Math.max(0,Math.min(slides.length-1,index))];
      if(!slide)return;
      track.scrollTo({left:centeredLeft(slide),behavior:reducedMotion()?'instant':behavior});
    };
    const realIndex=index=>((index%total)+total)%total;
    const normalize=()=>{
      normalizeTimer=0;
      if(activeIndex>=total&&activeIndex<total*2)return;
      const target=total+realIndex(activeIndex);
      activeIndex=target;
      centerSlide(target,'instant');
      update({normalize:false});
    };
    const scheduleNormalize=()=>{
      clearTimeout(normalizeTimer);
      normalizeTimer=window.setTimeout(normalize,120);
    };
    const update=({normalize=true}={})=>{
      frame=0;
      const mid=track.getBoundingClientRect().left+track.clientWidth/2;
      let closest=Infinity;
      slides.forEach((slide,index)=>{
        const rect=slide.getBoundingClientRect();
        const distance=Math.abs(rect.left+rect.width/2-mid);
        if(distance<closest){closest=distance;activeIndex=index;}
      });
      const current=realIndex(activeIndex);
      slides.forEach((slide,index)=>slide.classList.toggle('is-active',index===activeIndex));
      counter.textContent=`${String(current+1).padStart(2,'0')} / ${String(total).padStart(2,'0')}`;
      carousel.dataset.active=String(current);
      if(normalize)scheduleNormalize();
    };
    const move=step=>{
      const target=Math.max(0,Math.min(slides.length-1,activeIndex+step));
      centerSlide(target);
    };
    const onScroll=()=>{if(!frame)frame=requestAnimationFrame(update);};
    const onClick=event=>{
      if(suppressClick){suppressClick=false;return;}
      const control=event.target.closest('[data-carousel-step]');
      if(control){move(Number(control.dataset.carouselStep));return;}
      if(event.target.closest('button,a'))return;
      if(event.target.closest('.carousel-track')&&matchMedia('(pointer:fine)').matches){
        const box=track.getBoundingClientRect();
        move(event.clientX<box.left+box.width/2?-1:1);
      }
    };
    const onKey=event=>{
      if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}
    };
    const onPointerDown=event=>{
      if(event.pointerType==='touch'||event.button!==0)return;
      drag={id:event.pointerId,startX:event.clientX,startScroll:track.scrollLeft,startIndex:activeIndex,moved:false};
      track.classList.add('is-dragging');
      track.setPointerCapture?.(event.pointerId);
    };
    const onPointerMove=event=>{
      if(!drag||event.pointerId!==drag.id)return;
      const delta=event.clientX-drag.startX;
      if(Math.abs(delta)>4)drag.moved=true;
      if(drag.moved){event.preventDefault();track.scrollLeft=drag.startScroll-delta;}
    };
    const onPointerUp=event=>{
      if(!drag||event.pointerId!==drag.id)return;
      const gesture=drag;
      const delta=event.clientX-gesture.startX;
      const threshold=Math.max(48,track.clientWidth*.08);
      const step=gesture.moved&&Math.abs(delta)>=threshold?(delta<0?1:-1):0;
      const target=Math.max(0,Math.min(slides.length-1,gesture.startIndex+step));
      track.releasePointerCapture?.(event.pointerId);
      drag=null;
      track.classList.remove('is-dragging');
      if(gesture.moved){
        suppressClick=true;
        window.setTimeout(()=>{suppressClick=false;},0);
      }
      activeIndex=target;
      centerSlide(target);
      scheduleNormalize();
    };

    track.addEventListener('scroll',onScroll,{passive:true});
    track.addEventListener('keydown',onKey);
    track.addEventListener('pointerdown',onPointerDown);
    track.addEventListener('pointermove',onPointerMove);
    track.addEventListener('pointerup',onPointerUp);
    track.addEventListener('pointercancel',onPointerUp);
    carousel.addEventListener('click',onClick);
    const onResize=()=>{centerSlide(activeIndex,'instant');update({normalize:false});};
    window.addEventListener('resize',onResize);
    centerSlide(activeIndex,'instant');
    update({normalize:false});
    carousel.classList.add('is-loop-ready');
    cleanups.push(()=>{
      cancelAnimationFrame(frame);
      clearTimeout(normalizeTimer);
      track.removeEventListener('scroll',onScroll);
      track.removeEventListener('keydown',onKey);
      track.removeEventListener('pointerdown',onPointerDown);
      track.removeEventListener('pointermove',onPointerMove);
      track.removeEventListener('pointerup',onPointerUp);
      track.removeEventListener('pointercancel',onPointerUp);
      carousel.removeEventListener('click',onClick);
      window.removeEventListener('resize',onResize);
    });
  });
  return()=>cleanups.forEach(cleanup=>cleanup());
}

function projectScrollCarousel(){
  const cleanups=[];
  document.querySelectorAll('[data-project-scroll-carousel]').forEach(section=>{
    const track=section.querySelector('.project-scroll-carousel-track');
    const slides=[...section.querySelectorAll('[data-scroll-slide]')];
    const captions=[...section.querySelectorAll('[data-scroll-caption]')];
    const progress=section.querySelector('.project-scroll-carousel-progress span');
    const count=slides.length;
    if(!track||count<1)return;
    section.style.setProperty('--scroll-slide-count',String(count));
    if(count===1){section.classList.add('is-static');section.style.height='';return;}
    const reduced=reducedMotion();
    if(reduced){section.classList.add('is-static');section.style.height='';return;}
    let frame=0;
    const smoothstep=value=>value*value*value*(value*(value*6-15)+10);
    const update=()=>{
      frame=0;
      const distance=Math.max(1,section.offsetHeight-innerHeight);
      const raw=clamp(-section.getBoundingClientRect().top/distance);
      const scaled=raw*(count-1);
      const index=Math.min(count-2,Math.floor(scaled));
      const local=Math.min(1,Math.max(0,scaled-index));
      const eased=smoothstep(local);
      const position=index+eased;
      track.style.transform=`translate3d(${(-position*innerWidth).toFixed(2)}px,0,0)`;
      captions.forEach((caption,captionIndex)=>{
        let opacity=0;
        if(captionIndex===index)opacity=1-eased;
        if(captionIndex===index+1)opacity=eased;
        caption.style.opacity=String(opacity);
        caption.style.transform=`translate3d(0,${((1-opacity)*10).toFixed(2)}px,0)`;
        caption.setAttribute('aria-hidden',String(opacity<.5));
      });
      if(progress)progress.style.transform=`scaleX(${raw})`;
    };
    const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
    window.addEventListener('scroll',schedule,{passive:true});
    window.addEventListener('resize',schedule);
    update();
    cleanups.push(()=>{
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll',schedule);
      window.removeEventListener('resize',schedule);
    });
  });
  const header=document.querySelector('.header');
  const section=document.querySelector('[data-project-scroll-carousel]');
  let observer;
  if(header&&section&&'IntersectionObserver' in window&&!reducedMotion()){
    observer=new IntersectionObserver(([entry])=>document.body.classList.toggle('project-carousel-in-view',entry.isIntersecting&&entry.intersectionRatio>=.35),{threshold:[0,.35,.7]});
    observer.observe(section);
    cleanups.push(()=>{observer.disconnect();document.body.classList.remove('project-carousel-in-view');});
  }
  return()=>cleanups.forEach(cleanup=>cleanup());
}


function initDisclosureMotion(){
  const disclosures=[...document.querySelectorAll('.experience-list details, .faq-list details')];
  if(!disclosures.length)return()=>{};
  const timers=new WeakMap();
  const duration=560;
  const easing='cubic-bezier(.22,1,.36,1)';
  const transition=`height ${duration}ms ${easing}, opacity ${duration*.72}ms ease, transform ${duration}ms ${easing}`;
  const contentFor=details=>details.querySelector(':scope > .details-content, :scope > p');
  const clearTimer=details=>{const timer=timers.get(details);if(timer){clearTimeout(timer);timers.delete(details);}};
  const clearStyles=content=>{content.style.removeProperty('height');content.style.removeProperty('overflow');content.style.removeProperty('opacity');content.style.removeProperty('transform');content.style.removeProperty('transition');content.style.removeProperty('animation');};
  const stop=details=>{clearTimer(details);const content=contentFor(details);if(!content)return;content.getAnimations?.().forEach(animation=>animation.cancel());const height=content.getBoundingClientRect().height;content.style.transition='none';content.style.height=`${height}px`;content.style.opacity='1';content.style.transform='translateY(0)';details.classList.remove('is-closing');return content;};
  const open=details=>{
    const content=stop(details);if(!content){details.open=true;return;}
    details.open=true;
    content.style.overflow='hidden';content.style.animation='none';content.style.height='0px';content.style.opacity='0';content.style.transform='translateY(-10px)';
    requestAnimationFrame(()=>{content.style.transition=transition;content.style.height=`${content.scrollHeight}px`;content.style.opacity='1';content.style.transform='translateY(0)';});
    const timer=setTimeout(()=>{clearStyles(content);details.classList.remove('is-closing');timers.delete(details);},duration+40);timers.set(details,timer);
  };
  const close=details=>{
    const content=stop(details);if(!content){details.open=false;return;}
    details.classList.add('is-closing');content.style.overflow='hidden';content.style.animation='none';
    requestAnimationFrame(()=>{content.style.transition=transition;content.style.height='0px';content.style.opacity='0';content.style.transform='translateY(-10px)';});
    const timer=setTimeout(()=>{details.open=false;details.classList.remove('is-closing');clearStyles(content);timers.delete(details);},duration+40);timers.set(details,timer);
  };
  const listeners=disclosures.map(details=>{
    const summary=details.querySelector(':scope > summary');
    if(!summary)return null;
    const onClick=event=>{event.preventDefault();if(reducedMotion()){details.open=!details.open;return;}const isOpen=details.open&&!details.classList.contains('is-closing');isOpen?close(details):open(details);};
    summary.addEventListener('click',onClick);
    return()=>summary.removeEventListener('click',onClick);
  }).filter(Boolean);
  return()=>{listeners.forEach(cleanup=>cleanup());disclosures.forEach(details=>{clearTimer(details);const content=contentFor(details);if(content)clearStyles(content);details.classList.remove('is-closing');});};
}

export function initMotion(){
  const cleanups=[revealImages(),scrollEffects(),cinematicHero(),carousels(),initStorySlideshow(),projectScrollCarousel(),initDisclosureMotion()];
  return()=>cleanups.forEach(cleanup=>cleanup());
}

export function initCursor(){
  const cursor=document.querySelector('#custom-cursor');
  document.addEventListener('pointermove',event=>{
    if(!matchMedia('(hover:hover) and (pointer:fine)').matches||reducedMotion()||document.querySelector('dialog[open]')){cursor.classList.remove('is-visible');return;}
    const target=event.target.closest('[data-cursor]');
    const isControl=event.target.closest('button,a')&&!event.target.closest('[data-cursor="ensaio"],[data-cursor="foto"]');
    cursor.classList.toggle('is-visible',Boolean(target&&!isControl));
    if(!target)return;
    const direction=target.dataset.cursor==='carousel';
    cursor.classList.toggle('is-directional',direction);
    cursor.textContent=direction?(event.clientX<target.getBoundingClientRect().left+target.clientWidth/2?'←':'→'):target.dataset.cursor==='foto'?'Ampliar ↗':'Ver ensaio ↗';
    cursor.style.transform=`translate(${event.clientX-cursor.offsetWidth/2}px,${event.clientY-cursor.offsetHeight/2}px)`;
  });
  document.addEventListener('pointerleave',()=>cursor.classList.remove('is-visible'));
  document.addEventListener('click',()=>cursor.classList.remove('is-visible'));
  window.addEventListener('scroll',()=>cursor.classList.remove('is-visible'),{passive:true});
  window.addEventListener('blur',()=>cursor.classList.remove('is-visible'));
}

export async function transitionTo(cover,render){
  if(reducedMotion()){render();return;}
  const curtain=document.querySelector('#route-curtain');
  const photo=curtain.querySelector('img');
  photo.src=image(cover);
  curtain.style.visibility='visible';
  const options={duration:480,easing:'cubic-bezier(.65,0,.35,1)',fill:'forwards'};
  try{
    await curtain.animate([{transform:'translateY(100%)'},{transform:'translateY(0)'}],options).finished;
    render();
    await curtain.animate([{transform:'translateY(0)'},{transform:'translateY(-100%)'}],options).finished;
  }finally{
    curtain.getAnimations().forEach(animation=>animation.cancel());
    curtain.style.transform='translateY(100%)';
    curtain.style.visibility='hidden';
  }
}
