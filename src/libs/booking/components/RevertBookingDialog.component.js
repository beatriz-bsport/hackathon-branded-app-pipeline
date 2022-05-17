// @flow
import React, { useState } from 'react';
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
import Collapse from '@material-ui/core/Collapse';
import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import Switch from '@material-ui/core/Switch';

import { makeStyles } from '@material-ui/core';

import RedButton from '../../../components/button/RedButton.component';
import OfferListItemV2 from '#libs/offer/components/OfferListItemV2.component';

import type { Booking } from '../types';

type Props = {
  offer: Offer,
  similarBookings: Booking[],
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

  t: TFunction,
};

export function RevertBookingDialog(props: Props) {
  const {
    t,
    offer,
    similarBookings,
    bookingToRevert,
    closeRevertBookingDialog,
    handleBookingDeletion,
    force_notify,
    force_refund,
    toogleForceNotify,
    toggleForceRefund,
  } = props;
  const classes = useStyles();
  const [similarOfferToCancel, setSimilarOfferToCancel] = useState<number[]>(
    [],
  );
  const [modifyRecursively, setModifyRecursively] = useState(false);
  const selectAll = () => {
    setSimilarOfferToCancel(similarBookings.map((o) => o.id));
  };

  const unselectAll = () => {
    setSimilarOfferToCancel([]);
  };

  const handleChangeSelection = (id: number) => () => {
    const indexOf = similarOfferToCancel.indexOf(id);
    if (indexOf === -1) {
      setSimilarOfferToCancel([...similarOfferToCancel, id]);
      return;
    }
    setSimilarOfferToCancel([
      ...similarOfferToCancel.splice(0, indexOf),
      ...similarOfferToCancel.splice(indexOf + 1),
    ]);
  };

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
        classes={{
          paper: classes.dialog,
        }}
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
          <div>
            <FormControlLabel
              control={
                <Checkbox checked={force_refund} onChange={toggleForceRefund} />
              }
              label={t('booking.refundRevert')}
            />
          </div>
          <div>
            <FormControlLabel
              control={
                <Checkbox checked={force_notify} onChange={toogleForceNotify} />
              }
              label={t('booking.notifyRevert')}
            />
          </div>
          {offer?.group && (
            <>
              <Alert
                severity="error"
                variant="outlined"
                className={classes.alert}
              >
                {t('booking.cancellingOtherBookingInGroup', {
                  name: offer?.group?.name,
                })}
              </Alert>
              <FormControlLabel
                label={t('booking.cancellingBookingInGroup')}
                control={
                  <Switch
                    color="primary"
                    checked={modifyRecursively}
                    onChange={(event) => {
                      setModifyRecursively(event.target.checked);
                    }}
                  />
                }
              />

              <Collapse in={modifyRecursively}>
                <ButtonBase
                  onClick={selectAll}
                  className={classes.selectOption}
                >
                  <Typography variant="caption">
                    {t('offer:liveOfferEdit.selectAll')}
                  </Typography>
                </ButtonBase>
                <ButtonBase
                  onClick={unselectAll}
                  className={classes.selectOption}
                >
                  <Typography variant="caption">
                    {t('offer:liveOfferEdit.unselectAll')}
                  </Typography>
                </ButtonBase>
                {!(similarBookings || []).length ? (
                  <div className={classes.noSimilarOfferMessage}>
                    <Typography variant="body">
                      {t('offer:liveOfferEdit.noSimilarOffer')}
                    </Typography>
                  </div>
                ) : (
                  <List component="nav">
                    <OfferListItemV2
                      similarOffer
                      offer={offer}
                      checked
                      disabled
                    />
                    {similarBookings.map((so) => (
                      <OfferListItemV2
                        key={so.id}
                        similarOffer
                        offer={so}
                        handleChange={handleChangeSelection(so.id)}
                        checked={similarOfferToCancel.includes(so.id)}
                      />
                    ))}
                  </List>
                )}
              </Collapse>
            </>
          )}
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
                  handleBookingDeletion(
                    {
                      force_notify,
                      force_refund,
                      bookings_in_same_group: modifyRecursively
                        ? similarOfferToCancel
                        : [],
                      activity_group: modifyRecursively
                        ? offer.group.id
                        : undefined,
                    },
                    {
                      onSuccess: () => props.setLoading(false),
                    },
                  );
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

const useStyles = makeStyles((theme: Theme) => ({
  dialog: {
    minWidth: 600,
  },
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
