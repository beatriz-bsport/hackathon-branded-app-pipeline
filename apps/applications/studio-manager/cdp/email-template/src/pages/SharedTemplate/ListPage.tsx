import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

import { ListLayout } from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { SearchedTemplateList } from "#src/components/Common/SearchedTemplateList";
import { BsportTemplateInformation } from "#src/components/SharedTemplate/BsportTemplateInformation";
import { SharedEmailTemplateList } from "#src/components/SharedTemplate/PageListContent";
import { usePageHeader } from "#src/hooks/layout/usePageHeader";
import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";
import type { PossibleSharedEmailTemplateType } from "#src/utils/types";

const SharedListPage: React.FC = () => {
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const isFranchisee = companyTheme && !!companyTheme.franchisor;
  const { pathname } = useLocation();
  const navigate = useNavigate();
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
    if (companyTheme && !isFranchisee && activeTab !== "bsport") {
      navigate(`../${ROUTES.BSPORT_TEMPLATES}`);
    }
  }, [companyTheme, isFranchisee, activeTab, navigate]);

  useEffect(() => {
    console.log("pathname", pathname);
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
      <ListLayout.Content key={activeTab}>
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
