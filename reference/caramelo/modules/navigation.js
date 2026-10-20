/** Mobile disclosure navigation; desktop remains ordinary in-page navigation. */
export function createNavigation({ navigation, toggle, header }) {
  const mobile = matchMedia("(max-width: 760px)");
  const links = [...navigation.querySelectorAll('a[href^="#"]')];
  let open = false;

  const sync = () => {
    navigation.classList.toggle("open", open && mobile.matches);
    navigation.inert = mobile.matches && !open;
    toggle.setAttribute("aria-expanded", String(open && mobile.matches));
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
  };
  const close = ({ restoreFocus = false } = {}) => {
    const wasOpen = open;
    open = false;
    sync();
    if (wasOpen && restoreFocus) toggle.focus({ preventScroll: true });
  };
  toggle.addEventListener("click", (event) => {
    if (open) {
      close({ restoreFocus: true });
      return;
    }
    open = true;
    sync();
    if (event.detail === 0) links[0]?.focus({ preventScroll: true });
  });
  toggle.addEventListener("keydown", (event) => {
    if (event.key === "Tab" && !event.shiftKey && open) {
      event.preventDefault();
      links[0]?.focus({ preventScroll: true });
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      close({ restoreFocus: true });
    }
  });
  document.addEventListener("click", (event) => {
    if (
      open &&
      !navigation.contains(event.target) &&
      !toggle.contains(event.target)
    )
      close();
  });
  navigation.addEventListener("focusout", (event) => {
    if (
      open &&
      event.relatedTarget &&
      !navigation.contains(event.relatedTarget) &&
      event.relatedTarget !== toggle
    )
      close();
  });
  mobile.addEventListener("change", () => close());

  const updateActive = () => {
    let active;
    const boundary = header.getBoundingClientRect().bottom + 100;
    links.forEach((link) => {
      const section = document.getElementById(link.hash.slice(1));
      if (section && section.getBoundingClientRect().top <= boundary)
        active = link;
    });
    links.forEach((link) => {
      if (link === active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  };
  window.addEventListener("resize", updateActive);
  sync();
  updateActive();
  return { close, updateActive };
}
