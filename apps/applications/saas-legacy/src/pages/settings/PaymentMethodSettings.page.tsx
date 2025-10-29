import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { Paper, Theme, withStyles } from '@material-ui/core';

import {
  NOTIFICATION_INSTALMENT_PAYMENT_PAYMENT_METHOD_ABOUT_TO_EXPIRE_FIRST_WARNING,
  NOTIFICATION_INSTALMENT_PAYMENT_PAYMENT_METHOD_ABOUT_TO_EXPIRE_SECOND_WARNING,
  NOTIFICATION_PAYMENT_METHOD_EXPIRED_FIRST_WARNING,
  NOTIFICATION_PAYMENT_METHOD_EXPIRED_SECOND_WARNING,
} from '@bsport/common/lib/master-data/notification-rule-events.js';
import { MaterialStyleType } from '#src/utils/types';
import { RootState } from '#src/reducers';
import BackofficeLinearProgress from '#src/components/navigation/BackofficeLinearProgress.component';
import {
  fetchCompanyTheme as fetchCompanyThemeAction,
  updateCompanyTheme,
} from '#src/libs/theme/actions';
import { snackbarError, snackbarSuccess } from '#src/libs/snackbar/actions';
import type { PaymentMethodsFormValues } from '#src/libs/settings/components/PaymentMethodsForm/PaymentMethodsForm.component';
import PaymentMethodsForm from '#src/libs/settings/components/PaymentMethodsForm';

import { fetchSettingsList as fetchSettingsListAction } from '#src/libs/notification-rule/actions';
import {
  fetchStripePaymentMethodDomains as fetchStripePaymentMethodDomainsAction,
  registerStripePaymentMethodDomain as registerStripePaymentMethodDomainAction,
} from '#src/libs/payment/actions';
import { getStripeDomainListState } from '#src/libs/payment/selectors';
import type { NotificationRuleSettingsData } from '#src/libs/notification-rule/types';

type Props = ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps &
  MaterialStyleType<ReturnType<typeof styles>>;

class PaymentMethodSettings extends React.PureComponent<Props> {
  onSubmit = (
    values: Omit<PaymentMethodsFormValues, 'cardBillingDetailsMandatory'> & {
      force_billing_details_on_cards: boolean;
    },
  ) => {
    this.props.updateCompanyTheme(this.props.theme.company, values, {
      onSuccess: () => this.props.snackbarSuccess('dashboard.save.success'),
      onError: () => this.props.snackbarError('dashboard.save.error'),
    });
  };

  onRegisterStripeDomain = (domainName: string, onSuccess?: () => void) => {
    this.props.registerStripePaymentMethodDomain(domainName, { onSuccess });
  };

  componentDidMount(): void {
    this.props.fetchSettingsList();
    this.props.fetchCompanyTheme();
    this.props.fetchStripePaymentMethodDomains();
  }

  /**
   * Method that will return wether the company has enabled the email notifications
   * for the payment method expirations warnings.
   */
  arePaymentMethodExpirationRemindersMailsEnabled = (
    settingsData: NotificationRuleSettingsData,
  ) => {
    if (!settingsData.length) {
      return [true, true];
    }
    const settings = settingsData[0].settings;

    // first reminder
    const isFirstReminderMailEnabled =
      !settings[NOTIFICATION_PAYMENT_METHOD_EXPIRED_FIRST_WARNING]?.disabled ||
      !settings[
        NOTIFICATION_INSTALMENT_PAYMENT_PAYMENT_METHOD_ABOUT_TO_EXPIRE_FIRST_WARNING
      ]?.disabled;

    // second reminder
    const isSecondReminderMailEnabled =
      !settings[NOTIFICATION_PAYMENT_METHOD_EXPIRED_SECOND_WARNING]?.disabled ||
      !settings[
        NOTIFICATION_INSTALMENT_PAYMENT_PAYMENT_METHOD_ABOUT_TO_EXPIRE_SECOND_WARNING
      ]?.disabled;

    return [isFirstReminderMailEnabled, isSecondReminderMailEnabled];
  };

  render() {
    const { classes } = this.props;
    if (this.props.loading) {
      return (
        <div className={classes.container}>
          <BackofficeLinearProgress />
        </div>
      );
    }

    let payment_method_available_basket: number[] = [];
    let payment_method_available_subscription: number[] = [];
    if (
      this.props.theme &&
      this.props.theme.payment_method_available_basket &&
      this.props.theme.payment_method_available_subscription
    ) {
      payment_method_available_basket =
        this.props.theme.payment_method_available_basket;

      payment_method_available_subscription =
        this.props.theme.payment_method_available_subscription;
    }

    const [isFirstReminderMailEnabled, isSecondReminderMailEnabled] =
      this.arePaymentMethodExpirationRemindersMailsEnabled(
        this.props.settingsData,
      );

    return (
      <div className={classes.container}>
        <Paper className={classes.container}>
          <PaymentMethodsForm
            cardBillingDetailsMandatory={
              this.props.theme.force_billing_details_on_cards
            }
            disablePaymentExpiredFirstWarning={!isFirstReminderMailEnabled}
            disablePaymentExpiredSecondWarning={
              !isFirstReminderMailEnabled || !isSecondReminderMailEnabled
            }
            first_warning_payment_method_expiration_days={parseInt(
              this.props.theme.first_warning_payment_method_expiration_days,
            )}
            onRegisterStripeDomain={this.onRegisterStripeDomain}
            onSubmit={this.onSubmit}
            payment_method_available={this.props.theme.payment_method_available}
            payment_method_available_basket={payment_method_available_basket}
            payment_method_available_recurringly={
              this.props.theme.payment_method_available_recurringly
            }
            payment_method_available_subscription={
              payment_method_available_subscription
            }
            second_warning_payment_method_expiration_days={parseInt(
              this.props.theme.second_warning_payment_method_expiration_days,
            )}
            stripeDomainList={this.props.stripeDomainList}
            updateLoading={this.props.updateLoading}
          />
        </Paper>
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    height: '100%',
    padding: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState) => ({
  theme: state.theme.theme,
  loading: state.theme.loading,
  stripeDomainList: getStripeDomainListState(state),
  updateLoading: state.theme.createOrUpdate.loading,
  settingsData: state.notificationRule.settings.data,
});

const mapDispatchToProps = {
  updateCompanyTheme,
  snackbarSuccess,
  snackbarError,
  fetchSettingsList: fetchSettingsListAction,
  fetchCompanyTheme: fetchCompanyThemeAction,
  fetchStripePaymentMethodDomains: fetchStripePaymentMethodDomainsAction,
  registerStripePaymentMethodDomain: registerStripePaymentMethodDomainAction,
};

export default compose(
  // @ts-expect-error
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps),
  React.memo,
)(PaymentMethodSettings);
