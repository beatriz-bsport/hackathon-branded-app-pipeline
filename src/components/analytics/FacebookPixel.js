/* global fbq */

export default class FacebookPixel {
  static init(pixelId) {
    if (!pixelId) {
      return;
    }
    /* eslint-disable */
    setTimeout(() => {
      window.fbq('init', pixelId);
			window.fbq('track', 'PageView');
    }, 500);
  }

  static addPassToCart(pp) {
    try {
      fbq('track', 'AddToCart', {
        content_name: pp.name,
        content_category: 'pass',
        content_id: pp.id,
        content_type: 'product',
        value: pp.price,
        currency: 'EUR',
      });
    } catch (e) {
      console.error(e);
    }
  }

  static addPackToCart(pc) {
    try {
      fbq('track', 'AddToCart', {
        content_name: pc.name,
        content_category: 'pack',
        content_id: pc.id,
        content_type: 'product',
        value: pc.price,
        currency: 'EUR',
      });
    } catch (e) {
      console.error(e);
    }
  }

  static addPrivatePassToCart(pp) {
    try {
      fbq('track', 'AddToCart', {
        content_name: pp.name,
        content_category: 'private-pass',
        content_id: pp.id,
        content_type: 'product',
        value: pp.price,
        currency: 'EUR',
      });
    } catch (e) {
      console.error(e);
    }
  }

  static addShopItemToCart(si) {
    try {
      fbq('track', 'AddToCart', {
        content_name: si.name,
        content_category: 'shop-item',
        content_id: si.id,
        content_type: 'product',
        value: si.price,
        currency: 'EUR',
      });
    } catch (e) {
      console.error(e);
    }
  }

  static contractPaymentSuccess(contract) {
    try {
      fbq('track', 'Purchase', {
        currency: 'EUR',
        value: contract.recurrent_price,
        content_category: 'subscription',
        content_name: contract.name,
        content_ids: [contract.id],
      });
    } catch (err) {
      console.error(err);
    }
  }

  static onPaymentSuccess(basket) {
    try {
      fbq('track', 'Purchase', {
        currency: 'EUR',
        value: basket.total_price,
        content_category: 'basket',
      });
    } catch (e) {
      console.error(e);
    }
  }

  static signupSuccess() {
    try {
      fbq('track', 'CompleteRegistration');
    } catch (e) {
      console.error(e);
    }
  }
}
