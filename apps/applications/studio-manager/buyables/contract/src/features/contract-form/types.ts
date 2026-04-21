import type { z } from "zod";

import type {
  CreateContractParams,
  CreateLegacyContractParams,
  PassDetails,
} from "@bsport/api-buyables/contract";
import type { UseFormControllerOutput } from "@bsport/form";

/**
 * TEMPORARY GETTING FEW FIELDS FOR VALIDATION
 * @todo Add other fields progressively
 */
export type ContractFormData = Pick<
  CreateContractParams,
  | "manager_only"
  | "name"
  | "description"
  | "recurrent_price"
  | "flat_fee"
  | "interval"
  | "recurrence_basis"
  | "month_billing_day"
  | "nb_interval"
  | "auto_renewal"
  | "nb_interval_after_auto_renewal"
  | "contract"
  | "commitment_period_unit"
  | "commitment_period_value"
  | "has_mandatory_commitment_period"
  | "highlighted_as_recommended"
  | "is_usable_by_staff"
  | "tags_on_first_billing"
> &
  Pick<CreateLegacyContractParams, "payment_pack"> & {
    payment_pack_details: Pick<
      PassDetails,
      "tax" | "bookkeeping_account_id"
    > | null;
  } & {
    // Form helpers for discrimanted unions
    hasCustomInterval: boolean;
  };

export type ContractFormSchema = z.ZodType<ContractFormData>;

export type ContractFormMethods = UseFormControllerOutput<ContractFormSchema>;
