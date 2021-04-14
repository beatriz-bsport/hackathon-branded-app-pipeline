// @flow
import React from 'react';

import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment-timezone';

import RedButton from '../../../components/button/RedButton.component';

type Props = {
  booking: ?Booking,
  t: TFunction,
  onSubmit: () => void,
  onCancel: () => void,
  onClose: ?() => void,
  fullScreen: boolean,
  open: boolean,
  processing: boolean,
  setProcessing: (boolean) => void,
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2),
  },
}));

export const BookingCancellationDialog = (props: Props) => {
  const classes = useStyles();
  return (
    <Dialog
      open={!!props.open}
      fullScreen={props.fullScreen}
      onClose={props.onClose}
    >
      <DialogTitle>
        {props.booking &&
        props.booking.offer &&
        props.booking.offer.timezone_name
          ? props.t('consumer.booking.intro', {
              date: moment(props.booking.offer.date_start)
                .tz(props.booking.offer.timezone_name)
                .format('LLLL'),
            })
          : props.t('consumer.booking.discardBookingTitle')}
      </DialogTitle>
      <div className={classes.container}>
        {!props.booking ? (
          <CircularProgress />
        ) : (
          <DialogContentText>
            {(props.booking || {}).is_discardable
              ? props.t('consumer.booking.discardPossibleExplain')
              : props.t('consumer.booking.discardImpossibleExplain')}
          </DialogContentText>
        )}
      </div>
      <DialogActions>
        <Button
          color="secondary"
          onClick={props.onCancel}
          disabled={props.processing}
        >
          {props.t('navigation.goBack')}
        </Button>
        {props.processing ? (
          <CircularProgress />
        ) : (
          <RedButton
            disabled={props.processing}
            onClick={() => {
              props.setProcessing(true);
              props.onSubmit({
                onSuccess: () => props.setProcessing(false),
                onError: () => props.setProcessing(false),
              });
            }}
          >
            {props.t('common.delete')}
          </RedButton>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default compose(
  withTranslation(),
  withMobileDialog(),
  withState('processing', 'setProcessing', false),
)(BookingCancellationDialog);
