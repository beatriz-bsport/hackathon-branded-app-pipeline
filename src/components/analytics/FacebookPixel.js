/* global fbq */

export default class FacebookPixel {
  static methods = [];

  // specs includes name of the variable and its description as a translation
  // example: [['name', fb.func.name'], ['price', 'fb.func.price']]
  static addMethod(name, key, func, specs) {
    this.methods.push({
      name,
      translation_key: key,
      method: func,
      specs,
    });
  }

  static applyMethod(name, method_res) {
    try {
      fbq('track', name, method_res);
    } catch (e) {
      console.error(e);
    }
  }

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
}

FacebookPixel.addMethod('addPackToCart', 'AddToCart', (pc) => ({
  content_name: pc.name,
  content_category: 'pack',
  content_id: pc.id,
  content_type: 'product',
  value: pc.price,
  currency: 'EUR',
}), [['content_name', 'fbp.addPack.content_name'],
  ['content_category', 'fbp.addPack.content_category'],
  ['content_id', 'fbp.addPack.content_id'],
  ['content_type', 'fbp.addPack.content_type'],
  ['value', 'fbp.addPack.value'],
  ['currency', 'fbp.currency']]);

FacebookPixel.addMethod('addPassToCart', 'AddToCart', (pp) => ({
  content_name: pp.name,
  content_category: 'pass',
  content_id: pp.id,
  content_type: 'product',
  value: pp.price,
  currency: 'EUR',
}), [['content_name', 'fbp.addPass.content_name'],
  ['content_category', 'fbp.addPass.content_category'],
  ['content_id', 'fbp.addPass.content_id'],
  ['content_type', 'fbp.addPass.content_type'],
  ['value', 'fbp.addPass.value'],
  ['currency', 'fbp.currency']]);

FacebookPixel.addMethod('addPrivatePassToCart', 'AddToCart', (pp) => ({
  content_name: pp.name,
  content_category: 'private-pass',
  content_id: pp.id,
  content_type: 'product',
  value: pp.price,
  currency: 'EUR',
}), [['content_name', 'fbp.addPrivatePass.content_name'],
  ['content_category', 'fbp.addPrivatePass.content_category'],
  ['content_id', 'fbp.addPrivatePass.content_id'],
  ['content_type', 'fbp.addPrivatePass.content_type'],
  ['value', 'fbp.addPrivatePass.value'],
  ['currency', 'fbp.currency']])

FacebookPixel.addMethod('addShopItemToCart', 'AddToCart', (si) => ({
  content_name: si.name,
  content_category: 'shop-item',
  content_id: si.id,
  content_type: 'product',
  value: si.price,
  currency: 'EUR',
}), [['content_name', 'fbp.addShopItem.content_name'],
  ['content_category', 'fbp.addShopItem.content_category'],
  ['content_id', 'fbp.addShopItem.content_id'],
  ['content_type', 'fbp.addShopItem.content_type'],
  ['value', 'fbp.addShopItem.value'],
  ['currency', 'fbp.currency']])

FacebookPixel.addMethod('contractPaymentSuccess', 'Purchase', (contract) => ({
  currency: 'EUR',
  value: contract.recurrent_price,
  content_category: 'subscription',
  content_name: contract.name,
  content_ids: [contract.id],
}), [['currency', 'fbp.currency'],
  ['value', 'fbp.contractPaymentSuccess.value'],
  ['content_category', 'fbp.contractPaymentSuccess.content_category'],
  ['content_name', 'fbp.contractPaymentSuccess.content_name'],
  ['content_ids', 'fbp.contractPaymentSuccess.content_ids']])

FacebookPixel.addMethod('paymentSuccess', 'Purchase', (basket) => ({
  currency: 'EUR',
  value: basket.total_price,
  content_category: 'basket',
}),[['currency', 'fbp.currency'],
  ['value', 'fbp.paymentSuccess.value'],
  ['content_category', 'fbp.paymentSuccess.content_category']])

FacebookPixel.addMethod('signupSuccess', 'CompleteRegistration', () => {}, [])