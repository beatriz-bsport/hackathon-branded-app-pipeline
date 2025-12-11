import { z } from "zod";

import {
  getLocalNow,
  modifyTime,
  toDateTime,
} from "@bsport/datetime-manipulation";
import { dataAccessLayer } from "@bsport/sm-backbone";

import type { SessionCreationFormData } from "#src/stores/session-creation/types";
import { useTranslation } from "#src/utils/i18n";

export type SessionCreationFormSchema = z.ZodType<SessionCreationFormData>;

export const MAX_YEARS_AHEAD = 3;

// Will merge the schemas for each section here
export const useSessionSchema = () => {
  const { t, i18n } = useTranslation("sessionCreation");
  const locale = i18n.language;
  const companyTimeZone = dataAccessLayer.useCompanyTheme()?.timezone_name;

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
      startDateTime: z
        .date({
          required_error: t("addSessionModal.errors.requiredField"),
          invalid_type_error: t(
            "addSessionModal.steps.configureSession.timeAndDate.errors.invalidDate",
          ),
        })
        .refine(
          (date) => {
            const maxDate = modifyTime({
              datetime: getLocalNow({ zone: companyTimeZone, locale }),
              duration: { year: MAX_YEARS_AHEAD },
              operator: "plus",
            });
            return toDateTime(date).setZone(companyTimeZone) <= maxDate;
          },
          {
            message: t(
              "addSessionModal.steps.configureSession.timeAndDate.errors.dateTooFar",
            ),
          },
        ),
      duration_minute: z
        .number({
          required_error: t("addSessionModal.errors.requiredField"),
        })
        .positive(
          t(
            "addSessionModal.steps.configureSession.timeAndDate.errors.durationNull",
          ),
        ),
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
