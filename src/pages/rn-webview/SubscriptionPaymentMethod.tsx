import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';

import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAction } from '../../libs/subscription/actions';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import SubscriptionPayment from '../../libs/subscription/components/SubscriptionPayment.component';
import { getMember } from '../../libs/member/selectors';
import { fetchMember } from '../../libs/member/actions';
import { RootState } from '../../reducers';
import withQueryParams from '../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

type OwnProps = {
  query: {
    member: string;
    company: string;
  };
  subscription: number;
};
type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;

interface State {
  processing: boolean;
}

class SubscriptionPaymentMethod extends React.PureComponent<Props, State> {
  state: State = {
    processing: false,
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.fetchPaymentMethods();
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
    window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'cancel' }));
  };

  requestSetupIntentSecret = () => {
    requestSetupIntentSecretAPI(null, this.props.query.company);
  };

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

    return (
      <SubscriptionPayment
        onSubmit={this.switchPaymentMethod}
        onCancel={this.onCancel}
        enabledPaymentMethods={[
          BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
          BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
        ]}
        refreshSavedPaymentMethodList={this.fetchPaymentMethods}
        member={this.props.member}
        processing={this.state.processing}
        savedPaymentMethodList={this.props.savedPaymentMethodList}
        requestSetupIntentSecret={this.requestSetupIntentSecret}
        sepaDefaultName={this.props.member ? this.props.member.name : ''}
        sepaDefaultEmail={this.props.member ? this.props.member.email : ''}
      />
    );
  }

  switchPaymentMethod = (source: string, payment_method_id: string) => {
    this.setState({ processing: true });
    this.props.switchSubscriptionPaymentMethod(
      this.props.subscription,
      {
        source: source || payment_method_id,
        payment_method_identifier: BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
      },
      {
        onSuccess: () => {
          this.setState({ processing: false });
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ status: 'succeeded' }),
          );
        },
        onError: () => {
          this.setState({ processing: false });
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ status: 'error' }),
          );
        },
      },
    );
  };
}

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  savedPaymentMethodList: getSavedPaymentMethodList(state),
  member: getMember(state, ownProps.query.member),
  auth: state.auth,
});

const mapDispatchToProps = {
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
  fetchMember,
};

export default compose(
  routerParamsToProps({ subscriptionId: 'subscription:number' }),
  withQueryParams([['member', 'company', 'subscription'], 'query', 'setQuery']),
  connect(mapStateToProps, mapDispatchToProps),
)(SubscriptionPaymentMethod);
