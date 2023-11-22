const Horizontals = ['center', 'left', 'right'] as const;

export type Horizontal = (typeof Horizontals)[number] | number;

const Verticals = ['bottom', 'center', 'top'] as const;

export type Vertical = (typeof Verticals)[number] | number;

export type Origins = {
  horizontal: Horizontal;
  vertical: Vertical;
};
