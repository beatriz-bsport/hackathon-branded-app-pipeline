import React from "react";

import { Body, Loader, Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export const ProcessingFile: React.FC = () => {
  const { t } = useTranslation("common");

  return (
    <div className="flex flex-col gap-xs items-center my-md">
      <Loader size="lg" />
      <Title htmlVariant="h3">
        {t("importLeadsModal.uploadFile.workInProgress")}
      </Title>
      <Body size="lg">{t("importLeadsModal.uploadFile.wipDoNotRefresh")}</Body>
    </div>
  );
};
