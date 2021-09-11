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
import BackofficeLinearProgress from '../../components/navigation/BackofficeLinearProgress.component';
import {
  fetchSubscriptionListByMember,
  switchSubscriptionPaymentMethod as switchSubscriptionPaymentMethodAction,
} from '../../libs/subscription/actions';
import { getSubscriptionListByMember } from '../../libs/subscription/selectors';
import { urlToMarketplace } from '../../libs/marketplace/utils';
import SubscriptionPaymentMethodSwitcherDialog from '../../libs/subscription/components/SubscriptionPaymentMethodSwitcherDialog.component';
import SubscriptionListItem from '../../libs/subscription/components/billing-plan/SubscriptionListItem.component';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';

import { WidgetUtils } from '../../libs/widget/WidgetUtils';

import type { Subscription } from '../../libs/subscription/types';
import type { Membership } from '../../libs/membership/types';
import { fetchMember } from '../../libs/member/actions';
import { getMember } from '../../libs/member/selectors';
import { Member } from '../../libs/member/types';

type Props = {
  subscriptionList: Array<Subscription>,
  membership: Membership,
  classes: any,
  subscriptionLoading: boolean,
  hideButtonOnWidget: boolean,
  fetchSubscriptionListByMember: (
    member: number,
    data: { page: number, page_size: number },
  ) => void,
  t: TFunction,
  goToSubscription: (companyName: string, companyId: number) => void,
  subscriptionSelected: ?Subscription,
  selectSubscription: (subscription: ?Subscription) => void,
  setSwitchPaymentMethodDialogOpen: (id: ?number) => void,
  switchPaymentMethodDialogOpen: number,
  switchPaymentMethod: ?(data: any) => void,

  requestSetupIntentSecret: () => void,
  fetchPaymentMethodList: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,
  fetchMember: () => void,
  member: Member,
};

export class ConsumerSubscription extends React.Component<Props> {
  componentDidMount() {
    this.fetchSubscriptionList(1, {});
    this.props.fetchPaymentMethodList();
    this.props.fetchMember(this.props.membership.id);
  }

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

  renderButton = () => {
    if (!this.props.hideButtonOnWidget && !WidgetUtils.isWidget()) {
      return (
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
      );
    }
    return null;
  };

  render() {
    return (
      <div className={this.props.classes.table}>
        {this.props.subscriptionLoading && <BackofficeLinearProgress />}
        <div className={this.props.classes.header}>{this.renderButton()}</div>
        {!this.props.subscriptionLoading &&
        !!this.props.subscriptionList &&
        this.props.subscriptionList.length === 0 ? (
          <Typography className={this.props.classes.paddedContent}>
            {this.props.t('subscription.isEmpty')}
          </Typography>
        ) : null}
        {this.props.subscriptionList.map((sub) => (
          <SubscriptionListItem
            subscription={sub}
            changePaymentMethod={this.props.setSwitchPaymentMethodDialogOpen}
            paymentMethodList={this.props.savedPaymentMethodList}
          />
        ))}
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
            member={this.props.member}
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
  paddedContent: {
    margin: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['consumerSpace']),
  withStyles(styles),
  withState('subscriptionSelected', 'selectSubscription', null),
  connect(
    (state, ownProps) => ({
      subscriptionList: getSubscriptionListByMember(state),
      subscriptionLoading:
        state.subscription.byMember.loading ||
        state.subscription.loading ||
        state.subscription.list.loading,
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      member: getMember(state, ownProps.membership.id),
    }),
    {
      fetchPaymentMethodList: fetchPaymentMethodListAction,
      fetchSubscriptionListByMember,
      goToSubscription: (name, id) =>
        push(`${urlToMarketplace(name, id)}/subscription`),
      switchSubscriptionPaymentMethod: switchSubscriptionPaymentMethodAction,
      fetchMember,
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
