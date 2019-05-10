// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { goBack } from 'react-router-redux';
import { Elements, StripeProvider } from 'react-stripe-elements';

import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import Config from '../../config';
import { createFromPack } from '../../api/subscription';

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

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

export class SubscriptionCreate extends Component<Props, State> {
  state = {
    tempSubscription: null,
    stripe_token: null,
  };

  storeTempSubscription = (tempSubscription: ?SubscriptionData) => {
    console.log(tempSubscription);
    this.setState({ tempSubscription });
  };

  createSubscription = async (token: string) => {
    console.log(this.state.tempSubscription);
    console.log(token);
    const response = await createFromPack({
      ...this.state.tempSubscription,
      stripe_source: token,
    });
  };

  render() {
    return (
      <Paper className={this.props.classes.container}>
        {this.state.tempSubscription ? (
          <StripeProvider apiKey={STRIPE_KEY}>
            <Elements>
              <SubscriptionScheduleChecker
                subscriptionData={this.state.tempSubscription}
                onSubmit={this.createSubscription}
                onCancel={() => this.storeTempSubscription(null)}
              />
            </Elements>
          </StripeProvider>
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
