import { CREDIT_ACCOUNT_NUMBER_TYPE } from "./constants";
import type { CreditAccountFilterFormValue } from "./types";

export const createDefaultCreditAccountFilter = (
  smartlistId: number,
): CreditAccountFilterFormValue => ({
  smartlist: smartlistId,
  type: CREDIT_ACCOUNT_NUMBER_TYPE.lowerOrEqual,
  value: 0,
  secondValue: null,
});
