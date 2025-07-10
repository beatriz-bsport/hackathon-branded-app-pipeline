import React from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RedButton from '#src/components/button/RedButton.component';
import { VALIDATION_DELAY } from '#src/libs/constants';

type Props = { open?: boolean; onClose: () => void; onSubmit: () => void };

const PrivatePassTemplateDeleteDialog = (props: Props) => {
  const { t } = useTranslation('privateService');
  return (
    <Dialog open={!!props.open}>
      <DialogTitle>{t('privatePassTemplate.deleteForm.title')}</DialogTitle>
      <DialogContent>
        {t('privatePassTemplate.deleteForm.content')}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('privatePassTemplate.deleteForm.actions.close')}
        </Button>
        <RedButton
          delayBeforeActivation={VALIDATION_DELAY}
          onClick={props.onSubmit}
        >
          {t('privatePassTemplate.deleteForm.actions.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
};

export default PrivatePassTemplateDeleteDialog;
