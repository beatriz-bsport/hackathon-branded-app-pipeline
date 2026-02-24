import type { FC } from "react";

import { TagsAfterPurchaseSelector } from "@bsport/kaizen-business-components/buyables/tags-after-purchase-selector";
import {
  selectTagGroups,
  selectTags,
  useTagStore,
} from "@bsport/store-cdp-tag";

import { useFetchTags } from "#src/hooks/useFetchTags";

import type { GiftcardFormData } from "../types";

type GiftcardFormTagsAfterPurchaseProps = {
  formId: string;
};

export const GiftcardFormTagsAfterPurchase: FC<
  GiftcardFormTagsAfterPurchaseProps
> = ({ formId }) => {
  useFetchTags();

  const tags = useTagStore(selectTags);
  const tagGroups = useTagStore(selectTagGroups);

  return (
    <TagsAfterPurchaseSelector<
      GiftcardFormData,
      "tags_on_consumer_item_creation"
    >
      fieldName="tags_on_consumer_item_creation"
      id={`${formId}-tags-after-purchase`}
      tags={tags}
      tagGroups={tagGroups}
    />
  );
};
