// @flow
import React from 'react';
import { compose, withState, withHandlers } from 'recompose';

import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';
import ReceiptIcon from '@material-ui/icons/Receipt';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';

import { push } from 'connected-react-router';
import { withTranslation } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';
import SubscriptionTable from '../../libs/subscription/components/SubscriptionTable.component';
import {
  fetchSubscriptionListByMember,
  switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAction,
} from '../../libs/subscription/actions';
import { getSubscriptionListByMember } from '../../libs/subscription/selectors';
import { urlToMarketplace } from '../../libs/marketplace/utils';
import SubscriptionPaymentMethodSwitcherDialog from '../../libs/subscription/components/SubscriptionPaymentMethodSwitcherDialog.component';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';

import type { Subscription } from '../../libs/subscription/types';
import type { Membership } from '../../libs/membership/types';

type Props = {
  subscriptionList: Array<Subscription>,
  membership: Membership,
  classes: Object,
  subscriptionCount: number,
  subscriptionLoading: boolean,
  fetchSubscriptionListByMember: (
    member: number,
    { page: number, page_size: number },
  ) => void,
  t: TFunction,
  goToSubscription: (string, number) => void,
  subscriptionSelected: ?Subscription,
  selectSubscription: (?Subscription) => void,
  setSwitchPaymentMethodDialogOpen: (?number) => void,
  switchPaymentMethodDialogOpen: number,
  switchPaymentMethod: ?(*) => void,

  requestSetupIntentSecret: () => void,
  fetchPaymentMethodList: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,
};

export class ConsumerSubscription extends React.Component<Props> {
  fetchSubscriptionList = (page: number, params) => {
    this.props.fetchSubscriptionListByMember(this.props.membership.id, {
      page,
      page_size: 10,
      ...params,
    });
  };

  selectSubscription = (id) => {
    this.props.selectSubscription(
      this.props.subscriptionList.find((sub) => sub.id === id),
    );
  };

  render() {
    return (
      <div className={this.props.classes.table}>
        <div className={this.props.classes.header}>
          <Button
            onClick={() =>
              this.props.goToSubscription(
                this.props.membership.company_name,
                this.props.membership.company,
              )
            }
            color="primary"
            variant="contained"
          >
            <ReceiptIcon className={this.props.classes.iconLeft} />
            {this.props.t('actions.goToSubscription')}
          </Button>
        </div>
        <SubscriptionTable
          showOnlyCore
          subscriptionList={this.props.subscriptionList}
          loading={this.props.subscriptionLoading}
          goToSubscription={this.selectSubscription}
          count={this.props.subscriptionCount}
          onPageChange={this.fetchSubscriptionList}
          addPayment={this.props.setSwitchPaymentMethodDialogOpen}
        />
        <Dialog open={!!this.props.subscriptionSelected}>
          {this.props.subscriptionSelected ? (
            <DialogTitle>{this.props.subscriptionSelected.name}</DialogTitle>
          ) : null}
          <DialogContent>
            {this.props.subscriptionSelected &&
            this.props.subscriptionSelected.description ? (
              <Typography>
                {this.props.subscriptionSelected.description}
              </Typography>
            ) : null}
            {this.props.subscriptionSelected &&
            this.props.subscriptionSelected.legal_contract ? (
              <Typography>
                {this.props.subscriptionSelected.legal_contract}
              </Typography>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.props.selectSubscription(null)}>
              {this.props.t('close')}
            </Button>
          </DialogActions>
        </Dialog>
        {this.props.switchPaymentMethodDialogOpen ? (
          <SubscriptionPaymentMethodSwitcherDialog
            open={this.props.switchPaymentMethodDialogOpen}
            onSubmit={this.props.switchPaymentMethod}
            savedPaymentMethodList={this.props.savedPaymentMethodList}
            refreshSavedPaymentMethodList={this.props.fetchPaymentMethodList}
            requestSetupIntentSecret={this.props.requestSetupIntentSecret}
            onCancel={() => this.props.setSwitchPaymentMethodDialogOpen(false)}
            enabledPaymentMethods={[
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
              BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
            ]}
          />
        ) : null}
      </div>
    );
  }
}
const styles = (theme) => ({
  table: {
    marginBottom: theme.spacing(2),
  },
  header: {
    display: 'flex',
    padding: theme.spacing(1),
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  iconLeft: {
    marginRight: theme.spacing(1),
  },
});

export default compose(
  withTranslation(['consumerSpace']),
  withStyles(styles),
  withState('subscriptionSelected', 'selectSubscription', null),
  connect(
    (state) => ({
      subscriptionList: getSubscriptionListByMember(state),
      subscriptionLoading: state.subscription.byMember.loading,
      subscriptionCount: state.subscription.byMember.count,
      savedPaymentMethodList: getSavedPaymentMethodList(state),
    }),
    {
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      fetchSubscriptionListByMember,
      goToSubscription: (name, id) =>
        push(`${urlToMarketplace(name, id)}/subscription`),
      switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
    },
  ),
  withState(
    'switchPaymentMethodDialogOpen',
    'setSwitchPaymentMethodDialogOpen',
    false,
  ),
  withHandlers({
    requestSetupIntentSecret: ({ membership }) => () =>
      requestSetupIntentSecretAPI(null, membership.company),
    fetchPaymentMethodList: ({ membership, fetchPaymentMethodList }) => () =>
      fetchPaymentMethodList({ company: membership.company }),
    switchPaymentMethod: ({
      switchPaymentMethodDialogOpen,
      switchSubscriptionPaymentMethod,
      setSwitchPaymentMethodDialogOpen,
    }) => (source, options, payment_method_id) => {
      switchSubscriptionPaymentMethod(
        switchPaymentMethodDialogOpen,
        {
          source: source || payment_method_id,
          payment_method_identifier: BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
        },
        {
          onSuccess: (sub) => {
            if (options && options.onSuccess) options.onSuccess(sub);
            setSwitchPaymentMethodDialogOpen(null);
          },
          onError: options ? options.onError : null,
        },
      );
    },
  }),
)(ConsumerSubscription);
