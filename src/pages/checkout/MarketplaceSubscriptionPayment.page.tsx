import React from 'react';
import { compose, withProps, withHandlers, withState } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import withStyles from '@material-ui/styles/withStyles';
import { Theme } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import LinearProgress from '@material-ui/core/LinearProgress';
import Grid from '@material-ui/core/Grid';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import moment from 'moment-timezone';
import { withRouter } from 'react-router-dom';
import {
  replace as replaceAction,
  push as pushRouter,
} from 'connected-react-router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';
import themeSelectors, { getStripePkKey } from '../../libs/theme/selectors';

import {
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  fetchMarketplacePacks,
} from '../../libs/payment-packs/actions';
import {
  fetchPrivatePassBulk as fetchPrivatePassBulkAction,
  fetchPrivatePassAsConsumerList,
} from '../../libs/private-service/actions';
import {
  getMarketplaceContractList as getContractList,
  withPaymentPack,
} from '../../libs/subscription/selectors';
import { fetchMarketplaceContractList } from '../../libs/subscription/actions';
import { postContractSubscription as postContractSubscriptionAPI } from '../../libs/subscription/api';
import SubscriptionPayment from '../../libs/subscription/components/SubscriptionPayment.component';
import SubscriptionContractDetail from '../../libs/subscription/components/SubscriptionContractDetail.component';
import MarketplaceSubscriptionContractList from '../../libs/subscription/components/MarketplaceSubscriptionContractList.component';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod,
} from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import Analytics from '../../components/analytics/Analytics.component';
import {
  snackbarWarning,
  snackbarSuccess,
} from '../../actions/snackbar.actions';
import type { ContractWithPaymentPack } from '../../libs/subscription/types';
import type { Theme as CompanyTheme } from '../../libs/theme/types';
import type { PaymentMethod } from '../../libs/payment/types';
import type { OptionCallback } from '../../state/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';
import ConsumerAppBar from './ConsumerAppBar.container';

const stripePromise = loadStripe(getStripePkKey());
type ownProps = {
  companyId: number;
  fetchContracts: () => void;
  contractLoading: boolean;
  classes: Object;
  contractList: Array<ContractWithPaymentPack>;

  goToUserSpace: (companyId: number) => void;
  companyTheme: CompanyTheme;

  contractId: string;
  setSelected: (contractId: number) => void;

  authenticated: boolean;

  fullScreen: boolean;

  paymentDialogOpen: boolean;

  requestSetupIntentSecret: () => void;
  fetchPaymentMethodList: () => void;
  savedPaymentMethodList: Array<PaymentMethod>;
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (pm_id: string) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  auth: any;
  acceptContract: boolean;
  setAcceptContract: (value: boolean) => void;
  date: string;
  setDate: (value: string) => void;
  onPayRequest: (date: string) => void;
};

type ConnectedProps = ownProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type Props = ConnectedProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;
type State = {
  first_billing_timestamp: string;
  processing: boolean;
};
export class MarketplaceSubscriptionPayment extends React.Component<
  Props,
  State
> {
  state = {
    first_billing_timestamp: moment().format('YYYY-MM-DD'),
    processing: false,
  };

  componentWillMount() {
    this.props.fetchContracts(this.props.companyId);
    this.props.fetchPaymentMethodList();
    this.props.fetchPaymentComboList({
      company: this.props.companyId,
      manager_only: false,
    });
    this.props.fetchPaymentPacks({
      company: this.props.companyId,
      manager_only: false,
      disabled: false,
      as_consumer: true,
      page_size: 300,
    });
    this.props.fetchPrivatePassAsConsumerList(this.props.companyId);
  }

  onSubmit = async (
    _,
    payment_method_id: string,
    options: OptionCallback,
    coupon?: string,
  ) => {
    Analytics.contractShowPayment(this.props.contractId);
    this.setState({ processing: true });
    try {
      const first_billing_timestamp = moment(
        this.state.first_billing_timestamp,
      ).unix();
      await postContractSubscriptionAPI(this.props.contractId, {
        payment_method_id,
        first_billing_timestamp,
        coupon,
        ...(_ === 'bsport:credit' ? { stripe_source: 'bsport:credit' } : {}), // TODO: payment refacto
      });

      try {
        const contract = this.props.contractList.find(
          (c: ContractWithPaymentPack) =>
            c.id === parseInt(this.props.contractId),
        );
        Analytics.contractPaymentSuccess(contract);
      } catch (err) {
        console.error(err);
      }

      this.props.goToUserSpace(this.props.companyId);
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
    if (
      this.props.contractLoading ||
      (this.props.contractId && this.props.contractList.length === 0)
    ) {
      return <LinearProgress />;
    }
    return (
      <ConsumerAppBar>
        <div className={classes.mainContainer}>
          <div className={classes.upperContainer}>
            <Grid container spacing={2} direction="row" justify="space-evenly">
              <Grid item xs={12}>
                <MarketplaceSubscriptionContractList
                  contractList={this.props.contractList}
                  selected={parseInt(this.props.contractId)}
                  onClick={(c: ContractWithPaymentPack) => {
                    this.props.setAcceptContract(false);
                    this.props.setSelected(c.id);
                    Analytics.contractShow(c);
                  }}
                />
              </Grid>
            </Grid>
          </div>

          <div className={classes.centeredContainer}>
            <Grid container spacing={2} direction="row" justify="space-evenly">
              <Grid item xs={12} md={6}>
                {this.props.contractId &&
                  this.props.contractList &&
                  this.props.contractList !== [] && (
                    <SubscriptionContractDetail
                      contract={this.props.contractList.find(
                        (c: ContractWithPaymentPack) =>
                          c.id === parseInt(this.props.contractId),
                      )}
                    />
                  )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paymentPanelContainer}>
                  <Elements stripe={stripePromise}>
                    <SubscriptionPayment
                      onCancel={() => {
                        this.props.setAcceptContract(false);
                      }}
                      onSubmit={this.onSubmit}
                      processing={this.state.processing}
                      requestSetupIntentSecret={
                        this.props.requestSetupIntentSecret
                      }
                      savedPaymentMethodList={this.props.savedPaymentMethodList}
                      withCoupon
                      contract={this.props.contractList.find(
                        (c: ContractWithPaymentPack) =>
                          c.id === parseInt(this.props.contractId),
                      )}
                      refreshSavedPaymentMethodList={
                        this.props.fetchPaymentMethodList
                      }
                      enabledPaymentGroupMethodIdentifier={
                        this.props.companyTheme
                          .payment_method_available_subscription
                      }
                      detachPaymentMethodLoading={
                        this.props.detachPaymentMethodLoading
                      }
                      companyId={this.props.companyId}
                      detachPaymentMethod={this.props.detachPaymentMethod}
                      snackbarErrorMsg={this.props.snackbarErrorMsg}
                      snackbarSuccessMsg={this.props.snackbarSuccessMsg}
                      sepaDefaultName={this.props.auth.name}
                      sepaDefaultEmail={this.props.auth.username}
                      withGeneralConditions
                      disabled={!this.props.acceptContract}
                      acceptContract={this.props.acceptContract}
                      setAcceptContract={(value: boolean) => {
                        this.props.setAcceptContract(value);
                      }}
                      date={this.props.date}
                      setDate={this.props.setDate}
                    />
                  </Elements>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </div>
      </ConsumerAppBar>
    );
  }
}

const styles = (theme: Theme) => ({
  mainContainer: {
    width: '100%',
    height: '100vh',
  },
  upperContainer: {
    margin: theme.spacing(2),
    display: 'flex',
    direction: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredContainer: {
    maxWidth: '1600px',
    margin: 'auto',
  },
  paymentPanelContainer: {
    padding: theme.spacing(2),
  },
});

const mapStateToProps = (state: RootState) => ({
  contractList: withPaymentPack(getContractList)(state),
  contractLoading: state.subscription.contract.byMarketplace.loading,
  companyTheme: themeSelectors.getTheme(state),
  savedPaymentMethodList: getSavedPaymentMethodList(state),
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
  auth: state.auth,
});

const mapDispatchToProps = {
  fetchMarketplaceContractList,
  replace: replaceAction,
  fetchContracts: fetchMarketplaceContractList,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchPrivatePassBulk: fetchPrivatePassBulkAction,
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  detachPaymentMethodAction: detachPaymentMethod,
  snackbarErrorMsg: snackbarWarning,
  snackbarSuccessMsg: snackbarSuccess,
  push: pushRouter,
  goToUserSpace: (companyId: number) =>
    pushRouter(`/c/${companyId}/subscription/`),
  fetchPaymentComboList,
  fetchPaymentPacks: fetchMarketplacePacks,
  fetchPrivatePassAsConsumerList,
};

export default compose<any, ownProps>(
  connect(mapStateToProps, mapDispatchToProps),
  routerParamsToProps({ contractId: 'contractId', companyId: 'companyId' }),
  // @ts-ignore
  withStyles(styles),
  withState('date', 'setDate', moment()),
  withState('acceptContract', 'setAcceptContract', false),
  withTranslation(['subscription', 'payment', 'invoice', 'translation']),
  withRouter,
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
          onSuccess: (contractList: Array<ContractWithPaymentPack>) => {
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
  withProps(({ push, companyId }) => ({
    setSelected: (id: number) => {
      push(`/checkout/${companyId}/subscription/${id}/`);
    },
  })),
  withHandlers({
    detachPaymentMethod: ({
      detachPaymentMethodAction,
      fetchpaymentMethod,
      snackbarErrorMsg,
      snackbarSuccessMsg,
      companyId,
      t,
    }) => (pm_id: number, options: OptionCallback) => {
      detachPaymentMethodAction(
        { company: companyId, payment_method_id: pm_id },
        {
          onSuccess: () => {
            fetchpaymentMethod({ company: companyId });
            snackbarSuccessMsg(t('invoice:paymentMethod.detach.pm_deleted'));
            if (options && options.onSuccess) options.onSuccess();
          },
          onError: (data: any) => {
            snackbarErrorMsg(t(`invoice:paymentMethod.detach.${data}`));
          },
        },
      );
    },
  }),
)(MarketplaceSubscriptionPayment);
