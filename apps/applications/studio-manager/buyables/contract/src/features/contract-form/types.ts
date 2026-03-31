import type { z } from "zod";

import type {
  CreateContractParams,
  CreateLegacyContractParams,
} from "@bsport/api-buyables/contract";
import type { UseFormControllerOutput } from "@bsport/form";

/**
 * TEMPORARY GETTING FEW FIELDS FOR VALIDATION
 * @todo Add other fields progressively
 */
export type ContractFormData = Pick<
  CreateContractParams,
  "name" | "description"
> &
  Pick<CreateLegacyContractParams, "payment_pack"> & {
    payment_pack_details: number | null;
  };

export type ContractFormSchema = z.ZodType<ContractFormData>;

export type ContractFormMethods = UseFormControllerOutput<ContractFormSchema>;
