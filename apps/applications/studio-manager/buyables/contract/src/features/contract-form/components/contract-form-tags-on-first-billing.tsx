import type { FC } from "react";

import { TagsAfterPurchaseSelector } from "@bsport/kaizen-business-components/buyables/tags-after-purchase-selector";

import { fetch } from "#src/utils/fetch";

import type { ContractFormData } from "../types";

type ContractFormTagsOnFirstBillingProps = {
  formId: string;
  readonly: boolean;
};

export const ContractFormTagsOnFirstBilling: FC<
  ContractFormTagsOnFirstBillingProps
> = ({ formId, readonly }) => {
  return (
    <TagsAfterPurchaseSelector<ContractFormData, "tags_on_first_billing">
      fieldName="tags_on_first_billing"
      id={`${formId}-tags-on-first-billing`}
      fetch={fetch}
      disabled={readonly}
    />
  );
};
