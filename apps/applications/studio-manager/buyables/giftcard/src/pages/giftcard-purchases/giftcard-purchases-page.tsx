import { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";
import { Giftcard } from "@bsport/store-buyables-giftcard";

import { useGiftcardDetailsHeader } from "#src/hooks/layout/use-giftcard-details-header";

type GiftcardPurchasesPageProps = {
  giftcard: Giftcard | null;
};

export const GiftcardPurchasesPage: FC<GiftcardPurchasesPageProps> = ({
  giftcard,
}) => {
  const headerConfig = useGiftcardDetailsHeader({
    id: giftcard?.id,
    isVisible: !giftcard?.manager_only,
  });

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={giftcard?.name ?? ""} {...headerConfig} />
      <ListLayout.Content>{giftcard?.name}</ListLayout.Content>
    </ListLayout>
  );
};
