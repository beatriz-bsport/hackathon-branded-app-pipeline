import React from 'react';
import { useTranslation } from 'react-i18next';
import ModalDialog from '#Fabrique/ModalDialog';
import Blanket from '#Fabrique/Blanket';
import { PortalContainer } from '#components/css-only/Fabrique/PortalContainer';

import CustomFormViewForm from '#libs/custom-form/components/consumer-form/CustomFormView.form';
import type { CustomFormDialogProps } from './types';
import './styles.css';

const CustomFormDialog: React.FC<CustomFormDialogProps> = ({
  onClose,
  open,
  title,
  generalTermsAndConditions,
  initial,
  isCssVariantActivated,
  layouts,
  onSubmit,
  onSubmitDraft,
  waiver,
}) => {
  const { t } = useTranslation('payment');
  return (
    <PortalContainer wrapperId="bs-fabrique-custom-form-view-portal-container">
      <Blanket
        classes={{
          content: 'bs-fabrique-custom-form-view-blanket-content',
        }}
        className="bs-fabrique-custom-form-view-blanket"
        isOpen={open}
      >
        <ModalDialog
          cancelLabel={t('generalTermsAndConditions.close')}
          className="bs-fabrique-custom-form-view-modal"
          onClose={onClose}
          size="xl"
          title={title}
        >
          <CustomFormViewForm
            general_terms_and_conditions={generalTermsAndConditions}
            initial={initial}
            isCssVariantActivated={isCssVariantActivated}
            layouts={layouts}
            onCancel={onClose}
            onSubmit={onSubmit}
            onSubmitDraft={onSubmitDraft}
            waiver={waiver}
          />
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(CustomFormDialog);
