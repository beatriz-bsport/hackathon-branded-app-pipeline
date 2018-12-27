// @flow

import React, { Component } from 'react';

import {
  Grid,
  CircularProgress,
  Typography,
  Switch,
  Button,
  withStyles,
} from '@material-ui/core';
import { translate } from 'react-i18next';

import RedButton from '../button/RedButton.component';

type Props = {
  t: (x: string) => string,
  onCancel: () => void,
  offerWasCancelled: ?boolean,
  processing: ?boolean,
  onHardDelete: () => void,
  onCancelOffer: ({ cashback: boolean, notify: boolean }) => void,
  classes: Object,
};

type State = {
  notify: boolean,
  cashback: boolean,
};

export class DeleteOfferForm extends Component<Props, State> {
  state = {
    notify: true,
    cashback: true,
  };

  onCreditBackSwitch = (event: Object) => {
    this.setState({ cashback: event.target.checked });
  };

  onNotifySwitch = (event: Object) => {
    this.setState({ notify: event.target.checked });
  };

  onConfirm = () => {
    const { offerWasCancelled } = this.props;
    const { notify, cashback } = this.state;
    if (offerWasCancelled) {
      return this.props.onHardDelete();
    }
    return this.props.onCancelOffer({ notify, cashback });
  };

  renderInside = () => {
    const { t, classes, offerWasCancelled } = this.props;
    if (offerWasCancelled) {
      return (
        <Typography>{t('form.offer.delete.explainHardDelete')}</Typography>
      );
    }
    const { notify, cashback } = this.state;
    return (
      <Grid container direction="column">
        <Grid item>
          <Typography className={classes.explainText}>
            {t('form.offer.delete.explainModalities')}
          </Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={16} alignItems="center">
            <Grid item>
              <Switch checked={cashback} onChange={this.onCreditBackSwitch} />
            </Grid>
            <Grid item>
              <Typography disabled>
                {t('form.offer.delete.explainCreditBack')}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={16} alignItems="center">
            <Grid item>
              <Switch checked={notify} onChange={this.onNotifySwitch} />
            </Grid>
            <Grid item>
              <Typography>{t('form.offer.delete.explainNotify')}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  };

  render() {
    const { t, processing, onCancel } = this.props;
    return (
      <Grid
        container
        direction="column"
        spacing={16}
        style={{ height: '100%' }}
      >
        <Grid item>
          <Typography variant="title">{t('form.offer.deleteTitle')}</Typography>
        </Grid>
        <Grid item>{this.renderInside()}</Grid>
        <Grid item>
          <Grid container item justify="flex-end">
            <Button onClick={onCancel}>{t('common.cancel')}</Button>
            {processing ? (
              <CircularProgress />
            ) : (
              <RedButton onClick={this.onConfirm}>
                {t('common.confirm')}
              </RedButton>
            )}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const styles = (theme) => ({
  explainText: {
    marginBottom: theme.spacing.unit * 2,
    padding: theme.spacing.unit * 2,
    backgroundColor: '#F2F2F2',
  },
});

export default translate()(withStyles(styles)(DeleteOfferForm));
