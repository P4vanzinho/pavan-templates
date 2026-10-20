import Lenis from '../vendor/lenis-1.3.26.mjs';

const easeOut = t => 1 - Math.pow(1 - t, 3);

export function createScrollController(preference) {
  let lenis;
  let frame;
  let paused = false;
  const configure = () => {
    if (frame) cancelAnimationFrame(frame);
    lenis?.destroy();
    lenis = undefined;
    if (preference.matches) return;
    lenis = new Lenis({ duration: 1.35, easing: easeOut, smoothWheel: true, syncTouch: false });
    if (paused) lenis.stop();
    const raf = time => { lenis.raf(time); frame = requestAnimationFrame(raf); };
    frame = requestAnimationFrame(raf);
  };
  configure();
  preference.addEventListener('change', configure);
  return {
    scrollTo(top) {
      if (lenis) { lenis.resize(); lenis.scrollTo(top, { duration: 1.5, easing: easeOut }); }
      else window.scrollTo({ top, behavior: 'instant' });
    },
    setPaused(value) {
      paused = value;
      if (value) lenis?.stop();
      else lenis?.start();
    },
  };
}

export function introduceHero(preference) {
  document.documentElement.classList.remove('intro-pending');
  if (preference.matches) return;
  const animations = [];
  const animate = (selector, keyframes, delay, duration = 1200) => {
    document.querySelectorAll(selector).forEach((element, index) => {
      const animation = element.animate(keyframes, { duration, delay: delay + index * 130, easing: 'cubic-bezier(.19,1,.22,1)', fill: 'backwards' });
      animations.push(animation);
    });
  };
  animate('.opening-media img', [{ opacity: 0, transform: 'scale(1.07)' }, { opacity: 1, transform: 'scale(1.025)' }], 0, 1800);
  animate('.hero-line>span', [{ transform: 'translateY(115%) rotate(1deg)' }, { transform: 'translateY(0)' }], 160, 1200);
  animate('.opening-description, .opening-actions', [{ opacity: 0, transform: 'translateY(15px)' }, { opacity: 1, transform: 'translateY(0)' }], 550, 1000);
  const stop = () => animations.forEach(animation => animation.cancel());
  preference.addEventListener('change', stop, { once: true });
  // Navigation stays responsive if the visitor starts browsing during the introduction.
  const finish = () => animations.forEach(animation => { if (animation.playState === 'running') animation.finish(); });
  window.addEventListener('wheel', finish, { once: true, passive: true });
  window.addEventListener('touchstart', finish, { once: true, passive: true });
}
