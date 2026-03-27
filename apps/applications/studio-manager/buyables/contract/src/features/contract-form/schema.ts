import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

import { FIELD_CONSTRAINTS } from "./constants";
import type { ContractFormSchema } from "./types";

/**
 * Returns the adequate Zod schema based on the type of the Contract.
 * Instead of handling multiple signatures of forms and functions for the 2 versions,
 * this feature manages a single form state but with conditional constraints.
 */
export function useContractFormSchema({
  isRevampedContract,
}: {
  isRevampedContract: boolean;
}): ContractFormSchema {
  const { t } = useTranslation("contract-details");

  const requiredErrorMessage = t("formFields.errors.fieldIsRequired");

  // Schema for both type of contracts
  const baseSchema = z.object({
    name: z
      .string()
      .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage)
      .max(
        FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        t("formFields.name.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.NAME_MAX_LENGTH,
        }),
      ),

    description: z
      .string()
      .min(FIELD_CONSTRAINTS.TEXTFIELD_MIN_LENGTH, requiredErrorMessage),
  });

  const revampSubschema = z.object({
    // Revamp fields -> defined
    payment_pack_details: z.number().nullable(),

    // Legacy fields -> nullished
    payment_pack: z.null(),
  });

  const revampSchema = baseSchema.and(revampSubschema);

  // ----- Legacy config -----
  const legacySubschema = z.object({
    // Revamp fields -> nullished
    payment_pack_details: z.null(),

    // Legacy fields -> defined
    payment_pack: z.number().nullable(),
  });

  const legacySchema = baseSchema.and(legacySubschema);

  return isRevampedContract ? revampSchema : legacySchema;
}
