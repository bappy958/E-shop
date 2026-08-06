export interface PersistedState {
  products: any[];
  categories: any[];
  brands: any[];
  coupons: any[];
  banners: any[];
  reviews: any[];
  ordersStore: any[];
  customersStore: any[];
}

export function buildPersistedState(state: PersistedState) {
  return {
    _id: 'app-state',
    updatedAt: new Date().toISOString(),
    ...state,
  };
}

export function hydratePersistedState(doc: Partial<PersistedState> | null | undefined, fallback: PersistedState): PersistedState {
  return {
    products: Array.isArray(doc?.products) ? doc.products : fallback.products,
    categories: Array.isArray(doc?.categories) ? doc.categories : fallback.categories,
    brands: Array.isArray(doc?.brands) ? doc.brands : fallback.brands,
    coupons: Array.isArray(doc?.coupons) ? doc.coupons : fallback.coupons,
    banners: Array.isArray(doc?.banners) ? doc.banners : fallback.banners,
    reviews: Array.isArray(doc?.reviews) ? doc.reviews : fallback.reviews,
    ordersStore: Array.isArray(doc?.ordersStore) ? doc.ordersStore : fallback.ordersStore,
    customersStore: Array.isArray(doc?.customersStore) ? doc.customersStore : fallback.customersStore,
  };
}
