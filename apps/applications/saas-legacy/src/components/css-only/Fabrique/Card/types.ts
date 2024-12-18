const CardTypes = ['div', 'button'] as const;

const CardVariants = ['rest', 'elevated'] as const;

export type CardVariant = (typeof CardVariants)[number];

export type CardType = (typeof CardTypes)[number];
