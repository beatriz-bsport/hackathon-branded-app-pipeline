import { FC } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import OverrideForm from "../SessionForm/Details/OverrideForm";

type DetailsFormProps = {
  fieldIdPrefix: string;
};

const DetailsForm: FC<DetailsFormProps> = ({ fieldIdPrefix }) => {
  const { t } = useTranslation("sessionEdit");

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h5" weight="strong">
        {t("editSessionForm.content.detailsForm.title")}
      </Title>
      <OverrideForm fieldIdPrefix={fieldIdPrefix} />
    </div>
  );
};

export default DetailsForm;
