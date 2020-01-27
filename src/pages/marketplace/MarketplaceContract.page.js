// @flow
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withProps, withState } from 'recompose';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Paper from '@material-ui/core/Paper';
import { Elements, StripeProvider } from 'react-stripe-elements';
import LinearProgress from '@material-ui/core/LinearProgress';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import moment from 'moment';
import { withRouter } from 'react-router-dom';
import { replace as replaceAction } from 'react-router-redux';
import { withNamespaces } from 'react-i18next';

import {
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
} from '@bsport/common/lib/master-data/subscription-payment-methods';

import Config from '../../config';

import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '../../libs/payment-packs/actions';
import { getMarketplaceContractList as getContractList } from '../../libs/subscription/selectors';
import { fetchMarketplaceContractList } from '../../libs/subscription/actions';
import { postContractSubscription as postContractSubscriptionAPI } from '../../libs/subscription/api';
import SubscriptionContractListItem from '../../libs/subscription/components/SubscriptionContractListItem.component';
import SubscriptionContractCard from '../../libs/subscription/components/SubscriptionContractCard.component';
import SubscriptionPayment from '../../libs/subscription/components/SubscriptionPayment.component';

type Props = {
  companyId: number,
  fetchContracts: () => void,
  contractLoading: boolean,
  classes: Object,
  contractList: Array<Contract>,

  goToUserSpace: () => void,

  selected: number,
  setSelected: (number) => void,

  authenticated: boolean,
  requestSignUp: () => void,

  fullScreen: boolean,

  paymentDialogOpen: boolean,
  setPaymentDialogOpen: (boolean) => void,
};

const STRIPE_KEY = Config.REACT_APP_STRIPE_PK_KEY;

export class MarketplaceContract extends React.Component<Props> {
  state = {
    first_billing_timestamp: moment().format('YYYY-MM-DD'),
  };

  componentWillMount() {
    this.props.fetchContracts(this.props.companyId);
  }

  onSubmit = async (token: string) => {
    this.setState({ processing: true });
    try {
      const first_billing_timestamp = moment(
        this.state.first_billing_timestamp,
      ).unix();
      await postContractSubscriptionAPI(this.props.selected, {
        stripe_source: token,
        first_billing_timestamp,
      });
      this.props.goToUserSpace();
    } catch (err) {
      console.error(err);
    }
    this.setState({ processing: false });
  };

  render() {
    const { classes } = this.props;
    if (this.props.contractLoading) {
      return <LinearProgress />;
    }
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
                      }
                    }}
                  />
                </Collapse>
              </div>
            ))}
          </Paper>
        </List>
        <Dialog
          fullScreen={this.props.fullScreen}
          open={this.props.selected && this.props.paymentDialogOpen}
        >
          <StripeProvider apiKey={STRIPE_KEY}>
            <Elements>
              <SubscriptionPayment
                onCancel={() => this.props.setPaymentDialogOpen(false)}
                onSubmit={this.onSubmit}
                processing={this.state.processing}
                enabledPaymentMethods={[
                  BILLING_PLAN_PAYMENT_METHOD_STRIPE_CB,
                  BILLING_PLAN_PAYMENT_METHOD_STRIPE_SEPA,
                ]}
              />
            </Elements>
          </StripeProvider>
        </Dialog>
      </div>
    );
  }
}

const styles = (theme) => ({
  container: {
    margin: theme.spacing.unit * 2,
    alignItems: 'center',
    flexDirection: 'column',
    display: 'flex',
  },
  list: {
    maxWidth: 800,
    width: '100%',
  },
});

export default compose(
  withNamespaces(),
  withRouter,
  withStyles(styles),
  withState('paymentDialogOpen', 'setPaymentDialogOpen', false),
  connect(
    (state) => ({
      contractList: getContractList(state),
      contractLoading: state.subscription.contract.byMarketplace.loading,
    }),
    {
      fetchMarketplaceContractList,
      replace: replaceAction,
      fetchContracts: fetchMarketplaceContractList,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
    },
  ),
  withProps(({ fetchContracts, fetchPaymentPackBulk }) => ({
    fetchContracts: (params) =>
      fetchContracts(params, {
        onSuccess: (contractList) => {
          fetchPaymentPackBulk([
            ...contractList.map((contract) => contract.payment_pack),
          ]);
        },
      }),
  })),
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
