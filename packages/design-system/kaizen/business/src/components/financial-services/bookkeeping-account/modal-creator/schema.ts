import { z } from "zod";

import { i18nInstance, useTranslation } from "#src/i18n";

export type BookkeepingAccountFormData = {
  accountNumber: string;
  accountName: string;
  vatRate: number;
};

export type BookkeepingAccountSchema = z.ZodType<BookkeepingAccountFormData>;

export const DATA_CONSTRAINTS = {
  ACCOUNT_NUMBER_MIN_LENGTH: 1,
  ACCOUNT_NUMBER_MAX_LENGTH: 100,
  ACCOUNT_NAME_MIN_LENGTH: 1,
  ACCOUNT_NAME_MAX_LENGTH: 100,
  VAT_RATE_MAX_DIGITS: 3,
  VAT_RATE_MIN: 0,
  VAT_RATE_MAX: 100,
};

export const useBookkeepingAccountCreateSchema = () => {
  const { t } = useTranslation("financial-services", { i18n: i18nInstance });

  return z.object({
    // Identity section
    accountNumber: z
      .string({
        required_error: t("bookkeepingAccount.createModal.fieldRequired"),
      })
      .min(DATA_CONSTRAINTS.ACCOUNT_NUMBER_MIN_LENGTH)
      .max(DATA_CONSTRAINTS.ACCOUNT_NUMBER_MAX_LENGTH),
    accountName: z
      .string({
        required_error: t("bookkeepingAccount.createModal.fieldRequired"),
      })
      .min(DATA_CONSTRAINTS.ACCOUNT_NAME_MIN_LENGTH)
      .max(DATA_CONSTRAINTS.ACCOUNT_NAME_MAX_LENGTH),
    vatRate: z
      .number({
        required_error: t("bookkeepingAccount.createModal.fieldRequired"),
      })
      .min(DATA_CONSTRAINTS.VAT_RATE_MIN)
      .max(DATA_CONSTRAINTS.VAT_RATE_MAX),
  });
};
