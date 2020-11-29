import TagManager from 'react-gtm-module';

export default class GoogleAnalytics {
  static init(gtmId) {
    try {
      TagManager.initialize({
        gtmId,
      });
    } catch (err) {
      console.error(err);
    }
  }

  static showBasket(basket) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:basket:show',
        data: {
          totalPrice: basket.total_price,
          memberId: basket.member,
          basketId: basket.id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static selectPaymentPack(pp) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:pass:show',
        data: {
          id: pp.id,
          name: pp.name,
          price: pp.price,
          type: 'payment_pack',
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static addPassToCart(pp, type) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:basket:add-to-cart:pass',
        data: {
          id: pp.id,
          name: pp.name,
          price: pp.price,
          type,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static addPackToCart(pc) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:basket:add-to-cart:pack',
        data: {
          id: pc.id,
          name: pc.name,
          price: pc.price,
          type: 'payment_combo',
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static addPrivatePassToCart(pp) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:basket:add-to-cart:private-pass',
        data: {
          id: pp.id,
          name: pp.name,
          price: pp.price,
          type: 'private_pass',
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static addShopItemToCart(si) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:basket:add-to-cart:shop-item',
        data: {
          id: si.id,
          name: si.name,
          price: si.price,
          type: 'shop_item',
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static onPaymentSuccess(basket) {
    try {
      const data = {
        totalPrice: basket.total_price,
        memberId: basket.member,
        basketId: basket.id,
        checkout_items: basket.checkout_items.map((ci) => ({
          buyable_item_id: ci.buyable_item_id,
          buyable_item_identifier: ci.buyable_item_identifier,
          name: ci.name,
          quantity: ci.quantity,
          unit_price: ci.unit_price,
        })),
      };

      (window.dataLayer || []).push({
        event: 'bsport:basket:payment-success',
        data,
      });
    } catch (err) {
      console.error(err);
    }
  }

  static signupShow() {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:signup:show',
      });
    } catch (err) {
      console.error(err);
    }
  }

  static signinShow() {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:signin:show',
      });
    } catch (err) {
      console.error(err);
    }
  }

  static signupSuccess(profile) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:signup:success',
        data: {
          email: profile.email,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static signinSuccess(profile) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:signin:success',
        data: {
          email: profile.email,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static calendarSessionShow(offer) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:calendar:session-show',
        data: {
          name: offer.meta_activity.name,
          date: offer.date_start,
          coach: offer.coach_override
            ? offer.coach_override.name
            : offer.coach.name,
          establishment: offer.establishment_override
            ? offer.establishment_override.title
            : offer.establishment.name,
          activity: offer.meta_activity.id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static contractPaymentSuccess(contract) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:contract:payment-success',
        data: {
          id: contract.id,
          name: contract.name,
          price: contract.recurrent_price,
          flatFee: contract.flat_fee,
          autoRenewal: contract.auto_renewal,
          duration: contract.nb_interval,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static contractShow(c) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:contract:show',
        data: {
          name: c.name,
          id: c.id,
          price: c.recurrent_price,
          flatFee: c.flat_fee,
          autoRenewal: c.auto_renewal,
          duration: c.nb_interval,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static contractShowPayment(c) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:contract:show-payment',
        data: {
          name: c.name,
          id: c.id,
          price: c.recurrent_price,
          flatFee: c.flat_fee,
          autoRenewal: c.auto_renewal,
          duration: c.nb_interval,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }

  static workshopClick(offer) {
    try {
      (window.dataLayer || []).push({
        event: 'bsport:workshop-click',
        data: {
          name: offer.meta_activity.name,
          date: offer.date_start,
          coach: offer.coach_override
            ? offer.coach_override.name
            : offer.coach.name,
          establishment: offer.establishment_override
            ? offer.establishment_override.title
            : offer.establishment.name,
          activity: offer.meta_activity.id,
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
}
