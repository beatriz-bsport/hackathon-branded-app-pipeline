import type { ContractWithPaymentPack } from '#src/libs/subscription/types';
import { ObjectType } from './types';
import type { PrivatePass } from '#src/libs/private-service/types';
import type { PaymentCombo } from '#src/libs/payment-combo/types';

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value);
}

export function getIdOrObject<T extends { id: number }>(
  value: T | number,
): number {
  return isNumber(value) ? value : value.id;
}

export const getObjectTypeFromContract = (
  contract: ContractWithPaymentPack<PrivatePass, PaymentCombo>,
): ObjectType => {
  if (!!contract?.payment_pack) {
    return ObjectType.PAYMENT_PACK;
  }
  return ObjectType.PRIVATE_PASS;
};
