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
      .min(FIELD_CONSTRAINTS.TEXTFIELD_LENGTH_MIN, requiredErrorMessage)
      .max(
        FIELD_CONSTRAINTS.NAME_LENGTH_MAX,
        t("formFields.name.errorMaxLength", {
          maxLength: FIELD_CONSTRAINTS.NAME_LENGTH_MAX,
        }),
      ),

    description: z
      .string()
      .min(FIELD_CONSTRAINTS.TEXTFIELD_LENGTH_MIN, requiredErrorMessage),

    recurrent_price: z
      .number({ required_error: requiredErrorMessage })
      .min(FIELD_CONSTRAINTS.PRICE_MIN),

    flat_fee: z
      .number({ required_error: requiredErrorMessage })
      .min(FIELD_CONSTRAINTS.PRICE_MIN),
  });

  const revampSubschema = z.object({
    // Revamp fields -> defined
    payment_pack_details: z
      .object({
        bookkeeping_account_id: z.number().nullable(),
        tax: z
          .number()
          .min(FIELD_CONSTRAINTS.TAX_RATE_MIN)
          .max(FIELD_CONSTRAINTS.TAX_RATE_MAX),
      })
      .nullable(),

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
