import {image,photos,projects} from './content.js';
import {proofPhotos} from './views.js';

let album=[];
let photoIndex=0;
let previewDownload=null;

const photoItem=(key,index)=>({key,index,label:photos[key].label,alt:photos[key].alt,position:'50% 50%'});

export function initGallery(){}

function updateLightbox(){
  const item=album[photoIndex];
  if(!item)return;
  const img=document.querySelector('#lightbox-image');
  img.src=image(item.key);img.alt=item.alt;img.style.objectPosition=item.position;
  document.querySelector('#lightbox-title').textContent=item.label;
  document.querySelector('#lightbox-count').textContent=`${String(photoIndex+1).padStart(2,'0')} / ${String(album.length).padStart(2,'0')}`;
  const download=document.querySelector('#lightbox-download');
  download.href=image(item.key);download.download=`lume-${item.key}-${photoIndex+1}.webp`;
  document.querySelectorAll('[data-lightbox-step]').forEach(button=>button.disabled=album.length<2);
}

export function openAlbum(name,index=0,keys=[]){
  if(name==='proof'){
    album=proofPhotos.map((item,i)=>({...photoItem(item.key,i),...item,alt:photos[item.key].alt}));
  }else{
    const project=projects.find(project=>project.slug===name);
    album=(project?.gallery||keys).filter(key=>photos[key]).map(photoItem);
  }
  if(!album.length)return;
  photoIndex=Math.max(0,Math.min(index,album.length-1));
  updateLightbox();
  document.querySelector('#lightbox').showModal();
}

export function stepLightbox(step){photoIndex=(photoIndex+step+album.length)%album.length;updateLightbox();}

export function showFeedback(html,download=null){
  previewDownload=download;
  document.querySelector('#feedback-content').innerHTML=html;
  document.querySelector('#feedback-dialog').showModal();
}

export function downloadPreview(){
  if(!previewDownload)return;
  const blob=new Blob([previewDownload.text],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;link.download=previewDownload.filename;link.click();URL.revokeObjectURL(url);
}

document.querySelector('#lightbox').addEventListener('keydown',event=>{
  if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();stepLightbox(event.key==='ArrowLeft'?-1:1);}
});
