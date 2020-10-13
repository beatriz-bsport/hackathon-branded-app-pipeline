const {
  EMAIL_RECIPIENT_DELIVERED,
  EMAIL_RECIPIENT_DEFERRED,
  EMAIL_RECIPIENT_DROPPED,
  EMAIL_RECIPIENT_PROCESSED,
  EMAIL_RECIPIENT_PENDING,
  EMAIL_RECIPIENT_BOUNCED,
} = require('@bsport/common/lib/master-data/recipient-status');

exports.default = {
  table: {
    columns: {
      member: 'Member',
      title: 'Preview',
      date_created: 'Date',
      status: 'Status',
    },
  },
  mail: {
    dialogTitle: 'Communication',
    contentSms: 'Sms content',
    mailMissing: 'Missing email',
    phoneMissing: 'Missing pgone number',
    numberSms: 'sms',
    title: 'Mail object',
    content: 'Mail content',
    missing: 'Missing email',
    success: 'Mail sent',
    writeMail: 'Write an email',
    selectTemplate: 'Select a template',
    noMailAvailable: 'No mail available, think about creating one',
    count: 'caracters',
    selectToShowPreview: 'Select a mail to show preview',

    mailSelection: 'Select mail',

    showMail: 'See mail',
    hideMail: 'Hide mail preview',

    error: 'Mail not sent',
    refreshTextPhone: 'Please refresh page to integrate phone number change',
    refreshText: 'Please refresh page to integrate email change',
    noObject: 'No object',
  },
  recipients: 'Recipients',
  common: {
    cancel: 'Cancel',
    submit: 'Submit',
    refresh: 'Refresh',
  },
  dialogReceiverChoice: {
    reservation: 'Send to bookings',
    waitingList: 'Send to waiting-list',
    title: 'Selection of recipients',
  },
  campaign: {
    recipientCount: 'Recipient: {{ total_recipients }}',
    sentAt: 'Sent at {{ date_created }}',
    readCount: 'Opens',
    clickCount: 'Clicks',
    showReport: 'Report',
    list: {
      showMore: 'Show more',
    },
    report: {
      totalRead: 'Opens',
      totalClick: 'Clicks',
      deliveryRate: 'Successful delivery',
      lastOpen: 'Last open',
      dateCreated: 'Send date',
      topLinks: 'Top links',
      recipientList: 'Recipient Detail',
      noTopLink: 'No click',
    },
  },
  recipient: {
    readCount: 'Open',
    clicksCount: 'Click',
    showEmail: 'Show email',

    status: {
      [EMAIL_RECIPIENT_DELIVERED]: 'Delivered',
      [EMAIL_RECIPIENT_DEFERRED]: 'Deferred',
      [EMAIL_RECIPIENT_DROPPED]: 'Dropped',
      [EMAIL_RECIPIENT_PROCESSED]: 'Processing',
      [EMAIL_RECIPIENT_PENDING]: 'Processing',
      [EMAIL_RECIPIENT_BOUNCED]: 'Bounced',
    },
    table: {
      columns: {
        email: 'Email',
        readCount: 'Opens',
        lastRead: 'Last open',
        clicked: 'Clicks',
        status: 'Status',
      },
    },
  },
};
