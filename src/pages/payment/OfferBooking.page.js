// @flow

import React, { Component } from 'react';

import { connect } from 'react-redux';
import { push as pushRouter, goBack as goBackRouter } from 'react-router-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { compose, withProps, withState, withHandlers } from 'recompose';
import routerParamsToProps from '../../hocs/router-params-to-props.hoc';

import { snackbarSuccess } from '../../actions/snackbar.actions';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import {
  getOfferById,
  withEstablishment,
  withCoach,
  withMetaActivity,
} from '../../libs/offer/selectors';
import { consumerPayWithConsumerPaymentPack as payWithConsumerPaymentPackAPI } from '../../api/payment';
import { retrieveOffer as fetchOfferAction } from '../../libs/offer/actions';
import themeSelectors from '../../libs/theme/selectors';
import { getTheme } from '../../theme';
import type { Theme } from '../../libs/theme/types';

import { linkMeToCompany } from '../../libs/member/actions';
import PaymentContainer from './PaymentContainer.component';

import {
  fetchConsumerPaymentPackForBooking as fetchConsumerPaymentPackForBookingAction,
  resetConsumerPackForBooking as resetConsumerPackForBookingAction,
} from '../../libs/consumer-payment-pack/actions';
import {
  getConsumerPaymentPackForBooking,
  withPaymentPack,
} from '../../libs/consumer-payment-pack/selectors';
import type { ConsumerPaymentPack } from '../../libs/consumer-payment-pack/types';

import {
  fetchPaymentPackForBooking,
  fetchPaymentPackBulk as fetchPaymentPackBulkAction,
  resetPaymentPackForBooking as resetPaymentPackForBookingAction,
} from '../../libs/payment-packs/actions';
import { getPaymentPackForBooking } from '../../libs/payment-packs/selectors';

import {
  fetchPaymentComboForBooking,
  resetPaymentComboForBooking as resetPaymentComboForBookingAction,
} from '../../libs/payment-combo/actions';
import { getPaymentComboForBooking } from '../../libs/payment-combo/selectors';
import type { PaymentCombo } from '../../libs/payment-combo/types';

import BookingModule from '../../libs/booking/components/BookingModule.component';
import {
  registerToWaitingList as registerOptionAction,
  fetchBookingOptionForBooking as fetchBookingOptionForBookingAction,
  resetBookingOptionForBooking as resetBookingOptionForBookingAction,
} from '../../libs/waiting-list/actions';
import {
  getBookingOptionListForBookingConvertible,
  getBookingOptionListForBookingNotConvertible,
} from '../../libs/waiting-list/selectors';
import {
  fetchContractForBooking as fetchContractForBookingAction,
  resetContractForBooking as resetContractForBookingAction,
} from '../../libs/subscription/actions';
import {
  getContractForBooking,
  withPaymentPack as withPaymentPackForContract,
} from '../../libs/subscription/selectors';

import { fetchEstablishmentBulk as fetchEstablishmentBulkAction } from '../../libs/establishment/actions';
import { fetchCoachBulk as fetchCoachBulkAction } from '../../libs/associated-coach/actions';
import { fetchMetaActivityBulk as fetchMetaActivityBulkAction } from '../../libs/meta-activity/actions';

import SubscriptionContractBooking from './SubscriptionBooking.component';

type Props = {
  offer: ?Offer,

  buyableItemsLoading: boolean,
  contractList: Array<Contract>,

  authenticated: boolean,
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
  setSelectedContract: (?Contract) => void,
  selectedContract: ?Contract,
};

export class OfferPaymentPage extends Component<Props, State> {
  fetchData = () => {
    const { offerId } = this.props;
    this.props.fetchBookingOptionForBooking(offerId);
    this.props.fetchOffer();
    this.props.fetchConsumerPaymentPackForBooking(offerId);
  };

  fetchCompanyData = () => {
    this.props.fetchCompanyTheme(this.props.offer.company);
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
  };

  componentWillMount() {
    this.props.resetBuyableItems();
  }

  componentDidMount() {
    this.fetchData();
    if (this.props.authenticated) {
      this.props.linkMeToCompany({ offer: this.props.offerId });
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.offer !== this.props.offer && this.props.offer) {
      this.fetchCompanyData();
    }
    if (this.props.authenticated && !prevProps.authenticated) {
      this.props.linkMeToCompany({ offer: this.props.offerId });
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <PaymentContainer
          hidePaper
          loading={
            !this.props.offer ||
            !this.props.offer.establishment ||
            !this.props.offer.meta_activity
          }
        >
          <BookingModule
            offer={this.props.offer}
            theme={this.props.theme}
            loading={this.props.consumerPaymentPackLoading}
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
            bookWithConsumerPaymentPack={this.props.bookWithConsumerPaymentPack}
            buyPaymentCombo={this.props.buyPaymentCombo}
            buyPaymentPack={this.props.buyPaymentPack}
            buyContract={this.props.setSelectedContract}
            goBack={this.props.goBack}
          />
          <SubscriptionContractBooking
            contract={this.props.selectedContract}
            onSubmit={() => {
              this.props.fetchConsumerPaymentPackForBooking(this.props.offerId);
              this.props.setSelectedContract(null);
            }}
            onCancel={() => this.props.setSelectedContract(null)}
          />
        </PaymentContainer>
      </MuiThemeProvider>
    );
  }
}

export default compose(
  routerParamsToProps({ id: 'offerId:number', offerId: 'offerId:number' }),
  withState('processing', 'setProcessing', false),
  withState('selectedContract', 'setSelectedContract', null),
  connect(
    (state, { offerId }) => ({
      authenticated: state.auth.authenticated,
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

      bookingOptionListConvertible: getBookingOptionListForBookingConvertible(
        state,
      ),
      bookingOptionListUnconvertible: getBookingOptionListForBookingNotConvertible(
        state,
      ),

      theme: themeSelectors.getTheme(state),
    }),
    {
      linkMeToCompany,
      fetchCompanyTheme,
      snackbarSuccess,

      fetchConsumerPaymentPackForBooking: fetchConsumerPaymentPackForBookingAction,
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
    resetBuyableItems: ({
      resetPaymentComboForBooking,
      resetBookingOptionForBooking,
      resetPaymentPackForBooking,
      resetContractForBooking,
      resetConsumerPackForBooking,
    }) => () => {
      resetPaymentPackForBooking();
      resetPaymentComboForBooking();
      resetConsumerPackForBooking();
      resetContractForBooking();
      resetBookingOptionForBooking();
    },
    fetchContactForBooking: ({
      fetchContactForBooking,
      fetchPaymentPackBulk,
    }) => (offer, company) => {
      fetchContactForBooking(offer, company, {
        onSuccess: (contractList) =>
          fetchPaymentPackBulk(contractList.map((c) => c.payment_pack)),
      });
    },
    fetchConsumerPaymentPackForBooking: ({
      fetchConsumerPaymentPackForBooking,
      fetchPaymentPackBulk,
    }) => (offer) => {
      fetchConsumerPaymentPackForBooking(offer, {
        onSuccess: (cppList) =>
          fetchPaymentPackBulk(cppList.map((cpp) => cpp.payment_pack)),
      });
    },
    fetchOffer: ({
      fetchOffer,
      fetchEstablishmentBulk,
      fetchMetaActivityBulk,
      fetchCoachBulk,
      offerId,
    }) => () => {
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

    buyPaymentPack: ({ offerId, push }) => (packId: number) =>
      push(`/customer/payment/pass/${packId}?nextOffer=${offerId}`),

    buyPaymentCombo: ({ offerId, push }) => (paymentComboId: number) =>
      push(`/customer/payment/combo/${paymentComboId}?nextOffer=${offerId}`),

    bookWithConsumerPaymentPack: ({ offer, push }) => (
      consumerPaymentPackId,
      options,
    ) => {
      payWithConsumerPaymentPackAPI(consumerPaymentPackId, offer.id)
        .then(() => {
          push(`/c/${offer.company}/?from_direct_booking=${offer.id}`);
          if (options && options.onSuccess) options.onSuccess();
        })
        .catch((err) => {
          console.error(err);
          if (options && options.onError) options.onError(err);
        });
    },

    registerOption: ({ registerOption, offer, push, setProcessing }) => (
      options,
    ) => {
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
