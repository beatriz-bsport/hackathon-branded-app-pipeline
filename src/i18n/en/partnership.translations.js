export default {
  parameters: {
    companyId: 'Your partner ID is : {{ company }}',
    establishmentId: 'Your venue ID are : {{ establishmentIdList }}',
    enabled: 'Enabled',
    allEstablishment: 'All locations',
  },
  requestDialog: {
    explain:
      'You have request the integration bsport X classpass, your account manager will contact you shortly to validate this operation.',
    close: 'Understood',
  },
  actions: {
    save: 'Save',
    requestPartnership: 'Enable integration',
  },
};
