// @flow
import React, { Component } from 'react';

import {
  withStyles,
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  withMobileDialog,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import WarningIcon from '@material-ui/icons/Warning';
import ConsumersPackSummaryTable from '../payment-pack/ConsumersPackSummaryTable.component';
import RedButton from '../button/RedButton.component';

type Props = {
  t: (x: string) => string,
  classes: Object,
  pack: PaymentPack,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  updatingConsumerPacks: Array<number>,
  onCancel: (consumerPackId: number) => void,
  onDelete: () => void,
  fullScreen: boolean,
  open: boolean,
};

export class PaymentPackDeleteDialog extends Component<Props> {
  renderCheckConsumerPacks = () => {
    const {
      t,
      pack,
      incrementCredit,
      decrementCredit,
      updatingConsumerPacks,
    } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          {this.renderWarningMessage(
            t('form.paymentPack.delete.thereAreConsumers'),
          )}
        </Grid>
        <Grid item>
          <ConsumersPackSummaryTable
            incrementCredit={incrementCredit}
            updatingConsumerPacks={updatingConsumerPacks}
            decrementCredit={decrementCredit}
            paymentPack={pack}
          />
        </Grid>
      </Grid>
    );
  };

  renderWarningMessage = (text: string) => {
    return (
      <DialogContentText>
        <Grid
          container
          direction="row"
          spacing={16}
          alignItems="center"
          className={this.props.classes.warningMessage}
        >
          <Grid item>
            <WarningIcon
              fontSize="large"
              color="error"
              size={32}
              alignItems="center"
            />
          </Grid>
          <Grid item>
            <Typography>{text}</Typography>
          </Grid>
        </Grid>
      </DialogContentText>
    );
  };

  renderConfirmation = () => {
    return (
      <Grid container direction="row" spacing={16}>
        <Grid item>
          <WarningIcon
            fontSize="large"
            color="error"
            size={32}
            alignItems="center"
          />
        </Grid>
        <Grid item>
          <Typography />
        </Grid>
      </Grid>
    );
  };

  renderContent = () => {
    if (!this.props.pack) {
      return null;
    }
    if (this.props.pack.consumer_payment_packs.length) {
      return this.renderCheckConsumerPacks();
    }
    return this.renderWarningMessage(
      this.props.t('form.paymentPack.delete.askConfirmation'),
    );
  };

  render() {
    const { t, fullScreen, onCancel, open } = this.props;
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
            this.props.pack ? this.props.pack.name : null
          }`}
        </DialogTitle>
        <DialogContent>{this.renderContent()}</DialogContent>
        <DialogActions>
          <Button
            onClick={this.props.onCancel}
            variant="outlined"
            color="secondary"
          >
            {t('common.cancel')}
          </Button>
          <RedButton variant="contained" onClick={this.props.onDelete}>
            {t('common.delete')}
          </RedButton>
        </DialogActions>
      </Dialog>
    );
  }
}

const styles = (theme) => ({
  warningMessage: {
    backgroundColor: '#F8F8F8',
    padding: theme.spacing.unit,
  },
});

export default withMobileDialog()(
  withStyles(styles)(translate()(PaymentPackDeleteDialog)),
);
