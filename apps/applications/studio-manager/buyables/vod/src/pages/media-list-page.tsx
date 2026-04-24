import type { FC } from "react";
import { useNavigate } from "react-router";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary";
import { VideoTable } from "#src/components/video-table/video-table";
import { useCategoriesByIdQuery } from "#src/hooks/api/use-categories-by-id-query";
import { useVideosQuery } from "#src/hooks/api/use-videos-query";
import { useBuildPageTabs } from "#src/hooks/layout/use-build-page-tabs";
import { URLS } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

const MediaListPageContent: FC = () => {
  const navigate = useNavigate();
  const { videos, isEmpty, paginationProps } = useVideosQuery();
  const categoriesQuery = useCategoriesByIdQuery();
  const categoriesById = categoriesQuery.data ?? new Map<number, string>();

  return (
    <VideoTable
      videos={videos}
      categoriesById={categoriesById}
      paginationProps={paginationProps}
      isEmpty={isEmpty}
      onRowClick={(id) => navigate(URLS.MEDIA_DETAILS(id))}
    />
  );
};

const MediaListPage: FC = () => {
  const { t } = useTranslation("shared-list");
  const pageTabs = useBuildPageTabs();

  return (
    <ListLayout>
      <ListLayout.Header pageTitle={t("pageTitle")} pageTabs={pageTabs} />
      <ListLayout.Content>
        <QueryBoundary>
          <MediaListPageContent />
        </QueryBoundary>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default MediaListPage;
