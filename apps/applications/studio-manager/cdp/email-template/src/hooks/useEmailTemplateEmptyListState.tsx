import type { UseEmptyStateProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";
import { PossibleEmailTemplateType } from "#src/utils/types";

import { useTemplateNavigation } from "./useTemplateNavigation";

export type UseEmptyListHooksParams = {
  templateType: PossibleEmailTemplateType;
  isEmptyList: boolean;
  handleAddCategory?: () => void;
};

export type UseEmptyListReturnType = {
  emptyStateConfig: UseEmptyStateProps;
};

export const useEmailTemplateEmptyListState = ({
  templateType,
  isEmptyList,
  handleAddCategory,
}: UseEmptyListHooksParams): UseEmptyListReturnType => {
  const { navigateToCreateTemplate } = useTemplateNavigation();
  const { t } = useTranslation("list");

  const ctaConfigs = handleAddCategory
    ? {
        ctaButtonConfig: {
          iconLeft: "plus",
          label: t("activeList.actions.addTemplate"),
          onClick: navigateToCreateTemplate,
        },
        secondaryButtonConfig: {
          iconLeft: "plus",
          label: t("activeList.actions.addCategory"),
          onClick: () => {
            handleAddCategory?.();
          },
        },
      }
    : {};

  const emptyConfigCustomTemplates = {
    title: t("templateList.emptyPage.custom.title"),
    subtitle: t("templateList.emptyPage.custom.description"),
    variant: "empty-state",
  };

  const emptyConfigMasterTemplates = {
    title: t("templateList.emptyPage.bsport.title"),
    subtitle: t("templateList.emptyPage.bsport.description"),
    variant: "empty-state",
  };

  const emptyConfigBsportTemplates = {
    title: t("templateList.emptyPage.master.title"),
    subtitle: t("templateList.emptyPage.master.description"),
    variant: "empty-state",
  };

  const emptyConfigMap = {
    ["custom"]: emptyConfigCustomTemplates,
    ["master"]: emptyConfigMasterTemplates,
    ["bsport"]: emptyConfigBsportTemplates,
  };
  const baseEmptyState = {
    isEmpty: isEmptyList,
    emptyConfig: emptyConfigMap[templateType],
  };

  return {
    emptyStateConfig: { ...baseEmptyState, ...ctaConfigs },
  };
};
