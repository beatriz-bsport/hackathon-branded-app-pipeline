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
import { VALIDATION_DELAY } from '#src/libs/constants';

type Props = {
  fullScreen: boolean;
  open: boolean;
  pack: PaymentPack;
  isUsedInCombo: boolean;
  // @ts-expect-error
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
      fullWidth
      fullScreen={fullScreen}
      maxWidth="md"
      onClose={onCancel}
      open={open}
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
            {/* @ts-expect-error */}
            <WarningIcon
              className={classes.warningIcon}
              color="error"
              fontSize="large"
              size={32}
            />
            <Typography>
              {t('universalPass.delete.dialog.warningText')}
            </Typography>
          </DialogContentText>
        )}
        {props.isUsedInCombo && (
          <DialogContentText className={classes.warningMessage}>
            {/* @ts-expect-error */}
            <WarningIcon
              alignItems="center"
              className={classes.warningIcon}
              color="error"
              fontSize="large"
              size={32}
            />
            <Typography>
              {t('form.paymentPack.delete.isUsedInCombo')}
            </Typography>
          </DialogContentText>
        )}
        <DialogContentText className={classes.warningMessage}>
          {/* @ts-expect-error */}
          <WarningIcon
            alignItems="center"
            className={classes.warningIcon}
            color="error"
            fontSize="large"
            size={32}
          />
          <Typography>
            {t('form.paymentPack.delete.thereAreConsumers')}
          </Typography>
        </DialogContentText>
        <div className={classes.framed}>{props.consumerPackSummary}</div>
      </DialogContent>
      <DialogActions>
        {/* @ts-expect-error */}
        <Button color="secondary" onClick={props.onCancel} variant="outlined">
          {t('form.paymentPack.delete.actions.cancel')}
        </Button>
        <RedButton
          delayBeforeActivation={VALIDATION_DELAY}
          onClick={props.onDelete}
          variant="contained"
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
