export default {
  userRoles: 'Staff accounts',
  permissions: 'Available roles',
  forms: {
    user: {
      create: {
        buttonLabel: 'Add an access',
        title: 'Add a staff user access',
        email: {
          label: 'Email',
        },
        role: {
          label: 'Role',
        },
        cancel: 'Cancel',
        submit: 'Save',
      },
      delete: {
        title: 'Staff user deletion',
        content: 'Are you sure you want to delete this staff account ?',
        cancel: 'Cancel',
        confirm: 'Delete',
      },
      snackbar: {
        success: 'Access rights modified',
        error: 'Impossible to modify access rights',
      },
    },
  },
};
