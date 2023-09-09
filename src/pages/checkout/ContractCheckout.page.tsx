import React from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import moment from 'moment-timezone';
import { withRouter } from 'react-router-dom';
import {
  replace as replaceAction,
  push as pushRouter,
} from 'connected-react-router';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import classNames from 'classnames';

// @ts-ignore
import withQueryParams from '../../hocs/with-query-params.hoc';
import { RootState } from '../../reducers';
import themeSelectors, { getStripePkKey } from '#libs/theme/selectors';
// @ts-ignore
import asyncComponent from '../../AsyncComponent';

import {
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  fetchMarketplacePacks,
} from '#libs/payment-packs/actions';
import {
  fetchPrivatePassBulk as fetchPrivatePassBulkAction,
  fetchPrivatePassAsConsumerList,
} from '#libs/private-service/actions';
import {
  getContract,
  getMarketplaceContractList,
  // @ts-ignore
} from '#libs/subscription/selectors';
import {
  fetchMarketplaceContractList,
  fetchContractDetail,
  registerContractBackground,
  downloadPDFContractTermsForContract as downloadPDFContractTermsForContractAction,
} from '#libs/subscription/actions';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#libs/payment/api';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod,
} from '#libs/payment/actions';
import { getSavedPaymentMethodList } from '#libs/payment/selectors';
import { getPaymentPack } from '#libs/payment-packs/selectors';
import { getPrivatePass } from '#libs/private-service/selectors/private-pass';
import { getPaymentCombo } from '#libs/payment-combo/selectors';
// @ts-ignore
import Analytics from '#components/analytics/Analytics.component';
import { snackbarWarning, snackbarSuccess } from '#libs/snackbar/actions';
import WidgetUtils from '#libs/widget/WidgetUtils';
import type {
  Contract,
  ContractWithPaymentPack,
} from '#libs/subscription/types';
import type { Theme as CompanyTheme } from '#libs/theme/types';
import type { PaymentMethod } from '#libs/payment/types';
import type { OptionCallback } from '../../state/types';
import { PaymentPack } from '#libs/payment-packs/types';
// @ts-ignore
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';
import { fetchPaymentComboList } from '#libs/payment-combo/actions';
import ConsumerAppBar from './ConsumerAppBar.container';
import {
  getMarketplaceRoute,
  getSubscriptionValidationUrl,
} from '#libs/marketplace/routing-utils';
import { getMarketplaceEnabledPaymentMethods } from '#libs/payment/utils';
import MarketplaceContractCheckout from '#libs/marketplace/components/@Subscription/MarketplaceContractCheckout';
import { marketplaceCssHoc } from '#hocs/marketplace-css.hoc';
import MarketplaceContractDetail from '#libs/marketplace/components/@Subscription/MarketplaceContractDetail';
import MarketplaceContractTermsModal from '#libs/marketplace/components/MarketplaceContractTermsModal';
import MarketplaceContractCooldownModal from '#libs/marketplace/components/@Subscription/MarketplaceContractCooldownModal';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#libs/theme/actions';
import Carousel from '#components/css-only/Carousel';
import MarketplaceContractNotFound from '#libs/marketplace/components/@Subscription/MarketplaceContractNotFound';
import MemberShipValidationWrapper from '../consumer/MemberShipValidationWrapper.component';

import './styles.css';

const {
  CONTRACT_IS_ALREADY_SUBSCRIBED,
} = require('@bsport/common/lib/master-data/error-codes/subscription');

const MarketplaceContractPayment = asyncComponent(
  () => import('#libs/marketplace/components/MarketplaceContractPayment'),
);

type ownProps = {
  queryParams?: {
    force?: string;
  };
  companyId: number;
  companyName: string;
  fetchContractList: (companyId: number, options: OptionCallback) => void;
  contractLoading: boolean;
  classes: Object;
  contractList: ContractWithPaymentPack[];
  goToUserSpace: (companyId: number) => void;
  theme: CompanyTheme;
  contractId: string;
  setSelected: (contractId: number) => void;
  authenticated: boolean;
  fullScreen: boolean;
  paymentDialogOpen: boolean;
  requestSetupIntentSecret: () => { data: { client_secret: string } };
  fetchPaymentMethodList: (
    params: { company: number },
    options?: OptionCallback<PaymentMethod[]>,
  ) => void;
  savedPaymentMethodList: PaymentMethod[];
  detachPaymentMethodLoading: boolean;
  detachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback,
  ) => void;
  snackbarErrorMsg: (msg: string) => void;
  snackbarSuccessMsg: (msg: string) => void;
  auth: any;
  onPayRequest: (date: string) => void;
  downloadContractTerms: (options: OptionCallback) => void;
};

type ConnectedProps = ownProps &
  ReturnType<typeof mapStateToProps> &
  typeof mapDispatchToProps;
type Props = ConnectedProps & WithTranslation;

type State = {
  processing: boolean;
  stripePromise: Promise<Stripe> | null;
  openContractTermsDialog: boolean;
  isContractCooldownDialogOpen: boolean;
  billingStartDate: string;
  isDirectBuyingLink: boolean;
  isContractLegalTermsAccepted: boolean;
  paymentMethodFetchDone: boolean;
};

export class MarketplaceSubscriptionPayment extends React.Component<
  Props,
  State
> {
  selectedContractRef: React.RefObject<HTMLDivElement> = null;

  constructor(props: Props) {
    super(props);
    this.selectedContractRef = React.createRef();

    this.state = {
      processing: false,
      stripePromise: null,
      billingStartDate: moment().format('YYYY-MM-DD'),
      isDirectBuyingLink: false,
      isContractCooldownDialogOpen: false,
      openContractTermsDialog: false,
      isContractLegalTermsAccepted: false,
      paymentMethodFetchDone: false,
    };
  }

  componentDidMount() {
    this.props.fetchContractList(this.props.companyId, {
      onSuccess: () =>
        // Fetch information for the initial selected contract
        {
          if (this.props.contractId) {
            this.fetchAssociatedContractContent(
              parseInt(this.props.contractId, 10),
            );
          }
        },
    });

    this.props.fetchPaymentMethodList({
      onSuccess: () => {
        this.setState({ paymentMethodFetchDone: true });
      },
    });

    this.props.fetchCompanyTheme(this.props.companyId);

    if (this.props.queryParams?.force === 'true' && this.props.contractId) {
      this.props.fetchContractDetail(parseInt(this.props.contractId, 10));
      this.setState({ isDirectBuyingLink: true });
    }
    if (this.props.theme) {
      this.loadStripe();
    }
  }

  loadStripe = () => {
    this.setState({ stripePromise: loadStripe(getStripePkKey()) });
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (
      !prevProps.theme?.id &&
      !!this.props.theme?.id &&
      !prevState.stripePromise
    ) {
      this.loadStripe();
    }

    const isAccessedByDirectBuyingLink =
      this.state.isDirectBuyingLink &&
      this.props.contractId &&
      prevProps.contractId !== this.props.contractId;

    if (isAccessedByDirectBuyingLink) {
      this.fetchAssociatedContractContent(parseInt(this.props.contractId, 10));
    }

    if (this.props.contractList?.length && this.selectedContractRef?.current) {
      this.selectedContractRef?.current?.scrollIntoView({
        block: 'center',
      });
    }
  }

  handleCloseContractCooldownDialog = () => {
    this.setState({ isContractCooldownDialogOpen: false });
  };

  handleDetachPaymentMethod = async (
    paymentMethodId: number,
    options: OptionCallback,
  ) => {
    try {
      await this.props.detachPaymentMethod(paymentMethodId.toString());
      this.props.fetchPaymentMethodList();
      options.onSuccess && options.onSuccess();
    } catch (err) {
      options.onError && options.onError();
    }
  };

  handleSubmitContractPayment = async (
    _: unknown,
    payment_method_id: string,
    _isPaymentMethodForPastInvoicesSaved: boolean,
    _paymentMethodPastInvoicesId: number,
    options: OptionCallback,
    coupon?: string,
  ) => {
    Analytics.contractShowPayment(this.props.contractId);
    this.setState({ processing: true });
    const contract =
      this.props.contractList.find(
        (c: ContractWithPaymentPack) =>
          c.id === parseInt(this.props.contractId, 10),
      ) || this.props.contract;
    try {
      const first_billing_timestamp = moment(
        this.state.billingStartDate,
      ).unix();
      this.props.registerContractBackground(
        parseInt(this.props.contractId, 10),
        {
          payment_method_id,
          first_billing_timestamp,
          coupon,
          ...(_ === 'bsport:credit' ? { stripe_source: 'bsport:credit' } : {}),
          with_prorata: !!contract?.month_billing_day,
        },
        {
          // @ts-ignore
          onError: (err: { response: { data: { error_code: string } } }) => {
            this.setState({ processing: false });
            if (
              err.response?.data?.error_code === CONTRACT_IS_ALREADY_SUBSCRIBED
            ) {
              this.setState({ isContractCooldownDialogOpen: true });
            }
          },
          onBackgroundError: () => this.setState({ processing: false }),
          onBackgroundSuccess: () => {
            this.goToValidationPage(true);
            this.setState({ processing: false });
            try {
              const contractValues =
                this.props.contractList.find(
                  (contractItem: ContractWithPaymentPack) =>
                    contractItem.id === parseInt(this.props.contractId, 10),
                ) || this.props.contract;
              Analytics.contractPaymentSuccess(contractValues);
            } catch (err) {
              console.error(err);
            }
          },
        },
      );
    } catch (err) {
      console.error(err);
      this.goToValidationPage(false);
      if (options && options.onError) options.onError(err);
    }
    if (options && options.onSuccess) {
      options.onSuccess();
    }
  };

  goToValidationPage = (success: boolean) => {
    this.props.push(
      getSubscriptionValidationUrl(
        this.props.companyId,
        parseInt(this.props.contractId),
        { success: success.toString() },
      ),
    );
  };

  handleCancelContractPayment = () => {
    this.props.push(
      `/m/${this.props.companyName}/${this.props.companyId}/subscription`,
    );
  };

  fetchAssociatedContractContent = (contractId: number) => {
    const contract = this.props.contractList?.find(
      (contractItem: Contract) => contractItem.id === contractId,
    );
    if (contract?.payment_pack) {
      this.props.fetchPaymentPackBulk([contract.payment_pack]);
    }
    if (contract?.private_pass) {
      this.props.fetchPrivatePassBulk([contract.private_pass]);
    }
    if (contract?.payment_combo) {
      this.props.fetchPaymentComboList({
        id__in: [contract.payment_combo],
        company: this.props.companyId,
        ignore_new_member_only: true,
      });
    }
  };

  handleSelectContract = (contract: Contract) => {
    this.fetchAssociatedContractContent(contract.id);
    this.handleSetAcceptContractLegalTerms(false);
    this.props.setSelected(contract.id);
    Analytics.contractShow(contract);
  };

  handleOpenContractTermsDialog = () =>
    this.setState({ openContractTermsDialog: true });

  handleCloseContractTermsDialog = () =>
    this.setState({ openContractTermsDialog: false });

  handleSetBillingStartDate = (newDate: string) => {
    this.setState({ billingStartDate: newDate });
  };

  handleOnCarouselItemSwipe = (contractId: number | null) => {
    if (contractId) {
      this.props.setSelected(contractId);
      this.fetchAssociatedContractContent(contractId);
    }
  };

  handleSetAcceptContractLegalTerms = (value: boolean) => {
    this.setState({ isContractLegalTermsAccepted: value });
  };

  getIsTaxExcluded = () => {
    return this.props.theme.is_tax_excluded_in_marketplace;
  };

  getInitialCarouselItemIndex = () => {
    if (this.props.contractId && this.props.contractList?.length) {
      return this.props.contractList.findIndex(
        (contract: Contract) =>
          contract.id === parseInt(this.props.contractId, 10),
      );
    }
    return 0;
  };

  getContractObjectLoading = (contract: Contract) => {
    if (contract?.payment_pack) {
      return this.props.paymentPackLoading;
    }
    if (contract?.private_pass) {
      return this.props.privatePassLoading;
    }
    if (contract?.payment_combo) {
      return this.props.paymentComboLoading;
    }
    return false;
  };

  getCarouselRenderItem = (contractInCarousel: Contract) => {
    const contract =
      this.props.contractList.find(
        (contractItem: Contract) =>
          contractItem.id === parseInt(this.props.contractId, 10),
      ) || this.props.contract;

    return (
      <MarketplaceContractCheckout
        hideChooseButton
        isExpanded
        contract={contractInCarousel}
        getPaymentComboSelected={this.props.getPaymentComboSelected}
        getPaymentPackSelected={this.props.getPaymentPackSelected}
        getPrivatePassSelected={this.props.getPrivatePassSelected}
        isContractObjectLoading={this.getContractObjectLoading(
          contractInCarousel,
        )}
        isExcludingTax={this.getIsTaxExcluded()}
        isSelected={contract?.id === contractInCarousel.id}
        onSelect={this.handleSelectContract}
      />
    );
  };

  render() {
    if (
      this.props.contractLoading ||
      (this.props.contractId &&
        this.props.contractList.length === 0 &&
        !this.props.contract)
    ) {
      return <LinearProgress />;
    }

    const contract =
      this.props.contractList.find(
        (contractItem: ContractWithPaymentPack) =>
          contractItem.id === parseInt(this.props.contractId, 10),
      ) || this.props.contract;

    const isWidget = WidgetUtils.isWidget();

    const displayCarouselLayout = !this.state.isDirectBuyingLink && !isWidget;
    const displayDirectLinkLayout = !displayCarouselLayout;

    return (
      <MemberShipValidationWrapper companyId={this.props.companyId}>
        <ConsumerAppBar>
          <div
            className={classNames('bs-contract-checkout__container', {
              'bs-contract-checkout--fixed-height-layout':
                displayCarouselLayout,
            })}
          >
            {!isWidget && !this.state.isDirectBuyingLink && (
              <div className="bs-contract-checkout__list__container">
                {!!this.props.contractList.length &&
                  this.props.contractList.map((contractItem: Contract) => (
                    <MarketplaceContractCheckout
                      key={contractItem.id}
                      contract={contractItem}
                      customRef={this.selectedContractRef}
                      getPaymentComboSelected={
                        this.props.getPaymentComboSelected
                      }
                      getPaymentPackSelected={this.props.getPaymentPackSelected}
                      getPrivatePassSelected={this.props.getPrivatePassSelected}
                      isContractObjectLoading={this.getContractObjectLoading(
                        contractItem,
                      )}
                      isExcludingTax={this.getIsTaxExcluded()}
                      isExpanded={contract?.id === contractItem.id}
                      isSelected={contract?.id === contractItem.id}
                      onSelect={this.handleSelectContract}
                    />
                  ))}
              </div>
            )}

            {!contract || contract?.disabled ? (
              <div className="bs-contract-payment-page">
                <MarketplaceContractNotFound />
              </div>
            ) : (
              <div
                className={
                  displayCarouselLayout
                    ? 'bs-contract-payment-page'
                    : 'bs-contract-payment-page__direct__link__container'
                }
              >
                {displayCarouselLayout && (
                  <div className="bs-contract-payment-page__carousel__container">
                    <Carousel
                      isSlideshowDisabled
                      data={this.props.contractList}
                      initialSelectedItemIndex={this.getInitialCarouselItemIndex()}
                      onScroll={this.handleOnCarouselItemSwipe}
                      onSwipe={this.handleOnCarouselItemSwipe}
                      renderItem={this.getCarouselRenderItem}
                    />
                  </div>
                )}

                {displayDirectLinkLayout && (
                  <MarketplaceContractDetail
                    contract={contract}
                    getPaymentComboSelected={this.props.getPaymentComboSelected}
                    getPaymentPackSelected={this.props.getPaymentPackSelected}
                    getPrivatePassSelected={this.props.getPrivatePassSelected}
                  />
                )}

                <MarketplaceContractPayment
                  billingStartDate={this.state.billingStartDate}
                  cardBillingDetailsMandatory={
                    this.props.theme.force_billing_details_on_cards
                  }
                  companyId={this.props.companyId}
                  contract={contract}
                  detachPaymentMethod={this.props.detachPaymentMethod}
                  enabledPaymentGroupMethodIdentifierIds={
                    this.props.theme.payment_method_available_subscription
                  }
                  enabledPaymentMethodsIds={getMarketplaceEnabledPaymentMethods(
                    {
                      paymentMethodAvailableSubscription:
                        this.props.theme.payment_method_available_subscription,
                    },
                  )}
                  isContractLegalTermsAccepted={
                    this.state.isContractLegalTermsAccepted
                  }
                  isExcludingTax={this.getIsTaxExcluded()}
                  isLoading={this.state.processing}
                  isWidget={isWidget}
                  onCancelContractPayment={this.handleCancelContractPayment}
                  onOpenContractTermsDialog={this.handleOpenContractTermsDialog}
                  onSubmitContractPayment={this.handleSubmitContractPayment}
                  paymentMethodFetchDone={this.state.paymentMethodFetchDone}
                  refreshSavedPaymentMethodList={
                    this.props.fetchPaymentMethodList
                  }
                  requestSetupIntentSecret={this.props.requestSetupIntentSecret}
                  savedPaymentMethodList={this.props.savedPaymentMethodList}
                  sepaDefaultEmail={this.props.auth.username}
                  sepaDefaultName={this.props.auth.name}
                  setAcceptContractLegalTerms={
                    this.handleSetAcceptContractLegalTerms
                  }
                  setBillingStartDate={this.handleSetBillingStartDate}
                />
              </div>
            )}
          </div>

          <MarketplaceContractTermsModal
            contractTerms={contract?.contract}
            isOpen={this.state.openContractTermsDialog}
            onDialogClose={this.handleCloseContractTermsDialog}
            onDownloadTerms={this.props.downloadContractTerms}
          />
          <MarketplaceContractCooldownModal
            isOpen={this.state.isContractCooldownDialogOpen}
            onDialogClose={this.handleCloseContractCooldownDialog}
          />
        </ConsumerAppBar>
      </MemberShipValidationWrapper>
    );
  }
}

const mapStateToProps = (
  state: RootState,
  { contractId }: { contractId: string },
) => ({
  getPaymentPackSelected: (id: number) => {
    return getPaymentPack(state, id) as PaymentPack;
  },
  getPrivatePassSelected: (id: number) => {
    return getPrivatePass(state, id);
  },
  getPaymentComboSelected: (id: number) => {
    return getPaymentCombo(state, id);
  },
  contractList: getMarketplaceContractList(state),
  contract: getContract(state, parseInt(contractId, 10)),
  contractLoading: state.subscription.contract.byMarketplace.loading,
  paymentPackLoading: state.paymentPack.loading,
  privatePassLoading: state.privateService.privatePass.loading,
  paymentComboLoading: state.paymentCombo.loading,
  theme: themeSelectors.getTheme(state),
  savedPaymentMethodList: getSavedPaymentMethodList(state),
  detachPaymentMethodLoading: state.paymentBackend.detachPaymentMethod.loading,
  contractTermsDownloadLoading:
    state.subscription.contractTermsDownload.loading,
  auth: state.auth,
});

const mapDispatchToProps = {
  replace: replaceAction,
  push: pushRouter,
  fetchCompanyTheme: fetchCompanyThemeAction,
  fetchContractList: fetchMarketplaceContractList,
  fetchContractDetail,
  fetchPaymentPackBulk: fetchPaymentPackBulkAction,
  fetchPrivatePassBulk: fetchPrivatePassBulkAction,
  fetchPaymentMethodList: fetchPaymentMethodListAction,
  detachPaymentMethodAction: detachPaymentMethod,
  snackbarErrorMsg: snackbarWarning,
  snackbarSuccessMsg: snackbarSuccess,
  registerContractBackground,
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
  downloadPDFContractTermsForContract:
    downloadPDFContractTermsForContractAction,
};

export default compose<any, ownProps>(
  routerParamsToProps({ contractId: 'contractId', companyId: 'companyId' }),
  connect(mapStateToProps, mapDispatchToProps),
  withQueryParams([['force'], 'queryParams']),
  withTranslation(['subscription', 'payment', 'invoice', 'translation']),
  withRouter,
  withHandlers({
    requestSetupIntentSecret:
      ({ companyId }) =>
      () =>
        requestSetupIntentSecretAPI(null, companyId),
    fetchPaymentMethodList:
      ({ companyId, fetchPaymentMethodList }) =>
      (options?: OptionCallback) => {
        fetchPaymentMethodList(
          { company: companyId },
          {
            onSuccess: () => options?.onSuccess(),
          },
        );
      },
  }),
  withProps(({ push, companyId }) => ({
    setSelected: (id: number) => {
      push(`/checkout/${companyId}/subscription/${id}/`);
    },
  })),
  withHandlers({
    detachPaymentMethod:
      ({ detachPaymentMethodAction, fetchPaymentMethodList, companyId }) =>
      (pm_id: number, options: OptionCallback) => {
        detachPaymentMethodAction(
          { company: companyId, payment_method_id: pm_id },
          {
            onSuccess: () => {
              fetchPaymentMethodList({ company: companyId });
              if (options && options.onSuccess) options.onSuccess();
            },
            onError: options && options.onError,
          },
        );
      },
    downloadContractTerms:
      ({ downloadPDFContractTermsForContract, contractId }: ConnectedProps) =>
      (options: OptionCallback) =>
        downloadPDFContractTermsForContract(parseInt(contractId), options),
  }),
  marketplaceCssHoc(),
)(MarketplaceSubscriptionPayment);
