// @flow
import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import { compose } from 'recompose';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { withTranslation, TFunction } from 'react-i18next';
// eslint-disable-next-line bsport/no-redux-in-component
import { connect } from 'react-redux';
import { DateTime } from 'luxon';
import { CONTRACT_IS_ALREADY_SUBSCRIBED } from '@bsport/common/lib/master-data/error-codes/subscription';
import GenericDialogWithCountdownConfirm from '#src/components/genericDialog/GenericDialogWithCountdownConfirm.component';
import { getMarketplaceEnabledPaymentMethods } from '#src/libs/payment/utils';
import themeSelectors from '../../../libs/theme/selectors';

import SubscriptionContractCard from '../../../libs/subscription/components/SubscriptionContractCard.component';
import SubscriptionPayment from '../../../libs/subscription/components/SubscriptionPayment.component';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../../libs/payment/selectors';
import { registerContractBackground } from '../../../libs/subscription/actions';
import { COUNTDOWN_BEFORE_ACTIVATION } from '../constants';
import type { EstablishmentBillingGroup } from '../../../libs/establishment/types';
import analyticsUtils from '../../../components/analytics/analytics';

type Props = {
  t: TFunction,
  contract: ?Contract,
  fullScreen: boolean,
  onCancel: () => void,
  onSubmit: (contractId: number, success: boolean) => void,
  companyId: number,
  requestSetupIntentSecret: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  fetchPaymentMethodList: (params: any) => void,
  companyTheme: CompanyTheme,
  isExcludingTax?: boolean,
  registerContractBackground: (
    id: number,
    data: any,
    options: OptionCallback,
  ) => void,
  establishmentBillingGroups?: EstablishmentBillingGroup[],
  defaultBillingGroupFromOffer?: EstablishmentBillingGroup,
};

type State = {
  processing: boolean,
  firstBillingTimestamp: ?number,
  openGenericDialogWithCountdownConfirm: boolean,
};

export class SubscriptionContractBooking extends React.Component<Props, State> {
  state = {
    firstBillingTimestamp: null,
    processing: false,
    openGenericDialogWithCountdownConfirm: false,
  };

  disableOpenGenericDialogWithCountdownConfirm = () => {
    this.setState({ openGenericDialogWithCountdownConfirm: false });
  };

  onSubmit = async (
    token: string,
    payment_method_id: string,
    __,
    ___,
    options,
    coupon,
    ____,
    establishmentBillingGroupId: number,
  ) => {
    this.setState({ processing: true });
    try {
      const first_billing_timestamp = this.state.firstBillingTimestamp
        ? DateTime.fromISO(this.state.firstBillingTimestamp).toUnixInteger()
        : DateTime.now().toUnixInteger();
      this.props.registerContractBackground(
        this.props.contract.id,
        {
          stripe_source: token,
          first_billing_timestamp,
          payment_method_id,
          coupon,
          with_prorata: !!this.props.contract?.month_billing_day,
          establishment_billing_group_id: establishmentBillingGroupId,
        },
        {
          onBackgroundError: () => {
            this.setState({ processing: false });
            this.props.onSubmit(this.props.contract.id, false);
          },
          onError: (err) => {
            this.setState({ processing: false });
            if (
              err.response?.data?.error_code === CONTRACT_IS_ALREADY_SUBSCRIBED
            ) {
              this.setState({ openGenericDialogWithCountdownConfirm: true });
              options.onError(err);
            } else {
              this.props.onSubmit(this.props.contract.id, false);
            }
          },
          onBackgroundSuccess: () => {
            this.setState({ processing: false });
            this.props.onSubmit(this.props.contract.id, true);
            analyticsUtils.onContractPaymentSuccess(this.props.contract);
          },
        },
      );

      // this.setState({ firstBillingTimestamp });
    } catch (err) {
      this.props.onSubmit(this.props.contract.id, false);
      console.error(err);
    }
    this.setState({ processing: false });
  };

  render() {
    if (!this.state.firstBillingTimestamp) {
      return (
        <Dialog fullScreen={this.props.fullScreen} open={!!this.props.contract}>
          <div>
            <SubscriptionContractCard
              contract={this.props.contract}
              onPayRequest={(firstBillingTimestamp) => {
                this.setState({ firstBillingTimestamp });
              }}
            />
            <DialogActions>
              <Button onClick={this.props.onCancel}>
                {this.props.t('cancel')}
              </Button>
            </DialogActions>
          </div>
        </Dialog>
      );
    }
    return (
      <Dialog fullScreen={this.props.fullScreen} open={!!this.props.contract}>
        <DialogContent>
          <SubscriptionPayment
            withCoupon
            cardBillingDetailsMandatory={
              this.props.companyTheme.force_billing_details_on_cards
            }
            contract={this.props.contract}
            defaultBillingGroup={this.props.defaultBillingGroupFromOffer}
            enabledPaymentGroupMethodIdentifier={
              this.props.companyTheme.payment_method_available_subscription
            }
            enabledPaymentMethods={getMarketplaceEnabledPaymentMethods({
              paymentMethodAvailableSubscription:
                this.props.companyTheme.payment_method_available_subscription,
            })}
            enableMultiLocalization={
              this.props.companyTheme.enable_multi_localization
            }
            establishmentBillingGroups={this.props.establishmentBillingGroups}
            isExcludingTax={this.props?.isExcludingTax}
            onCancel={() => {
              this.setState({ firstBillingTimestamp: null });
              this.props.onCancel();
            }}
            onSubmit={this.onSubmit}
            processing={this.state.processing}
            refreshSavedPaymentMethodList={() =>
              this.props.fetchPaymentMethodList({
                company: this.props.companyId,
              })
            }
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
          />
        </DialogContent>
        <GenericDialogWithCountdownConfirm
          content={this.props.t('alreadySubscribed.dialog.content')}
          countdownBeforeActivation={COUNTDOWN_BEFORE_ACTIVATION}
          onValidate={this.disableOpenGenericDialogWithCountdownConfirm}
          open={this.state.openGenericDialogWithCountdownConfirm}
          title={this.props.t('alreadySubscribed.dialog.title')}
          validateLabel={this.props.t('alreadySubscribed.dialog.validate')}
        />
      </Dialog>
    );
  }
}

export default compose(
  withTranslation(['subscription']),
  withMobileDialog(),
  connect(
    (state) => ({
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      companyTheme: themeSelectors.getTheme(state),
    }),
    {
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      registerContractBackground,
    },
  ),
)(SubscriptionContractBooking);
