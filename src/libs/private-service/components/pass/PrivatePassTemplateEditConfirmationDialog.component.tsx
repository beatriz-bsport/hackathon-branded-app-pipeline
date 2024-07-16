import React from 'react';

import { useTranslation } from 'react-i18next';
import Button from '@material-ui/core/Button';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import RedButton from '#src/components/button/RedButton.component';

type Props = {
  open?: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

const PrivatePassTemplateEditConfirmationDialog: React.FC<Props> = (props) => {
  const { t } = useTranslation('privateService');
  return (
    <GenericResponsiveDialog maxWidth="sm" open={props.open}>
      <DialogTitle>
        {t('privatePassTemplate.form.editConfirmation.title')}
      </DialogTitle>
      <DialogContent>
        {t('privatePassTemplate.form.editConfirmation.content')}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>
          {t('privatePassTemplate.form.editConfirmation.cancel')}
        </Button>
        <RedButton onClick={props.onSubmit}>
          {t('privatePassTemplate.form.editConfirmation.confirm')}
        </RedButton>
      </DialogActions>
    </GenericResponsiveDialog>
  );
};

export default React.memo(PrivatePassTemplateEditConfirmationDialog);
