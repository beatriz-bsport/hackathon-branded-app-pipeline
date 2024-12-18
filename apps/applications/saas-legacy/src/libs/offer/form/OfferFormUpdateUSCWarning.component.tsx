import React from 'react';
import { useTranslation } from 'react-i18next';

import { Alert } from '@material-ui/lab';

import ModalConfirm from '#src/components/ModalConfirm.component';

type Props = {
  handleConfirm: () => void;
  handleCancel: () => void;
  isOpen: boolean;
};
const OfferFormUpdateUSCWarning: React.FC<Props> = ({
  handleConfirm,
  handleCancel,
  isOpen,
}) => {
  const { t } = useTranslation('offer');

  return (
    <ModalConfirm
      handleCancel={handleCancel}
      handleConfirm={handleConfirm}
      open={isOpen}
      options={{
        title: 'offer:form.uscWarning.title',
        Content: t('form.uscWarning.content'),
      }}
    >
      <Alert severity="warning">{t('form.uscWarning.alertContent')}</Alert>
    </ModalConfirm>
  );
};

export default React.memo(OfferFormUpdateUSCWarning);
