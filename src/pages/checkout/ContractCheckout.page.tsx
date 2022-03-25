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
import withQueryParams from '../../hocs/with-query-params.hoc';
import { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';
import themeSelectors, { getStripePkKey } from '../../libs/theme/selectors';
import asyncComponent from '../../AsyncComponent';

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
  getContract,
  withPaymentPack,
} from '../../libs/subscription/selectors';
import {
  fetchMarketplaceContractList,
  fetchContractDetail,
} from '../../libs/subscription/actions';
import { postContractSubscription as postContractSubscriptionAPI } from '../../libs/subscription/api';
import SubscriptionContractDetail from '../../libs/subscription/components/SubscriptionContractDetail.component';
import MarketplaceSubscriptionContractList from '../../libs/subscription/components/MarketplaceSubscriptionContractList.component';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../libs/payment/api';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod,
} from '../../libs/payment/actions';
import { getSavedPaymentMethodList } from '../../libs/payment/selectors';
import Analytics from '../../components/analytics/Analytics.component';
import { snackbarWarning, snackbarSuccess } from '../../libs/snackbar/actions';
import WidgetUtils from '../../libs/widget/WidgetUtils';
import type { ContractWithPaymentPack } from '../../libs/subscription/types';
import type { Theme as CompanyTheme } from '../../libs/theme/types';
import type { PaymentMethod } from '../../libs/payment/types';
import type { OptionCallback } from '../../state/types';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetchPaymentComboList } from '../../libs/payment-combo/actions';
import ConsumerAppBar from './ConsumerAppBar.container';
import SubscriptionPaymentStatusDialog from '../../libs/subscription/components/SubscriptionPaymentDialog.component';
import { getMarketplaceRoute } from '../../libs/marketplace/routing-utils';

const SubscriptionPayment = asyncComponent(
  () =>
    import('../../libs/subscription/components/SubscriptionPayment.component'),
);

type ownProps = {
  companyId: number;
  fetchContractList: (companyId: number) => void;
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
  setShowPaymentStatusDialog: ({
    open,
    error,
    success,
  }: {
    open: boolean;
    error: boolean;
    success: boolean;
  }) => void;
  showPaymentStatusDialog: { open: boolean; error: boolean; success: boolean };
};

type ConnectedProps = ownProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type Props = ConnectedProps &
  WithTranslation &
  MaterialStyleType<ReturnType<typeof styles>>;

type State = {
  processing: boolean;
  stripePromise: Promise | null;
};

export class MarketplaceSubscriptionPayment extends React.Component<
  Props,
  State
> {
  state: State = {
    processing: false,
    stripePromise: null,
  };

  componentWillMount() {
    this.props.fetchContractList(this.props.companyId);
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

  componentDidMount() {
    if (this.props.queryParams?.force === 'true' && this.props.contractId) {
      this.props.fetchContractDetail(this.props.contractId);
    }
    if (this.props.companyTheme) {
      this.loadStripe();
    }
  }

  loadStripe = () => {
    this.setState({ stripePromise: loadStripe(getStripePkKey()) });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      !prevProps.companyTheme?.id &&
      !!this.props.companyTheme?.id &&
      !prevState.stripePromise
    ) {
      this.loadStripe();
    }
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
      const first_billing_timestamp = moment(this.props.date).unix();
      await postContractSubscriptionAPI(this.props.contractId, {
        payment_method_id,
        first_billing_timestamp,
        coupon,
        ...(_ === 'bsport:credit' ? { stripe_source: 'bsport:credit' } : {}), // TODO: payment refacto
      });
      this.props.setShowPaymentStatusDialog({
        open: true,
        success: true,
        error: false,
      });
      try {
        const contract =
          this.props.contractList.find(
            (c: ContractWithPaymentPack) =>
              c.id === parseInt(this.props.contractId),
          ) || this.props.contract;
        Analytics.contractPaymentSuccess(contract);
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
      this.props.setShowPaymentStatusDialog({
        open: true,
        success: false,
        error: true,
      });
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
      (this.props.contractId &&
        this.props.contractList.length === 0 &&
        !this.props.contract)
    ) {
      return <LinearProgress />;
    }
    return (
      <ConsumerAppBar>
        <div className={classes.mainContainer}>
          {!WidgetUtils.isWidget() &&
            !window.location.search.includes('?force=true') && (
              <div className={classes.upperContainer}>
                <Grid
                  container
                  spacing={2}
                  direction="row"
                  justify="space-evenly"
                >
                  <Grid item xs={12}>
                    <MarketplaceSubscriptionContractList
                      isExcludingTax={
                        this.props.companyTheme.is_tax_excluded_in_marketplace
                      }
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
            )}

          <div className={classes.centeredContainer}>
            <Grid container spacing={2} direction="row" justify="space-evenly">
              <Grid item xs={12} md={6}>
                {this.props.contractId &&
                  this.props.contractList &&
                  (this.props.contractList.length || this.props.contract) && (
                    <SubscriptionContractDetail
                      isExcludingTax={
                        this.props.companyTheme.is_tax_excluded_in_marketplace
                      }
                      contract={
                        this.props.contractList.find(
                          (c: ContractWithPaymentPack) =>
                            c.id === parseInt(this.props.contractId),
                        ) || this.props.contract
                      }
                    />
                  )}
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper className={classes.paymentPanelContainer}>
                  {!!this.state.stripePromise && (
                    <Elements stripe={this.state.stripePromise}>
                      <SubscriptionPayment
                        onCancel={() => {
                          this.props.setAcceptContract(false);
                        }}
                        isExcludingTax={
                          this.props.companyTheme.is_tax_excluded_in_marketplace
                        }
                        onSubmit={this.onSubmit}
                        processing={this.state.processing}
                        requestSetupIntentSecret={
                          this.props.requestSetupIntentSecret
                        }
                        savedPaymentMethodList={
                          this.props.savedPaymentMethodList
                        }
                        withCoupon
                        contract={
                          this.props.contractList.find(
                            (c: ContractWithPaymentPack) =>
                              c.id === parseInt(this.props.contractId),
                          ) || this.props.contract
                        }
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
                  )}
                </Paper>
              </Grid>
            </Grid>
          </div>
          <SubscriptionPaymentStatusDialog
            open={this.props.showPaymentStatusDialog.open}
            success={this.props.showPaymentStatusDialog.success}
            onNext={
              this.props.showPaymentStatusDialog.success
                ? () =>
                    this.props.goToUserSpace(
                      this.props.companyId,
                      this.props.companyTheme.company_name,
                    )
                : () =>
                    this.props.setShowPaymentStatusDialog({
                      open: false,
                      error: false,
                      success: false,
                    })
            }
            goToSubscriptionList={() =>
              this.props.goToSubscriptionList(
                this.props.companyId,
                this.props.companyTheme.company_name,
              )
            }
          />
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

const mapStateToProps = (
  state: RootState,
  { contractId }: { contractId: string },
) => ({
  contractList: withPaymentPack(getContractList)(state),
  contract: getContract(state, parseInt(contractId, 10)),
  contractLoading: state.subscription.contract.byMarketplace.loading,
  companyTheme: themeSelectors.getTheme(state),
  savedPaymentMethodList: getSavedPaymentMethodList(state),
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
  auth: state.auth,
});

const mapDispatchToProps = {
  replace: replaceAction,
  fetchContractList: fetchMarketplaceContractList,
  fetchContractDetail,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchPrivatePassBulk: fetchPrivatePassBulkAction,
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  detachPaymentMethodAction: detachPaymentMethod,
  snackbarErrorMsg: snackbarWarning,
  snackbarSuccessMsg: snackbarSuccess,
  push: pushRouter,
  goToUserSpace: (companyId: number, companyName: string) => {
    if (!WidgetUtils.isWidget()) {
      return replaceAction(`/c/${companyId}/subscription/`);
    }
    return replaceAction(
      `/widget/${companyName}/${companyId}/subscription?context=widget`,
    );
  },
  goToSubscriptionList: (companyId: number, companyName: string) => {
    if (!WidgetUtils.isWidget()) {
      return replaceAction(
        getMarketplaceRoute(companyName, companyId, 'subscription'),
      );
    }
    WidgetUtils.closeContractModalOnError();
    return window.close();
  },
  fetchPaymentComboList,
  fetchPaymentPacks: fetchMarketplacePacks,
  fetchPrivatePassAsConsumerList,
};

export default compose<any, ownProps>(
  routerParamsToProps({ contractId: 'contractId', companyId: 'companyId' }),
  connect(mapStateToProps, mapDispatchToProps),
  withQueryParams([['force'], 'queryParams']),
  // @ts-ignore
  withStyles(styles),
  withState('date', 'setDate', moment()),
  withState('acceptContract', 'setAcceptContract', false),
  withState('showPaymentStatusDialog', 'setShowPaymentStatusDialog', {
    open: false,
    error: false,
    success: false,
  }),
  withTranslation(['subscription', 'payment', 'invoice', 'translation']),
  withRouter,
  withHandlers({
    requestSetupIntentSecret:
      ({ companyId }) =>
      () =>
        requestSetupIntentSecretAPI(null, companyId),
    fetchPaymentMethodList:
      ({ companyId, fetchPaymentMethodList }) =>
      () =>
        fetchPaymentMethodList({ company: companyId }),
  }),
  withProps(
    ({ fetchContractList, fetchPaymentPackBulk, fetchPrivatePassBulk }) => ({
      fetchContractList: (params) =>
        fetchContractList(params, {
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
    detachPaymentMethod:
      ({ detachPaymentMethodAction, fetchpaymentMethod, companyId }) =>
      (pm_id: number, options: OptionCallback) => {
        detachPaymentMethodAction(
          { company: companyId, payment_method_id: pm_id },
          {
            onSuccess: () => {
              fetchpaymentMethod({ company: companyId });
              if (options && options.onSuccess) options.onSuccess();
            },
            onError: options && options.onError,
          },
        );
      },
  }),
)(MarketplaceSubscriptionPayment);
