// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

type Props = {
  recurrentRuleId: ?number,
  onClose: () => void,
  onChange: () => void,
};

export const RecurrenceRulePrivateBookingDeleteDialog = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  return (
    <Dialog
      open={!!props.recurrentRuleId}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('recurrenceRule.forms.delete.title')}
      </DialogTitle>
      <DialogContent>{t('recurrenceRule.forms.delete.content')}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} autoFocus>
          {t('recurrenceRule.forms.delete.cancel')}
        </Button>
        <Button onClick={props.onChange} color="primary">
          {t('recurrenceRule.forms.delete.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export const RecurrenceRulePrivateBookingUpdateDialog = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  return (
    <Dialog
      open={!!props.recurrentRuleId}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('recurrenceRule.forms.update.title')}
      </DialogTitle>
      <DialogContent>{t('recurrenceRule.forms.update.content')}</DialogContent>
      <DialogActions>
        <Button onClick={props.onClose} autoFocus>
          {t('recurrenceRule.forms.update.cancel')}
        </Button>
        <Button onClick={props.onChange} color="primary">
          {t('recurrenceRule.forms.update.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
