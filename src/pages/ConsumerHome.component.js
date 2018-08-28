import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core';
import { translate } from 'react-i18next';
import { Switch, Route } from 'react-router-dom';

import MyBookings from './consumer/MyBookings.component';
import MyPaymentPacks from './consumer/MyPaymentPacks.component';
import MyBookingOptions from './consumer/MyBookingOptions.component';

import { ConsumerMenu } from '../components';

const styles = (theme) => ({
  container: {},
});

type Props = {};

export class ConsumerHome extends Component<Props> {
  render() {
    return (
      <ConsumerMenu>
        <Switch>
          <Route path="/pass" component={MyPaymentPacks} />
          <Route path="/waiting-list" component={MyBookingOptions} />
          <Route path="/" component={MyBookings} />
        </Switch>
      </ConsumerMenu>
    );
  }
}

export default withStyles(styles)(translate()(ConsumerHome));
