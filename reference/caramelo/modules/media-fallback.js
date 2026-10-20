/** Keeps the original media geometry if a photograph cannot load. */
export function initMediaFallbacks() {
  const replace = (image) => {
    if (!(image instanceof HTMLImageElement) || image.dataset.fallbackApplied)
      return;
    image.dataset.fallbackApplied = "true";
    if (image.closest('[aria-hidden="true"]')) {
      image.hidden = true;
      return;
    }
    image.removeAttribute("srcset");
    image
      .closest("picture")
      ?.querySelectorAll("source")
      .forEach((source) => source.remove());
    image.alt = "Imagem indisponível.";
    image.src = "assets/image-placeholder.svg";
  };
  document.addEventListener("error", (event) => replace(event.target), true);
  document.querySelectorAll("img").forEach((image) => {
    if (image.complete && !image.naturalWidth) replace(image);
  });
}
