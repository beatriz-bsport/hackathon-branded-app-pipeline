import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import type { SmsContentFormData } from "./types";

export const getSmsContentObjectSchema = () =>
  z.object({
    message: z
      .string()
      .trim()
      .min(
        1,
        i18nInstance.t("generic.smsContent.form.message.required", {
          ns: "sm-smartlists_details",
        }),
      ),
  }) satisfies z.ZodType<SmsContentFormData>;
