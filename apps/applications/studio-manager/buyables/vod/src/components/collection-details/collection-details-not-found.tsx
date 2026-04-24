import type { FC } from "react";
import { useNavigate } from "react-router";

import {
  DetailsLayout,
  ErrorFallback,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { useCollectionDetailsHeader } from "#src/hooks/layout/use-collection-details-header";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

export const DetailsNotFound: FC = () => {
  const navigate = useNavigate();
  const { detailsLayoutProps } = useDetailsLayout();
  const headerConfig = useCollectionDetailsHeader({
    onDeleteClick: () => {},
  });
  const { t } = useTranslation("collection-details");

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel={false}>
      <DetailsLayout.Header pageTitle={t("notFound.title")} {...headerConfig} />
      <DetailsLayout.Content>
        <ErrorFallback
          className="mx-auto"
          title={t("notFound.title")}
          subtitle=""
          description={t("notFound.description")}
          actionProps={{
            label: t("notFound.backToCollections"),
            onClick: () => navigate(`/${URLS.COLLECTION}`),
          }}
        />
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};
