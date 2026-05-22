import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

export type WellpassFormSchema = {
  establishmentIds: number[];
};

export const useWellpassFormSchema = () => {
  const { t } = useTranslation("common");

  return z.object({
    establishmentIds: z
      .array(z.number())
      .min(1, t("wellpass.form.errors.establishmentRequired")),
  }) as z.ZodType<WellpassFormSchema>;
};

export const DEFAULT_FORM_DATA: WellpassFormSchema = {
  establishmentIds: [],
};
