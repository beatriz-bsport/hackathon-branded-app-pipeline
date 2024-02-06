import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import GenericResponsiveDialog from '#components/genericDialog/GenericResponsiveDialog';
import RedButton from '#components/button/RedButton.component';

type Props = {
  privateServiceToDeleteId?: number;
  onClose: () => void;
  deletePrivateService: (id: number) => void;
};

const PrivateServiceDeleteDialog: React.FC<Props> = ({
  privateServiceToDeleteId,
  onClose,
  deletePrivateService,
}) => {
  const { t } = useTranslation('privateService');

  const onDeletePrivateService = useCallback(
    () => deletePrivateService(privateServiceToDeleteId),
    [deletePrivateService, privateServiceToDeleteId],
  );

  return (
    <GenericResponsiveDialog
      maxWidth="sm"
      onClose={onClose}
      open={!!privateServiceToDeleteId}
    >
      <DialogTitle>{t('forms.delete.title')}</DialogTitle>
      <DialogContent>{t('forms.delete.content.canDelete')}</DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('forms.delete.actions.cancel')}</Button>
        <RedButton onClick={onDeletePrivateService}>
          {t('forms.delete.actions.confirm')}
        </RedButton>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default React.memo(PrivateServiceDeleteDialog);
