// @flow

export default {
  rules: 'Rules',
  add: 'Add',
  save: 'Save',
  name: 'Name',
  base_price: 'Base',
  only_attendant: 'Count only attendants',
  actions: 'Actions',
  bookingThreshold: 'Threshold',
  pricePerAdditionalBooking: 'Bonus per booking',
  addBonus: 'Add rule',
  cancel: 'Cancel',
  addNew: 'New payment configuration',
  select: {
    placeholder: 'Select a payment configuration',
    placeholderOverride: 'Coach default rule',
  },
  common: {
    from: 'From',
    until: 'Until',
  },
  calculate: 'Compute',
  title: 'Coach payment for {{name}}',
  label: 'Payment rate',
  update: {
    success: 'Payment configuration updated',
    error: 'Error during update',
  },
  dateTitle: 'Period',
  coaches: 'Coaches',
  setPaymentRuleSetForCoachFirst:
    'You need to attribute a payment rate to the coach before.',
  modal: {
    delete: {
      title: 'Remove a payment rate',
      cancel: 'Cancel',
      confirm: 'Confirm',
      content:
        'If you remove this rate, this rate will be removed from all related sessions and coaches.',
    },
  },
  create: {
    error: 'Error during creation',
    success: 'Rate added',
  },
  delete: {
    error: 'Error during deletion',
    success: 'Rate removed',
  },
};
