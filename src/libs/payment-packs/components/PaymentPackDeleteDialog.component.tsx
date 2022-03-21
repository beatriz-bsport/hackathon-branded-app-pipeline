// @flow
import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogContentText from '@material-ui/core/DialogContentText';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { useTranslation } from 'react-i18next';
import WarningIcon from '@material-ui/icons/Warning';

import { makeStyles } from '@material-ui/core';
import RedButton from '../../../components/button/RedButton.component';
import type { PaymentPack } from '../types';

type Props = {
  fullScreen: boolean;
  open: boolean;
  pack: PaymentPack;
  isUsedInCombo: boolean;
  consumerPackSummary: React.Node;
  onDelete: () => void;
  onCancel: (consumerPackId: number) => void;
};

export function PaymentPackDeleteDialog(props: Props) {
  const { fullScreen, onCancel, open } = props;
  const { t } = useTranslation('paymentPack');
  const classes = useStyles();
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={onCancel}
      fullWidth
      maxWidth="md"
      scroll="body"
    >
      <DialogTitle>
        {`${t('form.paymentPack.delete.title')} ${
          props.pack ? props.pack.name : null
        }`}
      </DialogTitle>
      <DialogContent>
        {props.pack?.linked_private_pass && (
          <DialogContentText className={classes.warningMessage}>
            <WarningIcon
              fontSize="large"
              color="error"
              size={32}
              className={classes.warningIcon}
            />
            <Typography>
              {t('universalPass.delete.dialog.warningText')}
            </Typography>
          </DialogContentText>
        )}
        {props.isUsedInCombo && (
          <DialogContentText className={classes.warningMessage}>
            <WarningIcon
              fontSize="large"
              color="error"
              size={32}
              alignItems="center"
              className={classes.warningIcon}
            />
            <Typography>
              {t('form.paymentPack.delete.isUsedInCombo')}
            </Typography>
          </DialogContentText>
        )}
        <DialogContentText className={classes.warningMessage}>
          <WarningIcon
            fontSize="large"
            color="error"
            size={32}
            alignItems="center"
            className={classes.warningIcon}
          />
          <Typography>
            {t('form.paymentPack.delete.thereAreConsumers')}
          </Typography>
        </DialogContentText>
        <div className={classes.framed}>{props.consumerPackSummary}</div>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel} variant="outlined" color="secondary">
          {t('form.paymentPack.delete.actions.cancel')}
        </Button>
        <RedButton
          variant="contained"
          onClick={props.onDelete}
          delayBeforeActivation={3}
        >
          {t('form.paymentPack.delete.actions.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles((theme) => ({
  warningIcon: {
    marginRight: theme.spacing(2),
  },
  framed: {
    border: '2px solid #E8E8E8',
  },
  warningMessage: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
}));

export default withMobileDialog()(PaymentPackDeleteDialog);
