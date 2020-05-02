const {
  BUYABLE_ITEM_PASS,
  BUYABLE_ITEM_SHOP_ITEM,
  BUYABLE_ITEM_FEE,
  BUYABLE_ITEM_PRIVATE_PASS,
} = require('@bsport/common/lib/master-data/buyable-items');

exports.default = {
  list: {
    isEmpty: 'No coupon registered yet',
    inactiveCoupons: 'Coupons disabled or expired',
    activeCoupons: 'Active coupons',
  },
  detail: {
    seeParameters: 'See parameters',
  },
  card: {
    first_buy: 'Use on first buy only',
    expiration: 'Expiry date',
    no_expiration: 'No expiry date',
    validity: 'Validity:',
    cumulable: 'Cumulable',
    no_cumulable: 'Not cumulable',
    uses: 'uses',
    member_uses: 'uses per member',
    member_use: 'use per member',
    limitation: 'Restricted to',
  },
  form: {
    selectorPlaceholder: {
      privatePass:
        'Select private lesson passes (valid on all passes if none selected)',
      paymentPack:
        'Select collective lesson passes (valid on all passes if none selected)',
      shopitem: 'Select shop items (valid on all items if none selected)',
    },
    section: {
      general: 'General',
      availability: 'Availability',
      usability: 'Usability',
      voucherConfig: 'Voucher',
      applies_to: 'Parameters',
      advanced: 'Advance',
    },
    name: {
      label: 'Name',
    },
    code: {
      label: 'Code',
      helperText: 'The code you will send to appropriate customers',
    },
    voucher_type: {
      percent: 'As a percentage',
      amount: 'As an amount',
    },
    percent_off: {
      label: 'Voucher percentage',
    },
    amount_off: {
      label: 'Voucher amount',
    },
    is_active: {
      label: 'Active',
      helperText: 'A non-active code is not usable by any customer',
    },
    with_expiration_date: {
      label: 'With expiration date',
    },
    expiration_date: {
      clear_date: 'No expiration',
      cancel: 'Cancel',
      label: 'Expiration date',
    },
    usage_per_member: {
      label: 'Usage limit per customer',
    },
    usage_total: {
      label: 'Total usage limit',
    },
    only_on_first_checkout: {
      label: 'First payment only',
    },
    combinable: {
      label: 'Usable with other codes',
    },
    minimum_amount: {
      label: 'Minimum basket payment',
    },
    applies_to: {
      choices: {
        [BUYABLE_ITEM_PASS]: 'Pass',
        [BUYABLE_ITEM_SHOP_ITEM]: 'Shop',
        [BUYABLE_ITEM_FEE]: 'Delivery fee',
        all: 'All basket',
        [null]: 'All basket',
        [BUYABLE_ITEM_PRIVATE_PASS]: 'Private lesson pass',
      },
    },
    actions: {
      cancel: 'Cancel',
      submit: 'Submit',
    },
  },
  noDiscount: 'No use of the coupon',
  createCoupon: 'Add a code',
  code: {
    addCoupon: {
      label: 'Coupon',
      placeholder: 'VOUCHER_CODE',
    },
  },
  message: {
    delete: {
      error: 'Impossible to delete this coupon',
      success: 'Coupon delete',
    },
    update: {
      error: 'Impossible to edit this coupon',
      success: 'Coupon updated successfully',
    },
    create: {
      error: 'Impossible to create this coupon',
      success: 'Coupon save successfully',
    },
    attachToBasket: {
      error: 'No compatible coupon found',
    },
  },
};
