import { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";
import { Giftcard } from "@bsport/store-buyables-giftcard";

import { useGiftcardPurchasesDisplaySettings } from "#src/features/giftcard-purchases-display-settings";
import { GiftcardPurchasesList } from "#src/features/giftcard-purchases-list";
import { useGiftcardDetailsHeader } from "#src/hooks/layout/use-giftcard-details-header";

type GiftcardPurchasesPageProps = {
  giftcard: Giftcard;
};

export const GiftcardPurchasesPage: FC<GiftcardPurchasesPageProps> = ({
  giftcard,
}) => {
  const headerConfig = useGiftcardDetailsHeader({
    id: giftcard.id,
    isVisible: !giftcard.manager_only,
  });

  const { displaySettings, selectedColumns } =
    useGiftcardPurchasesDisplaySettings();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={giftcard.name}
        {...headerConfig}
        onDisplayPopover={displaySettings}
      />
      <ListLayout.Content>
        <GiftcardPurchasesList
          selectedColumns={selectedColumns}
          giftcard={giftcard}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};
