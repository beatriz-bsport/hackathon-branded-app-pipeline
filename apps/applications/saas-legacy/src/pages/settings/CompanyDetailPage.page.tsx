import React, { Component } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import {
  withStyles,
  WithStyles,
  Theme,
  createStyles,
} from '@material-ui/core/styles';
import { withTranslation } from 'react-i18next';
import { compose, withHandlers } from 'recompose';
import { push } from 'connected-react-router';
import Paper from '@material-ui/core/Paper';
import {
  snackbarError as snackbarErrorAction,
  snackbarSuccess as snackbarSuccessAction,
} from '#src/libs/snackbar/actions';
import {
  updatePlatformCustomerEntityVatInformation as updatePlatformCustomerEntityVatInformationAction,
  fetchPlatformCustomerEntity as fetchPlatformCustomerEntityAction,
} from '#src/libs/platform-billing/actions';
import {
  attachExternalAccount as attachExternalAccountAction,
  retrieveMyCompanySetup as retrieveMyCompanySetupAction,
  retrievePayPalCompany as retrievePayPalCompanyAction,
  fetchPayPalOnboardingLink as fetchPayPalOnboardingLinkAction,
  checkNoOtherCompanyWithSamePayPalAccount as checkNoOtherCompanyWithSamePayPalAccountAction,
} from '#src/libs/company/actions';
import { CompanySetup } from '#src/libs/company/types';
// @ts-expect-error
import CompanyDetail from '#src/components/companies/CompanyDetail.component';
import PayPalDetail from '#src/components/paypal/PayPalDetail.component';
import withTitle from '#src/hocs/with-title.hoc';
import { RootState } from '../../reducers';

import type { OptionCallback } from '../../state/types';

import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import { UPSELL_IDENTIFIER_PAYPAL } from '#src/libs/platform-billing/upsell-identifiers';
import { hasUpsellIdentifier } from '#src/libs/role/utils';
// @ts-expect-error
import withQueryParams from '#src/hocs/with-query-params.hoc';

const BUSINESS_ACCOUNT = 'BUSINESS_ACCOUNT';
const SUBSCRIBED_WITH_ALL_FEATURES = 'SUBSCRIBED_WITH_ALL_FEATURES';

type OwnProps = {
  companySetup: CompanySetup | null;
  retrieveMyCompanySetup: () => void;
  attachExternalAccount: (data: any, options: OptionCallback) => void;
  updateCompanyDetail: () => void;
  queryParams: {
    merchantIdInPayPal: string;
    isEmailConfirmed: string;
    permissionsGranted: string;
    riskStatus: string;
    accountStatus: string;
  };
};

type Props = OwnProps & WithStyles & ConnectedProps<typeof connector>;

export class CompanyDetailPage extends Component<Props> {
  componentDidMount(): void {
    this.props.retrieveMyCompanySetup();
    if (
      this.props.paypalIsAvailableInCountry &&
      hasUpsellIdentifier(UPSELL_IDENTIFIER_PAYPAL, this.props.featureList)
    ) {
      this.props.queryParams.merchantIdInPayPal &&
        this.props.checkNoOtherCompanyWithSamePayPalAccount(
          {
            merchantId: this.props.queryParams.merchantIdInPayPal,
          },
          {
            onSuccess: () => {
              if (this.hasBeenRedirectedAfterCompletePayPalOnboarding()) {
                this.props.snackbarSuccess('paypal.connectionAttemptSucceeded');
              }
            },
          },
        );
      this.props.retrievePayPalCompany();
      this.props.fetchPlatformCustomerEntity();
    }
  }
  hasBeenRedirectedAfterCompletePayPalOnboarding = () => {
    return (
      this.props.queryParams.isEmailConfirmed === 'true' &&
      this.props.queryParams.permissionsGranted === 'true' &&
      this.props.queryParams.riskStatus === SUBSCRIBED_WITH_ALL_FEATURES &&
      this.props.queryParams.accountStatus === BUSINESS_ACCOUNT
    );
  };

  render() {
    const {
      companySetup,
      classes,
      paypalAccountName,
      themeLoading,
      paypalAccountEmail,
      paypalCompanyStatusIsLoading,
      paypalAccountStatus,
      paypalAccountStatusError,
      paypalOnboardingLinkLoading,
      paypalOnboardingLinkRedirecting,
      paypalIsAvailableInCountry,
      featureList,
      fetchPayPalOnboardingLink,
      platformCustomerEntity,
      platformCustomerEntityLoading,
      updatePlatformCustomerEntityVatInformation,
      attachExternalAccount,
      redirectToPlatformBilling,
      updateCompanyDetail,
      fetchPlatformCustomerEntity,
    } = this.props;

    const isLoading =
      !companySetup ||
      paypalCompanyStatusIsLoading ||
      themeLoading ||
      platformCustomerEntityLoading;

    return (
      <div className={classes.container}>
        {isLoading ? (
          <BackofficeLinearProgress />
        ) : (
          <div className={classes.subContainer}>
            <Paper className={classes.container}>
              <CompanyDetail
                attachExternalAccount={attachExternalAccount}
                company={companySetup}
                currency={companySetup.currency}
                fetchPlatformCustomerEntity={fetchPlatformCustomerEntity}
                onSuccessDialogConfirmed={redirectToPlatformBilling}
                platformCustomerEntity={platformCustomerEntity}
                updateCompanyDetail={updateCompanyDetail}
                updatePlatformCustomerEntityVatInformation={
                  updatePlatformCustomerEntityVatInformation
                }
              />
            </Paper>
            {paypalIsAvailableInCountry &&
              hasUpsellIdentifier(UPSELL_IDENTIFIER_PAYPAL, featureList) && (
                <Paper className={classes.containerPayPal}>
                  <PayPalDetail
                    accountEmail={paypalAccountEmail}
                    accountName={paypalAccountName}
                    error={paypalAccountStatusError}
                    fetchPayPalOnboardingLink={fetchPayPalOnboardingLink}
                    paypalOnboardingLinkLoading={paypalOnboardingLinkLoading}
                    paypalOnboardingLinkRedirecting={
                      paypalOnboardingLinkRedirecting
                    }
                    status={paypalAccountStatus}
                  />
                </Paper>
              )}
          </div>
        )}
      </div>
    );
  }
}

const styles = (theme: Theme) =>
  createStyles({
    subContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(2),
      paddingTop: theme.spacing(1),
    },
    containerPayPal: {
      margin: theme.spacing(0.5),
    },
    container: {
      margin: theme.spacing(2),
    },
  });

const connector = connect(
  (state: RootState) => ({
    companySetup: state.company.setup,
    platformCustomerEntity: state.platformBilling.platformCustomerEntity?.data,
    platformCustomerEntityLoading:
      state.platformBilling.platformCustomerEntity?.loading,
    paypalCompanyStatusIsLoading: state.company.paypalCompanyStatus.loading,
    paypalAccountStatus: state.company.paypalCompanyStatus.data?.account_status,
    paypalAccountStatusError: state.company.paypalCompanyStatus.error,
    paypalAccountName:
      state.company.paypalCompanyStatus.data?.paypal_company.account_legal_name,
    paypalAccountEmail:
      state.company.paypalCompanyStatus.data?.paypal_company
        .account_primary_email,
    paypalOnboardingLinkLoading: state.company.paypalOnboardingLink.loading,
    paypalOnboardingLinkRedirecting:
      state.company.paypalOnboardingLink.redirecting,
    paypalIsAvailableInCountry:
      state.theme.theme.is_paypal_available_in_country,
    featureList: state.company.feature.data.upsell,
    themeLoading: state.theme.loading,
  }),
  {
    retrieveMyCompanySetup: retrieveMyCompanySetupAction,
    fetchPlatformCustomerEntity: fetchPlatformCustomerEntityAction,
    updatePlatformCustomerEntityVatInformation:
      updatePlatformCustomerEntityVatInformationAction,
    retrievePayPalCompany: retrievePayPalCompanyAction,
    fetchPayPalOnboardingLink: fetchPayPalOnboardingLinkAction,
    updateCompanyDetail: () => push('/settings/company_onboarding'),
    redirectToPlatformBilling: () => push('/settings/platform-billing'),
    attachExternalAccount: attachExternalAccountAction,
    snackbarError: snackbarErrorAction,
    snackbarSuccess: snackbarSuccessAction,
    checkNoOtherCompanyWithSamePayPalAccount:
      checkNoOtherCompanyWithSamePayPalAccountAction,
  },
);
export default compose(
  withStyles(styles),
  withTranslation(['settings', 'platformBilling']),
  withTitle(({ t }) => t('tab.company')),
  withQueryParams([
    [
      'merchantIdInPayPal',
      'isEmailConfirmed',
      'permissionsGranted',
      'riskStatus',
      'accountStatus',
    ],
    'queryParams',
  ]),
  connector,
  withHandlers({
    fetchPayPalOnboardingLink:
      ({ fetchPayPalOnboardingLink, snackbarError }) =>
      (options: OptionCallback<{ onboarding_url: string }>) => {
        fetchPayPalOnboardingLink({
          onError: (error: Error) => {
            snackbarError('paypal.onboardingUrlFetchFailed');
            if (options && options.onError) options.onError(error);
          },
          onSuccess: (data: { onboarding_url: string }) => {
            if (options && options.onSuccess) options.onSuccess(data);
          },
        });
      },
    attachExternalAccount:
      ({ attachExternalAccount, retrieveMyCompanySetup }) =>
      // @ts-expect-error
      (data, options) => {
        attachExternalAccount(data, {
          onSuccess: () => {
            retrieveMyCompanySetup({
              onError: options && options.onError,
              onSuccess: (setup: CompanySetup) => {
                if (options && options.onSuccess) options.onSuccess(setup);
              },
            });
          },
          onError: options && options.onError,
        });
      },
  }),
)(CompanyDetailPage);
