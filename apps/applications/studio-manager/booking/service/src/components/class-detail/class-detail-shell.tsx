import { type FC, useCallback, useEffect, useId } from "react";
import { useSearchParams } from "react-router";

import type { MetaActivity } from "@bsport/api-book";
import { ControlledForm, useFormController } from "@bsport/form";
import {
  Body,
  DetailsLayout,
  Modal,
  toast,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";

import { ClassDetailHeader } from "#src/components/class-detail/class-detail-header";
import { ClassEditorForm } from "#src/components/class-editor/class-editor-form";
import { useEditClass } from "#src/hooks/use-edit-class";
import { useModal } from "#src/hooks/use-modal";
import {
  type ClassFormValues,
  fromMetaActivityToFormData,
  toEditGroupActivityPayload,
  useClassFormSchema,
} from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

const VALID_TABS = ["editor", "compatiblePasses"] as const;
type ClassDetailTab = (typeof VALID_TABS)[number];

const getActiveTab = (raw: string | null): ClassDetailTab =>
  (VALID_TABS as readonly string[]).includes(raw ?? "")
    ? (raw as ClassDetailTab)
    : "editor";

type ClassDetailShellProps = {
  metaActivity: MetaActivity;
};

export const ClassDetailShell: FC<ClassDetailShellProps> = ({
  metaActivity,
}) => {
  const { t } = useTranslation("class-detail");
  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = getActiveTab(searchParams.get("tab"));

  const schema = useClassFormSchema("edit");
  const methods = useFormController({
    schema,
    mode: "onSubmit",
    defaultValues: fromMetaActivityToFormData(metaActivity),
  });

  const formId = `class-editor-form-${useId()}`;
  const isDirty = methods.formState.isDirty;

  useEffect(() => {
    toggleHasUnsavedChanges(isDirty);
  }, [isDirty, toggleHasUnsavedChanges]);

  const { mutateAsync, isPending } = useEditClass();

  async function onSubmit(values: ClassFormValues) {
    try {
      const result = await mutateAsync({
        id: metaActivity.id,
        data: toEditGroupActivityPayload(values),
      });
      methods.reset(fromMetaActivityToFormData(result));
      toast({
        status: "default",
        icon: "edit-02",
        buttonIcon: "x",
        description: t("classDetail.editor.toast"),
      });
    } catch {
      // useEditClass handles error toast
    }
  }

  const {
    isOpen: isDiscardOpen,
    open: openDiscard,
    close: closeDiscard,
  } = useModal();

  function handleDiscardConfirm() {
    methods.reset();
    closeDiscard();
    toast({
      status: "default",
      icon: "flip-forward",
      buttonIcon: "x",
      description: t("classDetail.editor.discard.toast"),
    });
  }

  const handleTabChange = useCallback(
    (tabId: string) => {
      setSearchParams(
        (prev) => {
          prev.set("tab", tabId);
          return prev;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const pageTabs = {
    value: activeTab,
    onValueChange: handleTabChange,
    orientation: "horizontal" as const,
    tabs: [
      { id: "editor", label: t("classDetail.tabs.editor") },
      { id: "compatiblePasses", label: t("classDetail.tabs.compatiblePasses") },
    ],
  };

  return (
    <>
      <ControlledForm {...methods} onSubmit={onSubmit} id={formId}>
        <DetailsLayout {...detailsLayoutProps}>
          <ClassDetailHeader metaActivity={metaActivity} pageTabs={pageTabs} />
          <DetailsLayout.Content>
            {activeTab === "editor" && <ClassEditorForm />}
            {activeTab === "compatiblePasses" && (
              <CompatiblePassesPlaceholder />
            )}
          </DetailsLayout.Content>
          {activeTab === "editor" && (
            <DetailsLayout.Confirmation
              onDiscard={openDiscard}
              formSubmit={{ formId, isSubmitting: isPending }}
            />
          )}
        </DetailsLayout>
      </ControlledForm>
      {isDiscardOpen && (
        <Modal
          open
          size="md"
          title={t("classDetail.editor.discard.title")}
          onCloseButtonClick={closeDiscard}
          onClickOutside={closeDiscard}
          confirmButton={{
            label: t("classDetail.editor.discard.confirm"),
            color: "critical",
            onClick: handleDiscardConfirm,
          }}
          cancelButton={{
            label: t("classDetail.editor.discard.keepEditing"),
            onClick: closeDiscard,
          }}
        >
          <Body htmlVariant="p">
            {t("classDetail.editor.discard.description")}
          </Body>
        </Modal>
      )}
    </>
  );
};

const CompatiblePassesPlaceholder: FC = () => null;
