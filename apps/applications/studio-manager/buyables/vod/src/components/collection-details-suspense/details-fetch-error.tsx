import type { FC } from "react";

import {
  DetailsLayout,
  ErrorFallback,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useCollectionDetailsHeader } from "#src/hooks/layout/use-collection-details-header";
import { useTranslation } from "#src/utils/i18n";

type DetailsFetchErrorProps = {
  onRetry: () => void;
};

export const DetailsFetchError: FC<DetailsFetchErrorProps> = ({ onRetry }) => {
  const { detailsLayoutProps } = useDetailsLayout();
  const headerConfig = useCollectionDetailsHeader();
  const { t } = useTranslation("collections-list");

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel={false}>
      <DetailsLayout.Header
        pageTitle={t("details.loadError.title")}
        {...headerConfig}
      />
      <DetailsLayout.Content>
        <ErrorFallback
          className="mx-auto"
          title={t("details.loadError.title")}
          subtitle=""
          description={t("details.loadError.description")}
          actionProps={{
            label: t("details.loadError.retry"),
            onClick: onRetry,
          }}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
