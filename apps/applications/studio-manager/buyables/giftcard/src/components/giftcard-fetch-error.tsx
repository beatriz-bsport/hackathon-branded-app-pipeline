import { FC } from "react";
import { useNavigate } from "react-router";

import { ErrorFallback } from "@bsport/kaizen-primitive-core";

import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const GiftcardFetchError: FC = () => {
  const { t } = useTranslation("giftcard-details");
  const navigate = useNavigate();

  return (
    <ErrorFallback
      title={t("details.canNotFindGiftcard.title")}
      subtitle="" // Mandatory to remove default translations
      description="" // Mandatory to remove default translations
      className="mx-auto h-full"
      actionProps={{
        label: t("details.canNotFindGiftcard.goToListPage"),
        iconLeft: "link-external-02",
        onClick: () => navigate(URLS.INDEX),
      }}
    />
  );
};
