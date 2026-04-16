import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { CollectionTable } from "#src/components/collection-table/collection-table";
import { useCollectionsQuery } from "#src/hooks/api/use-collections-query";
import { useBuildPageTabs } from "#src/hooks/layout/use-build-page-tabs";
import { useTranslation } from "#src/utils/i18n";

const CollectionsListPage: FC = () => {
  const { t } = useTranslation();
  const { collections, isLoading, isEmpty, paginationProps } =
    useCollectionsQuery();

  const pageTabs = useBuildPageTabs();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pageTitle", { ns: "shared-list" })}
        pageTabs={pageTabs}
      />
      <ListLayout.Content>
        <CollectionTable
          collections={collections}
          paginationProps={paginationProps}
          isEmpty={isEmpty}
          isLoading={isLoading}
        />
      </ListLayout.Content>
    </ListLayout>
  );
};

export default CollectionsListPage;
