/* eslint-disable-next-line */
const AlertColorTypes = [
  'light',
  'grey',
  'info',
  'success',
  'warning',
  'error',
] as const;

/* eslint-disable-next-line */
const AlertVariantTypes = ['strong', 'weak', 'outlined', 'text'] as const;

export type AlertColor = (typeof AlertColorTypes)[number];
export type AlertVariant = (typeof AlertVariantTypes)[number];
