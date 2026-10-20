import { initTestimonials } from './modules/testimonials.js';
import { products, occasions } from './content.js';
import { createScrollController, introduceHero } from './modules/motion.js';
import { createSectionMotion } from './modules/section-motion.js';
import { createCart } from './modules/cart.js';
import { createOrderFlow } from './modules/order-flow.js';
import { createNavigation } from './modules/navigation.js';
import { initMediaFallbacks } from './modules/media-fallback.js';
import { initDisclosureMotion } from './modules/disclosure.js';

document.documentElement.classList.add('js');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const scrollController = createScrollController(reducedMotion);
introduceHero(reducedMotion);
const sectionMotion = createSectionMotion(reducedMotion);
initMediaFallbacks();
const cleanupDisclosureMotion = initDisclosureMotion();
const header = document.querySelector('.header');
const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const productDialog = document.querySelector('#product-dialog');
const orderDialog = document.querySelector('#order-dialog');
const cart = createCart(products);
let occasion = 'Aniversário';
let toastTimer;

const pageNavigation = createNavigation({ navigation, toggle: menuToggle, header });
const closeMenu = pageNavigation.close;

document.addEventListener('click', event => {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
  const anchor = event.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = document.getElementById(anchor.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  closeMenu();
  if (anchor.classList.contains('skip-link')) target.focus({ preventScroll: true });
  const offset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  const destination = window.scrollY + target.getBoundingClientRect().top - offset;
  scrollController.scrollTo(target.id === 'inicio' || target.id === 'conteudo' ? 0 : destination);
});

const reveal = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed'); reveal.unobserve(entry.target); } });
}, { threshold: .12 });
document.querySelectorAll('[data-reveal]').forEach(element => reveal.observe(element));

let framePending = false;
function updateScroll() {
  framePending = false;
  const opening = document.querySelector('.opening');
  const copy = opening.querySelector('.opening-copy');
  // A stable boundary prevents theme flicker while the header changes height.
  const themeBoundary = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 32;
  header.classList.toggle('is-scrolled', copy.getBoundingClientRect().top <= themeBoundary || opening.getBoundingClientRect().bottom <= themeBoundary);
  pageNavigation.updateActive();
}
window.addEventListener('scroll', () => { if (!framePending) { framePending = true; requestAnimationFrame(updateScroll); } }, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();

function showToast(message) {
  const toast = document.querySelector('.toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2800);
}
function openDialog(dialog) {
  closeMenu();
  document.querySelectorAll('dialog[open]').forEach(other => other.close());
  dialog.showModal();
  document.body.classList.add('modal-open');
  scrollController.setPaused(true);
}
for (const dialog of [productDialog, orderDialog]) {
  dialog.querySelector('[data-close]').addEventListener('click', () => { if (dialog.getAttribute('aria-busy') !== 'true') dialog.close(); });
  dialog.addEventListener('close', () => { if (!document.querySelector('dialog[open]')) { document.body.classList.remove('modal-open'); scrollController.setPaused(false); } });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog || dialog.getAttribute('aria-busy') === 'true') return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
}
function renderProducts(category) {
  const grid = document.querySelector('#products');
  grid.setAttribute('aria-labelledby', 'tab-' + category);
  const items = products.filter(product => product.category === category);
  grid.dataset.count = items.length;
  if (!items.length) {
    grid.innerHTML = '<div class="catalog-empty"><span aria-hidden="true">✳</span><h3>Nenhum produto nesta categoria.</h3><p>Novas opções aparecerão por aqui.</p></div>';
    return;
  }
  grid.innerHTML = items.map((product, index) => `
    <article class="product-card" style="--i:${index}"><button class="product-image curtain-frame" data-curtain data-product="${product.id}" ${product.treatment ? `data-treatment="${product.treatment}"` : ''} aria-label="Conhecer ${product.name}"><img src="assets/${product.image}" loading="lazy" alt="${product.alt}" width="600" height="650" ${product.position ? `style="object-position:${product.position}"` : ''}>${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}<span class="product-plus" aria-hidden="true">↗</span></button><div class="product-meta"><h3>${product.name}</h3><span>${product.format}</span></div><p class="product-description">${product.subtitle || ''}</p><button class="quick-add" data-quick-add="${product.id}" aria-label="Adicionar ${product.name} ao pedido"><span>Adicionar ao pedido</span><span aria-hidden="true">+</span></button></article>`).join('');
  sectionMotion.observe(grid);
}
const tabs = [...document.querySelectorAll('[data-category]')];
function selectCategory(tab) {
  tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
  renderProducts(tab.dataset.category);
}
tabs.forEach((tab, index) => {
  tab.querySelector('sup').textContent = String(products.filter(product => product.category === tab.dataset.category).length).padStart(2, '0');
  tab.addEventListener('click', () => selectCategory(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    event.preventDefault(); tabs[next].focus(); selectCategory(tabs[next]);
  });
});
renderProducts('bolos');

document.querySelector('#products').addEventListener('click', event => {
  const quickAdd = event.target.closest('[data-quick-add]');
  if (quickAdd) { cart.add(quickAdd.dataset.quickAdd); orderFlow.open(); return; }
  const button = event.target.closest('[data-product]');
  if (!button) return;
  const product = products.find(item => item.id === button.dataset.product);
  document.querySelector('#product-detail').innerHTML = `<div class="product-detail-layout"><img src="assets/${product.image}" alt="${product.alt}" style="object-position:${product.position || '50% 50%'}"><div class="product-detail-copy"><p class="eyebrow">${product.format.toUpperCase()} · CARAMELO</p><h2 id="detail-title">${product.name}</h2><p>${product.detail}</p><p class="ingredient-note">${product.note || 'Produto ilustrativo. Ingredientes, tamanhos e disponibilidade a confirmar.'} Contém ou pode conter leite, ovos, glúten e castanhas.</p><button class="button dark" data-add="${product.id}"><span>Adicionar ao pedido</span><span class="button-arrow" aria-hidden="true">↗</span></button></div></div>`;
  openDialog(productDialog);
});
const orderFlow = createOrderFlow({ cart, dialog: orderDialog, openDialog, showToast, getOccasion: () => occasion, getOccasionContext: () => occasions[occasion]?.[1] || '', browseProducts: () => {
  scrollController.setPaused(false);
  document.querySelector('.opening-actions>a[href="#vitrine"]').click();
} });
productDialog.addEventListener('click', event => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  cart.add(button.dataset.add);
  productDialog.close();
  orderFlow.open();
});
document.querySelectorAll('[data-occasion]').forEach(button => button.addEventListener('click', () => {
  occasion = button.dataset.occasion;
  document.querySelectorAll('[data-occasion]').forEach(item => {
    item.classList.toggle('selected', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  const [title, text] = occasions[occasion];
  document.querySelector('#suggestion-title').textContent = title;
  document.querySelector('#suggestion-text').textContent = text;
  if (!reducedMotion.matches) document.querySelector('.occasion-recommendation').animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 300, easing: 'ease-out' });
}));
document.querySelector('#year').textContent = new Date().getFullYear();

initTestimonials();
