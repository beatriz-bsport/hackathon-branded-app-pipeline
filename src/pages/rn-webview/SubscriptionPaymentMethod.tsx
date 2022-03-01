import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import { PAYMENT_ENGINE_STRIPE } from '@bsport/common/lib/master-data/payment-group';

import withStyles from '@material-ui/styles/withStyles';
import { getSavedPaymentMethodList } from '#libs/payment/selectors';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '#libs/payment/actions';
import { switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAction } from '#libs/subscription/actions';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#libs/payment/api';
import SubscriptionPayment from '#libs/subscription/components/SubscriptionPayment.component';
import { getMember } from '#libs/member/selectors';
import { fetchMember } from '#libs/member/actions';
import { fetchMembership } from '#libs/membership/actions';
import { RootState } from '../../reducers';
import withQueryParams from '../../hocs/with-query-params.hoc';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { MaterialStyleType } from '../../utils/types';
import { fetchCompanyTheme } from '#libs/theme/actions';
import type { Membership } from '#libs/membership/types';

type OwnProps = {
  query: {
    member: string;
    company: string;
  };
  subscription: number;
};
type Props = OwnProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

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
    this.props.fetchMembership(this.props.query.member, {
      onSuccess: (membership: Membership) => {
        this.props.fetchCompanyTheme(membership.company);
      },
    });
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

  requestSetupIntentSecret = () =>
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
    return (
      <div className={this.props.classes.container}>
        <SubscriptionPayment
          onSubmit={this.switchPaymentMethod}
          onCancel={this.onCancel}
          enabledPaymentGroupMethodIdentifier={
            this.props.theme?.payment_method_available_subscription || []
          }
          refreshSavedPaymentMethodList={this.fetchPaymentMethods}
          member={this.props.member}
          processing={this.state.processing}
          savedPaymentMethodList={this.props.savedPaymentMethodList}
          requestSetupIntentSecret={this.requestSetupIntentSecret}
          sepaDefaultName={this.props.member ? this.props.member.name : ''}
          sepaDefaultEmail={this.props.member ? this.props.member.email : ''}
          enabledPaymentGroupMethodIdentifier={
            this.props.theme?.payment_method_available_subscription || []
          }
        />
      </div>
    );
  }

  switchPaymentMethod = (source: string, payment_method_id: string) => {
    this.setState({ processing: true });
    this.props.switchSubscriptionPaymentMethod(
      this.props.subscription,
      {
        is_v2: true,
        payment_method_id: source || payment_method_id,
        payment_engine: PAYMENT_ENGINE_STRIPE,
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

const styles = (theme) => ({
  container: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    width: '100%',
  },
});

const mapStateToProps = (state: RootState, ownProps: OwnProps) => ({
  savedPaymentMethodList: getSavedPaymentMethodList(state),
  member: getMember(state, ownProps.query.member),
  auth: state.auth,
  theme: state.theme.theme,
});

const mapDispatchToProps = {
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
  fetchMember,
  fetchCompanyTheme,
  fetchMembership,
};

export default compose(
  routerParamsToProps({ subscriptionId: 'subscription:number' }),
  withStyles(styles),
  withQueryParams([['member', 'company', 'subscription'], 'query', 'setQuery']),
  connect(mapStateToProps, mapDispatchToProps),
)(SubscriptionPaymentMethod);
