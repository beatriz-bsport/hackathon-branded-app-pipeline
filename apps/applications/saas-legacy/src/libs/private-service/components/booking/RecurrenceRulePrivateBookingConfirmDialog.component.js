// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = {
  recurrentRuleId?: number,
  onClose: () => void,
  onChange: () => void,
};

export const RecurrenceRulePrivateBookingUpdateDialog = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  return (
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      open={!!props.recurrentRuleId}
    >
      <DialogTitle id="alert-dialog-title">
        {t('recurrenceRule.forms.update.title')}
      </DialogTitle>
      <DialogContent>{t('recurrenceRule.forms.update.content')}</DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose}>
          {t('recurrenceRule.forms.update.cancel')}
        </Button>
        <Button color="primary" onClick={props.onChange}>
          {t('recurrenceRule.forms.update.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
