// @flow

import React from 'react';
import { compose } from 'recompose';
import * as Sentry from '@sentry/react';

import withStyles from '@material-ui/core/styles/withStyles';
import GoogleAnalytics from './GoogleAnalytics';
import FacebookPixel from './FacebookPixel';
import { analytics } from './Analytics';
import { CompanyTheme } from '../../libs/theme/types';

type Props = {
  theme?: CompanyTheme | null;
  isInternal?: boolean;
};

class Analytics extends React.Component<Props> {
  init = () => {
    if (global.isLoadedAnalytics) return;
    if (!this.props.theme && !this.props.isInternal) return;

    let { gtmId, facebookPixelId } = this.props.theme || {};

    if (this.props.isInternal) {
      gtmId = 'GTM-W4G3NQ6';
      facebookPixelId = '515094402731005';
    }

    if (facebookPixelId) {
      FacebookPixel.init(facebookPixelId);
    }

    if (gtmId) {
      GoogleAnalytics.init(gtmId);
    }
    window.isLoadedAnalytics = true;
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
      try {
        this.init();
      } catch (err) {
        Sentry.captureException(err);
      }
    }
  }

  static applyMethod(name, ...args) {
    try {
      analytics.forEach((analytic) => {
        const specific_method = analytic.methods.find((el) => el.name === name);
        if (specific_method)
          analytic.apply(name, specific_method.method(...args));
      });
    } catch (err) {
      console.error(err);
      Sentry.captureException(err);
    }
  }

  static showBasket(basket) {
    this.applyMethod('showBasket', basket);
  }

  static selectPaymentPack(pp) {
    this.applyMethod('showPass', pp);
  }

  static addPassToCart(pp, type) {
    this.applyMethod('addPassToCart', pp, type);
  }

  static addPackToCart(pc) {
    this.applyMethod('addPackToCart', pc);
  }

  static addPrivatePassToCart(pp) {
    this.applyMethod('addPrivatePassToCart', pp);
  }

  static addShopItemToCart(si) {
    this.applyMethod('addShopItemToCart', si);
  }

  static onPaymentSuccess(basket) {
    this.applyMethod('paymentSuccess', basket);
  }

  static signupShow() {
    this.applyMethod('signupShow');
  }

  static signinShow() {
    this.applyMethod('signinShow');
  }

  static signupSuccess(profile) {
    this.applyMethod('signupSuccess', profile);
  }

  static signinSuccess(profile) {
    this.applyMethod('signinSuccess', profile);
  }

  static calendarSessionShow(offer) {
    this.applyMethod('sessionShow', offer);
  }

  static contractPaymentSuccess(contract) {
    this.applyMethod('contractPaymentSuccess', contract);
  }

  static contractShow(c) {
    this.applyMethod('contractShow', c);
  }

  static contractShowPayment(c) {
    this.applyMethod('contractPaymentShow', c);
  }

  static workshopClick(offer) {
    this.applyMethod('workshopClick', offer);
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
