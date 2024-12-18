import React from 'react';

import { useTranslation } from 'react-i18next';

import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';

import RedButton from '#src/components/button/RedButton.component';

type Props = { open?: boolean; onClose: () => void; onSubmit: () => void };

const ContractTemplateDeleteDialog: React.FC<Props> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const { t } = useTranslation('subscription');
  return (
    <GenericResponsiveDialog maxWidth="sm" open={open}>
      <DialogTitle>{t('contractTemplate.dialog.delete.title')}</DialogTitle>
      <DialogContent>
        {t('contractTemplate.dialog.delete.content')}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t('contractTemplate.dialog.delete.cancel')}
        </Button>
        <RedButton autoFocus onClick={onSubmit}>
          {t('contractTemplate.dialog.delete.confirm')}
        </RedButton>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default React.memo(ContractTemplateDeleteDialog);
