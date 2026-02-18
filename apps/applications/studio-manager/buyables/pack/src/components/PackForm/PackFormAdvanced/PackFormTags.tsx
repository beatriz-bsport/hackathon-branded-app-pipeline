import type { FC } from "react";

import { TagsAfterPurchaseSelector } from "@bsport/kaizen-business-components/buyables/tags-after-purchase-selector";
import type { PackFormData } from "@bsport/store-buyables-pack";

import { useTags } from "#src/utils/stores-interface";

type PackFormTagsProps = {
  fieldIdPrefix: string;
};

export const PackFormTags: FC<PackFormTagsProps> = ({ fieldIdPrefix }) => {
  const { tagGroups, tags } = useTags();

  return (
    <TagsAfterPurchaseSelector<PackFormData, "tags_on_consumer_item_creation">
      fieldName="tags_on_consumer_item_creation"
      id={`${fieldIdPrefix}-tags-after-purchase-selector`}
      tags={tags}
      tagGroups={tagGroups}
    />
  );
};
