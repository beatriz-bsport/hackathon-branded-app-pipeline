/* eslint-disable-next-line */
const Horizontals = ['center', 'left', 'right'] as const;

export type Horizontal = (typeof Horizontals)[number] | number;

/* eslint-disable-next-line */
const Verticals = ['bottom', 'center', 'top'] as const;

export type Vertical = (typeof Verticals)[number] | number;

export type Origins = {
  horizontal: Horizontal;
  vertical: Vertical;
};

/* eslint-disable-next-line */
const Placements = [
  'top',
  'top-left',
  'top-right',
  'bottom',
  'bottom-left',
  'bottom-right',
  'left',
  'right',
] as const;

export type PlacementsType = (typeof Placements)[number];
