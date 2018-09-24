// @flow

import React, { Component } from 'react';

import { Grid, Typography, Switch, Button } from '@material-ui/core';
import { translate } from 'react-i18next';

import RedButton from '../button/RedButton.component';

type Props = {
  t: (x: string) => string,
  onCancel: () => void,
  onConfirm: () => void,
};

type State = {
  notifyConsumer: boolean,
};

export class DeleteOfferForm extends Component<Props, State> {
  state = {
    notifyConsumer: true,
  };

  onNotifySwitch = (event: Object) => {
    this.setState({ notifyConsumer: event.target.checked });
  };

  render() {
    const { t, onCancel, onConfirm } = this.props;
    const { notifyConsumer } = this.state;
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
        <Grid item>
          <Typography>{t('form.offer.explainDelete')}</Typography>
        </Grid>
        <Grid item>
          <Grid container direction="row" spacing={16} alignItems="center">
            <Grid item>
              <Switch checked={notifyConsumer} onChange={this.onNotifySwitch} />
            </Grid>
            <Grid item>
              <Typography>{t('form.offer.explainNotifyDelete')}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container item justify="flex-end">
            <Button onClick={onCancel}>{t('common.cancel')}</Button>
            <RedButton onClick={onConfirm}>{t('common.confirm')}</RedButton>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default translate()(DeleteOfferForm);
