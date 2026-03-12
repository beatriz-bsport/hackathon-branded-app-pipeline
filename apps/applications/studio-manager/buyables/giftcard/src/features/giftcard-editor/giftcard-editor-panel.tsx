import type { FC } from "react";

import { DetailsLayout, Divider, Title } from "@bsport/kaizen-primitive-core";

import { GiftcardFormTagsAfterPurchase } from "#src/features/giftcard-form/components/giftcard-form-tags-after-purchase.component";
import { GiftcardFormVisibilitySelector } from "#src/features/giftcard-form/components/giftcard-form-visibility-selector.component";
import { useTranslation } from "#src/utils/i18n";

type GiftcardEditorPanelProps = {
  formId: string;
  isSharedGiftcard?: boolean;
};

export const GiftcardEditorPanel: FC<GiftcardEditorPanelProps> = ({
  formId,
  isSharedGiftcard,
}) => {
  const { t } = useTranslation("giftcard-details");

  return (
    <DetailsLayout.Panel className="flex flex-col gap-md">
      <Title htmlVariant="h4" weight="strong">
        {t("sections.visibility")}
      </Title>
      <GiftcardFormVisibilitySelector isSharedGiftcard={isSharedGiftcard} />

      <Divider orientation="horizontal" weight="thin" />

      <GiftcardFormTagsAfterPurchase
        formId={formId}
        isSharedGiftcard={isSharedGiftcard}
      />
    </DetailsLayout.Panel>
  );
};
