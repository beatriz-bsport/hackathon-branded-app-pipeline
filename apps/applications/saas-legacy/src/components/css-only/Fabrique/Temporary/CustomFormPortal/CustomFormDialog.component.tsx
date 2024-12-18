import React from 'react';
import { Form } from 'formik';
import { useTranslation } from 'react-i18next';
import ModalDialog from '#Fabrique/ModalDialog';
import Blanket from '#Fabrique/Blanket';
import { PortalContainer } from '#Fabrique/PortalContainer';
import Alert from '#Fabrique/Alert';
import ConsumerFormFields from '#src/libs/custom-form/components/consumer-form/CustomForm.formik-hoc';
import type { CustomFormModalsProps } from './types';
import './styles.css';

const CustomFormDialog: React.FC<CustomFormModalsProps> = ({
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
  const { t } = useTranslation('marketing');

  return (
    <PortalContainer wrapperId="bs-fabrique-custom-form-view-portal-container">
      <Blanket
        classes={{
          content: 'bs-fabrique-custom-form-view-blanket-content',
        }}
        className="bs-fabrique-custom-form-view-blanket"
        isOpen={isOpen}
      >
        {restProps.initial?.custom_form_field?.length === 0 ? (
          <Alert color="info" onClose={onClose} title={title}>
            {t('customForm.emptyCustomForm')}
          </Alert>
        ) : (
          <ModalDialog
            cancelLabel={cancelLabel}
            className="bs-fabrique-custom-form-view-modal"
            confirmLabel={confirmLabel}
            isSubmitLoading={isSubmitting}
            onCancel={onCancel}
            onClose={onClose}
            onConfirm={onClickSubmit}
            size={size ?? 'xl'}
            subtitle={subtitle}
            title={title}
          >
            <Form>{isOpen && <ConsumerFormFields {...restProps} />}</Form>
          </ModalDialog>
        )}
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(CustomFormDialog);
