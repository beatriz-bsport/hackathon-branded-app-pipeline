import {
  List,
  type ListHeaderProps,
  type ListItemProps,
} from "@bsport/kaizen-primitive-core";

import useEmailTemplateEmptyListState from "#src/hooks/useEmailTemplateEmptyListState";
import type {
  EmailTemplate,
  EmailTemplateCategory,
} from "#src/pages/EmailTemplateSummaryPage";
import { BASE_NUMBER_PRIMARY_ACTIONS_CATEGORY } from "#src/utils/constants";
import { useTranslation } from "#src/utils/i18n";

import CategoryList from "./CategoryList";

type Props = {
  emailTemplateList: EmailTemplate[];
  categoryList: EmailTemplateCategory[];
  handleAddTemplate: () => void;
  handleAddCategory: () => void;
  handleDuplicateTemplate: (template: EmailTemplate) => void;
  handlePreviewTemplate: (template: EmailTemplate) => void;
  handleDeleteTemplate: (template: EmailTemplate) => void;
  handleEditcategory: (category: EmailTemplateCategory) => void;
  handleDeleteCategory: (category: EmailTemplateCategory) => void;
};

const CustomEmailTemplateList: React.FC<Props> = ({
  emailTemplateList,
  categoryList,
  handleAddCategory,
  handleAddTemplate,
  handleDeleteTemplate,
  handleDuplicateTemplate,
  handlePreviewTemplate,
  handleEditcategory,
  handleDeleteCategory,
}: Props) => {
  const { emptyStateConfig } = useEmailTemplateEmptyListState({
    isEmptyList: true,
    handleAddTemplate,
    handleAddCategory,
  });
  const { t } = useTranslation("list");
  const getEmailTemplateByCategory = ({
    categoryId,
  }: {
    categoryId: number | null;
  }): ListItemProps[] => {
    const filteredEmailTemplateList = emailTemplateList.filter(
      (_emailTemplate) => _emailTemplate.category === categoryId,
    );
    return filteredEmailTemplateList.map((emailTemplate) => ({
      id: `email-template-${emailTemplate.id}`,
      title: emailTemplate.title,
      description: emailTemplate.subject,
      buttons: [
        {
          id: `email-template-pin-action-${emailTemplate.id}`,
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "pin-02",
          onClick: () => {
            handlePreviewTemplate(emailTemplate);
          },
        },
        {
          id: `email-template-preview-action-${emailTemplate.id}`,
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "eye",
          onClick: () => {
            handlePreviewTemplate(emailTemplate);
          },
        },
        {
          id: `email-template-duplicate-action-${emailTemplate.id}`,
          label: t("activeList.actions.duplicate"),
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "copy-03",
          onClick: () => {
            handleDuplicateTemplate(emailTemplate);
          },
        },
        {
          id: `email-template-delete-action-${emailTemplate.id}`,
          label: t("activeList.actions.delete"),
          size: "md",
          intent: "flat",
          color: "default",
          iconLeft: "trash-01",
          onClick: () => {
            handleDeleteTemplate(emailTemplate);
          },
        },
      ],
    }));
  };

  const noCategoryEmailTemplateList = getEmailTemplateByCategory({
    categoryId: null,
  });

  const noCategoryListHeader: ListHeaderProps = {
    id: "email-template-list-header-no-category",
    title: t("templateList.noCategory", {
      emailTemplateCount: noCategoryEmailTemplateList.length || 0,
    }),
    dropdownConfig: {
      visibleActionsDisplayLimit: BASE_NUMBER_PRIMARY_ACTIONS_CATEGORY,
    },
    buttons: [
      {
        id: "category-collapse-action-no-category",
        intent: "flat",
        color: "default",
        size: "md",
        iconLeft: "chevron-down",
      },
    ],
  };

  const noCategoryEmptyState = {
    isEmpty: noCategoryEmailTemplateList.length === 0,
    emptyConfig: {
      title: t("templateList.emptyPage.title"),
      subtitle: t("templateList.emptyPage.description"),
      variant: "empty-state",
    },
  };

  if (categoryList.length === 0 && emailTemplateList.length === 0)
    return (
      <div className="flex flex-col w-full self-center">
        <List
          id="custom-email-template-list-empty-emails-and-category"
          emptyStateProps={emptyStateConfig}
        />
      </div>
    );

  return (
    <div className="flex flex-col w-full">
      {categoryList
        .filter((_category) => !!_category)
        .map((category) => (
          <CategoryList
            key={category.id}
            category={category}
            emailTemplateList={getEmailTemplateByCategory({
              categoryId: category.id,
            })}
            handleEditcategory={handleEditcategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        ))}
      {noCategoryEmailTemplateList?.length > 0 && (
        <List
          id="custom-email-template-list-no-category"
          header={noCategoryListHeader}
          collapsibleProps={{ initiallyOpen: true }}
          items={noCategoryEmailTemplateList}
          emptyStateProps={noCategoryEmptyState}
        />
      )}
    </div>
  );
};

export default CustomEmailTemplateList;
