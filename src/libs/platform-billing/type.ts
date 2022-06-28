import { BLOCK_BACKOFFICE, DO_NOTHING, WARN } from './constant';

export type PlatformSubscriptionPaymentStatus = {
  failed: Array<{
    payment_backend_id: number;
    date: string;
  }>;
  action: typeof DO_NOTHING | typeof WARN | typeof BLOCK_BACKOFFICE;
};
