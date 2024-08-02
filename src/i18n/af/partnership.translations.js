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
  wellhub: {
    title: 'Wellhub',
    configuration: {
      dialog: {
        title: {
          creation: 'Add and link Unit ID with establishment(s)',
          edition: 'Edit Unit ID',
          deletion: 'Delete Unit ID',
        },
        field: {
          unitId: {
            placeholder: 'Unit ID number',
            error: {
              required: 'Unit ID is required',
              positive: 'Unit ID must be a positive number',
            },
          },
          establishmentIds: {
            placeholder: 'Link your bsport establishment(s)',
            title: 'Establishments',
            error: {
              required: 'Please select at least one establishment',
            },
          },
        },
        action: {
          back: 'Back',
          cancel: 'Cancel',
          confirm: 'Confirm',
          save: 'Save',
        },
        unlink: {
          title:
            'You are about to unlink one or several establishments from Wellhub',
          text: 'Upcoming sessions linked to those establishments will be deleted on Wellhub, and any Wellhub bookings will be lost',
        },
      },
      panel: {
        header: {
          subtitle: 'Link your sessions on bsport account with Wellhub',
        },
        content: {
          title: 'Unit ID connection',
          helperText:
            "First, request the integration with bsport on Wellhub's Partners Portal, for each Unit",
          table: {
            column: {
              unit: 'Unit ID',
              establishments: 'Establishments',
            },
          },
        },
        footer: {
          addUnitButton: 'Add Unit ID',
        },
      },
    },
    snackbar: {
      configureWebhooks: {
        error: 'An error occurred during the configuration',
        success: 'Your unit ID has been successfully linked',
      },
    },
  },
};
