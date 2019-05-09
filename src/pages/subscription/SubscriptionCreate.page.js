// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { goBack } from 'react-router-redux';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import SubscriptionCreateComponent from './SubscriptionCreate.component';
import SubscriptionScheduleChecker from './SubscriptionScheduleChecker.component';
import type { SubscriptionData } from './types';

type Props = {
  member: Member,
  onCancel: () => void,
  paymentPacks: Array<PaymentPack>,
  classes: Object,
};
type State = {
  tempSubscription: ?SubscriptionData,
};

export class SubscriptionCreate extends Component<Props, State> {
  state = {
    tempSubscription: {
      billing_anchor: 1558389600000,
      interval: 'month',
      member: 10993,
      name: '(1) Offre spéciale Ouverture',
      nb_interval: 12,
      paymentPack: 324,
      recurrent_price: 749,
    },
  };

  storeTempSubscription = (tempSubscription: ?SubscriptionData) => {
    console.log(tempSubscription);
    this.setState({ tempSubscription });
  };

  createSubscription = (data: SubscriptionData) => {
    console.log(data);
  };

  render() {
    return (
      <Paper className={this.props.classes.container}>
        {this.state.tempSubscription ? (
          <SubscriptionScheduleChecker
            subscriptionData={this.state.tempSubscription}
            onSubmit={this.createSubscription}
            onCancel={() => this.storeTempSubscription(null)}
          />
        ) : (
          <div className={this.props.classes.formContainer}>
            <SubscriptionCreateComponent
              paymentPacks={this.props.paymentPacks}
              member={this.props.member}
              onSubmit={this.storeTempSubscription}
              onCancel={this.props.onCancel}
            />
          </div>
        )}
      </Paper>
    );
  }
}

const styles = (theme) => ({
  container: {
    maxWidth: 600,
  },
  formContainer: {
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  routerParamsToProps({ memberId: 'memberId:number' }),
  withStyles(styles),
  connect(
    (state, { memberId }) => ({
      paymentPacks: state.paymentPack.all,
      member: state.member.all.find((m) => m.id === memberId),
    }),
    { onCancel: goBack },
  ),
)(SubscriptionCreate);
