import type { FC } from "react";

import { FormMediaField } from "@bsport/kaizen-business-components/form/media-field";

import { useTranslation } from "#src/utils/i18n";

import type { MediaFormData } from "../types";

type MediaFormPictureProps = {
  formId: string;
};

export const MediaFormPicture: FC<MediaFormPictureProps> = ({ formId }) => {
  const { t } = useTranslation("media-form");

  return (
    <FormMediaField<MediaFormData, "cover">
      id={`${formId}-cover`}
      fieldName="cover"
      fileExtensionList={["image/*"]}
      customTexts={{
        fileExtensionList: t("formFields.cover.extensions"),
      }}
      helperText={t("formFields.cover.helperText")}
    />
  );
};
