import type { FC } from "react";

import { VisibilitySelector } from "@bsport/kaizen-business-components/buyables/visibility-selector";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardFormData } from "../types";

export const GiftcardFormVisibilitySelector: FC = () => {
  const { t } = useTranslation("giftcard-details");

  return (
    <VisibilitySelector<GiftcardFormData, "manager_only">
      fieldName="manager_only"
      asHiddenSelector
      buyableName={t("modelName.singular")}
    />
  );
};
