import React from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { VisibilitySelector } from "@bsport/kaizen-business-components/buyables/visibility-selector";
import { Body, Title } from "@bsport/kaizen-primitive-core";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTranslation } from "#src/utils/i18n";

import type { PackFormSchema } from "../schema";
import { PackFormVisibilityDate } from "./PackFormVisibilityDate";
import { PackFormVisibilityRules } from "./PackFormVisibilityRules";

type PackFormVisibilityProps = {
  discardId?: number;
  fieldIdPrefix: string;
  methods: UseFormControllerOutput<PackFormSchema>;
};

const getDynamicKey = (key: string, discardId?: number) => {
  if (!discardId) {
    return key;
  }
  return `${key}-${discardId}`;
};

export const PackFormVisibility: React.FC<PackFormVisibilityProps> = ({
  discardId,
  fieldIdPrefix,
  methods,
}) => {
  const { t } = useTranslation("details");

  return (
    <section className="flex flex-col gap-sm">
      <Title htmlVariant="h4" weight="strong">
        {t("formFields.visibilitySection.title")}
      </Title>

      <Body size="md" htmlVariant="p">
        {t("formFields.visibilitySection.visibilitySelector.label")}
      </Body>

      <VisibilitySelector<PackFormData, "manager_only">
        fieldName="manager_only"
        asHiddenSelector
        buyableName={t("modelName")}
      />

      <PackFormVisibilityDate
        key={getDynamicKey(`${fieldIdPrefix}-visibility-date`, discardId)}
        fieldIdPrefix={fieldIdPrefix}
        methods={methods}
        isDetailsView={discardId !== undefined}
      />

      <PackFormVisibilityRules
        fieldIdPrefix={fieldIdPrefix}
        methods={methods}
      />
    </section>
  );
};
