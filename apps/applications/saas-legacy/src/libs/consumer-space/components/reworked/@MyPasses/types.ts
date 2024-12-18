const PassTabTypes = [
  'consumerPaymentPack',
  'privateConsumerPass',
  'universalPass',
] as const;

export type PassTab = (typeof PassTabTypes)[number];

const PassFilterTabTypes = ['active', 'future', 'expired'] as const;

export type PassFilterTab = (typeof PassFilterTabTypes)[number];
