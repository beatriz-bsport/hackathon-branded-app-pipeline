// @flow
import React, { Component } from 'react';

import {
  withStyles,
  Typography,
  Grid,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  withMobileDialog,
} from '@material-ui/core';
import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import WarningIcon from '@material-ui/icons/Warning';
import ConsumersPackSummaryTable from '../payment-pack/ConsumersPackSummaryTable.component';
import RedButton from '../button/RedButton.component';

type Props = {
  fullScreen: boolean,
  open: boolean,
  consumerPacksFetching: boolean,

  pack: PaymentPack,
  updatingConsumerPacks: Array<number>,
  consumerPacks: Array<ConsumerPaymentPack>,

  onDelete: () => void,
  incrementCredit: (id: number) => void,
  decrementCredit: (id: number) => void,
  onCancel: (consumerPackId: number) => void,

  classes: Object,
  t: TFunction,
};

export class PaymentPackDeleteDialog extends Component<Props> {
  renderCheckConsumerPacks = () => {
    const {
      t,
      pack,
      incrementCredit,
      decrementCredit,
      updatingConsumerPacks,
      consumerPacksFetching,
      consumerPacks,
    } = this.props;
    return (
      <Grid container direction="column" spacing={16}>
        <Grid item>
          {this.renderWarningMessage(
            t('form.paymentPack.delete.thereAreConsumers'),
          )}
        </Grid>
        <Grid item>
          {consumerPacksFetching ? (
            <Grid container item justify="center" alignItems="center">
              <CircularProgress />
            </Grid>
          ) : (
            <ConsumersPackSummaryTable
              incrementCredit={incrementCredit}
              updatingConsumerPacks={updatingConsumerPacks}
              decrementCredit={decrementCredit}
              paymentPack={pack}
              consumerPacks={consumerPacks}
            />
          )}
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
    if (this.props.consumerPacks.length) {
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
  withStyles(styles)(withNamespaces()(PaymentPackDeleteDialog)),
);
