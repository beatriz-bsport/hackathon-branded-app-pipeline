// @ts-nocheck
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
import CircularProgress from '@material-ui/core/CircularProgress';

import type { RootState } from '../../reducers';
import withQueryParams from '../../hocs/with-query-params.hoc';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';
import { fetchMember } from '#libs/member/actions';
import { fetchMembership as fetchMembershipAction } from '#libs/membership/actions';
import { fetchPaymentMethodList } from '#libs/payment/actions';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#libs/payment/api';
import { getBackofficeBillingPlanEnabledPaymentMethods } from '#libs/payment/utils';
import {
  getCompanyCountry,
  getStripeRegion,
  getTheme,
} from '#libs/theme/selectors';
import { getMember } from '#libs/member/selectors';
import AddPaymentMethod from '#libs/payment/components/AddPaymentMethod.component';

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

    // The query param '?me=true' is here to force the retrieval of the member
    // even if the user is in fact a coach
    this.props.fetchMember(this.props.memberId, null, { me: true });
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
    const companyCountry = getCompanyCountry();
    const stripeRegion = getStripeRegion();

    const { memberId, company } = this.props;
    if (!memberId || !company) {
      return <div>Error -1</div>;
    }

    if (
      this.state.isThemeLoading ||
      !this.props.member?.id ||
      !stripeRegion ||
      !companyCountry
    ) {
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
          cardBillingDetailsMandatory={
            this.props.theme.force_billing_details_on_cards
          }
          enabledPaymentMethods={getBackofficeBillingPlanEnabledPaymentMethods({
            currency: this.props.theme.currency,
            companyCountry,
            stripeRegion,
          })}
          onCancel={this.onCancel}
          onChange={this.changePaymentMethodType}
          paymentMethodType={this.state.paymentMethodType}
          refreshSavedPaymentMethodList={this.fetchMemberPaymentMethod}
          requestSetupIntentSecret={this.requestSetupIntentSecret}
          sepaDefaultEmail={this.props.member ? this.props.member.email : ''}
          sepaDefaultName={this.props.member ? this.props.member.name : ''}
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
