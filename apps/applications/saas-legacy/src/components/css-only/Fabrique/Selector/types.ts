const SelectorSizeTypes = ['sm', 'lg'] as const;

export type SelectorSize = (typeof SelectorSizeTypes)[number];
