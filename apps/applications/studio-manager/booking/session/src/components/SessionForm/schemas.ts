import { z } from "zod";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export type SessionCreationFormSchema = z.ZodType<SessionCreationFormData>;

// Will merge the schemas for each section here
export const useSessionSchema = () => {
  const { t } = useTranslation("sessionCreation");
  return z
    .object({
      allowCustomNameAndDescription: z.boolean(),
      name_override: z.string(),
      description_override: z.string(),
      manager_only: z.boolean(),
      credits: z.number().min(0),
      waiting_list_max_size: z.number().min(0),
      // TODO : ADD VALIDATION FOR EFFECTIF BASED ON ROOM BLUEPRINT CAPACITY
      effectif: z.number().min(0),
      available_on_partnership: z.boolean(),
      partner_max_booking_count: z.number().min(0),
    })
    .refine(
      (data) =>
        !data.available_on_partnership ||
        data.partner_max_booking_count <= data.effectif,
      {
        message: t(
          "addSessionModal.steps.configureSession.settings.partnership.capacity.error",
        ),
        path: ["partner_max_booking_count"],
      },
    ) satisfies SessionCreationFormSchema;
};
