// @flow

import React, { Component } from 'react';

import { withNamespaces } from 'react-i18next';
import type { TFunction } from 'react-i18next';

import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push as routerPush, goBack } from 'react-router-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import { compose } from 'recompose';

import withSnackbar from '../../hocs/with-snackbar.hoc';
import { fetchCompanyTheme } from '../../libs/theme/actions';
import { bookAnOption } from '../../api/payment';
import parse from '../../query-string';
import themeSelectors from '../../libs/theme/selectors';
import { getTheme } from '../../theme';
import type { Theme } from '../../libs/theme/types';

import { payment as paymentActions } from '../../actions';
import ConsumerModalContainer from '../../components/consumer/ConsumerModalContainer.component';
import type { Offer, ConsumerPaymentPackManagerView } from '../../api/types';

import OfferPaymentForm from './offer/OfferPaymentForm.component';

type Props = {
  match: Object,

  t: TFunction,
  offer: ?Offer,
  location: Object,

  loading: boolean,
  compatibleConsumerPacksLoading: boolean,
  compatiblePaymentPacksLoading: boolean,
  bookingOptionLoading: boolean,
  bookingOption: ?BookingOption,
  hasOneOrMoreOption: boolean,
  consumer: { consumer: number },
  fetchCompanyTheme: (number) => void,
  theme: Theme,

  compatibleConsumerPacks: Array<ConsumerPaymentPackManagerView>,
  compatiblePaymentPacks: Array<PaymentPack>,

  goBack: () => void,
  fetchBookingOption: (id: number) => void,
  checkBookingOptionExistence: (offerId: number) => void,
  pushRouter: (path: string) => void,
  fetchOffer: (number) => void,
  fetchCompatiblePass: (number) => void,
  fetchCompatiblePaymentPacks: (number) => void,
  snackbar: { success: (string) => void },
};

type State = {
  completed: boolean,
  processing: boolean,
};

export class OfferPaymentPage extends Component<Props, State> {
  state = { completed: false, processing: false };

  onCompletePurchase = () => {
    const { snackbar, t } = this.props;
    snackbar.success(t('bookingConfirmed'));
    this.setState({ completed: true });
  };

  componentWillMount() {
    const { option_id } = parse(this.props.location.search);
    if (option_id) {
      this.props.fetchBookingOption(option_id);
    }
  }

  componentDidMount() {
    const offerId = parseInt(this.props.match.params.id, 10);
    this.offerId = offerId;
    this.props.fetchOffer(offerId);
    this.props.fetchCompatiblePass(offerId);
    this.props.fetchCompatiblePaymentPacks(offerId);
    this.props.checkBookingOptionExistence(offerId);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.offer !== this.props.offer && this.props.offer) {
      this.props.fetchCompanyTheme(this.props.offer.activity.company);
    }
  }

  bookAnOption = (offerId: number) => {
    this.setState({ processing: true });
    bookAnOption(offerId, this.props.consumer.consumer)
      .then((res) => {
        if (res.status === 201) {
          this.props.pushRouter('/customer');
        }
      })
      .catch((err) => {
        this.setState({ processing: false });
        console.error(err);
      });
  };

  goToPassMarketplace = () => {
    if (this.props.theme && this.props.theme.scheduleURL) {
      window.location.href = this.props.theme.scheduleURL;
    } else {
      this.props.goBack();
    }
  };

  buyPaymentPack = (packId: number) => {
    this.props.pushRouter(
      `/customer/payment/pass/${packId}?nextOffer=${this.offerId}`,
    );
  };

  render() {
    if (this.state.completed) {
      return <Redirect to="/" />;
    }

    return (
      <MuiThemeProvider theme={getTheme(this.props.theme)}>
        <ConsumerModalContainer>
          <OfferPaymentForm
            offer={this.props.offer}
            loading={
              this.props.loading ||
              this.state.processing ||
              this.props.bookingOptionLoading
            }
            bookingOption={this.props.bookingOption}
            compatibleConsumerPacks={this.props.compatibleConsumerPacks}
            compatibleConsumerPacksLoading={
              this.props.compatibleConsumerPacksLoading
            }
            compatiblePaymentPacksLoading={
              this.props.compatiblePaymentPacksLoading
            }
            compatiblePaymentPacks={this.props.compatiblePaymentPacks}
            onCompletePurchase={this.onCompletePurchase}
            onBuyPaymentPack={this.buyPaymentPack}
            goToPassMarketplace={this.goToPassMarketplace}
            bookAnOption={this.bookAnOption}
            option_id={this.option_id}
            hasOneOrMoreOption={this.props.hasOneOrMoreOption}
          />
        </ConsumerModalContainer>
      </MuiThemeProvider>
    );
  }
}

export default compose(
  withNamespaces(),
  withSnackbar,
  connect(
    (state) => ({
      offer: state.payment.wantedOffer,
      consumer: state.consumer.profile,
      loading: state.payment.loading,
      compatibleConsumerPacks: state.payment.compatibleConsumerPacks,
      compatiblePaymentPacks: state.payment.compatiblePaymentPacks,
      compatiblePaymentPacksLoading:
        state.payment.compatibleConsumerPacksLoading,
      compatibleConsumerPacksLoading:
        state.payment.compatibleConsumerPacksLoading,
      bookingOption: state.payment.bookingOption.data,
      bookingOptionLoading: state.payment.bookingOption.loading,
      hasOneOrMoreOption: state.payment.bookingOption.hasOne,
      theme: themeSelectors.getTheme(state),
    }),
    {
      fetchOffer: paymentActions.fetchOffer,
      fetchCompanyTheme,
      fetchBookingOption: paymentActions.fetchBookingOption,
      checkBookingOptionExistence: paymentActions.checkOptionExistence,
      fetchCompatiblePass: paymentActions.fetchCompatiblePass,
      fetchCompatiblePaymentPacks: paymentActions.fetchCompatiblePaymentPacks,
      pushRouter: (path) => routerPush(path),
      goBack,
    },
  ),
)(OfferPaymentPage);
