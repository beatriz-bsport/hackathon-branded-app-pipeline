import type { FC } from "react";

import { FormMediaField } from "@bsport/kaizen-business-components/form/media-field";

import { useTranslation } from "#src/utils/i18n";

import type { CollectionFormData } from "../types";

type CollectionFormPictureProps = {
  formId: string;
};

export const CollectionFormPicture: FC<CollectionFormPictureProps> = ({
  formId,
}) => {
  const { t } = useTranslation("collection-form");

  return (
    <FormMediaField<CollectionFormData, "cover">
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
