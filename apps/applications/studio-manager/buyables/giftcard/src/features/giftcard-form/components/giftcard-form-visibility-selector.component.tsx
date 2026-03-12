import type { FC } from "react";

import { VisibilitySelector } from "@bsport/kaizen-business-components/buyables/visibility-selector";

import { useTranslation } from "#src/utils/i18n";

import type { GiftcardFormData } from "../types";

type GiftcardFormVisibilitySelectorProps = {
  isSharedGiftcard?: boolean;
};

export const GiftcardFormVisibilitySelector: FC<
  GiftcardFormVisibilitySelectorProps
> = ({ isSharedGiftcard }) => {
  const { t } = useTranslation("giftcard-details");

  return (
    <VisibilitySelector<GiftcardFormData, "manager_only">
      fieldName="manager_only"
      asHiddenSelector
      buyableName={t("modelName.singular")}
      readonly={isSharedGiftcard}
    />
  );
};
