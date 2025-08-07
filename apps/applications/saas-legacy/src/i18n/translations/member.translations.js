const getTranslations = async () => {
  const { MEMBER_EVENTS } = await import(
    '@bsport/common/lib/master-data/events.js'
  );

  const {
    LEAD_MANAGEMENT_IMPORT_LOCK_ACQUISITION_ERROR,
    LEAD_MANAGEMENT_IMPORT_WRONG_NUMBER_OF_COLUMNS_ERROR,
    LEAD_MANAGEMENT_IMPORT_MAXIMUM_NUMBER_OF_ROWS_ERROR,
    LEAD_MANAGEMENT_IMPORT_WRONG_ENCODING,
  } = await import('@bsport/common/lib/master-data/error-codes/member.js');

  return {
    date_joined: 'Sign up date',
    email: 'Email',
    invoiceTitle: 'Invoices',
    subscriptionTitle: 'Subscriptions',
    offers_joined: 'Activities joined',
    pass_owner: 'Not valid',
    memberSince: 'Sign up date ',
    showNextBooking: 'Show next bookings',
    nextBooking: 'next: ',
    showPreviousBooking: 'Show past bookings',
    engagement: 'Commitment',
    addMember: 'Add a member',

    creditAccountBalance: 'Client account balance',
    showPaymentPack: 'Show pass',
    showInvoices: 'Show invoices',
    showSubscriptions: 'Show subscriptions',
    memberList: 'Overview',
    leads: {
      import: 'Import leads',
      notACSV: {
        title: 'Unsupported file format',
        message:
          'The file is not a CSV. Please check the helpsheet for more information.',
        goToIntercom: ' Open helpsheet',
      },
      dialogs: {
        success: 'Members were successfully imported',
        partialSuccess: {
          title:
            'Some rows in the file contained errors and could not be processed',
          lineOneMessage:
            'However, accounts for members with correct data have been successfully created.',
          lineTwoMessage: 'Please find the 2 files detailing the situation:',
          fileName: 'fileMembers.csv',
          failedImportSubtext: 'Incorrect rows',
          successImportSubtext: 'Created members',
        },
        errors: {
          title: 'Unfortunately, the import process has failed because:',
          unknown: 'An unexpected error occurred',
          [LEAD_MANAGEMENT_IMPORT_LOCK_ACQUISITION_ERROR]:
            'Please wait for the ongoing import to finalize',
          [LEAD_MANAGEMENT_IMPORT_WRONG_NUMBER_OF_COLUMNS_ERROR]:
            'This file does not have the required number of columns, it has {{column_count}} columns in row {{row_count}}',
          [LEAD_MANAGEMENT_IMPORT_MAXIMUM_NUMBER_OF_ROWS_ERROR]:
            'This file exceeds the maximum size limit',
          [LEAD_MANAGEMENT_IMPORT_WRONG_ENCODING]:
            'Failed to decode the file. Please ensure it is not corrupted or in an unsupported format',
        },
      },
    },
    note: {
      addNote: 'Add a note',
      myNotes: 'Notes',
      healthNotes: 'Alerts',
      noNoteSaved: 'There are no saved notes to display.',
      is_medical: 'Essential note',
    },
    file: {
      addButtonBlocked: 'Delete files to add new ones',
      imported: 'The document has been successfully uploaded.',
      deletion: 'Deletion',
      title: 'Documents',
      deleteFileMessage: 'Are you sure that you want to delete this file?',
      confirm: 'Confirm',
      submit: 'Add',
      add: 'Add a document',
      nofileSaved: 'There are no saved files to display.',
      upload_file: 'Upload file',
      cancel: 'Cancel',
      name: 'Name',
      drop_file: 'Click here to add a document.',
    },
    relation: {
      pleaseSelectRelation:
        'Select a relationship to see more details about the shared passes.',
    },
    menu: {
      info: 'General',
      bookings: 'Bookings',
      paymentPack: 'Passes',
      invoices: 'Invoices & Subscriptions',
      payment: 'Billing',
      contact: 'Contact',
      privateBooking: 'Appointments',
      privateConsumerPass: 'Appointments passes',
      relation: 'Relationships',
      vod: 'Video On Demand',
      form: 'Forms',
      giftcard: 'Gift card',
      programs: 'Programs',
      basket: 'Basket',
    },
    row: {
      headers: { actions: 'Actions', newsletter_email: 'Accept emails' },
      update: 'Edit',
      no: 'No',
      yes: 'Yes',
    },
    regularizeBalance: 'Complete payment',
    cashoutBalance: 'Cashout balance',
    merge: 'Merge',
    forms: {
      merge: {
        confirmation: {
          confirm: 'Confirm',
          title: 'Are you sure to merge members?',
          mergeIsPermanentWarning:
            'Merging members will transfer the internal balance, reservations, passes, notes and invoices. <strong>This action cannot be undone once confirmed.</strong>\n\n Only the tags of the deleted member will not be transferred. A message will be sent to both email addresses to notify the members.',
          willNotifyInfo:
            'These profiles will be merged across the entire franchise. This action can take some time, we will notify you once completed.',
        },
        seeMemberPage: ' See member page',
        success: 'Members merged',
        error: 'Impossible to merge members',
        srcMember: 'This account will be merged and deleted',
        dstMember: 'This account will be saved',
        title: 'Merge members',
        explainCredit: 'The internal credit balance will be transferred',
        explainBookingsAndPassAndInvoiceAndNotes:
          'Bookings, passes, notes and invoices will be transfered.',
        explainTags: 'Tags from the deleted member will not be transferred',
        cancel: 'Cancel',
        submit: 'Merge',
        emailWillBeSend:
          'A message will be sent to both email addresses to notify the members.',
      },
      error: 'Unable to save member',
      create: { success: 'Member added', title: 'New member' },
      update: { success: 'Member details updated', title: 'Update member' },
      phone: { error: 'Invalid phone number' },
      needInformationValidation: {
        button: { memberOfCompany: 'Complete', notMemberYet: 'Submit' },
        legend: {
          memberOfCompany:
            'Please complete the required information to continue browsing.',
          notMemberYet:
            'Have you completed this information correctly and would you like to complete the sign up process? ',
        },
        subtitle: {
          memberOfCompany: 'Please complete the following form.',
          notMemberYet:
            'Looks like this will be your first time visiting our studio.',
        },
        welcome: 'Hello {{- firstname }}',
      },
      title: '[Form] Sign up',
      newMemberOnlyHelperText:
        "Members are considered 'new' as long as they haven't made a purchase greater than €0. Please note, if a member buys a product with 100% discount, this will count as a purchase.",
    },
    user: {
      existsWithEmail:
        'A user with the email address {{email}} already exists.',
      existsWithPhone:
        'A user with the phone number {{phonenumber}} already exists.',
      existsWithPhoneButNotConfirmed:
        'A user with phone number {{phonenumber}} already exists, but the email address ({{email}}) still needs to be confirmed. By registering this user, the email address will be automatically verified.',
      existsWithEmailButNotConfirmed:
        'A user with the email address {{email}} already exists, but still needs to be confirmed. By registering this user, the email address will be automatically verified.',
    },
    member: {
      existsWithEmail: 'A member with email address {{email}} already exists.',
      existsWithPhone:
        'A member with phone number {{phonenumber}} already exists.',
      existsWithPhoneButNotConfirmed:
        'A user with phone number {{phonenumber}} already exists, but the email address ({{email}}) still needs to be confirmed. By registering this user, the email address will be automatically verified.',
      existsWithEmailButNotConfirmed:
        'A user with the email address {{email}} already exists, but still needs to be confirmed. By registering this user, the email address will be automatically verified.',
    },
    exists: {
      goTo: 'See member',
      linkUser: 'Link user',
      merge: 'Merge',
      quicksale: 'Select this member',
    },
    linkDialog: {
      title: 'Linking account',
      content:
        "This account was initially created with another studio. Now it'll be connected to the currently selected studio.",
      cancel: 'Cancel',
      confirm: 'I confirm',
    },
    paymentAction: { toSubscribe: 'Subscribe', toBill: 'Bill' },
    pastBooking: 'last: ',
    table: { show: 'Show' },
    name: 'Name',
    barcode: {
      display: 'Show bar code',
      code: 'Bar code',
      none: 'none',
      label: 'Barcode',
    },
    birth: {
      unknown_F: 'Born on -',
      unknown: 'Born on -',
      bornIn_F: 'Born on {{-date}} ({{age}})',
      bornIn: 'Born on {{-date}} - {{age}} years old',
    },
    search: { cancel: 'Close', createMember: 'Add a member' },
    memberTermsAccepted: ' were accepted on {{- date}}.',
    termsAndConditions: 'The General Terms & Conditions',
    applyBalanceToUnpaidInvoices:
      "Use the member's account balance to regularize unpaid invoices",
    adjustBalance: 'Adjust balance',
    unpaidInvoiceTitle: 'Unpaid invoice',
    unpaidInvoiceTitle_plural: 'Unpaid invoices',
    vaccinationStatus: {
      unknown: 'Unknown status for the COVID-19 Sanitary Pass',
      notDone: "I'm not in possession of a valid COVID-19 Sanitary Pass",
      done: "I'm in possession of a valid COVID-19 Sanitary Pass",
    },
    signedUpWithReferral:
      "Member signed up with <1>{{- name }}</1>'s referral link",
    archive: {
      dialog: {
        actions: { confirm: 'Confirm', close: 'Close' },
        warning: {
          0: 'Negative internal account balance',
          1: 'Unpaid invoice(s)',
          2: 'Current subscription',
          3: 'Subscriptions with automatic renewals',
          4: 'Future bookings',
          5: 'Recurring bookings',
          6: 'Scheduled appointments',
          general:
            "Based on the following criteria, we advise that you regularize your member's internal account balance before the member is archived:",
        },
        helper_text_2: 'This member will no longer appear in your database.',
        helper_text_1: 'Are you sure that you want to archive this member?',
        title: 'Archive a member',
      },
      archivedMember: 'Archived member: {{- name}}',
    },
    archived: 'Archived',
    restoreMember: 'Restore',
    termsOfUse: 'The Terms of Use',
    noMember: 'There are no members to display.',
    noData: 'There are no members to members to display in this Smartlist.',
    changeEmailRequest: {
      memberPage: {
        simpleEmailChange: {
          error: {
            delayExceeded: {
              contactCompany:
                'Please contact the studio directly to change your login email address again.',
              helper:
                '{{- company }} had sent you a validation email to confirm the request to change your login email address. These requests are valid for 7 days and has now been expired.',
              title: 'Changing your login email address',
            },
            emailTaken: {
              contactCompany:
                'An account using "{{ email }}" as login email address has already been created. Please contact the studio directly for assistance, should this email address belong to you but if you didn\'t create any account with this email address.',
              helper:
                '{{- company }} requested to change the login email address of your account:',
              title: 'This email address is already in use.',
            },
            renewed: {
              contactCompany:
                "Please contact your studio directly if you didn't receive or can't find the most recent request validation email.",
              helper:
                'Recently, {{- company }} had sent you a validation email to change your login email address. Please check your inbox and spam for the latest request, as this one is now invalid.',
              title: 'Changing your login email address',
            },
            alreadyDenied: {
              currentEmail: 'Current login email address: "{{ email }}"',
              contactCompany:
                "Please contact your studio directly if you didn't initiate the request to change your login email address.",
              title: "You've already rejected this request.",
              helper:
                'You have already selected a login email at {{- company }}, your decision has been taken into account.',
            },
            alreadyAccepted: {
              currentEmail: 'Current login email address: "{{ email }}"',
              contactCompany:
                "Please contact your studio directly if you didn't initiate the request to change your login email address.",
              title: "You've already validates this request.",
              helper:
                'You already selected a login mail in {{- company }}, your decision has been taken into account.',
            },
          },
          submit: {
            emailPreservedTo:
              'Your current email address to log in will remain "{{ email }}".',
            emailUpatedTo:
              'Your email address to log in has been changed to "{{ email }}".',
            deniedTitle: 'Email address remains the same',
            acceptedTitle: 'Email address has been changed',
          },
          multipleCompanyHelper:
            "This email address is used for all your accounts associated with studios using BSPORT Solution, meaning that the changes will be applied with every studio that you've signed up with that's affiliated with our software solution. Your login will be changed with the following studios:",
          deniedRequestHelper:
            'Select "Use current email address" if you don\'t wish to process any changes.',
          acceptRequestHelper:
            'Click on "Confirm my new email address" to process the email change request.',
          title: 'Changing your login email address',
        },
        unAuthorizedAccess: {
          contactCompany:
            "Please contact the studio directly if you're unable to complete this request.",
          title: 'Unauthorized access',
          helper:
            'You are not logged in to the account that can access this application, please log in to the account associated with the confirmation email sent.',
        },
        generalError: {
          contactCompany:
            "An error with the current request has been detected. This request has been disabled as a security measure. Please contact the studio directly to renew this process of if you're not the initiator of this reques.",
          helper:
            '{{- company }} requested to change the login email address of your account:',
          title: 'Change an invalid login email address',
        },
        requestingStudio:
          '{{- company }} requested to change the login email address of your account:',
        actions: {
          continue: 'Continue',
          confirmFusion: 'Accept account merger',
          deniedFusion: 'Refuse account merger',
          cancel: 'Use my current email address',
          confirm: 'Confirm my new email address',
        },
        linkAccount: {
          error: {
            accepted: {
              contactCompany:
                "Please contact the studio directly if you wish to merge your accounts or if you didn't initiate this request.",
              helper: 'Current login email address: "{{ email }}"',
              title: 'Merger has been accepted',
            },
            denied: {
              contactCompany:
                'Please contact the studio directly if you wish to merge your accounts again.',
              helper:
                "You've already rejected the merger request from {{- company }}.",
              title: 'Merger has been rejected',
            },
          },
          submit: {
            denied: {
              content:
                'Your account hasn\'t been merged with "{{ new_email }}". Use your current login details associated with "{{ old_email}}" for your account.',
              title: 'Merger has been rejected',
            },
            accepted: {
              title: 'Merger has been accepted',
              content:
                'Your account has been successfully merged with "{{ old_email }}". You\'ve been registered with {{- company }} and you can use the login details associated with "{{ new_email }}" from now on.',
            },
          },
          dstUser: {
            deniedRequestHelper:
              "Please select \"Refuse account merger\" if you don't wish to process this request or if you're not the initiator. This won't merge your accounts and you won't be registered with {{- company }}.",
            acceptRequestHelper:
              'Click on "Accept account merger" to merge your accounts.',
            notMemberYet:
              'You don\'t have an account yet with {{- company }}. Merging the accounts will result in all information from your previous email address ("{{ old_email }}") being transferred to your new email address ("{{ new_email }}"). You can use these login details for any studio.',
            requestingStudio:
              '{{- company }} requested to merge your old login email address ("{{ old_email }}") with your new login email address ("{{ new_email }}").',
          },
          veto: {
            deniedRequestHelper:
              "Please go to your account and click on \"Refuse the merger\" if you don't wish to merge the accounts or if you didn't initiate this request. You can keep using your current login details and you'll prevent the merger of the accounts.",
            acceptRequestHelper:
              'Please log in with {{ email }} to confirm the merging of your accounts.',
            requestExplanation:
              'This email address "{{ email }}" is already is use at another studio. {{- company }} has requested your account with this existing account. By merging the two accounts, you can use the login details (email and password) of the account associated with the account of {{ email }}. You can use these login details for any studio using our software solution.',
          },
          title: 'Merging accounts',
        },
      },
      dialog: {
        newEmail: 'New email address: "{{ email }}"',
        oldEmail: 'Previous email address: "{{ email }}"',
        actions: { confirm: 'Confirm', close: 'Cancel' },
        cancelHelperText:
          'Click "Cancel" to stop the process for the email change.',
        securityHelperText:
          'A confirmation email will be sent for security reasons to this address.',
        expiryText:
          'The request will be processed within 7 days after sending.',
        mergeMember: {
          unchangedEmail:
            'Once confirmed, all invoices, bookings, balances, and purchases from the previous email address ("{{ old_email }}") will be transferred to the new email address ("{{ new_email }}"). The previous email address ("{{ old_email }}") will be deleted and both email addresses will be notified with an email.',
          warning: 'Warning, you try to link these members of your studio:',
        },
        linkMember: {
          notIncompany:
            'The new email address ("{{ new_email }}") belongs to a member of another studio.',
          unchangedEmail:
            'The previous email address ("{{ old_email }}") will be kept in the meantime.',
          warning: 'Warning, you try to link these members:',
        },
        simpleChange: {
          unchangedEmail: 'The previous email will be kept in the meantime.',
          warning: "Attention! You've changed the login email of:",
          informativeHelperText: 'A notification of the changes will be sent.',
        },
        titleMerge: ' Merge member accounts',
        title: 'Changing email address',
      },
      pendingValidation:
        'The request to change the email address "{{ email }}" is currently pending validation.',
    },
    actions: 'Actions',
    archiveMember: 'Archive',
    accountBalance: 'Balance',
    communication: 'Communication',
    events: {
      [MEMBER_EVENTS.basket_paid]: {
        filter: 'Basket paid',
        primaryText: 'Un basket of {{amount}} has been paid. ',
      },
      [MEMBER_EVENTS.booking_registered]: {
        primaryText:
          '{{ source }} has booked session {{- offerName }} the {{- offerDate }}.',
        sourceManager: 'The manager {{ managerName }}',
        filter: 'Bookings',
      },
      [MEMBER_EVENTS.booking_canceled]: {
        primaryText:
          'The booking for {{- name }} the {{- date_start }} was canceled.',
        filter: 'Booking cancelations',
      },
      [MEMBER_EVENTS.privatebooking_canceled]: {
        primaryText:
          'The appointment for {{- private_service_name}} - {{- private_slot_name }} the {{- date_start }} was canceled.',
        filter: 'Appointment cancelations',
      },
      [MEMBER_EVENTS.custom_form_filled]: {
        filter: 'Profile form edited',
        primaryText: 'Profile edit form {{- formName }} has been filled.',
      },
      [MEMBER_EVENTS.giftcard_used]: {
        filter: 'Giftcards used',
        primaryText: 'Giftcard {{- giftcardName }} has been activated.',
      },
      [MEMBER_EVENTS.invoice_paid]: {
        filter: 'Invoices paid',
        primaryText:
          'Invoice n°{{ invoiceUUID }} has been paid for {{ amount }}.',
      },
      [MEMBER_EVENTS.login_successful]: {
        filter: 'Logins successul',
        primaryText: 'A successful login {{ source }} has been registered.',
        sourceApp: 'from the mobile app',
        sourceMarketplace: 'from the web marketplace',
      },
      [MEMBER_EVENTS.private_booking_registered]: {
        primaryText:
          '{{ source }} has booked appointment {{- privateServiceName }} - {{- privateSlotName }} for {{- privateServiceDate }}.',
        filter: 'Appointment',
        sourceManager: 'The manager {{- managerName }}',
      },
      [MEMBER_EVENTS.tag_applied]: {
        filter: 'Tags applied',
        primaryText: 'The tag {{- tagName }} has been applied.',
      },
      [MEMBER_EVENTS.vod_bought]: {
        filter: 'VOD bought',
        primaryText: 'The VOD {{- VODName }} has been bought.',
      },
    },
    resetPassword: {
      dialogTitle: 'Reset password',
      dialogContent:
        'You are going to send password reset instruction to {{memberEmail}}',
      confirmation: 'Instructions sent to {{memberEmail}}',
      error: 'Error while sending password reset instructions',
      button: 'Reset the password',
    },
    memberTable: { error: 'An error has occurred' },
    membershipNumber: { value: 'Number {{id}}', label: 'Membership number' },
    officialIdNumber: {
      value: 'Number {{id}}',
      label: 'ID number',
    },
  };
};

exports.default = getTranslations();
