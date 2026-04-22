import { type FC, useId } from "react";

import { useFormController } from "@bsport/form";
import { Loader, Modal } from "@bsport/kaizen-primitive-core";

import { QueryBoundary } from "#src/components/query-boundary/query-boundary";
import { useCreateClass } from "#src/hooks/use-create-class";
import {
  type ClassFormValues,
  defaultClassFormValues,
  toCreateGroupActivityPayload,
  useClassFormSchema,
} from "#src/utils/class-form";
import { useTranslation } from "#src/utils/i18n";

import { ClassForm } from "./class-form";

type AddClassModalProps = {
  open: boolean;
  onClose: () => void;
};

export const AddClassModal: FC<AddClassModalProps> = ({ open, onClose }) => {
  const { t } = useTranslation("add-edit-form");
  const formId = useId();
  const schema = useClassFormSchema();
  const methods = useFormController({
    schema,
    defaultValues: defaultClassFormValues,
    mode: "onBlur",
    shouldFocusError: true,
  });
  const { mutate, isPending } = useCreateClass();

  const handleClickOutside = () => {
    if (isPending) return;
    if (methods.formState.isDirty) return;
    methods.reset();
    onClose();
  };

  const handleCloseButtonClick = () => {
    if (isPending) return;
    methods.reset();
    onClose();
  };

  const handleSubmit = (values: ClassFormValues) => {
    mutate(toCreateGroupActivityPayload(values), {
      onSuccess: () => {
        methods.reset();
        onClose();
      },
    });
  };

  return (
    <Modal
      open={open}
      size="lg"
      title={t("addEditForm.modal.title")}
      onClose={handleCloseButtonClick}
      onCloseButtonClick={handleCloseButtonClick}
      onClickOutside={handleClickOutside}
      confirmButton={{
        label: t("addEditForm.modal.confirm"),
        type: "submit",
        form: formId,
        disabled: isPending || !methods.formState.isValid,
      }}
      cancelButton={{
        label: t("addEditForm.modal.cancel"),
        onClick: handleCloseButtonClick,
      }}
    >
      {open ? (
        <QueryBoundary
          loadingFallback={
            <div className="flex justify-center py-xl">
              <Loader size="lg" />
            </div>
          }
        >
          <ClassForm
            formId={formId}
            methods={methods}
            onSubmit={handleSubmit}
          />
        </QueryBoundary>
      ) : null}
    </Modal>
  );
};
