import {smoothScrollTo} from './motion.js';

export function scrollToContact({type='',smooth=true,focus=true}={}){
  const section=document.getElementById('contato');
  if(!section)return;
  const select=section.querySelector('select[name="type"]');
  if(type&&[...select.options].some(option=>option.value===type)){
    select.value=type;
    select.dispatchEvent(new Event('change',{bubbles:true}));
  }
  if(focus)section.querySelector('#contact-heading').focus({preventScroll:true});
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  smoothScrollTo(section,{immediate:!smooth||reduced});
}

export function initContact(){
  const section=document.getElementById('contato');
  document.body.classList.remove('contact-in-view');
  if(!section||!('IntersectionObserver' in window))return()=>{};
  const observer=new IntersectionObserver(entries=>{
    document.body.classList.toggle('contact-in-view',entries[0].isIntersecting);
  },{threshold:0});
  observer.observe(section);
  return()=>{observer.disconnect();document.body.classList.remove('contact-in-view');};
}
