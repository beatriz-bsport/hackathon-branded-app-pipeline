// @flow
import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

type Props = {
  open: boolean,
  onClose: ?() => void,
  onCancel: ?() => void,
  onSubmit: () => void,
  t: TFunction,
};

export const BookingOptionCancelDialog = (props: Props) => {
  const { t } = props;
  return (
    <Dialog
      aria-labelledby="cancel-booking-option"
      open={!!props.open}
      onClose={props.onClose}
    >
      <DialogTitle>
        {t('consumer.help.areYouSureCancelBookingOption')}
      </DialogTitle>
      <DialogContent>
        {t('consumer.help.explainCancelBookingOption')}
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>{t('common.cancel')}</Button>
        <Button color="primary" onClick={props.onSubmit}>
          {t('common.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default withTranslation()(BookingOptionCancelDialog);
