import { NavLink } from "react-router";

import {
  type ExpandableSearchInputProps,
  Tabs,
  type TabsProps,
} from "@bsport/kaizen-primitive-core";

import { ROUTES } from "#src/urls";
import { useTranslation } from "#src/utils/i18n";

import { usePageFilter } from "../usePageFilter";

type HookReturn = {
  tabsConfig: TabsProps;
  searchConfig: ExpandableSearchInputProps;
  searchInput: string;
  clearSearchInput: () => void;
};

export const usePageHeader = (): HookReturn => {
  const { t } = useTranslation("list");
  const { searchInput, setSearchInput, clearSearchInput } = usePageFilter();

  const TABS_CONFIG = [
    {
      id: "default",
      href: ROUTES.CUSTOM_TEMPLATES,
      label: t("tabs.customTemplates"),
    },
    {
      id: "master",
      href: ROUTES.MASTER_TEMPLATES,
      label: t("tabs.masterTemplates"),
    },
    {
      id: "bsport",
      href: ROUTES.BSPORT_TEMPLATES,
      label: t("tabs.bsportTemplates"),
    },
  ];
  const emailTemplateTabsConfig: TabsProps = {
    TabsItems: TABS_CONFIG.map((tab) => (
      <NavLink to={`/email-template/${tab.href}`} id={tab.id} key={tab.id}>
        {({ isActive }) => <Tabs.Item {...tab} isActive={isActive} />}
      </NavLink>
    )),
    orientation: "horizontal",
  };

  const emailTemplateSearchConfig: ExpandableSearchInputProps = {
    id: "email-template-page-search",
    inputValue: searchInput,
    onInputValueChange: setSearchInput,
    onClear: clearSearchInput,
  };

  return {
    tabsConfig: emailTemplateTabsConfig,
    searchConfig: emailTemplateSearchConfig,
    searchInput,
    clearSearchInput,
  };
};
