import React, { useCallback } from 'react';
import { useFormikContext } from 'formik';
import { compose } from 'recompose';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import { ConsumerFormFieldsHOC } from '#src/libs/custom-form/components/consumer-form/CustomForm.formik-hoc';
import type { CustomFormFilled } from '#src/libs/custom-form/types';
import { useCustomFormButtonLabel } from './hooks';
import type { CustomFormPortalProps } from './types';
import { CustomFormBottomDrawer, CustomFormDialog } from '.';
import './styles.css';

const CustomFormPortal: React.FC<CustomFormPortalProps> = ({
  disconnectOnCancel,
  isEditionForm,
  isMobile,
  isMulti,
  isOpen,
  onCancel,
  onClose,
  onSubmitDraft,
  size,
  title,
  userStatus,
  ...restProps
}) => {
  const { values, handleSubmit, isSubmitting } =
    useFormikContext<CustomFormFilled>();

  const handleCancel = useCallback(() => {
    onCancel(values);
  }, [values, onCancel]);

  const handleClickOnSubmit = useCallback(() => {
    handleSubmit();
    onSubmitDraft?.(values);
  }, [handleSubmit, onSubmitDraft, values]);

  const confirmButtonLabel = useCustomFormButtonLabel({
    buttonType: 'submit',
    isEditionForm,
    isMulti,
    userStatus,
  });

  const cancelButtonLabel = useCustomFormButtonLabel({
    buttonType: 'cancel',
    disconnectOnCancel,
  });

  if (isMobile)
    return (
      <CustomFormBottomDrawer
        cancelLabel={cancelButtonLabel}
        confirmLabel={confirmButtonLabel}
        isOpen={isOpen}
        isSubmitting={isSubmitting}
        onCancel={handleCancel}
        onClickSubmit={handleClickOnSubmit}
        onClose={onClose}
        size={size}
        title={title}
        {...restProps}
      />
    );

  return (
    <CustomFormDialog
      cancelLabel={cancelButtonLabel}
      confirmLabel={confirmButtonLabel}
      isOpen={isOpen}
      isSubmitting={isSubmitting}
      onCancel={handleCancel}
      onClickSubmit={handleClickOnSubmit}
      onClose={onClose}
      size={size}
      title={title}
      {...restProps}
    />
  );
};

export const CustomFormPortalStorybook =
  marketplaceCssHoc<React.ComponentProps<typeof CustomFormPortal>>()(
    CustomFormPortal,
  );
export default compose<CustomFormPortalProps, CustomFormPortalProps>(
  ConsumerFormFieldsHOC,
  React.memo,
)(CustomFormPortal);
