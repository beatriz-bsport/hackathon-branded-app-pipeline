export default {
  list: {
    isEmpty: 'No coupon registered yet',
    inactiveCoupons: 'Coupons disabled or expired',
    activeCoupons: 'Active coupons',
  },
  detail: {
    seeParameters: 'See parameters',
  },
  form: {
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
        pass: 'Pass',
        shop: 'Shop',
        fee: 'Delivery fee',
        all: 'All basket',
      },
    },
    actions: {
      cancel: 'Cancel',
      submit: 'Submit',
    },
  },
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
