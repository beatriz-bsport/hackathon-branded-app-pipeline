import type { PaymentPackMassExtensionCreate } from '#src/libs/payment-packs/types';
import type { PrivatePassMassExtensionCreate } from '#src/libs/private-service/types';
import type { Common } from '#src/libs/types';

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
