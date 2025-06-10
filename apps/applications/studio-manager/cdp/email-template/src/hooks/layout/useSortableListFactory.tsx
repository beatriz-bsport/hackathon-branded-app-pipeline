import type {
  ActionButton,
  Sortable,
  SortableListProps,
  UseEmptyStateProps,
} from "@bsport/kaizen-primitive-core";
import type {
  EmailTemplateCategory,
  EmailTemplateSummary,
} from "@bsport/store-cdp-email-template";

import { BASE_NUMBER_PRIMARY_ACTIONS_CATEGORY } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

type UseListItemFactoryParams = {
  handleEditCategory?: (category: EmailTemplateCategory) => void;
  handleDeleteCategory?: (category: EmailTemplateCategory) => void;
  getFormattedListItems: ({
    categoryId,
    emailTemplateList,
  }: {
    categoryId?: number | null;
    emailTemplateList: EmailTemplateSummary[];
  }) => Sortable[];
};

type UseListItemFactoryReturn = {
  getFormattedCategoryAsSortableList: ({
    category,
    emailTemplateList,
  }: {
    category: EmailTemplateCategory | null;
    emailTemplateList: EmailTemplateSummary[];
  }) => SortableListProps;
};

export const useSortableListFactory = ({
  getFormattedListItems,
  handleEditCategory,
  handleDeleteCategory,
}: UseListItemFactoryParams): UseListItemFactoryReturn => {
  const { t } = useTranslation("list");

  const getRenameActionConfig = ({
    category,
  }: {
    category: EmailTemplateCategory;
  }) => {
    return category && handleEditCategory
      ? {
          id: `email-template-preview-${category.id}`,
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "pencil-02",
          label: t("activeList.actions.rename"),
          onClick: () => handleEditCategory?.(category),
        }
      : null;
  };

  const getDeleteActionConfig = ({
    category,
  }: {
    category: EmailTemplateCategory;
  }) => {
    return category && handleDeleteCategory
      ? {
          id: `email-template-delete-${category.id}`,
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "trash-01",
          onClick: () => handleDeleteCategory?.(category),
          label: t("activeList.actions.delete"),
        }
      : null;
  };

  const getActionByCategoryType = ({
    category,
  }: {
    category: EmailTemplateCategory | null;
  }): ActionButton[] => {
    if (category === null) {
      return [];
    }
    return [
      getRenameActionConfig({ category }),
      getDeleteActionConfig({ category }),
    ].filter(Boolean) as ActionButton[];
  };

  const getCategoryListHeader = ({
    category,
    numberOfTemplates,
  }: {
    category: EmailTemplateCategory | null;
    numberOfTemplates: number;
  }): SortableListProps["header"] => {
    const categoryId = category?.id ?? "no-category";
    const categoryTitle = category
      ? `${category.name} (${numberOfTemplates})`
      : t("templateList.noCategory", {
          emailTemplateCount: numberOfTemplates,
        });
    return {
      id: `email-template-list-header-${categoryId}`,
      title: categoryTitle,
      dropdownConfig: {
        visibleActionsDisplayLimit: BASE_NUMBER_PRIMARY_ACTIONS_CATEGORY,
      },
      buttons: getActionByCategoryType({ category }),
    };
  };
  const getEmptyStateConfig = (isEmpty: boolean): UseEmptyStateProps => {
    return {
      isEmpty,
      emptyConfig: {
        title: t("templateList.emptyPage.title"),
        subtitle: t("templateList.emptyPage.description"),
        variant: "empty-state",
      },
    };
  };

  const getFormattedCategoryAsSortableList = ({
    category,
    emailTemplateList,
  }: {
    category: EmailTemplateCategory | null;
    emailTemplateList: EmailTemplateSummary[];
  }): SortableListProps => {
    const categoryId = category?.id;
    const categoryItems = getFormattedListItems({
      categoryId,
      emailTemplateList,
    });
    const numberOfTemplates = categoryItems.length ?? 0;
    const isEmptyCategory = numberOfTemplates <= 0;
    return {
      id: `custom-email-template-list-${categoryId ?? "no-category"}`,
      header: getCategoryListHeader({
        category,
        numberOfTemplates,
      }),
      items: categoryItems,
      collapsibleProps: { initiallyOpen: true },
      emptyStateProps: getEmptyStateConfig(isEmptyCategory),
      onSortChange: () => {},
    };
  };

  return { getFormattedCategoryAsSortableList };
};
