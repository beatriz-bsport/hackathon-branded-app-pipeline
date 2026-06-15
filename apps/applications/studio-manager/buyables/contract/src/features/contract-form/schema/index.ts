import type { ContractFormSchema } from "../types";
import { useBenefitSchema } from "./benefits";
import { useRootContractSchema } from "./root-contract";

export { useContractNameSchema } from "./root-contract";

/**
 * Joins the contract-only schema with the discriminated benefit schema into the
 * single form schema. The feature manages one form state validated by
 * conditional constraints driven by `benefitKind`.
 */
export function useContractFormSchema(): ContractFormSchema {
  const rootSchema = useRootContractSchema();
  const benefitSchema = useBenefitSchema();

  return rootSchema.and(benefitSchema);
}
