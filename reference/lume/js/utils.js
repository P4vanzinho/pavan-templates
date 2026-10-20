export const escapeHTML=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
export const arrow=(direction='up')=>`<svg class="arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="${direction==='down'?'M5 5l14 14M5 19h14V5':direction==='right'?'M4 12h16m-7-7 7 7-7 7':'M5 19 19 5M5 5h14v14'}" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

export const button=(text,href,style='dark',direction='up')=>{
  const [path,query='']=href.split('?');
  const type=path==='/contato'?new URLSearchParams(query).get('tipo'):null;
  const attributes=path==='/contato'?`href="#contato" data-contact ${type?`data-contact-type="${escapeHTML(type)}"`:''}`:`href="${href}" data-link`;
  return `<a class="button button--${style}" ${attributes}><span>${text}</span>${arrow(direction)}</a>`;
};
export const title=(lines,tag='h1',extra='')=>`<${tag} class="display-title ${extra}" data-reveal>${lines.map(line=>`<span class="title-line"><span>${line}</span></span>`).join('')}</${tag}>`;
