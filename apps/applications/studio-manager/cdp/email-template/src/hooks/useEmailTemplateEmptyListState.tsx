import type { UseEmptyStateProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

import { useTemplateNavigation } from "./useTemplateNavigation";

export type UseEmptyListHooksParams = {
  isEmptyList: boolean;
  handleAddCategory: () => void;
};

export type UseEmptyListReturnType = {
  emptyStateConfig: UseEmptyStateProps;
};

export const useEmailTemplateEmptyListState = ({
  isEmptyList,
  handleAddCategory,
}: UseEmptyListHooksParams): UseEmptyListReturnType => {
  const { navigateToCreateTemplate } = useTemplateNavigation();
  const { t } = useTranslation("list");
  const baseEmptyState = {
    isEmpty: isEmptyList,
    emptyConfig: {
      title: t("templateList.emptyPage.title"),
      subtitle: t("templateList.emptyPage.description"),
      variant: "empty-state",
      ctaButtonConfig: {
        iconLeft: "plus",
        label: t("activeList.actions.addTemplate"),
        onClick: navigateToCreateTemplate,
      },
      secondaryButtonConfig: {
        iconLeft: "plus",
        label: t("activeList.actions.addCategory"),
        onClick: () => {
          handleAddCategory();
        },
      },
    },
  };

  return {
    emptyStateConfig: baseEmptyState,
  };
};
