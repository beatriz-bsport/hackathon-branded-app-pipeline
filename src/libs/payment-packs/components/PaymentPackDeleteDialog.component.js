// @flow
import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';
import DialogContentText from '@material-ui/core/DialogContentText';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';
import WarningIcon from '@material-ui/icons/Warning';

import RedButton from '../../../components/button/RedButton.component';

type Props = {
  fullScreen: boolean,
  open: boolean,

  pack: PaymentPack,
  consumerPackSummary: React.Node,

  onDelete: () => void,
  onCancel: (consumerPackId: number) => void,

  classes: Object,
  t: TFunction,
};

export function PaymentPackDeleteDialog(props: Props) {
  const { t, fullScreen, onCancel, open, classes } = props;
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
        <RedButton variant="contained" onClick={props.onDelete}>
          {t('form.paymentPack.delete.actions.submit')}
        </RedButton>
      </DialogActions>
    </Dialog>
  );
}

const styles = (theme) => ({
  warningIcon: {
    marginRight: theme.spacing.unit * 2,
  },
  framed: {
    border: '2px solid #E8E8E8',
  },
  warningMessage: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing.unit,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default withMobileDialog()(
  withStyles(styles)(withNamespaces(['paymentPack'])(PaymentPackDeleteDialog)),
);
