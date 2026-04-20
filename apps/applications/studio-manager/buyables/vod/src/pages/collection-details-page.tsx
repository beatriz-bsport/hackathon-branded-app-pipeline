import type { FC } from "react";
import { useParams } from "react-router";

import { DetailsLayout, useDetailsLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary";
import { useCollectionQuery } from "#src/hooks/api/use-collection-query";
import { useCollectionDetailsHeader } from "#src/hooks/layout/use-collection-details-header";
import { useTranslation } from "#src/utils/i18n";

const CollectionDetailsPageInner: FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  const id = Number(collectionId);

  if (!Number.isInteger(id)) {
    throw new Error("Expected collection id param to be a valid number");
  }

  const { detailsLayoutProps } = useDetailsLayout();
  const headerConfig = useCollectionDetailsHeader();
  const { t } = useTranslation("collections-list");
  const { data } = useCollectionQuery(id);

  return (
    <DetailsLayout {...detailsLayoutProps} withPanel={false}>
      <DetailsLayout.Header pageTitle={data.name} {...headerConfig} />
      <DetailsLayout.Content>
        <div className="flex h-full items-center justify-center px-lg py-xl">
          {t("details.placeholder")}
        </div>
      </DetailsLayout.Content>
    </DetailsLayout>
  );
};

const CollectionDetailsPage: FC = () => {
  return (
    <QueryBoundary>
      <CollectionDetailsPageInner />
    </QueryBoundary>
  );
};

export default CollectionDetailsPage;
