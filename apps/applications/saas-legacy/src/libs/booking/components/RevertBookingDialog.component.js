// @flow
import React from 'react';
import { withTranslation, TFunction } from 'react-i18next';
import { compose, withState, withStateHandlers } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';
import GenericResponsiveDialog from '#src/components/genericDialog/GenericResponsiveDialog';

import RedButton from '#src/components/button/RedButton.component';

import type { Booking } from '../types';

type Props = {
  offer: Offer,
  offerIsAvailable: boolean,
  bookingToRevert: Booking,

  closeRevertBookingDialog: () => void,
  handleBookingDeletion: () => void,

  loading: boolean,
  setLoading: (boolean) => void,
  force_notify: boolean,
  force_refund: boolean,
  toogleForceNotify: (boolean) => void,
  toggleForceRefund: () => void,
  /** For already cancelled booking, it makes no sense for us to resend an email */
  hideEmailOption?: boolean,
  /** For already refunded booking, it makes no sense for us to show the option */
  hideRefundOption?: boolean,

  t: TFunction,
};

export function RevertBookingDialog(props: Props) {
  const {
    t,
    offer,
    bookingToRevert,
    closeRevertBookingDialog,
    handleBookingDeletion,
    force_notify,
    force_refund,
    toogleForceNotify,
    toggleForceRefund,
    hideEmailOption,
    hideRefundOption,
  } = props;
  const classes = useStyles();

  if (!bookingToRevert || (hideEmailOption && hideRefundOption)) {
    return null;
  }
  if (bookingToRevert.consumer_payment_pack) {
    return (
      <GenericResponsiveDialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        maxWidth="sm"
        onClose={closeRevertBookingDialog}
        open={!!bookingToRevert}
      >
        <DialogTitle id="alert-dialog-title">
          {t('booking.revertBookingTitle')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t(
              `booking.revertBookingExplain.${
                props.offerIsAvailable
                  ? 'offerIsAvailableChoiceRefund'
                  : 'offerIsNotAvailable'
              }`,
            )}
          </DialogContentText>
          {!hideRefundOption && (
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={force_refund}
                    onChange={toggleForceRefund}
                  />
                }
                label={t('booking.refundRevert')}
              />
            </div>
          )}
          {!hideEmailOption && (
            <div>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={force_notify}
                    onChange={toogleForceNotify}
                  />
                }
                label={t('booking.notifyRevert')}
              />
            </div>
          )}
          {offer?.group && (
            <>
              <Alert
                className={classes.alert}
                severity="error"
                variant="outlined"
              >
                {t('booking.cancellingOtherBookingInGroup', {
                  name: offer?.group?.name,
                })}
              </Alert>
            </>
          )}
        </DialogContent>
        <DialogActions>
          {props.loading ? (
            <CircularProgress />
          ) : (
            <React.Fragment>
              <Button color="secondary" onClick={closeRevertBookingDialog}>
                {t('common.cancel')}
              </Button>
              <RedButton
                autoFocus
                color="primary"
                onClick={() => {
                  props.setLoading(true);
                  handleBookingDeletion(
                    {
                      force_notify,
                      force_refund,
                    },
                    {
                      onSuccess: () => props.setLoading(false),
                    },
                  );
                }}
              >
                {t('common.confirm')}
              </RedButton>
            </React.Fragment>
          )}
        </DialogActions>
      </GenericResponsiveDialog>
    );
  }
  return (
    <Dialog
      aria-describedby="alert-dialog-description"
      aria-labelledby="alert-dialog-title"
      onClose={closeRevertBookingDialog}
      open={!!bookingToRevert}
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
        <Button color="secondary" onClick={closeRevertBookingDialog}>
          {t('common.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme: Theme) => ({
  similarListHeader: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  selectOption: {
    marginTop: theme.spacing(1),
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    color: 'grey',
    '&:hover': {
      color: 'black',
    },
  },
  noSimilarOfferMessage: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  list: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(2),
  },
  alert: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
}));

export default compose(
  withState('loading', 'setLoading', false),
  withStateHandlers(
    { force_notify: false, force_refund: true },
    {
      toogleForceNotify:
        ({ force_notify }) =>
        () => ({
          force_notify: !force_notify,
        }),
      toggleForceRefund:
        ({ force_refund }) =>
        () => ({
          force_refund: !force_refund,
        }),
    },
  ),
  withTranslation(),
)(RevertBookingDialog);
