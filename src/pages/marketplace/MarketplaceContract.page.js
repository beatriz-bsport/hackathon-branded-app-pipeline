// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withProps, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { Elements } from '@stripe/react-stripe-js';
import LinearProgress from '@material-ui/core/LinearProgress';
import Collapse from '@material-ui/core/Collapse';
import Modal from '@material-ui/core/Modal';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import moment from 'moment-timezone';
import { withRouter } from 'react-router-dom';
import { replace as replaceAction } from 'connected-react-router';
import { withTranslation } from 'react-i18next';

import { loadStripe } from '@stripe/stripe-js';
import themeSelectors, { getStripePkKey } from '../../libs/theme/selectors';

import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import { fetchPrivatePassBulk as fetchPrivatePassBulkAction } from '../../libs/private-service/actions';
import {
  getMarketplaceContractList as getContractList,
  withPaymentPack,
} from '../../libs/subscription/selectors';
import { fetchMarketplaceContractList } from '../../libs/subscription/actions';
import { postContractSubscription as postContractSubscriptionAPI } from '../../libs/subscription/api';
import SubscriptionContractListItem from '../../libs/subscription/components/SubscriptionContractListItem.component';
import SubscriptionContractCard from '../../libs/subscription/components/SubscriptionContractCard.component';
import SubscriptionPayment from '../../libs/subscription/components/SubscriptionPayment.component';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import { fetchPaymentMethodList as fetchPaymentMethodListAction } from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import Analytics from '../../components/analytics/Analytics.component';

const stripePromise = loadStripe(getStripePkKey());

type Props = {
  companyId: number,
  fetchContracts: () => void,
  contractLoading: boolean,
  classes: Object,
  contractList: Array<Contract>,

  goToUserSpace: () => void,
  companyTheme: CompanyTheme,

  selected: number,
  setSelected: (number) => void,

  authenticated: boolean,
  requestSignUp: () => void,

  fullScreen: boolean,

  paymentDialogOpen: boolean,
  setPaymentDialogOpen: (boolean) => void,

  requestSetupIntentSecret: () => void,
  fetchPaymentMethodList: () => void,
  savedPaymentMethodList: Array<PaymentMethod>,
};

export class MarketplaceContract extends React.Component<Props> {
  state = {
    first_billing_timestamp: moment().format('YYYY-MM-DD'),
  };

  componentWillMount() {
    this.props.fetchContracts(this.props.companyId);
  }

  onSubmit = async (
    _,
    payment_method_id: string,
    options: OptionCallback,
    coupon?: string,
  ) => {
    this.setState({ processing: true });
    try {
      const first_billing_timestamp = moment(
        this.state.first_billing_timestamp,
      ).unix();
      await postContractSubscriptionAPI(this.props.selected, {
        payment_method_id,
        first_billing_timestamp,
        coupon,
        ...(_ === 'bsport:credit' ? { stripe_source: 'bsport:credit' } : {}), // TODO: payment refacto
      });

      try {
        const contract = this.props.contractList.find(
          (c) => c.id === this.props.selected,
        );
        Analytics.contractPaymentSuccess(contract);
      } catch (err) {
        console.error(err);
      }

      this.props.goToUserSpace();
    } catch (err) {
      console.error(err);
      if (options && options.onError) options.onError(err);
    }
    if (options && options.onSuccess) {
      options.onSuccess();
    }
    this.setState({ processing: false });
  };

  render() {
    const { classes } = this.props;
    if (this.props.contractLoading) {
      return <LinearProgress />;
    }
    const dialogOffset = this.props.fullScreen ? '0%' : '50%';
    return (
      <div className={classes.container}>
        <List className={classes.list}>
          <Paper>
            {this.props.contractList.map((c) => (
              <div key={c.id}>
                <SubscriptionContractListItem
                  contract={c}
                  divider
                  selected={this.props.selected === c.id}
                  onClick={() => {
                    if (this.props.selected === c.id) {
                      this.props.setSelected(null);
                    } else {
                      this.props.setSelected(c.id);
                      Analytics.contractShow(c);
                    }
                  }}
                />
                <Collapse
                  in={this.props.selected && this.props.selected === c.id}
                >
                  <SubscriptionContractCard
                    contract={c}
                    onPayRequest={(first_billing_timestamp) => {
                      this.setState({ first_billing_timestamp });
                      if (!this.props.authenticated) {
                        this.props.requestSignUp();
                      } else {
                        this.props.setPaymentDialogOpen(true);
                        Analytics.contractShowPayment(c);
                      }
                    }}
                  />
                </Collapse>
              </div>
            ))}
          </Paper>
        </List>
        <Modal
          fullScreen={this.props.fullScreen}
          open={this.props.selected && this.props.paymentDialogOpen}
        >
          <>
            <div
              style={{
                transform: `translate(-${dialogOffset}, -${dialogOffset})`,
                top: dialogOffset,
                left: dialogOffset,
              }}
              className={this.props.classes.modal}
            >
              <div className={classes.padding}>
                <Elements stripe={stripePromise}>
                  <SubscriptionPayment
                    onCancel={() => this.props.setPaymentDialogOpen(false)}
                    onSubmit={this.onSubmit}
                    processing={this.state.processing}
                    requestSetupIntentSecret={
                      this.props.requestSetupIntentSecret
                    }
                    savedPaymentMethodList={this.props.savedPaymentMethodList}
                    withCoupon
                    contract={this.props.contractList.find(
                      (c) => c.id === this.props.selected,
                    )}
                    refreshSavedPaymentMethodList={
                      this.props.fetchPaymentMethodList
                    }
                    enabledPaymentGroupMethodIdentifier={
                      this.props.companyTheme
                        .payment_method_available_subscription
                    }
                  />
                </Elements>
              </div>
            </div>
          </>
        </Modal>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing(2),
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
  },
  list: {
    maxWidth: 800,
    width: '100%',
  },
  modal: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    borderRadius: 8,
  },
  padding: {
    padding: theme.spacing(2),
  },
});

export default compose(
  withTranslation(['subscription', 'payment', 'invoice', 'translation']),
  withRouter,
  withStyles(styles),
  withState('paymentDialogOpen', 'setPaymentDialogOpen', false),
  connect(
    (state) => ({
      contractList: withPaymentPack(getContractList)(state),
      contractLoading: state.subscription.contract.byMarketplace.loading,
      companyTheme: themeSelectors.getTheme(state),
      savedPaymentMethodList: getSavedPaymentMethodList(state),
    }),
    {
      fetchMarketplaceContractList,
      replace: replaceAction,
      fetchContracts: fetchMarketplaceContractList,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      fetchPrivatePassBulk: fetchPrivatePassBulkAction,
      fetchPaymentMethodList: fetchPaymentMethodListAction,
    },
  ),
  withHandlers({
    requestSetupIntentSecret: ({ companyId }) => () =>
      requestSetupIntentSecretAPI(null, companyId),
    fetchPaymentMethodList: ({ companyId, fetchPaymentMethodList }) => () =>
      fetchPaymentMethodList({ company: companyId }),
  }),
  withProps(
    ({ fetchContracts, fetchPaymentPackBulk, fetchPrivatePassBulk }) => ({
      fetchContracts: (params) =>
        fetchContracts(params, {
          onSuccess: (contractList) => {
            fetchPaymentPackBulk([
              ...contractList.map((contract) => contract.payment_pack),
            ]);
            fetchPrivatePassBulk([
              ...contractList.map((contract) => contract.private_pass),
            ]);
          },
        }),
    }),
  ),
  withMobileDialog(),
  withProps(({ location, replace }) => ({
    selected: (() => {
      try {
        const params = location.search.slice(1).split('&');
        const selected = parseInt(
          params.find((p) => p.includes('selected=')).split('=')[1],
          10,
        );
        if (selected) {
          return selected;
        }
        return null;
      } catch (err) {
        return null;
      }
    })(),
    setSelected: (id) => {
      const params = location.search.slice(1).split('&');
      const filtered_params = params.filter((p) => !p.includes('selected='));
      const pathname = `${location.pathname}?${filtered_params.join(
        '&',
      )}&selected=${id}`;
      replace(pathname);
    },
  })),
)(MarketplaceContract);
