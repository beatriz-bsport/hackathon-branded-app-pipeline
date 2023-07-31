import React from 'react';

import { WithTranslation, withTranslation } from 'react-i18next';
import { compose, withStateHandlers } from 'recompose';

import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import RedButton from '../../../../components/button/RedButton.component';
import { PrivateBooking } from '../../types';
import { OptionCallback } from '../../../../state/types';
import { WithHandlerType } from '../../../../utils/types';

type OwnProps = {
  privateBooking: PrivateBooking;
  onSubmit: (options: OptionCallback) => void;
  onCancel: () => void;
  onClose?: () => void;
  fullScreen?: boolean;
  open: boolean;
};

type StateHandlerType = typeof withStateHandlersInit &
  WithHandlerType<typeof withStateHandlersSetter> &
  WithTranslation;

type Props = OwnProps & StateHandlerType;

export const PrivateBookingCancellationDialog = (props: Props) => (
  <Dialog
    open={!!props.open}
    fullScreen={props.fullScreen}
    onClose={props.onClose}
  >
    <DialogTitle>
      {props.t('privateService:privateBooking.delete.consumer.title')}
    </DialogTitle>
    <DialogContent>
      {!props.privateBooking ? (
        <CircularProgress />
      ) : (
        <DialogContentText>
          {props.privateBooking.is_discardable
            ? props.t(
                'privateService:privateBooking.delete.consumer.content.discardable',
              )
            : props.t(
                'privateService:privateBooking.delete.consumer.content.notDiscardable',
              )}
        </DialogContentText>
      )}
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

type StateHandlerInit = {
  processing: boolean;
};

const withStateHandlersInit: StateHandlerInit = {
  processing: false,
};

const withStateHandlersSetter = {
  setProcessing: () => (processing: boolean) => {
    return { processing };
  },
};

export default compose<any, OwnProps>(
  withTranslation(),
  withMobileDialog(),
  withStateHandlers(withStateHandlersInit, withStateHandlersSetter),
)(PrivateBookingCancellationDialog);
