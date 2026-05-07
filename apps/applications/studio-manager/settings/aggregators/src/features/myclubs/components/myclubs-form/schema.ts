import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

export type MyclubsFormSchema = {
  establishmentIds: number[];
};

export const useMyclubsFormSchema = () => {
  const { t } = useTranslation("common");

  return z.object({
    establishmentIds: z
      .array(z.number())
      .min(1, t("myclubs.form.errors.establishmentRequired")),
  }) as z.ZodType<MyclubsFormSchema>;
};

export const DEFAULT_FORM_DATA: MyclubsFormSchema = {
  establishmentIds: [],
};
