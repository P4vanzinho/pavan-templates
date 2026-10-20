import EmblaCarousel from '../vendor/embla/carousel.js';
import AutoScroll from '../vendor/embla/auto-scroll.js';
import { WheelGesturesPlugin } from '../vendor/embla/wheel-gestures.js';
import { spring } from '../utils/spring.js';
import { testimonials } from './testimonials-content.js';

export function initTestimonials() {
  const section = document.querySelector('#depoimentos');
  const viewport = section.querySelector('.reviews-viewport');
  const track = section.querySelector('.reviews-track');
  const dots = section.querySelector('.reviews-dots');
  const mobile = matchMedia('(max-width: 809.98px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let carousel;
  let paused = false;
  let visible = false;
  let dispose = () => {};

  function card(item, duplicate = false) {
    const slot = document.createElement('div');
    slot.className = 'review-slot';
    if (duplicate) slot.setAttribute('aria-hidden', 'true');
    const article = document.createElement('article');
    article.className = 'review-card';
    const mark = document.createElement('span');
    mark.className = 'review-mark'; mark.textContent = '“'; mark.setAttribute('aria-hidden', 'true');
    const quote = document.createElement('blockquote'); quote.textContent = item.quote;
    const author = document.createElement('div'); author.className = 'review-author';
    const avatar = document.createElement('span'); avatar.className = 'review-avatar'; avatar.textContent = item.initials; avatar.setAttribute('aria-hidden', 'true');
    const identity = document.createElement('div');
    const name = document.createElement('strong'); name.textContent = item.name;
    const occasion = document.createElement('span'); occasion.textContent = item.occasion;
    identity.append(name, occasion); author.append(avatar, identity);
    article.append(mark, quote, author); slot.append(article); return slot;
  }

  function syncPlayback() {
    const allowed = visible && !paused && !reduced.matches && testimonials.length > 1;
    if (mobile.matches) allowed ? carousel?.autoplay?.start() : carousel?.autoplay?.stop();
    else allowed ? carousel?.plugins().autoScroll?.play() : carousel?.plugins().autoScroll?.stop();
  }

  function setup() {
    dispose();
    track.replaceChildren(...testimonials.map(item => card(item)));
    dots.replaceChildren();
    section.hidden = !testimonials.length;
    viewport.classList.remove('is-dragging');
    if (!testimonials.length) return;
    viewport.tabIndex = mobile.matches ? -1 : 0;
    if (mobile.matches) {
      const motion = spring({ stiffness: 260, damping: 32 });
      track.style.transitionTimingFunction = motion.easing;
      testimonials.forEach((_, index) => {
        const button = document.createElement('button'); button.type = 'button';
        button.setAttribute('aria-label', `Ver depoimento ${index + 1}`);
        button.addEventListener('click', () => carousel.slideToLoop(index)); dots.append(button);
      });
      const sync = swiper => [...dots.children].forEach((dot, index) => dot.setAttribute('aria-current', String(index === swiper.realIndex)));
      carousel = new window.Swiper(viewport, {
        wrapperClass: 'reviews-track', slideClass: 'review-slot', slidesPerView: 'auto', centeredSlides: true,
        spaceBetween: 16, autoHeight: true, loop: testimonials.length > 1,
        speed: reduced.matches ? 0 : motion.duration,
        autoplay: { enabled: !reduced.matches && !paused && visible, delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true },
        on: { init: sync, slideChange: sync },
      });
      dispose = () => carousel.destroy(true, true);
    } else {
      track.style.transitionTimingFunction = '';
      if (testimonials.length > 1) {
        const copies = Math.max(3, Math.ceil(innerWidth * 2 / (testimonials.length * 560)));
        for (let i = 1; i < copies; i++) track.append(...testimonials.map(item => card(item, true)));
      }
      carousel = EmblaCarousel(viewport, { align: 'start', loop: testimonials.length > 1, dragFree: true }, [
        AutoScroll({ speed: 1, startDelay: 50, playOnInit: false, stopOnInteraction: false, stopOnMouseEnter: false, stopOnFocusIn: true, active: !reduced.matches }),
        WheelGesturesPlugin(),
      ]);
      carousel.on('pointerDown', () => viewport.classList.add('is-dragging'));
      carousel.on('pointerUp', () => viewport.classList.remove('is-dragging'));
      const enforcePause = () => { if (paused || reduced.matches || !visible) queueMicrotask(() => carousel.plugins().autoScroll?.stop()); };
      carousel.on('autoScroll:play', enforcePause);
      dispose = () => carousel.destroy();
    }
    syncPlayback();
  }
  viewport.addEventListener('keydown', event => {
    if (mobile.matches || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault(); paused = true; syncPlayback();
    event.key === 'ArrowLeft' ? carousel.scrollPrev() : carousel.scrollNext();
  });
  mobile.addEventListener('change', setup);
  reduced.addEventListener('change', setup);
  setup();
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback(); }).observe(section);
}
