import React from 'react';
import { useTranslation } from 'react-i18next';

import { Typography } from '@material-ui/core';

import ANALYTICS_MODAL_BANNER from '#src/public/images/banner_analytics_redirect_documentation_modal-min.png';
import ModalConfirm from '#src/components/ModalConfirm.component';
import { AnalyticsDocumentationURL } from '../constants';

type AnalyticsInfoModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const AnalyticsInfoModal: React.FC<AnalyticsInfoModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation(['theme', 'common']);

  const handleOnConfirm = React.useCallback(() => {
    if (!window) return;
    window.open(AnalyticsDocumentationURL, '_blank').focus();
  }, []);

  return (
    <ModalConfirm
      disableConfirm={false}
      handleCancel={onClose}
      handleConfirm={handleOnConfirm}
      open={isOpen}
      options={{
        title: t('analytics.analyticsInformationModal.title'),
        cancel: t('commmon:cancel'),
        confirm: t('analytics.analyticsInformationModal.confirm'),
      }}
    >
      <div>
        <img
          alt="analytics information modal banner"
          src={ANALYTICS_MODAL_BANNER}
          style={{ width: '100%' }}
        />
        <Typography variant="body1">
          {t('analytics.analyticsInformationModal.content')}
        </Typography>
      </div>
    </ModalConfirm>
  );
};

export default React.memo(AnalyticsInfoModal);
