import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

export type WellhubFormSchema = {
  externalId: string;
  establishmentIds: number[];
};

export const useWellhubFormSchema = () => {
  const { t } = useTranslation("common");

  return z.object({
    externalId: z
      .string()
      .trim()
      .min(1, t("wellhub.form.errors.externalIdRequired"))
      .regex(/^\d+$/, t("wellhub.form.errors.externalIdInvalid")),
    establishmentIds: z
      .array(z.number())
      .min(1, t("wellhub.form.errors.establishmentRequired")),
  }) as z.ZodType<WellhubFormSchema>;
};

export const DEFAULT_FORM_DATA: WellhubFormSchema = {
  externalId: "",
  establishmentIds: [],
};
