import { useEffect, useState } from "react";

import {
  Body,
  DetailsLayout,
  Select,
  TextField,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { EmailTemplateCategory } from "@bsport/store-cdp-email-template";

import { RenameEmailTemplateModal } from "#src/components/TemplateDetails/Modal/RenameEmailTemplate";
import { useDetailPageHeader } from "#src/hooks/layout/useDetailPageHeader";
import { useTranslation } from "#src/utils/i18n";
import {
  formatCategoriesForSelector,
  getSelectedCategoryId,
} from "#src/utils/selectorFormatter";

const FAKE_CATEGORIES: EmailTemplateCategory[] = [
  {
    id: 1,
    name: "No category",
    company: 2,
    category_ordering: 1,
  },
  {
    id: 2,
    name: "Catégorie de test",
    company: 2,
    category_ordering: 1,
  },
  {
    id: 3,
    name: "Ichizen test",
    company: 2,
    category_ordering: 1,
  },
  {
    id: 4,
    name: "test 4",
    company: 2,
    category_ordering: 1,
  },
  {
    id: 5,
    name: "kaizen test 5",
    company: 2,
    category_ordering: 1,
  },
  {
    id: 6,
    name: "Another category",
    company: 2,
    category_ordering: 1,
  },
  {
    id: 7,
    name: "Never stops",
    company: 2,
    category_ordering: 1,
  },
];

const EmailTemplateEditor = () => {
  const { t } = useTranslation(["list", "detail"]);
  const [openTitleRenameModal, setOpenTitleRenameModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("Email template to edit");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    t("templateCategory.noCategory"),
  );
  const { breadcrumbsItems, endGroupActions } = useDetailPageHeader({
    onDeleteTemplate: () => alert("Delete template clicked"),
    onDuplicateTemplate: () => alert("Duplicate template clicked"),
    onSaveTemplate: () => {
      alert("Save template clicked");
      toggleHasUnsavedChanges(false);
      console.log("Template saved with title:", title);
      console.log("Template subject:", subject);
      console.log(
        "Selected category ID:",
        getSelectedCategoryId(FAKE_CATEGORIES, selectedCategory),
      );
    },
  });
  const { toggleHasUnsavedChanges } = useDetailsLayout();

  const handleChangeTemplateTitle = () => {
    setOpenTitleRenameModal(true);
  };

  const handleCloseTemplateTitleModal = () => {
    setOpenTitleRenameModal(false);
  };

  useEffect(() => {
    if (!selectedCategory) {
      setSelectedCategory(t("templateCategory.noCategory"));
    }
  }, [selectedCategory, setSelectedCategory, t]);

  return (
    <DetailsLayout>
      <DetailsLayout.Header
        pageTitle={title}
        onEditTitleClick={handleChangeTemplateTitle}
        breadcrumbsItems={breadcrumbsItems}
        endGroupActions={endGroupActions}
      />
      <DetailsLayout.Confirmation />
      <DetailsLayout.Content>
        <div className="flex flex-col gap-md">
          <TextField
            fullWidth
            id="create-email-template-subject-input"
            type="text"
            label={t("templateSubject.label")}
            placeholder={t("templateSubject.placeholder")}
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            onClear={() => setSubject("")}
            required
          />
          <div id="category-selector-input">
            <Body htmlVariant="p">Category</Body>
            <Select
              fullWidth
              id="category-selector"
              size="md"
              status="default"
              defaultValue={t("templateCategory.noCategory")}
              label={t("activeList.createTemplateModal.textInput.label")}
              items={formatCategoriesForSelector(FAKE_CATEGORIES)}
              value={selectedCategory}
              popoverPlacement="bottom-left"
              onSelect={(option) => {
                setSelectedCategory(option);
                console.log("Selected option:", option);
              }}
            />
          </div>
        </div>
      </DetailsLayout.Content>
      {openTitleRenameModal ? (
        <RenameEmailTemplateModal
          templateDraft={null}
          isOpen={openTitleRenameModal}
          onClose={handleCloseTemplateTitleModal}
          setTitle={setTitle}
        />
      ) : null}
    </DetailsLayout>
  );
};
export default EmailTemplateEditor;
