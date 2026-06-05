/** Evento para abrir el drawer sin acoplar ProductDetailView a CartNavButton. */
export const CART_DRAWER_OPEN_EVENT = "ethra:open-cart-drawer";

/** Solicita abrir la bolsa (p. ej. acción "Ver bolsa" del toast). Solo en cliente. */
export function requestOpenCartDrawer(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CART_DRAWER_OPEN_EVENT));
  }
}
