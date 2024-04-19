import type { PaymentPackMassExtensionCreate } from '#libs/payment-packs/types';
import type { PrivatePassMassExtensionCreate } from '#libs/private-service/types';
import type { Common } from '#libs/types';

export type MassExtensionCreateFormValues = {
  minEndingDate: string;
  maxEndingDate: string;
  nbDays: number;
  note: string;
};

export type GenericExtensionCreationPayload = Common<
  PaymentPackMassExtensionCreate,
  PrivatePassMassExtensionCreate
>;
