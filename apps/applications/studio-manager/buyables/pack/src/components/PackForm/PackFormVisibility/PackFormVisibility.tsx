import React from "react";

import type { useFormController } from "@bsport/form";
import { Title } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import type { PackFormSchema } from "../schema";
import { PackFormVisibilityDate } from "./PackFormVisibilityDate";
import { PackFormVisibilityRules } from "./PackFormVisibilityRules";
import { PackFormVisibilitySelector } from "./PackFormVisibilitySelector";

type PackFormVisibilityProps = {
  fieldIdPrefix: string;
  methods: ReturnType<typeof useFormController<PackFormSchema>>;
};

export const PackFormVisibility: React.FC<PackFormVisibilityProps> = ({
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

      <PackFormVisibilityDate fieldIdPrefix={fieldIdPrefix} methods={methods} />

      <PackFormVisibilityRules
        fieldIdPrefix={fieldIdPrefix}
        methods={methods}
      />
    </section>
  );
};
