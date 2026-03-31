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
  "name" | "description" | "recurrent_price" | "flat_fee"
> &
  Pick<CreateLegacyContractParams, "payment_pack"> & {
    payment_pack_details: Pick<
      PassDetails,
      "tax" | "bookkeeping_account_id"
    > | null;
  };

export type ContractFormSchema = z.ZodType<ContractFormData>;

export type ContractFormMethods = UseFormControllerOutput<ContractFormSchema>;
