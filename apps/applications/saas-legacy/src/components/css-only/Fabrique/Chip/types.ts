const ChipColorTypes = [
  'main',
  'grey',
  'info',
  'success',
  'warning',
  'error',
] as const;
const ChipSizeTypes = ['sm', 'lg'] as const;
const ChipVariantTypes = ['strong', 'weak'] as const;

export type ChipColor = (typeof ChipColorTypes)[number];
export type ChipSize = (typeof ChipSizeTypes)[number];
export type ChipVariant = (typeof ChipVariantTypes)[number];
