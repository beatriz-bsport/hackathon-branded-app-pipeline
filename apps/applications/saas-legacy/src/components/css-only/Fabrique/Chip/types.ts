/* eslint-disable-next-line */
const ChipColorTypes = [
  'main',
  'grey',
  'info',
  'success',
  'warning',
  'error',
] as const;
/* eslint-disable-next-line */
const ChipSizeTypes = ['sm', 'lg'] as const;
/* eslint-disable-next-line */
const ChipVariantTypes = ['strong', 'weak'] as const;

export type ChipColor = (typeof ChipColorTypes)[number];
export type ChipSize = (typeof ChipSizeTypes)[number];
export type ChipVariant = (typeof ChipVariantTypes)[number];
