// @flow

export default {
  pageTitle: 'Settings',
  tab: {
    general: 'General',
    paymentRules: 'Rates',
    notificationRule: 'Transactional emails',
    company: 'Company',
    invoice: 'Billing',
    waitingList: 'Waiting-list',
    shop: 'Shop',
    role: 'Staff',
    personalization: 'Personalization',
    webhook: 'Webhook',
    partnership: 'Partnership',
  },
  webhook: {
    messages: {
      form: {
        success: 'Webhook subscribed',
        error: 'Impossible to subscribe the webhook',
      },
    },
    cancel: 'cancel',
    submit: 'submit',
    createTitle: 'Form webhook',
    testSuccess: 'Correct Url',
    testError: 'Please verify url',
    add: 'Add a webhook',
    test: 'Test',
    event: 'Event',
    url: 'URL',
    selectEvent: 'Select an event',
    urlPlaceHolder: 'http://wwww.google.com',
    payload: 'Payload',
    urlHelper: 'Fill in url to send payload to',
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
  active_campaign: {
    submit: 'Submit',
    cancel: 'Cancel',
    account: {
      helpTitle: 'Where can I fin my account informations ?',
      helpContent:
        "Your url and your authentication token are accessible in your account settings, by clicking on 'developpment' tab.",
      title: 'Informations to access your ActiveCampaign API',
      dialogTitle: 'My ActiveCampaign API informations',
      token: 'Authentication key',
      error: 'Your informations are incorrect',
    },
    webhooks: {
      helpTitle: 'How is done synchronisation ?',
      helpContent:
        'These actions are triggered when the associated event is raised on ActiveCampaign',
      title: 'Push ActiveCampaign informations to bsport',
      CLIENT_WON:
        "Create a client account on bsport when for a propect which is statued as 'WON' on a deal",
      CONTACT_TAG:
        "Create a client account on bsport when for a propect which is taged as 'won' on ActiveCampaign",
    },
    link: {
      helpTitle: 'How is done synchronisation ?',
      helpContent:
        "Members of the smartlist are sent every night to the ActiveCampaign list. They appear as 'active'. Members who went out of the smartlist are pulled out of the ActiveCampaign list, their status is then 'unconfirmed'.",
      title: 'Sending informations from bsport',
      add: 'Add a link between lists',
      dialogTitle: 'Modify a link between lists',
      smartListSelection: 'Select a smartlist',
      listActiveCampaignSelection: 'Select an ActiveCampaign list',
      helperForm:
        'Select a bsport smartlist and link it to one of your ActiveCampaign lists',
      noList: 'LIST NOT FOUND',
      listItemText:
        'Send members of smartlist <1>{{smartlist}}</2> to ActiveCampaign <3>{{list}}</4> list',
    },
  },
};
