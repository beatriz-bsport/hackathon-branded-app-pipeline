import type { FC } from "react";

import { TagsAfterPurchaseSelector } from "@bsport/kaizen-business-components/buyables/tags-after-purchase-selector";

import { fetch } from "#src/utils/fetch";

import type { GiftcardFormData } from "../types";

type GiftcardFormTagsAfterPurchaseProps = {
  formId: string;
  isSharedGiftcard?: boolean;
};

export const GiftcardFormTagsAfterPurchase: FC<
  GiftcardFormTagsAfterPurchaseProps
> = ({ formId, isSharedGiftcard }) => {
  return (
    <TagsAfterPurchaseSelector<
      GiftcardFormData,
      "tags_on_consumer_item_creation"
    >
      fieldName="tags_on_consumer_item_creation"
      id={`${formId}-tags-after-purchase`}
      fetch={fetch}
      disabled={isSharedGiftcard}
    />
  );
};
