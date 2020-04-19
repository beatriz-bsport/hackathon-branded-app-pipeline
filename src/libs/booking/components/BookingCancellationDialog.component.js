// @flow
import React from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import { compose, withState } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';

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

export const BookingCancellationDialog = (props: Props) => (
  <Dialog
    open={!!props.open}
    fullScreen={props.fullScreen}
    onClose={props.onClose}
  >
    <DialogTitle>{props.t('consumer.booking.discardBookingTitle')}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {(props.booking || {}).is_discardable
          ? props.t('consumer.booking.discardPossibleExplain')
          : props.t('consumer.booking.discardImpossibleExplain')}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button
        color="secondary"
        onClick={props.onCancel}
        disabled={props.processing}
      >
        {props.t('common.cancel')}
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

export default compose(
  withNamespaces(),
  withMobileDialog(),
  withState('processing', 'setProcessing', false),
)(BookingCancellationDialog);
