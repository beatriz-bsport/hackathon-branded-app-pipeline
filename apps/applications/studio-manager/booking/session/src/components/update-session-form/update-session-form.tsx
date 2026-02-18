import { FC, useEffect, useId } from "react";

import { SessionEditActions, SessionWithActivity } from "@bsport/api-book";
import { ControlledForm, useFormController } from "@bsport/form";
import {
  DetailsLayout,
  Divider,
  useDetailsLayout,
} from "@bsport/kaizen-primitive-core";
import { Title } from "@bsport/kaizen-primitive-core";

import { BookForAGuestField } from "#src/components/SessionForm/advanced-options/book-for-a-guest-field";
import TagSelectorForm from "#src/components/SessionForm/advanced-options/tag-selector-form";
import { useSessionEditSchema } from "#src/components/SessionForm/schemas";
import { EstablishmentSection } from "#src/components/SessionForm/teacher-and-establishment/establishment-section";
import { TeacherSection } from "#src/components/SessionForm/teacher-and-establishment/teacher-section";
import { Header } from "#src/components/session-details/header";
import { fromSessionToFormData } from "#src/components/update-session-form/mapper";
import useEditSession from "#src/hooks/session-api/session-actions/use-edit-session";
import { useModal } from "#src/hooks/use-modal";
import { useSessionPayload } from "#src/hooks/use-session-payload";
import { useTranslation } from "#src/utils/i18n";

import { VisibilitySelector } from "../SessionForm/Details/VisibilitySelector";
import { CancelSessionModal } from "../SessionList/detail-actions/cancel-session-modal";
import { DuplicateSessionModal } from "../SessionList/detail-actions/duplicate-session-modal";
import { RestoreSessionModal } from "../SessionList/detail-actions/restore-session-modal";
import DetailsForm from "./details-form";
import { SaveSessionModal } from "./save-modal";
import { SettingsSection } from "./settings-section";
import { TimeAndDateSection } from "./time-and-date-section";

type PropsType = { session: SessionWithActivity };

const UpdateSessionForm: FC<PropsType> = ({ session }) => {
  const { t } = useTranslation("sessionEdit");

  const {
    isOpen: isCancelSessionModalOpen,
    close: onCloseCancelSessionModal,
    open: onOpenCancelSessionModal,
  } = useModal();

  const {
    isOpen: isDuplicateSessionModalOpen,
    close: onCloseDuplicateSessionModal,
    open: onOpenDuplicateSessionModal,
  } = useModal();

  const {
    isOpen: isRestoreSessionModalOpen,
    close: onCloseRestoreSessionModal,
    open: onOpenRestoreSessionModal,
  } = useModal();

  const { detailsLayoutProps, toggleHasUnsavedChanges } = useDetailsLayout();

  const { buildEditionPayload } = useSessionPayload();

  const { sessionEditSchema } = useSessionEditSchema();
  const { isOpen, open, close } = useModal();

  const { mutateAsync: editSession } = useEditSession();
  const methods = useFormController({
    schema: sessionEditSchema,
    mode: "onSubmit",
    defaultValues: fromSessionToFormData(session),
  });

  const isDirty = Object.keys(methods.formState.dirtyFields).length > 0;

  const formId = `session-form-update-${useId()}`;

  useEffect(() => {
    toggleHasUnsavedChanges(isDirty);
  }, [isDirty, toggleHasUnsavedChanges]);

  const resetForm = () => {
    methods.reset();
  };

  const handleSubmit = async (editActions: SessionEditActions) => {
    await editSession({
      sessionId: session.id,
      payload: buildEditionPayload(methods.getValues(), session, editActions),
    });

    methods.reset(methods.getValues());
  };

  const openSaveModal = methods.handleSubmit(open);

  return (
    <>
      <ControlledForm {...methods} onSubmit={console.log} id={formId}>
        <DetailsLayout {...detailsLayoutProps} withPanel>
          <Header
            session={session}
            onOpenCancelSessionModal={onOpenCancelSessionModal}
            onOpenDuplicateSessionModal={onOpenDuplicateSessionModal}
            onOpenRestoreSessionModal={onOpenRestoreSessionModal}
          />
          <DetailsLayout.Content className="max-w-none">
            <SettingsSection
              metaActivity={session.metaActivity}
              fieldIdPrefix={formId}
            />
            <TeacherSection fieldIdPrefix={formId} />
            <EstablishmentSection
              fieldIdPrefix={formId}
              metaActivity={session.metaActivity}
            />
            <TimeAndDateSection fieldIdPrefix={formId} isEditMode />
          </DetailsLayout.Content>
          <DetailsLayout.Panel>
            <div className="flex flex-col gap-lg pb-xl">
              <div className="flex flex-col gap-xs">
                <Title htmlVariant="h5" weight="strong">
                  {t("editSessionForm.content.visibilitySelector.title")}
                </Title>
                <VisibilitySelector
                  fieldIdPrefix={formId}
                  fieldName="manager_only"
                  title={t("editSessionForm.content.visibilitySelector.label")}
                  buttonClassName="w-full max-w-component-select"
                />
                <BookForAGuestField fieldIdPrefix={formId} />
              </div>
              <Divider orientation="horizontal" weight="thin" />
              <DetailsForm fieldIdPrefix={formId} />
              <Divider orientation="horizontal" weight="thin" />
              <TagSelectorForm fieldIdPrefix={formId} />
            </div>
          </DetailsLayout.Panel>
          <DetailsLayout.Confirmation
            onDiscard={resetForm}
            onSave={openSaveModal}
          />
        </DetailsLayout>
        <SaveSessionModal
          session={session}
          saveForm={handleSubmit}
          isOpen={isOpen}
          closeModal={close}
        />
      </ControlledForm>
      <DuplicateSessionModal
        session={session}
        isOpen={isDuplicateSessionModalOpen}
        onClose={onCloseDuplicateSessionModal}
      />
      <CancelSessionModal
        session={session}
        isOpen={isCancelSessionModalOpen}
        onClose={onCloseCancelSessionModal}
      />
      <RestoreSessionModal
        session={session}
        isOpen={isRestoreSessionModalOpen}
        onClose={onCloseRestoreSessionModal}
      />
    </>
  );
};

export default UpdateSessionForm;
