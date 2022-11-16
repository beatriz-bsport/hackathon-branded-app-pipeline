import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { compose, withProps } from 'recompose';

import {
  WithStyles,
  createStyles,
  withStyles,
  Theme,
} from '@material-ui/core/styles';
import { withTranslation, WithTranslation } from 'react-i18next';
import { CircularProgress } from '@material-ui/core';

import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import withQueryParams from '../../hocs/with-query-params.hoc';
import { fetchMember } from '../../libs/member/actions';
import { RootState } from '../../reducers';
import { getTheme } from '#libs/theme/selectors';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';

import { fetchMembership as fetchMembershipAction } from '#libs/membership/actions';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '../../libs/theme/actions';

import { getMember } from '#libs/member/selectors';
import AddPaymentMethod from '#libs/payment/components/AddPaymentMethod.component';
import { fetchPaymentMethodList } from '#libs/payment/actions';

type OwnProps = {
  queryParams: RouterProps;
};

type RouterProps = {
  authToken: string;
  memberId: number;
  company: number;
};

type State = { paymentMethodType: string; isThemeLoading: boolean };

type Props = RouterProps &
  OwnProps &
  ConnectedProps<typeof connector> &
  WithStyles<typeof styles> &
  WithTranslation;

export class AddPaymentMethodWebview extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isThemeLoading: true,
      paymentMethodType: 'card',
    };
  }

  componentDidMount() {
    this.props.fetchCompanyTheme(this.props.company, {
      onSuccess: () => {
        this.setState({ isThemeLoading: false });
      },
    });

    this.props.fetchMember(this.props.memberId);
  }

  requestSetupIntentSecret = () => {
    return requestSetupIntentSecretAPI(this.props.member.id, null);
  };

  fetchMemberPaymentMethod = () => {
    this.props.fetchPaymentMethodListActions({ member: this.props.member.id });
  };

  changePaymentMethodType = (value: string) => {
    this.setState({ paymentMethodType: value });
  };

  onCancel = () => {
    window.ReactNativeWebView.postMessage(JSON.stringify({ status: 'cancel' }));
  };

  render() {
    const { memberId, company } = this.props;
    if (!memberId || !company) {
      return <div>Error -1</div>;
    }

    if (this.state.isThemeLoading || !this.props.member?.id) {
      return (
        <div className={this.props.classes.container}>
          <div className={this.props.classes.loadingContainer}>
            <CircularProgress />
          </div>
        </div>
      );
    }
    return (
      <div>
        <AddPaymentMethod
          requestSetupIntentSecret={this.requestSetupIntentSecret}
          refreshSavedPaymentMethodList={this.fetchMemberPaymentMethod}
          onCancel={this.onCancel}
          paymentMethodType={this.state.paymentMethodType}
          enabledPaymentMethods={[
            BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
            ...(this.props.theme.currency === 'eur'
              ? [BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA]
              : []),
          ]}
          onChange={this.changePaymentMethodType}
          sepaDefaultName={this.props.member ? this.props.member.name : ''}
          sepaDefaultEmail={this.props.member ? this.props.member.email : ''}
        />
      </div>
    );
  }
}

const connector = connect(
  (state: RootState, props: RouterProps) => ({
    member: getMember(state, props.memberId),
    theme: getTheme(state),
    auth: state.auth,
  }),
  {
    fetchMember,
    fetchCompanyTheme: fetchCompanyThemeAction,
    fetchMembership: fetchMembershipAction,
    fetchPaymentMethodListActions: fetchPaymentMethodList,
  },
);

const styles = (theme: Theme) =>
  createStyles({
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

export default compose<any, OwnProps>(
  withTranslation(''),
  withQueryParams([
    ['memberId', 'company', 'authToken'],
    'queryParams',
    'setQueryParams',
  ]),
  withProps(
    (props: {
      queryParams: { memberId: string; company: string; authToken: string };
    }) => {
      return {
        memberId: parseInt(props.queryParams.memberId),
        company: parseInt(props.queryParams.company),
        authToken: props.queryParams.authToken,
      };
    },
  ),
  withStyles(styles),
  connector,
)(AddPaymentMethodWebview);
