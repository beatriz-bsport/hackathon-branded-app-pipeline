// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import {
  push as pushRouter,
  goBack as goBackRouter,
} from 'connected-react-router';
import { Redirect } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { fade } from '@material-ui/core/styles/colorManipulator';

import withStyles from '@material-ui/core/styles/withStyles';
import { compose, withProps, withState, withHandlers } from 'recompose';
import { withTranslation } from 'react-i18next';
import MarketplaceAppBar from '../../marketplace/MarketplaceAppBar.component';

import MarketplaceBasketDialog from '../../marketplace/MarketplaceBasketDialog.component';
import routerParamsToProps from '../../../hocs/router-params-to-props.hoc';
import { auth as authActions } from '../../../actions';
import { getCurrentBasket } from '../../../libs/checkout/selectors';

import { fetchCompanyTheme } from '../../../libs/theme/actions';
import {
  addItemToBasket,
  removeItemFromBasket,
  fetchCurrentBasket,
} from '../../../libs/checkout/actions';
import {
  getOfferById,
  withEstablishment,
  withCoach,
  withMetaActivity,
} from '../../../libs/offer/selectors';
import { snackbarError as snackbarErrorActions } from '../../../libs/snackbar/actions';
import Analytics from '../../../components/analytics/Analytics.component';
import { consumerPayWithConsumerPaymentPack as payWithConsumerPaymentPackAPI } from '../../../api/payment';
import { retrieveOffer as fetchOfferAction } from '../../../libs/offer/actions';
import themeSelectors from '../../../libs/theme/selectors';
import { getTheme } from '../../../theme';
import type { Theme } from '../../../libs/theme/types';

import { linkMeToCompany } from '../../../libs/member/actions';
import PaymentContainer from './PaymentContainer.component';

import {
  fetchConsumerPaymentPackForBooking as fetchConsumerPaymentPackForBookingAction,
  resetConsumerPackForBooking as resetConsumerPackForBookingAction,
} from '../../../libs/consumer-payment-pack/actions';
import {
  getConsumerPaymentPackForBooking,
  withPaymentPack,
} from '../../../libs/consumer-payment-pack/selectors';
import type { ConsumerPaymentPack } from '../../../libs/consumer-payment-pack/types';

import {
  fetchPaymentPackForBooking,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  resetPaymentPackForBooking as resetPaymentPackForBookingAction,
} from '../../../libs/payment-packs/actions';
import { getPaymentPackForBooking } from '../../../libs/payment-packs/selectors';

import {
  fetchPaymentComboForBooking,
  resetPaymentComboForBooking as resetPaymentComboForBookingAction,
} from '../../../libs/payment-combo/actions';
import { getPaymentComboForBooking } from '../../../libs/payment-combo/selectors';
import type { PaymentCombo } from '../../../libs/payment-combo/types';

import BookerModuleConsumer from '../../../libs/booking/components/booker-module/BookerModuleConsumer.component';
import {
  registerToWaitingList as registerOptionAction,
  fetchBookingOptionForBooking as fetchBookingOptionForBookingAction,
  resetBookingOptionForBooking as resetBookingOptionForBookingAction,
} from '../../../libs/waiting-list/actions';
import {
  getBookingOptionListForBookingConvertible,
  getBookingOptionListForBookingNotConvertible,
} from '../../../libs/waiting-list/selectors';
import {
  fetchContractForBooking as fetchContractForBookingAction,
  resetContractForBooking as resetContractForBookingAction,
} from '../../../libs/subscription/actions';
import {
  getContractForBooking,
  withPaymentPack as withPaymentPackForContract,
} from '../../../libs/subscription/selectors';

import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../../libs/establishment/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../../libs/associated-coach/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../../libs/meta-activity/actions';
import { fetchProfile } from '../../../libs/consumer-space/actions';
import { isRegistered as offerIsRegisteredAPI } from '../../../libs/offer/api';

import { requestSetupIntentSecret as requestSetupIntentSecretAPI } from '../../../libs/payment/api';

import SubscriptionContractBooking from './SubscriptionPaymentDialog.component';
import WidgetUtils from '../../../libs/widget/WidgetUtils';

type Props = {
  offer: ?Offer,

  buyableItemsLoading: boolean,
  contractList: Array<Contract>,

  linkMeToCompany: (data: { offer: number }) => void,

  bookingOptionListConvertible: Array<BookingOption>,
  bookingOptionListUnconvertible: Array<BookingOption>,
  consumer: { consumer: number },
  fetchCompanyTheme: (number) => void,
  theme: Theme,
  offerId: number,

  consumerPaymentPackList: Array<ConsumerPaymentPack>,
  paymentPackList: Array<PaymentPack>,

  buyPaymentCombo: (comboId: number, offerId: number) => void,
  paymentComboList: Array<PaymentCombo>,

  goBack: () => void,
  fetchBookingOptionForBooking: (offer: number) => void,
  fetchOffer: (number) => void,
  disconnect: () => void,
  auth: any,

  fetchContactForBooking: (number, number) => void,
  fetchConsumerPaymentPackForBooking: (number) => void,
  fetchPaymentPackForBooking: (number, number) => void,
  fetchPaymentComboForBooking: (number, number) => void,
  resetBuyableItems: () => void,
  registerOption: (OptionCallback) => void,
  bookWithConsumerPaymentPack: (number, OptionCallback) => void,
  buyPaymentPack: (number) => void,
  buyPaymentCombo: (number) => void,
  consumerPaymentPackLoading: boolean,
  setSelectedContract: (contact: ?Contract) => void,
  selectedContract: ?Contract,

  requestSetupIntentSecret: (id: number) => void,
  fetchCurrentBasket: (companyId: number) => void,
  currentBasket: ?Basket,
  currentBasketLoading: boolean,
  removeItemFromBasket: (basketId: string, data: any) => void,
  addItemToBasket: (basketId: string, data: any) => void,
  goToCheckout: (companyId: number) => void,

  fetchProfile: () => void,
  goToUserSpace: () => void,

  classes: Object,
};

type State = {
  has_registered: boolean,
  currentBasketOpen: boolean,
};

export class OfferPaymentPage extends Component<Props, State> {
  state = {
    has_registered: false,
    currentBasketOpen: false,
  };

  fetchData = () => {
    const { offerId } = this.props;
    if (this.props.auth.authenticated) {
      if (this.props.offer) {
        this.props.fetchCurrentBasket(this.props.offer.company);
      }
      this.props.fetchProfile();
    }
    this.props.fetchBookingOptionForBooking(offerId);
    this.props.fetchOffer();
    this.props.fetchConsumerPaymentPackForBooking(offerId);
  };

  fetchCompanyData = () => {
    if (this.props.offer) {
      this.props.fetchCompanyTheme(this.props.offer.company);
      this.requestSetupIntentSecret();
      this.props.fetchPaymentPackForBooking(
        this.props.offer.id,
        this.props.offer.company,
      );
      this.props.fetchPaymentComboForBooking(
        this.props.offer.company,
        this.props.offerId,
      );
      this.props.fetchContactForBooking(
        this.props.offerId,
        this.props.offer.company,
      );
    }
  };

  requestSetupIntentSecret = () => {
    return this.props.requestSetupIntentSecret(this.props.offer.company);
  };

  componentWillMount() {
    this.props.resetBuyableItems();
  }

  componentDidMount() {
    this.fetchData();
    this.fetchCompanyData();
    if (this.props.auth.authenticated) {
      this.props.linkMeToCompany({ offer: this.props.offerId });
    }
    offerIsRegisteredAPI(this.props.offerId)
      .then((res) => this.setState({ has_registered: res.data }))
      .catch(console.error);
  }

  componentDidUpdate(prevProps: Props) {
    if (
      (!prevProps.offer && !!this.props.offer) ||
      (this.props.offer && this.props.offer.id !== prevProps.offer.id)
    ) {
      this.fetchCompanyData();
    }
    if (this.props.auth.authenticated && !prevProps.auth.authenticated) {
      this.props.linkMeToCompany({ offer: this.props.offerId });
    }
    if (this.props.auth.authenticated !== prevProps.auth.authenticated) {
      this.fetchData();
    }
  }

  toogleCurrentBasketOpen = (currentBasketOpen: boolean) =>
    this.setState({ currentBasketOpen });

  render() {
    if (this.props.offer && this.props.offer.meta_activity) {
      return (
        <Redirect
          to={`/payment/offer-booker-module/${this.props.offerId}?membership=${this.props.offer.meta_activity.company}`}
        />
      );
    }
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <Analytics theme={this.props.theme} />
        <div className={this.props.classes.subContainer}>
          <MarketplaceAppBar
            isWidget={WidgetUtils.isWidget()}
            paper
            auth={this.props.auth}
            logo={this.props.theme && this.props.theme.cover}
            goToUserSpace={() =>
              this.props.offer &&
              this.props.goToUserSpace(this.props.offer.company)
            }
            currentBasket={this.props.currentBasket}
            openCurrentBasket={() => this.toogleCurrentBasketOpen(true)}
            disconnect={() => {
              this.props.disconnect();
            }}
            onCancel={() => this.props.setSelectedContract(null)}
            requestSetupIntentSecret={this.requestSetupIntentSecret}
            companyId={this.props.offer && this.props.offer.company}
          />
          <div className={this.props.classes.container}>
            <PaymentContainer
              hidePaper
              loading={
                !this.props.offer ||
                !this.props.offer.establishment ||
                !this.props.offer.meta_activity
              }
            >
              <BookerModuleConsumer
                offer={this.props.offer}
                theme={this.props.theme}
                loading={this.props.consumerPaymentPackLoading}
                hasRegistered={this.state.has_registered}
                buyableItemsLoading={this.props.buyableItemsLoading}
                bookingOptionListConvertible={
                  this.props.bookingOptionListConvertible
                }
                bookingOptionListUnconvertible={
                  this.props.bookingOptionListUnconvertible
                }
                comboList={this.props.paymentComboList}
                contractList={this.props.contractList}
                consumerPaymentPackList={this.props.consumerPaymentPackList}
                paymentPackList={this.props.paymentPackList}
                registerOption={this.props.registerOption}
                bookWithConsumerPaymentPack={
                  this.props.bookWithConsumerPaymentPack
                }
                buyPaymentCombo={this.props.buyPaymentCombo}
                buyPaymentPack={this.props.buyPaymentPack}
                buyContract={this.props.setSelectedContract}
                goBack={this.props.goBack}
              />
              <SubscriptionContractBooking
                contract={this.props.selectedContract}
                companyId={this.props.offer && this.props.offer.company}
                requestSetupIntentSecret={this.requestSetupIntentSecret}
                onSubmit={() => {
                  this.props.fetchConsumerPaymentPackForBooking(
                    this.props.offerId,
                  );
                  this.props.setSelectedContract(null);
                }}
                onCancel={() => this.props.setSelectedContract(null)}
              />
            </PaymentContainer>
          </div>
          <MarketplaceBasketDialog
            open={!!this.state.currentBasketOpen}
            basket={this.props.currentBasket}
            onCancel={() => this.toogleCurrentBasketOpen(false)}
            loading={this.props.currentBasketLoading}
            onRemoveCheckoutItem={(data) =>
              this.props.removeItemFromBasket(this.props.currentBasket.id, data)
            }
            onAddCheckoutItem={(data) =>
              this.props.addItemToBasket(this.props.currentBasket.id, data)
            }
            goToCheckout={() =>
              this.props.goToCheckout(this.props.currentBasket.company)
            }
          />
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = (theme) => ({
  subContainer: {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'column',
    backgroundColor: '#efefef',
    overflow: 'auto',
    paddingBottom: theme.spacing(20),
  },
  container: {
    paddingBottom: theme.spacing(32),
    paddingTop: theme.spacing(6),
  },
  accountIcon: {
    marginRight: theme.spacing(1),
  },
  loginButton: {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),
  },
});
export default compose(
  routerParamsToProps({ id: 'offerId:number', offerId: 'offerId:number' }),
  withState('processing', 'setProcessing', false),
  withState('selectedContract', 'setSelectedContract', null),
  withTranslation(['booking', 'subscription', 'payment']),
  withStyles(styles),
  connect(
    (state, { offerId }) => ({
      auth: state.auth,
      currentBasket: getCurrentBasket(state),
      currentBasketLoading: state.checkout.basket.current.loading,
      offer: withMetaActivity(withCoach(withEstablishment(getOfferById)))(
        state,
        offerId,
      ),
      contractList: withPaymentPackForContract(getContractForBooking)(state),
      consumerPaymentPackList: withPaymentPack(
        getConsumerPaymentPackForBooking,
      )(state),
      paymentPackList: getPaymentPackForBooking(state),
      paymentComboList: getPaymentComboForBooking(state),

      consumerPaymentPackLoading: state.consumerPaymentPack.forBooking.loading,
      comboLoading: state.paymentCombo.forBooking.loading,
      contractLoading: state.subscription.contract.forBooking.loading,
      paymentPackLoading: state.paymentPack.forBooking.loading,

      bookingOptionListConvertible:
        getBookingOptionListForBookingConvertible(state),
      bookingOptionListUnconvertible:
        getBookingOptionListForBookingNotConvertible(state),

      theme: themeSelectors.getTheme(state),
    }),
    {
      linkMeToCompany,
      fetchCompanyTheme,
      disconnect: authActions.disconnect,
      goToUserSpace: (id) => pushRouter(`/c/${id}/`),
      goToCheckout: (companyId) => pushRouter(`/checkout/${companyId}/`),

      fetchCurrentBasket,
      fetchProfile,
      addItemToBasket,
      removeItemFromBasket,

      fetchConsumerPaymentPackForBooking:
        fetchConsumerPaymentPackForBookingAction,
      resetConsumerPackForBooking: resetConsumerPackForBookingAction,

      fetchPaymentPackForBooking,
      fetchPaymentPackBulk: fetchPaymentPackBulkAction,
      resetPaymentPackForBooking: resetPaymentPackForBookingAction,

      fetchPaymentComboForBooking,
      resetPaymentComboForBooking: resetPaymentComboForBookingAction,

      fetchContactForBooking: fetchContractForBookingAction,
      resetContractForBooking: resetContractForBookingAction,

      fetchEstablishmentBulk: fetchEstablishmentBulkAction,
      fetchCoachBulk: fetchCoachBulkAction,
      fetchMetaActivityBulk: fetchMetaActivityBulkAction,
      fetchOffer: fetchOfferAction,
      snackbarError: snackbarErrorActions,
      goBack: goBackRouter,
      push: pushRouter,
      registerOption: registerOptionAction,
      fetchBookingOptionForBooking: fetchBookingOptionForBookingAction,
      resetBookingOptionForBooking: resetBookingOptionForBookingAction,
    },
  ),
  withProps(({ paymentPackLoading, contractLoading, comboLoading }) => ({
    buyableItemsLoading: paymentPackLoading || contractLoading || comboLoading,
  })),
  withHandlers({
    requestSetupIntentSecret: () => (companyId) =>
      requestSetupIntentSecretAPI(null, companyId),
    resetBuyableItems:
      ({
        resetPaymentComboForBooking,
        resetBookingOptionForBooking,
        resetPaymentPackForBooking,
        resetContractForBooking,
        resetConsumerPackForBooking,
      }) =>
      () => {
        resetPaymentPackForBooking();
        resetPaymentComboForBooking();
        resetConsumerPackForBooking();
        resetContractForBooking();
        resetBookingOptionForBooking();
      },
    fetchContactForBooking:
      ({ fetchContactForBooking, fetchPaymentPackBulk }) =>
      (offer, company) => {
        fetchContactForBooking(offer, company, {
          onSuccess: (contractList) =>
            fetchPaymentPackBulk(contractList.map((c) => c.payment_pack)),
        });
      },
    fetchConsumerPaymentPackForBooking:
      ({ fetchConsumerPaymentPackForBooking, fetchPaymentPackBulk }) =>
      (offer) => {
        fetchConsumerPaymentPackForBooking(offer, {
          onSuccess: (cppList) =>
            fetchPaymentPackBulk(cppList.map((cpp) => cpp.payment_pack)),
        });
      },
    fetchOffer:
      ({
        fetchOffer,
        fetchEstablishmentBulk,
        fetchMetaActivityBulk,
        fetchCoachBulk,
        offerId,
      }) =>
      () => {
        fetchOffer(offerId, {
          onSuccess: (o) => {
            fetchEstablishmentBulk([o.establishment, o.establishment_override]);
            fetchCoachBulk([o.coach, o.coach_override]);
            fetchMetaActivityBulk([o.meta_activity]);
          },
        });
      },
    goToPassMarketplace: ({ theme, goBack }) => {
      if (theme && theme.scheduleURL) {
        window.location.href = theme.scheduleURL;
      } else {
        goBack();
      }
    },

    buyPaymentPack:
      ({ offerId, push }) =>
      (packId: number) =>
        push(`/customer/payment/pass/${packId}?nextOffer=${offerId}`),

    buyPaymentCombo:
      ({ offerId, push }) =>
      (paymentComboId: number) =>
        push(`/customer/payment/combo/${paymentComboId}?nextOffer=${offerId}`),

    bookWithConsumerPaymentPack:
      ({ offer, push, t, snackbarError }) =>
      (consumerPaymentPackId, options) => {
        payWithConsumerPaymentPackAPI(consumerPaymentPackId, offer.id)
          .then(() => {
            if (WidgetUtils.isWidget()) {
              WidgetUtils.paymentSuccess();
            }

            push(`/c/${offer.company}/?from_direct_booking=${offer.id}`);
            if (options && options.onSuccess) options.onSuccess();
          })
          .catch((err) => {
            console.error(err);
            if (err && err.response && err.response.status === 423) {
              switch (err.response.data) {
                case 'unavailable for female':
                  snackbarError(t('bookingModule.messages.femaleUnavailable'));
                  break;
                case 'unavailable for male':
                  snackbarError(t('bookingModule.messages.maleUnavailable'));
                  break;
                default:
                  snackbarError(t('bookingModule.messages.offerLocked'));
                  break;
              }
            }
            if (options && options.onError) options.onError(err);
          });
      },

    registerOption:
      ({ registerOption, offer, push, setProcessing }) =>
      (options) => {
        setProcessing(true);
        registerOption(offer.id, null, {
          onSuccess: (...args) => {
            setProcessing(false);
            push(`/c/${offer.company}/`);
            if (options && options.onSuccess) options.onSuccess(...args);
          },
          onError: (err) => {
            setProcessing(false);
            if (options && options.onError) options.onError(err);
          },
        });
      },
  }),
)(OfferPaymentPage);
