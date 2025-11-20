import { useEffect, useState } from "react";

import {
  List,
  NestedSortableList,
  type SortableListProps,
} from "@bsport/kaizen-primitive-core";
import type {
  EmailTemplateCategory,
  EmailTemplateSummary,
} from "@bsport/store-cdp-email-template";

import { AppLoader } from "#src/components/Common/AppLoader";
import { DeleteTemplateModal } from "#src/components/Common/Modals/DeleteTemplateModal";
import { DuplicateTemplateModal } from "#src/components/Common/Modals/DuplicateTemplateModal";
import { PreviewTemplateModal } from "#src/components/Common/Modals/PreviewTemplateModal";
import { SearchedTemplateList } from "#src/components/Common/SearchedTemplateList";
import { NoCategoryList } from "#src/components/CustomTemplate/NoCategoryList";
import { useCategoryOrdering } from "#src/hooks/actions/useCategoryOrdering";
import { useEmailTemplateOrdering } from "#src/hooks/actions/useEmailTemplateOrdering";
import { useListItemFactory } from "#src/hooks/layout/useListItemFactory";
import { useSortableListFactory } from "#src/hooks/layout/useSortableListFactory";
import { useTemplateNavigation } from "#src/hooks/useTemplateNavigation";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  searchInput: string;
  clearSearchInput: () => void;
  categoriesList: EmailTemplateCategory[];
  emailTemplateList: EmailTemplateSummary[];
  isCategoryListLoading: boolean;
  isEmailTemplateListLoading: boolean;
  fetchCategories: () => void;
  fetchEmailTemplates: () => void;
  handleEditCategory: (category: EmailTemplateCategory) => void;
  handleDeleteCategory: (category: EmailTemplateCategory) => void;
};

export const PageListContent: React.FC<Props> = ({
  searchInput,
  clearSearchInput,
  categoriesList,
  emailTemplateList,
  isCategoryListLoading,
  isEmailTemplateListLoading,
  fetchCategories,
  fetchEmailTemplates,
  handleEditCategory,
  handleDeleteCategory,
}: Props) => {
  const [currentInlineActions, setCurrentInlineActions] = useState<
    "duplicate" | "delete" | "preview" | null
  >(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplateSummary | null>(null);
  const { t } = useTranslation("list");
  const { reorderCategories } = useCategoryOrdering();
  const { reorderEmailTemplates } = useEmailTemplateOrdering();
  const { navigateToCreateTemplate } = useTemplateNavigation();

  const handlePreviewTemplate = (template: EmailTemplateSummary) => {
    setSelectedTemplate(template);
    setCurrentInlineActions("preview");
  };

  const handleDuplicateTemplate = (template: EmailTemplateSummary) => {
    setSelectedTemplate(template);
    setCurrentInlineActions("duplicate");
  };

  const handleDeleteTemplate = (template: EmailTemplateSummary) => {
    setSelectedTemplate(template);
    setCurrentInlineActions("delete");
  };

  const handleResetActions = () => {
    setCurrentInlineActions(null);
    setSelectedTemplate(null);
  };

  const onActionSuccess = () => {
    handleResetActions();
    fetchEmailTemplates();
  };

  const { getFormattedListItems, isMobile } = useListItemFactory({
    handlePreviewTemplate,
    handleDeleteTemplate,
    handleDuplicateTemplate,
  });
  const { getFormattedCategoryAsSortableList } = useSortableListFactory({
    handleDeleteCategory,
    handleEditCategory,
    getFormattedListItems,
  });

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!searchInput?.trim()) {
      fetchEmailTemplates();
    }
  }, [searchInput, fetchEmailTemplates]);

  if (isEmailTemplateListLoading || isCategoryListLoading) {
    return <AppLoader />;
  }

  if (categoriesList.length === 0 && emailTemplateList.length === 0) {
    const baseListEmptyState = {
      isEmpty: true,
      emptyConfig: {
        title: t("templateList.emptyPage.custom.title"),
        subtitle: t("templateList.emptyPage.custom.description"),
        variant: "empty-state",
        ctaButtonConfig: {
          iconLeft: "plus",
          label: t("activeList.actions.addTemplate"),
          onClick: navigateToCreateTemplate,
        },
        secondaryButtonConfig: {
          iconLeft: "plus",
          label: t("activeList.actions.addCategory"),
          onClick: handleEditCategory,
        },
      },
    };
    return (
      <div className="flex flex-col w-full self-center">
        <List
          id="custom-email-template-list-empty-emails-and-category"
          emptyStateProps={baseListEmptyState}
        />
      </div>
    );
  }

  /*
   * @debt(1,1,1): We do not have a proper sorting, ordering mechanism in place yet in the backend.
   * This is a temporary solution to sort the email templates categories based on their category_ordering property.
   * The sorting/ordering should always be handled by the backend. Please try to not reproduce this logic if possible.
   * Debt ticket : https://linear.app/bsport/issue/CDP-641/debt-add-backend-orderingsorting-on-email-template-categories
   *
   * Also normally we should be implementing a pinning mechanism for categories that should solve that (as the ordering
   * of the pinned items should also be done in the backend directly)
   */
  const getFormattedSortableList = (): SortableListProps[] => {
    return [...categoriesList]
      .sort((a, b) => a.category_ordering - b.category_ordering)
      .map((category) => {
        return getFormattedCategoryAsSortableList({
          category,
          emailTemplateList,
        });
      });
  };

  if (searchInput?.trim()) {
    return (
      <SearchedTemplateList
        searchInput={searchInput}
        modelToFetch="custom"
        resetSearch={clearSearchInput}
        resetTemplateList={fetchEmailTemplates}
      />
    );
  }

  const sortableLists: SortableListProps[] = getFormattedSortableList();

  return (
    <>
      <div className="flex flex-col w-full">
        <NestedSortableList
          key={`custom-email-template-nested-${isMobile}`}
          id="custom-email-template-nested-sortable-list"
          onSortChildren={({ reorderedChildren }) => {
            reorderEmailTemplates(reorderedChildren);
          }}
          onSortParents={(categoryList: SortableListProps[]) => {
            reorderCategories(categoryList);
          }}
          sortableLists={sortableLists}
        />
        <NoCategoryList
          emailTemplateList={emailTemplateList}
          handlePreviewTemplate={handlePreviewTemplate}
          handleDuplicateTemplate={handleDuplicateTemplate}
          handleDeleteTemplate={handleDeleteTemplate}
        />
      </div>
      {currentInlineActions === "duplicate" && selectedTemplate ? (
        <DuplicateTemplateModal
          isOpen
          templateId={selectedTemplate.id}
          onClose={handleResetActions}
          onSuccess={onActionSuccess}
        />
      ) : null}
      {currentInlineActions === "delete" && selectedTemplate ? (
        <DeleteTemplateModal
          isOpen
          templateId={selectedTemplate.id}
          onClose={handleResetActions}
          onSuccess={onActionSuccess}
        />
      ) : null}
      {currentInlineActions === "preview" && selectedTemplate ? (
        <PreviewTemplateModal
          isOpen
          templateSummary={selectedTemplate}
          onClose={handleResetActions}
          onDuplicateSuccess={onActionSuccess}
        />
      ) : null}
    </>
  );
};
