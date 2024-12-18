const Horizontals = ['center', 'left', 'right'] as const;

export type Horizontal = (typeof Horizontals)[number] | number;

const Verticals = ['bottom', 'center', 'top'] as const;

export type Vertical = (typeof Verticals)[number] | number;

export type Origins = {
  horizontal: Horizontal;
  vertical: Vertical;
};

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
