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
};
