import type { FC } from "react";

import { FormMediaField } from "@bsport/kaizen-business-components/form/media-field";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardFormData } from "../types";

type GiftcardFormCoverProps = {
  formId: string;
  isSharedGiftcard?: boolean;
};

export const GiftcardFormCover: FC<GiftcardFormCoverProps> = ({
  formId,
  isSharedGiftcard,
}) => {
  const { t } = useTranslation("giftcard-details");

  return (
    <FormMediaField<GiftcardFormData, "cover">
      id={`${formId}-cover`}
      fieldName="cover"
      fileExtensionList={["image/*"]}
      disabled={isSharedGiftcard}
      customTexts={{
        fileExtensionList: t("formFields.cover.extensions"),
      }}
      helperText={t("formFields.cover.helperText")}
    />
  );
};
