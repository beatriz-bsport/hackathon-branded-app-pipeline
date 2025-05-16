import type { UseEmptyStateProps } from "@bsport/kaizen-primitive-core";

import { useTranslation } from "#src/utils/i18n";

export type UseEmptyListHooksParams = {
  isEmptyList: boolean;
  handleAddTemplate: () => void;
  handleAddCategory: () => void;
};

export type UseEmptyListReturnType = {
  emptyStateConfig: UseEmptyStateProps;
};

const useEmailTemplateEmptyListState = ({
  isEmptyList,
  handleAddTemplate,
  handleAddCategory,
}: UseEmptyListHooksParams): UseEmptyListReturnType => {
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
        onClick: () => {
          handleAddTemplate();
        },
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

export default useEmailTemplateEmptyListState;
