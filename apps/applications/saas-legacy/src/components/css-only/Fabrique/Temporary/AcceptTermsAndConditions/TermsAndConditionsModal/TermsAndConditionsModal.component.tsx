import React from 'react';
import { useTranslation } from 'react-i18next';
import ModalDialog from '#Fabrique/ModalDialog';
import Typography from '#Fabrique/Typography';
import { TermsAndConditionType } from '#src/libs/payment/types';
import Blanket from '#Fabrique/Blanket';
import { PortalContainer } from '#src/components/css-only/Fabrique/PortalContainer';
import './styles.css';

export type TermsAndConditionsModalProps = {
  onClose: () => void;
  open: boolean;
  termsAndConditions: string;
  type: TermsAndConditionType;
};

const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  onClose,
  open,
  termsAndConditions,
  type,
}) => {
  const { t } = useTranslation('payment');
  return (
    <PortalContainer wrapperId="bs-fabrique-terms-and-conditions-portal-container">
      <Blanket
        classes={{
          content: 'bs-fabrique-terms-and-conditions-blanket-content',
        }}
        className="bs-fabrique-terms-and-conditions-blanket"
        isOpen={open}
      >
        <ModalDialog
          cancelLabel={t('generalTermsAndConditions.close')}
          className="bs-fabrique-terms-and-conditions-modal"
          onCancel={onClose}
          onClose={onClose}
          title={t(`generalTermsAndConditions.${type}`)}
        >
          <Typography
            className="bs-fabrique-terms-and-conditions-modal__text"
            variant="body-sm"
          >
            {termsAndConditions}
          </Typography>
        </ModalDialog>
      </Blanket>
    </PortalContainer>
  );
};

export default React.memo(TermsAndConditionsModal);
