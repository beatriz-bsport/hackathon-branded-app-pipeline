// @flow

import React from 'react';
import { compose } from 'recompose';

import withStyles from '@material-ui/core/styles/withStyles';
import GoogleAnalytics from './GoogleAnalytics';
import FacebookPixel from './FacebookPixel';

type Props = {
  theme?: ?CompanyTheme,
  isInternal?: boolean,
};

class Analytics extends React.Component<Props> {
  init = () => {
    if (!this.props.theme) {
      return;
    }

    let { gtmId } = this.props.theme;

    if (this.props.isInternal || !gtmId) {
      gtmId = 'GTM-W4G3NQ6';
    }

    if (!this.props.isInternal) {
      FacebookPixel.init(this.props.theme.facebookPixelId || '515094402731005');
    }

    if (gtmId) {
      GoogleAnalytics.init(gtmId);
    }
  };

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.theme &&
      (!prevProps.theme ||
        this.props.theme.gtmId !== prevProps.theme.gtmId ||
        this.props.theme.facebookPixelId !== prevProps.theme.facebookPixelId)
    ) {
      this.init();
    }
  }

  static showBasket(basket) {
    GoogleAnalytics.showBasket(basket);
  }

  static selectPaymentPack(pp) {
    GoogleAnalytics.selectPaymentPack(pp);
  }

  static addPassToCart(pp, type) {
    GoogleAnalytics.addPassToCart(pp, type);
    FacebookPixel.addPassToCart(pp, type);
  }

  static addPackToCart(pc) {
    GoogleAnalytics.addPackToCart(pc);
    FacebookPixel.addPackToCart(pc);
  }

  static addPrivatePassToCart(pp) {
    GoogleAnalytics.addPrivatePassToCart(pp);
    FacebookPixel.addPrivatePassToCart(pp);
  }

  static addShopItemToCart(si) {
    GoogleAnalytics.addShopItemToCart(si);
    FacebookPixel.addShopItemToCart(si);
  }

  static onPaymentSuccess(basket) {
    GoogleAnalytics.onPaymentSuccess(basket);
    FacebookPixel.onPaymentSuccess(basket);
  }

  static signupShow() {
    GoogleAnalytics.signupShow();
  }

  static signinShow() {
    GoogleAnalytics.signinShow();
  }

  static signupSuccess(profile) {
    GoogleAnalytics.signupSuccess(profile);
    FacebookPixel.signupSuccess(profile);
  }

  static signinSuccess(profile) {
    GoogleAnalytics.signinSuccess(profile);
  }

  static calendarSessionShow(offer) {
    GoogleAnalytics.calendarSessionShow(offer);
  }

  static contractPaymentSuccess(contract) {
    GoogleAnalytics.contractPaymentSuccess(contract);
  }

  static contractShow(c) {
    GoogleAnalytics.contractShow(c);
  }

  static contractShowPayment(c) {
    GoogleAnalytics.contractShowPayment(c);
  }

  static workshopClick(offer) {
    GoogleAnalytics.workshopClick(offer);
  }

  render() {
    return null;
  }
}

const styles = () => ({
  img: {
    display: 'none',
  },
});

export default compose(withStyles(styles))(Analytics);
