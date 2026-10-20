import {categories} from './content.js';
import {viewForURL,footer} from './views.js';
import {escapeHTML,arrow} from './utils.js';
import {initMotion,initSmoothScroll,smoothScrollTo,transitionTo,reducedMotion} from './motion.js';
import {initGallery,openAlbum,stepLightbox,showFeedback,downloadPreview} from './gallery.js';
import {initContact,scrollToContact} from './contact.js';

document.documentElement.classList.add('js');
history.scrollRestoration='manual';
const main=document.querySelector('#main');
const menu=document.querySelector('#menu-dialog');
document.body.classList.add('montage-pending');
const cleanupSmoothScroll=initSmoothScroll();
let cleanupMotion=()=>{};
let cleanupContact=()=>{};
let navigating=false;
let queuedNavigation=null;
let currentURL=location.href;

function playHeroMontage(url){
  const body=document.body;
  if(url.pathname!=='/'||reducedMotion()){
    body.classList.remove('montage-pending','montage-active');
    return;
  }
  const originalBodyOverflow=body.style.overflow;
  const originalHtmlOverflow=document.documentElement.style.overflow;
  body.classList.add('montage-active');
  body.style.overflow='hidden';
  document.documentElement.style.overflow='hidden';
  const timers=[
    window.setTimeout(()=>body.classList.add('montage-images'),80),
    window.setTimeout(()=>body.classList.add('montage-copy'),560),
    window.setTimeout(()=>body.classList.add('montage-header'),930),
    window.setTimeout(()=>{
      body.classList.add('montage-complete');
      body.style.overflow=originalBodyOverflow;
      document.documentElement.style.overflow=originalHtmlOverflow;
    },1650),
  ];
  window.setTimeout(()=>timers.forEach(timer=>window.clearTimeout(timer)),2200);
}

function render(url,{focus=false}={}){
  cleanupMotion();
  cleanupContact();
  const view=viewForURL(url);
  main.innerHTML=view.html;
  document.querySelector('#footer-slot').innerHTML=footer(url.searchParams.get('tipo')||'');
  document.title=`${view.name} — Lume`;
  document.querySelectorAll('.header-nav a,.menu-links a').forEach(link=>{
    if(link.hasAttribute('data-contact')){link.removeAttribute('aria-current');return;}
    const active=link.pathname==='/'?url.pathname==='/':url.pathname===link.pathname||url.pathname.startsWith(link.pathname+'/');
    active?link.setAttribute('aria-current','page'):link.removeAttribute('aria-current');
  });
  window.scrollTo({top:0,left:0,behavior:'instant'});
  cleanupMotion=initMotion();
  cleanupContact=initContact();
  initGallery();
  currentURL=url.href;
  if(focus)main.focus({preventScroll:true});
  if(url.hash==='#contato'||url.pathname==='/contato')scrollToContact({smooth:false,focus:false});
}

async function navigate(url,{push=true}={}){
  if(navigating){queuedNavigation={url,push};return;}
  if(url.href===currentURL)return;
  navigating=true;
  closeMenu();
  document.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
  try{
    const view=viewForURL(url);
    await transitionTo(view.cover,()=>{
      if(push)history.pushState({},'',url);
      render(url,{focus:true});
    });
  }finally{
    navigating=false;
    if(queuedNavigation){const next=queuedNavigation;queuedNavigation=null;navigate(next.url,{push:next.push});}
  }
}

function openMenu(){
  if(menu.open)return;
  menu.showModal();
  if(!reducedMotion())menu.animate([
    {clipPath:'polygon(0 0,100% 0,100% 0,0 0)'},
    {clipPath:'polygon(0 0,100% 0,100% 100%,0 0)',offset:.5},
    {clipPath:'polygon(0 0,100% 0,100% 100%,0 100%)'}
  ],{duration:550,easing:'cubic-bezier(.65,0,.35,1)'});
}
function closeMenu(){if(menu.open){menu.getAnimations().forEach(animation=>animation.cancel());menu.close();}}
document.querySelector('#menu-toggle').addEventListener('click',openMenu);

document.addEventListener('click',event=>{
  const contact=event.target.closest('a[data-contact]');
  if(contact&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&event.button===0){
    event.preventDefault();
    closeMenu();
    scrollToContact({type:contact.dataset.contactType||''});
    return;
  }
  const link=event.target.closest('a[data-link]');
  if(link&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey&&event.button===0){
    const url=new URL(link.href);
    if(link.hasAttribute('data-home-logo')&&url.pathname==='/'&&location.pathname==='/'&&url.search===location.search){
      event.preventDefault();
      closeMenu();
      smoothScrollTo(0,{immediate:reducedMotion()});
      return;
    }
    if(url.origin===location.origin){event.preventDefault();navigate(url);return;}
  }
  const photo=event.target.closest('[data-open-photo]');
  if(photo){openAlbum(photo.dataset.album,Number(photo.dataset.openPhoto));return;}
  const step=event.target.closest('[data-lightbox-step]');
  if(step){stepLightbox(Number(step.dataset.lightboxStep));return;}
  const carousel=event.target.closest('[data-carousel-open]');
  if(carousel){openAlbum('carousel',Number(carousel.closest('[data-carousel]').dataset.active||0),carousel.dataset.carouselPhotos.split(','));return;}
  const action=event.target.closest('[data-action]')?.dataset.action;
  if(action==='close-menu')closeMenu();
  if(action==='close-lightbox')document.querySelector('#lightbox').close();
  if(action==='close-feedback')document.querySelector('#feedback-dialog').close();
  if(action==='download-preview')downloadPreview();
  if(action==='scroll-work'){
    event.preventDefault();
    const work=document.getElementById('olhares');
    if(work)smoothScrollTo(work,{immediate:reducedMotion()});
  }
  if(action==='back-top')smoothScrollTo(0,{immediate:reducedMotion()});
});

document.addEventListener('submit',event=>{
  if(event.target.id!=='contact-form')return;
  event.preventDefault();
  const form=event.target;
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const type=categories.find(category=>category.slug===data.get('type'))?.label||'Outra ideia bonita';
  const values={Nome:data.get('name'),'E-mail':data.get('email'),'Experiência':type,Data:data.get('date')||'A combinar',Ideia:data.get('message')};
  const text=`LUME — BRIEFING DEMONSTRATIVO\n\n${Object.entries(values).map(([label,value])=>`${label}: ${value}`).join('\n\n')}\n\nPrévia local. Nenhuma mensagem foi enviada.\n`;
  showFeedback(`<h2 id="feedback-title">Uma ideia já ganhou forma.</h2><p>Este é o seu briefing. Confira os detalhes e, se quiser, guarde uma cópia.</p><dl>${Object.entries(values).map(([label,value])=>`<dt>${label}</dt><dd>${escapeHTML(value)}</dd>`).join('')}</dl><p>Prévia demonstrativa. Nenhuma mensagem foi enviada.</p><button class="button button--dark" data-action="download-preview"><span>Guardar meu briefing</span>${arrow('down')}</button>`,{text,filename:'lume-meu-briefing.txt'});
  document.querySelector('#contact-status').textContent='Prévia pronta. Seu briefing pode ser baixado; nenhuma mensagem foi enviada.';
});

window.addEventListener('popstate',()=>navigate(new URL(location.href),{push:false}));
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>{cleanupMotion();cleanupMotion=initMotion();});
render(new URL(location.href));
playHeroMontage(new URL(location.href));
