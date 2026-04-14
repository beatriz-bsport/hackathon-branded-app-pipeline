import type { FC } from "react";

import { TagsAfterPurchaseSelector } from "@bsport/kaizen-business-components/buyables/tags-after-purchase-selector";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { fetch } from "#src/utils/fetch";

type PackFormTagsProps = {
  fieldIdPrefix: string;
};

export const PackFormTags: FC<PackFormTagsProps> = ({ fieldIdPrefix }) => {
  return (
    <TagsAfterPurchaseSelector<PackFormData, "tags_on_consumer_item_creation">
      fieldName="tags_on_consumer_item_creation"
      id={`${fieldIdPrefix}-tags-after-purchase-selector`}
      fetch={fetch}
    />
  );
};
