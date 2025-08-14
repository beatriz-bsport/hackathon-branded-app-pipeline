import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';

import { PAYMENT_ENGINE_STRIPE } from '@bsport/common/lib/master-data/payment-group.js';

import withStyles from '@material-ui/styles/withStyles';
import { CircularProgress } from '@material-ui/core';

import type { Theme } from '#src/libs/theme/types';
import { fetchMembership as fetchMembershipAction } from '#src/libs/membership/actions';
import { Membership } from '#src/libs/membership/types';
import type { StripeInit } from '#src/libs/payment/types';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';

import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAction } from '../../libs/subscription/actions';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import { getMember } from '../../libs/member/selectors';
import { fetchMember } from '../../libs/member/actions';
import { RootState } from '../../reducers';
// @ts-expect-error
import withQueryParams from '../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { MaterialStyleType } from '../../utils/types';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '../../libs/theme/actions';

const SubscriptionPayment = asyncComponent(
  () =>
    // @ts-expect-error
    import('../../libs/subscription/components/SubscriptionPayment.component'),
);

type OwnProps = {
  query: {
    member: string;
    company: string;
  };
  subscription: number;
  theme: Theme;
};
type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

interface State {
  processing: boolean;
  stripePromise: StripeInit | null;
}

class SubscriptionPaymentMethod extends React.PureComponent<Props, State> {
  state: State = {
    processing: false,
    stripePromise: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.fetchPaymentMethods();
    // @ts-expect-error
    this.props.fetchMembership(this.props.query.member, {
      onSuccess: (membership: Membership) => {
        this.props.fetchCompanyTheme(membership.company, {
          onSuccess: (theme) =>
            this.setState({ stripePromise: loadStripe(theme.stripe_pk_key) }),
        });
      },
    });
    // @ts-expect-error
    this.props.fetchMember(this.props.query.member);
  };

  componentDidUpdate(prevProps: Props) {
    if (!prevProps.auth.authenticated && this.props.auth.authenticated) {
      this.fetchData();
    }
  }

  fetchPaymentMethods = () => {
    this.props.fetchPaymentMethodList({
      member: this.props.query.member,
    });
  };

  onCancel = () => {
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ status: 'cancel' }),
      );
    }
  };

  requestSetupIntentSecret = () =>
    // @ts-expect-error
    requestSetupIntentSecretAPI(null, this.props.query.company);

  render() {
    /**
     * This is for developers only
     * The user should only access this page with the given query params
     */
    if (
      !this.props.query.member ||
      !this.props.query.company ||
      !this.props.query.member
    ) {
      return <div>Error -1</div>;
    }

    if (!this.props.theme) {
      return (
        <div className={this.props.classes.container}>
          <div className={this.props.classes.loadingContainer}>
            <CircularProgress />
          </div>
        </div>
      );
    }
    return (
      <div className={this.props.classes.container}>
        <SubscriptionPayment
          cardBillingDetailsMandatory={
            this.props.theme.force_billing_details_on_cards
          }
          enabledPaymentGroupMethodIdentifier={
            this.props.theme?.payment_method_available_subscription || []
          }
          isExcludingTax={this.props.theme?.is_tax_excluded_in_marketplace}
          member={this.props.member}
          onCancel={this.onCancel}
          onSubmit={this.switchPaymentMethod}
          processing={this.state.processing}
          refreshSavedPaymentMethodList={this.fetchPaymentMethods}
          requestSetupIntentSecret={this.requestSetupIntentSecret}
          savedPaymentMethodList={this.props.savedPaymentMethodList}
          sepaDefaultEmail={this.props.member ? this.props.member.email : ''}
          sepaDefaultName={this.props.member ? this.props.member.name : ''}
          stripePromise={this.state.stripePromise}
        />
      </div>
    );
  }

  switchPaymentMethod = (source: string, payment_method_id: string) => {
    this.setState({ processing: true });
    this.props.switchSubscriptionPaymentMethod(
      {
        id: this.props.subscription,
        // @ts-expect-error
        is_v2: true,
        payment_method_id: source || payment_method_id,
        payment_engine: PAYMENT_ENGINE_STRIPE,
      },
      {
        onSuccess: () => {
          this.setState({ processing: false });
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ status: 'succeeded' }),
            );
          }
        },
        onError: () => {
          this.setState({ processing: false });
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ status: 'error' }),
            );
          }
        },
      },
    );
  };
}

// @ts-expect-error
const styles = (theme) => ({
  container: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
  },
  loadingContainer: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  savedPaymentMethodList: getSavedPaymentMethodList(state),
  // @ts-expect-error
  member: getMember(state, ownProps.query.member),
  auth: state.auth,
  theme: state.theme.theme,
});

const mapDispatchToProps = {
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
  fetchMember,
  fetchCompanyTheme: fetchCompanyThemeAction,
  fetchMembership: fetchMembershipAction,
};

export default compose(
  routerParamsToProps({ subscriptionId: 'subscription:number' }),
  withStyles(styles),
  withQueryParams([['member', 'company', 'subscription'], 'query', 'setQuery']),
  connect(mapStateToProps, mapDispatchToProps),
)(SubscriptionPaymentMethod);
