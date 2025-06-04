import { useEffect, useState } from "react";

import {
  List,
  type Sortable,
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
import { NestedSortableList } from "#src/components/CustomTemplate/NestedSortableList";
import { NoCategoryList } from "#src/components/CustomTemplate/NoCategoryList";
import { useCategoryOrdering } from "#src/hooks/actions/useCategoryOrdering";
import { useEmailTemplateOrdering } from "#src/hooks/actions/useEmailTemplateOrdering";
import { useFetchAllEmailTemplates } from "#src/hooks/fetch/useFetchAllTemplatesList";
import { useListItemFactory } from "#src/hooks/layout/useListItemFactory";
import { useSortableListFactory } from "#src/hooks/layout/useSortableListFactory";
import { useTemplateNavigation } from "#src/hooks/useTemplateNavigation";
import { useTranslation } from "#src/utils/i18n";

type Props = {
  searchInput: string;
  clearSearchInput: () => void;
  categoriesList: EmailTemplateCategory[];
  isCategoryListLoading: boolean;
  fetchCategories: () => void;
  handleEditCategory: (category: EmailTemplateCategory) => void;
  handleDeleteCategory: (category: EmailTemplateCategory) => void;
};

export const PageListContent: React.FC<Props> = ({
  searchInput,
  clearSearchInput,
  categoriesList,
  isCategoryListLoading,
  fetchCategories,
  handleEditCategory,
  handleDeleteCategory,
}: Props) => {
  const [currentInlineActions, setCurrentInlineActions] = useState<
    "duplicate" | "delete" | "preview" | null
  >(null);
  const [selectedTemplate, setSelectedTemplate] =
    useState<EmailTemplateSummary | null>(null);
  const { t } = useTranslation("list");
  const {
    emailTemplateList,
    isLoading: isEmailTemplatesListLoading,
    fetchAllEmailTemplates,
  } = useFetchAllEmailTemplates();
  const { reorderCategories } = useCategoryOrdering();
  const { reorderEmailTemplates } = useEmailTemplateOrdering({
    onSuccess: () => console.log("Templates reordered successfully"),
  });
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
    fetchAllEmailTemplates();
  };

  const { getFormattedListItems } = useListItemFactory({
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
    fetchAllEmailTemplates();
  }, [fetchAllEmailTemplates]);

  if (isEmailTemplatesListLoading || isCategoryListLoading) {
    return <AppLoader />;
  }

  if (categoriesList.length === 0 && emailTemplateList.length === 0) {
    const baseListEmptyState = {
      isEmpty: true,
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

  if (searchInput) {
    return (
      <SearchedTemplateList
        searchInput={searchInput}
        modelToFetch="custom"
        resetSearch={clearSearchInput}
        resetTemplateList={fetchAllEmailTemplates}
      />
    );
  }

  const sortableLists: SortableListProps[] = getFormattedSortableList();

  return (
    <>
      <div className="flex flex-col w-full">
        <NestedSortableList
          onSortChildren={(templateList: Sortable[]) => {
            reorderEmailTemplates(templateList);
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
          templateId={selectedTemplate.id}
          onClose={handleResetActions}
        />
      ) : null}
    </>
  );
};
