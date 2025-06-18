import { useEffect, useMemo, useRef, useState } from "react";
import EmailEditor, {
  type Editor,
  type EditorRef,
  type EmailEditorProps,
} from "react-email-editor";

import { DetailsLayout, toast } from "@bsport/kaizen-primitive-core";
import type {
  EmailTemplateCategory,
  EmailTemplateDetail,
} from "@bsport/store-cdp-email-template";

import { EmailEditorForm } from "#src/components/TemplateDetails/EmailEditorForm";
import { RenameEmailTemplateModal } from "#src/components/TemplateDetails/Modal/RenameEmailTemplate";
import { SaveEmailTemplateParams } from "#src/hooks/actions/useSaveTemplate";
import { useUnlayerBuilder } from "#src/hooks/actions/useUnlayerBuilder";
import { useUnlayerInitialization } from "#src/hooks/actions/useUnlayerInitialization";
import { useEmailTemplateForm } from "#src/hooks/forms/use-email-template-form";
import { useDetailPageHeader } from "#src/hooks/layout/useDetailPageHeader";
import {
  UNLAYER_EDITOR_MIN_HEIGHT,
  UNLAYER_PROJECT_ID,
} from "#src/utils/constants";
import { createDownloadableUrlObject } from "#src/utils/emailEditor";
import { useTranslation } from "#src/utils/i18n";
import {
  formatCategoriesForSelector,
  getSelectedCategoryId,
} from "#src/utils/selectorFormatter";

type Props = {
  emailTemplateDetail: EmailTemplateDetail | null;
  categoriesList: EmailTemplateCategory[];
  toggleHasUnsavedChanges: (hasChanges: boolean) => void;
  saveTemplate: (formData: SaveEmailTemplateParams) => void;
};

export const PageListContent: React.FC<Props> = ({
  emailTemplateDetail,
  categoriesList,
  toggleHasUnsavedChanges,
  saveTemplate,
}: Props) => {
  const [pageTitle, setPageTitle] = useState(emailTemplateDetail?.title || "");
  const [openTitleRenameModal, setOpenTitleRenameModal] = useState(false);
  const { t } = useTranslation(["list", "detail"]);
  const emailEditorRef = useRef<EditorRef>(null);
  const { unlayerUser, currentLocale, companyName, companyId } =
    useUnlayerInitialization();
  const { exportEmailBuilderTemplate, initializeUnlayerBuilder } =
    useUnlayerBuilder();
  const formattedCategories = [
    ...formatCategoriesForSelector(categoriesList),
    {
      id: "no-category",
      label: t("templateCategory.noCategory"),
      value: t("templateCategory.noCategory"),
    },
  ];

  const handleExportClick = () => {
    if (!emailEditorRef.current) return;
    emailEditorRef.current?.editor?.exportHtml(({ html }) => {
      const url = createDownloadableUrlObject(
        new Blob([html], { type: "text/html;charset=utf-8" }),
      );
      if (!url) return;

      const tempEl = document.createElement("a");
      const safeTitle =
        pageTitle.trim().replace(/[^\w\-.]+/g, "_") || "template";

      tempEl.href = url;
      tempEl.download = `${safeTitle}.html`;
      tempEl.click();

      setTimeout(() => {
        (window.URL || window.webkitURL).revokeObjectURL(url);
      }, 0);
    });
  };

  const initialData = useMemo(
    () => ({
      title: emailTemplateDetail?.title || "",
      subject: emailTemplateDetail?.subject || "",
      category:
        categoriesList.find(
          (category) => category.id === emailTemplateDetail?.category,
        )?.name || t("templateCategory.noCategory"),
      stringifiedDesign: emailTemplateDetail?.design || null,
    }),
    [emailTemplateDetail, categoriesList, t],
  );
  const {
    formData,
    errors,
    handleChange,
    handleBlur,
    hasChanges,
    resetForm,
    validateForm,
  } = useEmailTemplateForm({
    initialData,
  });
  const { breadcrumbsItems, endGroupActions } = useDetailPageHeader({
    onExportTemplate: handleExportClick,
    onDeleteTemplate: () => toggleHasUnsavedChanges(true),
    onDuplicateTemplate: () => toggleHasUnsavedChanges(false),
  });

  const handleCancelTitleRename = () => {
    setPageTitle(emailTemplateDetail?.title || "");
    handleChange("title", emailTemplateDetail?.title || "");
  };

  const handleDesignUpdated = async () => {
    const emailBuilderRef = emailEditorRef?.current?.editor;
    if (emailBuilderRef) {
      const data = await exportEmailBuilderTemplate({
        emailBuilderRef,
      });
      handleChange("stringifiedDesign", data?.design ?? null);
    }
  };

  const onReady: EmailEditorProps["onReady"] = (unlayer: Editor) => {
    if (emailTemplateDetail?.design) {
      initializeUnlayerBuilder({
        emailBuilderRef: unlayer,
        initialDesign: emailTemplateDetail.design,
      });
    }
    unlayer.addEventListener("design:updated", handleDesignUpdated);
  };

  const onResetTemplate = () => {
    const emailBuilderRef = emailEditorRef?.current?.editor;
    const initialDesign = emailTemplateDetail?.design || null;
    if (emailBuilderRef) {
      initializeUnlayerBuilder({ emailBuilderRef, initialDesign });
      resetForm();
      setPageTitle(emailTemplateDetail?.title || "");
    }
  };

  const onValidate = async () => {
    const emailBuilderRef = emailEditorRef?.current?.editor;
    if (emailBuilderRef) {
      const data = await exportEmailBuilderTemplate({
        emailBuilderRef,
      });
      const isValid = validateForm();
      if (isValid && data?.design) {
        const templateData = {
          title: formData.title,
          subject: formData.subject,
          category: getSelectedCategoryId(categoriesList, formData.category),
          html: data.html,
          design: data.design,
          company_id: companyId ?? null,
        };
        saveTemplate(templateData);
      } else {
        toast({
          status: "critical",
          icon: "alert-circle",
          title: t("saveTemplateAction.error.missingFields"),
          buttonIcon: "x-close",
        });
      }
    }
  };

  useEffect(() => {
    if (!openTitleRenameModal && hasChanges(initialData)) {
      toggleHasUnsavedChanges(true);
    } else {
      toggleHasUnsavedChanges(false);
    }
  }, [
    openTitleRenameModal,
    initialData,
    hasChanges,
    toggleHasUnsavedChanges,
    formData,
  ]);

  useEffect(() => {
    const emailBuilderRef = emailEditorRef?.current?.editor;
    return () => {
      if (emailBuilderRef) {
        emailBuilderRef.removeEventListener("design:updated");
      }
    };
  }, [emailEditorRef]);

  return (
    <>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        onEditTitleClick={() => setOpenTitleRenameModal(true)}
        breadcrumbsItems={breadcrumbsItems}
        endGroupActions={endGroupActions}
      />
      <DetailsLayout.Confirmation
        onDiscard={onResetTemplate}
        onSave={onValidate}
      />
      <DetailsLayout.Content>
        <div className="flex flex-col gap-md">
          <EmailEditorForm
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            handleBlur={handleBlur}
            categoriesList={formattedCategories}
          />
          <EmailEditor
            ref={emailEditorRef}
            minHeight={UNLAYER_EDITOR_MIN_HEIGHT}
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
              user: unlayerUser,
            }}
          />
        </div>
      </DetailsLayout.Content>
      {openTitleRenameModal ? (
        <RenameEmailTemplateModal
          templateTitle={formData.title}
          error={errors?.title}
          isOpen={openTitleRenameModal}
          onBlur={(value: string) => handleBlur("title", value)}
          onChange={(newTitle: string) => handleChange("title", newTitle)}
          onClose={() => setOpenTitleRenameModal(false)}
          onSave={(newTitle: string) => setPageTitle(newTitle)}
          onCancel={handleCancelTitleRename}
        />
      ) : null}
    </>
  );
};
