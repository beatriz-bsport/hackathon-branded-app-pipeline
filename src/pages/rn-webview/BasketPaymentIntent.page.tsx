// @ts-nocheck
import isNil from 'lodash/isNil';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import CheckIcon from '@material-ui/icons/Check';
import LinearProgress from '@material-ui/core/LinearProgress';
import type { Theme } from '@material-ui/core/styles';
import { compose, withState, withProps, withHandlers } from 'recompose';
import { connect, ConnectedProps } from 'react-redux';
import ALL_ERROR_CODES from '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought';

import { withTranslation, WithTranslation } from 'react-i18next';
import {
  PAYMENT_ENGINE_STRIPE,
  PAYMENT_INTENT_TYPE_BASKET,
  PAYMENT_GROUP_METHOD_BY_ENGINE,
} from '@bsport/common/lib/master-data/payment-group';
import {
  checkItemsBasket as checkItemsBasketAPI,
  verifyPriceBasket as verifyPriceBasketAPI,
  createPendingBookings as createPendingBookingsAPI,
} from '#libs/payment/api';
import asyncComponent from '../../AsyncComponent';
import routerParamsToProps from '#hocs/router-params-to-props.hoc';
import {
  fetchBasket as fetchBasketAction,
  attachPaymentToBasketId as attachPaymentAction,
  createOrRefreshInternalAccountPrepaidLine as createOrRefreshInternalAccountPrepaidLineAction,
  assignInstalmentPayment as assignInstalmentPaymentAction,
} from '#libs/checkout/actions';
import { fetchPaymentMethodList } from '#libs/payment/actions';
import { fetchCompanyTheme } from '#libs/theme/actions';
import { getSavedPaymentMethodList } from '#libs/payment/selectors';
import { getBasket, getOffersListFromBasket } from '#libs/checkout/selectors';
import { OptionCallback } from '../../state/types';
import { PaymentMethod } from '#libs/payment/types';
import { unauthenticatedRequestClientSecret as requestClientSecretAPI } from '#libs/invoice/api';
import { getUsableCreditAccountBalance } from '#libs/membership/selectors';
import { Basket, PrepaidLine } from '#libs/checkout/types';
import { getCurrencyDisplayWithPrice } from '#libs/theme/selectors';
import PrepaidLineListItem from '#libs/checkout/components/PrepaidLineListItem.component';
import type { CompanyTheme } from '#libs/theme/types';
import type { RootState } from '../../reducers';
import { MaterialStyleType } from '../../utils/types';
import { getBasketTotalPriceExcludingTax } from '#libs/checkout/utils';
import BasketTaxInfo from '#libs/checkout/components/BasketTaxInfo.component';
import { fetchMembershipByBasket } from '#libs/membership/actions';
import {
  fetchMember as fetchMemberAction,
  updateDefaultEstablishmentBillingGroup as updateDefaultEstablishmentBillingGroupAction,
} from '#libs/member/actions';
import { validateUnpaid as validateUnpaidAPI } from '#libs/checkout/api';
import { fetchInstalmentPaymentByBasket as fetchInstalmentPaymentByBasketAction } from '#libs/instalment-payment-configuration/actions';

import { snackbarWarning, snackbarSuccess } from '#libs/snackbar/actions';
import { getInstalmentForBasketList } from '#libs/instalment-payment-configuration/selectors';
import { InstalmentPayment } from '#libs/instalment-payment-configuration/types';

import { isErrorWithCustomCode } from '#libs/utils';
import {
  fetchAllEstablishmentBillingGroup as fetchAllEstablishmentBillingGroupAction,
  fetchEstablishmentBulk as fetchEstablishmentBulkAction,
} from '#libs/establishment/actions';
import {
  getDefaultEstablishmentBillingGroup,
  getEnabledEstablishmentBillingGroups,
} from '#libs/establishment/selectors';
import { withEstablishment, withMetaActivity } from '#libs/offer/selectors';
import { EstablishmentBillingGroup } from '#libs/establishment/types';
import { fetchOfferBulk as fetchOfferBulkAction } from '#libs/offer/actions';
import { loadDefaultEstablishmentBillingGroup } from '#libs/marketplace/utils/booking';

const PaymentStripe = asyncComponent(
  () =>
    import(
      '../../libs/payment/components/payment-backend-stripe/PaymentStripe.component'
    ),
);

type Props = {
  basket: Basket<number, PrepaidLine>;
  basketId: string;
  basketError: any;
  submitPaymentIntent: (data: any, option: OptionCallback) => void;
  savedPaymentMethodList: Array<PaymentMethod>;
  fetchPaymentMethodList: (params: any) => void;
  fetchInstalmentPaymentByBasket: (basketId: number) => void;
  instalmentPaymentConfigurationList: Array<InstalmentPayment>;
  assignInstalmentPayment: (
    basket: string,
    instalment_payment_id: number,
    options: OptionCallback<Basket>,
  ) => void;
  refreshBasket: (options: OptionCallback) => void;
  useInternalAccount: (amount: number, options: OptionCallback) => void;
  onRemoveInternalAccountPrepaidLine: (options?: OptionCallback) => void;
  creditAccountBalance: number | null;
  checkItemsBasket: (basketId: string) => Promise<boolean>;
  paymentProcessing: boolean;
  setPaymentProcessing: (process: boolean) => void;
  cardBillingDetailsMandatory: boolean;
} & ConnectedProps<typeof connector> &
  MaterialStyleType<ReturnType<typeof styles>> &
  WithTranslation;

type State = {
  theme: CompanyTheme | null;
  clientSecretLoading: boolean;
  clientSecret: string | null;
  selfProcessing: boolean;
  paymentGroupId: number;
  isEstablishmentBillingGroupSelected: boolean;
  selectedEstablishmentBillingGroup: EstablishmentBillingGroup;
  hideEstablishmentBillingGroupSelector: boolean;
};
export class BasketPaymentIntent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      theme: null,
      clientSecretLoading: true,
      clientSecret: null,
      selfProcessing: false,
      paymentGroupId: null,
      isEstablishmentBillingGroupSelected: true,
      selectedEstablishmentBillingGroup: null,
      hideEstablishmentBillingGroupSelector: false,
    };
  }

  setSelectedEstablishmentBillingGroup = (
    selectedEstablishmentBillingGroup: EstablishmentBillingGroup,
  ) => {
    this.setState({
      selectedEstablishmentBillingGroup,
    });
  };

  setIsEstablishmentBillingGroupSelected = (
    isEstablishmentBillingGroupSelected,
  ) => {
    this.setState({
      isEstablishmentBillingGroupSelected,
    });
  };

  componentDidMount() {
    this.props.fetchBasket(this.props.basketId, {
      onSuccess: (basket) => {
        this.props.fetchCompanyTheme(basket.company, {
          onSuccess: (theme) => {
            if (theme.enable_multi_localization) {
              this.props.fetchAllEstablishmentBillingGroup({
                params: { company: basket.company },
              });
            }
            this.setState({ theme });
          },
        });

        this.props.fetchInstalmentPaymentByBasket(this.props.basketId);

        if (!basket.is_finalized) {
          this.getSecret();
          this.props.fetchMembershipByBasket(
            {
              basket_uuid: this.props.basketId,
            },
            {
              onSuccess: (data) => {
                this.props.fetchMember(data.id, {
                  onError: () => {
                    this.setState({
                      hideEstablishmentBillingGroupSelector: true,
                      isEstablishmentBillingGroupSelected: true,
                    });
                  },
                });
              },
            },
          );
        }
      },
    });
    this.props.fetchPaymentMethodList({ basket: this.props.basketId });
    this.props.refreshBasket();
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    if (!this.state.hideEstablishmentBillingGroupSelector) {
      loadDefaultEstablishmentBillingGroup(
        this.state.theme?.enable_multi_localization,
        this.state.selectedEstablishmentBillingGroup,
        this.state.isEstablishmentBillingGroupSelected,
        this.setSelectedEstablishmentBillingGroup,
        this.setIsEstablishmentBillingGroupSelected,
        {
          defaultEstablishmentBillingGroup:
            prevProps.defaultEstablishmentBillingGroup,
          establishmentBillingGroups: prevProps.establishmentBillingGroups,
          basketoffers: prevProps.basketOffers,
        },
        {
          defaultEstablishmentBillingGroup:
            this.props.defaultEstablishmentBillingGroup,
          establishmentBillingGroups: this.props.establishmentBillingGroups,
          basketOffers: this.props.basketOffers,
        },
      );
    }
  }

  getSecret = () => {
    this.setState({ clientSecretLoading: true });
    requestClientSecretAPI(PAYMENT_ENGINE_STRIPE, PAYMENT_INTENT_TYPE_BASKET, {
      basket: this.props.basketId,
    })
      .then((r) => {
        this.setState({
          clientSecret: r.data.client_secret,
          clientSecretLoading: false,
          paymentGroupId: r.data.payment_group,
        });
      })
      .catch((err) => {
        console.error(err);
        this.setState({ clientSecretLoading: false });
      });
  };

  onSelectInstalmentPayment = (
    instalment_payment_id: number,
    options: OptionCallback,
  ) => {
    if (this.props.basket?.id) {
      this.props.assignInstalmentPayment(
        this.props.basket.id,
        instalment_payment_id,
        {
          onSuccess: () => {
            this.props.refreshBasket(options);
          },
          onError: options && options.onError,
        },
      );
    }
  };

  onSuccess = () => {
    const delays = [
      0, 1000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
      3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000, 3000,
    ];
    const sendMessage = (i: number) => {
      setTimeout(() => {
        if (window.ReactNativeWebView) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ status: 'succeeded' }),
          );
        }
        this.props.fetchBasket(this.props.basketId);
        if (i < delays.length) {
          sendMessage(i + 1);
        }
      }, delays[i]);
    };

    sendMessage(0);
  };

  validateUnpaid = () => {
    this.setState({ selfProcessing: true }, async () => {
      const basketIsValid = await this.props.checkItemsBasket(
        this.props.basketId,
      );
      if (!basketIsValid) {
        this.setState({ selfProcessing: false });
      }

      const { data } = await verifyPriceBasketAPI(this.props.basket.id);
      if (
        (!!this.props.basket.total_price_cts ||
          parseFloat(this.props.basket.total_price_cts) === 0) &&
        parseFloat(this.props.basket.total_price_cts) !== data
      ) {
        this.setState({ selfProcessing: false });
        // eslint-disable-next-line
        window.alert(this.props.t('myBasket.error.inconsistentBasket'));
        window.location.reload();
      } else {
        validateUnpaidAPI(this.props.basketId)
          .then(() => {
            this.onSuccess();
            this.setState({ selfProcessing: false });
          })
          .catch((err) => {
            console.error(err);
            this.setState({ selfProcessing: false });
          });
      }
    });
  };

  createPendingBookingsIfNecessary = (
    data: { payment_group_method_identifier?: number } = {},
  ) => {
    if (!this.props.basket) return;

    const basketHasOfferData = (this.props.basket.checkout_items || []).some(
      (checkoutItem) => checkoutItem?.extra_data?.offers_data?.length > 0,
    );

    if (basketHasOfferData) {
      createPendingBookingsAPI(this.props.basket.id, data).catch(
        (error: Error) => console.error(error),
      );
    }
  };

  updateMemberBillingGroup = (establishmentBillingGroupId: number) => {
    this.props.updateDefaultEstablishmentBillingGroup(
      this.props.basket.member,
      { default_establishment_billing_group: establishmentBillingGroupId },
    );
  };

  render() {
    const { classes, t } = this.props;
    if (!this.props.basket || !this.state.theme) {
      return (
        <div className={classes.container}>
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        </div>
      );
    }

    if (this.props.basket.is_finalized) {
      return (
        <div className={classes.container}>
          <div className={classes.loadingContainer}>
            <CheckIcon
              color="primary"
              fontSize="large"
              style={{ height: 128, width: 128 }}
            />
            <Typography>{t('myBasket.isFinalized')}</Typography>
          </div>
        </div>
      );
    }
    const basketPriceExcludingTax = getBasketTotalPriceExcludingTax(
      this.props.basket,
    );
    const taxPrice = (
      parseFloat(this.props.basket.total_price) -
      parseFloat(basketPriceExcludingTax)
    ).toFixed(2);

    return (
      <div className={classes.container}>
        {this.state.theme.is_tax_excluded_in_marketplace && (
          <BasketTaxInfo
            excludingTaxPrice={basketPriceExcludingTax}
            taxPrice={taxPrice}
          />
        )}
        <div className={classes.totalPrice}>
          <Typography component="p" variant="h4">
            {`${getCurrencyDisplayWithPrice(
              parseFloat(this.props.basket.total_price) -
                parseFloat(this.props.basket.total_price_prepaid_lines),
            )}`}
          </Typography>
        </div>
        {(this.props.loading ||
          this.props.processing ||
          this.props.paymentProcessing) && <LinearProgress color="primary" />}
        {this.props.basket?.prepaid_lines.map((pl) => (
          <PrepaidLineListItem
            key={pl.id}
            divider
            onRemove={this.props.onRemoveInternalAccountPrepaidLine}
            prepaid_line={pl}
          />
        ))}

        {!(
          this.validateUnpaid &&
          !isNil(this.props.basket.total_price_cts) &&
          (this.props.basket.total_price_cts || 0) -
            (this.props.basket.total_price_prepaid_lines_cts || 0)
        ) ? (
          <div className={classes.innerContainer}>
            <Button
              color="primary"
              disabled={
                this.state.selfProcessing ||
                this.props.basket?.checkout_items?.length === 0
              }
              onClick={() => this.validateUnpaid()}
              variant="contained"
            >
              {t('myBasket.actions.payZero')}
              {this.state.selfProcessing && (
                <CircularProgress
                  className={classes.circularProgress}
                  color="inherit"
                  size={24}
                />
              )}
            </Button>
          </div>
        ) : (
          <PaymentStripe
            fromApp
            termsAndConditionsAccepted
            allowConsumerToUseInternalAccount={
              this.state.theme.allow_consumer_to_use_internal_account
            }
            basketId={this.props.basketId}
            basketTotalPriceCts={this.props.basket.total_price_cts}
            basketTotalPricePrepaidLines={
              this.props.basket.total_price_prepaid_lines_cts
            }
            cardBillingDetailsMandatory={this.props.cardBillingDetailsMandatory}
            checkItemsBasket={this.props.checkItemsBasket}
            clientSecret={this.state.clientSecret}
            clientSecretLoading={this.state.clientSecretLoading}
            createPendingBookingsIfNecessary={
              this.createPendingBookingsIfNecessary
            }
            creditAccountBalance={this.props.creditAccountBalance}
            enableMultiLocalization={
              this.state.theme?.enable_multi_localization
            }
            establishmentBillingGroups={
              !this.state.hideEstablishmentBillingGroupSelector
                ? this.props.establishmentBillingGroups
                : []
            }
            instalmentPaymentConfigurationList={this.props.instalmentPaymentConfigurationList.filter(
              (ipc) => ipc.basketId === this.props.basket?.id,
            )}
            instalmentPaymentSelectedId={this.props.basket?.instalment_payment}
            isEstablishmentBillingGroupSelected={
              this.state.isEstablishmentBillingGroupSelected
            }
            loading={
              this.props.loading ||
              this.props.processing ||
              this.props.paymentProcessing
            }
            memberId={this.props.basket.member}
            onSelectInstalmentPayment={this.onSelectInstalmentPayment}
            onSuccess={this.onSuccess}
            paymentGroupId={this.state.paymentGroupId}
            paymentMethodChoices={PAYMENT_GROUP_METHOD_BY_ENGINE[
              PAYMENT_ENGINE_STRIPE
            ].filter((pm) =>
              (this.state.theme.payment_method_available_basket || []).includes(
                pm,
              ),
            )}
            paymentProcessing={this.props.paymentProcessing}
            selectedEstablishmentBillingGroup={
              !this.state.hideEstablishmentBillingGroupSelector
                ? this.state.selectedEstablishmentBillingGroup
                : null
            }
            setIsEstablishmentBillingGroupSelected={
              this.setIsEstablishmentBillingGroupSelected
            }
            setPaymentProcessing={this.props.setPaymentProcessing}
            setSelectedEstablishmentBillingGroup={
              this.setSelectedEstablishmentBillingGroup
            }
            stripeId={this.state.theme.stripe_id}
            updateMemberBillingGroup={this.updateMemberBillingGroup}
            useInternalAccount={this.props.useInternalAccount}
            validateUnpaid={this.validateUnpaid}
          />
        )}

        {this.props.basketError &&
          this.props.basketError.response &&
          this.props.basketError.response.status === 423 && (
            <Typography color="error">
              {t('myBasket.error.invalidBasket')}
            </Typography>
          )}
      </div>
    );
  }
}

const styles = (theme: Theme) => ({
  container: {
    width: '100%',
    minHeight: '100vh',
    overflowY: 'auto',
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: theme.spacing(4),
  },
  totalPrice: {
    padding: theme.spacing(4),
    marginBottom: theme.spacing(2),
    backgroundColor: '#eee',
    borderRadius: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    marginTop: theme.spacing(2),
    width: '100%',
  },

  circularProgress: {
    marginLeft: theme.spacing(2),
  },
});

const connectUsablecreditAccount = connect(
  (state: RootState, { basket }: { basket: Basket<number, PrepaidLine> }) => ({
    creditAccountBalance: getUsableCreditAccountBalance(state, basket?.company),
  }),
  null,
);
const connector = connect(
  (state: RootState, { basketId }: { basketId: string }) => {
    const basket = getBasket(state, basketId);
    return {
      basket,
      savedPaymentMethodList: getSavedPaymentMethodList(state),
      loading:
        state.checkout.basket.current.loading || state.checkout.basket.loading,
      processing: state.checkout.basket.current.updating,
      instalmentPaymentConfigurationList: getInstalmentForBasketList(state),
      cardBillingDetailsMandatory:
        state.theme.theme.force_billing_details_on_cards,
      establishmentBillingGroups: withEstablishment(
        getEnabledEstablishmentBillingGroups,
      )(state),
      defaultEstablishmentBillingGroup: getDefaultEstablishmentBillingGroup(
        state,
        basket?.member,
      ),
      basketOffers: withMetaActivity(
        withEstablishment((state_) =>
          getOffersListFromBasket(state_, basketId),
        ),
      )(state),
    };
  },
  {
    fetchBasket: fetchBasketAction,
    attachPayment: attachPaymentAction,
    fetchPaymentMethodList,
    fetchInstalmentPaymentByBasket: fetchInstalmentPaymentByBasketAction,
    assignInstalmentPayment: assignInstalmentPaymentAction,
    fetchCompanyTheme,
    createOrRefreshInternalAccountPrepaidLine:
      createOrRefreshInternalAccountPrepaidLineAction,
    fetchMembershipByBasket,
    snackbarErrorMsg: snackbarWarning,
    snackbarSuccessMsg: snackbarSuccess,
    fetchOfferBulk: fetchOfferBulkAction,
    fetchEstablishmentBulk: fetchEstablishmentBulkAction,
    fetchAllEstablishmentBillingGroup: fetchAllEstablishmentBillingGroupAction,
    updateDefaultEstablishmentBillingGroup:
      updateDefaultEstablishmentBillingGroupAction,
    fetchMember: fetchMemberAction,
  },
);
export default compose(
  withStyles(styles),
  withTranslation(['checkout']),
  routerParamsToProps({ basketId: 'basketId' }),
  withState('basketError', 'setBasketError', null),
  withState('paymentProcessing', 'setPaymentProcessing', false),
  connector,
  withProps(({ attachPayment, setBasketError, basketId }) => ({
    submitPaymentIntent: (data: any, options: OptionCallback) =>
      attachPayment(data, basketId, {
        onSuccess: (response: any) => {
          if (options && options.onSuccess) options.onSuccess(response);
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ status: 'succeeded' }),
          );
        },
        onError: (error: Error) => {
          setBasketError(error);
          if (options && options.onError) options.onError(error);
        },
      }),
  })),
  withHandlers({
    fetchOfferWithEstablishmentAndActivityBulk:
      ({ fetchOfferBulk, fetchEstablishmentBulk }) =>
      (ids) => {
        fetchOfferBulk(ids, {
          onSuccess: (offerList) => {
            fetchEstablishmentBulk([offerList.map((b) => b.establishment)]);
          },
        });
      },
  }),
  withHandlers({
    refreshBasket:
      ({ fetchBasket, basketId, fetchOfferWithEstablishmentAndActivityBulk }) =>
      (options: OptionCallback) =>
        fetchBasket(basketId, {
          onSuccess: (basket) => {
            options?.onSuccess?.();
            const offerIdsList = basket.checkout_items
              ?.filter(
                (checkoutItem) =>
                  checkoutItem.extra_data?.offers_data &&
                  checkoutItem.extra_data.offers_data.length,
              )
              .map((checkoutItem) =>
                checkoutItem.extra_data.offers_data.map(
                  (offerData) => offerData.offer_id,
                ),
              )
              .flat();
            fetchOfferWithEstablishmentAndActivityBulk(offerIdsList);
          },
        }),
  }),
  withHandlers({
    checkItemsBasket:
      ({ snackbarErrorMsg, refreshBasket }) =>
      async (basketId: string) => {
        try {
          await checkItemsBasketAPI(basketId);
        } catch (error) {
          if (isErrorWithCustomCode(error) && error.response.data) {
            error.response.data.forEach((exc: { error_code: number }) => {
              const { error_code } = exc;
              if (ALL_ERROR_CODES.includes(error_code)) {
                snackbarErrorMsg(`canNotBuyErrorCode.${error_code}`);
              } else {
                snackbarErrorMsg('canNotBuyErrorCode.generic');
              }
            });
            refreshBasket();
            return false;
          }
        }
        return true;
      },
    useInternalAccount:
      ({
        createOrRefreshInternalAccountPrepaidLine,
        fetchInstalmentPaymentByBasket,
        fetchBasket,
        basket,
      }) =>
      (amount: number, options: OptionCallback) => {
        createOrRefreshInternalAccountPrepaidLine(basket.id, amount, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
            fetchBasket(basket.id, {
              onSuccess: () => {
                fetchInstalmentPaymentByBasket(basket.id);
              },
            });
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
    onRemoveInternalAccountPrepaidLine:
      ({
        createOrRefreshInternalAccountPrepaidLine,
        fetchInstalmentPaymentByBasket,
        fetchBasket,
        basket,
      }) =>
      (options: OptionCallback) => {
        createOrRefreshInternalAccountPrepaidLine(basket.id, 0, {
          onSuccess: () => {
            if (options && options.onSuccess) options.onSuccess();
            fetchBasket(basket.id, {
              onSuccess: () => {
                fetchInstalmentPaymentByBasket(basket.id);
              },
            });
          },
          onError: () => {
            if (options && options.onError) options.onError();
          },
        });
      },
  }),
  connectUsablecreditAccount,
)(BasketPaymentIntent);
