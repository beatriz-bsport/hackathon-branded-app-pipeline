import type {
  Contract,
  UpdateContractParams,
  UpdateLegacyContractParams,
} from "@bsport/api-buyables/contract";

import { DEFAULT_DATA } from "./constants";
import type { ContractFormData } from "./types";

export function transformContractIntoFormState({
  isRevampedContract,
  contract,
}: {
  isRevampedContract: boolean;
  contract: Contract;
}): ContractFormData {
  // INFO: This method will be updated as I'll add progressively new fields into the form state
  const hasCustomInterval = contract.month_billing_day == null;

  if (isRevampedContract) {
    return {
      ...contract,
      hasCustomInterval,
      payment_pack_details: {
        bookkeeping_account_id: null,
        // TODO: add fallback on benefit value
        tax: contract.tax ?? DEFAULT_DATA.payment_pack_details.tax,
      },
      // Legacy fields -> nullished
      payment_pack: null,
    };
  }

  return {
    ...contract,
    hasCustomInterval,
    // Revamped fields -> nullished
    payment_pack_details: null,
  };
}

// ----------------------------------------------------------------------------

/**
 * Converts a ContractFormData into API Data to send to backend.
 * Support multiple signature for both Legacy and Revamped Contract endpoints.
 */

export function transformFormStateIntoContractAPIParams(options: {
  isRevampedContract: false;
  formState: ContractFormData;
}): UpdateLegacyContractParams;

export function transformFormStateIntoContractAPIParams(options: {
  isRevampedContract: true;
  formState: ContractFormData;
}): UpdateContractParams;

export function transformFormStateIntoContractAPIParams({
  formState,
  isRevampedContract,
}: {
  formState: ContractFormData;
  isRevampedContract: boolean;
}): UpdateContractParams | UpdateLegacyContractParams {
  if (isRevampedContract) {
    // @ts-expect-error Missing fields in form state for now
    return formState;
  }
  // @ts-expect-error Missing fields in form state for now
  return formState;
}
