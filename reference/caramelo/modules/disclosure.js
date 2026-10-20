const DURATION = 560;
const EASING = 'cubic-bezier(.22,1,.36,1)';
const TRANSITION = `height ${DURATION}ms ${EASING}, opacity ${DURATION * .72}ms ease, transform ${DURATION}ms ${EASING}`;

function panelFor(details) {
  return details.querySelector(':scope > p');
}

export function initDisclosureMotion(root = document) {
  const disclosures = [...root.querySelectorAll('.faq details')];
  if (!disclosures.length) return () => {};
  const timers = new WeakMap();
  const clearTimer = details => {
    const timer = timers.get(details);
    if (timer) {
      clearTimeout(timer);
      timers.delete(details);
    }
  };
  const clearStyles = panel => {
    ['height', 'overflow', 'opacity', 'transform', 'transition', 'animation'].forEach(property => panel.style.removeProperty(property));
  };
  const stop = details => {
    clearTimer(details);
    const panel = panelFor(details);
    if (!panel) return null;
    const height = panel.getBoundingClientRect().height;
    panel.style.transition = 'none';
    panel.style.height = `${height}px`;
    panel.style.opacity = '1';
    panel.style.transform = 'translateY(0)';
    details.classList.remove('is-closing');
    return panel;
  };
  const open = details => {
    const panel = stop(details);
    if (!panel) {
      details.open = true;
      return;
    }
    details.open = true;
    panel.style.overflow = 'hidden';
    panel.style.animation = 'none';
    panel.style.height = '0px';
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-10px)';
    requestAnimationFrame(() => {
      panel.style.transition = TRANSITION;
      panel.style.height = `${panel.scrollHeight}px`;
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(0)';
    });
    const timer = setTimeout(() => {
      clearStyles(panel);
      timers.delete(details);
    }, DURATION + 40);
    timers.set(details, timer);
  };
  const close = details => {
    const panel = stop(details);
    if (!panel) {
      details.open = false;
      return;
    }
    details.classList.add('is-closing');
    panel.style.overflow = 'hidden';
    panel.style.animation = 'none';
    requestAnimationFrame(() => {
      panel.style.transition = TRANSITION;
      panel.style.height = '0px';
      panel.style.opacity = '0';
      panel.style.transform = 'translateY(-10px)';
    });
    const timer = setTimeout(() => {
      details.open = false;
      details.classList.remove('is-closing');
      clearStyles(panel);
      timers.delete(details);
    }, DURATION + 40);
    timers.set(details, timer);
  };
  const cleanups = disclosures.map(details => {
    const summary = details.querySelector(':scope > summary');
    if (!summary) return null;
    const onClick = event => {
      event.preventDefault();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
        details.open = !details.open;
        return;
      }
      const isOpen = details.open && !details.classList.contains('is-closing');
      isOpen ? close(details) : open(details);
    };
    summary.addEventListener('click', onClick);
    return () => summary.removeEventListener('click', onClick);
  }).filter(Boolean);
  return () => {
    cleanups.forEach(cleanup => cleanup());
    disclosures.forEach(details => {
      clearTimer(details);
      const panel = panelFor(details);
      if (panel) clearStyles(panel);
      details.classList.remove('is-closing');
    });
  };
}
