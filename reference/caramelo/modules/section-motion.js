/** One viewport observer for line masks, image curtains and the two closing sweets. */
export function createSectionMotion(preference) {
  const prepared = new WeakSet();
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('motion-in');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -7% 0px' });

  const prepareLines = element => {
    const lines = [[]];
    const label = [];
    [...element.childNodes].forEach(node => {
      if (node.nodeName === 'BR') { lines.push([]); label.push(' '); }
      else { lines.at(-1).push(node); label.push(node.textContent); }
    });
    element.setAttribute('aria-label', label.join('').replace(/\s+/g, ' ').trim());
    element.replaceChildren();
    lines.forEach((nodes, index) => {
      const mask = document.createElement('span');
      mask.className = 'line-mask';
      mask.setAttribute('aria-hidden', 'true');
      const inner = document.createElement('span');
      inner.className = 'line-inner';
      inner.style.setProperty('--line-index', index);
      inner.append(...nodes);
      mask.append(inner);
      element.append(mask);
    });
    element.classList.add('lines-ready');
  };

  const observe = (root = document) => {
    root.querySelectorAll('[data-lines], [data-curtain], [data-sweet]').forEach(element => {
      if (prepared.has(element)) return;
      prepared.add(element);
      if (element.hasAttribute('data-lines')) prepareLines(element);
      if (element.hasAttribute('data-curtain')) element.classList.add('curtain-ready');
      if (element.hasAttribute('data-sweet')) element.classList.add('sweet-ready');
      if (preference.matches) element.classList.add('motion-in');
      else observer.observe(element);
    });
  };

  const parallaxTargets = [...document.querySelectorAll('[data-parallax-scene]')];
  let queued = false;
  const updateParallax = () => {
    queued = false;
    parallaxTargets.forEach(element => {
      const rect = element.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > innerHeight) return;
      const progress = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - innerHeight / 2) / (innerHeight / 2 + rect.height / 2)));
      const distance = innerWidth < 761 ? 9 : 18;
      element.style.setProperty('--parallax-y', preference.matches ? '0px' : `${(-progress * distance).toFixed(2)}px`);
    });
  };
  const schedule = () => { if (!queued) { queued = true; requestAnimationFrame(updateParallax); } };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  preference.addEventListener('change', () => {
    if (preference.matches) {
      document.querySelectorAll('.lines-ready, .curtain-ready, .sweet-ready').forEach(element => element.classList.add('motion-in'));
      parallaxTargets.forEach(element => element.style.setProperty('--parallax-y', '0px'));
    }
    schedule();
  });
  observe();
  schedule();
  return { observe };
}
