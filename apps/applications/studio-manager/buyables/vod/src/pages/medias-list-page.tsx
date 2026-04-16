import type { FC } from "react";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { useBuildPageTabs } from "#src/hooks/layout/use-build-page-tabs";
import { useTranslation } from "#src/utils/i18n";

const MediasListPage: FC = () => {
  const { t } = useTranslation();

  const pageTabs = useBuildPageTabs();

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pageTitle", { ns: "shared-list" })}
        pageTabs={pageTabs}
      />
      <ListLayout.Content>
        <p>Medias list page</p>
      </ListLayout.Content>
    </ListLayout>
  );
};

export default MediasListPage;
