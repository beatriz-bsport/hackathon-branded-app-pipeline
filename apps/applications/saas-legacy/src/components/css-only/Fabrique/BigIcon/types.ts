/* eslint-disable-next-line */
const BigIconVariant = ['success', 'info', 'warning', 'error', 'grey'] as const;

export type BigIconVariantType = (typeof BigIconVariant)[number];
