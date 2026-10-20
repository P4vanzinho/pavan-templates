import { formatOrderSummary } from "../utils/order-summary.js";

/** Coordinates the mock order drawer; no network requests are made. */
export function createOrderFlow({
  cart,
  dialog,
  openDialog,
  showToast,
  getOccasion,
  getOccasionContext,
  browseProducts,
}) {
  const form = dialog.querySelector("#order-form");
  const steps = [...dialog.querySelectorAll("[data-order-step]")];
  let currentStep = "cart";
  let summary = "";
  let busy = false;

  function setStep(step) {
    currentStep = step;
    steps.forEach((section) => {
      section.hidden = section.dataset.orderStep !== step;
    });
    dialog.querySelectorAll("[data-progress]").forEach((item) => {
      if (item.dataset.progress === step)
        item.setAttribute("aria-current", "step");
      else item.removeAttribute("aria-current");
    });
    dialog.scrollTop = 0;
    const heading = steps
      .find((section) => section.dataset.orderStep === step)
      ?.querySelector("h3");
    heading?.setAttribute("tabindex", "-1");
    if (dialog.open) heading?.focus({ preventScroll: true });
  }

  function renderCart() {
    const items = cart.items();
    const count = cart.count();
    const badge = document.querySelector(".bag-count");
    badge.textContent = count > 99 ? "99+" : count;
    badge.hidden = !count;
    document
      .querySelector(".header-order")
      .setAttribute(
        "aria-label",
        count ? `Faça seu pedido, ${count} itens` : "Faça seu pedido",
      );
    dialog.querySelector("#cart-count-label").textContent = count
      ? `${count} ${count === 1 ? "unidade" : "unidades"}`
      : "";
    dialog.querySelector("#cart-empty").hidden = !!items.length;
    dialog.querySelector("#cart-footer").hidden = !items.length;
    const occasionValue = dialog.querySelector("[data-occasion-value]");
    const occasionNote = dialog.querySelector("[data-occasion-note]");
    const selectedOccasion = form.elements.occasion?.value || getOccasion();
    if (occasionValue) occasionValue.textContent = selectedOccasion || "—";
    if (occasionNote) {
      const context = getOccasionContext?.();
      occasionNote.textContent = context ? ` · ${context}` : "";
    }
    const active = dialog.contains(document.activeElement)
      ? document.activeElement
      : null;
    const focusId = active?.dataset.id;
    const focusAction = active?.dataset.action;
    const wasInput = active?.hasAttribute("data-quantity");
    dialog.querySelector("#cart-items").innerHTML = items
      .map(
        ({ product, quantity }) => `
      <article class="cart-item"><img src="assets/${product.image}" alt="${product.alt}" width="96" height="112"><div class="cart-item-info"><h4>${product.name}</h4><p>${product.format}</p><div class="quantity-control"><button type="button" data-action="decrease" data-id="${product.id}" aria-label="Diminuir quantidade de ${product.name}" ${quantity === 1 ? "disabled" : ""}>−</button><input data-quantity data-id="${product.id}" type="number" min="1" max="999" step="1" value="${quantity}" aria-label="Quantidade de ${product.name}"><button type="button" data-action="increase" data-id="${product.id}" aria-label="Aumentar quantidade de ${product.name}" ${quantity === 999 ? "disabled" : ""}>+</button></div></div><button class="remove-item" type="button" data-action="remove" data-id="${product.id}" aria-label="Remover ${product.name}">×</button></article>`,
      )
      .join("");
    if (focusId) {
      const selector = wasInput
        ? `[data-quantity][data-id="${focusId}"]`
        : `[data-action="${focusAction}"][data-id="${focusId}"]`;
      const replacement = dialog.querySelector(selector);
      const next =
        replacement && !replacement.disabled
          ? replacement
          : dialog.querySelector(`[data-quantity][data-id="${focusId}"]`) ||
            dialog.querySelector("[data-quantity]") ||
            dialog.querySelector("#cart-empty .button");
      next?.focus({ preventScroll: true });
    }
    if (!items.length && currentStep !== "cart" && currentStep !== "success")
      setStep("cart");
    else if (currentStep === "review" && items.length) renderReview();
  }

  function readCustomer() {
    const values = Object.fromEntries(new FormData(form));
    return Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, String(value).trim()]),
    );
  }

  function renderReview() {
    const items = cart.items();
    const customer = readCustomer();
    const occasionContext = getOccasionContext?.();
    summary = formatOrderSummary(items, { ...customer, occasionNote: occasionContext });
    dialog.querySelector("#review-items").innerHTML = items
      .map(
        ({ product, quantity }) =>
          `<div class="review-item"><img src="assets/${product.image}" alt="" width="54" height="64"><span>${product.name}</span><strong>${quantity} un.</strong></div>`,
      )
      .join("");
    const data = [
      ["Nome", customer.name],
      ["E-mail", customer.email],
      ["Telefone", customer.phone],
      [
        "Data desejada",
        new Date(customer.date + "T12:00:00").toLocaleDateString("pt-BR"),
      ],
      ["Ocasião", customer.occasion],
      ...(occasionContext ? [["Sugestão da ocasião", occasionContext]] : []),
      ["Pessoas", customer.guests],
      ["Recebimento", customer.fulfillment],
    ];
    if (customer.fulfillment === "Entrega")
      data.push(["Endereço", customer.address]);
    if (customer.idea) data.push(["Observações", customer.idea]);
    const list = dialog.querySelector("#review-customer");
    list.replaceChildren();
    data.forEach(([label, value]) => {
      const term = document.createElement("dt");
      const description = document.createElement("dd");
      term.textContent = label;
      description.textContent = value;
      list.append(term, description);
    });
  }

  function updateAddress() {
    const delivery = form.elements.fulfillment.value === "Entrega";
    dialog.querySelector("#address-field").hidden = !delivery;
    form.elements.address.disabled = !delivery;
    form.elements.address.required = delivery;
  }

  function open() {
    form.elements.occasion.value = getOccasion();
    renderCart();
    setStep("cart");
    openDialog(dialog);
    dialog.scrollTop = 0;
  }

  dialog.querySelector("#cart-items").addEventListener("click", (event) => {
    const button = event.target.closest("[data-action]");
    if (!button) return;
    const { id, action } = button.dataset;
    if (action === "remove") {
      cart.remove(id);
      return;
    }
    const item = cart.items().find((item) => item.product.id === id);
    if (item)
      cart.setQuantity(id, item.quantity + (action === "increase" ? 1 : -1));
  });
  dialog.querySelector("#cart-items").addEventListener("change", (event) => {
    const input = event.target.closest("[data-quantity]");
    if (!input) return;
    if (!cart.setQuantity(input.dataset.id, input.valueAsNumber)) renderCart();
  });
  dialog.querySelector("#cart-continue").addEventListener("click", () => {
    if (cart.items().length) setStep("details");
  });
  dialog
    .querySelectorAll("[data-back-cart]")
    .forEach((button) =>
      button.addEventListener("click", () => setStep("cart")),
    );
  dialog.querySelectorAll("[data-back-details]").forEach((button) =>
    button.addEventListener("click", () => {
      if (cart.items().length && !busy) setStep("details");
    }),
  );
  dialog.querySelectorAll("[data-browse-products]").forEach((button) =>
    button.addEventListener("click", () => {
      dialog.close();
      browseProducts();
    }),
  );
  document
    .querySelectorAll("[data-open-order]")
    .forEach((button) => button.addEventListener("click", open));
  form.elements.fulfillment.addEventListener("change", updateAddress);
  form.elements.name.addEventListener("input", () =>
    form.elements.name.setCustomValidity(""),
  );
  form.elements.phone.addEventListener("input", () =>
    form.elements.phone.setCustomValidity(""),
  );
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!cart.items().length) {
      setStep("cart");
      return;
    }
    form.elements.name.setCustomValidity(
      form.elements.name.value.trim() ? "" : "Informe seu nome.",
    );
    const phoneDigits = form.elements.phone.value.replace(/\D/g, "");
    form.elements.phone.setCustomValidity(
      phoneDigits.length >= 8 && phoneDigits.length <= 15
        ? ""
        : "Informe um telefone válido.",
    );
    if (!form.reportValidity()) return;
    renderReview();
    setStep("review");
  });

  const submit = dialog.querySelector("#simulate-order");
  const status = dialog.querySelector("#submission-status");
  submit.addEventListener("click", async () => {
    if (busy || !cart.items().length) return;
    busy = true;
    dialog.setAttribute("aria-busy", "true");
    dialog.querySelector("[data-close]").disabled = true;
    submit.disabled = true;
    submit.setAttribute("aria-busy", "true");
    submit.querySelector("span").textContent = "Simulando envio…";
    status.textContent = "Preparando a confirmação de demonstração.";
    dialog.querySelectorAll("[data-back-details]").forEach((button) => {
      button.disabled = true;
    });
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      dialog.querySelector("#order-summary").textContent = summary;
      setStep("success");
      cart.clear();
      form.reset();
      updateAddress();
    } finally {
      busy = false;
      dialog.removeAttribute("aria-busy");
      dialog.querySelector("[data-close]").disabled = false;
      submit.disabled = false;
      submit.removeAttribute("aria-busy");
      submit.querySelector("span").textContent = "Simular envio do pedido";
      status.textContent = "Este protótipo não envia e-mails.";
      dialog.querySelectorAll("[data-back-details]").forEach((button) => {
        button.disabled = false;
      });
    }
  });
  dialog.addEventListener("cancel", (event) => {
    if (busy) event.preventDefault();
  });
  dialog.querySelector("#copy-summary").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(summary);
      showToast("Resumo copiado.");
    } catch {
      dialog.querySelector(".summary-details").open = true;
      showToast("Selecione o resumo para copiar.");
    }
  });

  const today = new Date();
  form.elements.date.min = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");
  cart.subscribe(renderCart);
  renderCart();
  updateAddress();
  return { open };
}
