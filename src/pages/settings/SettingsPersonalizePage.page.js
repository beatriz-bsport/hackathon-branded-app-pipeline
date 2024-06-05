// @flow
import React, { Component } from 'react';
import Paper from '@material-ui/core/Paper';
import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { compose } from 'recompose';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import LinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';

import CommunicationPersonalizeForm from '#src/libs/communication-v2/components/CommunicationPersonalizeForm.component';
import CreditsPersonalizeForm from '#src/libs/theme/components/CreditsPersonalizeForm.component';
import ProductsOrderingPersonalizeForm from '#src/libs/theme/components/ProductsOrderingPersonalizeForm.component';
import {
  fetchCommunicationProviderSettings as fetchCommunicationProviderSettingsAction,
  updateCommunicationProviderSettings as updateCommunicationProviderSettingsAction,
} from '#src/libs/communication-v2/actions';
import { CommunicationProviderSettings } from '#src/libs/communication-v2/types';
import { getIsTwoWayEmailActivated } from '#src/libs/communication-v2/selectors';
import {
  fetchBookingFunnelConfiguration as fetchBookingFunnelConfigurationAction,
  updateBookingFunnelConfiguration as updateBookingFunnelConfigurationAction,
} from '#src/libs/marketplace/actions';
import { BookingFunnelConfiguration } from '#src/libs/marketplace/types';
import {
  getPaymentPackCategoryById,
  getPaymentPackCategoryWithNbItems,
} from '#src/libs/payment-packs/selectors';
import {
  fetchAllPaymentPackCategory as fetchAllPaymentPackCategoryAction,
  fetchPaymentPackList as fetchPaymentPackListAction,
} from '#src/libs/payment-packs/actions';
import { PaymentPackCategory } from '#src/libs/payment-packs/types';
import { fetchPaymentComboList as fetchPaymentComboListAction } from '#src/libs/payment-combo/actions';
import { getPaymentComboList } from '#src/libs/payment-combo/selectors';
import { fetchContractList as fetchContractListAction } from '#src/libs/subscription/actions';
import { getAvailableContractListCustomer } from '#src/libs/subscription/selectors';
import CheckInTabletSettingsForm from '#src/libs/theme/components/CheckInTabletSettingsForm.component';
import Config from '../../config';
import withTitle from '../../hocs/with-title.hoc';
import themeSelectors from '../../libs/theme/selectors';
import {
  updateCompanyTheme as updateCompanyThemeAction,
  fetchCompanyTheme as fetchCompanyThemeAction,
} from '../../libs/theme/actions';
import ThemePersonalizeForm from '../../libs/theme/components/ThemePersonalizeForm.component';
import type { CompanyTheme } from '../../libs/theme/types';
import { FeatureList } from '../../libs/company/types';
import { UPSELL_IDENTIFIER_INBOX } from '../../libs/platform-billing/upsell-identifiers';
import { hasUpsell } from '../../libs/platform-billing/utils';
import FeatureListProvider from '../../libs/company/hocs/feature-list-provider.hoc';

type Props = {
  theme: CompanyTheme,
  themeLoading: boolean,
  themeProcessing: boolean,
  submitTheme: (companyId: number, data: *) => void,
  fetchCompanyTheme: () => void,
  classes: any,
  isTwoWayEmailActivated: boolean,
  fetchCommunicationProviderSettings: (kind: string) => void,
  updateCommunicationProviderSettings: (
    kind: string,
    data: CommunicationProviderSettings,
  ) => void,
  communicationProviderSettingsLoading: boolean,
  companyId: number,
  bookingFunnelConfiguration: BookingFunnelConfiguration,
  paymentPackCategories: { [key: number]: PaymentPackCategory },
  fetchBookingFunnelConfiguration: () => void,
  fetchAllPaymentPackCategory: () => void,
} & WithTranslation;

export class ThemePersonalize extends Component<Props> {
  componentDidMount() {
    this.props.fetchCompanyTheme(undefined, {
      onSuccess: (theme) =>
        this.props.fetchBookingFunnelConfiguration(theme.company),
    });
    this.props.fetchCommunicationProviderSettings('email');
    this.props.fetchAllPaymentPackCategory();
    this.props.fetchPaymentPackList({
      disabled: false,
      manager_only: false,
      page_size: 70000,
    });
    this.props.fetchPaymentComboList({ disabled: false, manager_only: false });
    this.props.fetchContractList({ disabled: false, manager_only: false });
  }

  render() {
    const {
      classes,
      theme,
      submitTheme,
      themeProcessing,
      updateCommunicationProviderSettings,
      fetchCompanyTheme,
      isTwoWayEmailActivated,
      communicationProviderSettingsLoading,
      companyId,
      bookingFunnelConfiguration,
      submitBookingFunnelConfiguration,
      paymentPackCategories,
      paymentPackByCategorySummary,
      paymentComboNumberItems,
      contractNumberItems,
      t,
    } = this.props;

    const getShouldDisplayCommunicationForm = (featureList: FeatureList) =>
      Config.REACT_APP_SENTRY_ENVIRONMENT !== 'production' ||
      companyId === 498 ||
      hasUpsell(featureList, UPSELL_IDENTIFIER_INBOX);

    return (
      <>
        {this.props.themeLoading && <LinearProgress />}
        <div className={classes.container}>
          <Paper className={classes.paper}>
            <ThemePersonalizeForm
              onSubmit={submitTheme}
              processing={themeProcessing}
              theme={theme}
            />
          </Paper>

          <FeatureListProvider>
            {(featureList: FeatureList) => (
              <>
                {!communicationProviderSettingsLoading &&
                  getShouldDisplayCommunicationForm(featureList) && (
                    <Paper className={classes.paper}>
                      <CommunicationPersonalizeForm
                        companyId={theme.company}
                        fetchCompanyTheme={fetchCompanyTheme}
                        is_two_way_email_activated={isTwoWayEmailActivated}
                        updateCommunicationProviderSettingsAction={
                          updateCommunicationProviderSettings
                        }
                      />
                    </Paper>
                  )}
              </>
            )}
          </FeatureListProvider>

          <Paper className={classes.paper}>
            <div className={classes.main}>
              <Typography className={classes.namesHeader}>
                {t('forms.productsThemePersonalization.title')}
              </Typography>
              <CreditsPersonalizeForm
                onSubmit={submitTheme}
                productTheme={{
                  company: theme.company,
                  hide_credits_for_customers: theme.hide_credits_for_customers,
                }}
              />
              {theme.display_new_checkout_flow && (
                <>
                  <Divider className={classes.divider} />
                  <ProductsOrderingPersonalizeForm
                    companyId={theme?.company}
                    contractNumberItems={contractNumberItems}
                    currentPricingOptionOrdering={
                      bookingFunnelConfiguration?.current_pricing_option_ordering ??
                      []
                    }
                    customPricingOptionOrdering={
                      bookingFunnelConfiguration?.custom_pricing_option_ordering ??
                      []
                    }
                    customPricingOptionOrderingEnabled={
                      bookingFunnelConfiguration?.custom_pricing_option_ordering_enabled
                    }
                    onSubmit={submitBookingFunnelConfiguration}
                    paymentComboNumberItems={paymentComboNumberItems}
                    paymentPackByCategorySummary={paymentPackByCategorySummary}
                    paymentPackCategories={paymentPackCategories}
                  />
                </>
              )}
            </div>
          </Paper>
          <Paper className={classes.paper}>
            <CheckInTabletSettingsForm
              company={theme.company}
              minute={theme.checkin_tablet_visible_session_cutoff_minute}
              onSubmit={submitTheme}
            />
          </Paper>
        </div>
      </>
    );
  }
}

const styles = (theme) => ({
  container: {
    padding: theme.spacing(2),
    paddingTop: theme.spacing(1),
    paddingBottom: '20vh',
  },
  paper: {
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    borderRadius: 12,
  },
  main: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(4),
  },
  namesHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    margin: `${theme.spacing(2)}px 0`,
  },
  divider: {
    marginTop: theme.spacing(1),
  },
});

export default compose(
  connect(
    (state) => ({
      theme: themeSelectors.getTheme(state),
      themeLoading: state.theme.loading,
      themeProcessing: state.theme.createOrUpdate.loading,
      companyId: state.theme.theme.company,
      isTwoWayEmailActivated: getIsTwoWayEmailActivated(state),
      communicationProviderSettingsLoading:
        state.communicationV2.company_communication_provider.email.loading,
      bookingFunnelConfiguration: state.marketplace.bookingFunnel.configuration,
      paymentPackCategories: getPaymentPackCategoryById(state),
      paymentPackByCategorySummary: getPaymentPackCategoryWithNbItems(state),
      paymentComboNumberItems: getPaymentComboList(state).length,
      contractNumberItems: getAvailableContractListCustomer(state).length,
    }),
    {
      fetchCompanyTheme: fetchCompanyThemeAction,
      submitTheme: updateCompanyThemeAction,
      fetchCommunicationProviderSettings:
        fetchCommunicationProviderSettingsAction,
      updateCommunicationProviderSettings:
        updateCommunicationProviderSettingsAction,
      fetchBookingFunnelConfiguration: fetchBookingFunnelConfigurationAction,
      submitBookingFunnelConfiguration: updateBookingFunnelConfigurationAction,
      fetchAllPaymentPackCategory: fetchAllPaymentPackCategoryAction,
      fetchPaymentPackList: fetchPaymentPackListAction,
      fetchPaymentComboList: fetchPaymentComboListAction,
      fetchContractList: fetchContractListAction,
    },
  ),
  withStyles(styles),
  withTranslation(['theme']),
  withTitle(({ t }) => t('pageTitles.personalization')),
)(ThemePersonalize);
