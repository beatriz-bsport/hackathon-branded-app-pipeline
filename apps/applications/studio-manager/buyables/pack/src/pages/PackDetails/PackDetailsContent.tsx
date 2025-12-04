import type { FC } from "react";

import type { UseFormControllerOutput } from "@bsport/form";
import { DetailsLayout } from "@bsport/kaizen-primitive-core";

import { PackFormContent } from "#src/components/PackForm/PackFormContent";
import { PackFormDescription } from "#src/components/PackForm/PackFormIdentity";
import { PackFormPricing } from "#src/components/PackForm/PackFormPricing";
import type { PackFormSchema } from "#src/components/PackForm/schema";
import {
  PackItemDetailDrawer,
  usePackItemDetailDrawer,
} from "#src/components/PackItemDetailDrawer";

type PackDetailsContentProps = {
  fieldIdPrefix: string;
  methods: UseFormControllerOutput<PackFormSchema>;
};

export const PackDetailsContent: FC<PackDetailsContentProps> = ({
  fieldIdPrefix,
  methods,
}) => {
  const {
    selectedItem,
    selectedItemCategory,
    onItemClick,
    ...detailDrawerParams
  } = usePackItemDetailDrawer({
    passes: methods.watch("payment_pack_ids"),
    appointmentPasses: methods.watch("private_pass_ids"),
    webshopItems: methods.watch("shop_item_ids"),
  });

  return (
    <DetailsLayout.Content className="flex flex-col gap-lg">
      <PackFormDescription fieldIdPrefix={fieldIdPrefix} />

      <PackFormContent
        fieldIdPrefix={fieldIdPrefix}
        onItemClick={onItemClick}
        clickedItem={selectedItem}
      />

      <PackItemDetailDrawer
        item={selectedItem}
        categoryName={selectedItemCategory}
        {...detailDrawerParams}
      />

      <PackFormPricing fieldIdPrefix={fieldIdPrefix} methods={methods} />
    </DetailsLayout.Content>
  );
};
