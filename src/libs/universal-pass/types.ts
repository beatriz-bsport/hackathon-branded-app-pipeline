import type {
  ConsumerPaymentPackREST,
  ConsumerPaymentPackReworked,
} from '#libs/consumer-payment-pack/types';
import type {
  PrivateConsumerPassREST,
  PrivateConsumerPassReworked,
} from '#libs/private-service/types';

export type UniversalPassREST = {
  id: number;
  consumer_payment_pack: ConsumerPaymentPackREST;
  private_consumer_pass: PrivateConsumerPassREST;
};

export type UniversalPassReworked = {
  id: number;
  consumer_payment_pack: ConsumerPaymentPackReworked;
  private_consumer_pass: PrivateConsumerPassReworked;
};
