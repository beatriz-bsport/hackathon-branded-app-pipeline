import React, { useState } from "react";

import { Button, ListLayout } from "@bsport/kaizen-primitive-core";
import type { EmailTemplateCategory } from "@bsport/store-cdp-email-template";

import { CreateEditCategoryModal } from "#src/components/Common/Modals/CreateEditCategoryModal";
import { DeleteCategoryModal } from "#src/components/Common/Modals/DeleteCategoryModal";
import { PageListContent } from "#src/components/CustomTemplate/PageListContent";
import { useFetchAllEmailTemplates } from "#src/hooks/fetch/useFetchAllTemplatesList";
import { useFetchCategoriesPaginatedList } from "#src/hooks/fetch/useFetchPaginatedCategoriesList";
import { usePageHeader } from "#src/hooks/layout/usePageHeader";
import { useTemplateNavigation } from "#src/hooks/useTemplateNavigation";
import { useTranslation } from "#src/utils/i18n";

const CustomListPage: React.FC = () => {
  const [currentInlineActions, setCurrentInlineActions] = React.useState<
    "create" | "edit" | "delete" | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<EmailTemplateCategory | null>(null);
  const { navigateToCreateTemplate } = useTemplateNavigation();
  const { t } = useTranslation("list");
  const { searchConfig, searchInput, tabsConfig, clearSearchInput } =
    usePageHeader();
  const {
    categoriesList,
    isLoading: isCategoryListLoading,
    fetchCategories,
  } = useFetchCategoriesPaginatedList();
  const {
    emailTemplateList,
    isLoading: isEmailTemplatesListLoading,
    fetchAllEmailTemplates,
  } = useFetchAllEmailTemplates();

  const handleCreateCategory = () => {
    setCurrentInlineActions("create");
    setSelectedCategory(null);
  };

  const handleEditCategory = (category: EmailTemplateCategory) => {
    setCurrentInlineActions("edit");
    setSelectedCategory(category);
  };

  const handleDeleteCategory = (category: EmailTemplateCategory) => {
    setCurrentInlineActions("delete");
    setSelectedCategory(category);
  };

  const handleCloseActions = () => {
    setCurrentInlineActions(null);
    setSelectedCategory(null);
  };

  const onActionSuccess = () => {
    handleCloseActions();
    fetchCategories();
    fetchAllEmailTemplates();
  };

  const { endGroupActions } = ListLayout.useAdaptiveActions({
    endGroupActions: [
      <Button
        key="create-category-cta-email-template-page"
        intent="default"
        color="main"
        size="md"
        iconLeft="plus"
        label={t("activeList.actions.addCategory")}
        onClick={handleCreateCategory}
      />,
      <Button
        key="create-template-cta-email-template-page"
        intent="call-to-action"
        color="main"
        size="md"
        iconLeft="plus"
        label={t("activeList.actions.addTemplate")}
        onClick={navigateToCreateTemplate}
      />,
    ],
  });

  return (
    <>
      <ListLayout>
        <ListLayout.Header
          pageTitle={t("pages.active")}
          endGroupActions={endGroupActions}
          pageTabs={tabsConfig}
          searchConfig={searchConfig}
        />
        <ListLayout.Content>
          <PageListContent
            searchInput={searchInput}
            clearSearchInput={clearSearchInput}
            categoriesList={categoriesList}
            emailTemplateList={emailTemplateList}
            isCategoryListLoading={isCategoryListLoading}
            isEmailTemplateListLoading={isEmailTemplatesListLoading}
            fetchCategories={fetchCategories}
            fetchEmailTemplates={fetchAllEmailTemplates}
            handleEditCategory={handleEditCategory}
            handleDeleteCategory={handleDeleteCategory}
          />
        </ListLayout.Content>
      </ListLayout>
      {currentInlineActions === "create" || currentInlineActions === "edit" ? (
        <CreateEditCategoryModal
          isOpen
          categoryDraft={selectedCategory}
          onClose={handleCloseActions}
          onSuccess={onActionSuccess}
        />
      ) : null}
      {currentInlineActions === "delete" && selectedCategory ? (
        <DeleteCategoryModal
          isOpen
          categoryId={selectedCategory.id}
          categoryName={selectedCategory.name}
          onClose={handleCloseActions}
          onSuccess={onActionSuccess}
        />
      ) : null}
    </>
  );
};

export default CustomListPage;
