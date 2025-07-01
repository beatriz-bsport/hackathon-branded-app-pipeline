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

import { DeleteTemplateModal } from "#src/components/Common/Modals/DeleteTemplateModal";
import { DuplicateTemplateModal } from "#src/components/Common/Modals/DuplicateTemplateModal";
import { EmailEditorForm } from "#src/components/TemplateDetails/EmailEditorForm";
import { RenameEmailTemplateModal } from "#src/components/TemplateDetails/Modal/RenameEmailTemplate";
import { SaveEmailTemplateParams } from "#src/hooks/actions/useSaveTemplate";
import { useUnlayerBuilder } from "#src/hooks/actions/useUnlayerBuilder";
import { useUnlayerInitialization } from "#src/hooks/actions/useUnlayerInitialization";
import { useFetchCommunicationVariables } from "#src/hooks/fetch/useFetchCommunicationVariables";
import { useEmailTemplateForm } from "#src/hooks/forms/use-email-template-form";
import { useDetailPageHeader } from "#src/hooks/layout/useDetailPageHeader";
import { useTemplateNavigation } from "#src/hooks/useTemplateNavigation";
import {
  UNLAYER_EDITOR_MIN_HEIGHT,
  UNLAYER_PROJECT_ID,
} from "#src/utils/constants";
import {
  createDownloadableUrlObject,
  getMergeTags,
} from "#src/utils/emailEditor";
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
  const { t } = useTranslation("detail");
  const emailEditorRef = useRef<EditorRef>(null);
  const [currentInlineAction, setCurrentInlineAction] = useState<
    "delete" | "duplicate" | "rename" | null
  >(null);
  const [pageTitle, setPageTitle] = useState(
    emailTemplateDetail?.title || t("details.defaultTitle"),
  );
  const { communicationVariables, fetchCommunicationVariables } =
    useFetchCommunicationVariables();
  const { unlayerUser, currentLocale, companyName, companyId } =
    useUnlayerInitialization();
  const { exportEmailBuilderTemplate, initializeUnlayerBuilder } =
    useUnlayerBuilder();
  const { navigateToCustomList } = useTemplateNavigation();

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
      title: emailTemplateDetail?.title || t("details.defaultTitle"),
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
    onDeleteTemplate: emailTemplateDetail
      ? () => setCurrentInlineAction("delete")
      : undefined,
    onDuplicateTemplate: emailTemplateDetail
      ? () => setCurrentInlineAction("duplicate")
      : undefined,
  });

  const mergedTags = useMemo(
    () => getMergeTags({ communicationVariables }) ?? undefined,
    [communicationVariables],
  );

  const handleCloseModals = () => {
    setCurrentInlineAction(null);
  };

  const handleCancelTitleRename = () => {
    setPageTitle(emailTemplateDetail?.title || t("details.defaultTitle"));
    handleChange(
      "title",
      emailTemplateDetail?.title || t("details.defaultTitle"),
    );
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
      setPageTitle(emailTemplateDetail?.title || t("details.defaultTitle"));
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
    if (!currentInlineAction && hasChanges(initialData)) {
      toggleHasUnsavedChanges(true);
    } else {
      toggleHasUnsavedChanges(false);
    }
  }, [
    currentInlineAction,
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

  useEffect(() => {
    fetchCommunicationVariables();
  }, [fetchCommunicationVariables]);

  return (
    <>
      <DetailsLayout.Header
        pageTitle={pageTitle}
        onEditTitleClick={() => setCurrentInlineAction("rename")}
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
              mergeTags: mergedTags,
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
      {currentInlineAction === "rename" ? (
        <RenameEmailTemplateModal
          templateTitle={formData.title}
          error={errors?.title}
          isOpen={true}
          onBlur={(value: string) => handleBlur("title", value)}
          onChange={(newTitle: string) => handleChange("title", newTitle)}
          onClose={handleCloseModals}
          onSave={(newTitle: string) => setPageTitle(newTitle)}
          onCancel={handleCancelTitleRename}
        />
      ) : null}
      {emailTemplateDetail?.id && currentInlineAction === "duplicate" ? (
        <DuplicateTemplateModal
          templateId={emailTemplateDetail.id}
          isOpen={true}
          onClose={handleCloseModals}
        />
      ) : null}
      {emailTemplateDetail?.id && currentInlineAction === "delete" ? (
        <DeleteTemplateModal
          templateId={emailTemplateDetail.id}
          isOpen={true}
          onClose={handleCloseModals}
          onSuccess={() => navigateToCustomList()}
        />
      ) : null}
    </>
  );
};
