import { NavLink } from "react-router";

import {
  type ExpandableSearchInputWithTooltipProps,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";
import { dataAccessLayer } from "@bsport/sm-backbone";

import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { usePageFilter } from "../usePageFilter";

type HookReturn = {
  tabsConfig: TabsProps;
  searchConfig: ExpandableSearchInputWithTooltipProps;
  searchInput: string;
  clearSearchInput: () => void;
};

export const usePageHeader = (): HookReturn => {
  const { t } = useTranslation("list");
  const { searchInput, setSearchInput, clearSearchInput } = usePageFilter();
  const companyTheme = dataAccessLayer.useCompanyTheme();
  const isFranchisee = companyTheme && !!companyTheme.franchisor;

  const TABS_CONFIG = [
    {
      id: "default",
      href: ROUTES.CUSTOM_TEMPLATES,
      label: t("tabs.customTemplates"),
    },
    ...(isFranchisee
      ? [
          {
            id: "master",
            href: ROUTES.MASTER_TEMPLATES,
            label: t("tabs.masterTemplates"),
          },
        ]
      : []),
    {
      id: "bsport",
      href: ROUTES.BSPORT_TEMPLATES,
      label: t("tabs.bsportTemplates"),
    },
  ];

  const emailTemplateTabsConfig: TabsProps = {
    TabsItems: TABS_CONFIG.map((tab) => (
      <NavLink to={`../${tab.href}`} id={tab.id} key={tab.id}>
        {({ isActive }) => <Tabs.Item {...tab} isActive={isActive} />}
      </NavLink>
    )),
    orientation: "horizontal",
  };

  const emailTemplateSearchConfig: ExpandableSearchInputWithTooltipProps = {
    id: "email-template-page-search",
    inputValue: searchInput,
    onInputValueChange: setSearchInput,
    onClear: clearSearchInput,
    tooltipConfig: {
      placement: "bottom-right",
      label: t("search.tooltip"),
    },
  };

  return {
    tabsConfig: emailTemplateTabsConfig,
    searchConfig: emailTemplateSearchConfig,
    searchInput,
    clearSearchInput,
  };
};
