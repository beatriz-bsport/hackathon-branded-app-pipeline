import type { FC } from "react";

import { DetailsLayout, Title } from "@bsport/kaizen-primitive-core";

import { ContractFormTagsOnFirstBilling } from "#src/features/contract-form/components/contract-form-tags-on-first-billing";
import { ContractFormVisibilityRules } from "#src/features/contract-form/components/contract-form-visibility-rules";
import { ContractFormVisibilitySelector } from "#src/features/contract-form/components/contract-form-visibility-selector";
import { useTranslation } from "#src/utils/i18n";

type ContractEditorPanelProps = {
  formId: string;
  readonly?: boolean;
};

export const ContractEditorPanel: FC<ContractEditorPanelProps> = ({
  formId,
  readonly,
}) => {
  const { t } = useTranslation("contract-details");
  return (
    <DetailsLayout.Panel className="flex flex-col gap-md">
      <section className="flex flex-col gap-sm">
        <Title htmlVariant="h4" weight="strong">
          {t("formSections.visibility")}
        </Title>
        <ContractFormVisibilitySelector readonly={readonly} />
        <ContractFormVisibilityRules formId={formId} readonly={readonly} />
      </section>

      <ContractFormTagsOnFirstBilling formId={formId} />
    </DetailsLayout.Panel>
  );
};
