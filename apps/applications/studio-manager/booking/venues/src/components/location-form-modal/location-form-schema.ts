import { z } from "zod";

import { useTranslation } from "#src/utils/i18n";

export const useLocationFormSchema = () => {
  const { t } = useTranslation("location-form");

  return z.object({
    name: z.string().min(1, t("errors.required")),
    establishment: z.array(z.number()).min(1, t("errors.venuesRequired")),
  });
};

export type LocationFormData = {
  name: string;
  establishment: number[];
};
