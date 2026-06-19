import { FC } from "react";

import { Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import OverrideForm from "../SessionForm/Details/OverrideForm";
import ActivitySelector from "./activity-selector";

type DetailsFormProps = {
  fieldIdPrefix: string;
  isGroupSession?: boolean;
};

const DetailsForm: FC<DetailsFormProps> = ({
  fieldIdPrefix,
  isGroupSession = false,
}) => {
  const { t } = useTranslation("sessionEdit");

  return (
    <div className="flex flex-col gap-md">
      <Title htmlVariant="h5" weight="stronger">
        {t("editSessionForm.content.detailsForm.title")}
      </Title>
      <ActivitySelector
        fieldIdPrefix={fieldIdPrefix}
        isGroupSession={isGroupSession}
      />
      <OverrideForm
        fieldIdPrefix={fieldIdPrefix}
        isGroupSession={isGroupSession}
      />
    </div>
  );
};

export default DetailsForm;
