import React from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RedButton from '#src/components/button/RedButton.component';

type Props = { open?: boolean; onClose: () => void; onSubmit: () => void };

const PrivatePassTemplateRestoreDialog: React.FC<Props> = ({
  onClose,
  onSubmit,
  open,
}) => {
  const { t } = useTranslation('privateService');
  return (
    <Dialog open={!!open}>
      <DialogTitle>{t('privatePassTemplate.restoreForm.title')}</DialogTitle>
      <DialogContent>
        {t('privatePassTemplate.restoreForm.content')}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {t('privatePassTemplate.restoreForm.actions.close')}
        </Button>
        <RedButton onClick={onSubmit}>
          {t('privatePassTemplate.restoreForm.actions.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default React.memo(PrivatePassTemplateRestoreDialog);
