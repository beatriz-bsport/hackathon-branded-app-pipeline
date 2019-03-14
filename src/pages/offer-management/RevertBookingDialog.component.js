// @flow
import React from 'react';
import {
  Dialog,
  Button,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import RedButton from '../../components/button/RedButton.component';

type Props = {
  offerIsAvailable: boolean,
  bookingToRevert: Booking,

  closeRevertBookingDialog: () => void,
  handleBookingDeletion: () => void,

  t: TFunction,
};

export function RevertBookingDialog(props: Props) {
  const {
    t,
    bookingToRevert,
    closeRevertBookingDialog,
    handleBookingDeletion,
  } = props;
  if (!bookingToRevert) {
    return null;
  }
  if (bookingToRevert.payment_pack) {
    return (
      <Dialog
        open={!!bookingToRevert}
        onClose={closeRevertBookingDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t('booking.revertBookingTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t('booking.revertBookingExplain')(
              bookingToRevert.user.name,
              props.offerIsAvailable,
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRevertBookingDialog} color="secondary">
            {t('common.cancel')}
          </Button>
          <RedButton onClick={handleBookingDeletion} color="primary" autoFocus>
            {t('common.confirm')}
          </RedButton>
        </DialogActions>
      </Dialog>
    );
  }
  return (
    <Dialog
      open={!!bookingToRevert}
      onClose={closeRevertBookingDialog}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t('booking.revertBookingTitle')}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t(
            'booking.revertBookingWithInvoiceImpossibleExplain',
            props.offerIsAvailable,
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeRevertBookingDialog} color="secondary">
          {t('common.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default withNamespaces()(RevertBookingDialog);
