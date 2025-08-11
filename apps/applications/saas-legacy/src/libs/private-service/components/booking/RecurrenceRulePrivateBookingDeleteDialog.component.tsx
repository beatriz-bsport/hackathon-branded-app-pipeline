// @flow
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {
  Checkbox,
  DialogContentText,
  FormControlLabel,
  FormGroup,
} from '@material-ui/core';

type Props = {
  recurrentRuleId?: number;
  onClose: () => void;
  onDelete: (data: { cancel_related_bookings: boolean }) => void;
};

export const RecurrenceRulePrivateBookingDeleteDialog = (props: Props) => {
  const { t } = useTranslation(['privateService']);
  const [cancelBookingsChecked, setCancelBookingsChecked] = useState(true);

  const handleCancelBookingChecked = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCancelBookingsChecked(event.target.checked);
    },
    [],
  );

  return (
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      open={!!props.recurrentRuleId}
    >
      <DialogTitle id="alert-dialog-title">
        {t('recurrenceRule.forms.delete.title')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          {t('recurrenceRule.forms.delete.content_with_cancellation_option')}
        </DialogContentText>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                checked={cancelBookingsChecked}
                id="cancel_bookings_checked"
                name="cancel_bookings_checked"
                onChange={handleCancelBookingChecked}
              />
            }
            label={t('recurrenceRule.forms.delete.cancelRelatedBookings')}
          />
        </FormGroup>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={props.onClose}>
          {t('recurrenceRule.forms.delete.cancel')}
        </Button>
        <Button
          color="primary"
          onClick={() =>
            props.onDelete({ cancel_related_bookings: cancelBookingsChecked })
          }
        >
          {t('recurrenceRule.forms.delete.confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecurrenceRulePrivateBookingDeleteDialog;
