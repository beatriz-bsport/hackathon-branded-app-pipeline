// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';
import CircularProgress from '@material-ui/core/CircularProgress';

import RedButton from '../../../components/button/RedButton.component';

import type { Booking } from '../types';

type Props = {
  offerIsAvailable: boolean,
  bookingToRevert: Booking,

  closeRevertBookingDialog: () => void,
  handleBookingDeletion: () => void,

  loading: boolean,
  setLoading: (boolean) => void,

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
  if (bookingToRevert.consumer_payment_pack) {
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
              `booking.revertBookingExplain.${
                props.offerIsAvailable
                  ? 'offerIsAvailable'
                  : 'offerIsNotAvailable'
              }`,
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {props.loading ? (
            <CircularProgress />
          ) : (
            <React.Fragment>
              <Button onClick={closeRevertBookingDialog} color="secondary">
                {t('common.cancel')}
              </Button>
              <RedButton
                onClick={() => {
                  props.setLoading(true);
                  handleBookingDeletion({
                    onSuccess: () => props.setLoading(false),
                  });
                }}
                color="primary"
                autoFocus
              >
                {t('common.confirm')}
              </RedButton>
            </React.Fragment>
          )}
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

export default compose(
  withState('loading', 'setLoading', false),
  withTranslation(),
)(RevertBookingDialog);
