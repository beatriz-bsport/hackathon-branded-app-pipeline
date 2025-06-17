import { useEffect, useRef, useState } from "react";
import EmailEditor, {
  type Editor,
  type EditorRef,
  type EmailEditorProps,
} from "react-email-editor";

import {
  Body,
  DetailsLayout,
  Select,
  TextField,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { EmailTemplateCategory } from "@bsport/store-cdp-email-template";

import { RenameEmailTemplateModal } from "#src/components/TemplateDetails/Modal/RenameEmailTemplate";
import { useUnlayerInitialization } from "#src/hooks/actions/useUnlayerInitialization";
import { useDetailPageHeader } from "#src/hooks/layout/useDetailPageHeader";
import { UNLAYER_PROJECT_ID } from "#src/utils/constants";
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
  const emailEditorRef = useRef<EditorRef>(null);
  const [openTitleRenameModal, setOpenTitleRenameModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(
    t("templateCategory.noCategory"),
  );
  const { toggleHasUnsavedChanges } = useDetailsLayout();

  const { unlayerUserId, currentLocale, companyName } =
    useUnlayerInitialization();
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

  const onReady: EmailEditorProps["onReady"] = (unlayer: Editor) => {
    console.log("Email editor is ready", unlayer);
  };

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
            <Body htmlVariant="p">{t("templateCategory.label")}</Body>
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
          <EmailEditor
            ref={emailEditorRef}
            onReady={onReady}
            options={{
              features: {
                preview: true,
              },
              designTags: {
                business_name: companyName ?? "",
              },
              locale: currentLocale,
              projectId: UNLAYER_PROJECT_ID,
              user: unlayerUserId,
            }}
          />
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
