const {
  MULTIPLE_MERGE_MODE,
  SIMPLE_MULTIPLE_MODE,
  OVERRIDE_MODE,
} = require('../../libs/partnership/utils.tsx');

exports.default = {
  parameters: {
    enabled: 'Enabled',
    allEstablishment: 'All establishments',
    add: 'Add',
    configurationTitle: 'Configure your integration',
    establishment: 'Establishment',
    pleaseChoseEstablishmentMany: 'Please select at least one establishment.',
    pleaseChoseEstablishment: 'Please select an establishment.',
    venueIds: 'Venue IDs: {{ establishmentIdList }}',
    partnerId: 'Partner ID: {{ company }}',
    establishmentMergedAs: 'Merge these establishments',
    establishmentMergeMaster: 'Merge into this establishment:',
  },
  requestDialog: {
    explain:
      "You've requested the ClassPass integration with BSPORT. Your Account Manager will shortly contact you to validate this request.",
    close: 'OK',
  },
  actions: { save: 'Save', requestPartnership: 'Enable the integration' },
  pageTitle: 'Partnership',
  configurationType: {
    [SIMPLE_MULTIPLE_MODE]: {
      helperText:
        'Each location will appear as an independent location on ClassPass.',
      label: 'Independent establishments',
    },
    [OVERRIDE_MODE]: {
      helperText:
        'All merged establishments will appear as a single establishment.',
      label: 'Merge all establishments',
    },
    [MULTIPLE_MERGE_MODE]: {
      helperText: 'Group similar establishments by address.',
      label: 'Advanced',
    },
  },
};
