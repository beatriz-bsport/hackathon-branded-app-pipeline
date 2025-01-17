/* eslint-disable-next-line */
const CardTypes = ['div', 'button'] as const;

/* eslint-disable-next-line */
const CardVariants = ['rest', 'elevated'] as const;

export type CardVariant = (typeof CardVariants)[number];

export type CardType = (typeof CardTypes)[number];
