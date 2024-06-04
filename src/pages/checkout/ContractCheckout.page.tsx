import React from 'react';
import { compose, withProps, withHandlers } from 'recompose';
import { connect } from 'react-redux';
import { withTranslation, WithTranslation } from 'react-i18next';
import LinearProgress from '@material-ui/core/LinearProgress';
import { withRouter } from 'react-router-dom';
import {
  replace as replaceAction,
  push as pushRouter,
} from 'connected-react-router';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import classNames from 'classnames';
import { CONTRACT_IS_ALREADY_SUBSCRIBED } from '@bsport/common/lib/master-data/error-codes/subscription';
import { DateTime } from 'luxon';

import themeSelectors, { getStripePkKey } from '#src/libs/theme/selectors';

import { fetchPaymentPackBulk as fetchPaymentPackBulkAction } from '#src/libs/payment-packs/actions';
import { fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction } from '#src/libs/establishment/actions';
import {
  fetchPrivatePassBulk as fetchPrivatePassBulkAction,
  fetchPrivatePassAsConsumerList,
} from '#src/libs/private-service/actions';
import {
  getContract,
  getMarketplaceContractList,
} from '#src/libs/subscription/selectors';
import {
  getDefaultEstablishmentBillingGroup,
  getEnabledEstablishmentBillingGroups,
  withEstablishment,
} from '#src/libs/establishment/selectors';
import { fetchMembershipByCompany as fetchMembershipByCompanyAction } from '#src/libs/membership/actions';
import {
  fetchMarketplaceContractList,
  fetchContractDetail,
  registerContractBackground,
  downloadPDFContractTermsForContract as downloadPDFContractTermsForContractAction,
} from '#src/libs/subscription/actions';
import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '#src/libs/payment/api';
import {
  fetchPaymentMethodList as fetchPaymentMethodListAction,
  detachPaymentMethod,
} from '#src/libs/payment/actions';
import { getSavedPaymentMethodList } from '#src/libs/payment/selectors';
import { getPaymentPack } from '#src/libs/payment-packs/selectors';
import { getPrivatePass } from '#src/libs/private-service/selectors/private-pass';
import { getPaymentCombo } from '#src/libs/payment-combo/selectors';
// @ts-expect-error
import Analytics from '#src/components/analytics/Analytics.component';
import { snackbarWarning, snackbarSuccess } from '#src/libs/snackbar/actions';
import WidgetUtils from '#src/libs/widget/WidgetUtils';
import type {
  Contract,
  ContractWithPaymentPack,
} from '#src/libs/subscription/types';
import type { Theme as CompanyTheme } from '#src/libs/theme/types';
import type { PaymentMethod } from '#src/libs/payment/types';
import { PaymentPack } from '#src/libs/payment-packs/types';
import routerParamsToProps from '#src/hocs/router-params-to-props.hoc';
import { fetchPaymentComboList } from '#src/libs/payment-combo/actions';
import {
  getMarketplaceRoute,
  getSubscriptionValidationUrl,
} from '#src/libs/marketplace/routing-utils';
import { getMarketplaceEnabledPaymentMethods } from '#src/libs/payment/utils';
import MarketplaceContractCheckout from '#src/libs/marketplace/components/@Subscription/MarketplaceContractCheckout';
import { marketplaceCssHoc } from '#src/hocs/marketplace-css.hoc';
import MarketplaceContractDetail from '#src/libs/marketplace/components/@Subscription/MarketplaceContractDetail';
import MarketplaceContractTermsModal from '#src/libs/marketplace/components/@Subscription/MarketplaceContractTermsModal';
import MarketplaceContractCooldownModal from '#src/libs/marketplace/components/@Subscription/MarketplaceContractCooldownModal';
import { fetchCompanyTheme as fetchCompanyThemeAction } from '#src/libs/theme/actions';
import Carousel from '#src/components/css-only/Carousel';
import MarketplaceContractNotFound from '#src/libs/marketplace/components/@Subscription/MarketplaceContractNotFound';
import { updateDefaultEstablishmentBillingGroup as updateDefaultEstablishmentBillingGroupAction } from '#src/libs/member/actions';

import { EstablishmentBillingGroup } from '#src/libs/establishment/types';
import {
  getMemberDetailData,
  getMemberThroughMembership,
} from '#src/libs/member/selectors';
import MemberShipValidationWrapper from '../consumer/MemberShipValidationWrapper.component';
import ConsumerAppBar from './ConsumerAppBar.container';
import type { OptionCallback } from '../../state/types';
// @ts-expect-error
import asyncComponent from '../../AsyncComponent';
import { RootState } from '../../reducers';
// @ts-expect-error
import withQueryParams from '../../hocs/with-query-params.hoc';

import './styles.css';

const MarketplaceContractPayment = asyncComponent(
  () =>
    import(
      '#src/libs/marketplace/components/@Payment/MarketplaceContractPayment'
    ),
);

type ownProps = {
  queryParams?: {
    force?: string;
  };
  companyId: number;
  companyName: string;
  fetchContractList: (companyId: number, options: OptionCallback) => void;
  contractLoading: boolean;
  contractList: ContractWithPaymentPack[];
  theme: CompanyTheme;
  contractId: string;
  setSelected: (contractId: number) => void;
  requestSetupIntentSecret: () => { data: { client_secret: string } };
  fetchPaymentMethodList: (
    params: { company: number },
    options?: OptionCallback<PaymentMethod[]>,
  ) => void;
  savedPaymentMethodList: PaymentMethod[];
  detachPaymentMethod: (
    paymentMethodId: string,
    options?: OptionCallback,
  ) => void;
  auth: any;
  downloadContractTerms: (options: OptionCallback) => void;
  fetchAllEstablishmentBillingGroup: () => void;
  establishmentBillingGroups: EstablishmentBillingGroup[];
  updateMemberBillingGroup: (establishmentBillingGroupId: number) => void;
  defaultEstablishmentBillingGroup: EstablishmentBillingGroup;
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
  isEstablishmentBillingGroupSelected: boolean;
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
      billingStartDate: DateTime.now().toISODate(),
      isDirectBuyingLink: false,
      isContractCooldownDialogOpen: false,
      openContractTermsDialog: false,
      isContractLegalTermsAccepted: false,
      paymentMethodFetchDone: false,
      isEstablishmentBillingGroupSelected: true,
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

    this.props.fetchCompanyTheme(this.props.companyId, {
      onSuccess: (theme) => {
        if (theme.enable_multi_localization) {
          this.props.fetchAllEstablishmentBillingGroup({
            params: { company: this.props.companyId },
          });
        }
      },
    });

    if (this.props.queryParams?.force === 'true' && this.props.contractId) {
      this.props.fetchContractDetail(parseInt(this.props.contractId, 10));
      this.setState({ isDirectBuyingLink: true });
    }
    if (this.props.theme) {
      this.loadStripe();
    }
    this.props.fetchMembershipByCompany(this.props.companyId);
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

  setIsEstablishmentBillingGroupSelected = (
    isEstablishmentBillingGroupSelected: boolean,
  ) =>
    this.setState({
      isEstablishmentBillingGroupSelected:
        isEstablishmentBillingGroupSelected ||
        !this.props.theme.enable_multi_localization,
    });

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
      options?.onSuccess?.();
    } catch (err) {
      options?.onError?.();
    }
  };

  handleSubmitContractPayment = async (
    _: unknown,
    payment_method_id: string,
    _isPaymentMethodForPastInvoicesSaved: boolean,
    _paymentMethodPastInvoicesId: number,
    options: OptionCallback,
    coupon?: string,
    establishmentBillingGroupId?: number,
  ) => {
    Analytics.contractShowPayment(this.props.contractId);
    this.setState({ processing: true });
    const contract =
      this.props.contractList.find(
        (c: ContractWithPaymentPack) =>
          c.id === parseInt(this.props.contractId, 10),
      ) || this.props.contract;
    try {
      const first_billing_timestamp = DateTime.fromISO(
        this.state.billingStartDate,
      ).toSeconds();
      this.props.registerContractBackground(
        parseInt(this.props.contractId, 10),
        {
          payment_method_id,
          first_billing_timestamp,
          coupon,
          ...(_ === 'bsport:credit' ? { stripe_source: 'bsport:credit' } : {}),
          with_prorata: !!contract?.month_billing_day,
          establishment_billing_group_id: establishmentBillingGroupId,
        },
        {
          // @ts-expect-error
          onError: (err: { response: { data: { error_code: number } } }) => {
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
      options?.onError?.(err);
    }
    options?.onSuccess?.();
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
                    // @ts-expect-error
                    contract={contract}
                    getPaymentComboSelected={this.props.getPaymentComboSelected}
                    getPaymentPackSelected={this.props.getPaymentPackSelected}
                    getPrivatePassSelected={this.props.getPrivatePassSelected}
                    isContractObjectLoading={this.getContractObjectLoading(
                      // @ts-expect-error
                      contract,
                    )}
                  />
                )}

                <MarketplaceContractPayment
                  billingStartDate={this.state.billingStartDate}
                  cardBillingDetailsMandatory={
                    this.props.theme.force_billing_details_on_cards
                  }
                  companyId={this.props.companyId}
                  contract={contract}
                  defaultEstablishmentBillingGroup={
                    this.props.defaultEstablishmentBillingGroup
                  }
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
                  enableMultiLocalization={
                    this.props.theme?.enable_multi_localization
                  }
                  establishmentBillingGroups={
                    this.props.establishmentBillingGroups
                  }
                  isContractLegalTermsAccepted={
                    this.state.isContractLegalTermsAccepted
                  }
                  isEstablishmentBillingGroupSelected={
                    this.state.isEstablishmentBillingGroupSelected
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
                  setIsEstablishmentBillingGroupSelected={
                    this.setIsEstablishmentBillingGroupSelected
                  }
                  updateMemberBillingGroup={this.props.updateMemberBillingGroup}
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
  { companyId, contractId }: { companyId?: number; contractId: string },
) => {
  const member = getMemberThroughMembership(getMemberDetailData)(
    state,
    companyId,
  );
  return {
    getPaymentPackSelected: (id: number) => {
      return getPaymentPack(state, id) as PaymentPack;
    },
    getPrivatePassSelected: (id: number) => {
      return getPrivatePass(state, id);
    },
    getPaymentComboSelected: (id: number) => {
      return getPaymentCombo(state, id);
    },
    // @ts-expect-error
    contractList: getMarketplaceContractList(state),
    // @ts-expect-error
    contract: getContract(state, parseInt(contractId, 10)),
    contractLoading: state.subscription.contract.byMarketplace.loading,
    paymentPackLoading: state.paymentPack.loading,
    privatePassLoading: state.privateService.privatePass.loading,
    paymentComboLoading: state.paymentCombo.loading,
    theme: themeSelectors.getTheme(state),
    savedPaymentMethodList: getSavedPaymentMethodList(state),
    auth: state.auth,
    establishmentBillingGroups: withEstablishment(
      getEnabledEstablishmentBillingGroups,
    )(state),
    defaultEstablishmentBillingGroup: getDefaultEstablishmentBillingGroup(
      state,
      member?.id,
    ),
    // eslint-disable-next-line react/no-unused-prop-types
    member,
  };
};

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
  fetchPrivatePassAsConsumerList,
  downloadPDFContractTermsForContract:
    downloadPDFContractTermsForContractAction,
  fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
  updateDefaultEstablishmentBillingGroup:
    updateDefaultEstablishmentBillingGroupAction,
  fetchMembershipByCompany: fetchMembershipByCompanyAction,
};

export default compose<any, ownProps>(
  routerParamsToProps({
    contractId: 'contractId:string',
    companyId: 'companyId:number',
  }),
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
      (pm_id: string, options: OptionCallback) => {
        detachPaymentMethodAction(
          { company: companyId, payment_method_id: pm_id },
          {
            onSuccess: () => {
              fetchPaymentMethodList({ company: companyId });
              options?.onSuccess?.();
            },
            onError: options?.onError,
          },
        );
      },
    downloadContractTerms:
      ({ downloadPDFContractTermsForContract, contractId }: ConnectedProps) =>
      (options: OptionCallback) =>
        downloadPDFContractTermsForContract(parseInt(contractId), options),

    updateMemberBillingGroup:
      ({ updateDefaultEstablishmentBillingGroup, theme, member }) =>
      (establishmentBillingGroupId: number) => {
        if (theme.enable_multi_localization && member?.id) {
          updateDefaultEstablishmentBillingGroup(member.id, {
            default_establishment_billing_group: establishmentBillingGroupId,
          });
        }
      },
  }),
  marketplaceCssHoc(),
)(MarketplaceSubscriptionPayment);
