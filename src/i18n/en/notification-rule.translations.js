import {
  NOTIFICATION_BOOKING_CANCELLED_BY_MANAGER,
  NOTIFICATION_MEMBERSHIP_CREATION_WEB,
  NOTIFICATION_BOOKING_PASS_CHECKOUT,
  NOTIFICATION_BOOKING_PLUS_PASS_STRIPE_CHECKOUT,
  NOTIFICATION_BOOKING_OPTION_CONVERTIBLE,
  NOTIFICATION_BOOKING_OPTION_NOT_CONVERTIBLE_ANYMORE,
  NOTIFICATION_BOOKING_OPTION_CREATED,
  NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_CONSUMER,
  NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_MANAGER,
  NOTIFICATION_OFFER_IN_BOOKING_MODIFIED,
  NOTIFICATION_BOOKING_NOT_REFUNDED,
  NOTIFICATION_BOOKING_REFUNDED,
  NOTIFICATION_MEMBERSHIP_CREATION_SAAS,
  NOTIFICATION_SUBSCRIPTION_CREATE,
  NOTIFICATION_BOOKING_CREATED,
  NOTIFICATION_SUBSCRIPTION_UPDATE_PAYMENT_METHOD,
  NOTIFICATION_SUBSCRIPTION_PAUSE,
  NOTIFICATION_SUBSCRIPTION_STOP,
  NOTIFICATION_SUBSCRIPTION_PAYMENT_RECEIVED,
} from '@bsport/common/lib/master-data/notification-rule-events';

export default {
  ruleGroup: {
    member: 'Member signup',
    offer: 'Session',
    booking: 'Booking',
    waitingList: 'Waiting-list',
  },
  emailDesign: {
    placeholder: 'Handled by bsport',
    closePreview: 'Close',
  },
  tag: {
    Offer: {
      name: 'Session',
      tags: {
        activity: 'Activity',
        coach: 'Teacher',
        date: 'Hour/Date of session',
        establishment: 'Location',
        establishment_practical_info: 'Location instruction',
        address: 'Address',
      },
    },
    User: {
      name: 'Member',
      tags: {
        firstname: 'Firstname',
        lastname: 'Lastname',
      },
    },
    Booking: {
      name: 'Booking',
      tags: {
        activity: 'Activity',
        coach: 'Teacher',
        date: 'Hour/Date of session',
        establishment: 'Location',
        establishment_practical_info: 'Location instruction',
        address: 'Address',
        ics_calendar_link: 'ics calendar link',
      },
    },
    ConsumerPaymentPack: {
      name: 'Pass',
      tags: {
        pass_price: 'Pass price',
        pass_name: 'Pass name',
        pass_starting_date: 'Pass starting date',
        pass_expiration: 'Pass ending date',
        pass_credit_left: 'Available credits on pass',
      },
    },
    BillingPlan: {
      name: 'Subscription',
      tags: {
        subscription_name: 'Subscription name',
        subscription_recurrent_price: 'Recurrent price',
        subscription_nb_months: 'Number of months',
        subscription_flat_fee: 'Flat fee',
        subscription_payment_method: 'Payment method',
        subscription_nb_days_pause: 'Paused : nb of days',
      },
    },
    BookingOption: {
      name: 'Waiting-list',
      tags: {
        activity: 'Activity',
        coach: 'Teacher',
        date: 'Hour/Date of session',
        establishment: 'Location',
        establishment_practical_info: 'Location instruction',
        address: 'Address',
        option_payment_url: 'Booking link',
        option_expiration_date: 'Option expiration date',
      },
    },
  },
  eventType: {
    [NOTIFICATION_BOOKING_CANCELLED_BY_MANAGER]: 'Session cancelled',
    [NOTIFICATION_MEMBERSHIP_CREATION_WEB]: 'Member signup (by member)',
    [NOTIFICATION_BOOKING_PASS_CHECKOUT]: 'Booking via pass',
    [NOTIFICATION_BOOKING_PLUS_PASS_STRIPE_CHECKOUT]: 'Booking + pass purchase',
    [NOTIFICATION_BOOKING_OPTION_CONVERTIBLE]:
      'Waiting-list exited : booking possible',
    [NOTIFICATION_BOOKING_OPTION_NOT_CONVERTIBLE_ANYMORE]:
      'Waiting-list full again',
    [NOTIFICATION_BOOKING_OPTION_CREATED]: 'Subscribe to waiting-list',
    [NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_CONSUMER]:
      'Unsubcribe from the waiting-list (member)',
    [NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_MANAGER]:
      'Unsubcribe from the waiting-list (manager)',
    [NOTIFICATION_OFFER_IN_BOOKING_MODIFIED]: 'Session modified',
    [NOTIFICATION_BOOKING_NOT_REFUNDED]:
      'Booking cancelled : credit not-refunded',
    [NOTIFICATION_BOOKING_REFUNDED]: 'Booking cancelled : credit refunded',
    [NOTIFICATION_MEMBERSHIP_CREATION_SAAS]: 'Member signup (manager)',
    [NOTIFICATION_SUBSCRIPTION_CREATE]: 'Subscription created',
    [NOTIFICATION_SUBSCRIPTION_UPDATE_PAYMENT_METHOD]:
      'Payment method modified',
    [NOTIFICATION_SUBSCRIPTION_PAUSE]: 'Subscription paused',
    [NOTIFICATION_SUBSCRIPTION_STOP]: 'Subscription ended or terminated',
    [NOTIFICATION_SUBSCRIPTION_PAYMENT_RECEIVED]: 'Payment received',
    [NOTIFICATION_BOOKING_CREATED]: 'New booking',
  },
  messages: {
    createOrUpdate: {
      success: 'Successfully saved',
      error: 'Impossible to save',
    },
  },
};
