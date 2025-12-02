import React from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { PackFormSchema } from "../schema";
import { PackFormVisibilityDate } from "./PackFormVisibilityDate";
import { PackFormVisibilityRules } from "./PackFormVisibilityRules";
import { PackFormVisibilitySelector } from "./PackFormVisibilitySelector";

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

      <PackFormVisibilitySelector
        fieldIdPrefix={fieldIdPrefix}
        methods={methods}
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
