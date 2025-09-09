exports.default = {
  pageTitle: 'Settings',
  tab: {
    general: 'General',
    paymentRules: 'Teacher payroll rules',
    notificationRule: 'Transactional notifications',
    company: 'Company',
    broadcast: 'Livestreaming',
    invoice: 'Billing',
    waitingList: 'Waitlist',
    shop: 'Webshop',
    role: 'Staff',
    personalization: 'Personalization',
    webhook: 'Webhook',
    partnership: 'Partnership',
    active_campaign: 'ActiveCampaign',
    coachUserspace: 'Teacher View',
  },
  webhook: {
    cancel: 'cancel',
    submit: 'Confirm',
    createTitle: 'Form webhook',
    add: 'Add a webhook',
    test: 'Test',
    event: 'Event',
    url: 'URL',
    selectEvent: 'Select an event',
    urlPlaceHolder: 'http://wwww.google.com',
    payload: 'Payload',
    urlHelper:
      'Use this field to add the URL to which the payload will be sent.',
    modal: {
      delete: {
        title: 'Delete webhook',
        cancel: 'cancel',
        confirm: 'confirm',
        content:
          'Are you sure you want to delete this webhook ? This is definitive',
      },
    },
  },
  broadcast: {
    is_whereby_integration_enabled: {
      label: 'Enable bsport X whereby intergration',
    },
    explainDisabled:
      'Disabled: you manage the conference link (URL) yourself, and specify it for EACH class (via ZOOM, etc...).',
    explainEnabled:
      'Enabled : bsport manage your conference room, IMPOSSIBLE to have two class at the same time.',
    submit: 'Save',
    seeUpsell: 'Learn more',
    zoom: {
      enabled: 'Activate the automatic Zoom integration',
      label: 'Configure Zoom',
      explainValid:
        "We automatically generate your Zoom Meetings 15 minutes before the start of your livestreams. Relevant members will also be automatically notified 15 minutes beforehand so they can join your Meeting Room straight away. Check if you've got a valid Zoom Account. Important: Zoom only allows one connection per licence and non-Premium Zoom Accounts are limited to 40 minute sessions.",
      explainInvalid: 'Invalid account',
      revoke: 'Deactivate Zoom',
      multiZoomUserSupport: {
        switchLabel: 'Enable the multi zoom user support',
        explain:
          'Launch multiple live streams simultaneously by associating your bsport establishments with different users of your Zoom account.',
      },
      zoomGroupId: 'Zoom group ID',
      groupActionButton: {
        save: 'Save',
        reset: 'Reset',
      },
      establishmentTable: {
        headers: {
          establishment: 'Establishment',
          user: 'User',
          type: 'Type',
          add: 'Add',
        },
        emptySelect: 'Select',
        removeAction: 'Remove',
      },
      memberType: {
        1: 'Basic',
        2: 'Licensed',
      },
      save: 'Save changes',
      resetConfirmationDialog: {
        title: 'Are you sure you want to reset your group ID ?',
        content: 'All of your establishments will be reset as well.',
      },
    },
  },
  active_campaign: {
    submit: 'Confirm',
    cancel: 'Cancel',
    account: {
      helpTitle: 'Where do I find my account information?',
      helpContent:
        'The URL and the Authentication Token can be accessed in your ActiveCampaign Account, by clicking on the "Development" Tab.',
      title: 'Informations to access your ActiveCampaign API',
      dialogTitle: 'My ActiveCampaign API informations',
      token: 'Authentication key',
      error: 'Your informations are incorrect',
      helper: 'Where can I find this information?',
      empty: 'Use this field to add the URL of your API.',
    },
    webhooks: {
      helpTitle: 'How is done synchronisation ?',
      helpContent:
        'These actions are triggered when the associated event is raised on ActiveCampaign.',
      title: 'Push ActiveCampaign informations to bsport',
      CLIENT_WON:
        "Create a client account on bsport when a prospect status moves to 'WON' on a deal",
      CONTACT_TAG:
        "Create a client account on bsport when a prospect is tagged as 'won' on ActiveCampaign",
    },
    link: {
      helpTitle: 'How is synchronisation done?',
      helpContent:
        "Members of the Smartlist are sent every night to the ActiveCampaign list. They appear as 'active'. Members who went out of the Smartlist are pulled out of the ActiveCampaign list, their status is then 'unconfirmed'.",
      title: 'Sending informations from bsport',
      add: 'Add a link between lists',
      dialogTitle: 'Modify a link between lists',
      smartListSelection: 'Select a Smartlist',
      listActiveCampaignSelection: 'Select an ActiveCampaign list',
      helperForm:
        'Select a bsport smartlist and link it to one of your ActiveCampaign lists',
      noList: 'LIST NOT FOUND',
      listItemText:
        'Send members of smartlist <1>{{- smartlist }}</2> to ActiveCampaign <3>{{- list }}</4> list',
    },
  },
  marketplaceSettings: {
    createDialog: {
      dialogTitle: 'Edit tab',
      noPlaylistError: 'Select a playlist',
      noServiceError: 'Select an appointment type',
      noTitleError: 'Enter a title',
      noComponentTypeError: 'Select a component',
      submit: 'Confirm',
      cancel: 'Cancel',
      inputTitle: 'Tab name',
      selectPlaylist: 'Select a playlist',
      selectPrivateService: 'Select a service',
      selectActivity: 'Select an activity',
      selectEstablishment: 'Select an establishment',
      selectCoach: 'Select an instructor',
      selectComponent: 'Select a widget',
      showAdvanced: 'See more options',
      selectVideo: 'Select a video',
      selectPrivateServiceGroups: 'Choose your categories',
      selectPrivateServiceTypeDetail: 'My appointments',
      selectPrivateServiceTypeList: 'All appointments',
      selectPrivateServiceType: 'Type',
      todayOnly: 'Vision sessions of the day',
      hidePaymentCombo: 'Hide packs',
      hidePrivatePass: 'Hide appointment passes',
      hidePaymentPack: 'Hide passes',
      titleCaption: '{{max}} characters max ( {{count}} / {{max}} )',
      hideFilters: 'Do not display search bar and filters',
    },
    componentType: {
      playlist: 'Playlists',
      shop: 'Webshop',
      subscription: 'Subscriptions',
      vod: 'Video On Demand',
      pass: 'Passes',
      privateService: 'Appointments',
      workshop: 'Workshops',
      calendar: 'Calendar',
      newsletter: 'Newsletter',
      newsletterV2: 'Lead acquisition',
      loginButton: 'Login button',
      giftcard: 'Gift cards',
      paymentPackTemplate: 'Shared passes',
      calendarV2: 'Calendar',
      referral: 'Referral',
      consumerBooking: 'My bookings',
      consumerPass: 'My passes',
      consumerSpace: 'Member profile',
    },
    preview: 'Preview',
    saveButton: 'Save',
    link: 'Log out and open the marketplace',
    explainMarketplace:
      'Here you can edit your marketplace (calendar, agenda, appointments, etc.), in which you members can consult and purchase your offer over their phone, tablet, and computer.',
    addButton: 'Add a tab',
  },
  companyOnboarding: { error: "You can't edit this information" },
  paymentMethods: {
    subtitle2:
      'As the manager, you will always have access to all available payment methods.',
    subtitle:
      'You can activate or deactivate the payment methods used by your members for their online payments.',
    title: 'Online payments',
    save: 'Save',
    methodPaymentSubscriptionError: 'Please choose at least one payment method',
    methodPaymentSubscriptionHelper:
      'Select which payment method(s) you wish to enable for recurring payments (subscriptions):',
    methodPaymentSubscription: 'Recurring payments',
    methodPaymentBasketHelper:
      'Select which payment method(s) you wish to enable for one time payments:',
    methodPaymentBasket: 'Single payments',
    methodPaymentCardBillingDetails:
      'Request invoicing details for card payments.',
    methodPaymentCardBillingDetailsTitle: 'Request full invoicing details',
    methodPaymentCardBillingDetailsHelper:
      'By activating this feature, you will reduce the number of card payments requiring 3D Secure (SMS validation, banking applications, etc.) Please note that these fields are compulsory.',
    DaysBeforeNotificationInputs: {
      title: 'Payment method expiration reminders',
      helpText:
        'If the corresponding transactional notifications are activated for subscriptions and payments by instalments, you can decide how many days before the payment method expires to send a reminder.',
      labels: {
        daysBeforeFirstNotification:
          'First reminder (days before expiration date)',
        daysBeforeSecondNotification:
          'Second reminder (days before expiration date)',
      },
      errors: {
        secondWarningDayBiggerThanFirst:
          'The second notification cannot be greater than the first one',
        max: 'The number of days cannot be greater than {{maxDays}}',
      },
    },
  },
  billing_group: {
    header: 'Billing group',
    helperText:
      'The billing groups will appear on your reports to easily link each invoice to the right location and will be used in the basket by the members to choose their preferred location. At least one billing group must be defined for the members to proceed online purchases. If you have several establishments belonging to the same location, you can group them within the same billing group',
    add: 'Add a billing group',
  },
  quickbooks: {
    confirmDialog: {
      text: 'Are you sure that you want to allow BSPORT to access your application?',
      title: 'QuickBook connection',
    },
    buttonRevoke: 'Deactivate QuickBooks',
    buttonReConnect: 'Refresh connection',
    buttonConnect: 'Log in to QuickBooks',
    explainEnable:
      "Upload all your invoices directly to QuickBooks. It'll be updated every 24 hours.",
    submit: 'Save',
    enable: 'Activate the QuickBooks integration',
    title: 'QuickBooks',
    tax: {
      goToSettingsPage: 'Open the QuickBooks configuration page',
      alertNonTaxInformation:
        'No tax information is synchronized with your Quickbooks platform. Please click refresh to synchronize them',
      alertUnconfigured:
        'You have not configured a default tax to apply to the products included in your invoices. This information is mandatory in order to reference the appropriate tax when transferring invoices to your Quickbooks platform.',
      refresh: 'Refresh my Quickbooks data',
      usedAsTaxCode: 'Used as a reference tax',
      taxCodeHeaderDescription: 'Description',
      taxCodeHeaderName: 'Name',
      taxInfoTitle: 'QuickBooks Tax Information',
    },
  },
  mobilePersonalization: {
    externalShopRedirection: {
      popupPreview: {
        inventory: 'My inventory',
        ourOffers: 'Our offer',
        category: {
          giftcard: 'Gift cards',
          contract: 'Subscriptions',
          paymentCombo: 'Packs',
          paymentPack: 'Passes',
        },
        membershipCard: {
          giftcardSubtitle: 'Browse through our gift cards.',
          paymentComboSubtitle: 'Have a look at all our current bundels.',
          vodSubtitle: 'Watch your preferred videos anywhere at any time.',
          contractSubtitle: 'Choose the subscription that best fits you.',
          paymentPackSubtitle: "Discover this studio's entire offer.",
          mySubscription: 'My \nsubscriptions',
          paymentComboEmpty: 'There are no packs to display.',
          contractEmpty: 'There are no subscriptions to display.',
          invoiceEmpty: 'There are no invoices to display.',
          privatePassListEmpty: 'There are no appointment passes to display.',
          privateConsumerPassListEmpty:
            "You don't own any appointment pass yet.",
          vod: 'Video On Demand',
          consumerPaymentPackEmpty: "You don't own any pass yet.",
          paymentPackEmpty: 'There are no passes to display.',
          invoice: 'My invoices',
          consumerPaymentPack: 'My passes',
          paymentPack: 'Passes',
          contract: 'Subscriptions',
        },
        title: 'Preview',
        cancel: 'Close',
      },
      deleteModal: {
        content:
          'Are you sure you want to remove this link? This action is final',
        confirm: 'Delete',
        cancel: 'Cancel',
        title: 'Delete',
      },
      popup: {
        submit: 'Save',
        cancel: 'Cancel',
        icon: 'Icon',
        link: 'Redirect link',
        name: 'Name',
        title: 'External link',
      },
      action: 'Actions',
      link: 'Link',
      name: 'Name',
      icon: 'Icon',
      preview: 'App preview',
      updated: 'Update',
      add: 'Add link',
      helperText:
        'You can add external links on the app to redirect your customers to your website or to another platform. The links will appear in the purchase tab of the mobile application.',
      subtitle: 'External links',
    },
    title: 'Branded app',
    popup: {
      helperText:
        "The start-up pop-up will appear once your members open the application. It allows you to draw your members' attention to a special event (a new class, a promotion ...) and will redirect them to the desired web page.",
      subtitle: 'Start-up pop-up',
      editPopup: {
        previewPopup: { see: 'See', title: 'Preview' },
        preview: 'Preview',
        submit: 'Save',
        cancel: 'Cancel',
        link: 'Redirect link',
        image: 'Image',
        name: 'Pop-up name',
        title: 'Start-up pop-up',
      },
      see: 'Preview',
      deleteModal: {
        content:
          'Are you sure you want to delete this popup? This action is final',
        confirm: 'Confirm delete',
        cancel: 'Go back',
        title: 'Delete',
      },
      action: 'Action',
      image: 'Image',
      link: 'Pop-up link',
      name: 'Pop-up name',
      updated: 'Update',
      add: 'Add pop-up',
    },
    customize: {
      title: 'Personalisation',
      defaultPage: {
        title: 'Default page',
        pageContent: {
          label: 'Change default “Home button”',
          helperText:
            'This option will allow you to choose the default page that users will see upon opening the app.',
          placeholder: 'Select a page',
          options: {
            schedule: 'Schedule',
            bookings: 'Bookings',
            activities: 'Activities (default)',
            studio: 'Studio',
            profile: 'Profile',
          },
        },
      },
    },
  },
  platformCustomerEntity: {
    vatId: {
      title: 'VAT identification number',
      descriptionPart1:
        'bsport requires your VAT number (also known as a VAT registration number or intracommunity VAT number) to include it on invoices we issue to you.',
      descriptionPart2:
        'If your business is based in the EU (excluding France) and has a registered VAT number, providing it is mandatory to apply the reverse-charge mechanism, ensuring that VAT is not charged by bsport.',
      update: 'Update VAT number',
      errorChip: 'Missing valid VAT number',
    },
  },
  company: {
    stripe: { update: 'Update Stripe information' },
    bankAccountInfo: {
      link: 'here',
      content:
        'This account corresponds to the account on which the online payments via Bsport will be credited. To configure the payment method on which your Bsport subscription will be charged, click',
      update: 'Update bank information',
    },
    bankAccountSuccess: {
      note: 'Click on "Configure" to be redirected.',
      content:
        'Your banking information was well updated. To be credited and charged on a single account, you can also update the payment method used to charge your Bsport subscription.',
      title: 'Change of bank details',
    },
    paypal: {
      status: {
        connected: 'Account connected',
        notConnected: 'Not connected',
        hasIssues: 'Connection issues',
        unknown: 'Unknown status',
      },
      linkHelper:
        'Link your PayPal Business Account to allow your members to make one-time payments with PayPal',
      titleWithPayPal: 'With PayPal, your members can',
      oneTimePayments: 'Make one-time payments',
      accountName: 'Account name',
      accountEmail: 'Account email',
      connect: 'Connect PayPal account',
      dialog: {
        title: 'Connect your PayPal business account',
        helper:
          'To connect, use your Business account, upgrade a Personal or Premier account to Business, or create a new Business account.',
        cancel: 'Cancel',
        startConnecting: 'Start connecting',
        redirecting: 'Redirecting you to PayPal...',
        error:
          "An error occurred while trying to retrieve PayPal's onboarding link",
      },
      alert: {
        rightAccount: {
          title: 'Make sure you are connecting the right account',
          content:
            'Changing or disconnecting it afterwards is a complex process that should be avoided unless absolutely necessary.',
        },
        error: {
          isStatusUnknown: {
            title: 'We are currently unable to reach PayPal',
            content: 'Please refresh the page.',
            goToPayPal:
              'If the issue persists, check the status of PayPal sytems',
          },
          primary_email_confirmation: {
            title: 'Missing email confirmation on your PayPal account.',
            content: 'PayPal payments are currently disabled.',
            goToPayPal:
              'Please check your PayPal account to resolve this issue.',
          },
          requires_more_information: {
            title: 'PayPal account missing information or not validated.',
            content:
              'PayPal payments are currently disabled. If your PayPal account is newly created and you’re certain that your information is accurate, please allow some time for PayPal to validate your account. ',
            goToPayPal:
              'Otherwise, please check your PayPal account to resolve this issue.',
          },
          issue_check_account: {
            title: 'Issue with your PayPal account.',
            content: 'PayPal payments are currently disabled.',
            goToPayPal:
              'Please check your PayPal account to resolve this issue.',
          },
          issue_repeat_onboarding: {
            title: 'PayPal payments are currently disabled.',
            content:
              'Please repeat the connection progress using the same account to resolve this issue.',
          },
        },
      },
    },
  },
  errorBoundary: {
    unexpectedError:
      'Sorry, we ran into an unexpected error while loading the page.',
    errorDescription:
      "We're currently looking into what went wrong. Try reloading the page, or submit a crash report for us to investigate further.",
    submitCrashReport: 'Submit crash report',
    reload: 'Reload',
  },
};
