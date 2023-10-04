const {
  COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS,
  UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT,
  UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT,
  COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS,
  COUPON_UNIQUE_CODE_NOT_AVAILABLE,
  UNIQUE_CODE_LOCKED,
} = require('../../libs/coupon/errors.ts');

const getTranslations = async () => {
  const BUYABLE_ITEM = await import(
    '@bsport/common/lib/master-data/buyable-items.js'
  );

  const {
    BUYABLE_ITEM_PASS,
    BUYABLE_ITEM_SHOP_ITEM,
    BUYABLE_ITEM_FEE,
    BUYABLE_ITEM_PRIVATE_PASS,
    BUYABLE_ITEM_COMBO_ITEM,
  } = BUYABLE_ITEM;

  const {
    COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE,
    COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE,
    COUPON_SUBSCRIPTION_MODE_ALL_INVOICES,
    COUPON_SUBSCRIPTION_MODE_NONE,
  } = await import(
    '@bsport/common/lib/master-data/coupon-subscription-mode.js'
  );

  const { CouponKind } = await import(
    '@bsport/common/lib/master-data/coupon.js'
  );

  return {
    list: {
      isEmpty: 'There are no promotions to display.',
      inactiveCoupons: 'Inactive or expired promotions',
      activeCoupons: 'Active promotions',
    },
    detail: { seeParameters: 'Edit', seeVouchers: 'See the vouchers' },
    card: {
      first_buy: 'Can only be used for the first purchase',
      expiration: 'Expiration date',
      no_expiration: 'No expiration date',
      validity: 'Validity:',
      cumulable: 'Cumulative',
      no_cumulable: 'Not cumulative',
      uses: 'Uses',
      member_uses: 'uses per member.',
      member_use: 'use per member.',
      limitation: 'Limited to',
      blacklist_tags:
        '[Blacklist] Not available for members with specific tag(s):',
      whitelist_tags:
        '[Whitelist} Only available to members with specific tag(s):',
      allowedFor: 'Allowed for',
      unallowedFor: 'Not allowed for',
    },
    form: {
      selectorPlaceholder: {
        privatePass:
          'Select appointment passes (will apply to all appointment passes if none has been selected)',
        paymentPack:
          'Select passes (will apply to all passes if none has been selected)',
        shopitem:
          'Select webshop products (will apply to all webshop products if none has been selected)',
        paymentCombo:
          'Select packs (valid on all products if none is selected)',
      },
      section: {
        general: 'General',
        availability: 'Availability',
        usability: 'Usability',
        voucherConfig: 'Discount',
        applies_to: 'Settings',
        advanced: 'Advanced',
        subscription: 'Subscriptions',
        blacklist_tags: 'Not allowed',
        whitelist_tags: 'Allowed',
        tags: 'Tags',
        tagInfo:
          'Use tags to make the promo code usable only by a selected group of members on the marketplace, widget and app. You can select tags to make the promo code usable only by members with one of the chosen tags. Or you can select tags to make the promo code unusable only by members with one of the selected tags. ',
      },
      name: { label: 'Name' },
      code: {
        label: 'Code',
        helperText:
          'Your members will need to use this exact promotional code.',
        helperTextFranchise:
          'Your members will need to use this exact promotional code. Please revise if any of the studios have already applied this promotion.',
      },
      voucher_type: { percent: 'Percentage', amount: 'Amount' },
      percent_off: { label: 'Percentage' },
      amount_off: { label: 'Amount' },
      is_active: {
        label: 'Active',
        helperText: "Members can't use inactive codes.",
      },
      with_expiration_date: { label: 'Add expiration date' },
      expiration_date: {
        clear_date: "Doesn't expire",
        cancel: 'Cancel',
        label: 'Expiration date',
      },
      usage_per_member: { label: 'Limit the uses per member' },
      usage_total: { label: 'Total number of members that can use the code' },
      only_on_first_checkout: {
        label: 'This promotional code can only be used for the 1st purchase',
      },
      combinable: {
        label: 'Can be used in combination with other promotional codes',
      },
      minimum_amount: { label: 'Minimum value of customer basket' },
      applies_to: {
        choices: {
          all: 'Ensemble du panier',
          [BUYABLE_ITEM_PASS]: 'Passes',
          [BUYABLE_ITEM_SHOP_ITEM]: 'Webshop',
          [BUYABLE_ITEM_FEE]: 'Delivery fee',
          [BUYABLE_ITEM_PRIVATE_PASS]: 'Appointment passes',
          [BUYABLE_ITEM_COMBO_ITEM]: 'Packs',
          [null]: 'Applies to the entire basket',
        },
        choicesFranchise: {
          [BUYABLE_ITEM_PASS]: 'Shared passes',
          [BUYABLE_ITEM_PRIVATE_PASS]: 'Shared appointment passes',
        },
      },
      actions: { cancel: 'Cancel', submit: 'Apply' },
      subscription_mode: {
        [COUPON_SUBSCRIPTION_MODE_NONE]: 'Not applicable',
        [COUPON_SUBSCRIPTION_MODE_RECURRENT_PRICE]: 'Apply to all billings',
        [COUPON_SUBSCRIPTION_MODE_FIRST_INVOICE]:
          'Only apply to the first billing',
        [COUPON_SUBSCRIPTION_MODE_ALL_INVOICES]:
          'Apply to all billings before the automatic renewal',
      },
      tag: {
        select: {
          error: "The same Sub Tags can't be present in both lists",
          empty_tag_list: 'No Sub Tag has been selected',
          tag: 'Select a Main Tag',
          tag_group: 'Select a Main Tag',
        },
        tag: 'Sub Tag',
        tag_group: 'Master Tag',
      },
      title: '[Form] Promotion',
      alert:
        "A discount code can be used by a member to reduce the price of a basket. In this form, you can fully customize how the code is applied. You choose the code yourself and it's up to you to decide how to share it with your members.",
    },
    noDiscount: "This promotional code hasn't been used yet.",
    createCoupon: 'Add a promotion',
    code: {
      addCoupon: {
        [COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS]:
          'This code can only be applied to one item.',
        [UNIQUE_CODE_LOCKED]:
          'This unique code is already linked to an open basket',
        apply: 'Apply',
        label: 'Promo code',
        placeholder: 'PROMOTIONAL CODE',
        cancel: 'Cancel',
        submit: 'Apply',
        not_found: 'This promo code is not valid.',
        not_applicable: 'This promo code is not applicable.',
      },
    },
    modal: {
      delete: {
        actions: { submit: 'Delete', cancel: 'Cancel' },
        content:
          'Are you sure you want to delete this promotion? You will lose access to its usage history. This action cannot be reverted.',
        title: 'Delete',
      },
    },
    search: 'Search a promotion',
    reverted: 'Invoice cancelled',
    couponTemplate: {
      formDisclaimer:
        'The availability for all studios will be reset if you change the products on which this promotion will be applicable to.',
      warningDialog: {
        content2:
          'This will reinitialise the list of studios in which this promotion will be shared.',
        content1:
          "Please revise the modifications that you're about to process for this shared promotion on the selected passes and appointment passes.",
        content3:
          'Please select in which studio(s) this promotion will be shared.',
        title: 'Confirm edits',
      },
      notEditable:
        "The promotion is shared through the Master Account. Certain settings have been predefined by said Master Account and can't be modified.",
      isEmptyExplain: 'There are no promotions to display.',
      actions: { create: 'Add a promotion' },
    },
    couponTemplateInstance: {
      create: {
        title: 'Availability',
        explain2:
          'Members may use this promotion at any of the compatible studios.',
        explain1:
          'The following studios will automatically offer this promotion for the selected product(s).',
      },
      companyEmpty: 'There are no studios offering this promotion to display.',
      delete: {
        explain2: 'It can be readded later if necessary.',
        explain1:
          'Are you sure that you want to edit the availability for this promotion ({{name}})?',
        title: 'Stop sharing',
      },
    },
    uniqueCodeCoupon: {
      form: {
        alertInfo:
          "Vouchers are unique codes that offer a 100% discount on a specific product for the member. These codes are not generated by the platform itself, but must be uploaded here as a CSV file. This feature is particularly useful if you've partnered with an external entity like Groupon to run a promotional campaign. In this case, Groupon (or a similar entity) generates and sells the vouchers on behalf of your studio.",
        alertWarning: 'Does not apply to subscriptions',
        couponCostForCompany: {
          label: 'Price incl. VAT',
          helperText:
            'The revenue you receive from the campaign partner for each voucher sold. They will be used to calculate the marginal value for teacher remuneration as well as for reports. For any calculation not taking marginal value into account, reports will ignore this given price and treat this promotion as a 100% discount.',
        },
        usage_per_member: {
          label: 'Limit the number of vouchers a member can purchase',
          helperText: 'Maximum limit',
        },
        only_on_first_checkout: {
          label: 'Can only be used for the first purchase',
        },
        fileUploader: {
          title: 'Upload unique vouchers',
          label: 'Drag and drop or click to select file',
          sizeLimitHelper: 'CSV file (1MB maximum)',
          helperText:
            'Please upload a CSV file with all voucher codes in the first column, one code per line, without header.',
        },
        errors: {
          [COUPON_CODES_CONFLICTING_WITH_OTHER_COUPONS]:
            'You cannot provide a code that has already been used in another coupon.',
          [UNIQUE_CODES_CANNOT_BE_APPENDED_BECAUSE_CONFLICT]:
            'Some of the unique codes cannot be added as they have already been registered.',
          [UNIQUE_CODES_CANNOT_BE_REPLACED_BECAUSE_CONFLICT]:
            'Some unique codes are already registered in another coupon.',
          [COUPON_UNIQUE_CODE_CANNOT_BE_APPLIED_SEVERAL_ITEMS]:
            'This code can only be applied to one item.',
          [COUPON_UNIQUE_CODE_NOT_AVAILABLE]:
            'This code has already been used or is currently attached to a basket.',
          [UNIQUE_CODE_LOCKED]:
            'This unique code is already linked to an open basket',
          required: 'This field is mandatory',
          positiveNumber: 'Value must be greater than 0',
          expirationDate: {
            dateBeforeNow:
              'The expiration date can not be earlier than the current date.',
            format: 'Error while formatting the date',
          },
          fileUploader: {
            fileTooLargeError:
              'The file is too large. Please do not exceed 1 MB.',
            incorrectDataError: 'The file does not contain the correct data.',
            notCsvFileError: 'The file type does not correspond to a CSV file.',
          },
          only_on_objects:
            'You must choose an object on which to apply the reduction',
          applies_to:
            'The item on which the discount is to be applied must be a pass, an appointment pass, a pack or a webshop item',
          update_mode:
            'If you wish to modify the codes registered for this promotion, you can add the codes to the existing ones, or replace the existing codes',
          codes: {
            updateMode:
              'You must choose between adding the codes to the existing ones or replacing them',
            emptyArray: 'You must add at least one code',
          },
        },
        update: {
          alertInfo:
            'There is {{count}} code registered for this promotion, you can upload new codes.',
          alertInfo_plural:
            'There are {{count}} codes registered for this promotion, you can upload new codes.',
          append: 'Add to existing codes',
          replace: 'Replace existing codes',
          popover:
            'Unused codes will be deleted, but used codes will be retained.',
        },
        selectorPlaceholder: {
          privatePass: 'Select an appointment pass',
          paymentPack: 'Select a pass',
          shopItem: 'Select a webshop item',
          paymentCombo: 'Select a pack',
        },
      },
      voucherCodesDialog: {
        header: { codes: 'Codes', status: 'Status' },
        selector: {
          allStatus: 'All status',
          redeemed: 'Marked as used',
          pending: 'Awaiting external approval',
          notUsed: 'Not used',
        },
        checkBoxes: { selectAll: 'Select all', unselectAll: 'Unselect all' },
        searchBar: { placeHolder: 'Search for a code' },
        noResult: 'No results',
        close: 'Close',
        markAsRedeemed: 'Mark as used',
        markAsRedeemed_plural: 'Mark as used',
        export: 'Export',
      },
    },
    couponFilter: {
      allType: 'All types of promotion',
      title: 'Promotion type',
    },
    fabLabels: { discountCode: 'Discount code', voucherCodes: 'Vouchers' },
    couponType: {
      [CouponKind.COUPON_VIA_CODE]: 'Discount code',
      [CouponKind.COUPON_VIA_UNIQUE_CODE_PER_USAGE]: 'Single-use voucher',
    },
  };
};

exports.default = getTranslations();
