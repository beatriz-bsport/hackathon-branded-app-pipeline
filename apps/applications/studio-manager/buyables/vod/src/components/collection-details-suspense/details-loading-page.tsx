import type { FC } from "react";

import {
  DetailsLayout,
  Loader,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useCollectionDetailsHeader } from "#src/hooks/layout/use-collection-details-header";
import { useTranslation } from "#src/utils/i18n";

export const DetailsLoadingPage: FC = () => {
  const { detailsLayoutProps } = useDetailsLayout();
  const headerConfig = useCollectionDetailsHeader();
  const { t } = useTranslation("collections-list");

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel={false}>
      <DetailsLayout.Header
        pageTitle={t("details.loading")}
        {...headerConfig}
      />
      <DetailsLayout.Content>
        <Loader size="xl" />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
