const getObjectValues = <T extends Record<string, string>>(obj: T) =>
  Object.values(obj) as [T[keyof T], ...T[keyof T][]];

export const SESSION_TYPES = {
  groupActivity: 'group-activity',
  workshop: 'workshop',
  appointment: 'appointment',
} as const;

export const PRODUCT_TYPES = {
  pass: 'pass',
  pack: 'pack',
  subscription: 'subscription',
  privatePass: 'private-pass',
  giftCard: 'gift-card',
  shopItem: 'shop-item',
  coupon: 'coupon',
  credit: 'credit',
  fee: 'fee',
} as const;

export const MEMBER_PROFILE_PAGE_TYPES = {
  bookings: 'booking',
  passes: 'pass',
  subscriptions: 'subscription',
  profile: 'profile',
  giftCards: 'giftcard',
  vod: 'vod',
  invoices: 'invoice',
} as const;

export const sessionTypeValues = getObjectValues(SESSION_TYPES);
export const productTypeValues = getObjectValues(PRODUCT_TYPES);
export const memberProfilePageTypeValues = getObjectValues(
  MEMBER_PROFILE_PAGE_TYPES,
);
