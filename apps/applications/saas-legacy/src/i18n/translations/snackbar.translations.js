const {
  CANNOT_REDEEM_CODE_BECAUSE_NOT_USED,
} = require('../../libs/coupon/errors.ts');

const {
  TAG_NAME_ALREADY_USED,
  TAG_GROUP_NAME_ALREADY_USED,
} = require('../../libs/tag/errors.constants.ts');

const {
  EXCEPTION_STAFF_ROLE_CANNOT_BE_DELETED,
} = require('../../libs/role/errors.constants.ts');

const {
  INVOICE_EXPORT_INCOMPLETE_USER_ADDRESS,
  MISSING_USER_OFFICIAL_DOCUMENT_ID,
  NO_INVOICE_EXPORTER,
  INVOICE_EXPORT_SCHEMA_COMPLIANCE,
  INVOICE_EXPORT_EMPTY_ZIP,
} = require('../../libs/invoice/errors.ts');

const getTranslations = async () => {
  const {
    OFFER_WAITING_LIST_STATUS_FULL,
    OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED,
    OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON,
    OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE,
    OFFER_BOOKABLE_STATUS_FULL,
    OFFER_BOOKABLE_STATUS_LOCKED,
    OFFER_BOOKABLE_STATUS_ALREADY_BOOKED,
    OFFER_BOOKABLE_STATUS_TOO_MANY_MALE,
    OFFER_BOOKABLE_STATUS_TOO_MANY_FEMALE,
    OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE,
    SPOT_NOT_AVAILABLE,
    PAYMENT_COMBO_CANT_BE_BOUGHT_HAS_REACHED_MAX_PURCHASE,
    PAYMENT_COMBO_CANT_BE_BOUGHT_NEW_ONLY_ONLY,
    PAYMENT_COMBO_CANT_BE_BOUGHT_DATE_EXPIRED,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_DATE_EXPIRED,
    PRIVATE_PASS_CAN_NOT_BE_BOUGHT_DATE_EXPIRED,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_NEW_MEMBER_ONLY,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_MAX_PURCHASE_REACHED,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_MANAGER_ONLY,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_DISABLED,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_VALIDITY_DATERANGE,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_INCOMPATIBLE_WITH_OFFER,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ACTIVITY_INCOMPATIBLE,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_SCT_INCOMPATIBLE,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ESTABLISHMENT_INCOMPATIBLE,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_VOD_ONLY,
    PAYMENT_PACK_CAN_NOT_BE_BOUGHT_BAD_COMPANY,
    CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_DAY,
    CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_WEEK,
    CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_MONTH,
    CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_YEAR,
    PRIVATE_SLOT_ALREADY_BOOKED,
    GIFTCARD_CAN_NOT_BE_BOUGHT_DISABLED,
    GIFTCARD_CAN_NOT_BE_BOUGHT_MANAGER_ONLY,
    SHOP_ITEM_CAN_NOT_BE_BOUGHT_NOT_ENOUGH_STOCK,
  } = await import(
    '@bsport/common/lib/master-data/error-codes/buyable-item-can-not-be-bought.js'
  );

  const {
    LOCK_ACQUISITION_FAILURE_GENERIC,
    LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING,
    BASKET_LOCK_ACQUISITION_FAILURE,
    BASKET_PROCESSING_PAYMENT_EXCEPTION,
  } = await import('@bsport/common/lib/master-data/error-codes/lock.js');

  const {
    PAYMENT_METHOD_NOT_DETACHABLE_PAYMENT_GROUP_ERROR_CODE,
    PAYMENT_METHOD_NOT_DETACHABLE_ERROR_CODE,
    PAYMENT_METHOD_NOT_DETACHABLE_PLANNED_PAYMENT_EVENT_ERROR_CODE,
    PAYMENT_METHOD_NOT_DETACHABLE_BILLING_PLAN_ERROR_CODE,
    PAYMENT_METHOD_NOT_DETACHABLE_FUTURE_PAYMENT_ERROR_CODE,
  } = await import(
    '@bsport/common/lib/master-data/error-codes/payment-method.js'
  );

  const {
    ERROR_CUSTOM_FORM_ANSWER_IS_MANDATORY,
    ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_EMAIL_ALREADY_EXISTS,
    ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_GENDER_IS_INVALID,
    ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_PHONE_NUMBER_IS_INVALID,
  } = await import('@bsport/common/lib/master-data/error-codes/custom-form.js');

  const {
    PENDING_PAYMENT_INTENT_OF_PAYMENT_GROUP_BLOCKS_OTHER_PAYMENT_GROUP_CREATION,
  } = await import('@bsport/common/lib/master-data/payment-group.js');

  const { BOOKKEEPING_ACCOUNT_NAME_ALREADY_USED_ERROR_CODE } = await import(
    '@bsport/common/lib/master-data/error-codes/bookkeeping_account.js'
  );

  const {
    INVOICE_PAYMENT_BY_GIFTCARD_ERROR,
    GIFTCARD_ACTIVATION_CODE_ERROR_CODE,
    GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_DISABLED,
    GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_ALREADY_ACTIVATED,
    GIFTCARD_ACTIVATION_FAIL_WHEN_MISSING_RECIPIENT_MEMBER,
  } = await import('@bsport/common/lib/master-data/error-codes/giftcard.js');
  const {
    EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN,
    EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_LIMIT_FOR_SMARTLIST_REACHED,
    EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_EMAIL_WITH_NO_TITLE,
    EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_EMAIL_WITH_NO_BODY,
    EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_SMS_WITH_NO_BODY,
    EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_PUSH_NOTIFICATION_WITH_NO_TITLE,
    EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_PUSH_NOTIFICATION_WITH_NO_BODY,
  } = await import('@bsport/common/lib/master-data/smart-list.js');

  const {
    BILLING_PLAN_EXCEPTION_BLOCKING_SWITCHING_CONTENT_WITH_TEMPLATE_INSTANCE,
  } = await import(
    '@bsport/common/lib/master-data/error-codes/subscription.js'
  );

  const {
    CANNOT_REQUEST_REPLACEMENT_OFFER_NOT_AVAILABLE,
    CANNOT_REQUEST_REPLACEMENT_ALREADY_REQUESTED,
    CANNOT_REQUEST_REPLACEMENT_COACH_OVERRIDE,
    REPLACEMENT_REQUEST_COACH_HAS_REACHED_MAX_NB_LATE_REQUEST,
    REPLACEMENT_REQUEST_CANNOT_POSTPONE_CLOSING_DATE_AFTER_OFFER_DATE_START,
    REPLACEMENT_REQUEST_CANNOT_BE_REFUSED_IF_TEACHER_ALREADY_FOUND,
    REPLACEMENT_REQUEST_CANNOT_BE_CANCELLED_IF_TEACHER_ALREADY_FOUND,
    REPLACEMENT_REQUEST_CANNOT_ATTRIBUTE_TEACHER_IF_TEACHER_ALREADY_FOUND,
    REPLACEMENT_REQUEST_CANNOT_ATTRIBUTE_TEACHER_IF_ANSWERED_NO,
    REPLACEMENT_REQUEST_CANNOT_BE_CANCELLED_IF_MANAGER_REFUSED,
    REPLACEMENT_REQUEST_COACH_ANSWER_CANT_BE_CREATED_IF_REQUEST_IS_CLOSED,
    REPLACEMENT_REQUEST_COACH_ANSWER_COACH_CANT_ANSWER_ON_HIS_OWN_REPLACEMENT_REQUEST,
    REPLACEMENT_REQUEST_DATES_EXCEPTION,
    REPLACEMENT_REQUEST_LIMITATION_EXCEPTION,
    REPLACEMENT_REQUEST_CANNOT_HAVE_ESTABLISHMENTS_AND_LOCATIONS_SET_AT_THE_SAME_TIME,
  } = await import('@bsport/common/lib/master-data/error-codes/replacement.js');

  const {
    INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE,
    INVOICE_NO_REFUND_ON_TYPE_EMPTY_CONTAINER,
    CANNOT_REFUND_INVOICE_EXCEPTION_ERROR_CODE,
    PAYPAL_REFUND_INSUFFICIENT_FUNDS,
    PAYMENT_GROUP_LOCK_ACQUISITION_ERROR,
    PAYMENT_DISABLED,
    PENDING_PAYMENT_ATTEMPT_OF_PAYMENT_GROUP_BLOCKS_OTHER_PAYMENT_GROUP_CREATION,
    PAYMENT_GROUP_PRICE_INCONSISTENCY,
    PAYMENT_ATTEMPT_EXECUTION_FAILED,
    PAYMENT_GROUP_UNPROCESSABLE_EXCEPTION,
    PAYPAL_PAYER_ACCOUNT_ISSUE,
    PAYPAL_PAYER_CARD_EXPIRED,
    PAYPAL_REDIRECT_PAYER_FOR_ALTERNATE_FUNDING,
    PAYPAL_EXCEPTION,
    PAYPAL_API_EXCEPTION,
    PAYPAL_ACCOUNT_ALREADY_LINKED_TO_OTHER_COMPANY,
  } = await import('@bsport/common/lib/master-data/error-codes/payment.js');
  const {
    COACH_EDIT_EMAIL_ADDRESS_IS_STAFF_USER,
    COACH_EMAIL_ADDRESS_EXISTS,
    COACH_CREATE_EMAIL_ADDRESS_IS_FRANCHISOR_USER,
  } = await import(
    '@bsport/common/lib/master-data/error-codes/associated-coach.js'
  );

  const {
    DST_CONSUMER_PAYMENT_PACK_CANNOT_BE_SHARED_AGAIN,
    DST_PRIVATE_CONSUMER_PASS_CANNOT_BE_SHARED_AGAIN,
  } = await import('@bsport/common/lib/master-data/error-codes/shared-pass.js');

  const {
    OFFER_WAITING_LIST_NO_USABLE_CONSUMER_PAYMENT_PACK,
    OFFER_WAITING_LIST_CAN_NOT_BOOK_TOO_MANY_FUTURE,
  } = await import(
    '@bsport/common/lib/master-data/error-codes/waitinglist-can-not-be-joined.js'
  );

  const {
    CUSTOM_INSTALMENT_FIRST_INSTALMENT_AMOUNT_ERROR,
    CUSTOM_INSTALMENT_FIRST_INSTALMENT_PERCENT_ERROR,
    INSTALMENT_PARTIAL_PAYMENT_REQUIRES_ONLY_ONE_BILLING_ERROR,
    INSTALMENT_CUSTOM_FIRST_INSTALMENT_REQUIRES_AT_LEAST_TWO_BILLINGS_ERROR,
  } = await import(
    '@bsport/common/lib/master-data/error-codes/instalment-payment.js'
  );

  const {
    SPIVI_UPSELL_NOT_ACTIVATED_EXCEPTION,
    NO_ROOM_PLAN_SELECTED_EXCEPTION,
    NO_SPIVI_BOX_ID_FOR_ROOM_PLAN_EXCEPTION,
    SPIVI_EVENT_DURATION_EXCEPTION,
    SPIVI_DOUBLE_BOOKING_ACTIVATION_EXCEPTION,
  } = await import('@bsport/common/lib/master-data/error-codes/spivi.js');

  const { BASKET_CANNOT_REMOVE_ITEM_BECAUSE_OF_PAYMENT_GROUP_STATUS } =
    await import('@bsport/common/lib/master-data/error-codes/basket.js');

  const {
    CANNOT_ADD_VARIANT_WHILE_SHOP_ITEM_IS_USED_IN_PAYMENT_COMBO,
    BASE_OR_VARIANT_SHOP_ITEMS_ARE_NOT_ALLOWED_IN_PAYMENT_COMBO,
  } = await import('@bsport/common/lib/master-data/error-codes/shop.js');

  const COMMUNICATION_SCHEDULED_ALREADY_SENT = 133001;

  return {
    bookkeeping_account: {
      errors: {
        [BOOKKEEPING_ACCOUNT_NAME_ALREADY_USED_ERROR_CODE]:
          'An account with this name already exists.',
      },
      create: {
        error: 'An error occured while creating the account.',
        success: 'The account has been successfully created.',
      },
      update: {
        error: 'An error occured while updating the account.',
        success: 'The changes have been successfully saved.',
      },
      delete: {
        error: 'An error occured while deleting the account.',
        success: 'The account has been successfully deleted.',
      },
    },
    communication: {
      error: 'Error while sending email',
      success: 'Mail being sent',
    },
    order: { success: 'Your payment has been successfully registered' },
    booking: {
      register: { success: 'Booking saved' },
      delete: {
        error: "Sessions that have already started can't be cancelled.",
      },
    },
    login: { passwordChangedSuccess: 'Password successfully modified!' },
    webhook: {
      testError: 'You must verify the URL',
      testSuccess: 'Correct URL',
      error: 'Impossible to subscribe the webhook',
      success: 'Webhook subscribed',
    },
    subscription: {
      register: {
        success: 'Subscription registered successfully',
        error: 'Impossible to register the subscription',
      },
      youSubscribed: {
        success: 'You have successfully subscribed',
        error: 'Error while subscribing',
      },
      updatePrice: {
        error: 'Impossible to update this amount',
        success: 'Amount updated',
      },
      freeze: {
        error: 'Impossible to pause this subscription',
        success: 'Subscription freezed',
        locked: 'Impossible to pause for now, is a payment processing ?',
        deleteSuccess: 'The pause has been removed',
        deleteFail:
          'It is not possible to delete a pause that has already started.',
      },
      switchPack: {
        error: "Can't change the pass",
        success: 'Pass has been updated',
      },
      switchPaymentMethod: {
        error: 'Impossible to change payment method',
        success: 'Payment method updated',
      },
      stop: {
        error: 'Impossible to stop for now',
        warning: 'Impossible to stop for now, is a payment processing ?',
        success: 'Subscription cancelled',
      },
      contract: {
        restore: {
          success: 'This subscription has been restored successfully',
          error: 'Error while restoring subscription',
        },
      },
      billNow: {
        errors: {
          [PENDING_PAYMENT_INTENT_OF_PAYMENT_GROUP_BLOCKS_OTHER_PAYMENT_GROUP_CREATION]:
            'Your payment is in process of validation. Return later to register a new payment.',
        },
      },
      switchPaymentCombo: {
        error: 'Unable to modify the pack',
        success: 'Pack has been modified',
      },
      switchPrivatePass: {
        error: 'Unable to modify the appointment pass',
        success: 'Appointment pass has been modified',
      },
      switchItemsErrors: {
        paymentCombo: {
          [BILLING_PLAN_EXCEPTION_BLOCKING_SWITCHING_CONTENT_WITH_TEMPLATE_INSTANCE]:
            'Impossible: Changing the shared pack between franchisees is not allowed',
        },
        privatePass: {
          [BILLING_PLAN_EXCEPTION_BLOCKING_SWITCHING_CONTENT_WITH_TEMPLATE_INSTANCE]:
            'Impossible: Changing the shared appointment pass between franchisees is not allowed',
        },
        paymentPack: {
          [BILLING_PLAN_EXCEPTION_BLOCKING_SWITCHING_CONTENT_WITH_TEMPLATE_INSTANCE]:
            'Impossible: Changing a shared pass between franchisees is not allowed',
        },
      },
      contractTemplate: {
        deleteSuccess: 'Subscription successfully archived',
        deleteError: 'Failed to archive subscription',
        restoreSuccess: 'Subscription successfully restored',
        restoreError: 'Failed to restore subscription',
        editSuccess: 'Subscription successfully saved',
        editError: 'Failed to save subscription',
        createSuccess: 'Subscription successfully created',
        createError: 'Failed to create subscription',
      },
    },
    smartlist: {
      delete: {
        error: 'Unable to delete smartlist',
        success: 'Smartlist deleted',
      },
      update: {
        error: 'Unable to save smartlist',
        success: 'Smartlist successfully updated',
      },
      create: {
        error: 'Unable to save smartlist',
        success: 'Smartlist successfully created',
      },
      duplicate: {
        error: 'Unable to duplicate smarlist',
        success: 'Smartlist duplicated',
      },
      tag_rules: {
        limit_reached:
          "Error: it's not possible to create more than 10 rules. ",
        error: 'Unable to apply this rule',
        success: 'The automatic rule has been launched',
      },
    },
    shop: {
      item: {
        delete: { error: 'Error while deleting', success: 'Item deleted' },
        createOrUpdate: { error: 'Error while saving', success: 'Saved' },
        updateProvisions: {
          error: 'Error while saving provision',
          success: 'Provision updated',
        },
        duplicate: {
          error: 'It is impossible to duplicate the product',
          success: 'Product succesfully duplicated',
        },
        notFound: 'This product has not been found. It may have been archived.',
      },
      subShop: {
        delete: {
          error: 'Impossible to delete the category',
          success: 'Category deleted',
        },
        createOrUpdate: {
          error: 'Impossible to save the category',
          success: 'Category successfully saved',
        },
      },
      supplier: {
        create: {
          error: 'Error creating supplier',
          success: 'Supplier created successfully',
        },
        update: {
          error: 'Error updating supplier',
          success: 'Supplier updated successfully',
        },
        delete: {
          error: 'Error deleting supplier',
          success: 'Supplier deleted successfully',
        },
      },
      variant: {
        error: {
          [CANNOT_ADD_VARIANT_WHILE_SHOP_ITEM_IS_USED_IN_PAYMENT_COMBO]:
            'Cannot create variant(s) on a product used in a pack',
          [BASE_OR_VARIANT_SHOP_ITEMS_ARE_NOT_ALLOWED_IN_PAYMENT_COMBO]:
            'Cannot create a pack with variant products',
        },
      },
    },
    role: {
      error: {
        errorEmail:
          'This email is already used for a teacher or member account',
        generic: 'Cannot change this permission',
        errorCommission: 'The value you entered must be between 0 and 100',
      },
      update: {
        success: 'Modified permissions',
        successCommission: 'The commission rate has been modified',
      },
      noMasterControl: {
        overrideCoachNotAllowed:
          'You cannot force an appointment with this teacher.',
        changeDateCoachUnaivalable:
          'Impossible to book on this date: the teacher is not available.',
        changeDateEstablishmentUnaivalable:
          'Impossible to book on this date: the establishment is not available.',
        overrideEstablishmentNotAllowed:
          'You cannot force an appointment in this establishment.',
        overbookingNotAllowedInWaitingList:
          'You cannot exceed the maximum capacity of the waiting list.',
        overbookingNotAllowed:
          'You cannot exceed the maximum number of reservations.',
      },
      delete: {
        error: {
          genericError: 'An error occured : This role was not deleted',
          customErrors: {
            [EXCEPTION_STAFF_ROLE_CANNOT_BE_DELETED]:
              'Impossible to delete : This role is assigned to some of your staffs',
          },
        },
      },
    },
    notificationRule: {
      createOrUpdate: {
        error: 'Impossible to save',
        success: 'Successfully saved',
        errorLackRequiredVariables: 'This template could not be registered',
      },
      create: {
        error: 'Failed to create notification',
        success: 'Notification successfully created',
        errorLackRequiredVariables: 'This template could not be registered',
      },
      delete: {
        error: 'Failed to delete notification',
        success: 'Notification successfully deleted',
      },
      editOrAddPass: {
        error: 'Failed to save notification',
        success: 'Notification successfully saved',
      },
      active: {
        errorDisable: 'Failed to disable notification',
        errorEnable: 'Failed to enable notification',
        disable: 'Notification successfully disabled',
        enable: 'Notification successfully enabled',
      },
    },
    activity: {
      update: {
        error: 'Impossible to update activity',
        success: 'Activity updated',
      },
      create: {
        error: 'Impossible to save activity',
        success: 'Activity saved',
      },
    },
    member: {
      link: { success: 'Member linked' },
      update: { success: 'Member modified', title: 'Change informations' },
      create: { success: 'Member creation successful', title: 'New member' },
      error: 'Impossible to save member',
      merge: {
        submit: 'Merge',
        cancel: 'Cancel',
        explainTags: 'Member tags will not be transferred',
        explainBookingsAndPassAndInvoiceAndNotes:
          'Passes, booking, bills, and notes will be transferred.',
        explainCredit: 'Internal account of the member will be transferred',
        title: 'Merge',
        dstMember: "We'll keep this account",
        srcMember: 'Member to merge',
        error: 'Impossible to merge members',
        seeMemberPage: ' See member page',
        success: 'Members merged',
      },
      createOrUpdate: {
        error: 'Error while saving',
        success: 'Your modification has been successfully saved',
      },
      changeEmailRequest: {
        create: {
          error: 'Unable to complete the email change request',
          success: 'Validation email has been sent',
        },
      },
    },
    mergeSuccess: {
      title: 'The merge has been successful',
      content: 'An e-mail was sent to both addresses to notify the member',
      seeMemberProfile: 'See member profile',
    },
    mergeError: {
      title: 'The merge failed',
      content: 'Please try again or contact support for further information',
    },
    establishment: {
      update: { success: 'Establishment details updated' },
      create: { success: 'Establishment successfully created' },
      error: 'Unable to save establishment',
      delete: {
        error: 'Impossible to delete this establishment',
        success: 'Establishment deleted',
      },
      restore: {
        error: 'Unable to restore this establishment',
        success: 'Restored establishment',
      },
    },
    email: {
      delete: { error: 'Unable to delete email', success: 'Email deleted' },
      update: { error: 'Unable to edit email', success: 'Email modified' },
      create: { error: 'Unable to save email', success: 'Email created' },
      duplicate: {
        error: 'Unable to duplicate email',
        success: 'Duplicate email',
      },
    },
    coupon: {
      attachToBasket: { error: 'Invalid promotional code' },
      create: {
        success: 'Registered promotional code',
        error: 'Impossible to create this coupon',
      },
      update: {
        success: 'Promotional code changed',
        error: 'Impossible to edit this coupon',
      },
      delete: {
        success: 'Promotional code deleted',
        error: 'Impossible to delete this coupon',
      },
      templateInstance: {
        create: { error: 'Error when sharing this promotion between studios' },
      },
      createOrUpdate: {
        error: 'Error when saving promotion',
        success: 'Promotion saved',
      },
      exportCodes: {
        success: 'Vouchers were correctly exported',
        error: 'Unable to export selected codes',
      },
      errors: {
        [CANNOT_REDEEM_CODE_BECAUSE_NOT_USED]:
          'You cannot mark as used a code that is not awaiting external validation',
      },
    },
    paymentPack: {
      createOrUpdate: {
        fail: 'Error while saving pass',
        success: 'Pass successfully saved',
      },
      compatibilitiesUpdate: {
        fail: 'Error while updating pass compatibilities',
      },
      credit: { error: 'Error while saving', updated: 'Changes saved' },
      paymentPackDisabled: {
        error: 'Impossible to disable pass',
        success: 'Pass disabled',
      },
      paymentPackEnabled: {
        error: 'Unable to restore the pass',
        success: 'Pass restored',
      },
      paymentPackTemplateArchived: {
        error: 'Impossible to archive shared pass',
        success: 'Shared pass archived',
      },
      paymentPackTemplateRestored: {
        error: 'Impossible to restore shared pass',
        success: 'Shared pass restored',
      },
      universalPaymentPackTemplateArchived: {
        error: 'Impossible to archive shared universal pass',
        success: 'Shared universal pass archived',
      },
      universalPaymentPackTemplateRestored: {
        error: 'Impossible to restore shared universal pass',
        success: 'Shared universal pass restored',
      },
      category: {
        update: {
          success: 'Category successfully modified',
          error: 'Impossible to modify the category',
        },
        create: {
          success: 'New category successfully created',
          error: 'Unable to create this category',
        },
        delete: {
          success: 'Category deleted',
          error: 'Unable to delete the category',
        },
      },
    },
    paymentRules: {
      delete: { success: 'Rule deleted', error: 'Error wile deleting' },
      create: { success: 'Rule added', error: 'Error during creation' },
      update: { error: 'Error during update', success: 'Default rule changed' },
    },
    relationship: {
      consumer_payment_pack_links: {
        relink: {
          error: 'Impossible to share this pass',
          success: 'Pass shared',
        },
        unlink: {
          error: 'Impossible to delete this sharing',
          success: 'Sharing stopped',
        },
        create: {
          error: {
            [DST_CONSUMER_PAYMENT_PACK_CANNOT_BE_SHARED_AGAIN]:
              'This pass is shared from another account',
            generic: 'Impossible to share this pass',
          },
          success: 'Pass shared',
        },
      },
      createOrUpdate: { error: 'Impossible to save relationship' },
      create: { success: 'Relationship saved' },
      edit: { success: 'Relationship modified' },
      private_consumer_pass_links: {
        relink: { error: 'Cannot share this pass', success: 'Pass shared' },
        unlink: {
          error: 'Impossible to delete this sharing',
          success: 'Sharing stopped',
        },
        create: {
          error: {
            [DST_PRIVATE_CONSUMER_PASS_CANNOT_BE_SHARED_AGAIN]:
              'This appointment pass is shared from another account',
            generic: 'Impossible to share this appointment pass',
          },
          success: 'Shared appointment pass',
        },
      },
      delete: {
        error: 'Impossible to delete the relationship',
        success: 'Relationship deleted',
      },
      error: {
        90000: 'Account acces rights have been denied',
        90001: 'Invalid request',
        90002: 'Invalid member',
        90003: 'Invalid token',
      },
    },
    coach: {
      delete: {
        error: 'Unable to delete the teacher',
        success: 'Teacher deleted',
      },
      update: { success: 'Teacher successfully updated' },
      create: { success: 'Teacher successfully created' },
      error: 'Unable to save teacher',
      linkByEmail: { success: 'Teacher successfully linked' },
      restore: {
        error: 'Unable to restore the teacher',
        success: 'Teacher successfully restored',
      },
      editAccessToCoachSpace: {
        error: "Error when editing Teacher View's access and rights",
      },
      errors: {
        [COACH_EDIT_EMAIL_ADDRESS_IS_STAFF_USER]:
          'The email indicated is already linked to a staff account.',
        [COACH_EMAIL_ADDRESS_EXISTS]:
          'A member already exists with this email. To link them, use the previous popup.',
        [COACH_CREATE_EMAIL_ADDRESS_IS_FRANCHISOR_USER]:
          'The email indicated is already linked to a staff franchise account.',
      },
    },
    link: { copied: 'Link copied to clipboard' },
    privateService: {
      notCompatibleWithPartnership:
        'The appointment was not saved. Please try again.',
    },
    invoice: {
      error: 'Error while saving - Cancelled',
      create: { success: 'Invoice saved' },
      update: { success: 'Invoice updated' },
      returnPaymentLocked:
        'Unable to refund this payment, is there enough money in your Stripe account?',
      billingEstablishment: {
        error: {
          unAuthorizedEstablishmentModification:
            'Only Admins can modify billing groups',
        },
      },
      sendToQuickbooks: {
        errors: {
          931000: 'Error authenticating to QuickBooks',
          931001: 'Error authenticating to QuickBooks',
          931002: 'Authentication keys have expired',
          931003: 'Authentication keys have expired',
          931004: "You've not set up your QuickBooks application",
          931100: 'Error while updating authentication keys',
          931101: 'QuickBooks is having errors sending us your data',
          932000: 'Your account is no longer authenticated on BSPORT',
          932001: 'Your account is no longer authenticated on BSPORT',
          932100: 'Error while accessing your QuickBooks information',
          933000:
            "The member associated to this invoice doesn't have the required information to be registered with QuickBooks",
          933100: 'Error while associating the member to the invoice',
          933101: 'Error while associating the member to the invoice',
          933102: 'Error when creating the invoice on QuickBooks',
          933103:
            'Your QuickBooks platform supports multiple currencies, please specify which tax to use.',
          934000: 'The invoice lacks information to be created on QuickBooks',
          934001: 'Error while creating invoice without associated items',
          934002: 'Error while sending a canceled an invoice to QuickBooks',
          934003: 'Error while sending an incomplete invoice to QuickBooks',
          934004: 'Error while sending an unpaid invoice to QuickBooks',
          934005: "Your invoice can't be sent to QuickBooks",
          934006: 'This invoice has already been saved to QuickBooks',
          title: 'Error while sending your invoice',
        },
        error: 'Error while transferring your invoice to QuickBooks',
        success: 'Your invoice has been transferred to QuickBooks',
      },
      generateXml: {
        success: 'XML invoice generated successfully',
        errors: {
          default: 'An error occured while generating the XML invoice',
          [INVOICE_EXPORT_INCOMPLETE_USER_ADDRESS]:
            "The member's address is  missing or incomplete",
          [MISSING_USER_OFFICIAL_DOCUMENT_ID]:
            "The member's official document ID is  missing or incomplete",
          [NO_INVOICE_EXPORTER]:
            'Your settings are not configured for .XML invoice export. Please contact your bsport Account manager.',
          [INVOICE_EXPORT_SCHEMA_COMPLIANCE]:
            'Failed to generate the .XML document due to legal requirements. For more information or any questions, contact your bsport Account manager.',
          [INVOICE_EXPORT_EMPTY_ZIP]:
            'The generated Zip file is empty because no invoices to be exported from last month were found',
        },
      },
      applyGiftcard: {
        errors: {
          [INVOICE_PAYMENT_BY_GIFTCARD_ERROR]:
            'Error when validating this payment by gift card',
          [GIFTCARD_ACTIVATION_CODE_ERROR_CODE]:
            'The activation code is wrong.',
          [GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_DISABLED]:
            'The giftcard was disabled.',
          [GIFTCARD_ACTIVATION_UNAUTHORIZED_WHEN_ALREADY_ACTIVATED]:
            'The giftcard has already been activated',
          [GIFTCARD_ACTIVATION_FAIL_WHEN_MISSING_RECIPIENT_MEMBER]:
            'Impossible to find the member who wants to activate the giftcard.',
          generic: 'Unable to activate the gift card',
        },
        error: 'Error when validating this payment by gift card',
        success: 'The gift card payment has been validated',
      },
      applyBalance: {
        error:
          'Error when applying your internal account balance to this invoice.',
        success:
          'Your internal account credit has been applied to this invoice.',
      },
      revert: {
        errors: {
          [INVOICE_NO_REFUND_ON_INTERAC_PAYMENT_ERROR_CODE]:
            'You cannot cancel an invoice with Interac payments.',
          [INVOICE_NO_REFUND_ON_TYPE_EMPTY_CONTAINER]:
            'You cannot refund a balance adjustment invoice with a credit note.',
          [CANNOT_REFUND_INVOICE_EXCEPTION_ERROR_CODE]:
            'It is impossible to reimburse this invoice.',
          [PAYPAL_REFUND_INSUFFICIENT_FUNDS]:
            'You cannot refund this invoice because your PayPal account does not have enough funds.',
        },
      },
    },
    privateConsumerPass: {
      creditUpdate: {
        error: 'Impossible to save the account',
        success: 'Changes saved',
      },
      incompatibilitiesReasons: {
        error:
          'An error occurred while loading the pass incompatibility reasons',
      },
      nonCompatible: {
        error: 'An error occurred while loading non-compatible passes',
      },
    },
    video: {
      createOrUpdate: {
        success: 'Video successfully saved',
        error: 'It is impossible to save this video',
      },
      delete: {
        error: 'It is impossible to delete the video',
        success: 'Video deleted',
      },
      register: {
        error: 'Unable to save this video, try again in a moment',
        success: 'Video saved in your library',
      },
    },
    privateBooking: {
      attachCoach: {
        error: 'It is impossible to assign to the teacher',
        success: 'Appointment assigned to the teacher',
      },
      updateCoach: {
        error: 'It is impossible to edit the teacher',
        success: 'The teacher has been edited',
      },
      restore: {
        error:
          "The appointment can't be restored, as the associated appointment pass has too few credits",
        success: 'The appointment has been restored',
      },
      register: {
        error: 'Error while booking for this date',
        warning: {
          [PRIVATE_SLOT_ALREADY_BOOKED]: "You've recently booked this already",
        },
      },
    },
    playlist: {
      video: {
        del: {
          error: 'It is impossible to remove the video from the playlist',
          success: 'Video removed from the playlist',
        },
        add: {
          error: 'It is impossible to add the video',
          success: 'Video added to the playlist',
        },
      },
      delete: {
        error: 'It is impossible to delete the playlist',
        success: 'Playlist deleted',
      },
      createOrUpdate: {
        error: 'It is impossible to save the playlist',
        success: 'Playlist successfully saved',
      },
    },
    privatePass: {
      del: {
        error: 'Unable to delete this appointment pass',
        success: 'Appointment pass has been deleted',
      },
      restore: {
        error: 'Unable to restore appointment pass',
        success: 'Appointment pass has been restored',
      },
    },
    metaActivity: {
      del: { error: 'Unable to delete this item', success: 'Item deleted' },
      restore: {
        error: 'Unable to restore this item',
        success: 'Item restored',
      },
    },
    memberNote: {
      delete: {
        success: 'Note deleted',
        error: 'It is impossible to delete the note',
      },
    },
    bookingNotification: {
      delete: {
        error: 'Unable to delete notification',
        success: 'Notification deleted',
      },
      createOrUpdate: {
        error: 'Unable to save notification',
        success: 'Notification saved successfully',
      },
    },
    background: {
      cannotFetch:
        'An error has occurred. Check your connection and try refreshing the page',
      timeout: 'The server took too long to respond. Try refreshing the page',
      error: 'An error has occurred, try again later',
      success: 'Completed',
      pending: 'Processing changes...',
    },
    offer: {
      restore: {
        error: 'Not possible to restore session',
        success: 'Session restored',
      },
    },
    subscriptionScheduledStop: {
      create: {
        success: 'Scheduled termination of subscription',
        error: 'Error when terminating this subscription',
      },
      delete: {
        success:
          'The scheduled termination of this subscription has been removed',
        error:
          'Error when removing the scheduled termination of this subscription',
      },
    },
    tag: {
      error: {
        [TAG_GROUP_NAME_ALREADY_USED]: 'The main tag name is already used',
        [TAG_NAME_ALREADY_USED]: 'The sub tag name is already used',
      },
    },
    dashboard: {
      save: {
        error: 'Unable to save changes',
        success: 'The changes have been saved',
      },
    },
    privateRecurrentRule: {
      delete: {
        error: 'Impossible to delete this recurring appointment',
        success: 'Recurring appointment deleted',
      },
      createOrUpdate: {
        success: 'Recurring appointment successfully saved',
        error: 'Impossible to save this recurring appointment',
        locked: 'Recurring appointment rule already exists with these settings',
      },
    },
    zoom: {
      created: {
        success: 'Zoom account successfully linked',
        error: 'Error while linking the Zoom account',
      },
      setGroupId: {
        success: 'Zoom group linked successfully',
        error:
          'Impossible to connect this group. Make sure the ID is correct and that it is available on the Zoom account linked to bsport.',
      },
      bulkEditZoomEstablishments: {
        success: 'Changes have been saved',
      },
    },
    consumerPass: { success: 'Your purchase has been successfully saved !' },
    copied: 'Copied to the clipboard',
    contractPause: {
      create: {
        error: 'Error while pausing this subscription - try again later',
      },
      updateName: {
        error: 'The name of the pause could not be changed',
        success: 'The name of the pause has been changed',
      },
      delete: { error: 'Impossible to remove the pause at the moment.' },
    },
    bookerModule: {
      pass: {
        nothingAvailable:
          'No pass allows you to book these sessions at the same time',
        changed: "We've selected the correct pass to complete your booking",
      },
    },
    settings: {
      update: {
        success: 'The settings have been updated',
        error: 'Unable to update, please try again later',
      },
    },
    paymentMethod: {
      detach: {
        pm_deleted: 'Payment method removed',
        pm_associated_to_pi:
          'Impossible: You have a subscription associated with this payment method',
        pm_associated_to_registered_ppe:
          'Impossible: You have a subscription associated with this payment method',
        pm_associated_to_protected_bp:
          'Impossible: You have a subscription associated with this payment method',
        last_payment_method: 'Unable to delete your only payment method',
      },
      errors: {
        [PAYMENT_METHOD_NOT_DETACHABLE_PAYMENT_GROUP_ERROR_CODE]:
          'Error when deleting payment method',
        [PAYMENT_METHOD_NOT_DETACHABLE_ERROR_CODE]:
          'Error when deleting payment method',
        [PAYMENT_METHOD_NOT_DETACHABLE_PLANNED_PAYMENT_EVENT_ERROR_CODE]:
          'This payment method will be used for future payments',
        [PAYMENT_METHOD_NOT_DETACHABLE_BILLING_PLAN_ERROR_CODE]:
          "There's a subscription connected to this payment method",
        [PAYMENT_METHOD_NOT_DETACHABLE_FUTURE_PAYMENT_ERROR_CODE]:
          'This payment method will be used for future payments',
      },
    },
    signup: {
      failedCreation:
        'Unable to create your account at the moment, please try again in a few minutes',
      emailAlreadyExists: 'This email is already in use',
      changeWorkspaceError: 'An error occurred while changing the account',
    },
    paymentRuleGroups: {
      delete: { success: 'Group deleted', error: 'Error while deleting' },
      create: { success: 'Group added', error: 'Error during creation' },
      update: {
        error: {
          coachWithPaymentGroup:
            'Cannot modify the payment rules of a coach included in a group',
          generic: 'Error during modification',
        },
        success: 'Group successfully modified',
      },
    },
    cancelPayPalPaymentAttempt:
      'Your payment attempt was cancelled. Please proceed again.',
    canNotExecutePaymentAttempt: {
      [PAYMENT_GROUP_LOCK_ACQUISITION_ERROR]:
        'Your payment is already processing, please wait',
      [PENDING_PAYMENT_ATTEMPT_OF_PAYMENT_GROUP_BLOCKS_OTHER_PAYMENT_GROUP_CREATION]:
        'Your payment is already processing, please wait',
      [PAYMENT_GROUP_PRICE_INCONSISTENCY]:
        'Your basket did not match the amount you tried to pay, we refreshed your basket, please try again',
      [PAYMENT_ATTEMPT_EXECUTION_FAILED]:
        'Your payment has failed, please try again.',
      [PAYMENT_GROUP_UNPROCESSABLE_EXCEPTION]:
        'Your payment has failed, please try again.',
      [PAYPAL_PAYER_ACCOUNT_ISSUE]:
        'Your PayPal account cannot process the payment, please try again with a different account',
      [PAYPAL_PAYER_CARD_EXPIRED]: 'Your card is expired',
      [PAYPAL_REDIRECT_PAYER_FOR_ALTERNATE_FUNDING]:
        'Your payment has failed, please select another payment method.',
      [PAYPAL_EXCEPTION]:
        'Your PayPal payment has failed, please try again or use another payment method',
      [PAYPAL_API_EXCEPTION]:
        'Your PayPal payment has failed, please try again or use another payment method',
      failedLoadingPayPalScript: 'An error occurred while loading PayPal',
      generic: 'Your payment has failed, please try again',
    },
    canNotBuyErrorCode: {
      [OFFER_WAITING_LIST_STATUS_FULL]: 'The waitlist is full',
      [OFFER_WAITING_LIST_STATUS_ALREADY_BOOKED]:
        "You've already joined this waitlist",
      [OFFER_BOOKABLE_STATUS_CLOSE_TOO_SOON]:
        'Bookings are still closed for this session',
      [OFFER_BOOKABLE_STATUS_CLOSE_TOO_LATE]:
        'Bookings are still closed for this session',
      [OFFER_BOOKABLE_STATUS_FULL]: 'The session is full',
      [OFFER_BOOKABLE_STATUS_LOCKED]: "The session can't be booked",
      [OFFER_BOOKABLE_STATUS_ALREADY_BOOKED]:
        "You've already booked this session",
      [OFFER_BOOKABLE_STATUS_TOO_MANY_MALE]:
        "You can't book this session, because the male/female ratio is too uneven",
      [OFFER_BOOKABLE_STATUS_TOO_MANY_FEMALE]:
        "You can't book this session, because the male/female ratio is too uneven",
      [OFFER_BOOKABLE_STATUS_TOO_MANY_IN_FUTURE]:
        "It's not allowed to exceed the maximum amount of future bookings",
      [SPOT_NOT_AVAILABLE]: 'Your chosen spot is no longer available',
      [PAYMENT_COMBO_CANT_BE_BOUGHT_HAS_REACHED_MAX_PURCHASE]:
        'This pack is no longer available for purchase',
      [PAYMENT_COMBO_CANT_BE_BOUGHT_NEW_ONLY_ONLY]:
        'This pack is only available for new members',
      [PAYMENT_COMBO_CANT_BE_BOUGHT_DATE_EXPIRED]:
        'This pass can not be bought anymore as its expiration date has been reached',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_DATE_EXPIRED]:
        'This pass can not be bought anymore as its expiration date has been reached',
      [PRIVATE_PASS_CAN_NOT_BE_BOUGHT_DATE_EXPIRED]:
        'This appointment pass can not be bought anymore as its expiration date has been reached',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_NEW_MEMBER_ONLY]:
        'This pass is only available for new members',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_MAX_PURCHASE_REACHED]:
        'This pass is no longer available for purchase',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_MANAGER_ONLY]:
        'This pass is not available for purchase',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_DISABLED]:
        'This pass is not available for purchase',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_VALIDITY_DATERANGE]:
        'This pass is not compatible for a booking on the chosen date',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_INCOMPATIBLE_WITH_OFFER]:
        'This pass is not compatible with this session',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ACTIVITY_INCOMPATIBLE]:
        'This pass is not compatible with this activity',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_SCT_INCOMPATIBLE]:
        "This pass is not compatible with this activity's category",
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_ESTABLISHMENT_INCOMPATIBLE]:
        'This pass is not compatible with this establishment',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_VOD_ONLY]:
        'This pass can only be used for Video On Demand (i.e. not for in-studio activities)',
      [PAYMENT_PACK_CAN_NOT_BE_BOUGHT_BAD_COMPANY]:
        'This pass is not compatible with this session',
      [CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_DAY]:
        "You've reached the maximum number of bookings for this day",
      [CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_WEEK]:
        "You've reached the maximum number of bookings for this week",
      [CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_MONTH]:
        "You've reached the maximum number of bookings for this month",
      [CONSUMER_PAYMENT_PACK_CAN_NOT_BOOK_MAXOUT_YEAR]:
        "You've reached the maximum number of bookings for this year",
      [GIFTCARD_CAN_NOT_BE_BOUGHT_DISABLED]:
        'The giftcard is not not available for purchase anymore.',
      [GIFTCARD_CAN_NOT_BE_BOUGHT_MANAGER_ONLY]:
        'The giftcard is not available for purchase anymore.',
      [SHOP_ITEM_CAN_NOT_BE_BOUGHT_NOT_ENOUGH_STOCK]: 'Insufficient stock',
      [LOCK_ACQUISITION_FAILURE_GENERIC]:
        'A booking is already in progress, please wait a few moments',
      [LOCK_ACQUISITION_FAILURE_SPOT_SCHEDULING]:
        'Impossible to book. This spot is being booked by another member. Please try again by choosing another spot.',
      [BASKET_LOCK_ACQUISITION_FAILURE]:
        'The item is already being added to the basket, please wait',
      [OFFER_WAITING_LIST_NO_USABLE_CONSUMER_PAYMENT_PACK]:
        'There is no pass available to be able to register to the waiting-list',
      [OFFER_WAITING_LIST_CAN_NOT_BOOK_TOO_MANY_FUTURE]:
        'You have reached the maximum of future bookings / waiting-list, you can not register more',

      generic: 'Error while booking',
    },
    customForm: {
      update: {
        success: 'Form has been modified',
        error: 'Error when modifying form',
      },
      create: {
        success: 'Form has been created',
        error: 'Error when creating form',
      },
      duplicate: {
        success: 'Form has been duplicated',
        error: 'Error when duplicating form',
      },
      disable: {
        success: 'Form has been archived',
        error: 'Error when archiving form',
      },
      restore: {
        success: 'Form has been restored',
        error: 'Error when restoring form',
      },
      customFormField: {
        disable: {
          success: 'Field has been archived',
          error: 'Error when archiving field',
        },
        restore: {
          success: 'Field has been restored',
          error: 'Error when restoring field',
        },
      },
      upsert: {
        errors: {
          84006: 'Define your liability waiver in Settings > General.',
        },
      },
      signupViaCustomForm: {
        errors: {
          [ERROR_CUSTOM_FORM_ANSWER_IS_MANDATORY]:
            'The mandatory fields must be completed',
          [ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_EMAIL_ALREADY_EXISTS]:
            'This email is already in use.',
          [ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_GENDER_IS_INVALID]:
            "This specific gender isn't valid",
          [ERROR_CUSTOM_FORM_ANSWER_SIGN_UP_PHONE_NUMBER_IS_INVALID]:
            "This phone number isn't valid",
        },
        error: 'Error when enrolling',
        success: "You've successfully enrolled!",
      },
      customFormStepper: { error: 'Error while saving responses.' },
    },
    establishmentGroup: {
      create: {
        success: 'The new location has been created',
        error: 'Unable to create the location',
      },
      update: {
        success: 'Modified location',
        error: 'Unable to change location',
      },
      delete: {
        success: 'Deleted location',
        error: 'Error while deleting establishment',
      },
    },
    establishmentBillingGroup: {
      delete: {
        error: 'Error while deleting billing group',
        success: 'Billing group has been deleted',
      },
      update: {
        error: 'Error while modifying billing group',
        success: 'Billing group has been successfully modified',
      },
      create: {
        error: 'Error while adding billing group',
        success: 'The new billing group has been added',
      },
    },
    customFormDisplayRule: {
      delete: {
        error: 'Unable to delete the notification rule',
        success: 'Notification rule has been deleted',
      },
      update: {
        error: 'Error while editing notification rule',
        success: 'Notification rule has been edited',
      },
      create: {
        error: 'Unable to create the notification rule',
        success: 'Notification rule created',
      },
      customError: {
        3: 'Error while adding another notification rule at the same time',
      },
    },
    quickbooks: {
      revoke: {
        error: 'Unable to connect your QuickBooks account',
        success: 'Your Quickbooks account has been disconnected',
      },
      create: {
        error: 'Unable to connect your QuickBooks account',
        success: 'Your Quickbooks account is now authenticated',
      },
    },
    platformBilling: {
      payNowInvoice: {
        error: 'Payment: refused',
        success: 'Payment: successful',
      },
    },
    clientSecret: {
      errors: {
        [PAYMENT_DISABLED]: 'Payments are disabled for this studio',
        [PENDING_PAYMENT_INTENT_OF_PAYMENT_GROUP_BLOCKS_OTHER_PAYMENT_GROUP_CREATION]:
          'Your payment is in process of validation. Return later to register a new payment.',
      },
    },
    companyTheme: {
      update: {
        error: 'Error when saving changes',
        success: 'Changes have been saved',
      },
      provincialTax: {
        customError: {
          80001: 'Provincial Tax is not available in your country',
        },
        error: 'Provincial tax registration error',
        success: 'Registered Provincial Tax',
      },
    },
    clockIn: { errors: { 96002: 'This user is already clocked-in' } },
    plannedPayment: {
      registerNow: {
        error: 'Unable to save payment',
        success: 'Saved payment',
      },
    },
    marketplace: {
      update: {
        error: 'An error has occurred. Please check the requested settings.',
        stripeTerminal: {
          deleteReader: {
            success: 'Payment terminal deleted',
            error: 'Unable to delete this payment terminal',
          },
        },
      },
    },
    communicationSentGroupConfig: {
      create: {
        success: 'Campaign created successfully',
        error: 'Unable to create the campaign',
      },
      update: {
        success: 'Campaign updated successfully',
        error: 'Unable to save the campaign',
      },
      delete: {
        success: 'Campaign deleted',
        error: 'Unable to delete the campaign',
      },
      duplicate: {
        success: 'Campagne duplicated',
        error: 'Unable to duplicate the campaign',
      },
    },
    automatedCampaign: {
      [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN]: 'There was an error',
      [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_LIMIT_FOR_SMARTLIST_REACHED]:
        'Invalid of maximum submissions per member',
      [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_EMAIL_WITH_NO_TITLE]:
        'A title is required',
      [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_EMAIL_WITH_NO_BODY]:
        'Email content is required',
      [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_SMS_WITH_NO_BODY]:
        'SMS content is required',
      [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_PUSH_NOTIFICATION_WITH_NO_TITLE]:
        'A notification title is required',
      [EXCEPTION_SMARTLIST_AUTOMATED_CAMPAIGN_BY_PUSH_NOTIFICATION_WITH_NO_BODY]:
        'A push notification content is required',
    },
    communicationv2: {
      error: 'Problem when sending the communication',
      success: 'Communication being sent',
    },
    replacement: {
      errors: {
        [REPLACEMENT_REQUEST_COACH_HAS_REACHED_MAX_NB_LATE_REQUEST]:
          "Impossible to create these substitution requests: you don't have enough overdue requests left.",
        [REPLACEMENT_REQUEST_CANNOT_POSTPONE_CLOSING_DATE_AFTER_OFFER_DATE_START]:
          'The closing date cannot be postponed after the session date.',
        [REPLACEMENT_REQUEST_CANNOT_BE_REFUSED_IF_TEACHER_ALREADY_FOUND]:
          'You cannot deny this request because a teacher has already been assigned.',
        [REPLACEMENT_REQUEST_CANNOT_BE_CANCELLED_IF_TEACHER_ALREADY_FOUND]:
          'You cannot cancel this request because a teacher has already been assigned.',
        [REPLACEMENT_REQUEST_CANNOT_ATTRIBUTE_TEACHER_IF_TEACHER_ALREADY_FOUND]:
          'A teacher has already been assigned to this request.',
        [REPLACEMENT_REQUEST_CANNOT_ATTRIBUTE_TEACHER_IF_ANSWERED_NO]:
          'This teacher replied that he did not wish to be a substitute for this session.',
        [REPLACEMENT_REQUEST_COACH_ANSWER_CANT_BE_CREATED_IF_REQUEST_IS_CLOSED]:
          'You can no longer answer this substitution request.',
        [REPLACEMENT_REQUEST_COACH_ANSWER_COACH_CANT_ANSWER_ON_HIS_OWN_REPLACEMENT_REQUEST]:
          'You cannot answer your own substitution request',
        [REPLACEMENT_REQUEST_DATES_EXCEPTION]:
          "The value 'Number of days request late' must be greater than the value 'Number of days registration closed'.",
        [REPLACEMENT_REQUEST_LIMITATION_EXCEPTION]:
          'Missing settings for overdue request limits.',
        [CANNOT_REQUEST_REPLACEMENT_OFFER_NOT_AVAILABLE]:
          'This session has already passed',
        [CANNOT_REQUEST_REPLACEMENT_ALREADY_REQUESTED]:
          'A request for substitution already exists',
        [CANNOT_REQUEST_REPLACEMENT_COACH_OVERRIDE]:
          'You are already a substitute on this session',
        [REPLACEMENT_REQUEST_CANNOT_BE_CANCELLED_IF_MANAGER_REFUSED]:
          'This substitution request has been denied: impossible to delete it',
        [REPLACEMENT_REQUEST_CANNOT_HAVE_ESTABLISHMENTS_AND_LOCATIONS_SET_AT_THE_SAME_TIME]:
          'You cannot specify establihments and locations at the same time.',
      },
      cancelReplacementRequest: {
        error: 'An error occurred while deleting the request.',
        success: 'The substitution request has been deleted.',
      },
      updateCoachReplacementPreferences: {
        error: 'Impossible to save rules',
        success: 'Rules saved',
      },
      assignDisciplineGroup: {
        success: "Teacher's activity types updated ",
      },
      disciplineGroup: {
        delete: {
          error: 'Impossible to delete this discipline group',
          success: 'Discipline group deleted',
        },
        create: {
          success: 'Discipline groups created',
          error: 'An error occurred while creating the discipline group',
        },
        update: {
          success: 'Discipline group modified',
          error: 'An error occurred while editing the discipline group',
        },
      },
    },
    accessDenied: {
      general: {
        message: 'You cannot access the requested area',
        title: 'Access denied',
      },
    },
    communicationProviderSettings: {
      update: {
        error: 'Unable to save changes',
        success: 'Registered changes',
      },
    },
    requestCurrentBasket: {
      [BASKET_LOCK_ACQUISITION_FAILURE]:
        'The recovery of the basket information is already in progress',
    },
    refreshInternalAccountPrepaidLines: {
      [BASKET_LOCK_ACQUISITION_FAILURE]:
        'An operation is already in progress, please wait a few moments',
    },
    removeItem: {
      [BASKET_LOCK_ACQUISITION_FAILURE]:
        'The item is already being removed from the basket, please wait',
      [BASKET_CANNOT_REMOVE_ITEM_BECAUSE_OF_PAYMENT_GROUP_STATUS]:
        'Impossible to remove this item: your basket is still being processed',
    },
    smartListPopup: {
      send: { error: 'An error has occurred while sending your pop-up.' },
    },
    instalmentPayment: {
      [CUSTOM_INSTALMENT_FIRST_INSTALMENT_AMOUNT_ERROR]:
        'The amount of the first instalment payment needs to be greater than zero',
      [CUSTOM_INSTALMENT_FIRST_INSTALMENT_PERCENT_ERROR]:
        'The percentage of the total amount must be set between 0 and 100',
      [INSTALMENT_PARTIAL_PAYMENT_REQUIRES_ONLY_ONE_BILLING_ERROR]:
        'The number of instalment payments must be equal to 1 to enable the option "Partial payment"',
      [INSTALMENT_CUSTOM_FIRST_INSTALMENT_REQUIRES_AT_LEAST_TWO_BILLINGS_ERROR]:
        'The number of instalment payments must be greater than 2 to enable the option "Customize the first amount"',
    },
    cadence: {
      create: {
        error: 'An error occurred when creating the cadence',
        success: 'A new cadence has been created',
      },
      update: {
        error: 'An error occurred when editing the cadence',
        success: 'Your cadence has been updated',
      },
    },
    audience: {
      create: {
        error: 'An error occurred when creating the {{ workflowLowerCase }}',
        success: 'A new {{ workflowLowerCase }} has been created',
      },
      update: {
        error: 'An error occurred when editing the {{ workflowLowerCase }}',
        success: 'Your {{ workflowLowerCase }} has been updated',
      },
    },
    giftCard: {
      notFound: 'This giftcard has not been found. It may have been archived.',
    },
    modifyBasket: {
      [BASKET_PROCESSING_PAYMENT_EXCEPTION]:
        'The basket is being processed. Please try again in a few minutes.',
      addItemSuccess: 'Product added to cart',
    },
    quicksaleConfiguration: {
      error: 'An error has occurred during save',
      updated: 'Configuration saved',
    },
    spivi: {
      error: {
        [SPIVI_UPSELL_NOT_ACTIVATED_EXCEPTION]:
          'The Spivi upsell is not activated.',
        [NO_ROOM_PLAN_SELECTED_EXCEPTION]: 'No room plan selected',
        [NO_SPIVI_BOX_ID_FOR_ROOM_PLAN_EXCEPTION]:
          'The selected room plan must have a Box ID for the session to be linked to Spivi',
        [SPIVI_EVENT_DURATION_EXCEPTION]:
          'Spivi sessions should last between 20 minutes and 4 hours',
        [SPIVI_DOUBLE_BOOKING_ACTIVATION_EXCEPTION]:
          'Double booking not compatible with Spivi integration',
      },
    },
    smartlistGetMembers: {
      error: 'An error has occurred: members cannot be retrieved',
    },
    privateSlot: {
      notCompatibleWithPartnership:
        'The session was not saved. Please try again.',
      notAvailableForBookingAnymore: 'This slot is not availablle anymore.',
    },
    paypal: {
      connectionAttemptFailed: 'An error occurred while connecting to PayPal',
      connectionAttemptSucceeded:
        'The PayPal account has been succesfully connected',
      couldNotReachPayPal: 'We could not reach PayPal. Please try again later.',
      onboardingUrlFetchFailed:
        "An error occurred while trying to retrieve PayPal's onboarding link",
      [PAYPAL_ACCOUNT_ALREADY_LINKED_TO_OTHER_COMPANY]:
        'You cannot use an account that is already linked to another company.',
    },
    wellhub: {
      configureWebhooks: {
        error: 'An error occurred during the configuration',
        success: 'Your unit ID has been successfully linked',
      },
    },
    oneClickBooking: {
      genericError:
        "We couldn't complete your booking. Please review your details and try again.",
    },
    communicationScheduled: {
      delete: {
        [COMMUNICATION_SCHEDULED_ALREADY_SENT]:
          'This scheduled campaign is being processed or has already been sent.',
      },
    },
  };
};

exports.default = getTranslations();
