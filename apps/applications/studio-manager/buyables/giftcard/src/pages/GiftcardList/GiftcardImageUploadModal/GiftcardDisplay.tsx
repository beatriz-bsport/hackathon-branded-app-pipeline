import React from "react";

import { Body } from "@bsport/kaizen-primitive-core";

import GiftcardPreview from "#src/components/GiftcardPreview";
import { useTranslation } from "#src/utils/i18n";

type GiftcardPreviewProps = {
  companyCover?: string | null;
  displaySelectMessage?: boolean;
  selectedImage?: string;
};

export const GiftcardDisplay: React.FC<GiftcardPreviewProps> = ({
  companyCover,
  displaySelectMessage,
  selectedImage,
}) => {
  const { t } = useTranslation(["imageUpload", "common"]);

  return (
    <div className="flex flex-col justify-center items-center w-1/2 gap-md p-md">
      <GiftcardPreview
        amount={t("giftcardPreview.placeholders.amount", { ns: "imageUpload" })}
        amountHint={t("giftcardPreview.hints.amount", { ns: "imageUpload" })}
        companyCover={companyCover || ""}
        giftcardImage={selectedImage}
        giftcardName={t("giftcardPreview.placeholders.name", {
          ns: "imageUpload",
        })}
        buyerName={t("giftcardPreview.placeholders.buyer", {
          ns: "imageUpload",
        })}
        buyerNameHint={t("giftcardPreview.hints.buyer", { ns: "imageUpload" })}
        recipientName={t("giftcardPreview.placeholders.recipient", {
          ns: "imageUpload",
        })}
        recipientNameHint={t("giftcardPreview.hints.recipient", {
          ns: "imageUpload",
        })}
        customMessage={t("giftcardPreview.placeholders.message", {
          ns: "imageUpload",
        })}
      />
      {displaySelectMessage && (
        <Body htmlVariant="p" color="weak" weight="weak" className="mb-sm">
          {t("imageUploadModal.selectImage", { ns: "common" })}
        </Body>
      )}
    </div>
  );
};
