import React from 'react';
import { Form } from 'formik';
import BottomDrawer from '#Fabrique/BottomDrawer';
import ConsumerFormFields from '#src/libs/custom-form/components/consumer-form/CustomForm.formik-hoc';
import type { CustomFormModalsProps } from './types';
import { PortalContainer } from '#Fabrique/PortalContainer';
import './styles.css';

const CustomFormBottomDrawer: React.FC<CustomFormModalsProps> = ({
  onClose,
  cancelLabel,
  confirmLabel,
  isOpen,
  title,
  onCancel,
  onClickSubmit,
  size,
  subtitle,
  isSubmitting,
  ...restProps
}) => {
  return (
    <PortalContainer wrapperId="bs-fabrique-custom-form-view-portal-container">
      <BottomDrawer
        blanketProps={{ isOpen, onClick: onClose }}
        modalDialogProps={{
          cancelLabel,
          confirmLabel,
          isSubmitLoading: isSubmitting,
          onCancel,
          onClose,
          onConfirm: onClickSubmit,
          size: size ?? 'xl',
          subtitle,
          title,
        }}
      >
        <Form>
          <ConsumerFormFields {...restProps} />
        </Form>
      </BottomDrawer>
    </PortalContainer>
  );
};

export default React.memo(CustomFormBottomDrawer);
