import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";

import { ListLayout } from "@bsport/kaizen-primitive-core";

import { SearchedTemplateList } from "#src/components/Common/SearchedTemplateList";
import { BsportTemplateInformation } from "#src/components/SharedTemplate/BsportTemplateInformation";
import { SharedEmailTemplateList } from "#src/components/SharedTemplate/PageListContent";
import { usePageHeader } from "#src/hooks/layout/usePageHeader";
import { useTranslation } from "#src/utils/i18n";
import type { PossibleSharedEmailTemplateType } from "#src/utils/types";

const SharedListPage: React.FC = () => {
  const { pathname } = useLocation();
  const { searchConfig, searchInput, tabsConfig, clearSearchInput } =
    usePageHeader();
  const [activeTab, setActiveTab] = useState<PossibleSharedEmailTemplateType>(
    pathname.includes("bsport") ? "bsport" : "master",
  );
  const { t } = useTranslation("list");

  const layoutEndGroupActions =
    activeTab === "bsport"
      ? [<BsportTemplateInformation key="bsport-information-popover" />]
      : [];

  useEffect(() => {
    const tab = pathname.includes("bsport") ? "bsport" : "master";
    setActiveTab(tab);
  }, [pathname]);

  return (
    <ListLayout>
      <ListLayout.Header
        pageTitle={t("pages.active")}
        endGroupActions={layoutEndGroupActions}
        pageTabs={tabsConfig}
        searchConfig={searchConfig}
      />
      <ListLayout.Content>
        {searchInput ? (
          <SearchedTemplateList
            searchInput={searchInput}
            modelToFetch={activeTab}
            resetSearch={clearSearchInput}
          />
        ) : (
          <>
            <SharedEmailTemplateList
              model={activeTab}
              searchInput={searchInput}
            />
          </>
        )}
      </ListLayout.Content>
    </ListLayout>
  );
};

export default SharedListPage;
