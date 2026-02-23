import { FC } from "react";

import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";
import { Giftcard } from "@bsport/store-buyables-giftcard";

import { useGiftcardDetailsHeader } from "#src/hooks/layout/use-giftcard-details-header";

type GiftcardEditorPageProps = {
  giftcard: Giftcard | null;
};

export const GiftcardEditorPage: FC<GiftcardEditorPageProps> = ({
  giftcard,
}) => {
  const { detailsLayoutProps } = useDetailsLayout();
  const headerConfig = useGiftcardDetailsHeader({
    id: giftcard?.id,
    isVisible: !giftcard?.manager_only,
  });

  return (
    <DetailsLayout {...detailsLayoutProps}>
      <DetailsLayout.Header
        pageTitle={giftcard?.name ?? ""}
        {...headerConfig}
      />
      <DetailsLayout.Content>{JSON.stringify(giftcard)}</DetailsLayout.Content>
    </DetailsLayout>
  );
};
