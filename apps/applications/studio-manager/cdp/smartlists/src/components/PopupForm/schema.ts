import { z } from "zod";

import { i18nInstance } from "#src/utils/i18n";

import { PopupFormData } from "./shared-types";

const MAX_NAME_LENGTH = 200;
const MAX_LINK_LENGTH = 200;

export const getPopupSchema = () =>
  z.object({
    name: z
      .string()
      .trim()
      .min(
        1,
        i18nInstance.t("popup.creation.form.name.required", {
          ns: "sm-smartlists_campaign",
        }),
      )
      .max(
        MAX_NAME_LENGTH,
        i18nInstance.t("popup.creation.form.name.maxLength", {
          ns: "sm-smartlists_campaign",
        }),
      )
      .refine((val) => val.trim().length <= MAX_NAME_LENGTH, {
        message: i18nInstance.t("popup.creation.form.name.maxLength", {
          ns: "sm-smartlists_campaign",
        }),
      }),
    link: z
      .string()
      .trim()
      .min(
        1,
        i18nInstance.t("popup.creation.form.link.required", {
          ns: "sm-smartlists_campaign",
        }),
      )
      .url({
        message: i18nInstance.t("popup.creation.form.link.invalidUrl", {
          ns: "sm-smartlists_campaign",
        }),
      })
      .max(
        MAX_LINK_LENGTH,
        i18nInstance.t("popup.creation.form.link.maxLength", {
          ns: "sm-smartlists_campaign",
        }),
      )
      .refine((val) => val.trim().length <= MAX_LINK_LENGTH, {
        message: i18nInstance.t("popup.creation.form.link.maxLength", {
          ns: "sm-smartlists_campaign",
        }),
      }),
    image: z.instanceof(File),
  }) satisfies z.ZodType<PopupFormData>;

export type PopupFormSchema = z.infer<ReturnType<typeof getPopupSchema>>;
