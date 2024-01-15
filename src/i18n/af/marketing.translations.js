const {
  ONLY_EVENT_TRIGGER,
  ONLY_SMARTLIST_FILTERING,
  EVENT_TRIGGER_AND_SMARTLIST_FILTERING,
  ONLY_TIMEOUT,
} = require('../../libs/sequential_marketing/constants/translations.ts');

exports.default = {
  newsletter: {
    messages: {
      success: 'Saved !',
      error: 'Impossible to save your email address for the moment',
    },
    form: {
      validate: 'Send',
      lastName: 'Last name',
      firstName: 'First name',
      email: 'Email address',
      title: 'Sign up for our newsletter below to receive relevant updates.',
    },
    formV2: {
      validate: 'Submit',
      email: 'Email',
      title: 'Subscribe to our newsletter',
      subtitle: 'Get exclusive offers and hear about our latest news',
      error: {
        emailRequired: 'Please enter an email address.',
        invalidEmail: 'Please enter a valid email address.',
      },
    },
  },
  notifications: {
    selectNotificationRules:
      'Select a notification to display more information.',
    createNotificationFabLabel: 'Add a notification',
    notificationsEmpty:
      'There are no automatic notifications set up for this group to display.',
    deleteDialogText:
      "Are you sure that you want to delete this rule? This operation can't be undone.",
    deleteDialogTitle: 'Delete this rule',
    removeRule: 'Delete rule',
    editRule: 'Edit rule',
    paymentPackKind: { credit: 'Credits', validity: 'Validity' },
    groupTitle: {
      paymentPack: 'Passes',
      privateBooking: 'Appointments',
      booking: 'Group activities',
      privatePass: 'Appointment passes',
      birthday: 'Birthday',
      contract: 'Subscription',
    },
    fabLabels: {
      private_service: 'Appointments',
      payment_pack: 'Passes',
      establishment: 'Establishments',
      meta_activity: 'Group activities',
      workshop: 'Workshops',
      private_pass: 'Appointment passes',
      birthday: 'Birthday',
      establishmentGroup: 'Location',
      contract: 'Subscription',
    },
    cancel: 'Cancel',
    next: 'Next',
    paymentPackPlaceholder: 'Passes',
    selectIdentifierLabel: {
      payment_pack: 'Select a pass',
      private_service: 'Select an appointment',
      establishment: 'Select an establishment',
      meta_activity: 'Select an activity',
      workshop: 'Select a workshop',
      private_pass: 'Select an appointment pass',
      establishment_group: 'Select a location',
      contract: 'Select a subscription',
    },
    createNotification: '[Form] Notification',
    stats: {
      total_mail_opened: 'Number of opened emails',
      opened_rate: 'Open rate',
      total_mail_send: 'Sent emails',
    },
    mail: 'Email ',
    notificationDetails: 'Overview',
    mailTitle: 'Preview',
    statisticDetails: 'Statistics',
    notificationPreview: 'Overview',
    privatePassPlaceholder: 'Appointment passes',
    dialogTitle: 'Add a notification',
    listTitle: 'Notifications',
    create: 'Add a notification',
    handleNotification: 'Notification',
    noNotification: 'There are no activated notifications to display.',
    contractKind: {
      contractStart: 'Start of subscription',
      contractEnd: 'End of subscription',
    },
  },
  customForm: {
    field: {
      paragraph: 'Text',
      choice_warning:
        "All added fields before saving can no longer be edited. You'll still be able to delete fields or add new ones.",
      title: 'Title',
      short_answer: 'Short answer',
      long_answer: 'Long answer',
      radio: 'Multiple choice',
      check_box: 'Checkboxes',
      select: 'Dropdown list',
      select_placeholder: 'Select',
      file: 'Add a document',
      fileHelper:
        'Uploaded files will be added to the "Documents" section of your members\' accounts.',
      link_to_note: 'Add a note',
      link_to_note_helper:
        'Linking questions to notes will automatically add your members\' answers to the "Notes" section of their profiles.',
      text_size_limit: 'Maximum response length: {{count}} characters.',
      signature: 'Signature',
      link_to_tag_popover: 'Link a tag to this option',
      tag_group: 'Main Tag',
      tag_name: 'Sub Tag',
      isMandatoryOnSignUp: 'This field is mandatory upon sign up',
      accept_sms: "I'd like to receive relevant communication by SMS",
      accept_email: "I'd like to receive relevant communication by email",
      waiver: 'Liability waiver',
      repeatPassword: 'Confirm password',
      general_terms_and_conditions: 'I accept the General Terms of Use.',
      country: 'Country',
      city: 'City',
      additional_adress: 'Additional address information',
      password: 'Password',
      phone: 'Phone',
      email: 'Email address',
      vaccination_status: 'COVID-19 Sanitary Pass Status',
      emergency_contact: 'Emergency contact',
      photo: 'Profile picture',
      zipcode: 'Postal code',
      gender: 'Sex',
      address_line_2: 'Address line 2',
      address_line_1: 'Address line 1',
      birthday: 'Date of birth',
      last_name: 'Last name',
      first_name: 'First name',
      sign_up_question: 'Sign up form questions',
      location: 'Favourite location',
      state: 'State',
      official_document_id: 'Identity number',
    },
    title: 'Forms',
    CustomFormLink: 'Direct link to this form',
    linkHelper: 'Send the following link directly to your members:',
    search: 'Search a form',
    name: 'Name',
    content: 'Content',
    preview: 'Preview',
    label: 'Label',
    kind: 'Type',
    save: 'Save',
    cancel: 'Cancel',
    send: 'Send',
    mandatory: 'Obligatory',
    numberQuestions: 'Questions',
    listActions: 'Actions',
    disabledCustomForm: 'Archived forms',
    disabledCustomFormField: 'Archived fields',
    noCustomForm:
      'Use forms to gather more detailed information of your members.',
    addCustomFrom: 'Add a form',
    selectCustomForm: 'Select a form for a more detailed overview.',
    selectCustomFormFilled: 'Select a form to see its content.',
    emptyCustomForm: 'This form has no fields to display.',
    addFieldLong: 'Add a field',
    unaccessibleForm:
      'This form is currently inaccessible. Please click on the link below to return to your profile.',
    backToUserSpace: 'My account',
    changesDetected: 'Save this form to apply the changes.',
    noChanges: 'This form is up to date.',
    actions: {
      configure: 'Configure',
      statistics: 'Statistics',
      customization: 'Personalization',
    },
    modal: {
      delete: {
        title: 'Archive form',
        cancel: 'Cancel',
        confirm: 'Confirm',
        content:
          "Archiving this form while move it to your archived forms tab. Members won't be able to access it anymore.",
      },
    },
    tab: {
      general: 'Content',
      campaign: 'Campaign',
      statistics: 'Statistics',
      layout: 'Personalization',
    },
    customFormField: {
      modal: {
        disable: {
          title: 'Delete field',
          cancel: 'Cancel',
          confirm: 'Confirm',
          content:
            "Deleting this field, it'll be moved to your archived fields and your members won't be able to see it anymore.",
        },
        add: {
          title: 'Field form',
          addField: 'Add ',
          select: 'Select a field',
          option: 'Add field',
          confirm: 'Confirm',
          cancel: 'Cancel',
        },
        error: {
          choicesLength: 'You must select at least two fields',
          emptyChoice: "Fields can't be empty",
          signupQuestionShouldBeSelected:
            ' You must select a question from the sign up form',
          tooShort: 'A password must be at least 8 characters',
          passwordsDontMatch: "These passwords don't match",
        },
        signature: {
          addSignature: 'Add signature',
          editSignature: 'Edit signature',
          clear: 'Clear signature',
          addSignatureHelper: 'Add your signature',
        },
      },
    },
    submit: {
      date_submitted: 'Date',
      dialog: {
        title: "We've received your form in good order! ",
        content: 'Thank you for your time and for filling out this form.',
        confirmButton: 'Continue',
      },
      errors: {
        requiredField: 'This field is mandatory.',
        requiredSignature: 'Your signature is required to complete this form.',
        requiredFile: 'Add a document',
        passwordConfirmationError: "These passwords don't match",
        invalidEmail: 'Invalid email',
        passwordMinimumRequirementsError:
          'Your password must contain at least 6 characters.',
        invalidOfficialDocumentId:
          'This field can only contain numbers and letters',
      },
    },
    statistics: {
      byMember: 'Individual information',
      table: {
        column: {
          member: 'Member',
          display_count: 'Opened',
          last_display_date: 'Last opened on',
          completed: 'Completed',
        },
        row: { no: 'No', yes: 'Yes' },
      },
    },
    allFieldDisabled: 'All questions have been archived.',
    answerForDisabledField: 'Archived questions',
    displayRule: {
      kind: {
        signUp: 'New members',
        connectionLabel: 'Member seniority (days)',
        connection: 'Current members',
        signUpAlreadyExists: ' Existing rule',
        connectionHelperText:
          "Only members who've been enrolled for at least {{count}} day(s) will receive this notification.",
      },
      empty: 'There are no notifications for this form.',
      addNewDisplayRule: 'Add a rule',
      header: 'Notifications',
      form: {
        dialog: {
          helperTextRegisteredMembers:
            'This form will appear as a pop-up on the marketplace and the widget for all relevant members.',
          subTitle: 'Which members do you want to target?',
          title: 'Display rules',
          snoozeOptionHelperText:
            'This form will reappear after having been snoozed for {{count}} hour(s).',
          snoozeOptionLabel: 'Snooze duration (in hours)',
          force_display:
            'Force the display of this form to members that completed this form previously as well',
          snoozeOption: 'Allow members to postpone the completion of this form',
          advancedOptions: 'Advanced settings',
          modify: 'Edit',
          cancel: 'Cancel',
          create: 'Add',
          helperTextNewMembers:
            'The form will appear as a pop-up on the marketplace and the widget after the sign up form.',
        },
        errors: {
          timedeltaBeforeDisplayMustBeGraterThanZero:
            'This value must be greater than 0.',
        },
      },
      forRegisteredMemberMinimal: '>{{ count }} day(s)',
      forRegisteredMember:
        'This form is for members that have already been enrolled {{ count }} day(s)',
      forNewMember: 'For new members',
      snoozeTime: 'Snoozed for {{ count }} hour(s)',
      unSnoozableMinimal: 'Obligatory',
      snoozableMinimal: 'Can be ignored',
      forcedDisplayMinimal:
        'Also display this form to members that have previously completed this form',
      unForcedModeMinimal:
        "Don't display this form to members that have previously completed this form",
      forbiddenForSignup:
        "This form can't be associated to the notification rules",
    },
    disconnect: 'Logout',
    resetSubmit: 'Edit my answers',
    allStepsCompleted: "You've completed all forms.",
    submitLater: 'Answer later',
    previous: 'Back',
    next: 'Next',
    navigateToMemberForm: 'Edit the member profile',
    signupFormHelper:
      'The mandatory questions of the sign up form must be editable by your members on their profile. These questions will be added automatically to the modification form and can be edited by members.',
    signUp: {
      helperMemberForm:
        "The modification form can be customized and will be shown on your members' profile page and allows them to add or edit their information.",
      helperSignup:
        "You can personalize your studio's sign up form with custom questions and fields.",
      signupFields: 'Form questions',
    },
    signUpInfoModal: {
      content:
        'The mandatory questions on the sign up form must be editable by members on their profile page. These questions have now been automatically added and can be edited on the modification form for member profiles. These are displayed/editable by default.',
      confirm: 'Continue',
      cancel: 'Cancel',
      title: 'Information',
    },
    memberFormHelper:
      "The mandatory questions of the sign up form are displayed and editable by default. These can't be deleted.",
    clientForms: {
      modify: 'edit',
      customize: 'Personalize',
      modification: 'Edit',
      signup: 'Sign up',
      preview: 'Overview',
    },
    editable: 'Editable',
    display: 'Show',
    navigateToSignup: 'Edit sign up form',
    memberFormTitle: 'Modification form',
    signupFormTitle: 'Sign up form',
    layout: {
      save: 'Save',
      redo: ' Reapply',
      reset: 'Reset',
      undo: 'Undo',
      editLayout: 'Edit layout',
      layoutUpdating: 'A backup is in progress',
      saveAndExit: 'Save & Close',
      layoutUpTodate: 'No recordings in progress',
    },
    editLayoutTitle: 'Edit layout',
    changesAreSubmitting: 'Form is being updated.',
    editLayoutSubtitle:
      "You've modified a form with a custom layout. Click here to review the display of your forms on varying screen sizes.",
    breakpoints: {
      lg: 'Large screen',
      md: 'Average screen',
      sm: 'Small screen',
      xs: 'Mobile',
    },
  },
  cadence: {
    form: {
      updateTitle: 'Editing the name of the cadence',
      trigger: {
        selectEvent: 'Select an event',
        selectSmartlist: 'Select a smartlist',
        helpers: {
          exitFail:
            'Define here the trigger that causes a member to be considered lost and to exit the cadence.',
          exitSuccess:
            'Define here the trigger that causes a member to be considered a winner and to exit the cadence.',
          step: 'Set the trigger for the next step here. Members will need to match the criteria below to proceed to the next step.',
          cadence:
            'Define the triggers for entering the cadence here. Members will need to match the criteria listed below to begin the marketing sequence.',
        },
        triggerTimeoutLabel: 'Trigger after',
        triggerTimeoutDays: 'day.',
        triggerTimeoutDays_plural: 'days.',
        trigger_timeout_explain_value_selected:
          'If the member is still present in the cadence after {{ days }} days then it will automatically be removed from the cadence and considered lost.',
        trigger_timeout_select_label: 'days maximum in the cadence',
        trigger_timeout_title: 'Time limit',
        select_marketing_actions_helper:
          'Select one or more actions to perform when a member is won. This option is facultative.',
        marketing_actions: 'Marketing actions',
        event_and_smartlist_helper:
          'Members will have to match the event and be part of the smartlist to get into the cadence',
        or_rule_between_triggers: 'Or',
        and_rule_between_triggers: 'And',
        rule_between_triggers: 'Rule between events',
        trigger_smartlist_kind_label: 'A smartlist',
        had_filtering_on_selected_event:
          'Filter the selected event with a smartlist',
        trigger_event_kind_label: 'An event',
        labels: {
          exitFail: 'The output of the rate as lost is done via :',
          exitSuccess: 'The output of the rate as won is done via :',
          step: 'The entry in this step is done via :',
          cadence: 'The entry in the cadence is done via :',
        },
        title: 'Triggers',
        event_or_smartlist_helper:
          'Members will have to match the event or be part of the smartlist to fit into the cadence',
      },
      win_step: 'Won',
      error: {
        triggerCannotBeEmpty: 'You have to select an input type.',
        minimumConnectedTrigger: 'You have to select at least one trigger.',
        maximumConnectedTrigger: 'You cannot set up more than five triggers.',
        timeoutMustBeStrictPositive: 'The time limit must be at least 1 day.',
      },
      marketing_action: {
        1: 'Email',
        2: 'SMS',
        3: 'Push notification',
        4: 'Tag',
        5: 'Email template',
        form: {
          helper:
            'Select one or more actions to perform when a member enters this stage. This option is facultative.',
          reset: 'Delete',
          submit: 'Validate',
        },
        defaultName: 'Name by default',
        select_tag: 'Select a tag',
      },
      event: {
        1: 'Pass',
        2: 'Appointment pass',
        3: 'Group activities',
        4: 'Attendance at group activities',
        5: 'Appointment',
        6: 'Cancellation of appointment',
        7: 'Creation',
        8: 'Add to the basket',
        9: 'Paid basket',
        10: 'Invoice created',
        11: 'Creation',
        12: 'Pause',
        13: 'Stop',
        14: 'Renewal',
        100: 'Purchase',
        101: 'Booking',
        102: 'Basket',
        103: 'Billing',
        104: 'Subscription',
        'billing_plan-renew': 'Renewal',
        'billing_plan-stop': 'Stop',
        'billing_plan-pause': 'Pause',
        'billing_plan-create': 'Creation',
        'invoice-create': 'Invoice created',
        'basket-finalize': 'Paid basket',
        'basket-additem': 'Add to the basket',
        'basket-created': 'Creation',
        'private_booking-cancel': 'Cancellation of appointment',
        'private_booking-create': 'Appointments',
        'booking-attendance': 'Attendance at group activities',
        'booking-create': 'Group activities',
        'private_consumer_pass-create': 'Appointment pass',
        'consumer_payment_pack-create': 'Pass',
      },
      exit: {
        exit_fail_label: 'Lost',
        exit_success_label: 'Won',
        title: 'Exit',
      },
      next: 'Next',
      previous: 'Previous',
      lose_step: 'Lost',
      entry_step: 'Entry',
      modify_name_label: 'Edit the name',
      cadenceNameLabel: 'Name of the cadence',
      cadenceStepHelper:
        'Set the name of the step here: this is where you will be able to see where the members are in the cadence.',
      cadenceStepNameLabel: 'Name of the step',
      cadenceStep: 'Step',
      title: 'Create a cadence',
      addACadence: 'Add a cadence',
      createCadenceHelper:
        'Thanks to the cadences, target the marketing actions you send to your members according to their behavior on the platform. Create a sequence of actions that your members must complete to obtain certain promotions or tags, for example.',
      edit: 'Edit',
      submit: 'Create',
      cancel: 'Cancel',
      delete: 'Delete',
      updateSubmit: 'Validate',
    },
    svgText: {
      action_name: "{ Nom de l'action marketing }",
      push_notification: 'Push notification',
      sms: 'SMS',
      email: 'Email',
      select_event: 'Select an event',
      marketing_actions: 'Marketing actions',
      triggers: 'Triggers',
    },
    graph: {
      alert: {
        switchToEditMode:
          'You are in view mode, click on EDIT to edit the cadence.',
        cadenceIsActive: 'Your cadence is ongoing, please pause it to modify.',
      },
      nodeElement: {
        deleteStep: 'Delete the step',
        cancelOnGoingCreation: 'Cancel the creation',
        edgeLabelForNodeCreation: 'Creating',
        addElement: 'Add a trigger',
        deleteTrigger: 'Delete the trigger',
      },
      tools: {
        showDisabledTriggers: 'Display disabled triggers',
        hideDisabledTriggers: 'Hide disabled triggers',
        hideControls: 'Hide the toolbar',
        showControls: 'Display the toolbar',
        hideMap: 'Hide the minimap',
        showMap: 'Display the minimap',
        centerView: 'Center the view',
      },
    },
    triggers: {
      smartlist: { label: 'Smartlist' },
      events: {
        label: 'Event',
        book_chip: 'Booking',
        purchase_chip: 'Purchase',
        billing_plan_chip: 'Subscription',
        invoice_chip: 'Billing',
        basket_chip: 'Basket',
      },
      timeout: {
        timeout_days_chip: '{{ count }} day',
        timeout_days_chip_plural: '{{ count }} days',
      },
      trigger: 'Trigger',
      exit: 'Exit',
      start: 'Entry',
      delete: 'Delete',
      changeKind: 'Change to',
      kinds: {
        [ONLY_EVENT_TRIGGER]: 'Event',
        [ONLY_SMARTLIST_FILTERING]: 'Smartlist',
        [EVENT_TRIGGER_AND_SMARTLIST_FILTERING]: 'Event & Smartlist',
        [ONLY_TIMEOUT]: 'Delay',
      },
    },
    cadenceCard: { lost: 'Lost', win: 'Won', outputRules: 'Output rules' },
    activate: {
      dialog: {
        cancel: 'Cancel',
        secondHelper: 'You will not be able to edit it while it is launched.',
        firstHelper: 'Do you want to launch the cadence?',
        title: 'Launch the cadence',
        confirmButton: 'Launch',
      },
      setupBeforeActivationHelper:
        'Finish setting up your cadence and create your first marketing action to launch your cadence.',
    },
    archive: {
      archivedHeader: 'Archived cadences',
      dialog: {
        confirm: 'Continue',
        cancel: 'Cancel',
        helper:
          'Members currently in the cadence will automatically exit it. This cadence will be archived but you can reactivate it later.',
        beingArchived: 'You are about to archive {{ name }}.',
        title: 'Delete a cadence',
        confirmButton: 'Archive',
      },
    },
    welcome: {
      dialog: {
        title: 'Welcome to {{ audienceCamelCase }}!',
        helper:
          "Let's begin setting up your {{ workflowLowerCase }} together! First, we'll define the rules for your members to enter the {{ workflowLowerCase }}. Next, we'll decide when your members are considered 'Won' or 'Lost' based on their actions.",
        confirm: 'Start',
        return: 'Go back',
      },
    },
    pause: {
      dialog: {
        title: 'Pause {{ workflowLowerCase }}',
        helper:
          'All member actions that happen during the pause will not be taken into account.',
        confirmButton: 'Pause',
      },
    },
    converStepToExit: {
      dialog: {
        confirmButton: 'Convert',
      },
    },
    deleteStep: {
      dialog: {
        confirmButton: 'Delete',
      },
    },
    howTo: {
      set_trigger_destination: '{{ index }}. Redirect to a marketing action',
      add_smartlist_filter: '{{ index }}. Filter on smartlists',
      add_trigger: '{{ index }}. Add branches',
      edit_event: '{{ index }}. Edit the event',
      add_event: '{{ index }}. Add an event',
      edit_marketing_action: '{{ index }}. Edit the marketing action',
      add_marketing_action: '{{ index }}. Add a marketing action',
      explain:
        'Edit the elements of the chart by clicking on them or create links between blocks by dragging and dropping.',
      title: 'How to edit your cadence',
    },
    cadenceIndexHelper:
      'The order of the cadences defines the order of priority: if a member can enter 2 different cadences, he will start with the highest in the list.',
    marketingElement: 'Marketing actions',
    triggerElement: 'Triggering element',
    cadenceParameters: 'Cadence parameters',
    exitEditModeLabel: 'Exit the editing mode',
    exitEditMode: 'End',
    editModeLabel: 'Switch to edit mode',
    editMode: 'Edit',
    shutOff: 'Pause',
    back: 'Back',
    steps: {
      defaultName: 'Autostep',
      actions: {
        convertIntoStep: 'Convert into step',
        convertIntoExit: 'Convert into exit',
        delete: 'Delete',
        edit: 'Edit',
        addNextStep: 'Add next step',
        nextStepTrigger: 'Trigger to next step',
      },
    },
    marketingAction: {
      addAction: 'Add an action',
    },
    trigger: {
      addTrigger: 'Add a trigger',
    },
    bubble: {
      convertIntoExit: { title: 'Exit', label: 'Consider the member as' },
      entryTrigger: {
        addTrigger: 'Add an input trigger',
        helperText:
          "First let's decide how your members are going to enter the {{ workflowLowerCase }}. Select one or mutiple events or smartlists, if the member corresponds to one of them, he/she will enter the {{ workflowLowerCase }}.",
        title: 'Entry criteria',
        editionHelper:
          "Edit the criteria for your members to enter the {{ workflowLowerCase }}. You can pick one or more events or smartlists. If a member fits any of these, they'll join the {{ workflowLowerCase }}.",
        creationHelper:
          "First, decide the criteria for your members to enter the {{ workflowLowerCase }}. Pick one or more events or smartlists. If a member fits any of these, they'll join the {{ workflowLowerCase }}.",
      },
      entryAction: {
        addAction: 'Add action',
        helperText:
          'Decide what happens when the members enter the {{ workflowLowerCase }}. You can tag them, send them an email, or choose any other action that suits your needs. You can also choose to do nothing; this step is optional.',
        title: 'Entry action',
      },
      wonTrigger: {
        addTrigger: 'Add an output trigger',
        helperText:
          "Set the basic rules for when members should exit the {{ workflowLowerCase }}. If a member meets any of the triggers, they'll exit, no matter the step they are in. First, select the 'success' triggers that will mark a member as 'Won' when they exit the {{ workflowLowerCase }}.",
        title: 'Won criteria',
      },
      wonAction: {
        addAction: 'Add action',
        helperText:
          "Decide what happens when the members leave the {{ workflowLowerCase }} as 'Won'. You can tag them, send them an email, or choose any other action that suits your needs. You can also choose to do nothing; this step is optional.",
        title: 'Won action',
      },
      lostTrigger: {
        timeout: {
          title: 'Time limit',
          label: 'Days in the {{ workflowLowerCase }}',
          helperText:
            "If a member is still present in this {{ workflowLowerCase }} after the selected time limit, the member will be considered as 'Lost'.",
        },
        addTrigger: 'Add an output trigger',
        helperText:
          "Define what is considered a failure, the member will be marked as 'Lost' upon leaving the {{ workflowLowerCase }}. Also set the maximum time a member can be present in the {{ workflowLowerCase }}.",
        title: 'Lost criteria',
      },
      lostAction: {
        addAction: 'Add action',
        helperText:
          "Decide what happens when the members leave the {{ workflowLowerCase }} as 'Lost'. You can tag them, send them an email, or choose any other action that suits your needs. You can also choose to do nothing; this step is optional.",
        title: 'Lost action',
      },
      convertIntoStep: { default: 'Step label', label: 'Step label' },
      marketingAction: {
        title: 'Marketing action',
        label: 'Select a marketing action',
      },
      delete: 'Delete',
      cancel: 'Cancel',
      confirm: 'Save',
      previous: 'Previous',
      next: 'Next',
      finish: 'Finish',
      step: { name: 'Name' },
      requiredField: 'This field is required to continue.',
    },
    step: {
      archive: {
        dialog: {
          title: 'Are you sure you want to delete this step?',
          helper:
            'The triggers directly linked to this step will be deleted as well. The rest of the {{ workflowLowerCase }} will be disconnected but not deleted.',
        },
      },
      convertExit: {
        dialog: {
          title: 'Convert this step into an exit',
          helper:
            'The triggers that directly follow this step will be deleted. The rest of the {{ workflowLowerCase }} will be disconnected but not deleted.',
        },
      },
    },
    dialog: {
      cancel: 'Cancel',
      confirm: 'Confirm',
      do_not_display_anymore: 'Do not display this message anymore.',
    },
  },

  audience: {
    form: {
      formTitle: {
        updateNameTitle: 'Edit the name of your {{ workflowLowerCase }}',
        createTitle: 'Create a {{ workflowLowerCase }}',
        updateTitle: 'Edit your {{ workflowLowerCase }}',
      },
      trigger: {
        helpers: {
          exitFail:
            'Define here the trigger that causes a member to be considered lost and to exit the {{ workflowLowerCase }}.',
          exitSuccess:
            'Define here the trigger that causes a member to be considered a winner and to exit the {{ workflowLowerCase }}.',
          workflow:
            'Define the triggers for entering the {{ workflowLowerCase }} here. Members will need to match the criteria listed below to begin the marketing sequence.',
        },
        trigger_timeout_explain_value_selected:
          'If the member is still present in the {{ workflowLowerCase }} after {{ days }} days then it will automatically be removed from the {{ workflowLowerCase }} and considered lost.',
        trigger_timeout_select_label:
          'days maximum in the {{ workflowLowerCase }}',
        event_and_smartlist_helper:
          'Members will have to match the event and be part of the smartlist to get into the {{ workflowLowerCase }}',
        labels: {
          workflow: 'The entry in the {{ workflowLowerCase }} is done via :',
        },
        event_or_smartlist_helper:
          'Members will have to match the event or be part of the smartlist to fit into the {{ workflowLowerCase }}',
      },
      audienceNameLabel: 'Name of the {{ workflowLowerCase }}',
      multipleVisit: {
        isMultipleVisitAllowedLabel:
          'Members can pass through this {{ workflowLowerCase }} multiple times.',
        helperText:
          "When activated, members matching entry criteria can enter this {{ workflowLowerCase }} multiple times, regardless of whether they previously exited it as 'lost' or 'win'.",
      },
      cadenceParameters: '{{ workflowLowerCase }} parameters',
      audienceStepHelper:
        'Set the name of the step here: this is where you will be able to see where the members are in the {{ workflowLowerCase }}.',

      addAWorkflow: 'Add a {{ workflowLowerCase }}',
      createAudienceHelper:
        'Thanks to the {{ workflowPluralLowerCase }}, target the marketing actions you send to your members according to their behavior on the platform. Create a sequence of actions that your members must complete to obtain certain promotions or tags, for example.',
    },
    graph: {
      alert: {
        switchToEditMode:
          'You are in view mode, click on EDIT to edit the {{ workflowLowerCase }}.',
        audienceIsActive:
          'Your {{ workflowLowerCase }} is ongoing, please pause it to modify.',
      },
    },
    activate: {
      dialog: {
        firstHelper: 'Do you want to launch the {{ workflowLowerCase }}?',
        title: 'Launch the {{ workflowLowerCase }}',
      },
      setupBeforeActivationHelper:
        'Finish setting up your {{ workflowLowerCase }} and create your first marketing action to launch your {{ workflowLowerCase }}.',
    },
    archive: {
      archivedHeader: 'Archived {{ workflowPluralLowerCase }}',
      dialog: {
        beingArchived: 'You are about to archive "{{ name }}".',
        helper:
          'Members currently in the {{ workflowLowerCase }} will automatically exit it. The {{ workflowLowerCase }} will be paused and archived, but you can easily reactivate it later.',
        title: 'Are you sure you want to archive the {{ workflowLowerCase }}?',
      },
    },
    block: {
      archived: {
        dialog: {
          title: '{{ workflowCamelCase }} archived',
          helper:
            'The {{ workflowLowerCase }} is now archived. To restore it, go back to the main page and unarchive the {{ workflowLowerCase }} from the list.',
        },
      },
      unrecognized: {
        dialog: {
          title: '{{ workflowCamelCase }} unrecognized',
          helper:
            'The {{ workflowLowerCase }} you are attempeting to access cannot be found.',
        },
      },
    },
    howTo: {
      title: 'How to edit your {{ workflowLowerCase }}',
    },
    audienceIndexHelper:
      'The order of the {{ workflowPluralLowerCase }} sets the order of priority: if a member can enter 2 different {{ workflowPluralLowerCase }} at the same time, they will start with the highest in the list.',
    workflowMetrics: {
      cards: {
        members: {
          title: 'Members',
          description:
            'Number of members that entered the {{ workflowLowerCase }}.',
          label: 'member entered',
          label_plural: 'members entered',
        },
        success: {
          title: 'Success',
          description: 'Percentage of people considered as won.',
          label: 'success rate',
        },
        averageTime: {
          title: 'Average time',
          description:
            'Average period of time needed for a member to be considered as won.',
          label: 'day on average',
          label_plural: 'days on average',
        },
        tags: {
          title: 'Tags',
          description:
            'Number of tags applied to the members in the {{ workflowLowerCase }}.',
          label: 'tag',
          label_plural: 'tags',
        },
      },
      communication: {
        title: 'Communications sent',
        knowMore: 'More information about {{ upsellName }} upsell',
        availableSoon: 'Available soon',
        email: 'Email',
        sms: 'SMS',
        pushNotif: 'Push notification',
      },
    },
    listItem: {
      labels: {
        metrics: 'Metrics',
        unarchive: 'Unarchive',
        active: 'Active',
        paused: 'Paused',
        notLaunched: 'Not launched',
        open: 'Open',
        archive: 'Archive workflow',
        edit: ' Edit workflow settings',
      },
      toolTip: {
        moreActions: 'More workflow actions',
      },
    },
    editModal: {
      dialog: {
        title: 'Edit workflow',
        helper:
          'Editing triggers can change the position of members in different steps.',
        checkboxLabel: 'Do not display this message anymore.',
        cancel: 'Cancel',
        confirm: 'Confirm',
      },
    },
    memberTable: {
      searchPlaceHolder: 'Search...',
      title: 'Members present in the {{ workflowLowerCase }} ({{count}})',
      historicTitle: 'Historic ({{count}})',
      tableColumnLabel: {
        member: 'Member',
        currentStep: 'Current step',
        entryDate: 'Entry date',
        exitDate: 'Exit date',
        status: 'Status',
      },
    },
  },
};
