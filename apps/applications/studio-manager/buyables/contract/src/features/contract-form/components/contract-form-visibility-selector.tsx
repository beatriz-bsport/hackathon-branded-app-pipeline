import type { FC } from "react";

import { VisibilitySelector } from "@bsport/kaizen-business-components/buyables/visibility-selector";

import { useTranslation } from "#src/utils/i18n";

import type { ContractFormData } from "../types";

type ContractFormVisibilitySelectorProps = {
  readonly: boolean;
};

export const ContractFormVisibilitySelector: FC<
  ContractFormVisibilitySelectorProps
> = ({ readonly }) => {
  const { t } = useTranslation("contract-details");

  return (
    <VisibilitySelector<ContractFormData, "manager_only">
      fieldName="manager_only"
      asHiddenSelector
      buyableName={t("modelName.singular")}
      readonly={readonly}
    />
  );
};
