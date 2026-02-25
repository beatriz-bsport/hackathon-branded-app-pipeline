import type { FC } from "react";

import { ListLayout, Loader } from "@bsport/kaizen-primitive-core";

import { useGiftcardDetailsHeader } from "#src/hooks/layout/use-giftcard-details-header";
import { useTranslation } from "#src/utils/i18n";

export const GiftcardDetailsLoading: FC = () => {
  const { t } = useTranslation("giftcard-details");
  const { BreadcrumbsItems } = useGiftcardDetailsHeader({});

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("details.loading")}
        BreadcrumbsItems={BreadcrumbsItems}
      />
      <ListLayout.Content>
        <Loader size="xl" />
      </ListLayout.Content>
    </ListLayout>
  );
};
