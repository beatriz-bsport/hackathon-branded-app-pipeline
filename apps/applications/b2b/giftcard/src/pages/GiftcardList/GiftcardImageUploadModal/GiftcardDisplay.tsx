import React from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import GiftcardPreview from "#src/components/GiftcardPreview";
import { useTranslation } from "#src/utils/i18n";

type GiftcardPreviewProps = {
  companyCover?: string;
  displaySelectMessage?: boolean;
  selectedImage?: string;
};

export const GiftcardDisplay: React.FC<GiftcardPreviewProps> = ({
  companyCover,
  displaySelectMessage,
  selectedImage,
}) => {
  const { t } = useTranslation("imageUpload");

  return (
    <div className="flex flex-col justify-center items-center w-1/2 gap-md p-md">
      <GiftcardPreview
        amount={t("giftcardPreview.placeholders.amount")}
        amountHint={t("giftcardPreview.hints.amount")}
        companyCover={companyCover || "/vite.svg"}
        giftcardImage={selectedImage}
        giftcardName={t("giftcardPreview.placeholders.name")}
        buyerName={t("giftcardPreview.placeholders.buyer")}
        buyerNameHint={t("giftcardPreview.hints.buyer")}
        recipientName={t("giftcardPreview.placeholders.recipient")}
        recipientNameHint={t("giftcardPreview.hints.recipient")}
        customMessage={t("giftcardPreview.placeholders.message")}
      />
      {displaySelectMessage && (
        <Body htmlVariant="p" color="weak" weight="weak" className="mb-sm">
          {t("selectImage")}
        </Body>
      )}
    </div>
  );
};
