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
import { snackbarError as snackbarErrorAction } from '#src/libs/snackbar/actions';

import {
  attachExternalAccount as attachExternalAccountAction,
  retrieveMyCompanySetup as retrieveMyCompanySetupAction,
  retrievePayPalCompany as retrievePayPalCompanyAction,
  fetchPayPalOnboardingLink as fetchPayPalOnboardingLinkAction,
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

type OwnProps = {
  companySetup: CompanySetup | null;
  retrieveMyCompanySetup: () => void;
  attachExternalAccount: (data: any, options: OptionCallback) => void;
  updateCompanyDetail: () => void;
};

type Props = OwnProps & WithStyles & ConnectedProps<typeof connector>;

export class CompanyDetailPage extends Component<Props> {
  UNSAFE_componentWillMount() {
    this.props.retrieveMyCompanySetup();
    if (
      this.props.paypalIsAvailableInCountry &&
      hasUpsellIdentifier(UPSELL_IDENTIFIER_PAYPAL, this.props.featureList)
    ) {
      this.props.retrievePayPalCompany();
    }
  }

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
      paypalOnboardingLink,
      paypalOnboardingLinkLoading,
      paypalIsAvailableInCountry,
      featureList,
      fetchPayPalOnboardingLink,
      attachExternalAccount,
      redirectToPlatformBilling,
      updateCompanyDetail,
    } = this.props;

    const isLoading =
      !companySetup || paypalCompanyStatusIsLoading || themeLoading;

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
                onSuccessDialogConfirmed={redirectToPlatformBilling}
                updateCompanyDetail={updateCompanyDetail}
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
                    paypalOnboardingLink={paypalOnboardingLink}
                    paypalOnboardingLinkLoading={paypalOnboardingLinkLoading}
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
    paypalCompanyStatusIsLoading: state.company.paypalCompanyStatus.loading,
    paypalAccountStatus: state.company.paypalCompanyStatus.data?.account_status,
    paypalAccountStatusError: state.company.paypalCompanyStatus.error,
    paypalAccountName:
      state.company.paypalCompanyStatus.data?.paypal_company.account_legal_name,
    paypalAccountEmail:
      state.company.paypalCompanyStatus.data?.paypal_company
        .account_primary_email,
    paypalOnboardingLink: state.company.paypalOnboardingLink.data,
    paypalOnboardingLinkLoading: state.company.paypalOnboardingLink.loading,
    paypalIsAvailableInCountry:
      state.theme.theme.is_paypal_available_in_country,
    featureList: state.company.feature.data.upsell,
    themeLoading: state.theme.loading,
  }),
  {
    retrieveMyCompanySetup: retrieveMyCompanySetupAction,
    retrievePayPalCompany: retrievePayPalCompanyAction,
    fetchPayPalOnboardingLink: fetchPayPalOnboardingLinkAction,
    updateCompanyDetail: () => push('/settings/company_onboarding'),
    redirectToPlatformBilling: () => push('/settings/platform-billing'),
    attachExternalAccount: attachExternalAccountAction,
    snackbarError: snackbarErrorAction,
  },
);

export default compose(
  withStyles(styles),
  withTranslation(['settings']),
  withTitle(({ t }) => t('tab.company')),
  connector,
  withHandlers({
    fetchPayPalOnboardingLink:
      ({ fetchPayPalOnboardingLink, snackbarError }) =>
      (options: OptionCallback) => {
        fetchPayPalOnboardingLink({
          onError: (error: Error) => {
            snackbarError('paypal.onboardingUrlFetchFailed');
            if (options && options.onError) options.onError(error);
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
