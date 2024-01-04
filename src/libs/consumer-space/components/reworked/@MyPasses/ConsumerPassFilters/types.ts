const PassFilterTabTypes = ['active', 'future', 'expired'] as const;

export type PassFilterTab = (typeof PassFilterTabTypes)[number];
