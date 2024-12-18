export type PassPreviewData = {
  label: string;
  value: number;
  credits: number;
  hasUnlimitedCredits?: boolean;
  price: number;
};

export enum PassType {
  PAYMENT_PACK = 'payment_pack',
  PRIVATE_PASS = 'private_pass',
}
