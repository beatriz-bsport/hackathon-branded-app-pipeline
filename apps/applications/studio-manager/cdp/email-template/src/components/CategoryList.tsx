import {
  List,
  type ListHeaderProps,
  type ListItemProps,
} from "@bsport/kaizen-primitive-core";

import type { EmailTemplateCategory } from "#src/pages/EmailTemplateSummaryPage";
import { BASE_NUMBER_PRIMARY_ACTIONS_CATEGORY } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

export type CategoryListProps = {
  category: EmailTemplateCategory;
  emailTemplateList: ListItemProps[];
  handleEditcategory: (category: EmailTemplateCategory) => void;
  handleDeleteCategory: (category: EmailTemplateCategory) => void;
};

const CategoryList: React.FC<CategoryListProps> = ({
  category,
  emailTemplateList,
  handleEditcategory,
  handleDeleteCategory,
}: CategoryListProps) => {
  const { t } = useTranslation("list");
  const { id: categoryId } = category;
  const listHeader: ListHeaderProps = {
    id: `email-template-list-header-${categoryId}`,
    title: `${category.name} (${emailTemplateList.length || 0})`,
    dropdownConfig: {
      visibleActionsDisplayLimit: BASE_NUMBER_PRIMARY_ACTIONS_CATEGORY,
    },
    buttons: [
      {
        id: `category-rename-action-${categoryId}`,
        label: t("activeList.actions.rename"),
        intent: "flat",
        color: "default",
        size: "md",
        iconLeft: "edit-02",
        onClick: () => handleEditcategory(category),
      },
      {
        id: `category-pin-action-${categoryId}`,
        label: t("activeList.actions.pinToTop"),
        intent: "flat",
        color: "default",
        size: "md",
        iconLeft: "pin-02",
        onClick: () => handleEditcategory(category),
      },
      {
        id: `category-delete-action-${categoryId}`,
        label: t("activeList.actions.delete"),
        intent: "flat",
        color: "default",
        size: "md",
        iconLeft: "trash-01",
        onClick: () => handleDeleteCategory(category),
      },
    ],
  };
  const emptyState = {
    isEmpty: emailTemplateList.length === 0,
    emptyConfig: {
      title: t("templateList.emptyPage.title"),
      subtitle: t("templateList.emptyPage.description"),
      variant: "empty-state",
    },
  };
  return (
    <List
      id={`custom-email-template-list-${categoryId}`}
      key={categoryId}
      header={listHeader}
      collapsibleProps={{ initiallyOpen: true }}
      items={emailTemplateList}
      emptyStateProps={emptyState}
    />
  );
};

export default CategoryList;
