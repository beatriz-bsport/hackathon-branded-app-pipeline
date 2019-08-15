export default {
  userRoles: 'Comptes Staff',
  permissions: 'Rôles disponibles',
  forms: {
    user: {
      create: {
        buttonLabel: 'Ajouter un accès',
        title: 'Création de compte staff',
        email: {
          label: 'Email',
        },
        role: {
          label: 'Role',
        },
        cancel: 'Annuler',
        submit: 'Enregistrer',
      },
      delete: {
        title: 'Suppression compte staff',
        content: 'Êtes-vous sûr de vouloir supprimer ce compte ?',
        cancel: 'Annuler',
        confirm: 'Supprimer',
      },
      snackbar: {
        success: 'Autorisations modifiées',
        error: 'Impossible de modifier cette autorisation',
      },
    },
  },
};
