// @flow
import React, { Component } from 'react';

import { compose } from 'recompose';
import { connect } from 'react-redux';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import { push as pushRouter, goBack } from 'react-router-redux';
import { Elements, StripeProvider } from 'react-stripe-elements';

import { withNamespaces } from 'react-i18next';
import withTitle from '../../hocs/with-title.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import withFetchDetail from '../../hocs/with-fetch-details.hoc';
import Config from '../../config';
import LinearProgress from '../../components/navigation/BackofficeLinearProgress.component';

import api from '../../libs/subscription/api';
import { fetchMember } from '../../libs/member/actions';
import memberSelectors from '../../libs/member/selectors';
import SubscriptionCreateComponent from '../../libs/subscription/components/SubscriptionCreate.component';
import SubscriptionScheduleChecker from '../../libs/subscription/components/SubscriptionScheduleChecker.component';
import type { SubscriptionData } from '../../libs/subscription/types';
import { getEnabled as getPaymentPackEnabled } from '../../libs/payment-packs/selectors';
import type { PaymentPack } from '../../libs/payment-packs/types';

import type { Member } from '../../libs/member/types';

type Props = {
  member: Member,
  onCancel: () => void,
  paymentPacks: Array<PaymentPack>,
  pushToSubscription: (id: number) => void,
  classes: Object,
};
type State = {
  tempSubscription: ?SubscriptionData,
  processing: boolean,
};

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

export class SubscriptionCreate extends Component<Props, State> {
  state = {
    tempSubscription: null,
    processing: false,
  };

  storeTempSubscription = (tempSubscription: ?SubscriptionData) => {
    this.setState({ tempSubscription });
  };

  createSubscription = async (token: string) => {
    this.setState({ processing: true });
    try {
      const response = await api.createFromPack({
        ...this.state.tempSubscription,
        stripe_source: token,
      });
      this.props.pushToSubscription(response.data.id);
    } catch (err) {
      console.error(err);
    }
    this.setState({ processing: false });
  };

  render() {
    return (
      <div className={this.props.classes.container}>
        {this.state.processing ? <LinearProgress /> : null}
        {this.state.tempSubscription ? (
          <StripeProvider apiKey={STRIPE_KEY}>
            <Elements>
              <SubscriptionScheduleChecker
                subscriptionData={this.state.tempSubscription}
                onSubmit={this.createSubscription}
                onCancel={() => this.storeTempSubscription(null)}
                processing={this.state.processing}
              />
            </Elements>
          </StripeProvider>
        ) : (
          <Paper className={this.props.classes.paper}>
            <div className={this.props.classes.formContainer}>
              <SubscriptionCreateComponent
                paymentPacks={this.props.paymentPacks.filter(
                  (pp) => !pp.disabled,
                )}
                member={this.props.member}
                onSubmit={this.storeTempSubscription}
                onCancel={this.props.onCancel}
              />
            </div>
          </Paper>
        )}
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  paper: {
    maxWidth: 600,
    minWidth: '50wh',
  },
  formContainer: {
    padding: theme.spacing.unit * 2,
  },
});

export default compose(
  routerParamsToProps({ memberId: 'memberId:number' }),
  withStyles(styles),
  withNamespaces(['subscription']),
  withTitle(({ t }) => t('titles:subscription.subscriptionCreate')),
  connect(
    (state, { memberId }) => ({
      paymentPacks: getPaymentPackEnabled(state),
      memberLoading: state.member.loading,
      member: memberSelectors.get(state, memberId),
    }),
    {
      onCancel: goBack,
      pushToSubscription: (id) => pushRouter(`/subscription/${id}`),
      fetchMember,
    },
  ),
  withFetchDetail((props) => ({
    id: props.memberId,
    fetch: props.fetchMember,
    loading: props.memberLoading,
  })),
)(SubscriptionCreate);
