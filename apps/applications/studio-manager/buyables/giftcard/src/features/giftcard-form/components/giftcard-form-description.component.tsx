import type { FC } from "react";

import { FormField } from "@bsport/form";
import { TextArea, type TextAreaProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardFormData } from "../types";

type GiftcardFormDescriptionProps = {
  formId: string;
  isSharedGiftcard?: boolean;
};

export const GiftcardFormDescription: FC<GiftcardFormDescriptionProps> = ({
  formId,
  isSharedGiftcard,
}) => {
  const { t } = useTranslation("giftcard-details");

  return (
    <FormField<
      GiftcardFormData,
      "description",
      TextAreaProps
    > name="description">
      <TextArea
        id={`${formId}-description`}
        label={t("formFields.description.label")}
        required
        disabled={isSharedGiftcard}
      />
    </FormField>
  );
};
