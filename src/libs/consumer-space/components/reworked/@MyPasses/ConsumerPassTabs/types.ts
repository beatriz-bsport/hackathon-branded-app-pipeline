const PassTabTypes = ['consumerPaymentPack', 'privateConsumerPass'] as const;

export type PassTab = (typeof PassTabTypes)[number];
