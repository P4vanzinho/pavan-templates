import {categories,image,photos} from './content.js';
import {arrow,title} from './utils.js';

export function contactSectionView(type=''){
  return `<section class="contact-section" id="contato" aria-labelledby="contact-heading">
    <div class="container contact-layout">
      <div class="contact-copy">
        <div id="contact-heading" tabindex="-1">${title(['Me conte','<em>a sua história.</em>'],'h2')}</div>
        <p class="large-copy">Um retrato, um encontro, uma ideia.<br> Vamos descobrir juntos como guardar esse momento.</p>
        <div class="contact-person">
          <img src="${image('clara')}" alt="${photos.clara.alt}" loading="lazy" decoding="async">
          <div><strong>Clara Mota</strong><span>Fotografia autoral<br>Curitiba, Brasil & além</span></div>
        </div>
        <a class="text-link" href="/galeria" data-link>Conheça a galeria que acompanha o ensaio ${arrow()}</a>
      </div>
      <form id="contact-form" class="contact-form">
        <label>Como você se chama?<input required name="name" autocomplete="name" placeholder="Seu nome" minlength="2" maxlength="100"></label>
        <label>Qual é o seu e-mail?<input required name="email" type="email" autocomplete="email" placeholder="voce@email.com" maxlength="160"></label>
        <div class="form-row">
          <label>O que vamos fotografar?<select name="type" required><option value="">Escolha uma experiência</option>${categories.slice(1).map(category=>`<option value="${category.slug}" ${category.slug===type?'selected':''}>${category.label}</option>`).join('')}<option value="outro" ${type==='outro'?'selected':''}>Outra ideia bonita</option></select></label>
          <label>Tem uma data em mente?<input name="date" type="date" aria-label="Data desejada"></label>
        </div>
        <label>Me conta a sua ideia<textarea required name="message" rows="4" placeholder="O que você quer que essas imagens contem?" minlength="10" maxlength="3000"></textarea></label>
        <button class="button button--dark" type="submit"><span>Preparar meu briefing</span>${arrow()}</button>
        <p class="form-note">Formulário demonstrativo. Você verá uma prévia do briefing; nenhuma mensagem será enviada.</p>
        <div id="contact-status" role="status" aria-live="polite"></div>
      </form>
    </div>
  </section>`;
}
