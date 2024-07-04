const PassTabTypes = [
  'consumerPaymentPack',
  'privateConsumerPass',
  'universalPass',
] as const;

export type PassTab = (typeof PassTabTypes)[number];
