exports.default = {
  member: {
    item: {
      edit: 'Edit',
      delete: 'Delete',
    },
    list: {
      title: 'Relationship',
      isEmpty: 'No relationship created yet',
      pleaseSelectOne: 'Select a relationship to see shared pass',
      actions: {
        create: 'Create a relationship',
      },
    },
    form: {
      is: ' is ',
      src_name: {
        placeholder: 'Mother',
      },
      dst_name: {
        placeholder: 'Son',
      },
      title: 'Relationship',
      cancel: 'Cancel',
      submit: 'Save',
    },
    messages: {
      edit: {
        success: 'Relationship modified',
      },
      create: {
        success: 'Relationship saved',
      },
      createOrUpdate: {
        error: 'Impossible to save relationship',
      },
    },
  },
  consumer_payment_pack_links: {
    list: {
      title: 'Shared pass',
      create: 'Share a pass',
      isEmpty: 'No shared pass',
    },
    form: {
      create: {
        title: 'Share pass',
        explain:
          'This pass will be shared between the two member, they can both use the credits.',
        cancel: 'Cancel',
        previous: 'Previous',
        submit: 'Share',
        noConsumerPackToLink: 'No shareable pass',
        linkButton: 'Share',
      },
      relink: {
        title: 'Share again',
        explain: 'Sharing will be started again between the members',
        submit: 'Share',
        cancel: 'Cancel',
      },
      unlink: {
        title: 'Stop sharing',
        explain:
          'Sharing will be stopped. The master pass will still be usable',
        submit: 'Stop',
        cancel: 'Cancel',
      },
    },
    messages: {
      create: {
        success: 'Pass shared',
        error: 'Impossible to share this pass',
      },
      unlink: {
        success: 'Sharing stopped',
        error: 'Impossible to delete this sharing',
      },
      relink: {
        success: 'Pass shared',
        error: 'Impossible to share this pass',
      },
    },
  },
};
