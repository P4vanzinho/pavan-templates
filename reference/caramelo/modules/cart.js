const STORAGE_KEY = "caramelo.cart.v1";
const MAX_QUANTITY = 999;

function browserStorage() {
  try {
    return globalThis.localStorage;
  } catch {
    return undefined;
  }
}

/** Stores product IDs and quantities only. Customer data stays in the current form. */
export function createCart(products, storage = browserStorage()) {
  const catalog = new Map(products.map((product) => [product.id, product]));
  const listeners = new Set();
  const read = () => {
    try {
      const saved = JSON.parse(storage?.getItem(STORAGE_KEY) || "null");
      if (saved?.version !== 1 || !Array.isArray(saved.items)) return new Map();
      return new Map(
        saved.items
          .filter(
            (item) =>
              catalog.has(item?.id) &&
              Number.isInteger(item.quantity) &&
              item.quantity >= 1 &&
              item.quantity <= MAX_QUANTITY,
          )
          .map((item) => [item.id, item.quantity]),
      );
    } catch {
      return new Map();
    }
  };
  let quantities = read();
  const items = () =>
    [...quantities].map(([id, quantity]) => ({
      product: catalog.get(id),
      quantity,
    }));
  const emit = () => listeners.forEach((listener) => listener(items()));
  const save = () => {
    try {
      storage?.setItem(
        STORAGE_KEY,
        JSON.stringify({
          version: 1,
          items: [...quantities].map(([id, quantity]) => ({ id, quantity })),
        }),
      );
    } catch {
      /* In-memory cart remains available. */
    }
    emit();
  };
  if (typeof window !== "undefined")
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY && event.key !== null) return;
      quantities = read();
      emit();
    });
  return {
    items,
    count: () =>
      [...quantities.values()].reduce((total, quantity) => total + quantity, 0),
    add(id) {
      if (!catalog.has(id)) return;
      quantities.set(id, Math.min(MAX_QUANTITY, (quantities.get(id) || 0) + 1));
      save();
    },
    setQuantity(id, quantity) {
      if (
        !quantities.has(id) ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > MAX_QUANTITY
      )
        return false;
      quantities.set(id, quantity);
      save();
      return true;
    },
    remove(id) {
      quantities.delete(id);
      save();
    },
    clear() {
      quantities.clear();
      save();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
