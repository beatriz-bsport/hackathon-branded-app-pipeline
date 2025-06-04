const getTranslations = async () => {
  const NOTIFICATION_EVENTS = await import(
    '@bsport/common/lib/master-data/notification-rule-events.js'
  );

  const {
    NOTIFICATION_BOOKING_CANCELLED_BY_MANAGER,
    NOTIFICATION_MEMBERSHIP_CREATION_WEB,
    NOTIFICATION_BOOKING_PASS_CHECKOUT,
    NOTIFICATION_BOOKING_CREATED,
    NOTIFICATION_BOOKING_PLUS_PASS_STRIPE_CHECKOUT,
    NOTIFICATION_BOOKING_OPTION_CONVERTIBLE,
    NOTIFICATION_BOOKING_OPTION_NOT_CONVERTIBLE_ANYMORE,
    NOTIFICATION_INVOICE_CREATE,
    NOTIFICATION_BOOKING_OPTION_KICKED,
    NOTIFICATION_BOOKING_OPTION_CREATED,
    NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_CONSUMER,
    NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_MANAGER,
    NOTIFICATION_OFFER_IN_BOOKING_MODIFIED,
    NOTIFICATION_BOOKING_NOT_REFUNDED,
    NOTIFICATION_BOOKING_REFUNDED,
    NOTIFICATION_MEMBERSHIP_CREATION_SAAS,
    NOTIFICATION_MEMBERSHIP_CREATION_LIGHT_SIGNUP,
    NOTIFICATION_SUBSCRIPTION_CREATE,
    NOTIFICATION_SUBSCRIPTION_UPDATE_PAYMENT_METHOD,
    NOTIFICATION_SUBSCRIPTION_PAUSE,
    NOTIFICATION_SUBSCRIPTION_STOP,
    NOTIFICATION_SUBSCRIPTION_PAYMENT_RECEIVED,
    NOTIFICATION_SUBSCRIPTION_PAID_WITH_INTERNAL_ACCOUNT_BALANCE,
    NOTIFICATION_BOOKING_BROADCAST,
    NOTIFICATION_PRIVATE_BOOKING_CANCEL_NOT_REFUNDED_COACH,
    NOTIFICATION_PRIVATE_BOOKING_CANCEL_NOT_REFUNDED_CONSUMER,
    NOTIFICATION_PRIVATE_BOOKING_CANCEL_REFUNDED_COACH,
    NOTIFICATION_PRIVATE_BOOKING_CANCEL_REFUNDED_CONSUMER,
    NOTIFICATION_PRIVATE_BOOKING_CREATE_COACH,
    NOTIFICATION_PRIVATE_BOOKING_CREATE_CONSUMER,
    NOTIFICATION_PRIVATE_BOOKING_UPDATETIME_COACH,
    NOTIFICATION_PRIVATE_BOOKING_UPDATETIME_CONSUMER,
    NOTIFICATION_SUBSCRIPTION_PAYMENT_DISPUTED,
    NOTIFICATION_SUBSCRIPTION_PASS_AUTO_DISABLED,
    NOTIFICATION_SUBSCRIPTION_PAYMENT_FAILED_NO_RETRY,
    NOTIFICATION_SUBSCRIPTION_PAYMENT_FAIL_WILL_RETRY,
    NOTIFICATION_PAYMENT_METHOD_EXPIRED_FIRST_WARNING,
    NOTIFICATION_PAYMENT_METHOD_EXPIRED_SECOND_WARNING,
    NOTIFICATION_INSTALMENT_PAYMENT_PAYMENT_METHOD_ABOUT_TO_EXPIRE_FIRST_WARNING,
    NOTIFICATION_INSTALMENT_PAYMENT_PAYMENT_METHOD_ABOUT_TO_EXPIRE_SECOND_WARNING,
    NOTIFICATION_RECURRENT_PRIVATE_BOOKING_NO_AVAILABILITY_COACH,
    NOTIFICATION_RECURRENT_PRIVATE_BOOKING_NO_AVAILABILITY_CONSUMER,
    NOTIFICATION_PAYMENT_INSTALMENT_PREPARED,
    NOTIFICATION_REPLACEMENT_REQUEST_TEACHER_FOUND,
    NOTIFICATION_REPLACEMENT_REQUEST_CLOSED,
    NOTIFICATION_REPLACEMENT_REQUEST_HAS_ANSWERED_BUT_OTHER_TEACHER_FOUND,
    NOTIFICATION_REPLACEMENT_REQUEST_CREATE_ON_TIME,
    NOTIFICATION_REPLACEMENT_REQUEST_CREATE_LATE,
    NOTIFICATION_REPLACEMENT_REQUEST_CLOSING_DATE_POSTPONED,
    NOTIFICATION_REPLACEMENT_REQUEST_ANWSER_HAS_BEEN_ACCEPTED,
    NOTIFICATION_OFFER_AUTO_DISCARD,
    NOTIFICATION_OFFER_AUTO_DISCARD_TO_STUDENT,
    NOTIFICATION_GROUPED_OFFERS_CANCELLED,
    NOTIFICATION_CONSUMER_PAYMENT_PACK_PENALTY_BLOCK_CPP,
    NOTIFICATION_CONSUMER_PAYMENT_PACK_PENALTY_ACCOUNT,
    NOTIFICATION_BOOKING_BROADCAST_TO_TEACHER,
    NOTIFICATION_BOOKING_CANCELLED_BY_MANAGER_TO_TEACHER,
    NOTIFICATION_OFFER_IN_BOOKING_MODIFIED_TO_TEACHER,
    NOTIFICATION_CONSUMER_PAYMENT_PACK_NO_SHOW_PENALTY_BLOCK,
    NOTIFICATION_CONSUMER_PAYMENT_PACK_NO_SHOW_PENALTY_CHARGE,
    NOTIFICATION_CONSUMER_PAYMENT_PACK_NO_SHOW_WARNING,
    NOTIFICATION_MEMBERSHIP_PASSWORD_RESET,
    NOTIFICATION_MEMBERSHIP_EMAIL_VALIDATION,
    NOTIFICATION_MEMBERSHIP_ACCOUNTS_FUSION,
    NOTIFICATION_MEMBERSHIP_EMAIL_MODIFICATION_BY_MANAGER,
    NOTIFICATION_GIFTCARD_ACTIVATION,
    NOTIFICATION_PRINTABLE_GIFTCARD_PDF_EMAIL,
    NOTIFICATION_INVOICE_PDF_REQUESTED_BY_MEMBER,
    NOTIFICATION_REFERRAL_GRANT_CREATED,
    NOTIFICATION_REFERRED_GRANT_CONSUMED,
    NOTIFICATION_SPIVI_ACCOUNT_CREATED,
    NOTIFICATION_SPIVI_PERFORMANCE,
    NOTIFICATION_SPIVI_COACH_ACCOUNT_CREATED,
    NOTIFICATION_BOOKING_CREATED_FOR_INVITEE_SEND_TO_HOST,
    NOTIFICATION_BOOKING_CREATED_FOR_INVITEE_SEND_TO_INVITEE,
  } = NOTIFICATION_EVENTS;

  return {
    ruleGroup: {
      member: 'Member registration',
      offer: 'Sessions',
      booking: 'Bookings',
      subscription: 'Subscriptions',
      'waiting-list': 'Waitlists',
      private_booking: 'Appointments',
      marketing: 'Marketing',
      invoice: 'Billing',
      payment_pack: 'Penalties',
      recurrent_private_booking: 'Recurring appointments',
      replacement_request: 'Substitution',
      giftcard: 'Gift cards',
      referral: 'Referral',
      performance: 'Performance',
    },
    emailDesign: {
      placeholder: 'Standard BSPORT template',
      closePreview: 'Close',
      birthdayPlaceholder: 'Select an email to see a preview of it.',
    },
    tag: {
      Offer: {
        name: 'Sessions',
        tags: {
          activity: 'Group activities',
          coach: 'Teacher',
          date: 'Time and date',
          establishment: 'Establishments',
          establishment_practical_info: 'Establishment access information',
          address: 'Address',
        },
      },
      User: {
        name: 'Member',
        tags: {
          firstname: 'First name',
          lastname: 'Last name',
          unsubscribe_link: 'Unsubscribe from the newsletter',
          reset_password_url: 'Password reset link',
          email_confirmation_url: 'Email confirmation link',
        },
      },
      Booking: {
        name: 'Activity',
        tags: {
          activity: 'Activity',
          coach: 'Teacher',
          date: 'Time and date',
          establishment: 'Establishment',
          establishment_practical_info: 'Establishment access information',
          address: 'Address',
          ics_calendar_link: 'ICS Calendar Link',
          spot: 'Place',
          canceled_grouped_session: 'Cancelled reservation group',
        },
        subtitles: {
          workshop: 'Workshop',
          establishment_group: 'Location',
          establishment: 'Establishment',
          meta_activity: 'Activity',
        },
      },
      ConsumerPaymentPack: {
        name: 'Passes',
        tags: {
          pass_price: 'Price of the pass',
          pass_name: 'Name of the pass',
          pass_starting_date: 'Start date of the pass',
          pass_expiration: 'Expiration date of the pass',
          pass_credit_left: 'Remaining credits',
        },
      },
      BillingPlan: {
        name: 'Subscriptions',
        tags: {
          subscription_name: 'Subscription name',
          subscription_recurrent_price: 'Monthly price',
          subscription_nb_months: 'Number of months',
          subscription_duration: 'Total duration',
          subscription_flat_fee: 'Joining fee',
          subscription_payment_method: 'Payment method',
          subscription_nb_days_pause: 'Paused for X number of days',
          subscription_next_invoice_date: 'Next billing date',
          subscription_contract_terms_link: 'Link for terms',
          days_until_payment_method_expiration:
            'Number of days until payment method expires',
        },
      },
      BookingOption: {
        name: 'Waitlist',
        tags: {
          activity: 'Activity',
          coach: 'Teacher',
          date: 'Time and date',
          establishment: 'Establishment',
          establishment_practical_info: 'Establishment access information',
          address: 'Address',
          option_payment_url: 'Booking link',
          option_expiration_date: 'Waitlist expiration date',
          waiting_list_position: 'Waitlist position',
          waiting_list_size: 'Waitlist size',
        },
      },
      PrivateBooking: {
        tags: {
          establishment_practical_info: 'Establishment access information',
          address: 'Address',
          date: 'Time and date',
          coach: 'Teacher',
          activity: 'Activity',
          establishment: 'Establishment',
          ics_calendar_link: 'ICS Calendar Link',
        },
        name: 'Appointments',
      },
      PrivateConsumerPass: {
        tags: {
          pass_credit_left: 'Remaining credits',
          pass_expiration: 'Expiration date of the pass',
          pass_starting_date: 'Start date of the pass',
          pass_name: 'Name of the pass',
          pass_price: 'This is the selling price.',
        },
        name: 'Appointment passes',
      },
      Company: {
        tags: {
          company_websiteURL: 'Website URL',
          company_info: 'Studio information',
          android_app_URL: 'Android application URL',
          ios_app_URL: 'iOS application URL',
          company_facebookURL: 'Facebook URL',
          company_instagramURL: 'Instagram URL',
          company_scheduleURL: 'Schedule URL',
          login_url: 'Login URL',
          company: "Company's name",
          company_logo: 'Company logo',
        },
        name: 'Company',
      },
      GuestInvitation: {
        name: 'Guest booking',
        tags: {
          firstname_guest: 'Guest first name',
          lastname_guest: 'Guest last name',
          firstname_host: 'Inviting member first name',
          lastname_host: 'Inviting member last name',
        },
      },
      RecurrentRule: {
        tags: {
          recurring_booking_fail_reason: 'Reason for recurrent booking failure',
          establishment_practical_info: 'Establishment access information',
          establishment: 'Establishment',
          date: 'Time and date',
          coach: 'Teacher',
          address: 'Address',
          activity: 'Activity',
        },
        name: 'Recurrent rule',
      },
      Birthday: { name: 'Birthday' },
      ReplacementRequest: {
        tags: {
          sub_teacher: 'Substitute teacher',
          closing_date: 'Closing date',
        },
        name: 'Substitution',
      },
      Invoice: {
        name: 'Billing',
        tags: {
          id: 'Invoice ID',
          invoice_price: 'Invoice amount',
          invoice_sum_up: 'Invoice summary',
          invoice_date: 'Billing date',
          invoice_download_link: 'Download link',
          days_until_payment_method_expiration_planned_payment_event:
            'Days before expiration of the payment method',
        },
      },
      GiftCard: {
        tags: {
          giftcard_message: 'Gift card message',
          activate_giftcard_url: 'Gift card activation link',
          message_is_from: 'Member sending the gift card',
          message_is_for: 'Recipient of the gift card',
          giftcard_value: 'Gift card value',
          giftcard_name: 'Gift card name',
          activation_datetime: 'Gift card activation date',
          pdf_link: 'Gift card PDF link',
          printable_code: 'Gift card printable code',
        },
        name: 'Gift card',
      },
      requiredTags: {
        reset_password_url: 'Password reset link',
        email_confirmation_url: 'Email confirmation link',
        new_email: 'New login email',
        old_email: 'Old login email',
        activate_giftcard_url: 'Gift card activation link',
        message_is_from: 'Member sending the gift card',
        giftcard_message: 'Gift card message',
        giftcard_value: 'Gift card value',
        manage_changing_email_link: 'Email change management link',
        pdf_link: 'Gift card PDF link',
      },
      EmailChange: {
        name: 'Account modification',
        tags: {
          new_email: 'New login email',
          old_email: 'Old login email',
          manage_changing_email_link: 'Email change management link',
          login_link: 'Personal space login link',
        },
      },
      SpiviPerformance: {
        tags: {
          total_distance: 'Distance covered',
          calories_kJ: 'Calories in kJ',
          calories: 'Calories',
          max_watts: 'Maximum power',
          maximum_speed: 'Maximum speed',
          max_RPM: 'Maximum rpm',
          max_HR: 'Maximum heart rate',
          average_watts: 'Average power',
          average_speed: 'Average speed',
          average_RPM: 'Average rpm',
          average_HR: 'Average heart rate',
          SEP: 'Spivi Ecosystem Point',
        },
        name: 'Performance',
      },
      ReferralProgram: {
        name: 'Referral',
        tags: {
          reduction_purchase_referred: 'Discount for the referred member',
          referring_reward: 'Reward for the referrer',
          minimum_purchase_referral: 'Minimum purchase amount',
          deadline_use_referral: 'Referral reward validity',
          referring_firstname: 'Referrer first name',
          referring_lastname: 'Referrer last name',
          referred_firstname: 'Referred first name',
          referred_lastname: 'Referred last name',
          referral_link: 'Referral link',
          registration_date: 'Referred member registration date',
        },
      },
    },
    eventTypeHelperText: {
      [NOTIFICATION_INSTALMENT_PAYMENT_PAYMENT_METHOD_ABOUT_TO_EXPIRE_FIRST_WARNING]:
        'You can customize the number of days considered when sending this notification in the Payment methods section',
      [NOTIFICATION_INSTALMENT_PAYMENT_PAYMENT_METHOD_ABOUT_TO_EXPIRE_SECOND_WARNING]:
        'You can customize the number of days considered when sending this notification in the Payment methods section',
      [NOTIFICATION_PAYMENT_METHOD_EXPIRED_FIRST_WARNING]:
        'You can customize the number of days considered when sending this notification in the Payment methods section',
      [NOTIFICATION_PAYMENT_METHOD_EXPIRED_SECOND_WARNING]:
        'You can customize the number of days considered when sending this notification in the Payment methods section',
    },
    eventType: {
      [NOTIFICATION_BOOKING_CANCELLED_BY_MANAGER]:
        'Cancelled session (for members)',
      [NOTIFICATION_MEMBERSHIP_CREATION_WEB]:
        'For newly enrolled members (for members)',
      [NOTIFICATION_BOOKING_PASS_CHECKOUT]: 'Booking with pass',
      [NOTIFICATION_BOOKING_CREATED]: 'New booking (for members)',
      [NOTIFICATION_BOOKING_PLUS_PASS_STRIPE_CHECKOUT]:
        'Booking + pass purchase',
      [NOTIFICATION_BOOKING_OPTION_CONVERTIBLE]:
        'A member has unsubscribed from the waitlist (opening up a spot)',
      [NOTIFICATION_BOOKING_OPTION_NOT_CONVERTIBLE_ANYMORE]:
        "A member's spot on the waitlist has expired",
      [NOTIFICATION_INVOICE_CREATE]: 'Invoice confirmation',
      [NOTIFICATION_BOOKING_OPTION_KICKED]:
        "A member that hasn't responded in time and has been kicked from the waitlist",
      [NOTIFICATION_BOOKING_OPTION_CREATED]: 'A member joined the waitlist',
      [NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_CONSUMER]:
        'A member has unsubscribed from the waitlist (for members)',
      [NOTIFICATION_BOOKING_OPTION_CANCELLED_BY_MANAGER]:
        'A member has unsubscribed from the waiting list (for staff)',
      [NOTIFICATION_OFFER_IN_BOOKING_MODIFIED]:
        'Modified session (for members)',
      [NOTIFICATION_BOOKING_NOT_REFUNDED]:
        'Booking cancelled: credit not refunded (for members)',
      [NOTIFICATION_BOOKING_REFUNDED]:
        'Booking cancelled: credit refunded (for members)',
      [NOTIFICATION_MEMBERSHIP_CREATION_SAAS]:
        'For newly enrolled members (for staff)',
      [NOTIFICATION_MEMBERSHIP_CREATION_LIGHT_SIGNUP]:
        'For members enrolled via one-click booking (for members)',
      [NOTIFICATION_SUBSCRIPTION_CREATE]:
        'Purchased subscription (for members)',
      [NOTIFICATION_SUBSCRIPTION_UPDATE_PAYMENT_METHOD]:
        'Payment method modified',
      [NOTIFICATION_SUBSCRIPTION_PAUSE]: 'Subscription paused',
      [NOTIFICATION_SUBSCRIPTION_STOP]: 'Subscription ended or terminated',
      [NOTIFICATION_SUBSCRIPTION_PAYMENT_RECEIVED]: 'Payment received',
      [NOTIFICATION_SUBSCRIPTION_PAID_WITH_INTERNAL_ACCOUNT_BALANCE]:
        'Subscription paid with internal account balance',
      [NOTIFICATION_BOOKING_BROADCAST]:
        'Reminder that the livestream starts in 15 minutes (for members)',
      [NOTIFICATION_BOOKING_CREATED_FOR_INVITEE_SEND_TO_HOST]:
        'Booking for a guest (for inviting member)',
      [NOTIFICATION_BOOKING_CREATED_FOR_INVITEE_SEND_TO_INVITEE]:
        'Booking for a guest (for guest)',
      [NOTIFICATION_PRIVATE_BOOKING_CREATE_CONSUMER]:
        'New appointment (for members)',
      [NOTIFICATION_PRIVATE_BOOKING_UPDATETIME_CONSUMER]:
        'Modified timetable (for members)',
      [NOTIFICATION_PRIVATE_BOOKING_CANCEL_NOT_REFUNDED_CONSUMER]:
        'Appointment - late-cancel (for members)',
      [NOTIFICATION_PRIVATE_BOOKING_CANCEL_REFUNDED_CONSUMER]:
        'Appointment canceled - refunded (for members)',
      [NOTIFICATION_PRIVATE_BOOKING_CREATE_COACH]:
        'New appointment (for teachers)',
      [NOTIFICATION_PRIVATE_BOOKING_UPDATETIME_COACH]:
        'Modification in timetable (for teachers)',
      [NOTIFICATION_PRIVATE_BOOKING_CANCEL_NOT_REFUNDED_COACH]:
        'The appointment was cancelled too late (for teachers)',
      [NOTIFICATION_PRIVATE_BOOKING_CANCEL_REFUNDED_COACH]:
        'The appointment was cancelled and has been refunded (for teachers)',
      [NOTIFICATION_OFFER_AUTO_DISCARD]:
        'When underoccupied sessions get automatically cancelled (teachers)',
      [NOTIFICATION_OFFER_AUTO_DISCARD_TO_STUDENT]:
        'When underoccupied sessions get automatically cancelled (members)',
      [NOTIFICATION_GROUPED_OFFERS_CANCELLED]: 'Cancelled appointment group',
      [NOTIFICATION_CONSUMER_PAYMENT_PACK_PENALTY_BLOCK_CPP]:
        'Late cancelation: the pass has been temporarily blocked (for members)',
      [NOTIFICATION_CONSUMER_PAYMENT_PACK_PENALTY_ACCOUNT]:
        'Late cancelation: a fine has been added to the internal account balance (for members)',
      [NOTIFICATION_CONSUMER_PAYMENT_PACK_NO_SHOW_PENALTY_BLOCK]:
        'No show: the pass has been temporarily blocked (for members)',
      [NOTIFICATION_CONSUMER_PAYMENT_PACK_NO_SHOW_PENALTY_CHARGE]:
        'No show: a fine has been added to the internal account balance (for members)',
      [NOTIFICATION_CONSUMER_PAYMENT_PACK_NO_SHOW_WARNING]:
        'Notification of absence',
      [NOTIFICATION_RECURRENT_PRIVATE_BOOKING_NO_AVAILABILITY_COACH]:
        'Recurring appointment has been cancelled due to a lack of availability (teacher)',
      [NOTIFICATION_RECURRENT_PRIVATE_BOOKING_NO_AVAILABILITY_CONSUMER]:
        'Recurring appointment has been cancelled due to a lack of availability (members)',
      [NOTIFICATION_PAYMENT_INSTALMENT_PREPARED]:
        'Attempt to collect an installment payment',
      [NOTIFICATION_SUBSCRIPTION_PAYMENT_DISPUTED]:
        'Disputed payment for a subscription',
      [NOTIFICATION_SUBSCRIPTION_PASS_AUTO_DISABLED]:
        'The pass of the subscription has been automatically deactivated',
      [NOTIFICATION_SUBSCRIPTION_PAYMENT_FAILED_NO_RETRY]:
        'Failed payment for a subscription',
      [NOTIFICATION_SUBSCRIPTION_PAYMENT_FAIL_WILL_RETRY]:
        'A Smart Retry will be done for a failed payment for a subscription',

      [NOTIFICATION_BOOKING_BROADCAST_TO_TEACHER]:
        'Reminder that the livestream starts in 15 minutes (for teachers)',
      [NOTIFICATION_BOOKING_CANCELLED_BY_MANAGER_TO_TEACHER]:
        'Cancelled session (for teachers)',
      [NOTIFICATION_OFFER_IN_BOOKING_MODIFIED_TO_TEACHER]:
        'Modified session (for teachers)',
      [NOTIFICATION_REPLACEMENT_REQUEST_TEACHER_FOUND]:
        'Substitute found (teacher)',
      [NOTIFICATION_REPLACEMENT_REQUEST_CLOSED]:
        'Substitution request canceled (substitute)',
      [NOTIFICATION_REPLACEMENT_REQUEST_HAS_ANSWERED_BUT_OTHER_TEACHER_FOUND]:
        'Another substitute has been found (substitute)',
      [NOTIFICATION_REPLACEMENT_REQUEST_CREATE_ON_TIME]:
        'New substitution request (substitute)',
      [NOTIFICATION_REPLACEMENT_REQUEST_CREATE_LATE]:
        'New late request (substitute)',
      [NOTIFICATION_REPLACEMENT_REQUEST_CLOSING_DATE_POSTPONED]:
        'Postponed closing date (substitute)',
      [NOTIFICATION_REPLACEMENT_REQUEST_ANWSER_HAS_BEEN_ACCEPTED]:
        'Substitute found (substitute)',
      [NOTIFICATION_MEMBERSHIP_PASSWORD_RESET]: 'Reset member password',
      [NOTIFICATION_MEMBERSHIP_EMAIL_VALIDATION]: 'Member email validation',
      [NOTIFICATION_MEMBERSHIP_ACCOUNTS_FUSION]:
        'Merger of two studio accounts',
      [NOTIFICATION_MEMBERSHIP_EMAIL_MODIFICATION_BY_MANAGER]:
        'Change of member email from the backoffice',
      [NOTIFICATION_GIFTCARD_ACTIVATION]: 'Digital gift card activation',
      [NOTIFICATION_PRINTABLE_GIFTCARD_PDF_EMAIL]:
        'Physical gift card activation',
      [NOTIFICATION_INVOICE_PDF_REQUESTED_BY_MEMBER]:
        'Request for invoice download',
      [NOTIFICATION_SPIVI_ACCOUNT_CREATED]:
        'Spivi account created (for members)',
      [NOTIFICATION_REFERRAL_GRANT_CREATED]:
        'Referral grant available (referred member)',
      [NOTIFICATION_REFERRED_GRANT_CONSUMED]:
        'Referral grant available (referring member)',
      [NOTIFICATION_SPIVI_PERFORMANCE]: 'Spinning session performance',
      [NOTIFICATION_SPIVI_COACH_ACCOUNT_CREATED]:
        'Spivi account created (for teachers)',
      [NOTIFICATION_PAYMENT_METHOD_EXPIRED_FIRST_WARNING]:
        'Subscription payment method about to expire (first warning)',
      [NOTIFICATION_PAYMENT_METHOD_EXPIRED_SECOND_WARNING]:
        'Subscription payment method about to expire (second warning)',
      [NOTIFICATION_INSTALMENT_PAYMENT_PAYMENT_METHOD_ABOUT_TO_EXPIRE_FIRST_WARNING]:
        'Payment method expiration first reminder for payments by installment',
      [NOTIFICATION_INSTALMENT_PAYMENT_PAYMENT_METHOD_ABOUT_TO_EXPIRE_SECOND_WARNING]:
        'Payment method expiration second reminder for payments by installment',
    },
    pageTitle: 'Transactional notifications',
    caption: {
      emailDesign: 'Transactional email template',
      event: 'Event',
      sendCopy: 'Receive copies',
      active: 'Enable',
    },
    marketingNotification: { birthday: 'Happy birthday!' },
    franchise: {
      delete: {
        content:
          'Are you sure that you want to delete this configuration? The settings and templates of the selected email will revert to their original set-up.',
        delete: 'Delete',
        title: 'Delete',
      },
      card: {
        carbonCopy: 'Receive copies of this email',
        deactivated: 'Deactivated',
        activated: 'Activated',
        companies: 'Studios',
        parameters: 'Settings',
        template: 'Template',
      },
      form: {
        error: {
          email_design: 'Select a template',
          selectCompanies: 'Select at least one studio',
          name: 'Select a name',
        },
        save: 'Save',
        cancel: 'Cancel',
        mailSelection: 'Select a template',
        receiveCarbonCopySubtitle: "You'll receive a copy of each sent email.",
        receiveCC: 'Receive copies of this email',
        activateSubtitleDeactivate:
          "The transactional email has been deactivated and it won't be sent to the relevant members",
        activateSubtitleActivate:
          "The transactional email has been activated and it'll be sent to the relevant members",
        activate: 'Activate',
        parameters: 'Settings',
        useFor: 'Use for ',
        pickTemplate: 'Select a template',
        name: 'Name',
        description:
          'The chosen template with be use for all the studios\' "{{-name}}" transactional emails .',
        title: '[Form] Configuration',
        restrictedAccess:
          'This configuration is set up for franchisees to which you do not have access. Some fields are not editable',
      },
      emptyStateConfiguration:
        'Add a notification to force the use of specific email templates.',
      addConfiguration: 'Notifications configuration',
      emptySelect:
        'Select a transactional notification to display which studios it has been shared with and to display which studios are using it.',
    },
    franchiseOwned:
      'The Master Account directly manages this transactional email.',
    listItem: {
      createTransactionnalNotification: 'Configure the push notification',
      modifyTransactionnalNotification: 'Edit push notification',
      sendTransactionnalNotification: 'Send a push notification',
      transactionnalNotification: 'Push notification',
      mailToSend: 'Select the email that will be sent',
      copyCarbon: 'Receive a copy of this email',
      sendTransactionnalEmail: 'Send a transactional email',
      transactionnalEmail: 'Transactional email',
      infoBoxErrorMessageFirstLine:
        'This mail must contain the following variables:',
      infoBoxErrorMessageLastLine:
        'Make sure you add them to your template so you can save it',
    },
    preview: {
      email: 'Email',
      notification: 'Push',
      emptyStateNotification:
        'Configure your push notifications to enable see a preview',
      emptyState: 'Click a categorie to see a preview',
      title: 'Preview',
    },
    goBackToMenu: 'Previous',
    configureNotif: 'Configure',
    countNotification: 'Number of activated push notifications: {{nbr}}',
    countEmail: 'Number of activated transactional emails: {{nbr}}',
    countElements: '{{nbr}} element(s)',
    triggeringEvent: { title: 'Triggering event' },
    type: {
      hours: 'Hours',
      days: 'Days',
      bookingConcerned: 'the session concerned by the notification',
      sendNotification: 'Send the notification',
    },
  };
};

exports.default = getTranslations();
